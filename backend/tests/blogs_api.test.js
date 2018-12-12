const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

beforeAll(async () => {
  await User.remove({})
  const saltRounds = 10
  const passwordHash = await bcrypt.hash('realpw', saltRounds)
  const user = new User({ username: 'root', name: 'root', adult: true, passwordHash })
  await user.save()
})

describe('blog test GET', () => {
  beforeAll(async () => {
    await Blog.remove({})

    const blogObjects = helper.listWithManyBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(helper.listWithManyBlogs.length)
    const returnedTitles = response.body.map(r => r.title)
    helper.listWithManyBlogs.forEach(blog => {
      expect(returnedTitles).toContainEqual(blog.title)
    })
  })
})

describe('blog test POST', () => {
  test('blog adding succeeds', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const token = await helper.getOneToken()

    const newBlog ={
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    }
    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterOperation = await helper.blogsInDb()
    expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)

    const titles = blogsAfterOperation.map(b => b.title)
    expect(titles).toContainEqual(newBlog.title)
  })

  test('blog without likes gets 0 likes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const token = await helper.getOneToken()
    const newBlogWithoutLikes ={
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      __v: 0
    }
    const response = await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(newBlogWithoutLikes)
    expect(response.body.likes).toBe(0)

    const blogsAfterOperation = await helper.blogsInDb()
    expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)
  })

  test('blog without title does not get through', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const token = await helper.getOneToken()
    const newBlogWithoutTitle =  {
      _id: '5a422b3a1b54a676234d17f9',
      //title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    }
    const response = await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(newBlogWithoutTitle)
      .expect(400)
    expect(response.body.error).toContain('title is missing')

    const blogsAfterOperation = await helper.blogsInDb()
    expect(blogsAfterOperation.length).toBe(blogsAtStart.length)

  })

  test('blog without url does not get through', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const token = await helper.getOneToken()
    const newBlogWithoutUrl =  {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      //url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    }
    const response = await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(newBlogWithoutUrl)
      .expect(400)
    expect(response.body.error).toContain('url is missing')

    const blogsAfterOperation = await helper.blogsInDb()
    expect(blogsAfterOperation.length).toBe(blogsAtStart.length)

  })
})

describe('blog test DELETE', () => {
  let addedBlog
  let addingUser
  beforeAll(async () => {
    addingUser = await helper.getOneUser()
    addedBlog =  new Blog({
      _id: '5a422b3a1b54a676234d9999',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0,
      user: addingUser
    })
    await addedBlog.save()
  })

  test('DELETE fails without token', async () => {
    const blogsAtStart = await helper.blogsInDb()
    await api
      .delete(`/api/blogs/${addedBlog._id}`)
      .expect(401)

    const blogsAfterOperation = await helper.blogsInDb()
    expect(blogsAfterOperation.length).toBe(blogsAtStart.length)


  })

  test('DELETE succeeds', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const token = await helper.getOneToken()
    await api
      .delete(`/api/blogs/${addedBlog._id}`)
      .set('Authorization', 'bearer ' + token)
      .expect(204)

    const blogsAfterOperation = await helper.blogsInDb()
    expect(blogsAfterOperation.length).toBe(blogsAtStart.length-1)
  })

/*  test('DELETE succeeds', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const token = await helper.getOneToken()
    await api
      .delete(`/api/blogs/${addedBlog._id}`)
      .set('Authorization', 'bearer ' + token)
      .expect(204)

    const blogsAfterOperation = await helper.blogsInDb()
    expect(blogsAfterOperation.length).toBe(blogsAtStart.length-1)
  })*/
})

describe('blog test PUT', () => {
  let addedBlog
  beforeAll(async () => {
    addedBlog =  new Blog({
      _id: '5a422b3a1b54a676234d1232',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      comments: ['this is a test comment'],
      __v: 0
    })
    await addedBlog.save()
  })

  test('PUT succeeds', async () => {
    const blogsAtStart = await helper.blogsInDb()
    changedBlog =  new Blog({
      _id: '5a422b3a1b54a676234d1232',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 1500,
      __v: 0
    })
    await api
      .put(`/api/blogs/${addedBlog._id}`)
      .send(changedBlog)
      .expect(200)

    const blogsAfterOperation = await helper.blogsInDb()
    expect(blogsAfterOperation.length).toBe(blogsAtStart.length)

    const likes = blogsAfterOperation.map(b => b.likes)
    expect(likes).toContainEqual(changedBlog.likes)
  })
})

describe('when there is initially one user at db', async () => {

  test('POST /api/users succeeds with a fresh username', async () => {
    const usersBeforeOperation = await helper.usersInDb()

    const newUser = {
      username: 'tester1',
      name: 'Tero Testaaja',
      adult: true,
      password: 'teronsalasana'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfterOperation = await helper.usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length+1)
    const usernames = usersAfterOperation.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('POST /api/users fails with proper statuscode and message if username already taken', async () => {
    const usersBeforeOperation = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      adult: true,
      password: 'superpassword'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toEqual({ error: 'username must be unique' })

    const usersAfterOperation = await helper.usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
  })

  test('POST /api/users fails with proper statuscode and message if password too short', async () => {
    const usersBeforeOperation = await helper.usersInDb()

    const newUser = {
      username: 'tester2',
      name: 'Tuomas Testaaja',
      adult: true,
      password: 'je'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toEqual({ error: 'too short password' } )

    const usersAfterOperation = await helper.usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
  })

  test('POST /api/users succeeds without adult definition', async () => {
    const usersBeforeOperation = await helper.usersInDb()

    const newUser = {
      username: 'tester2',
      name: 'Tuomas Testaaja',
      password: 'jeijei'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfterOperation = await helper.usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length+1)
    const usernames = usersAfterOperation.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

})

afterAll(() => {
  server.close()
})