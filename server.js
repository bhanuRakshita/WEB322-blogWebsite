/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Bhanu Rakshita Paul   Student ID:143428217    Date: February 3, 2023
*
*  Online (Cyclic) Link: https://nutty-worm-hoodie.cyclic.app
*
********************************************************************************/ 


const express = require("express")
const blogService = require("./blog-service") 
const app = express()

var HTTP_PORT = process.env.PORT || 8080;

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

    var category=req.query.category;
    var minDate=req.query.minDate;

    if (category) {
        blogService.getPostsByCategory(category)
        .then((postData)=>{
            res.send(postData);
        })
        .catch((err)=>{
            res.json({"message":err});
        });
    }
    
     else if (minDate) {
        blogService.getPostsByMinDate(minDate)
        .then((postData)=>{
            res.send(postData);
        })
        .catch((err)=>{
            res.json({"message":err});
        });
    }

    else{
        blogService.getAllPosts()
        .then((postsData)=>{
            res.send(postsData);
        })
        .catch((err)=>{
            console.log({message:err});
        });
    }
    
});

app.get("/post/:value", (req,res)=>{
    blogService.getPostById(req.params.value)
        .then((postData)=>{
            res.send(postData);
        })
        .catch((err)=>{
            res.json({"message":err});
        });
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

app.use((req,res) => {
    res.status(404).sendFile(__dirname+"/views/notFound.html");
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
