const blogsReducer = (state = [], action) => {
  switch (action.type){
  case 'CREATE_BLOGS':
    return action.data
  default:
    return state
  }
}

export const blogsCreate = (data) => {
  return {
    type: 'CREATE_BLOGS',
    data: data
  }
}


export default blogsReducer