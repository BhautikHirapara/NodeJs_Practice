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

exports.initialize = function () {
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
    return new Promise((resolve, reject)=>{
        sequelize.sync().then(function(){
            resolve(Post.findAll());
        }).catch(function(){
            reject("NO result returned");
        });
    });
}

exports.getPublishedPosts = function(){
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

exports.getCategories = function () {
    return new Promise(function (resolve, reject) {
        Category.findAll().then((data) => {
            console.log("success")
            resolve(data);
        }).catch(() => {
            reject("getCategory error");
            console.log("errorrrrrrrrrr")
        })
    });
}


exports.addpost = function(postData){
    return new Promise((resolve, reject)=>{
        postData.isPublished = (postData.isPublished) ? true : false;
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
            postDate: currentDate,
            category: postData.category}));    
        }).catch(function(){
            reject("unable to create Post");
        });
    });
};

exports.getPostByCategory = function(category){
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
        postData.isPublished = (postData.isPublished) ? true : false;
        for(var prop in postData){
            if(postData[prop] == ""){
                postData[prop] = null;
            }
        }
        sequelize.sync().then(function(){
            resolve(Post.update({
                title: postData.title,
                body: postData.body,
                isPublished: postData.isPublished,
                postDate: currenttDate,
                category: postData.category
            }, {
                where: { postId: postData.postId }
            }));
        }).catch(function(){
            reject("unable to update employee");
        });
    });
}

exports.getPublishedPostByCategory = function(category){

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
    return new Promise(function (resolve, reject) {
        Category.create({
            category: categoryData.category
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

