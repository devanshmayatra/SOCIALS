const express = require('express');
const path = require("path");
const ejs = require('ejs');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
// const userModel = require("./models/user");
const { ObjectId } = require('mongodb');
// const { setTimeout } = require('timers/promises');

// collection.findOne({ "_id": ObjectId(req.params['id']) })
//   .then(...)

//static varibles
const app = express();
const port = 3000;
const time = 43200000;

//mogodb connection
mongoose.connect("mongodb+srv://devanshm667:mHdiSIreTY6qQe9R@social-media-app.afsjx.mongodb.net/?retryWrites=true&w=majority&appName=Social-media-app").then(() => {
  console.log("Connected to MongoDB")
}).catch((e) => {
  console.log("Failed to connect to MongoDB",e)
})
const db = mongoose.connection;

// middleware
app.use(express.static(path.join(__dirname, '/public')));

app.set('view engine', 'ejs');

app.set("views", path.join(__dirname, '/views'));

app.use(bodyParser.urlencoded({ extended: true }));

//user who has logged in

let loggedInuser;
// let currentViewingUser;

// const setLogin = (req,res) => {
//   setTimeout(() => {
//     loggedInuser = 0;
//     res.redirect("/login")
//   }, 5000)
// }

// routing
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/html/index.html');
})

app.get('/login', (req, res) => {
  res.render('log_in', { errorMsg: 0 });
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await db.collection("users").findOne({ username });
  if (!user) {
    res.render('log_in', { errorMsg: "user does not exist" });
  } else if (user.password == Number(password)) {
    loggedInuser = user;
    // setLogin();
    // localStorage.setItem("user",loggedInuser)
    res.redirect('/home');
  }
  else {
    loggedInuser = 0
    res.render('log_in', { errorMsg: "wrong password" });
  }
})

app.get('/signup', (req, res) => {
  res.render('sign_up', { errorMsg: "" });
})

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // let users = await db.collection('users').find().toArray();

  const user = {
    fullName: "",
    username,
    email,
    password,
    role: "Unknown",
    dob: "",
    age: 0,
    noOfFollowers: 0,
    followers: [],
    noOfFollowing: 0,
    following: [],
    noOfPosts: 0,
    posts: []
  }

  const emailExist = await db.collection("users").findOne({ email });
  const usernameExist = await db.collection("users").findOne({ username });
  if (emailExist) {
    res.render('sign_up', { errorMsg: "user with this email already exist" });
  } else if (usernameExist) {
    res.render('sign_up', { errorMsg: "user with this username already exist" });
  }
  else {
    await db.collection("users").insertOne(user);
    res.render('log_in');
  }
})

app.get('/home', async (req, res) => {
  if (loggedInuser) {
    let allUsers = await db.collection('users').find().toArray();
    res.render('home', { users: allUsers });
  } else {
    res.redirect('/login');
  }
})

app.get('/notification', (req, res) => {
  if (loggedInuser) {
    res.sendFile(__dirname + '/html/notif.html');
  } else {
    res.redirect('/login');
  }
})

app.get('/feed', async (req, res) => {
  if (loggedInuser) {
    let allUsers = await db.collection('users').find().toArray();
    let userwhichIsNoLoggedIn = allUsers.filter(user => user.username != loggedInuser.username);
    res.render("feed", { users: userwhichIsNoLoggedIn, currUser: loggedInuser });
  } else {
    res.redirect('/login');
  }
})

app.get('/post', (req, res) => {
  if (loggedInuser) {
    res.sendFile(__dirname + '/html/post.html');
  } else {
    res.redirect('/login');
  }
})

app.post('/post', async (req, res) => {
  const { postTitle, postDesc } = req.body;
  const post = {
    postTitle, postDesc, createdBy: loggedInuser.username
  }

  loggedInuser.noOfPosts++;
  loggedInuser.posts.push(post);
  db.collection("users").updateOne({ username: loggedInuser.username }, {
    $set
      : { noOfPosts: loggedInuser.noOfPosts, posts: loggedInuser.posts, createdBy: loggedInuser.username }
  })
  await db.collection("posts").insertOne(post);
  loggedInuser = await db.collection('users').findOne({ username: loggedInuser.username });
  res.redirect("/home");

})

// app.put('/post', (req, res) => {
//   const { postTitle, postDesc } = req.body;
//   const post = {
//     postTitle, postDesc, createdBy: loggedInuser[0].username
//   }

//   res.redirect("/home")
// })

app.get('/profile', (req, res) => {
  if (loggedInuser) {
    res.render("profile", { user: loggedInuser });
  } else {
    res.redirect("/login");
  }

})

app.get('/:user', async (req, res) => {
  const username = req.params.user;
  let user = await db.collection('users').findOne({ username: username });
  console.log("USER TO JDWJNDO")
  // console.log(currentViewingUser);
  res.render("profile_another", { user, loggedInuser });
})

app.get("/editprofile/:loggeInuserUsername", async (req, res) => {

  if (loggedInuser.username == req.params.loggeInuserUsername) {
    res.render("edit_profile", { user: loggedInuser });
  } else {
    res.redirect("/login");
  }
})

app.post("/editprofile", async (req, res) => {
  const { fullname, username, email, role, age, dob } = req.body;

  db.collection("users").updateOne({ username: loggedInuser.username }, {
    $set
      : {
      fullName: fullname,
      username: username,
      email: email,
      role: role,
      age: age,
      dob: dob
    }
  })
  loggedInuser = await db.collection('users').findOne({ username: loggedInuser.username });
  res.render("profile", { user: loggedInuser })
})

app.get("/user/api", async (req, res) => {
  let users = await db.collection('users').find().toArray();
  res.json(users)
})

app.get("/user/api/:username", async (req, res) => {
  let user = await db.collection('users').findOne({ username: req.params.username });
  // const user = users.find(user => user._id === req.params.username);
  if (user) {
    res.json(user)
  }
  else {
    res.json("user not found")
  }

})

app.get('/posts/api', async (req, res) => {
  let posts = await db.collection('posts').find().toArray();
  res.json(posts)
})

app.get("/", (req, res) => {
  loggedInuser = 0;
  console.log(loggedInuser)
})

app.listen(port, () => {
  console.log(`Application running on port ${port}`)
})