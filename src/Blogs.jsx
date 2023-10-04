import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BlogPosts = ({displayPosts}) => {
    const [blogPosts, setBlogPosts] = useState([]);

    useEffect(() => {
        displayPosts();
    }, []);

    return (
        <section id="blog-posts" className="mt-8">
            {blogPosts.map((blogPost) => (
                <div key={blogPost._id} className="blog-post">
                    <h3>{blogPost.title}</h3>
                    <p>id: {blogPost._id}</p>
                    <p>Reading Time: {blogPost.readingTime} min</p>
                    <p id={`content-${blogPost._id}`}>{blogPost.content}</p>
                </div>
            ))}
        </section>
    );
};

export default BlogPosts;
