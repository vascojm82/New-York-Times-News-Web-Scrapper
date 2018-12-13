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

let addFavorites = (uniqueId, movieId, sessionId) => {
  return new Promise((resolve, reject) => {
    let searchRef    = ref;      //'myApp'
    let newSearchRef = searchRef.child(uniqueId);
    let updateRef    = newSearchRef.child('favorites');

    updateRef.push({ movieId: movieId }).then((data) => {
      console.log("success adding favorite movie");
      resolve(data);
    }).catch((error) => {
      console.log("failed adding favorite movie");
      reject();
    });
  });
}

let getFavorites = (uniqueId) => {
  return new Promise( async(resolve, reject) => {
    let newMovieArray = new Array();
    let movieArray = new Array();
    let found = false;

    await firebase.usersArray.forEach(function(user, index){
      if(user.uniqueId === uniqueId){                          //FIREBASE IS RETARDED !!!
        console.log(`processFavoriteMovies - user.favorites: ${JSON.stringify(user.favorites)}`);  //Array of key: movieId object pairs. ie: 'SomeIdUsedAsKey': {movieId: 33432}

        newMovieArray = [];
        movieArray = Object.values(user.favorites);   //Array of just movieId Objects. ie: {movieId: 33432}

        movieArray.forEach(function(movie, index){
          console.log(`MovieID: ${movie.movieId}`);
          newMovieArray.push(movie.movieId);              //Array of just movie ids
        });
        console.log(`newMovieArray: ${newMovieArray}`);

        found = true;
      }
    });
    if(found){
      resolve(newMovieArray);
    }else{
      console.log("ERROR: Could Not Get Favorite Movies Data");
      reject();
    }
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
