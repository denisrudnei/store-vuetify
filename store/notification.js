export const state = () => ({
  notifications: [],
  allNotifications: [],
})

export const getters = {
  getNotifications(state) {
    return state.notifications
  },
  getAllNotification(state) {
    return state.allNotifications
  },
}

export const mutations = {
  setNotifications(state, notifications) {
    state.notifications = notifications
  },
  setAllNotifications(state, notifications) {
    state.allNotifications = notifications
  },
  addNotification(state, notification) {
    state.notifications.push(notification)
  },
  readNotification(state, notification) {
    state.notifications = state.notifications.filter(
      (item) => item.id !== notification.id
    )
  },
}
