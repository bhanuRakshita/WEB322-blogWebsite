/*********************************************************************************
*  WEB322 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Bhanu Rakshita Paul   Student ID:143428217    Date: March 24, 2023
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
const exphbs = require("express-handlebars");
const stripJs = require('strip-js');

const app = express();

var HTTP_PORT = process.env.PORT || 8080;

//configure cloudify account
cloudinary.config({
    cloud_name: 'dmmqrv9qy',
    api_key: '346676871177481',
    api_secret: 'VK1e9j_vd8B96PjZsKgi8EOhWmA',
    secure: true
});

//configure handlebars
app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    helpers: {
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },

        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        },
        
        safeHTML: function(context){
            return stripJs(context);
        },

        formatDate: function(dateObj){
            let year = dateObj.getFullYear();
            let month = (dateObj.getMonth() + 1).toString();
            let day = dateObj.getDate().toString();
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2,'0')}`;
        }        
       
    }
}));
app.set('view engine', '.hbs');

const upload = multer(); //no disk storage

app.use(express.static('public'));

//fix navigation bar issue
app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    app.locals.viewingCategory = req.query.category;
    next();
});

app.use(express.urlencoded({extended: true}));

app.get("/", (req,res)=>{
    res.redirect("/blog");
});

app.get("/about", (req,res)=>{
    res.render(__dirname+"/views/about")
});

app.get('/blog', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try{

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts = await blogService.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await blogService.getPublishedPosts();
        }

        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        // get the latest post from the front of the list (element 0)
        let post = posts[0]; 

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;
        viewData.post = post;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        // Obtain the full list of "categories"
        let categories = await blogService.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})

});

app.get('/blog/:id', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try{

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts = await blogService.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await blogService.getPublishedPosts();
        }

        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        // Obtain the post by "id"
        viewData.post = await blogService.getPostById(req.params.id);
    }catch(err){
        viewData.message = "no results"; 
    }

    try{
        // Obtain the full list of "categories"
        let categories = await blogService.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})
});

app.get("/posts", (req,res)=>{

    var category=req.query.category;
    var minDate=req.query.minDate;

    if (category) {
        blogService.getPostsByCategory(category)
        .then((postData)=>{
            res.render("posts", {posts: postData});
        })
        .catch((err)=>{
            res.render("posts", {message: err});
        });
    }
    
     else if (minDate) {
        blogService.getPostsByMinDate(minDate)
        .then((postData)=>{
            res.render("posts", {posts: postData});
        })
        .catch((err)=>{
            res.render("posts", {message: err});
        });
    }

    else{
        blogService.getAllPosts()
        .then((postsData)=>{
            res.render("posts", {posts: postsData});
        })
        .catch((err)=>{
            res.render("posts", {message: err});
        });
    }
    
});

app.get("/post/:value", (req,res)=>{
    blogService.getPostById(req.params.value)
        .then((postData)=>{
            res.render("posts", {posts: postData});
        })
        .catch((err)=>{
            res.render("posts", {message: err});
        });
});

app.get("/categories", (req,res)=>{
    blogService.getCategories()
    .then((categoriesData)=>{
        res.render("categories", {categories: categoriesData});
    })
    .catch((err)=>{
        res.render("categories", {message: err});
    })
});

app.get("/posts/add", (req, res)=>{

    blogService.getCategories()
    .then((categoryList)=>{
        res.render("addPost", {categories: categoryList});
    })
    .catch((err)=>{
        res.render("addPost", {categories: []});
    })
});

app.get("/categories/add", (req, res)=>{
    res.render(path.join(__dirname, "/views/addCategory"));
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
        return result;
    }
    
    upload(req).then((uploaded)=>{
        req.body.featureImage = uploaded.url;
    
        //Process the req.body and add it as a new Blog Post before redirecting to /posts
        blogService.addPost(req.body)
        .then(
            res.redirect("/posts")
        )
        .catch((err)=>{
            res.render("posts", {message:err});
        })
        
    })
    .catch((err)=>{res.send("error uploading post. ERR is: "+err)});    
});



app.post("/categories/add", (req, res) => {
    //Process the req.body and add it as a new Blog Post before redirecting to /posts
        blogService.addCategory(req.body)
        .then(()=>{
            res.redirect("/categories");
        })
        .catch((err)=>{
            res.render("categories", {message: err});
        });
});

app.get("/category/delete/:id", (req, res)=>{
    blogService.deleteCategoryById(req.params.id)
    .then(()=>{
        res.redirect("/categories")
    })
    .catch((err)=>{
        res.status(500).send("error: "+err)
    });
});

app.get("/post/delete/:id", (req, res)=>{
    blogService.deletePostById(req.params.id)
    .then(()=>{
        res.redirect("/posts")
    })
    .catch((err)=>{
        res.status(500).send("error: "+err)
    });
});


app.use((req,res) => {
    res.status(404).render(path.join(__dirname, "/views/notFound")); 
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
