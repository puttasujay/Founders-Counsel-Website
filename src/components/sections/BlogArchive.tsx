import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export interface Blog {
  _id: string;
  title: string;
  slug: string; 
  content: string;
  featuredImage: string;
  createdAt: string;
  categories?: string[]; 
  tags?: string[]; 
}

// In dev, use relative URLs so requests go through the Vite proxy (see vite.config.ts)
const RAW_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || 'https://api.manhoursonhire.com');
// Must match the blog's `targetWebsites` value in the CMS
const SITE_KEY = 'founderscounsel';
const PAGE_SIZE = 27;
const SERVER_URL = RAW_URL.replace(/\/+$/, '');
const endpoint = SERVER_URL.endsWith('/api') ? '/blogs' : '/api/blogs';

const BlogArchive = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.ceil(blogs.length / PAGE_SIZE);
  const visibleBlogs = blogs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      const fullUrl = `${SERVER_URL}${endpoint}?site=${SITE_KEY}`;
      
      try {
        setLoading(true);
        const res = await axios.get<Blog[]>(fullUrl);
        if (Array.isArray(res.data)) {
          setBlogs(res.data);
        }
        setError(null);
      } catch (err: any) {
        console.error("Fetch Error:", err);
        const message = err.response?.data?.message || err.response?.statusText || "Unauthorized Access";
        setError(`Server Error (${err.response?.status}): ${message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full bg-[#110B38] font-poppins">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#DCA825]/20 border-t-[#DCA825] rounded-full animate-spin"></div>
          <p className="text-[#DCA825]/60 font-medium tracking-widest uppercase text-xs">Loading Founders Counsel Insights</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full bg-[#110B38] font-poppins px-6">
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-xl text-center max-w-md backdrop-blur-md">
          <p className="text-red-400 font-bold uppercase tracking-widest text-sm mb-2">Access Denied</p>
          <p className="text-white/60 text-sm mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[#DCA825] text-[#110B38] rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="relative w-full min-h-screen bg-[#110B38] font-poppins pt-32 pb-24 overflow-hidden">
      {/* Brand Background Radial Glow - Navy Base */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[1200px] h-[1200px] bg-[radial-gradient(circle_at_center,_#1C1454_0%,_#110B38_70%)] rounded-full blur-[120px] opacity-80"></div>
      </div>

      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <header className="mb-20 text-center flex flex-col items-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-[#DCA825]/10 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#DCA825] mb-6 border border-[#DCA825]/20 backdrop-blur-sm">
            Founders Counsel Resources & News
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-8 text-white tracking-tight leading-[1.1]">
            Our Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DCA825] to-[#F0CC70]">Insights.</span>
          </h1>
          
          <p className="text-white/50 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed italic">
            "Consider it done" expert perspectives on productivity and the stories behind Founders Counsel.
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.length > 0 ? (
            visibleBlogs.map((blog) => {
              const hasImage = Boolean(blog.featuredImage?.trim());
              return (
              <Link
                to={`/blogs/${blog.slug || blog._id}`} 
                key={blog._id} 
                className="group flex flex-col bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-[#DCA825]/10 transition-all duration-700 ease-out hover:-translate-y-2 hover:border-white/20"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden m-3 rounded-[1.5rem]">
                  {hasImage ? (
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
                    />
                  ) : (
                    <div className="relative flex items-center justify-center h-full p-8 bg-gradient-to-br from-[#1C1454] via-[#110B38] to-[#2A1F6B] border border-[#DCA825]/20 rounded-[1.5rem] group-hover:scale-105 transition-transform duration-1000 ease-in-out">
                      <h3 className="text-2xl md:text-[1.65rem] font-black text-white text-center leading-[1.25] tracking-tight line-clamp-4 group-hover:text-[#DCA825] transition-colors duration-300">
                        {blog.title}
                      </h3>
                    </div>
                  )}
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-[#110B38]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <div className="p-6 pt-2 flex flex-col flex-grow">
                  <p className="text-[10px] text-[#DCA825] font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
                    <span className="w-1 h-1 bg-[#DCA825] rounded-full"></span>
                    {formatDate(blog.createdAt)}
                  </p>
                  <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-[#DCA825] transition-colors duration-300 leading-[1.3] mb-4">
                    {blog.title}
                  </h3>

                  <div className="mt-auto pt-4 flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-[#DCA825]">
                    Read Article
                    <ArrowIcon />
                  </div>
                </div>
              </Link>
              );
            })
          ) : (
            <div className="text-center col-span-full py-20 flex justify-center">
              <div className="bg-white/5 backdrop-blur-md px-10 py-6 rounded-3xl border border-white/10 shadow-sm">
                <p className="text-white/30 text-sm font-bold uppercase tracking-widest">
                  No insights found for Founders Counsel yet.
                </p>
              </div>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <nav className="mt-16 flex items-center justify-center gap-2 flex-wrap" aria-label="Pagination">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 h-10 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-[#DCA825] hover:border-[#DCA825]/50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                aria-current={page === currentPage ? 'page' : undefined}
                className={`w-10 h-10 rounded-full text-sm font-bold transition-colors ${
                  page === currentPage
                    ? 'bg-[#DCA825] text-[#110B38]'
                    : 'border border-white/10 bg-white/5 text-white/70 hover:border-[#DCA825]/50 hover:text-[#DCA825]'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 h-10 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-[#DCA825] hover:border-[#DCA825]/50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              Next
            </button>
          </nav>
        )}
      </div>
    </section>
  );
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

const ArrowIcon = () => (
  <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

export default BlogArchive;