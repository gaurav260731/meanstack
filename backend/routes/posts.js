const express = require('express');
const multer = require('multer');

const router = express.Router();

const Post = require('../model/post');
const checkAuth = require('../middleware/check-auth');

const MIME_TYPE_MAP = {
  'image/png' : 'png',
  'image/jpeg' : 'jpeg',
  'image/jpg' : 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid  =  MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if(isValid) {
      error = null;
    }
    cb(error, 'backend/images')
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post('',
checkAuth,
multer({storage: storage}).single("image"), (req, res, next)=>{
  const url = req.protocol + '://' + req.get("host");
   const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
   });
   post.save().then((createdPost)=> {
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        ...createdPost,
        id: createdPost._id,
      }
    });
   });
   console.log(post);

})

router.get('',(req, res, next)=> {
//   const posts = [
//     {
//     id: '12kjfldsf',
//     title: 'First Server',
//     content: 'This is coming from server'
//     },
//     {
//       id: '24fskjfldsf',
//       title: 'Second Server',
//       content: 'This is coming from Second server'
//       },
//       {
//         id: '3432kjfldsf',
//         title: 'Third Server',
//         content: 'This is coming from third server'
//         },
// ]
  console.log(req.query);
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchPost;
  if(pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
  .then((documents)=> {
    fetchPost = documents;
    return Post.count();
    // res.status(200).json({
    //   message: 'Post fetched successfully',
    //   posts: documents
    // });
  })
  .then((count) => {
    res.status(200).json({
      message: 'Post fetched successfully',
      posts: fetchPost,
      maxPosts: count
    });
  })

});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post);
    }else {
      res.status(401).json({ message: 'Error while getting the post'})
    }
  })
})

router.put('/:id',
  checkAuth,
  multer({storage: storage}).single("image"), (req, res, next)=> {
  let imagePath = req.body.imagePath;
  if(req.file){
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
   });
    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then(results=> {
      if(results.nModified > 0) {
       res.status(200).json({message: 'Updated Successfully'})
      }else {
       res.status(401).json({message: 'Not authorized to update the post'})
      }
    });
});

router.delete('/:id',
    checkAuth,
   (req, res, next)=>{
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then((result)=> {
      console.log(result);
      if(result.n > 0) {
        res.status(200).json({message: 'Post deleted successfully'});
      } else {
        res.status(401).json({message: 'User is not authorized to delete post'});
      }

    });
});

module.exports = router;
