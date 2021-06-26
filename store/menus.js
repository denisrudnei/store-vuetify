export const state = () => ({
  cartMenu: false,
})

export const getters = {
  getCartMenu(state) {
    return state.cartMenu
  },
}

export const mutations = {
  setCartMenu(state, menu) {
    state.cartMenu = menu
  },
}
