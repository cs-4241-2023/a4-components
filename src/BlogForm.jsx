import React, { useState } from 'react';
import axios from 'axios';

const BlogPostForm = ({ displayPosts }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const createPost = async (event) => {
        event.preventDefault();

        const blogPost = {
            title,
            content,
        };

        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/api/blogs`, blogPost, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Blog post created successfully');
            setTitle('');
            setContent('');
            displayPosts(); // Fetch and display updated blog posts
        } catch (error) {
            console.error('Failed to create blog post', error);
        }
    };

    return (
        <section className="bg-white shadow-md rounded px-4 py-4 mx-4 max-w-screen-sm md:mx-auto md:max-w-lg mt-5">
            <h2 className="text-2xl mb-4">Add a New Blog Post</h2>
            <form onSubmit={createPost}>
                <label htmlFor="title" className="block font-semibold">Title:</label>
                <input
                    type="text"
                    id="title"
                    className="border rounded px-2 py-1 w-full mt-2"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <label htmlFor="content" className="block font-semibold mt-4">Content:</label>
                <textarea
                    id="content"
                    rows="4"
                    className="border rounded px-2 py-1 w-full mt-2"
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded"
                    aria-label="Submit Blog Post"
                >
                    Submit
                </button>
            </form>
        </section>
    );
};

export default BlogPostForm;
