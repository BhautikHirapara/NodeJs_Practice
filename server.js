const express = require("express");
const app = express();
const path = require('path');
var bodyParser = require("body-parser");
var blogservice = require('./blog-service')
const streamifier = require('streamifier')
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
var bodyParser = require("body-parser"); //Part3.Step1
var exphbs = require('express-handlebars');
const fs = require('fs')
const stripJs = require('strip-js');
const blogServiceAuth = require("./auth-service");
const clientSessions = require('client-sessions');

const PORT = process.env.PORT || 8080;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

cloudinary.config({
  cloud_name: 'de8drwp58',                            
  api_key: '159179789522737',                         
  api_secret: 'AADebmc5mmL1_fKROdA-GCfOhO8',          
  secure: true
});

const upload = multer();

app.get('/', function(req, res){
    res.redirect('blog');
})

app.get("/about", function (req, res) {
  res.render("about");
});

function onHttpStart() {
  console.log("Express http server listening on " + PORT); 
}

app.use(clientSessions({
  cookieName: "session",
  secret: "Prashant", 
  duration: 2 * 60 * 1000, 
  activeDuration: 1000 * 60 
})
);


app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
};

// blogservice.initialize().then(() => { 
//   app.listen(PORT, onHttpStart);}).catch((errmsg) => {
//   console.error(errmsg + "I'm from server.js");
// })
blogservice.initialize().then(blogServiceAuth.initialize()).then(() => {
  app.listen(PORT, onHttpStart);
}).catch((errmsg) => {
  console.error(errmsg + " this is from server.js");
});

app.get('/posts', ensureLogin, function(req, res){
  if(req.query.category)  {
    blogservice.getPostByCategory(req.query.category)
    .then((data) => res.render("posts",{posts:data, message: "no results" }))
    .catch(() => res.render("posts",{message: "no results"}))
  }else if(req.query.minDate){
    blogservice.getPostsByMinDate(req.query.minDate)
    .then((data) => res.render("posts",{posts:data, message: "no results" }))
    .catch(() => res.render("posts",{message: "no results"}))
  }  else{
    blogservice.getAllPosts()
    .then((data) => res.render("posts",{posts:data}))
    .catch(() => res.render("posts",{message: "no results"}))
  }
})


app.get("/posts/add", ensureLogin, async (req, res) => {
  blogservice.getCategories()
  .then((data)=> res.render("addPost", {categories: data}))
  .catch(() => res.render("addPost", {categories: []}))
});

app.post("/post/update", ensureLogin, function(req, res){
  blogservice.updatePost(req.body)
  .then(res.redirect('/posts'))
});

app.post("/posts/add", ensureLogin, upload.single('image'), function (req, res) {
  console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
  blogservice.addpost(req.body)
  .then(res.redirect('/posts'))
  .catch((err) => res.json({"message": err})) 
  console.log("qqqqqqqqqqqqqqqqqqqqqq")
  
  console.log(req.body)
  
  
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
          );
          // streamifier.createReadStream(req.file.buffer).pipea(stream);
    });
};

async function upload(req) {
  let result = await streamUpload(req);
  console.log(result);
}

upload(req);

console.log("eeeeeeeeeseeeeeeeeeeeeeeeeeeeee")

});

app.get('/blog', async (req, res) => {
  
  let viewData = {};

  try{
      let posts = [];

      if(req.query.category){
          posts = await blogservice.getPublishedPostByCategory(req.query.category);
      }else{
          posts = await blogservice.getPublishedPosts();
      }

      posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

      let post = posts[0]; 

      viewData.posts = posts;
      viewData.post = post;
  }catch(err){
      viewData.message = "no results";
  }

  try{
      let categories = await blogservice.getCategories();
      viewData.categories = categories;
  }catch(err){
      viewData.categoriesMessage = "no results"
  }

  res.render("blog", {data: viewData,  message: "no results"})

});


