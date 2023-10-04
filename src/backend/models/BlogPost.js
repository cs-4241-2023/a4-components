import { Schema, model } from 'mongoose';

const blogPostSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true, primary: true },
    title: String,
    content: String,
    readingTime: Number,
});

const BlogPost = model('BlogPost', blogPostSchema);

export default BlogPost;
