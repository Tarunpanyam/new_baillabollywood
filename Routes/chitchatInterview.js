const express = require('express');
const router = express.Router();
const chitChatInterview = require('../models/ChitChatInterview');
const SubInterview = require('../models/SubInterview');
const cacheData = require('../middleware/cacheData');
const Comment = require('../models/Comment');
const ChitChatInterview = require('../models/ChitChatInterview');


router.get('/posts/:id/admin/comments',async(req,res)=>{
  let id = req.params.id;
  let requestUrl = '/chai-con-baila-bollywood/posts/'+id+'/adming/comments';
  let interview = await chitChatInterview.findById(id).populate('comments');
  let comments = interview.comments;
  console.log(interview);
  console.log(comments);
  res.render("chitChatInterview/commentAdmin",{comments,requestUrl});
  
})
router.post('/:id/comments',async(req,res)=>{
  try {
    console.log("abc triggered");
  let id = req.params.id;
  //let requestUrl = '/chai-con-baila-bollywood/'+id+'/comments';
  console.log(req.body.comment);
  let comment = await Comment.create(req.body.comment);
  comment.save();
  let interview = await chitChatInterview.findById(id);
  interview.comments.push(comment);
  interview.save();
  res.redirect('/chai-con-baila-bollywood/posts/'+id);
    
  } catch (error) {
    console.log(error.message);
  }
  
})

router.delete('/comments/:cid/delete',async(req,res)=>{
  try {
    let id = req.params.cid;
  await Comment.findByIdAndRemove(id);
  res.redirect('back');
  } catch (error) {
    console.log(error);
  }
})

router.get('/index',async(req,res)=>{
    try {
        let chitChatInt = await ChitChatInterview.find({}).sort({created:-1}).limit(4);
        
        let requestUrl = '/chai-con-baila-bollywood/index';
        
  // console.log(chitChatInt);
    
        let interviews = await chitChatInterview.find({});
        //console.log(interviews);
        //let textArray = [];
        let interview = await ChitChatInterview.findById(chitChatInt[0]._id).populate('subInterview');
        //console.log(newss);
        let text1 = "";
        if(chitChatInt[0].content!=="")
        text1 = chitChatInt[0].content;
        interview.subInterviews.forEach(subNews=>{
        if(text1==="")
        text1 = subNews.content;
     
   })
   console.log(text1);
   let interview2 = await ChitChatInterview.findById(chitChatInt[0]._id).populate('subInterview');
   //console.log(newss);
   let text2 = "";
   if(chitChatInt[1].content!=="")
   text2 = chitChatInt[1].content;
   interview2.subInterviews.forEach(subNews=>{
   if(text2==="")
   text2 = subNews.content;

})
   console.log("text2="+text2);
   let interview3 = await ChitChatInterview.findById(chitChatInt[0]._id).populate('subInterview');
   //console.log(newss);
   let text3 = "";
   if(chitChatInt[2].content!=="")
   text3 = chitChatInt[2].content;
   interview3.subInterviews.forEach(subNews=>{
   if(text3==="")
   text3 = subNews.content;

})
console.log(text3);
        res.render('../views/chitChatInterview/indexSecond',{chitChatInt,requestUrl});
        
        
    } catch (error) {

        console.log(error.message);
        
    }
})

