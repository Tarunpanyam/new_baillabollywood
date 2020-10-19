const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const fs = require('fs');
const path = require('path');
const Comment = require('../models/Comment');
const middleware = require('../middleware');
const cacheData = require('../middleware/cacheData');
const SubBlog = require('../models/SubBlog');


router.get('/posts/new',async(req,res)=>{
  try{
    res.render('blogs/new');

  }
  catch(err){
    console.log(err.message);
  }
})
router.put('/posts/:id/subBlogs/:sid',async(req,res)=>{
  try {
    let sid = req.params.sid;
    let subBlog = await SubBlog.findById(sid);
    subBlog.image = req.body.subBlog.image;
    subBlog.title = req.body.subBlog.title;
    if(req.body.subBlog.content!="")
    {
      subBlog.content = req.body.subBlog.content;
    }
    let savedSubBlog =await subBlog.save();
    res.redirect('/blogs/posts'+req.params.id);
  } catch (error) {
    console.log(error.message);
  }
})



// subBlogs route
router.get('/posts/:id/subBlogs/:sid/edit',async(req,res)=>{
  try {
    console.log("-------triigered---------");
    let sid = req.params.sid;
    let id = req.params.id;
    let subBlog = await SubBlog.findById(sid);
    
    res.render('../views/blogs/subBlogEdit',{subBlog,id});
  } catch (error) {
    console.log(error.message);
  }
})

router.get('/posts/:id/subBlogs/:sid/delete',async(req,res)=>{
  try {
    let sid = req.params.sid;
    await SubBlog.findByIdAndRemove(sid);
    res.redirect('back');
    
  } catch (error) {
    console.log(error.message);
    
  }
})

// everything will start from /blogs

// url:/blogs
//  INdex page route
router.get('/', async(req, res) => {
  try {
    let requestUrl = '/blogs/';
    let latestBlogs = [];
    let topBlogs = [];
    let i=0;
    let blogz = await Blog.find({});
    blogz.forEach(blg=>{
      i++;
      if(i<=4)
      topBlogs.push(blg);
    })
    let blogs = await Blog.find({}).sort({created:-1});
    let length = blogs.length;
    
    let c=0;
    let check=0;
    blogs.forEach(blog=>{
      c++;
      if(c<=9){
      if(blog.image==="")
        check=1;
        else{
          check=0;
        }
        let title = blog.title;
        let thumbnail = blog.thumbnail;
        let tag = blog.tag;
        let index = c%3;
        let url = "/blogs/posts/"+blog._id;
        if(index===0)
        index=3;
        let obj = {title:title,thumbnail:thumbnail,tag:tag,index:index,check:check,url:url};
        latestBlogs.push(obj);
      }
      
      });
        
      res.render('../views/blogs/index',{blogs:topBlogs,latestBlogs,requestUrl});


    
    
  } catch (error) {
    console.log(err.message);
    
  }
    
    
  })

  router.get('/check',async(req,res)=>{
    try {
      const blogs = await Blog.find({}).sort({created:-1}).limit(4);
      res.render('blogs/check',{blogs})
    } catch (error) {
      console.log(error.message);
    }
  })


  router.get('/blogGet',async(req,res)=>{
    try{

      var page = 1;
  const limit = 4;
      
  const count = await Blog.countDocuments();
  const totalPages = Math.ceil(count/limit);
  if(req.query.page!=null)
  page = req.query.page;
  console.log(page);
  if(page<=0)
  page=1;
  if(page>totalPages)
  page=totalPages;
  
  const blogs = await Blog.find().limit(limit*1).skip((page-1)*limit).sort({created:-1}).exec();
    res.send(blogs);

    }
    catch(err){
      console.log(err.message);
    }
  })


  // All Blogs Combined
