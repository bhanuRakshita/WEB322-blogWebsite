// require mongoose and setup the Schema
var mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

// define the company schema
var userSchema = new Schema({
  "userName":  {
    type: String,
    unique: true
  },
  "password": String,
  "email": String,
  "loginHistory": [ {dateTime: Date, userAgent: String} ]
});

let User;

// let db = mongoose.createConnection("mongodb+srv://bhanurakshita457:5YHLA8qf6sf9VIRM@cluster0.d0xivxn.mongodb.net/?retryWrites=true&w=majority");

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb+srv://bhanurakshita457:5YHLA8qf6sf9VIRM@cluster0.d0xivxn.mongodb.net/?retryWrites=true&w=majority");

        db.on('error', (err)=>{
            reject(err); // reject the promise with the provided error
        });
        db.once('open', ()=>{
           User = db.model("users", userSchema);
           resolve();
        });
    });
};

module.exports.registerUser = function(userData) {
    return new Promise((resolve, reject) => {
        if (userData.password !== userData.password2) {
            reject("Passwords do not match");
        } else {
            // Hashing the password before storing it
            bcrypt.hash(userData.password, 10).then((hash) => {
                userData.password = hash;
                // Saving the user data
                let newUser = new User(userData);
                newUser.save().then(() => {
                    resolve();
                }).catch((err) => {
                    if (err.code === 11000) {
                        reject("User Name already taken");
                    } else {
                        reject(`There was an error creating the user: ${err}`);
                    }
                })
            })
            .catch((err) => {
                console.log(err);
                reject("There was an error encrypting the password")
            });
        
        }
    })
};

module.exports.checkUser = function (userData) {
    return new Promise((resolve, reject) => {
        User.find({ "userName": userData.userName }).exec()
        .then((users) => {
            if (users.length === 0) {
                reject(`Unable to find user: ${userData.userName}`);
            } else {
                // Checking if the passwords match
                bcrypt.compare(userData.password, users[0].password).then((result) => {
                    if (result === true) {
                        resolve(users[0]);
                    } else {
                        reject(`Incorrect Password for user: ${userData.userName}`);
                    }
                 });
                 // Updating the login history if everything passes validation
                users[0].loginHistory.push({
                    "dateTime": new Date().toString(),
                    "userAgent": userData.userAgent
                })
                // Updating the user database
                User.updateOne(
                    { "userName": users[0].userName },
                    { "$set": {"loginHistory": users[0].loginHistory} },
                    { "multi": false }
                ).exec().then(() => {
                    resolve(users[0]);
                }).catch((err) => {
                    reject(`There was an error verifying the user: ${err}`)
                })
            }
        }).catch(() => {
            reject(`Unable to find user: ${userData.userName}`);
        });
    })
};