app.get('/blog/:id', async (req, res) => {

  let viewData = {};

  try{

      let posts = [];

      if(req.query.category){
          posts = await blogservice.getPublishedPostByCategory(req.query.category);
      }else{
          posts = await blogservice.getPublishedPosts();
      }

      posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

      viewData.posts = posts;

  }catch(err){
      viewData.message = "no results";
  }

  try{
      viewData.post = await blogservice.getPostById(req.params.id);
  }catch(err){
      viewData.message = "no results"; 
  }

  try{
      let categories = await blogservice.getCategories();

      viewData.categories = categories;
  }catch(err){
      viewData.categoriesMessage = "no results"
  }

  res.render("blog", {data: viewData,  message: "no results"})
});

app.get("/categories", ensureLogin, function(req,res) {
  blogservice.getCategories().then(function(data) {
    res.render("category", { data });
  }).catch(function(err) {
    res.render("category", { message: "error" });
  });
});

app.get('/posts/:id', ensureLogin, (req, res) => {
  blogservice.getPostById(req.params.id)
  .then((data) => {res.json(data);})
});

//Assign4
app.engine('.hbs', exphbs({ 
  extname: '.hbs',
  defaultLayout:'main',
  helpers:{
    navLink:function(url, options){
        return '<li' + 
          ((url==app.locals.activeRoute)? ' class="active"':'')+
          '><a href="'+url+'">'+options.fn(this)+'</a></li>';
    },
    equal:function(lvalue, rvalue, options){
        if(arguments.length<3)
            throw new Error("Handlerbars Helper equal needs 2 parameters");
        if(lvalue != rvalue){
            return options.inverse(this);
        } else{
            return options.fn(this);
        }
    }
  }
}));
app.set('view engine', '.hbs');

app.use(function(req,res,next){
  let route=req.baseUrl + req.path;
  app.locals.activeRoute = (route=="/")? "/":route.replace(/\/$/,"");
  next();
}); 

app.use(function(req,res,next){
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
  app.locals.viewingCategory = req.query.category;
  next();
});

// assi. 5

app.get("/categories/add", ensureLogin, function(req,res) {
  res.render("addCategory");
});

app.post("/categories/add", ensureLogin, function(req,res) {
  blogservice.addCategory(req.body).then(function(data) {
    res.redirect('/categories');
  }).catch(function(err) {
    res.status(500).send("Unable to Add");
  })
});

app.get("/categories/delete/:categoryId", ensureLogin, function (req, res) {
  blogservice.deleteCategoryById(req.params.id).then((data) => {
    res.redirect("/categories");
    console.log(data);
  }).catch((data) => {
    console.log(data);
    res.status(500).render({
      message: "Unable to Remove Category / Category not found"
    });
  })
})

app.get("/posts/delete/:postId", ensureLogin, function (req, res) {
  blogservice.deletePostById(req.params.id).then((data) => {
    res.redirect("/posts");
    console.log(data);
  }).catch((data) => {
    console.log(data);
    res.status(500).render({
      message: "Unable to Remove Post / Post not found"
    });
  })
})

app.get('/login', (req, res) => {
  res.render('login');
});


app.post('/login', (req, res) => {
  req.body.userAgent = req.get('User-Agent');
  blogServiceAuth.checkUser(req.body)
    .then((user) => {
      req.session.user = {
        userName: user.userName,
        email: user.email,
        loginHistory: user.loginHistory
      }
      res.redirect('/blog');
    }).catch((err) => {
      res.render('login', { errorMessage: err, userName: req.body.userName });
    });
});


app.get("/register", (req, res) => {
  res.render('register');
});

app.post("/register", (req, res) => {
  blogServiceAuth.registerUser(req.body)
    .then((value) => {
      res.render('register', { successMessage: "User created" });
    }).catch((err) => {
      res.render('register', { errorMessage: err, userName: req.body.userName });
    })
});


app.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect('/');
});


app.get("/userHistory", ensureLogin, (req, res) => {
  res.render('userHistory');
});

app.use((req, res) => {
  res.render("404");
});