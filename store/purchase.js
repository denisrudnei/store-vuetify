export const state = () => ({
  purchases: [],
})

export const getters = {
  getPurchases(state) {
    return state.purchases
  },
}

export const mutations = {
  setPurchases(state, purchases) {
    state.purchases = purchases
  },
  addPurchase(state, purchase) {
    state.purchases.push(purchase)
  },
}
