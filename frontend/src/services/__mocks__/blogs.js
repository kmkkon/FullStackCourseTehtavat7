let token = null

const blogs = [
    {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    user: {
    _id: "5be19d571d88873d9872a50c",
    username: "root",
    name: "root"
    },
    __v: 0
    },
    {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 0,
    user: {
    _id: "5be19d571d88873d9872a50c",
    username: "root",
    name: "root"
    },
    __v: 0
    },
    {
    _id: "5be19d7f64477e0a544892c5",
    title: "This is not the life I ordered",
    author: "Vuoden Siivooja",
    url: "http://not-the-life-i-ordered.blogspot.com/",
    likes: 0,
    user: {
    _id: "5be19d571d88873d9872a50c",
    username: "root",
    name: "root"
    },
    __v: 0
    },
    {
    _id: "5be19de264477e0a544892c6",
    title: "This is not the life I ordered 2",
    author: "Vuoden Siivooja",
    url: "http://not-the-life-i-ordered.blogspot.com/",
    likes: 0,
    user: {
    _id: "5be19d571d88873d9872a50c",
    username: "root",
    name: "root"
    },
    __v: 0
    }
]

const getAll = () => {
    return Promise.resolve(blogs)
  }

const setToken = (newToken) => {
    token = `bearer ${newToken}`
  }
  

  export default { getAll, blogs, setToken }