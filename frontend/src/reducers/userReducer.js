const userReducer = (state = {}, action) => {
  switch (action.type){
  case 'CREATE_USER':
    return action.data
  case 'DELETE_USER':
    return null
  default:
    return state
  }
}

export const userCreate = (data) => {
  return {
    type: 'CREATE_USER',
    data: data
  }
}

export const userDelete = () => {
  return {
    type: 'DELETE_USER',
  }
}


export default userReducer