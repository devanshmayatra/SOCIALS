const express = require('express')
const app = express()
const port = 3000

// middleware
app.use(express.static(__dirname + '/public'));

// routing
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/html/index.html');
})

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/html/log_in.html');
})

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/html/sign_up.html');
})

app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/html/home.html');
})

app.get('/notification', (req, res) => {
  res.sendFile(__dirname + '/html/notif.html');
})

app.get('/feed', (req, res) => {
  res.sendFile(__dirname + '/html/feed.html');
})

app.get('/post', (req, res) => {
  res.sendFile(__dirname + '/html/post.html');
})

app.get('/profile', (req, res) => {
  res.sendFile(__dirname + '/html/profile.html');
})

app.get('/profile_u', (req, res) => {
  res.sendFile(__dirname + '/html/profile_another.html');
})

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})