export const state = () => ({
  cartMenu: false,
  mainDrawer: true,
})

export const getters = {
  getCartMenu(state) {
    return state.cartMenu
  },
  getMainDrawer(state) {
    return state.mainDrawer
  },
}

export const mutations = {
  setCartMenu(state, menu) {
    state.cartMenu = menu
  },
  setMainDrawer(state, drawer) {
    state.mainDrawer = drawer
  },
}
