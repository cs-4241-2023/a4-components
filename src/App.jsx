import { useState, useEffect } from 'react';
import './App.css';
import BlogPostForm from './BlogForm';
import axios from 'axios';

function App() {
    const BASE_URL = import.meta.env.VITE_BASE_URL
    const [currentlyEditingPostId, setCurrentlyEditingPostId] = useState(null);
    const [blogPosts, setBlogPosts] = useState([]);

    useEffect(() => {
        displayPosts();
    }, []); // Fetch blog posts on component mount

    const displayPosts = function () {
        axios
            .get(`${BASE_URL}/api/blogs`)
            .then((response) => {
                const data = response.data;
                setBlogPosts(data);
            })
            .catch((error) => {
                console.error('Failed to fetch blog posts', error);
            });
    };

    const editPost = function (postId) {
        setCurrentlyEditingPostId(postId);
    };

    const updatePost = function (postId) {
        const editedContent = document.querySelector(`#content-${postId}`).value;

        const updatedBlogPost = {
            content: editedContent,
        };

        axios
            .put(`${BASE_URL}/api/blogs/${postId}`, updatedBlogPost, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(() => {
                console.log('Blog post updated successfully');
                displayPosts();
                setCurrentlyEditingPostId(null); // Reset the currentlyEditingPostId
            })
            .catch((error) => {
                console.error('Failed to update blog post', error);
            });
    };

    const deletePost = function (postId) {
        axios
            .delete(`${BASE_URL}/api/blogs/${postId}`)
            .then(() => {
                console.log(`Blog post id:${postId} deleted successfully`);
                displayPosts();
            })
            .catch((error) => {
                console.error('Failed to delete blog post', error);
            });
    };

    return (
        <div className="bg-gray-100 font-roboto">
            <header className="flex justify-between items-center py-4">
                <h1 className="mx-auto text-3xl md:text-4xl lg:text-5xl font-bold">My Blog</h1>
            </header>

            <BlogPostForm displayPosts={displayPosts} />

            <div id="blog-posts">
                {blogPosts.map((blogPost) => (
                    <div
                        key={blogPost._id}
                        className={`blog-post ${currentlyEditingPostId === blogPost._id ? 'editing' : ''}`}
                    >
                        <h3>{blogPost.title}</h3>
                        <p>id: {blogPost._id}</p>
                        <p>Reading Time: {blogPost.readingTime} min</p>
                        {currentlyEditingPostId === blogPost._id ? (
                            <textarea id={`content-${blogPost._id}`}>{blogPost.content}</textarea>
                        ) : (
                            <p>{blogPost.content}</p>
                        )}
                        {currentlyEditingPostId === blogPost._id ? (
                            <button onClick={() => updatePost(blogPost._id)}>Save</button>
                        ) : (
                            <>
                                <button onClick={() => editPost(blogPost._id)}>Edit</button>
                                <button onClick={() => deletePost(blogPost._id)}>Delete</button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
