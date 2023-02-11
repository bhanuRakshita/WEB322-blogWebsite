/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Bhanu Rakshita Paul   Student ID:143428217    Date: February 11, 2023
*
*  Online (Cyclic) Link: https://nutty-worm-hoodie.cyclic.app
*
********************************************************************************/ 


const express = require("express");
var path = require("path")
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const blogService = require("./blog-service");

const app = express();

var HTTP_PORT = process.env.PORT || 8080;

//configure cloudify account
cloudinary.config({
    cloud_name: 'dmmqrv9qy',
    api_key: '346676871177481',
    api_secret: 'VK1e9j_vd8B96PjZsKgi8EOhWmA',
    secure: true
});

const upload = multer(); //no disk storage

app.use(express.static('public'));

app.get("/", (req,res)=>{
    res.redirect("/about");
});

app.get("/about", (req,res)=>{
    res.sendFile(__dirname+"/views/about.html")
});

app.get("/blog", (req,res)=>{
    blogService.getPublishedPosts()
    .then((pubPostsData)=>{
        res.send(pubPostsData);
    })
    .catch((err)=>{
        console.log({message:err});
    })
});

app.get("/posts", (req,res)=>{
    
    blogService.getAllPosts()
    .then((postsData)=>{
        res.send(postsData);
    })
    .catch((err)=>{
        console.log({message:err});
    })
});

app.get("/categories", (req,res)=>{
    blogService.getCategories()
    .then((categoriesData)=>{
        res.send(categoriesData);
    })
    .catch((err)=>{
        console.log({message:err});
    })
});

app.get("/posts/add", (req, res)=>{
    res.sendFile(path.join(__dirname, "/views/addPost.html"));
});

app.post("/posts/add", upload.single("featureImage"), (req, res) => {
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
    
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };
    
    async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        return result;
    }
    
    upload(req).then((uploaded)=>{
        req.body.featureImage = uploaded.url;
    
        // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
        blogService.addPost(req.body);
        res.redirect("/posts");
    });    
});


app.use((req,res) => {
    res.status(404).sendFile(path.join(__dirname, "/views/addPost.html")); 
});

blogService.initialize().then(
    app.listen(HTTP_PORT, (req,res)=>{
        console.log("Express http server listening on "+ HTTP_PORT);
    })
).catch(
    (err)=>{
        console.log({message:err});
    }
)
