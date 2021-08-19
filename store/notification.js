export const state = () => ({
  notifications: [],
  allNotifications: [],
})

export const getters = {
  getNotifications(state) {
    return state.notifications
  },
  getAllNotifications(state) {
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
    const notificationIndex = state.allNotifications.findIndex(
      (item) => item.id === notification.id
    )
    if (notificationIndex !== -1) {
      Object.assign(state.allNotifications[notificationIndex], notification)
    }
    state.notifications = state.notifications.filter(
      (item) => item.id !== notification.id
    )
  },
}
