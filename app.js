const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const usersFile = require('./users.js');
// const User = usersFile.User;
// const users = usersFile.users;
const fs = require('fs');

let app = express();

mongoose.connect('mongodb://localhost/project6', {useNewUrlParser: true});

const db = mongoose.connection;
const userSchema = new mongoose.Schema({
  username: String,
  firstname: String,
  lastname: String,
  email: String,
  age: Number 
});

const user = mongoose.model('usercollection', userSchema);


// const newUser = new user();
//    newUser.name = 'avery';
//    newUser.role = 'student';
//    newUser.save((err, data) => {
//        if (err) {
//            return console.error(err);
//        }
//        console.log(`new user save: ${data}`);
//    });





let current = null;

app.use(express.static('public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.urlencoded({extended:false}));
app.use(express.json());

// GET HOME PAGE
app.get('/', (req, res) => {
  res.render('pages/index');
});

// GET FORM
app.get('/form', (req, res) => {
  res.render('pages/form');
});

// GET USERS
app.get('/users', (req, res) => {
  user.find({}, function(err, result) {
    if(err) throw err;
    console.log('RESULT:' + result);
    res.render('pages/users', {
      users: result
    });
  });
});

// GET EDIT USER

app.get('/edituser/:user', (req, res) => {
  current = req.params.user;
  console.log(`You clicked on : ${req.params.user}`);
  user.find({}, function(err, result) {
    if(err) throw err;
    res.render('pages/edit', {
      name: req.params.user,
      users: result,
    });
  });
  
  // user.updateOne({'name': 'Aves'}, {$set: {'name': 'aveeeeees'}})
});



// CREATE A NEW USER

app.post('/create', (req, res) => {
  let newUser = new user();
  newUser.username = req.body.username;
  newUser.firstname = req.body.firstname;
  newUser.lastname = req.body.lastname;
  newUser.email = req.body.email;
  newUser.age = req.body.age;
  console.log(newUser);
  newUser.save((err, data) => {
    if (err) {
        return console.error(err);
    }
    // console.log(`Saved User: ${data}`);
    console.log(`Created User: ${req.body.firstname}`);
    res.redirect('/users')
  });
});

// EDIT A USER

app.post('/edituser', (req, res) => {
  let value = {'name': current};
  let editedUser = {$set: {'username': req.body.username, 'name': req.body.name, 'email': req.body.email, 'age': req.body.age}};
  
  user.find({'name': req.body.name}, function(err, result) {
    if(err) throw err;
    user.updateOne(value, editedUser, function(err, result) {
      if(err) throw err;
      console.log(`Updated User: ${current}`);
      res.redirect('/users');
    });
  });
});

// DELETE A USER

app.get('/deleteuser/:user', (req, res) => {
  user.deleteOne({'name': req.params.user}, function(err, result) {
    if(err) throw err;
    console.log(`Deleted User: ${req.params.user}`);
    res.redirect('/users');
  });
});

// FIND A USER
// app.post('/find', (req, res) => {
//   user.findOne({'username': req.body.find}, function(err, result) {
//     if(err) throw err;
//     console.log(req.body.find);
//     res.render('pages/foundUser', {
//       user: result,
//       username: req.body.find
//     })
//   });
// });

// SEARCH PAGE
app.get('/search', (req, res) => {
  res.render('pages/search');
});

// SEARCH POST
app.post('/search', (req, res) => {
  let first = req.body.firstname;
  let last = req.body.lastname;
  if((first !== undefined) && (last !== undefined)) {
    user.find({'firstname': first, 'lastname': last}, function(err, result) {
      if(err) throw err;
      console.log(`\n\n ${result} \n\n`);
      res.render('pages/foundUser', {
        users: result
      });
    });
  }
  else if(first !== undefined) {
    user.find({'firstname': first});
  } 
  else if(last !== undefined) {
    user.find({'lastname': last})
  }
});



app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});



// OLD CODE __________________________________________

/*
app.get('/', (req, res) => {
  res.render('pages/index');
});

app.get('/form', (req, res) => {
  res.render('pages/form');
});

app.get('/users', (req, res) => {
  let usercoll = [];
  fs.readFile('./public/users.json', (err, data) => {
    if(err) throw err;
    usercoll = JSON.parse(data);
    console.log('USERS', usercoll);
    res.render('pages/users', {
      users: usercoll
    });
  });
  
  console.log('COLLECTION', users.collection);
});

app.get('/edituser/:user', (req, res) => {
  console.log(`You clicked on : ${req.params.user}`);
  current = req.params.user;
  let usercoll = [];
  fs.readFile('./public/users.json', (err, data) => {
    if(err) throw err;
    usercoll = JSON.parse(data);
    res.render('pages/edit', {
      name: req.params.user,
      users: usercoll,
    });
  });
});

app.get('/deleteuser/:user', (req, res) => {
  let usercoll = [];
  fs.readFile('./public/users.json', (err, data) => {
    if(err) throw err;
    usercoll = JSON.parse(data);
    users.collection = [];
    for(let i = 0; i < usercoll.length; i++) {
      users.addOne(usercoll[i]);
      if(usercoll[i].name === req.params.user) {
        users.deleteOne(req.params.user);
      }
    }
    writeToFile();
    res.redirect('/users');
  });
});

app.post('/edituser', (req, res) => {
  let usercoll = [];
  fs.readFile('./public/users.json', (err, data) => {
    if(err) throw err;
    usercoll = JSON.parse(data);
    for(let i = 0; i < usercoll.length; i++) {
      users.addOne(usercoll[i]);
    }
    users.editOne(current, req.body.username, req.body.name, req.body.email, Number(req.body.age));
    res.redirect('/users');
    writeToFile();
  });
});


app.post('/create', (req, res) => {
  let newUser = new User(req.body.username, req.body.name, req.body.email, Number(req.body.age));
  fs.readFile('./public/users.json', (err, data) => {
    if(err) throw err;
    usercoll = JSON.parse(data);
    users.collection = [];
    for(let i = 0; i < usercoll.length; i++) {
      users.addOne(usercoll[i]);
    }
    users.addOne(newUser);
    writeToFile();
    res.redirect('/users')
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

function writeToFile() {
  fs.writeFile('./public/users.json', JSON.stringify(users.collection), (err) => {
    if(err) throw err;
    console.log('Users file updated');
  });
}

*/