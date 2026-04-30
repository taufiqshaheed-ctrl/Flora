import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../config';

const fmt = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const BlogDetail = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/blogs/${blogId}`)
      .then(r => r.json())
      .then(data => {
        setBlog(data);
        setLoading(false);
        // Inject SEO meta tags
        if (data.metaTitle)       document.title = data.metaTitle;
        else if (data.title)      document.title = data.title;
        const setMeta = (name, content) => {
          if (!content) return;
          let el = document.querySelector(`meta[name="${name}"]`);
          if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el); }
          el.content = content;
        };
        setMeta('description', data.metaDescription);
        setMeta('keywords',    data.metaKeywords);
      })
      .catch(() => setLoading(false));
    return () => { document.title = 'FloralAdda'; };
  }, [blogId]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 className="animate-spin text-[#c9a84c] w-10 h-10" />
    </div>
  );

  if (!blog || blog.error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-gray-500 text-lg">Blog post not found.</p>
      <button onClick={() => navigate('/blog')} className="text-[#c9a84c] underline font-semibold">Back to Blog</button>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-3 text-sm text-gray-500 flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-[#c9a84c] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-gray-700 truncate max-w-[200px]">{blog.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl py-12 pb-24">
        {/* Back */}
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#c9a84c] transition-colors mb-8 font-medium"
        >
          <ArrowLeft size={16} /> Back to Blog
        </button>

        {/* Cover image */}
        {blog.image_url && (
          <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden mb-8 bg-gray-100">
            <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Meta */}
        <p className="text-xs text-gray-400 font-medium mb-3">{fmt(blog.publishedAt)}</p>

        {/* Title / H1 */}
        <h1 className="text-3xl font-black text-gray-900 leading-snug mb-4">{blog.h1 || blog.title}</h1>

        {/* Excerpt */}
        {blog.excerpt && (
          <p className="text-lg text-gray-500 leading-relaxed mb-8 border-l-4 border-[#c9a84c] pl-4">{blog.excerpt}</p>
        )}

        <hr className="border-gray-100 mb-8" />

        {/* Body */}
        {blog.content && (
          <div
            className="blog-content text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        )}
      </div>

      <style>{`
        .blog-content h2 { font-size: 1.4rem; font-weight: 700; color: #111827; margin: 2rem 0 0.75rem; }
        .blog-content h3 { font-size: 1.1rem; font-weight: 600; color: #374151; margin: 1.5rem 0 0.5rem; }
        .blog-content p  { font-size: 1rem; color: #4b5563; margin-bottom: 1rem; }
        .blog-content ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
        .blog-content ol { list-style: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
        .blog-content li { margin-bottom: 0.4rem; font-size: 1rem; color: #4b5563; }
        .blog-content a  { color: #c9a84c; text-decoration: underline; }
        .blog-content img { max-width: 100%; border-radius: 0.75rem; margin: 1rem 0; }
        .blog-content blockquote { border-left: 4px solid #c9a84c; padding-left: 1rem; color: #6b7280; font-style: italic; margin: 1.5rem 0; }
      `}</style>
    </div>
  );
};

export default BlogDetail;
