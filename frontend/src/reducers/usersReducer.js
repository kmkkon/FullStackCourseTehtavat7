const usersReducer = (state = [], action) => {
  switch (action.type){
  case 'CREATE_USERS':
    return action.data
  default:
    return state
  }
}

export const usersCreate = (data) => {
  return {
    type: 'CREATE_USERS',
    data: data
  }
}


export default usersReducer