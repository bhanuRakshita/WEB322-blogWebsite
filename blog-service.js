const { log } = require("console");
const fs = require("fs");
const path = require("path");

var posts = [];
var categories = [];

function initialize() {
    return new Promise((resolve, reject)=>{
        fs.readFile(path.join(__dirname, "data", "posts.json"),'utf8',(err, postData)=>{
            if(err) reject("Unable to read file.");
            // console.log(data);
            try {
                posts = JSON.parse(postData);
              
            } catch (error) {
                if (error instanceof SyntaxError) {
                  console.error('Invalid JSON:', error.message);
                } else {
                  reject("couldn't load posts");
                }
              }

            fs.readFile(path.join(__dirname, "data", "categories.json"),'utf8',(err, categoryData)=>{
                if(err) reject("Unable to read file.");
                try {
                    categories = JSON.parse(categoryData);
                  
                } catch (error) {
                    if (error instanceof SyntaxError) {
                      console.error('Invalid JSON:', error.message);
                    } else {
                        reject("couldn't load categories");
                    }
                  }
            })

            resolve();
        })
    });
}

function getAllPosts(){
    return new Promise((resolve, reject)=>{
        if(posts.length==0){
            reject("No results returned")
        }
        // console.log(posts);
        resolve(posts);
    })
}

function getPublishedPosts(){
    return new Promise((resolve, reject)=>{
        var publishedPosts = [];
        if(posts.length==0){
            reject("NO results returned.")
        }
        posts.forEach((post)=>{
            if(post.published == true){
                publishedPosts.push(post);
            }
        }) 
        
        resolve(publishedPosts);
    })
}

function getCategories(){
    return new Promise((resolve, reject)=>{
        if(categories.length==0){
            reject("No categories returned")
        }
        // console.log(posts);
        resolve(categories);
    })
}

<<<<<<< HEAD
function addPost(postData){
    return new Promise((resolve, reject)=>{
        if(postData.published==undefined){
            postData.published=false;
        } else{postData.published=true;};

        postData.id = posts.length+1;
        posts.push(postData);
        resolve(postData);
    })
}

module.exports = {initialize, getAllPosts, getPublishedPosts, getCategories, addPost}; 
=======
function getPostsByCategory(category){
    var postsByCat=[];
    posts.forEach(post => {
        if (post.category==category) {
            postsByCat.push(post);
        }
    })
    return new Promise((resolve, reject)=>{
        if (postsByCat.length==0) {
            reject("NO results returned using category.")
        }
        resolve(postsByCat);
    });
}

function getPostsByMinDate(minDateStr){
    var postsByDate=[];
    posts.forEach(post => {
        if(new Date(post.postDate) >= new Date(minDateStr)){
            postsByDate.push(post);
        } 
    })
    return new Promise((resolve, reject)=>{
        if (postsByDate.length==0) {
            reject("NO results returned using min date.")
        }
        resolve(postsByDate);
    });
}

function getPostById(id){
    var postById;
    posts.forEach( post =>{
        if(id==post.id){
            postById = post;
        }
    })
    return new Promise((resolve, reject)=>{
        if (!postById) {
            reject("NO result returned using id")
        }
        resolve(postById);
    });
}

module.exports = {initialize, getAllPosts, getPublishedPosts, getCategories, getPostsByCategory, getPostsByMinDate, getPostById}; 
>>>>>>> 113fa6d8ebd28f5eff1a82f4993eea571c86d6ae






