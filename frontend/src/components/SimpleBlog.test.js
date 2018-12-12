import React from 'react'
import { shallow } from 'enzyme'
import SimpleBlog from './SimpleBlog'

describe('<SimpleBlog />', () => {
  const blog = {
    title: 'This is not the life I ordered',
    author: 'Vuoden Siivooja',
    url: 'http://not-the-life-i-ordered.blogspot.com/',
    likes: 5,
  }

  it('renders content', () => {

    const blogComponent = shallow(<SimpleBlog blog={blog} />)

    const infoDiv = blogComponent.find('.info')
    const likesDiv = blogComponent.find('.likes')

    expect(infoDiv.text()).toContain(blog.title)
    expect(infoDiv.text()).toContain(blog.author)
    expect(likesDiv.text()).toContain(blog.likes)
  })

  it('like clidked twice', () => {
    const mockHandler = jest.fn()

    const blogComponent = shallow(<SimpleBlog blog={blog} onClick={mockHandler}/>)

    const likesDiv = blogComponent.find('.likes')

    const button = likesDiv.find('button')
    button.at(0).simulate('click')
    button.at(0).simulate('click')

    expect(mockHandler.mock.calls.length).toBe(2)
  })

})