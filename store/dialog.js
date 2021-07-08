export const state = () => ({
  dialog: false,
  message: '',
})

export const getters = {
  getDialog(state) {
    return state.dialog
  },
  getMessage(state) {
    return state.message
  },
}

export const mutations = {
  setDialog(state, dialog) {
    state.dialog = dialog
  },
  setMessage(state, message) {
    state.message = message
  },
}