router.get("/AllBlogs",async (req,res)=>{
  var page = 1;
  const limit = 4;
  try{
    /*
  const count = await Blog.countDocuments();
  const totalPages = Math.ceil(count/limit);
  if(req.query.page!=null)
  page = req.query.page;
  console.log(page);
  if(page<=0)
  page=1;
  if(page>totalPages)
  page=totalPages;
  
  const blogs = await Blog.find().limit(limit*1).skip((page-1)*limit).sort({created:-1}).exec();
  */
 const blogs = await Blog.find({}).sort({created:-1});
 let c=0;
 let len = blogs.length;
 blogs.forEach(blog=>{
   c++;
   blog.number = c;
   
   blog.save();
    })
  res.render('../views/blogs/blogAll',{blogs});
}
catch(err){
  console.log(err.message);
}
})

  
  //url:/blogs/:id
  // getting individual Post
  router.get('/posts/:id', async (req, res) => { 
    try {
      var blogs = await Blog.find({});
      var totalNumber = await blogs.length;
      
      let id = req.params.id;
      let requestUrl = '/blogs/post/'+id;
      let blog = await Blog.findById(id).populate('subBlogs').populate('comments');
      console.log(blog);
      var subBlogz=blog.subBlogs;
      console.log("----------------------");
      console.log(blog);
      console.log("----------------------");
      var commentz = blog.comments;
      
      let a = blog.number+1;
      let b = blog.number-1;
      let next , prev ,nextId ,prevId;
      next = null;
      prev = null;
      nextId=0;
      prevId=0;
      
      if(blog.number===1){
        next = await Blog.find({number:a});
        if(next!=null)
        nextId = next[0]._id;
        
      }
      else if(blog.number===totalNumber){
        prev = await Blog.find({number:b});
        if(prev!=null)
        prevId = prev[0]._id;
      }

      
      else{
      next = await Blog.find({number:a});
      prev = await Blog.find({number:b});
      if(next!=null && next[0]._id!=null)
      nextId = next[0]._id;
      if(prev!=null && prev[0]._id!=null)
      prevId = prev[0]._id;
      }
      
      
      const tagg = blog.tag;
      
      let currNumber = blog.number;
      let blogz = await Blog.find({tag:tagg});
      let numberArray=[];
      let count=0;
      blogz.forEach(blg=>{
        if(blg.number!=currNumber)
        {numberArray.push(blg.number);
        count++;}
      })
      let randomNumber = Math.floor(Math.random()*count);
      
      var suggestedNumber = numberArray[randomNumber];
      let suggestionBlog = await Blog.find({number:suggestedNumber});
      
      if(suggestionBlog.length===0){
        suggestionBlog=next;
      }
      //console.log(next);
      //console.log(prev);
      res.render('../views/blogs/show', {blog,subBlogz,commentz,next,prevId,nextId,prev,suggestionBlog,requestUrl});
      
    } catch (error) {
      console.log(error.message);
      console.log(error);
      
    }
  });
  router.get('/posts/:id/edit',async(req,res)=>{
    try {
      let id = req.params.id;
      let blog = await Blog.findById(id);
      res.render('../views/blogs/blogEdit',{blog});
  
      
    } catch (error) {
      console.log(error.message);
      
    }

  })
    

    



  // Only Admin can see the comments
  router.get('/posts/:id/admin',(req,res)=>{
    let id = req.params.id;
    
    Blog.findById(id).populate("subBlogs").populate("comments").exec(function(err,blog){
      if(err)
      console.log(err);
      //console.log(blog.subBlogs[0].image);
      console.log("----!"+blog.image+"!------");
      var subBlogz=blog.subBlogs;
      //subBlogz.forEach(function(subBlog){
      //  console.log(subBlog.image);
      //})
      res.render('../views/blogs/adminShow', {blog,subBlogz});
    });
  })

  // deleting comments
  // Only Adming can delete comment
router.delete("/posts/:id/comments/:cid",(req,res)=>{
  
  let cid = req.params.cid;
  Comment.findByIdAndRemove(cid).then(err=>{
    
      res.redirect("back");
    
  }).catch(err=>{
    res.redirect('back');
  })
});

  //url:/blogs/new
  // Adding New Blog
  // Only Admin can Add new Blog
router.post('/posts/new', async(req, res) => {
  try {
    if (req.files) {
      let file = req.files.image;
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
          //console.log(req.body.content);
          let sanitizedContent = req.sanitize(req.body.content);
          //console.log(sanitizedContent);
          console.log(req.body.tag+"-------------");
          let blogs = await Blog.find({});
          let totalNumber = blogs.length+1;
          let blog = new Blog({ 
            title: req.body.title ,
            tag:req.body.tag,
            tag1:req.body.tag1,
            tag2:req.body.tag2,
            tag3:req.body.tag3,
            tag4:req.body.tag4,
            number:totalNumber,
            image: req.files.image.name,
            thumbnail:req.files.image.name, 
            content: sanitizedContent, 
            creator: req.body.name })

          file.mv(`./public/uploads/${file.name}`, err => console.log(err ? 'Error on save the image!' : 'Image Uploaded!'));
          
          const savedBlog = await blog.save();
          console.log(savedBlog);
          console.log('Blog Saved!');
          res.redirect('/blogs/allBlogs');
        
           
      } // Finish mimetype statement
  } else {
    console.log('You must Upload a image-post!');
    let sanitizedContent = req.sanitize(req.body.content);
          //console.log(sanitizedContent);
          console.log(req.body.tag+"-------------");
          let blog = new Blog({ title: req.body.title ,
            tag:req.body.tag,
            tag1:req.body.tag1,
            tag2:req.body.tag2,
            tag3:req.body.tag3,
            tag4:req.body.tag4,
            image:"",
            thumbnail:"", 
            content: sanitizedContent, 
            creator: req.body.name })
          //file.mv(`./public/uploads/${file.name}`, err => console.log(err ? 'Error on save the image!' : 'Image Uploaded!'));
          await blog.save();
          console.log('Blog Saved!');
            res.redirect('/blogs/allBlogs');
          }
         

    
  } catch (error) {
    console.log(error.message);
    
  }
});



