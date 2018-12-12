import React from 'react'
import Blog from './components/Blog'
import User from './components/User'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import { userCreate, userDelete } from './reducers/userReducer'
import { errorSet, errorEmpty } from './reducers/errorReducer'
import { notificationSet, notificationEmpty } from './reducers/notificationReducer'
import { usersCreate } from './reducers/usersReducer'
import { blogsCreate } from './reducers/blogsReducer'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Container, Table, Form, Button, Menu, Header, Icon } from 'semantic-ui-react'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      author: '',
      title: '',
      url: ''
    }
  }

  componentDidMount() {
    const { store } = this.context
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    )
    blogService.getAll().then(blogs =>
      this.props.blogsCreate(blogs)
    )
    userService.getAll().then(users =>
      this.props.usersCreate(users)
    )
    const loggedUserJSON = window.localStorage.getItem('loggedBlogCollector')
    if (loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      this.props.userCreate(user)
      blogService.setToken(user.token)
    }
  }

  componentWillUnmount() {
    this.unsubscribe()
  }


  login = async (event) => {
    event.preventDefault()
    console.log('logging in')
    try {
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      })
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogCollector', JSON.stringify(user))
      this.setState({ username:'', password:'' })
      this.props.userCreate(user)
    } catch (error) {
      this.props.errorSet('käyttäjätunnus tai salasana virheellinen')
      setTimeout(() => {
        this.props.errorEmpty()
      }, 5000)
    }
  }

  createBlog = async (event) => {
    event.preventDefault()
    console.log('testing')
    const newBlog = {
      author: this.state.author,
      title: this.state.title,
      url: this.state.url
    }
    const response = await blogService.createBlog(newBlog)
    this.props.blogsCreate(this.props.blogs.concat(response))
    this.setState({
      author: '',
      title: '',
      url: '',
    })
    this.props.notificationSet('new blog \'' + newBlog.title + '\' by ' + newBlog.author + ' added!')
    setTimeout(() => {
      this.props.notificationEmpty()
    }, 5000)
  }

likeBlog = (id) => {
  return async() => {
    console.log('Adding like to ' + id)
    const blog = this.props.blogs.find(b => b._id === id)
    const changedBlog = { ...blog, likes: blog.likes+1 }

    await blogService.update(id,changedBlog)
    this.props.blogsCreate(this.props.blogs.map(blog => blog._id === id ? changedBlog: blog))
  }
}

