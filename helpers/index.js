const db = require('../db');


//Find a single user based on profileID(May not be unique)
let findOne = (profileID) => {
  return db.userModel.findOne({
    'profileId': profileID
  });
}

//Create New User
let createNewUser = (profile) => {
  return new Promise((resolve, reject) => {
    let newUser = new db.userModel({
      profileId:  profile.id,
      fullName:   profile.displayName,
      profilePic: profile.photos[0].value || ''
    });

    newUser.save((error) => {
      if(error){
        console.log('Create New User Error');
      }else{
        resolve(newUser);
      }
    });
  });
}

//Find User by Mongo Unique ID
let findById = (id) => {
  console.log(`findById -- UniqueId: ${id}`);
  return new Promise((resolve, reject) => {
    db.userModel.findById(id, (error, user) => {
      if(error){
        reject(error);
      }else{
        resolve(user);
      }
    });
  });
}

let addFavorites = (uniqueId, record ,sessionId) => {
  return new Promise((resolve, reject) => {
    console.log("record: " + JSON.stringify(record));

    let newArticle = new db.articleModel({
       userUniqueId: uniqueId,
       headline: record.heading,
       description: record.description,
       url: record.url,
       img: record.image
    });

    newArticle.save((error) => {
      if(error){
        console.log('Create New Article Error');
        reject(error);
      }else{
        resolve(newArticle);
      }
    });
  });
}

let getFavorites = (uniqueId) => {
  return new Promise((resolve, reject) => {
    console.log("userUniqueId --- helpers.getFavorites ---: " + uniqueId);
    db.articleModel.find({ "userUniqueId" : uniqueId },function(err,response){
        if(response){
          console.log("data ---helper.getFavorites---: " + response);
          resolve(response);
        }else if(err){
          console.log("ERROR: Could Not Get Favorite Movies Data");
          reject("ERROR: Could Not Get Favorite Movies Data");
        }
    });
 });
}

//middleware to check if the user is authenticated & logged in
let isAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()){ //This method is provided to us by passport, returns true || false
    next();
  }else{
    res.redirect('/login');
  }
}

module.exports = {
  findOne,
  findById,
  createNewUser,
  addFavorites,
  getFavorites,
  isAuthenticated
}
