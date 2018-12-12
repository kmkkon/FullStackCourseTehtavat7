const notificationReducer = (state = null, action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    return action.message
  case 'EMPTY_NOTIFICATION':
    return ''
  default:
    return state
  }
}

export const notificationSet = (message) => {
  return {
    type: 'SET_NOTIFICATION',
    message: message
  }
}

export const notificationEmpty = () => {
  return{
    type: 'EMPTY_NOTIFICATION'
  }
}

export default notificationReducer