export const state = () => ({
  tables: [],
})

export const getters = {
  getTables(state) {
    return state.tables
  },
}

export const mutations = {
  setTables(state, tables) {
    state.tables = tables
  },
  updateTable(state, table) {
    const index = state.tables.findIndex((item) => item.id === table.id)
    if (index !== -1) {
      Object.assign(state.tables[index], table)
    }
  },
  addTable(state, table) {
    state.tables.push(table)
  },
}
