const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Define Post schema
const postSchema = {
  title: String,
  content: String
};
const Post = mongoose.model("Post", postSchema);

app.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.render("home", {
      startingContent: "Lacus vel facilisis...", // Your starting content here
      posts: posts
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){
    if (err){
      console.error(err);
      res.status(500).send("Error saving the post.");
    } else {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", async (req, res) => {
  try {
    const requestedPostId = req.params.postId;
    const post = await Post.findOne({_id: requestedPostId});
    
    if (post) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    } else {
      res.render("post", {
        title: "Post Not Found",
        content: "Sorry, the requested post was not found."
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: "Hac habitasse platea..."});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: "Scelerisque eleifend donec..."});
});

app.listen(4000, function() {
  console.log("Server started on port 4000");
});
