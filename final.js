var mongoose = require("mongoose");
const bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    "email": { type: String, unique: true },
    "password": String
});

let collection;
let finalUser;


function startDB() {

    return new Promise(function (resolve, reject) {

        collection = mongoose.createConnection('mongodb+srv://fahim:Aminoor798@bti-database.rlmjtmr.mongodb.net/T4');

        collection.on('error', (err) => {
            console.log("Cannot connect to DB.");
            reject(err);
        });

        collection.once('open', () => {
            finalUser = collection.model("finalUsers", userSchema);
            console.log("DB connection successful.");
            resolve();
        });

    });
}

function register(user){
    return new Promise(function (resolve, reject){

        if(user.email=="" || user.email.trim()=="" || user.password=="" || user.password.trim()==""){
            reject("Error: email or password cannot be empty.");
        }
        else{
            bcrypt.hash(user.password, 10).then((hashed) => {
                user.password = hashed;
                let newUser = new finalUser(user);
                newUser.save().then(() => {
                    resolve(user);
                }).catch((err) => {
                    if (err.code == 11000) {
                        reject("Error: " + user.email + "already exists.");
                    }
                    else {
                        reject("There was an error creating the user:" + err);
                    }
                });
            }).catch(()=>{
                reject("There was an error encrypting the password");
            });
        }
    });
}


function signIn(user){
    return new Promise(function (resolve, reject) {
        finalUser.findOne({ email: user.email }).exec().then((userdata) => {
            bcrypt.compare(user.password, userdata.password).then((res)=>{
                if (userdata == {}) {
                    reject("Unable to find user: " + userdata.email);
                }
                else if (!res) {
                    reject("Incorrect Password for user:" + userdata.email);
                }
                else {
                    resolve(userdata);
                }
            });
        }).catch(() => {
            reject("Unable to find user:" + user.email);
        });
    });

}
exports.startDB = startDB;
exports.register = register;
exports.signIn = signIn;