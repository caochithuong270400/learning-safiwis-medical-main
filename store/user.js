export const stateUser = () => ({
  editUserData: null,
  originalUserData: null,
})
export const mutations = {
  setUserData(stateUser, data) {
    stateUser.originalUserData = data
    stateUser.editUserData = Object.assign({}, data)
  },

  updateUserData(stateUser, field, value) {
    if (stateUser.editUserData) {
      stateUser.editUserData[field] = value
    }
  },
}