router.get('/:id/subBlogs/new',(req,res)=>{
  var id = req.params.id;
  res.render('../views/blogs/newSubBlog',{id});
  
})



// deleting Blog ---only Admin can delete it
router.get('/posts/:id/delete',async (req,res)=>{
  console.log("Delete Method Triggered");
  let id = req.params.id;
  Blog.findById(id).then(blog=>{
    let toDel = path.join(__dirname,'../public/uploads/',blog.image);
    
    fs.unlinkSync(toDel);
    blog.subBlogs.remove({},err=>{
      if(err)
      console.log(err.message);
      console.log("SubBlogs Deleted");
    });
  });
  try {
  await Blog.findByIdAndRemove(id);
  
    console.log("item deleted");
    res.redirect('/blogs/allBlogs');
  } catch (err) {
    console.log(err);
    res.sendStatus(404).render('error-page');
  }
})






router.get('/posts/:id/admin/comments',(req,res)=>{
  let id = req.params.id;
  Blog.findById(id).populate('comments').exec(function(err,blog){
    if(err)
    console.log(err.message);
    let comments = blog.comments;
    res.render('../views/blogs/commentAdmin',{comments});
  })
}) 

router.get('/posts/:id/subBlogs/:sid/edit',async(req,res)=>{

})

// Post route for adding new comment on individual Blog
// url:/blogs/posts/:id
router.post('/posts/:id',(req,res)=>{
  let id = req.params.id;

  console.log(req.body.comment);
  
  Comment.create(req.body.comment,function(err,comment){
    if(err)
    console.log(err.message);
    console.log('Created Comment');
    //res.redirect('/blogs/posts/'+id);
    comment.save();
    Blog.findById(id , function(err , blog){
      if(err)
      console.log(err.message);
      blog.comments.push(comment);
      console.log('pushed');
      console.log(id);
      blog.save();
    
    })
  
    res.redirect('/blogs/posts/'+id);
  })
  
  
})


router.post('/:id/subBlogs/new',async(req,res)=>{
  try {
  
  let subBlog = new SubBlog({title:req.body.title,content:req.body.content,image:req.body.image});
  let img = req.body.image;
  await subBlog.save();
  console.log(subBlog);
  console.log("----------succesfully created");
  let blog = await Blog.findById(req.params.id);
  if(blog.thumbnail==="")
  {
    blog.thumbnail=subBlog.image;
  }
  blog.subBlogs.push(subBlog);
  await blog.save();
  res.redirect('/blogs/posts/'+blog._id+"/admin");
    
  } catch (err) {
    console.log(err.message);
    
  }
})
router.delete('/posts/comments/:cid',(req,res)=>{
  console.log("Delete Triggerd");
  Comment.findByIdAndRemove(req.params.cid,function(err){
    if(err)
    console.log(err.message);
    console.log('Comment Deleted');
    res.redirect('back');

  })
})

router.put('/posts/:id',async(req,res)=>{
  try {
    let id = req.params.id;
    let blog = await Blog.findById(id);
    console.log(blog.tag);
    if(req.body.content!="")
    {
      blog.content = req.body.content;
    }
    blog.title = req.body.title;
    blog.tag = req.body.tag;
    
    blog.tag1 = req.body.tag1;
    
    blog.tag2 = req.body.tag2;
    
    blog.tag3 = req.body.tag3;
    
    blog.tag4 = req.body.tag4;
    console.log(req.body.tag);
    console.log("-----"+req.body.tag2);
    console.log(req.body.tag4);
    blog.save();
    res.redirect('/blogs/posts/'+id);
    
  } catch (error) {
    console.log(error.message);
    
  }
  
  
})


module.exports = router;