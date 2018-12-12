import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {createStore, combineReducers } from 'redux'
import {Provider} from 'react-redux'
import errorReducer from './reducers/errorReducer'
import notificationReducer from './reducers/notificationReducer'
import userReducer from './reducers/userReducer'
import usersReducer from './reducers/usersReducer'
import blogsReducer from './reducers/blogsReducer'

const reducer = combineReducers({
    error: errorReducer,
    notification: notificationReducer,
    user: userReducer,
    users: usersReducer,
    blogs: blogsReducer
  })
  
  const store = createStore(reducer)
  
    ReactDOM.render(
      <Provider store ={store}>
        <App/>
      </Provider>,
    document.getElementById('root'))