router.get('/',async(req,res)=>{
  try {
    let chitChatInt = await ChitChatInterview.find({}).sort({created:-1}).limit(20);
    
    let requestUrl = '/chai-con-baila-bollywood/index';
    
// console.log(chitChatInt);

    let interviews = await chitChatInterview.find({});
    //console.log(interviews);
    //let textArray = [];
    let interview = await ChitChatInterview.findById(chitChatInt[0]._id).populate('subInterview');
    //console.log(newss);
    let text1 = "";
    if(chitChatInt[0].content!=="")
    text1 = chitChatInt[0].content;
    interview.subInterviews.forEach(subNews=>{
    if(text1==="")
    text1 = subNews.content;
 
})
console.log(text1);
let interview2 = await ChitChatInterview.findById(chitChatInt[1]._id).populate('subInterview');
//console.log(newss);
let text2 = "";
if(chitChatInt[1].content!=="")
text2 = chitChatInt[1].content;
interview2.subInterviews.forEach(subNews=>{
if(text2==="")
text2 = subNews.content;

})
console.log("text2="+text2);
let interview3 = await ChitChatInterview.findById(chitChatInt[2]._id).populate('subInterview');
//console.log(newss);
let text3 = "";
if(chitChatInt[2].content!=="")
text3 = chitChatInt[2].content;
interview3.subInterviews.forEach(subNews=>{
if(text3==="")
text3 = subNews.content;

})
console.log(text3);
    res.render('../views/chitChatInterview/index',{chitChatInt,requestUrl,text1,text2,text3});
    
    
} catch (error) {

    console.log(error.message);
    
}
})



  /*
router.get("/",async(req,res) => {
  try{
    let allInterviews = await chitChatInterview.find({});
    let requestUrl = '/chai-con-baila-bollywood/';
    let fourInt=[];
    let count=0;
    let id;
    let twoQ=[];
    //console.log('all')
    allInterviews.forEach(i2nterview=>{
      count++;
      if(count===1)
      {
        id = interview._id;
      }

      if(count<=4){
      let image = interview.image;
      let title = interview.title;
      let url = '/chai-con-baila-bollywood/posts/'+interview._id;
      let obj = {image:image,title:title,url:url};
      fourInt.push(obj);
    }
     

    });
    let pinterview = await chitChatInterview.findById(id).populate('subInterviews');
    count=0;
    //console.log(pinterview);
      pinterview.subInterviews.forEach(sub=>{
        count++;
        if(count<=2)
        {
          let title = sub.title;
          let content = sub.content;
          
          let objj = {title:title,content:content};
          twoQ.push(objj);
        }
        
      })
      //console.log(twoQ[0]);
      //----------------------
      let chai-con-baila-bollywood = await chitChatInterview.find({}).sort({created:-1});
    let length = chai-con-baila-bollywood.length;
    let latestInterviews=[];
    let c=0;
    let check=0;
    chai-con-baila-bollywood.forEach(interview=>{
      c++;
      if(c<=9){
      
        let title = interview.title;
        let thumbnail = interview.thumbnail;
        let index = c%3;
        let url = "/chai-con-baila-bollywood/posts/"+interview._id;
        if(index===0)
        index=3;
        let obj = {title:title,thumbnail:thumbnail,index:index,check:check,url:url};
        latestInterviews.push(obj);
      }
      
      });
      //---------------------
      //console.log(latestInterviews);
      console.log(twoQ);
      res.render('../views/chitChatInterview/index',{fourInt,twoQ,latestInterviews,requestUrl});


  }
  catch(error){

    console.log(error.message);
  }
  
    
  });
  */




router.get("/posts/new",(req,res)=>{
    let requestUrl = '/chai-con-baila-bollywood/posts/new';
    req.flash("success","Welcome");
    res.render("../views/chitChatInterview/new.ejs",{requestUrl});
})





router.get('/posts/:id',(req,res)=>{
  let id = req.params.id;
  let requestUrl = '/chai-con-baila-bollywood/posts/'+id;
  chitChatInterview.findById(id).populate('subInterviews').populate('comments').exec(function(err,foundInterview){
    if(err)
    console.log(err.message);
    let comments = foundInterview.comments;
    console.log(comments);
    res.render('../views/chitChatInterview/show',{Interview:foundInterview,comments,requestUrl});
  });
})

router.get("/posts/:id/add-more-information",(req,res)=>{
  let id = req.params.id;
  let requestUrl = '/chai-con-baila-bollywood/posts/'+id+'/add-more-information';
  res.render("../views/chitChatInterview/addMoreInformation.ejs",{id,requestUrl});
})


