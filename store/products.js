export const state = () => ({
  products: [],
  cart: [],
})

export const getters = {
  getCart(state) {
    return state.cart
  },
  getProducts(state) {
    return state.products
  },
}

export const mutations = {
  addToCart(state, product) {
    const existing = state.cart.findIndex((item) => item.id === product.id)
    if (existing !== -1) {
      state.cart[existing].unitary = product.price
      state.cart[existing].amount += 1
      state.cart[existing].price = product.price * state.cart[existing].amount
    } else {
      state.cart.push({
        amount: 1,
        unitary: product.price,
        ...product,
      })
    }
  },
  remove(state, id) {
    state.cart = state.cart.filter((item) => item.id !== id)
  },
  cleanCart(state) {
    state.cart = []
  },
  setProducts(state, products) {
    state.products = products
  },
  updateProduct(state, product) {
    const index = state.products.findIndex((item) => item.id === product.id)
    if (index !== -1) {
      Object.assign(state.products[index], product)
    }
  },
}
