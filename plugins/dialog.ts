import { Plugin } from '@nuxt/types'
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $dialog(message: string): Promise<void>
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $dialog(message: string): Promise<void>
  }

  interface Context {
    $dialog(message: string): Promise<void>
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $dialog(message: string): Promise<void>
  }
}

const dialog: Plugin = (context, inject) => {
  Vue.prototype.dialogBus = new Vue()
  inject(
    'dialog',
    (message: string) =>
      new Promise<void>((resolve, reject) => {
        context.store.commit('dialog/setMessage', message)
        context.store.commit('dialog/setDialog', true)

        Vue.prototype.dialogBus.$on('dialogUpdated', (value: boolean) => {
          context.store.commit('dialog/setMessage', '')
          context.store.commit('dialog/setDialog', false)

          if (value) return resolve()
          return reject(new Error('Canceled'))
        })
      })
  )
}

export default dialog
