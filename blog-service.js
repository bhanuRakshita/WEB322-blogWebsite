const { log } = require("console");
const fs = require("fs");
const { resolve } = require("path");

var posts = [];
var categories = [];

function initialize() {
    return new Promise((resolve, reject)=>{
        fs.readFile('./data/posts.JSON','utf8',(err, postData)=>{
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

            fs.readFile('./data/categories.JSON','utf8',(err, categoryData)=>{
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

module.exports = {initialize, getAllPosts, getPublishedPosts, getCategories}; 