deleteBlog = (id) => {
  return () => {
    const blog = this.props.blogs.find(b => b._id === id)
    if (window.confirm('Do you really want to delete blog \'' + blog.title + '\'?' )) {
      console.log('Deleting ' + id)
      blogService
        .deleteBlog(id)
        .then(() => {
          blogService.getAll().then(blogs =>
            this.props.blogsCreate(blogs)
          )
        })
    }
  }
}



  handleLoginFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  logoutPressed = () => {
    window.localStorage.removeItem('loggedBlogCollector')
    this.props.userDelete()
  }

  handleBlogFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  sortBlogs = () => {
    const sortedblogs = this.props.blogs.sort(function (a,b){
      return b.likes - a.likes
    })
    this.props.blogsCreate(sortedblogs)
  }

  render() {
    const loginForm = () => (
      <div className='loginForm'>
        <h2>Login</h2>
        <Form onSubmit={this.login}>
          <Form.Field>
          Username:
            <input
              type = "text"
              name = "username"
              value = {this.state.username}
              onChange = {this.handleLoginFieldChange}
            />
          </Form.Field>
          <Form.Field>
          Password:
            <input
              name = "password"
              type = "password"
              value = {this.state.password}
              onChange = {this.handleLoginFieldChange}
            />
          </Form.Field>
          <Button type="submit">Log in</Button>
        </Form>
      </div>
    )

    const Blogs = () => (
      <div>
        <h2>Blogs</h2>
        {this.props.blogs.map(blog =>
          <p key={blog._id}><Link to={`/blogs/${blog._id}`}>{blog.title}</Link></p>
        )}
        <Button onClick={this.sortBlogs}>Sort blogs by likes</Button>
        {newBlog()}
      </div>
    )

    const newBlog = () => {
      return (
        <div>
          <Togglable buttonLabel="Create new blog">
            <NewBlog
              title = {this.state.title}
              author = {this.state.author}
              url = {this.state.url}
              createBlog = {this.createBlog}
              handleBlogFieldChange = {this.handleBlogFieldChange}
            />
          </Togglable>
        </div>
      )
    }

    const Users = () => (
      <div>
        <h2>Users</h2>
        <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Blogs added</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
        {this.props.users.map(user =>
              <Table.Row key={user.id}>
                <Table.Cell><Link to={`/users/${user.id}`}>{user.name}</Link></Table.Cell>
                <Table.Cell>{user.blogs.length}</Table.Cell>
              </Table.Row>
            )}
        </Table.Body>
        </Table>
      </div>
    )

    const userById = (id) =>  {
      const user = this.props.users.find(user => user.id === id)
      return(
        user
      )
    }

    const blogById = (id) =>  {
      const blog = this.props.blogs.find(blog => blog._id === id)
      return(
        blog
      )
    }

    return (
      <Container>
        <Router>
          <div>
            <Header as='h1'>Blog App</Header>
            <p>{this.props.error}</p>
            <p>{this.props.notification}</p>
            {this.props.user === null ? loginForm() :
              <div>
                <Menu>
                  <Menu.Item link>
                    <Link to="/"><Icon name='home'/>home</Link> &nbsp;
                  </Menu.Item>
                  <Menu.Item link>
                    <Link to="/users"><Icon name='user'/>users</Link> &nbsp;
                  </Menu.Item>
                  <Menu.Item link>
                    <Link to="/blogs">blogs</Link>
                  </Menu.Item>
                </Menu>
                {this.props.user.name} logged in!
                <Button onClick={this.logoutPressed}>Logout</Button>
                <Route exact path="/blogs/:id" render={({ match }) =>
                  <Blog blog={blogById(match.params.id)} likeBlog={this.likeBlog(match.params.id)} deleteBlog={this.deleteBlog(match.params.id)} user={this.props.user}/>}
                />
                <Route path="/blogs" render={() => <Blogs />} />
                <Route exact path="/users/:id" render={({ match }) =>
                  <User user={userById(match.params.id)} />}
                />
                <Route path="/users" render={() => <Users />} />
              </div>}
          </div>
        </Router>
      </Container>
    )
  }
}

App.contextTypes = {
  store: PropTypes.object
}

const NewBlog = ({ createBlog, handleBlogFieldChange, title, author, url }) => {
  return(
    <div>
      <h2>Add new blog</h2>
      <Form onSubmit={createBlog}>
        <Form.Field>
      Title:
          <input
            type = "text"
            name = "title"
            value = {title}
            onChange = {handleBlogFieldChange}
          />
        </Form.Field>
        <Form.Field>
      Author:
          <input
            type = "text"
            name = "author"
            value = {author}
            onChange = {handleBlogFieldChange}
          />
        </Form.Field>
        <Form.Field>
      Url:
          <input
            type = "text"
            name = "url"
            value = {url}
            onChange = {handleBlogFieldChange}
          />
        </Form.Field>
        <Button type="submit">Add</Button>
      </Form>
    </div>
  )
}

App.propTypes = {
  userCreate: PropTypes.func.isRequired,
  userDelete: PropTypes.func.isRequired,
  errorSet: PropTypes.func.isRequired,
  errorEmpty: PropTypes.func.isRequired,
  notificationSet: PropTypes.func.isRequired,
  notificationEmpty: PropTypes.func.isRequired,
  usersCreate: PropTypes.func.isRequired,
  blogsCreate: PropTypes.func.isRequired,
  blogs: PropTypes.array.isRequired,
  user: PropTypes.object,
  notification: PropTypes.string,
  error: PropTypes.string
}

NewBlog.propTypes = {
  createBlog: PropTypes.func.isRequired,
  handleBlogFieldChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
}

const mapStateToProps = (state) => {
  return {
    error: state.error,
    notification: state.notification,
    user: state.user,
    users: state.users,
    blogs: state.blogs
  }
}

const mapDispatchToProps = {
  userCreate, userDelete,
  errorSet, errorEmpty,
  notificationSet, notificationEmpty,
  usersCreate,
  blogsCreate
}


const ConnectedApp = connect(
  mapStateToProps, mapDispatchToProps
)(App)

export default ConnectedApp
