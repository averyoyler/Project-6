class Users {
  constructor() {
    this.collection = [];
  }
  addOne(user) {
    this.collection.push(user);
  }
  findOne(email) {
    for(let i = 0; i < this.collection.length; i++) {
      if(this.collection[i].email === email) {
        return this.users[i];
      }
    }
  }
  editOne(current, username, name, email, age) {
    for(let i = 0; i < this.collection.length; i++) {
      if(this.collection[i].name === current) {
        this.collection[i].username = username;
        this.collection[i].name = name;
        this.collection[i].email = email;
        this.collection[i].age = age;
      }
    }
  }
  deleteOne(user) {
    for(let i = 0; i < this.collection.length; i++) {
      if(this.collection[i].name === user) {
        this.collection.splice(i, 1);
        i--;
        console.log(this.collection);
      }
    }
  }
}

class User {
  constructor(username, firstname, lastname, email, age) {
    this.username = username;
    this.firstname = firstname;
    this.last = lastname;
    this.email = email;
    this.age = age;
  }
}

let users = new Users();

// users.addOne(admin);
// users.addOne(avery);

// app.post('/adduser', (req, res) => {
//   let first = req.body.first;
//   let last = req.body.last;
//   users.addOne(new User(first, last ...));
// })

module.exports = {
  User,
  users
};