router.get('/posts/:id/edit',(req,res)=>{
  let id = req.params.id;
  let requestUrl = '/chai-con-baila-bollywood/posts/'+id+'/edit';
  chitChatInterview.findById(id,function(err,foundInterview){
    res.render("../views/chitChatInterview/interviewEdit",{interview:foundInterview,requestUrl});
  })
})

router.get('/posts/:id/admin',(req,res)=>{
  let id = req.params.id;
  let requestUrl = '/chai-con-baila-bollywood/posts/'+id+'/admin';
  chitChatInterview.findById(id).populate('subInterviews').exec(function(err,foundInterview){
    if(err)
    console.log(err.message);
    console.log(foundInterview);
    res.render('../views/chitChatInterview/showAdmin',{Interview:foundInterview,requestUrl});
  });
})
router.get('/posts/:id/delete',(req,res)=>{
  let id=req.params.id;
  //let requestUrl = '/chai-con-baila-bollywood/posts/'+id+'/delete';
  console.log(id);
  chitChatInterview.findById(id,function(err,foundInterview){
    if(err)
    console.log(err.message);
    console.log(foundInterview._id);
    foundInterview.subInterviews.forEach(function(subint){
      console.log("Suinterviews:"+subint);
      SubInterview.findByIdAndRemove(subint,function(err){
        if(err)
        console.log(err);
      })
    })
    foundInterview.remove();
    res.redirect('/chai-con-baila-bollywood');
  })
})

router.get('/posts/:id/subInterviews/:sid/edit',(req,res)=>{
  let sid = req.params.sid;
  let id = req.params.id;
  let requestUrl = '/chai-con-baila-bollywood/posts/'+id+'subInterviews/'+sid+'/edit';
  SubInterview.findById(sid,(err,foundSubInterview)=>{
    if(err)
    console.log(err.message);
    res.render('../views/chitChatInterview/subInterviewEdit',{subInterview:foundSubInterview,id,sid});
  })
})

router.get('/posts/:id/subInterviews/:sid/delete',(req,res)=>{
  let sid = req.params.sid;
  let id = req.params.id;
  SubInterview.findByIdAndDelete(sid,(err)=>{
    if(err)
    console.log(err.message);
    res.redirect('back');
  })
})




router.post('/posts',(req,res)=>{
  chitChatInterview.create(req.body.interview).then((err,newInterview)=>{
    if(err)
    console.log(err.message);
    console.log("created");
    console.log(newInterview);
    res.redirect('/chai-con-baila-bollywood');
  }
  )
})

router.post('/posts/:id',(req,res)=>{
  let id = req.params.id;
  console.log(req.body.subInterview);
  
  SubInterview.create(req.body.subInterview,(err,subinterview)=>{
    if(err)
    console.log(err.message);
    console.log("created subinterview");
    chitChatInterview.findById(id,(err,foundInterview)=>{
      if(err)
      console.log(err.message);
      console.log("Pushed into interview");
      foundInterview.subInterviews.push(subinterview);
      foundInterview.save();
      res.redirect('/chai-con-baila-bollywood/posts/'+id+'/admin');
    })
    
    //console.log(subinterview.title +"\n"+subinterview.image+"\n"+subinterview.content );
  })
  

});




router.put('/posts/:id/subInterviews/:sid',(req,res)=>{
  console.log("Put method triggered");
  let sid = req.params.sid;
  let id = req.params.id;
  SubInterview.findByIdAndUpdate(sid,req.body.subInterview,function(err,newSubInterview){
    if(err)
    console.log(err.message);
    console.log("SubInterview Updated");
    res.redirect('/chai-con-baila-bollywood/posts/'+id+'/admin');
  })
})

router.put('posts/:id',(req,res)=>{
  console.log("Put method triggered");
  let id = req.params.id;
  chitChatInterview.findByIdAndUpdate(id,req.body.interview,function(err,foundInterview){
    if(err)
    console.log(err.message);
    console.log("chitChatInterview Updated");
    res.redirect('/chai-con-baila-bollywood/posts/'+id+'/admin');
  })
})
 
  
  module.exports=router;