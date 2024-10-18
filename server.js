const express = require('express');
const path = require("path");
const ejs = require('ejs');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
// const StudentModel = require("./models/user.js");
const StudentModel = require("./models/student.js");
const MentorModel = require("./models/mentor.js");
const PostModel = require("./models/post.js");
const FollowerModel = require("./models/follow.js");
const AnnouncementModel = require("./models/announcements.js")

//static varibles
const app = express();
const port = 3000;
const time = 43200000;
const mongoConnectionUrl = "mongodb+srv://devanshm667:mHdiSIreTY6qQe9R@social-media-app.afsjx.mongodb.net/?retryWrites=true&w=majority&appName=Social-media-app/social-media-app";

//mogodb connection
mongoose.connect(mongoConnectionUrl).then(() => {
  console.log("Connected to MongoDB")
}).catch((e) => {
  console.log("Failed to connect to MongoDB", e)
})
const db = mongoose.connection;

// middleware
app.use(express.static(path.join(__dirname, '/public')));

app.set('view engine', 'ejs');

app.set("views", path.join(__dirname, '/views'));

app.use(bodyParser.urlencoded({ extended: true }));

//user who has logged in

let loggedInuser;

// routing
app.get('/', (req, res) => {
  res.render('index');
})

app.get('/login', (req, res) => {
  res.render('log_in', { errorMsg: "" });
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const student = await StudentModel.findOne({ username }) || 0;
  const mentor = await MentorModel.findOne({ username }) || 0;

  if (!student && !mentor) {
    res.render('log_in', { errorMsg: "User does not exist" });
  } else if (student) {
    if (Number(student.password) == Number(password)) {
      StudentModel.updateOne({ username }, {
        $set
          : {
          isLoggedIn: true
        }
      }).then(console.log("User logged in updated"))
      loggedInuser = await StudentModel.findOne({ username: student.username });
      res.redirect('/home');
    }
  } else if (mentor) {
    if ((Number(mentor.password) == Number(password))) {

      MentorModel.updateOne({ username }, {
        $set
          : {
          isLoggedIn: true
        }
      }).then(console.log("User logged in updated"))
      loggedInuser = await MentorModel.findOne({ username: mentor.username });
      res.redirect('/home');
    }
  }
  else {
    loggedInuser = 0
    res.render('log_in', { errorMsg: "wrong password" });
  }
})

app.post("/logout", (req, res) => {

  loggedInuser = 0;
  console.log(loggedInuser)
  if (loggedInuser == 0) {
    res.redirect('/');
  }
})

app.get('/signupstudent', (req, res) => {
  res.render('sign_up_student', { errorMsg: "" });
})

app.post('/signupstudent', async (req, res) => {
  const { username, email, password } = req.body;

  const emailExist = await StudentModel.findOne({ email });
  const usernameExist = await StudentModel.findOne({ username });


  if (emailExist) {
    res.render('sign_up_mentor', { errorMsg: "user with this email already exist" });
  } else if (usernameExist) {
    res.render('sign_up_mentor', { errorMsg: "user with this username already exist" });
  }
  else {
    const user = await StudentModel.create({
      username,
      email,
      password,
      designation: "Student",
    })
    res.redirect('/login');
  }
})
app.get('/signupmentor', (req, res) => {
  res.render('sign_up_mentor', { errorMsg: "" });
})

app.post('/signupmentor', async (req, res) => {
  const { username, email, password } = req.body;

  const emailExist = await MentorModel.findOne({ email });
  const usernameExist = await MentorModel.findOne({ username });


  if (emailExist) {
    res.render('sign_up_mentor', { errorMsg: "user with this email already exist" });
  } else if (usernameExist) {
    res.render('sign_up_mentor', { errorMsg: "user with this username already exist" });
  }
  else {
    const user = await MentorModel.create({
      username,
      email,
      password,
      designation: "Mentor",
    })
    res.redirect('/login');
  }
})

app.get('/home', async (req, res) => {
  if (loggedInuser) {

    let posts = await PostModel.find();
    let announcements = await AnnouncementModel.find();

    res.render('home', { posts, announcements });
  } else {
    res.redirect('/login');
  }
})

app.get('/notification', async (req, res) => {
  if (loggedInuser) {
    let announcements = await AnnouncementModel.find();
    res.render('notif',{announcements});
  } else {
    res.redirect('/login');
  }
})

app.get('/feed', async (req, res) => {
  if (loggedInuser) {
    let allStudents = await StudentModel.find()
    let allMentors = await MentorModel.find()

    let studentswhichIsNoLoggedIn = allStudents.filter(user => user.username != loggedInuser.username);
    let mentorswhichIsNoLoggedIn = allMentors.filter(user => user.username != loggedInuser.username);
    res.render("feed", { students: studentswhichIsNoLoggedIn, currUser: loggedInuser , mentors : mentorswhichIsNoLoggedIn });
  } else {
    res.redirect('/login');
  }
})

app.get('/post', (req, res) => {
  if (loggedInuser) {
    res.render('post');
  } else {
    res.redirect('/login');
  }
})

