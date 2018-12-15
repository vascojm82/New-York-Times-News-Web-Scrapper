let express = require('express');
let router = express.Router();
let request = require('request');   //'request' module, not the same as the 'req' object
let helper = require('../helpers');
let passport = require('passport');
let cheerio = require('cheerio');
let jSON = require('circular-json');
let route = express();
let nytUrl = "https://www.nytimes.com/section/world";
route.locals.flag = 0;

router.use((req, res, next) => {
  res.locals.flag = route.locals.flag;
  console.log('middleware --- res.locals.flag: ' + res.locals.flag);
  next();   //DON'T FORGET 'next()' OR THE REQUEST CYCLE ENDS AND IT DOESN"T CONTINUE TO THE NEXT ROUTE
});

// Home Route (index)
router.get('/', function(req, res, next) {
  const sessionId =  req.session.id;

  if(typeof sessionId === 'undefined'){
    sessionId = '';
  }

  console.log("user ---Index Route---: " + req.user);

  res.render('index', {
    user: req.user,
    sessionId: sessionId
  });
});

/* GET scrape page. */
router.get('/scrape', function(req, res, next) {
  const sessionId =  req.session.id;

  if(typeof sessionId === 'undefined'){
    sessionId = '';
  }

  request.get(nytUrl, function(error, response, data){
    let $ = cheerio.load(data);
    let articles   = [];
    let articlesList = $(".story-menu").find(".story-body");

    articlesList.each((index, element) => {
      let image = $(element).parent().find("figure.media").find("img").attr("src") || $(element).find('div.wide-thumb img').attr("src");

      articles.push({
        headline: ($(element).find("h2.headline").children('a').length)? $(element).find("h2.headline a").text().trim(): $(element).find("h2.headline").text().trim(),
        description: $(element).find("p.summary").text().trim(),
        url: $(element).find("a").attr("href"),
        img: image
      });
    });

    console.log("user --- Scraper Route ---: " + req.user);

    res.render('scrape', {
      jsonData: articles,
      user: req.user,
      sessionId: sessionId
      });
  });
});

router.get('/favorites',[helper.isAuthenticated, function(req, res, next) {
  const uniqueId  = req.user._id;
  const sessionId =  req.session.id;

  console.log("req.user: " + req.user)

  if(typeof sessionId === 'undefined'){
    sessionId = '';
  }

  console.log(`GETTING FAVORITES!`);
  console.log(`/favorites - uniqueId: ${uniqueId}`);
  console.log(`/favorites - sessionId: ${sessionId}`);
  helper.getFavorites(uniqueId)
    .then((data) => {
      console.log("SUCCESS GETTING FAVORITES data: " + JSON.stringify(data));
      res.render('scrape', {
        jsonData: data,
        user: req.user,
        sessionId: sessionId
      });
    }).catch((error) => {
      console.log("ERROR GETTING FAVORITES");
    });
}]);

router.post('/favorites', function(req, res, next) {
  let uniqueId  = req.user._id || '';
  let sessionId = req.session.id;
  let record = req.body;

  console.log("uniqueId --- Favorites Route ---: " + req.user._id);
  console.log("record: " + jSON.stringify(record));

  helper.addFavorites(uniqueId, record ,sessionId).then((data) => {
    console.log("Added to Favorites");
    res.json({success: "Added to Favorites"});
  }).catch((error) => {
    console.log("Failed Adding to Favorites");
    res.json({error: error});
  });
});

router.post('/lockUserModal', function(req, res, next){
  if(route.locals.flag < 1)
    route.locals.flag = route.locals.flag + 1;
  res.json({success: "User Modal Locked"});
});

router.get('/login', function(req, res, next){
  res.render('login');
});

router.get('/logout', (req, res, next) => {
  if(route.locals.flag > 0)
    route.locals.flag = route.locals.flag - 1;
  req.logout();
  res.redirect('/');
});

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }), function(req, res, next){console.log("Twitter Auth Callback ran !");});

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github', { successRedirect: '/', failureRedirect: '/login' }), (req, res, next) => {console.log("Twitter Auth Callback ran !");});


// 404 for all other requests
router.get('*', function (req, res, next){
  res.render('404');
});

module.exports = router;
