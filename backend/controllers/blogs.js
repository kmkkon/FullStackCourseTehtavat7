
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { _id:1, username:1, name:1 })
  return response.json(blogs)
})

/*
const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}*/

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  try{
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (body.title === undefined){
      return response.status(400).json({ error: 'title is missing' })
    }
    if (body.url === undefined){
      return response.status(400).json({ error: 'url is missing' })
    }
    const users = await User.find({})
    const user = users[0]
    const blog = new Blog({
      _id: body._id,
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
      user : user._id,
      __v: 0
    })
    const savedBlog = await blog.save()

    if (user.id !== undefined){
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
    }
    response.status(201).json(savedBlog)
  } catch(exception) {
    if (exception.name === 'JsonWebTokenError' ) {
      response.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      response.status(500).json({ error: 'something went wrong...' })
    }
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const blog = await Blog.findById(request.params.id)
    if (blog.user !== undefined){
      if ( blog.user.id.toString() === decodedToken.id.toString() ){
        return response.status(400).json({error: 'incorrect user'})
      }
      }
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    if (exception.name === 'JsonWebTokenError' ) {
      response.status(401).json({ error: exception.message })
    } else {
      response.status(400).send({ error: 'malformatted id' })
    }
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body
  const blog = await Blog.findByIdAndUpdate(request.params.id, { title, author, url, likes } , { new: true })

  response.send(blog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  console.log(request.params.id)
  const comments = request.body.comments
  await Blog.findByIdAndUpdate(request.params.id, { comments } , { new: true } )

  response.send(comments)
})

blogsRouter.post('/comments', async (request, response) => {
  console.log(request.params.id)
  const comments = request.body.comments
  //await Blog.findByIdAndUpdate(request.params.id, { comments } , { new: true } )

  response.send(comments)
})


module.exports = blogsRouter