app.post('/post', async (req, res) => {
  const { postTitle, postDesc } = req.body;
  const post = {
    title: postTitle, content: postDesc, author: loggedInuser.username , authorId: loggedInuser._id
  }

  loggedInuser.noOfPosts++;
  loggedInuser.posts.push(post);
  if(loggedInuser.designation == "Student"){
    StudentModel.updateOne({ username: loggedInuser.username }, {
      $set
        : { noOfPosts: loggedInuser.noOfPosts, posts: loggedInuser.posts, createdBy: loggedInuser.username }
    }).then(console.log("post added to the user"));
  
    loggedInuser = await StudentModel.findOne({ username: loggedInuser.username });
  } else if(loggedInuser.designation == "Mentor"){
    MentorModel.updateOne({ username: loggedInuser.username }, {
      $set
        : { noOfPosts: loggedInuser.noOfPosts, posts: loggedInuser.posts, createdBy: loggedInuser.username }
    }).then(console.log("post added to the user"));
  
    loggedInuser = await MentorModel.findOne({ username: loggedInuser.username });
  }
  await PostModel.create(post);

  res.redirect("/home");

})

app.get('/profile', (req, res) => {
  if (loggedInuser) {
    res.render("profile", { user: loggedInuser });
  } else {
    res.redirect("/login");
  }

})

app.get('/:user', async (req, res) => {
  const username = req.params.user;

  let user = await StudentModel.findOne({ username: username });
  res.render("profile_another", { user, loggedInuser });
})

app.get("/editprofileStudent/:loggeInuserUsername", async (req, res) => {

  if (loggedInuser.username == req.params.loggeInuserUsername) {
    res.render("edit_profile_student", { user: loggedInuser });
  } else {
    res.redirect("/login");
  }
})

app.get("/editprofileMentor/:loggeInuserUsername", async (req, res) => {

  if (loggedInuser.username == req.params.loggeInuserUsername) {
    res.render("edit_profile_mentor", { user: loggedInuser });
  } else {
    res.redirect("/login");
  }
});

app.get("/:username/addstudents", async (req, res) => {

  if (loggedInuser.username == req.params.username) {
    let students = await StudentModel.find();
    res.render("add_students_mentor", { user: loggedInuser , students });
  } else {
    res.redirect("/login");
  }
});

app.post("/addstudents", async (req,res) =>{
  let {studentToBeAdded} = req.body;
  let student = await StudentModel.findOne({username: studentToBeAdded});
  console.log(studentToBeAdded,"\n ",student)
  if(student){
    res.redirect("/profile");
  } else if (mentor) {
    loggedInuser.students.push(student.ObjectId);
    console.log(student.ObjectId);
    MentorModel.updateOne({ username: loggedInuser.username }, {
      $set
        : { students: loggedInuser.students }
    }).then(console.log("student added to the mentor"));
    loggedInuser = await MentorModel.findOne({ username: loggedInuser.username });
    res.redirect("/profile");
  }
});

app.post("/editprofileStudent", async (req, res) => {
  const { fullname, email, role, age, dob, bio, gender } = req.body;

  StudentModel.updateOne({ username: loggedInuser.username }, {
    $set
      : {
      fullName: fullname,
      email: email,
      bio: bio,
      role: role,
      age: age,
      dob: dob,
      gender: gender,

    }
  }).then(console.log("updated"));

  loggedInuser = await StudentModel.findOne({ username: loggedInuser.username });
  res.render("profile", { user: loggedInuser })
});

app.post("/editprofileMentor", async (req, res) => {
  const { fullname, email, role, age, dob, bio, gender } = req.body;

  MentorModel.updateOne({ username: loggedInuser.username }, {
    $set
      : {
      fullName: fullname,
      email: email,
      bio: bio,
      role: role,
      age: age,
      dob: dob,
      gender: gender,

    }
  }).then(console.log("updated"));

  loggedInuser = await MentorModel.findOne({ username: loggedInuser.username });
  res.render("profile", { user: loggedInuser })
});

app.get("/:username/addannouncements", async (req,res)=>{
  // let username = req.params.username;
  console.log(req.params)
  if (loggedInuser.username == req.params.username) {
    res.render("add_announcements", { user: loggedInuser });
  } else {
    res.redirect("/login");
  }
})

app.post("/:username/addannouncements", async (req,res)=>{
  // let username = req.params.username;
  console.log(req.params)
  if (loggedInuser.username == req.params.username) {
    const { announcementTitle,announcementTopic, announcementDescription } = req.body;
    await AnnouncementModel.create({
      announcementTitle,
      announcementTopic,
      announcementDescription,
      author: loggedInuser.username,
      authorId: loggedInuser._id,

    })
    res.redirect("/profile");
  } else {
    res.redirect("/login");
  }
})

app.get("/user/api", async (req, res) => {

  let users = await StudentModel.find();

  res.json(users)
})

app.get("/user/api/:username", async (req, res) => {

  let user = await StudentModel.findOne({ username: req.params.username });
  if (user) {
    res.json(user)
  }
  else {
    res.json("user not found")
  }

})

app.get('/posts/api', async (req, res) => {

  let posts = await PostModel.find();

  res.json(posts)
})

app.listen(port, () => {
  console.log(`Application running on port ${port}`)
})