const express = require('express');
const path = require("path");
const ejs = require('ejs');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const UserModel = require("./models/user.js");
const PostModel = require("./models/post.js");
const FollowerModel = require("./models/follow.js");

// import userModel from './models/user';

// const { setTimeout } = require('timers/promises');

// collection.findOne({ "_id": ObjectId(req.params['id']) })
//   .then(...)

//static varibles
const app = express();
const port = 3000;
const time = 43200000;
const mongoConnectionUrl = "mongodb+srv://devanshm667:mHdiSIreTY6qQe9R@social-media-app.afsjx.mongodb.net/?retryWrites=true&w=majority&appName=Social-media-app/social-media-app";

//mogodb connection
mongoose.connect(mongoConnectionUrl).then(() => {
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
let userCount = 0;
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
  res.render('log_in', { errorMsg: "" });
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // const user = await db.collection("users").findOne({ username });

  const user = await UserModel.findOne({username});
  // const user = users[0];
  
  // console.log(Number(user.password) == Number(password))
  // console.log(user.password, Number(password))
  // console.log(typeof user)
  
  if (!user) {
    res.render('log_in', { errorMsg: "user does not exist" });
  } else if (Number(user.password) == Number(password)) {
    // loggedInuser[userCount] = user;
    // userCount++;

    UserModel.updateOne({ username }, {
      $set
        : {
          isLoggedIn : true 
        }
    }).then(console.log("User logged in updated"))

    // loggedInuser.push(user);

    loggedInuser = await UserModel.findOne({username:user.username});

    // loggedInuser = user;

    // setLogin();
    // localStorage.setItem("user",loggedInuser)
    res.redirect('/home');
  }
  else {
    loggedInuser = 0
    res.render('log_in', { errorMsg: "wrong password" });
  }
})

app.post("/logout", (req, res) => {
  loggedInuser = 0;
  console.log(loggedInuser)
  if(loggedInuser == 0){
    res.redirect('/');
  }
})

app.get('/signup', (req, res) => {
  res.render('sign_up', { errorMsg: "" });
})

app.post('/signup', async (req, res) => {
  const { username, email, password ,designation } = req.body;
  
  // let users = await db.collection('users').find().toArray();
  
  // const emailExist = await db.collection("users").findOne({ email });
  // const usernameExist = await db.collection("users").findOne({ username });
  
  const emailExist = await UserModel.findOne({email});
  const usernameExist = await UserModel.findOne({username});


  if (emailExist) {
    res.render('sign_up', { errorMsg: "user with this email already exist" });
  } else if (usernameExist) {
    res.render('sign_up', { errorMsg: "user with this username already exist" });
  }
  else {
    const user = await UserModel.create({
      username,
      email,
      password,
      designation,
    })
    res.redirect('/login');
  }
})

app.get('/home', async (req, res) => {
  if (loggedInuser) {

    // let allUsers = await db.collection('users').find().toArray();

    let allUsers = await UserModel.find();

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

    // let allUsers = await db.collection('users').find().toArray();

    let allUsers = await UserModel.find()

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
    title: postTitle, content: postDesc, author: loggedInuser.username
  }

  loggedInuser.noOfPosts++;
  loggedInuser.posts.push(post);
  UserModel.updateOne({ username: loggedInuser.username }, {
    $set
      : { noOfPosts: loggedInuser.noOfPosts, posts: loggedInuser.posts, createdBy: loggedInuser.username }
  }).then(console.log("post added to the user"))

  // await db.collection("posts").insertOne(post);

  await PostModel.create(post);

  // loggedInuser = await db.collection('users').findOne({ username: loggedInuser.username });

  loggedInuser = await UserModel.findOne({ username: loggedInuser.username });

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

  // let user = await db.collection('users').findOne({ username: username });

  let user = await UserModel.findOne({username:username});

  // console.log("USER TO JDWJNDO")
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
  const { fullname, username, email, role, age, dob , bio, gender } = req.body;

  // db.collection("users").updateOne({ username: loggedInuser.username }, {
  //   $set
  //     : {
  //     fullName: fullname,
  //     username: username,
  //     email: email,
  //     role: role,
  //     age: age,
  //     dob: dob
  //   }
  // })

  UserModel.updateOne({ username: loggedInuser.username }, {
    $set
      : {
      fullName: fullname,
      username: username,
      email: email,
      bio: bio,
      role: role,
      age: age,
      dob: dob,
      gender: gender,

    }
  }).then(console.log("updated"));

  // loggedInuser = await db.collection('users').findOne({ username: loggedInuser.username });

  loggedInuser = await UserModel.findOne({ username: loggedInuser.username });
  res.render("profile", { user: loggedInuser })
})

app.get("/user/api", async (req, res) => {

  // let users = await db.collection('users').find().toArray();
  let users = await UserModel.find();

  res.json(users)
})

app.get("/user/api/:username", async (req, res) => {

  // let user = await db.collection('users').findOne({ username: req.params.username });
  let user = await UserModel.findOne({ username: req.params.username });
  // const user = users.find(user => user._id === req.params.username);
  if (user) {
    res.json(user)
  }
  else {
    res.json("user not found")
  }

})

app.get('/posts/api', async (req, res) => {

  // let posts = await db.collection('posts').find().toArray();
  let posts = await PostModel.find();
  
  res.json(posts)
})


app.listen(port, () => {
  console.log(`Application running on port ${port}`)
})