import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../config';

const fmt = (d) => {
  const date = new Date(d);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/blogs`)
      .then(r => r.json())
      .then(data => { setBlogs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-3 text-sm text-gray-500">
          <Link to="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-semibold">Blog</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 pb-24 max-w-6xl">
        <h1 className="text-3xl font-black text-gray-900 mb-10 tracking-tight">Blog</h1>

        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="animate-spin text-[#c9a84c] w-10 h-10" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-32 text-gray-400">
            <p className="text-lg font-semibold">No posts yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map(blog => (
              <Link
                key={blog._id}
                to={`/blog/${blog._id}`}
                className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Image */}
                <div className="w-full aspect-[16/10] overflow-hidden bg-gray-100">
                  {blog.image_url ? (
                    <img
                      src={blog.image_url}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#f9f5ee] to-[#e8dfc8] flex items-center justify-center">
                      <span className="text-4xl">📝</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <p className="text-xs text-gray-400 font-medium">{fmt(blog.publishedAt)}</p>
                  <h2 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#c9a84c] transition-colors">
                    {blog.title}
                  </h2>
                  {blog.excerpt && (
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">{blog.excerpt}</p>
                  )}
                  <span className="mt-2 text-sm font-bold text-[#c9a84c] flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read now <span>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
