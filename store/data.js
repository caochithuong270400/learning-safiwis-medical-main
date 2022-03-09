export const state = () => ({
  editData: null,
  originalData: null,
})

export const mutations = {
  setData(state, data) {
    state.originalData = data
    state.editData = Object.assign({}, data)
  },

  updateData(state, field, value) {
    if (state.editData) {
      state.editData[field] = value
    }
  },
}
