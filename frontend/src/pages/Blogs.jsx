import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from "aos";
import "aos/dist/aos.css";

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        AOS.init({ duration: 1000 });

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
        <div className="container section">
            <div className="text-center" style={{ marginBottom: "var(--spacing-xl)", marginTop: "var(--spacing-xl)" }} data-aos="fade-down">
                <h1>Blogs</h1>
                <p>Thoughts, tutorials, and updates on my journey.</p>
            </div>

            <div className="grid grid-2">
                {blogs.length > 0 ? (
                    blogs.map(blog => (
                        <Link
                            key={blog.id}
                            to={blog.file ? `/blogs/${blog.slug}` : blog.link}
                            className="grid-item project-card block"
                            style={{
                                textDecoration: 'none',
                                color: 'inherit',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%'
                            }}
                            target={blog.file ? "_self" : "_blank"}
                            data-aos="fade-up"
                        >
                            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{blog.title}</h2>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{blog.date || "No Date"}</p>
                        </Link>
                    ))
                ) : (
                    <p className="text-center" style={{ color: "var(--text-secondary)" }}>No blogs found.</p>
                )}
            </div>
        </div>
    );
};

export default Blogs;
