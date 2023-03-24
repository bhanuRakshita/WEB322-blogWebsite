const Sequelize = require('sequelize');
var sequelize = new Sequelize('pmtxngry', 'pmtxngry', 'peBR_KzAuqWFwbBEF7CuzL-7kPuUXRAF', {
    host: 'ruby.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

const Post = sequelize.define('Post', {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN
});

const Category = sequelize.define('Category', {
    category: Sequelize.STRING
});

Post.belongsTo(Category, {foreignKey: 'category'});

function initialize() {
    return new Promise((resolve, reject) => {
      sequelize
        .sync()
        .then(() => {
          console.log("Database synced successfully.");
          resolve();
        })
        .catch((error) => {
          reject("Unable to sync the database");
        });
    });
  }

function getAllPosts(){
    return new Promise((resolve, reject)=>{
        Post.findAll()
            .then((data)=>{        
            if(data.length>0){
                resolve(data);
            } else {
                reject("No results found")
            }
        }).catch((err)=>{
            console.log("//////////////////////////////");
            console.log(err);
            reject("Error fetching results");
        });
    })
}

function getPostsByCategory(category){
    return new Promise((resolve, reject)=>{
        Post.findAll({where: { category: category}})
        .then((data)=>{        
            if(data.length>0){
                resolve(data);
            } else {
                reject("No results found with that category")
            }
        }).catch((err)=>{
            reject("Error fetching results");
        });
    })
}

function getPostsByMinDate(minDateStr){
    return new Promise((resolve, reject)=>{
        Post.findAll({
            where: {
                postDate: {
                    [gte]: new Date(minDateStr)
                }
            }
        })
        .then((data)=>{        
            if(data.length>0){
                resolve(data);
            } else {
                reject("No results found using date")
            }
        }).catch((err)=>{
            reject("Error fetching results");
        });
    });
}

function getPostById(id){
    return new Promise((resolve, reject)=>{
        Post.findAll({where: { id: id}})
        .then((data)=>{        
            if(data.length>0){
                resolve(data[0]);
            } else {
                reject("No results found with that id")
            }
        }).catch((err)=>{
            reject("Error fetching results");
        });
    })
}

function addPost(postData){
    postData.published = (postData.published) ? true : false;
    for(const prop in postData){
        if(postData.prop==""){
            postData.prop=null;
        }
    }
    postData.postDate=new Date();
    return new Promise((resolve, reject)=>{
        Post.create(postData)
        .then((post)=>{
            resolve(post)
        })
        .catch(
            reject("unable to create post")
        )
        // if(Post.create(postData)){
        //     resolve()
        // } else {
        //     reject("Unable to create post.");
        // }
    })
}

function getPublishedPosts(){
    return new Promise((resolve, reject)=>{
        Post.findAll({published: true})
        .then((data)=>{        
            if(data.length>0){
                resolve(data);
            } else {
                reject("No published posts found")
            }
        }).catch((err)=>{
            reject("Error fetching results");
        });
    })
}

function getCategories(){
    return new Promise((resolve, reject)=>{
        Category.findAll()
            .then((data)=>{        
            if(data.length>0){
                resolve(data);
            } else {
                reject("No results found")
            }
        }).catch((err)=>{
            reject("Error fetching results");
        });
    })
}


function getPublishedPostsByCategory(category){
    return new Promise((resolve, reject)=>{
        Post.findAll({published: true},{category: category})
        .then((data)=>{        
            if(data.length>0){
                resolve(data);
            } else {
                reject("No published posts found with the given category")
            }
        }).catch((err)=>{
            reject("Error fetching results");
        });
    })
}

function addCategory(categoryData){
  
    for(const prop in categoryData){
        if(categoryData.prop==""){
            categoryData.prop=null;
        }
    }

    return new Promise((resolve, reject)=>{
        Category.create(categoryData)
        .then(()=>{
            resolve()
        })
        .catch((err)=>{
            reject("unable to create category" + err)
        })
    })
}

function deleteCategoryById(id){
    return new Promise((resolve, reject)=>{
        Category.destroy({where: { id: id}})
        .then((rows)=>{
            if (rows === 0) {
                reject("Category not found");
            }
            resolve()
        })
        .catch((err)=>{
            reject("Couldn't delete category")
        }
            
        )
    })
}

function deletePostById(id){
    return new Promise((resolve, reject)=>{
        Post.destroy({where: { id: id}})
        .then((rows)=>{
            if (rows === 0) {
                reject("post not found");
            }
            resolve()
        })
        .catch((err)=>{
            reject("Couldn't delete possst")
        }
        )
    })
}



module.exports = {initialize, getAllPosts, getPublishedPosts, getCategories,getPublishedPostsByCategory, addPost, getPostsByCategory, getPostsByMinDate, getPostById, addCategory, deleteCategoryById, deletePostById}; 






