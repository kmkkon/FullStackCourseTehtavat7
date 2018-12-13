import React from 'react'
import blogService from '../services/blogs'
import {Button, Icon, Segment} from 'semantic-ui-react'

class Blog extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      showdeletebutton: false,
      comment: ''
    }
  }

  handleBlogFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  commentBlog = async (event) => {
    event.preventDefault()
    console.log('Commenting blog ' + (this.props.blog._id))
    const newcomments = this.props.blog.comments.concat(this.state.comment)
    this.props.blog.comments = newcomments
    console.log(newcomments)
    await blogService.updateComments(this.props.blog._id,newcomments)
    this.setState({ comment: '' })
  }

  render() {
    //console.log(this.props)
    if (this.props.blog===undefined) this.state.showdeletebutton = true
    else if (this.props.blog.user === undefined) this.state.showdeletebutton = true
    else if (this.props.blog.user.username === this.props.user.username) this.state.showdeletebutton = true
    const hideButton = { display: this.state.showdeletebutton ? '' : 'none' }

    if (this.props.blog === undefined) return <div></div>
    else return (
      <div>
        <div className="moreContent">
          <Segment>
            <h2>"{this.props.blog.title}" by {this.props.blog.author}</h2>
            <div> <a href={this.props.blog.url}>{this.props.blog.url}</a></div>
            <div>{this.props.blog.likes} likes <Button color='red' onClick={this.props.likeBlog}> <Icon name='heart' /> Like</Button></div>
            <div>added by {this.props.blog.user === undefined ? 'unknown' : this.props.blog.user.name}</div>
            <h3>Comments:</h3>
            {
              this.props.blog.comments.map((c, index) =>
                <li key={this.props.blog._id + index}>{c}</li>
              )}
            <form onSubmit={this.commentBlog}>
      Give your comment:
              <input
                type = "text"
                name = "comment"
                value = {this.state.comment}
                onChange = {this.handleBlogFieldChange}
              />
              <Button type="submit">Add</Button>
            </form>
            <div style = {hideButton}><Button onClick={this.props.deleteBlog}>Delete</Button></div>


          </Segment>
        </div>
      </div>
    )
  }
}

export default Blog