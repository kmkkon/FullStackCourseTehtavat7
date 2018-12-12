const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let count = 0
  blogs.forEach(blog => {
    count += blog.likes
  })
  return count
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0){
    return undefined
  }
  let favblog = blogs[0]
  let count = -1
  blogs.forEach(blog => {
    if (blog.likes>count){
      favblog = blog
      count = blog.likes
    }
  })
  return favblog.title
}

const mostBlogs = (blogs) => {
  let bloggers = []
  blogs.forEach(blog => {
    let blogger = bloggers.find(b => b.author === blog.author)
    if (blogger){
      blogger.blogs++
    } else {
      let bloggerObject = {
        author : blog.author,
        blogs : 1
      }
      bloggers = bloggers.concat(bloggerObject)
    }
  })
  let favblogger = bloggers[0]
  bloggers.forEach(blogger => {
    if (blogger.blogs>favblogger.blogs){
      favblogger = blogger
    }
  })
  return favblogger
}

const mostLikes = (blogs) => {
  let bloggers = []
  blogs.forEach(blog => {
    let blogger = bloggers.find(b => b.author === blog.author)
    if (blogger){
      blogger.likes += blog.likes
    } else {
      let bloggerObject = {
        author : blog.author,
        likes : blog.likes
      }
      bloggers = bloggers.concat(bloggerObject)
    }
  })
  let favblogger = bloggers[0]
  bloggers.forEach(blogger => {
    if (blogger.likes>favblogger.likes){
      favblogger = blogger
    }
  })
  return favblogger
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}