import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../Markdown.css';

const BlogPost = () => {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Fetch the manifest to find the file
        fetch('/blogs.json')
            .then(res => res.json())
            .then(data => {
                const foundBlog = data.find(b => b.slug === slug);
                if (foundBlog && foundBlog.file) {
                    setBlog(foundBlog);
                    // 2. Fetch the markdown content
                    return fetch(`/blogs/${foundBlog.file}`);
                }
                throw new Error("Blog not found or no file associated");
            })
            .then(res => res.text())
            .then(text => {
                setContent(text);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [slug]);

    if (loading) return <div className="pt-24 text-center">Loading...</div>;
    if (!blog) return <div className="pt-24 text-center">Blog not found.</div>;

    return (
        <div className="min-h-screen bg-bg-primary pt-24 px-6 pb-24">
            <article className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-stone-100">
                <Link to="/blogs" className="text-primary no-underline hover:underline mb-8 block">&larr; Back to Blogs</Link>

                <h1 className="text-4xl font-bold text-dark mb-2">{blog.title}</h1>
                <p className="text-stone-500 text-sm mb-8 border-b pb-4">{blog.date}</p>

                <div className="markdown-content">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            img: ({ node, ...props }) => <img {...props} className="rounded-lg shadow-md my-4" />
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </article>
        </div>
    );
};

export default BlogPost;
