const express = require('express');
const path = require("path");
let ejs = require('ejs');
const app = express();
const port = 3000;

// middleware
app.use(express.static(path.join(__dirname , '/public')));

app.set('view engine', 'ejs');

app.set("views", path.join(__dirname , '/views'));

const users = [
  {
    noOfUsers: 15
  },{
    id: 1,
    name: "amey_pacharkar",
    ref: "Amey Pacharkar",
    role: "Android iOS developer",
    followers: "1.2k",
    following: 500,
    posts: 5
  }, {
    id: 2,
    name: "om_jaiswal",
    ref: "Om Jaiswal",
    role: "Web developer",
    followers: "1k",
    following: 600,
    posts: 7
  },{
    id: 3,
    name: "harshit_upadhyay",
    ref: "Harshit Upadhyay",
    role: "Web developer",
    followers: "1.1k",
    following: 550,
    posts: 10
  },{
    id: 4,
    name: "kartikey_singh",
    ref: "Kartikey Singh",
    role: "Java Developer",
    followers: "1.5k",
    following: 500,
    posts: 2
  },{
    id: 5,
    name: "prathamesh_jadhav",
    ref: "Prathamesh Jadhav",
    role: "Python developer",
    followers: "1.3k",
    following: 400,
    posts: 8
  },{
    id: 1,
    name: "amey_pacharkar",
    ref: "Amey Pacharkar",
    role: "Android iOS developer",
    followers: "1.2k",
    following: 500,
    posts: 5
  },{
    id: 1,
    name: "amey_pacharkar",
    ref: "Amey Pacharkar",
    role: "Android iOS developer",
    followers: "1.2k",
    following: 500,
    posts: 5
  },{
    id: 1,
    name: "amey_pacharkar",
    ref: "Amey Pacharkar",
    role: "Android iOS developer",
    followers: "1.2k",
    following: 500,
    posts: 5
  },{
    id: 1,
    name: "amey_pacharkar",
    ref: "Amey Pacharkar",
    role: "Android iOS developer",
    followers: "1.2k",
    following: 500,
    posts: 5
  },{
    id: 1,
    name: "amey_pacharkar",
    ref: "Amey Pacharkar",
    role: "Android iOS developer",
    followers: "1.2k",
    following: 500,
    posts: 5
  },{
    id: 1,
    name: "amey_pacharkar",
    ref: "Amey Pacharkar",
    role: "Android iOS developer",
    followers: "1.2k",
    following: 500,
    posts: 5
  },{
    id: 1,
    name: "amey_pacharkar",
    ref: "Amey Pacharkar",
    role: "Android iOS developer",
    followers: "1.2k",
    following: 500,
    posts: 5
  },{
    id: 1,
    name: "amey_pacharkar",
    ref: "Amey Pacharkar",
    role: "Android iOS developer",
    followers: "1.2k",
    following: 500,
    posts: 5
  },{
    id: 1,
    name: "amey_pacharkar",
    ref: "Amey Pacharkar",
    role: "Android iOS developer",
    followers: "1.2k",
    following: 500,
    posts: 5
  },{
    id: 1,
    name: "amey_pacharkar",
    ref: "Amey Pacharkar",
    role: "Android iOS developer",
    followers: "1.2k",
    following: 500,
    posts: 5
  }
]

let findUser = (currUser)=>{
  let user = users.filter(user =>{
    return user.name === currUser;
  })

  return user;
}

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
  res.render("feed",{users: users});
})

app.get('/post', (req, res) => {
  res.sendFile(__dirname + '/html/post.html');
})

app.get('/profile', (req, res) => {
  res.sendFile(__dirname + '/html/profile.html');
})

app.get('/:user', (req, res) => {
  let USER = findUser(req.params.user);
  console.log(USER)
  res.render("profile_another",{users: USER});
})

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})