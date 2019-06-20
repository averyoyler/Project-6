const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const usersFile = require('./users.js');
const User = usersFile.User;
const users = usersFile.users;

const fs = require('fs');

let app = express();

let current = null;

app.use(express.static('public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.urlencoded({extended:false}));
app.use(express.json());

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

// console.log(users.collection);
// let jsonData = JSON.parse({users});
// console.log(jsonData);



function writeToFile() {
  fs.writeFile('./public/users.json', JSON.stringify(users.collection), (err) => {
    if(err) throw err;
    console.log('Users file updated');
  });
}