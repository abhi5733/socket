const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the user
const userSchemaa = new Schema({
    username: String,
    email: String,
    // Reference to the comments made by the user
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }] 
    // 'Comment' is the model name you've given for comments
});


const User = mongoose.model('Userr', userSchemaa);
// Define the schema for the comments
const commentSchemaa = new Schema({
    text: String,
    // You might include other fields like timestamp, etc.
    user: { type: Schema.Types.ObjectId, ref: 'User' } // Reference to the user who made the comment
});


const Comment = mongoose.model('Comment', commentSchemaa);

module.exports = { User, Comment };
