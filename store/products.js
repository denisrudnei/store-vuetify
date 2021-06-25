export const state = () => ({
  products: [],
  cart: [],
})

export const getters = {
  getCart(state) {
    return state.cart
  },
}

export const mutations = {
  addToCart(state, product) {
    const existing = state.cart.findIndex((item) => item.id === product.id)
    if (existing !== -1) {
      state.cart[existing].unitary = product.price
      state.cart[existing].quantity += 1
      state.cart[existing].price = product.price * state.cart[existing].quantity
    } else {
      state.cart.push({
        quantity: 1,
        unitary: product.price,
        ...product,
      })
    }
  },
  remove(state, id) {
    state.cart = state.cart.filter((item) => item.id !== id)
  },
}
