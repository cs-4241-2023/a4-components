import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    githubId: String, // Store GitHub user ID
    username: String, // Store GitHub username
});

const User = model('User', userSchema);

export default User;
