export const state = () => ({
  cartMenu: false,
  mainDrawer: true,
  adminDrawer: false,
  mainDrawerMini: false,
  adminDrawerMini: true,
})

export const getters = {
  getCartMenu(state) {
    return state.cartMenu
  },
  getMainDrawer(state) {
    return state.mainDrawer
  },
  getAdminDrawer(state) {
    return state.adminDrawer
  },
  getMainMiniVariant(state) {
    return state.mainDrawerMini
  },
  getAdminMiniVariant(state) {
    return state.adminDrawerMini
  },
}

export const mutations = {
  setCartMenu(state, menu) {
    state.cartMenu = menu
  },
  setMainDrawer(state, drawer) {
    state.mainDrawer = drawer
  },
  setAdminDrawer(state, drawer) {
    state.adminDrawer = drawer
  },
  setMainMiniVariant(state, mini) {
    state.mainDrawerMini = mini
  },
  setAdminMiniVariant(state, mini) {
    state.adminDrawerMini = mini
  },
}
