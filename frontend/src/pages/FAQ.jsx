import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../config';

const FAQ = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Care Guide');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/content/care-guide`)
      .then(r => r.json())
      .then(data => {
        if (data.content) setContent(data.content);
        if (data.title) setTitle(data.title);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-3 text-sm text-gray-500">
          <Link to="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-semibold">{title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl py-12 pb-24">
        <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">{title}</h1>

        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="animate-spin text-[#c9a84c] w-10 h-10" />
          </div>
        ) : (
          <div className="care-guide-content text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
        )}
      </div>

      <style>{`
        .care-guide-content h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #f3f4f6;
        }
        .care-guide-content h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .care-guide-content p {
          margin-bottom: 1rem;
          font-size: 0.95rem;
          color: #4b5563;
        }
        .care-guide-content ul {
          list-style: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .care-guide-content li {
          margin-bottom: 0.4rem;
          font-size: 0.95rem;
          color: #4b5563;
        }
      `}</style>
    </div>
  );
};

export default FAQ;
