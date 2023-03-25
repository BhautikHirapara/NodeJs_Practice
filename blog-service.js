// const fs = require("fs"); 

// var posts = [];
// var categories = [];

const Sequelize = require('sequelize');
var sequelize = new Sequelize('vpmbdmqu', 'vpmbdmqu', '2GfMwsj6URsryAteltTFSi6LERsWO-3h', {
    host: 'isilo.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

   var Post = sequelize.define('Post', {
    postId: {
        type: Sequelize.INTEGER
    },
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    category: Sequelize.INTEGER,
    isPublished: Sequelize.BOOLEAN
});

   var Category = sequelize.define('Category', {
    categoryId: {
        type: Sequelize.INTEGER
    },
    category: Sequelize.STRING
});

var exports = module.exports = {}

// var readPosts = function () {
//     return new Promise(function (resolve, reject){
//         fs.readFile('./data/posts.json', function (err, data){
//             if(!err){
//                 posts = JSON.parse(data)
//                 resolve();
//             }else{
//                 reject("unable to read file")
//             }
//         })
//     })
// }

// var readCategories = function () {
//     return new Promise(function (resolve, reject){
//         fs.readFile('./data/categories.json', function (err, data){
//             if(!err){
//                 categories = JSON.parse(data)
//                 resolve();
//             }else{
//                 reject("unable to read file")
//             }0
//         })
//     })
// }

exports.initialize = function () {
    // return new Promise(function (resolve, reject) {
    //     readPosts().then(readCategories).then(function () {
    //         resolve()
    //     })
    //     .catch(function (errmsg){
    //         console.log(errmsg)
    //         reject(errmsg);
    //     })
    // })
    return new Promise((resolve, reject) => {
        sequelize.sync().then(function(Post){
            resolve();
        }).then(function(Category){
            resolve();
        }).catch(function(){
            reject("unable to sync the database");
        });

    });
}

exports.getAllPosts = function(){
    // return new Promise(function (resolve, reject){
    //     if(posts.length){
    //         resolve(posts)
    //     }
    //     else{
    //         console.log("no results returned")
    //         reject();
    //     }
    // })
    return new Promise((resolve, reject)=>{
        sequelize.sync().then(function(){
            resolve(Post.findAll());
        }).catch(function(){
            reject("NO result returned");
        });
    });
}

exports.getPublishedPosts = function(){

    // var isPublished = posts.filter(
    //     function (posts) {
    //         return posts.published == true;
    //     }
    // )

    // return new Promise(function (resolve, reject){
    //     if(!isPublished.length){
    //         console.log("no results returned")
    //         reject();
    //     }
    //     else{
    //         resolve(isPublished)
    //     }
    // })
    return new Promise((resolve, reject) =>{
        sequelize.sync().then(function() {
         resolve(Post.findAll({
             where: {
                 isPublished: true
             }
         }));  
     }).catch(function(){
         reject("no results returned");
     })
 });
}

// exports.getCategories = function(){
    // return new Promise(function (resolve, reject){
    //     if(!categories.length){
    //         console.log("no results returned")
    //         reject();
    //     }
    //     else{
    //         resolve(categories)
    //     }
    // })
//     return new Promise(function (resolve, reject) {
//         Category.findAll().then((data) => {
//             console.log("success")
//             resolve(data);
//         }).catch(() => {
//             reject("get category error");
//             console.log("errorrrrrrrrrrr")
//         })
//     });
// }
exports.getCategories = function () {
    return new Promise(function (resolve, reject) {
        Category.findAll().then((data) => {
            console.log("success")
            resolve(data);
        }).catch(() => {
            reject("getCategory error");
            console.log("error")
        })
    });
}


// NEW 
// const d = new Date();
// let currentDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
exports.addpost = function(postData){
    // if(!postData.published){
    //     postData.published = false;
    // } else{
    //     postData.published = true;
    // }   
    // postData.id = posts.length+1;
    // postData.hireDate = currentDate;
    // posts.push(postData);
    // return new Promise((resolve, reject) => {
    //     resolve(posts);
    //     if(posts.length == 0){
    //         reject("Nothing found");
    //     }        
    // });
    return new Promise((resolve, reject)=>{
        // ensure the isManager value is explicitly set to boolean
        postData.isPublished = (postData.isPublished) ? true : false;
        // Any blank values in employeeData are set to null 
        for(var prop in postData){
            if(postData[prop] == ""){
                postData[prop] = null;
            }
        }
    sequelize.sync().then(function(){
        resolve(Post.create({
            title: postData.title,
            body: postData.body,
            isPublished: postData.isPublished,
            category: postData.category}));    
        }).catch(function(){
            reject("unable to create Post");
        });
    });
};

exports.getPostByCategory = function(category){
    // return new Promise((resolve, reject) => {
    //     let filteredPost = posts.filter(posts => posts.category == category);
    //     resolve(filteredPost);
    //     if(filteredPost.length == 0){
    //         reject("no results returned");
    //     }        
    // });
    return new Promise((resolve, reject) =>{
        sequelize.sync().then(function() {
         resolve(Post.findAll({
             where: {
                 category: category
             }
         }));  
     }).catch(function(){
         reject("no results returned");
     })
 });
}

exports.getPostsByMinDate = function(minDate){
    // return new Promise((resolve, reject) => {
    //     let filteredPost = posts.filter(posts => posts.postDate >= minDate);
    //     resolve(filteredPost);
    //     if(filteredPost.length == 0){
    //         reject("no results returned");
    //     }        
    // });
    return new Promise((resolve, reject) =>{
        sequelize.sync().then(function() {
            const { gte } = Sequelize.Op;
         resolve(Post.findAll({
             where: {
                 postDate: {
                    [gte]: new Date(minDate)
                 }
             }
         }));  
     }).catch(function(){
         reject("no results returned");
     })
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
exports.updatePost = function (data) {
    return new Promise ((resolve, reject)=>{
        empData.isPublished = (postData.isPublished) ? true : false;
        for(var prop in postData){
            if(postData[prop] == ""){
                postData[prop] = null;
            }
        }
        sequelize.sync().then(function(){
            resolve(Post.update({
                body: Sequelize.TEXT,
                title: Sequelize.STRING,
                postDate: Sequelize.DATE,
                featureImage: Sequelize.STRING,
                category: Sequelize.INTEGER,
                isPublished: Sequelize.BOOLEAN
            }, {
                where: { postId: postData.postId }
            }));
        }).catch(function(){
            reject("unable to update employee");
        });
    });
}

exports.getPublishedPostByCategory = function(category){

    // var isPublishedWithCategory = posts.filter(
    //     function (posts) {
    //         return posts.published == true && posts.category == category;
    //     }
    // )

    // return new Promise(function (resolve, reject){
    //     if(!isPublishedWithCategory.length){
    //         console.log("no results returned")
    //         reject();
    //     }
    //     else{
    //         resolve(isPublishedWithCategory)
    //     }
    // })
    return new Promise((resolve, reject) => {
        sequelize.sync().then(function(){
            resolve(Post.findAll({
                where: {
                    isPublished: true,
                    category: category
                }
            }));         
        }).catch(function(){
            reject("No results returned");
        });
    })
}
exports.getPublishedPostById = function(id){

    // var getPublishedPostById = posts.filter(
    //     function (posts) {
    //         return posts.published == true && posts.id == id;
    //     }
    // )

    // return new Promise(function (resolve, reject){
    //     if(!getPublishedPostById.length){
    //         console.log("no results returned")
    //         reject();
    //     }
    //     else{
    //         resolve(getPublishedPostById)
    //     }
    // })
    return new Promise((resolve, reject) => {
        sequelize.sync().then(function(){
            resolve(Post.findAll({
                where: {
                    isPublished: true,
                    postId: id
                }
            }));         
        }).catch(function(){
            reject("No results returned");
        });
    })
}

exports.addCategory = function (categoryData) {
    for (const prop in categoryData) {
        if (categoryData[prop] == "") {
            categoryData[prop] = null;
        }
    }
    console.log("HAHA CATEGORYDATA B342" + categoryData);
    console.log("HAHA CATEGORYNAME B342" + categoryData.categoryName);
    return new Promise(function (resolve, reject) {
        Category.create({
            categoryName: categoryData.categoryName
        }).then(() => {
            resolve("add new category");
        }).catch(() => {
            reject("unable to create category");
        });
    });
}

exports.deletePostById = function(id){
    return new Promise((resolve, reject)=>{
        sequelize.sync().then(()=>{
            resolve(Post.destroy({
                where: {PostId: id}
            }));
        }).catch(()=>{
            reject("unable to delete Post");
        })

    });
}

exports.deleteCategoryById = function(id){
    return new Promise((resolve, reject)=>{
        sequelize.sync().then(()=>{
            resolve(Category.destroy({
                where: {CategoryId: id}
            }));
        }).catch(()=>{
            reject("unable to delete Category");
        })

    });
}

