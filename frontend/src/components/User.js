import React from 'react'
import {Button, Icon, Segment, List, Header} from 'semantic-ui-react'

class User extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    if (this.props.user !== undefined)
    {
      return (
        <Segment>
          <Header as='h2'> <Icon name='user'/> {this.props.user.name}</Header>
          <h3>Added blogs</h3>
          <List bulleted>
          {this.props.user.blogs.map(blog =>
            <List.Item key={blog._id}>&quot;{blog.title}&quot; by {blog.author}</List.Item>
          )}
          </List>
        </Segment>
      )
    }
    return (<div></div>)
  }
}

export default User
