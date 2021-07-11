export const state = () => ({
  categories: [],
  allCategories: [],
})

export const getters = {
  getCategories(state) {
    return state.categories
  },
  getAllCategories(state) {
    return state.allCategories
  },
}

export const mutations = {
  setCategories(state, categories) {
    state.categories = categories
  },
  setAllCategories(state, categories) {
    state.allCategories = categories
  },
}
