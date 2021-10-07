const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "post added successfully",
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath
      }
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Post creation has failed"
    });
  });
}

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post ).then(result => {
    if (result.n > 0) { // in lect.134 min 2:07 we modified from result.nModified
      res.status(200).json({ message: "Update successful!"});
    }	else {
      res.status(401).json({ message: "Not authorized!"});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Couldn't update post"
    });
  });
}

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
	let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
	postQuery
    .then(documents => {
      fetchedPosts = documents
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'post fetched successfully',
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed"
      });
    });
}

exports.getPost = (req, res, next) => {
	Post.findById(req.params.id).then(post => {
		if (post) {
			res.status(200).json(post);
		} else {
			res.status(404).json({ message: "Post not found"});
		}
	}).catch(error => {
      res.status(500).json({
        message: "Fetching post failed"
      });
    });
}

exports.deletePost = (req, res, next) => {
	console.log(req.params.id);
	Post.deleteOne({ _id : req.params.id, creator: req.userData.userId }).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: "Deletion successful!"});
    }	else {
      res.status(401).json({ message: "Not authorized to delete"});
    }
	}).catch(error => {
      res.status(500).json({
        message: "Fetching posts failed"
      });
    });
}
