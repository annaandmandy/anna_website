import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        fetch('/blogs.json')
            .then(res => res.json())
            .then(data => {
                // Filter out blogs that don't have a file/content
                const activeBlogs = data.filter(blog => blog.file || blog.content);
                setBlogs(activeBlogs);
            })
            .catch(err => console.error("Error fetching blogs:", err));
    }, []);

    return (
        <div className="min-h-screen bg-bg-primary pt-24 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-dark mb-8">Blogs</h1>

                <div className="grid gap-6">
                    {blogs.length > 0 ? (
                        blogs.map(blog => (
                            <Link
                                key={blog.id}
                                to={blog.file ? `/blogs/${blog.slug}` : blog.link}
                                className="block p-6 bg-white rounded-lg shadow-sm border border-stone-200 hover:shadow-md transition-shadow"
                                target={blog.file ? "_self" : "_blank"}
                            >
                                <h2 className="text-2xl font-bold text-dark mb-2">{blog.title}</h2>
                                <p className="text-stone-500 text-sm">{blog.date || "No Date"}</p>
                            </Link>
                        ))
                    ) : (
                        <p className="text-stone-500">No blogs found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Blogs;
