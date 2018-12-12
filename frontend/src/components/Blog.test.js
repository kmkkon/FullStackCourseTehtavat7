import React from 'react'
import { shallow } from 'enzyme'
import Blog from './Blog'

describe.only('<Blog />', () => {
  let blogComponent
  let mockHandler
  const blog = {
    title: 'This is not the life I ordered',
    author: 'Vuoden Siivooja',
    url: 'http://not-the-life-i-ordered.blogspot.com/',
    likes: 5,
  }

  beforeEach(() => {
    mockHandler = jest.fn()
    blogComponent = shallow(<Blog blog={blog} />)
  })

  it('at start the children are not displayed', () => {
    const div = blogComponent.find('.moreContent')
    expect(div.getElement().props.style).toEqual({ display: 'none' })
  })

  it('after clicking the button, children are displayed', () => {
    const namediv = blogComponent.find('.nameTitle')
    namediv.simulate('click')

    const moreContent = blogComponent.find('.moreContent')
    expect(moreContent.getElement().props.style).toEqual({ display: '' })

  })
})