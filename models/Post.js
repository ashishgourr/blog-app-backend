import { Schema, model } from "mongoose";

//Blog Post Model

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    //timestamp: { type: Date, default: Date.now },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Post = model("Post", PostSchema);

export default Post;
