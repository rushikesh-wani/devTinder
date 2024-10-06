const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    user: { type: String },
    postTitle: { type: String },
    postDescp: { type: String },
    postLikes: { type: Number },
    comments: {
      type: [
        {
          type: {
            user: { type: String },
            comment: { type: String },
          },
        },
      ],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
