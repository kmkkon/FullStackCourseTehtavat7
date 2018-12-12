const errorReducer = (state = null, action) => {
  switch (action.type) {
  case 'SET_ERROR':
    return action.message
  case 'EMPTY_ERROR':
    return null
  default:
    return state
  }
}

export const errorSet = (message) => {
  return {
    type: 'SET_ERROR',
    message: message
  }
}

export const errorEmpty = () => {
  return{
    type: 'EMPTY_ERROR'
  }
}

export default errorReducer