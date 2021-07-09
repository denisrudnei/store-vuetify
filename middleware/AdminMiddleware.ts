import { Middleware } from '@nuxt/types'

const AdminMiddleware: Middleware = ({ store, redirect }) => {
  if (store.state.auth.loggedIn) {
    if (store.state.auth.user.role !== 'ADMIN') {
      redirect('/')
    }
  } else {
    redirect('/auth/login')
  }
}

export default AdminMiddleware
