const express = require('express');
const router = express.Router();
const Distribution = require('../models/Distribution');
const fs = require('fs');
const path = require('path');
const Comment = require('../models/Comment');
const middleware = require('../middleware');
const cacheData = require('../middleware/cacheData');
const SubDistribution = require('../models/SubDistribution');

router.get('/posts/new',async(req,res)=>{
    try{
      res.render('distribution/new');
  
    }
    catch(err){
      console.log(err.message);
    }
  })

router.put('/posts/:id/subDistribution/:sid',async(req,res)=>{
    try {
        let sid = req.params.sid;
        let subDistribution = await subDistribution.findById(sid);  
        subDistribution.image = req.body.subDistribution.image;
        subDistribution.title = req.body.subDistribution.title;
        if(req.body.subDistribution.content!="")
       {
          subDistribution.content = req.body.subDistribution.content;
       }
       let savedSubDistribution =await subDistribution.save();
       res.redirect('/distribution/posts'+req.params.id);
    } catch (error) {
        console.log(error.message);
      }
    })

// subDistribution route    
router.get('/posts/:id/subDistribution/:sid/edit',async(req,res)=>{
  try {
    console.log("-------triigered---------");
    let sid = req.params.sid;
    let id = req.params.id;
    let subDistribution = await SubDistribution.findById(sid);
    res.render('../views/distribution/subDistributionEdit',{subDistribution,id});
  } catch (error) {
    console.log(error.message);
  }
})

router.get('/posts/:id/subDistribution/:sid/delete',async(req,res)=>{
  try {
    let sid = req.params.sid;
    await SubDistribution.findByIdAndRemove(sid);
    res.redirect('back');
    
  } catch (error) {
    console.log(error.message);
    
  }
})

// everything will start from /distribution

// url:/distribution
//  INdex page route

router.get('/', async(req, res) => {
  try {
    let requestUrl = '/distribution/';
    let latestDistribution = [];
    let topDistribution = [];
    let i=0;
    let blogz = await Distribution.find({});
    blogz.forEach(blg=>{
      i++;
      if(i<=4)
      topDistribution.push(blg);
    })
    let distributions = await Distribution.find({}).sort({created:-1});
    let length = distributions.length;

    let c=0;
    let check=0;
    distributions.forEach(blog=>{
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
        let url = "/distribution/posts/"+blog._id;
        if(index===0)
        index=3;
        let obj = {title:title,thumbnail:thumbnail,tag:tag,index:index,check:check,url:url};
        latestDistribution.push(obj);
      }
    });

    res.render('../views/distribution/index',{distributions:topDistribution,latestDistribution,requestUrl});
  } 
  catch (error) {
    console.log(err.message);
    
  }
    
    
  })

  router.get('/check',async(req,res)=>{
    try {
      const distributions = await Distribution.find({}).sort({created:-1}).limit(4);
      res.render('distribution/check',{distributions})
    } catch (error) {
      console.log(error.message);
    }
  })

  router.get('/distributionGet',async(req,res)=>{
    try{

      var page = 1;
  const limit = 4;

  const count = await Distribution.countDocuments();
  const totalPages = Math.ceil(count/limit);
  if(req.query.page!=null)
  page = req.query.page;
  console.log(page);
  if(page<=0)
  page=1;
  if(page>totalPages)
  page=totalPages;
  
  const distributions = await Distribution.find().limit(limit*1).skip((page-1)*limit).sort({created:-1}).exec();
    res.send(distributions);

  }
  catch(err){
    console.log(err.message);
  }
})
// -------------------------- not fully completed ------------------------------------------
router.get("/AllDistributions",async (req,res)=>{
  var page = 1;
  const limit = 4;
  try{
    const distributions = await Distribution.find({}).sort({created:-1});
    let c=0;
    let len = distributions.length;
    distributions.forEach(blog=>{
     c++;
     blog.number = c;
   
    blog.save();
    })
    // page is not created in views
    res.render('../views/blogs/blogAll',{distributions});
}
catch(err){
  console.log(err.message);
}
})
// -------------------------------------------------------------------------------------------

