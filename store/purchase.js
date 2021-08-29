export const state = () => ({
  purchases: [],
  deliveries: [],
})

export const getters = {
  getPurchases(state) {
    return state.purchases
  },
  getDeliveries(state) {
    return state.deliveries
  },
}

export const mutations = {
  setPurchases(state, purchases) {
    state.purchases = purchases
  },
  addPurchase(state, purchase) {
    state.purchases.push(purchase)
  },
  setDeliveries(state, deliveries) {
    state.deliveries = deliveries
  },
  addDelivery(state, delivery) {
    state.deliveries.push(delivery)
  },
  updatePurchase(state, purchase) {
    const existingDeliveryIndex = state.deliveries.findIndex(
      (item) => item.id === purchase.id
    )
    if (existingDeliveryIndex !== -1) {
      Object.assign(state.deliveries[existingDeliveryIndex], purchase)
    }

    const existingPurchaseIndex = state.purchases.findIndex(
      (item) => item.id === purchase.id
    )
    if (existingPurchaseIndex !== -1) {
      Object.assign(state.purchases[existingPurchaseIndex], purchase)
    }
  },
}
