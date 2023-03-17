const fs = require("fs"); 

var posts = [];
var categories = [];

var exports = module.exports = {}

var readPosts = function () {
    return new Promise(function (resolve, reject){
        fs.readFile('./data/posts.json', function (err, data){
            if(!err){
                posts = JSON.parse(data)
                resolve();
            }else{
                reject("unable to read file")
            }
        })
    })
}

var readCategories = function () {
    return new Promise(function (resolve, reject){
        fs.readFile('./data/categories.json', function (err, data){
            if(!err){
                categories = JSON.parse(data)
                resolve();
            }else{
                reject("unable to read file")
            }
        })
    })
}


exports.getAllPosts = function(){
    return new Promise(function (resolve, reject){
        if(posts.length){
            resolve(posts)
        }
        else{
            console.log("no results returned")
            reject();
        }
    })
}

exports.getPublishedPosts = function(){

    var isPublished = posts.filter(
        function (posts) {
            return posts.published == true;
        }
    )

    return new Promise(function (resolve, reject){
        if(!isPublished.length){
            console.log("no results returned")
            reject();
        }
        else{
            resolve(isPublished)
        }
    })
}

exports.getCategories = function(){
    return new Promise(function (resolve, reject){
        if(!categories.length){
            console.log("no results returned")
            reject();
        }
        else{
            resolve(categories)
        }
    })
}

exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        readPosts().then(readCategories).then(function () {
            resolve()
        })
        .catch(function (errmsg){
            console.log(errmsg)
            reject(errmsg);
        })
    })
}

// NEW 
const d = new Date();
let currentDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
exports.addpost = function(postData){
    if(!postData.published){
        postData.published = false;
    } else{
        postData.published = true;
    }   
    postData.id = posts.length+1;
    postData.hireDate = currentDate;
    posts.push(postData);
    return new Promise((resolve, reject) => {
        resolve(posts);
        if(posts.length == 0){
            reject("Nothing found");
        }        
    });
};

exports.getPostByCategory = function(category){
    return new Promise((resolve, reject) => {
        let filteredPost = posts.filter(posts => posts.category == category);
        resolve(filteredPost);
        if(filteredPost.length == 0){
            reject("no results returned");
        }        
    });
}

exports.getPostsByMinDate = function(minDate){
    return new Promise((resolve, reject) => {
        let filteredPost = posts.filter(posts => posts.postDate >= minDate);
        resolve(filteredPost);
        if(filteredPost.length == 0){
            reject("no results returned");
        }        
    });
}

exports.getPostById = function(id){
    return new Promise((resolve, reject) => {
        let filteredPost = posts.filter(posts => posts.id == id);
        resolve(filteredPost);
        if(filteredPost.length == 0){
            reject("no results returned");
        }        
    });
}

exports.getPublishedPostByCategory = function(category){

    var isPublishedWithCategory = posts.filter(
        function (posts) {
            return posts.published == true && posts.category == category;
        }
    )

    return new Promise(function (resolve, reject){
        if(!isPublishedWithCategory.length){
            console.log("no results returned")
            reject();
        }
        else{
            resolve(isPublishedWithCategory)
        }
    })
}
exports.getPublishedPostById = function(id){

    var getPublishedPostById = posts.filter(
        function (posts) {
            return posts.published == true && posts.id == id;
        }
    )

    return new Promise(function (resolve, reject){
        if(!getPublishedPostById.length){
            console.log("no results returned")
            reject();
        }
        else{
            resolve(getPublishedPostById)
        }
    })
}