router.get('/posts/:id', async (req, res) => { 
  try {
    var distributions = await Distribution.find({});
    var totalNumber = await distributions.length;
    let id = req.params.id;
    let requestUrl = '/distribution/post/'+id;
    let distribution = await Distribution.findById(id).populate('subDistribution').populate('comments');
    console.log(distribution);
    var subDistributionz=distribution.subDistribution;
      console.log("----------------------");
      console.log(distribution);
      console.log("----------------------");
      var commentz = distribution.comments;

      let a = distribution.number+1;
      let b = distribution.number-1;
      let next , prev ,nextId ,prevId;
      next = null;
      prev = null;
      nextId=0;
      prevId=0;

      if(distribution.number===1){
        next = await Distribution.find({number:a});
        if(next!=null)
        nextId = next[0]._id;
        
      }
      else if(distribution.number===totalNumber){
        prev = await Distribution.find({number:b});
        if(prev!=null)
        prevId = prev[0]._id;
      }
      else{
        next = await Distribution.find({number:a});
        prev = await Distribution.find({number:b});
        if(next!=null && next[0]._id!=null)
        nextId = next[0]._id;
        if(prev!=null && prev[0]._id!=null)
        prevId = prev[0]._id;
        }
        
      const tagg = distribution.tag;
      let currNumber = Distribution.number;
      let distributionz = await Distribution.find({tag:tagg});
      let numberArray=[];
      let count=0;
      distributionz.forEach(blg=>{
        if(blg.number!=currNumber)
        {numberArray.push(blg.number);
        count++;}
      })
      let randomNumber = Math.floor(Math.random()*count);

      var suggestedNumber = numberArray[randomNumber];
      let suggestionDistribution = await Distribution.find({number:suggestedNumber});
      
      if(suggestionDistribution.length===0){
        suggestionDistribution=next;
      }
      
      res.render('../views/distribution/show', {distribution,subDistributionz,commentz,next,prevId,nextId,prev,suggestionDistribution,requestUrl});
    } catch (error) {
      console.log(error.message);
      console.log(error);
      
    }
  });

  router.get('/posts/:id/edit',async(req,res)=>{
    try {
      let id = req.params.id;
      let distribution = await Distribution.findById(id);
      res.render('../views/distribution/distributionEdit',{distribution});
  
      
    } catch (error) {
      console.log(error.message);
      
    }

  })




  router.get('/posts/:id/admin',(req,res)=>{
    let id = req.params.id;

    Distribution.findById(id).populate("subDistribution").populate("comments").exec(function(err,distribution){
      if(err)
      console.log(err);
      //console.log(blog.subBlogs[0].image);
      console.log("----!"+distribution.image+"!------");
      var subDistributionz=distribution.subDistribution;
      //subBlogz.forEach(function(subBlog){
      //  console.log(subBlog.image);
      //})
      res.render('../views/distribution/adminShow', {distribution,subDistributionz});
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
          let sanitizedContent = req.sanitize(req.body.content);
          //console.log(sanitizedContent);
          console.log(req.body.tag+"-------------");
          let distributions = await Distribution.find({});
          let totalNumber = distributions.length+1;
          let distribution = new Distributions({  
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
          
          const savedDistribution = await distribution.save();
          console.log(savedDistribution);
          console.log('Blog Saved!');
          //---------------------here changed-----------------------------//
          res.redirect('/distribution');
          //--------------------------------------------------------------//
           
      } // Finish mimetype statement
    } else {
      console.log('You must Upload a image-post!');
      let sanitizedContent = req.sanitize(req.body.content);
      console.log(req.body.tag+"-------------");
          let distribution = new Distribution({ title: req.body.title ,
            tag:req.body.tag,
            tag1:req.body.tag1,
            tag2:req.body.tag2,
            tag3:req.body.tag3,
            tag4:req.body.tag4,
            image:"",
            thumbnail:"", 
            content: sanitizedContent, 
            creator: req.body.name })
            await distribution.save();
            console.log('Blog Saved!');
          //---------------------here changed-----------------------------//
            res.redirect('/distribution');
          //--------------------------------------------------------------//
          }
      

        } catch (error) {
          console.log(error.message);
          
        }
      });
      
      router.get('/:id/subDistribution/new',(req,res)=>{
        var id = req.params.id;
        res.render('../views/distribution/newSubDistribution',{id});
        
      })

      // deleting Blog ---only Admin can delete it
      router.get('/posts/:id/delete',async (req,res)=>{
        console.log("Delete Method Triggered");
        let id = req.params.id;
        Distribution.findById(id).then(blog=>{
        let toDel = path.join(__dirname,'../public/uploads/',blog.image);
        fs.unlinkSync(toDel);
        blog.subDistribution.remove({},err=>{
        if(err)
        console.log(err.message);
        console.log("SubBlogs Deleted");
      });
  });
  try {
    await Distribution.findByIdAndRemove(id);
    
      console.log("item deleted");
      res.redirect('/distribution');
    } catch (err) {
      console.log(err);
      res.sendStatus(404).render('error-page');
    }
  })
      
      

  router.get('/posts/:id/admin/comments',(req,res)=>{
    let id = req.params.id;
    Distribution.findById(id).populate('comments').exec(function(err,blog){
      if(err)
      console.log(err.message);
      let comments = blog.comments;
      res.render('../views/distribution/commentAdmin',{comments});
    })
  }) 
  
  router.get('/posts/:id/subDistribution/:sid/edit',async(req,res)=>{

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
    comment.save();
    Distribution.findById(id , function(err , blog){
      if(err)
      console.log(err.message);
      blog.comments.push(comment);
      console.log('pushed');
      console.log(id);
      blog.save();
    
    })
    res.redirect('/distribution/posts/'+id);
  })

})


router.post('/:id/subDistribution/new',async(req,res)=>{
  try {
  
    let subDistributions = new SubDistribution({title:req.body.title,content:req.body.content,image:req.body.image});
    let img = req.body.image;
    await subDistributions.save();
    console.log(subDistributions);
    console.log("----------succesfully created");
  let distribution = await Distribution.findById(req.params.id);
  if(distribution.thumbnail==="")
  {
    distribution.thumbnail=subDistributions.image;
  }
  distribution.subDistribution.push(subDistributions);
  await distribution.save();
  res.redirect('/distribution/posts/'+distribution._id+"/admin");
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
    let distribution = await Distribution.findById(id);
    console.log(distribution.tag);
    if(req.body.content!="")
    {
      distribution.content = req.body.content;
    }
    distribution.title = req.body.title;
    distribution.tag = req.body.tag;
    
    distribution.tag1 = req.body.tag1;
    
    distribution.tag2 = req.body.tag2;
    
    distribution.tag3 = req.body.tag3;
    
    distribution.tag4 = req.body.tag4;
    console.log(req.body.tag);  
    console.log("-----"+req.body.tag2);
    console.log(req.body.tag4);
    distribution.save();
    res.redirect('/distribution/posts/'+id);
    
  } catch (error) {
    console.log(error.message);
    
  }
  
  
})

      
      
      
      
      
      
          module.exports = router;    