import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Calendar, User, Clock, ArrowRight, BookOpen, ChevronRight, X, AlertCircle } from 'lucide-react';
import { BlogPost } from '../types';
import { cleanGoogleDriveUrl } from '../utils/imageUtils';

const SignatureDivider = () => (
  <div className="flex items-center justify-center space-x-4 py-4">
    <div className="h-[1px] bg-[#C5A059]/30 w-16" />
    <div className="w-2 h-2 rotate-45 bg-[#C5A059] border border-[#1B3022]/40" />
    <div className="h-[1px] bg-[#C5A059]/30 w-16" />
  </div>
);

interface BlogProps {
  hideHeader?: boolean;
}

export default function Blog({ hideHeader = false }: BlogProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetch('/api/blog')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Fallo al cargar artículos de blog');
      })
      .then((data) => setPosts(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['Todos', 'Ecología', 'Comunidad', 'Adulto Mayor', 'Institucional'];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.summary.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'Todos' || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredPost = posts.find(p => p.featured) || (posts.length > 0 ? posts[0] : null);
  const nonFeaturedPosts = filteredPosts.filter(p => !featuredPost || p.id !== featuredPost.id);

  return (
    <div className="py-16 bg-[#F5F2ED] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page title header */}
        {!hideHeader && (
          <div className="text-center space-y-3 max-w-3xl mx-auto mb-12">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059] block">
              Artículos y Vivencias
            </span>
            <h1 className="font-display text-3xl sm:text-4.5xl font-black text-[#1B3022] tracking-tight">
              Blog de VOSERDEM
            </h1>
            <SignatureDivider />
            <p className="text-xs text-[#2C2C2C] leading-relaxed font-sans">
              Explora las historias reales, el conocimiento técnico agroecológico y el espíritu voluntario de los proyectos activos en Cochabamba, Chocaya y la cordillera del Tunari.
            </p>
          </div>
        )}

        {/* Filter bars & Search */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#FCF9F8] border border-[#C5A059]/30 p-4 rounded-[8px] shadow-none">
          {/* Categories Tab Pill Selector */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#1B3022] text-[#F5F2ED] shadow-none'
                    : 'bg-[#C5A059]/10 text-[#2C2C2C] hover:bg-[#C5A059]/20 hover:text-[#1B3022]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search box input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C5A059]" />
            <input
              type="text"
              placeholder="Buscar historias o temas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#FCF9F8] border border-[#C5A059]/30 rounded-[4px] pl-10 pr-4 py-2.5 text-xs text-[#2C2C2C] placeholder-[#2C2C2C]/50 outline-none focus:ring-1 focus:ring-[#1B3022] focus:border-[#1B3022] transition-all font-sans"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3022]"></div>
          </div>
        ) : (
          <>
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16 bg-[#FCF9F8] rounded-[8px] border border-dashed border-[#C5A059]/30 max-w-xl mx-auto space-y-3">
                <AlertCircle className="h-8 w-8 text-[#C5A059] mx-auto" />
                <h3 className="font-display text-lg font-bold text-[#1B3022]">No se encontraron publicaciones</h3>
                <p className="text-xs text-[#2C2C2C]/80 font-sans">Intenta modificar tus términos de búsqueda o cambiar de categoría.</p>
              </div>
            ) : (
              <div className="space-y-12">
                
                {/* 1. Featured Article Block */}
                {featuredPost && selectedCategory === 'Todos' && searchTerm === '' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-[#FCF9F8] border border-[#C5A059]/30 rounded-[8px] overflow-hidden shadow-none hover:border-[#1B3022]/40 transition-colors grid grid-cols-1 lg:grid-cols-12"
                  >
                    <div className="lg:col-span-7 h-64 sm:h-96 lg:h-full relative overflow-hidden bg-[#C5A059]/10">
                      <div className="absolute inset-0">
                        <img 
                          src={cleanGoogleDriveUrl(featuredPost.image)} 
                          alt={featuredPost.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="absolute top-4 left-4 bg-[#C5A059] text-[#1B3022] text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-[2px] border border-[#1B3022]/20 z-10">
                        Destacado
                      </span>
                    </div>

                    <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#C5A059]">
                          {featuredPost.category}
                        </span>
                        
                        <h2 className="font-display text-2xl font-black text-[#1B3022] leading-tight">
                          {featuredPost.title}
                        </h2>
                        
                        <div className="text-xs text-[#2C2C2C] leading-relaxed font-sans space-y-3">
                          <p className="font-bold">{featuredPost.summary}</p>
                          <p className="line-clamp-[10] text-justify opacity-90">
                            {featuredPost.content}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-[#C5A059]/20 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-[4px] bg-[#1B3022]/10 border border-[#C5A059]/20 flex items-center justify-center text-[#1B3022]">
                            <User className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-[#1B3022]">{featuredPost.author}</span>
                            <div className="flex items-center gap-2 text-[10px] text-[#2C2C2C]/70">
                              <span className="flex items-center gap-1 font-sans">
                                <Calendar className="h-3 w-3 text-[#C5A059]" /> {featuredPost.date}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1 font-sans">
                                <Clock className="h-3 w-3 text-[#C5A059]" /> {featuredPost.readTime}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => setSelectedPost(featuredPost)}
                          className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#1B3022] hover:text-[#C5A059] transition-colors cursor-pointer"
                        >
                          <span>Leer completo</span>
                          <ArrowRight className="h-3.5 w-3.5 text-[#C5A059]" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. Grid of Articles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(selectedCategory !== 'Todos' || searchTerm !== '' ? filteredPosts : nonFeaturedPosts).map((post, idx) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      className="bg-[#FCF9F8] border border-[#C5A059]/30 rounded-[8px] overflow-hidden shadow-none hover:border-[#1B3022]/40 transition-colors flex flex-col justify-between group"
                    >
                      <div>
                        {/* Article image */}
                        <div className="relative h-48 overflow-hidden bg-[#C5A059]/10">
                          <img 
                            src={cleanGoogleDriveUrl(post.image)} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-555"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute bottom-4 left-4 bg-[#C5A059]/90 text-[#1B3022] text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-[2px] border border-[#1B3022]/20 shadow-none">
                            {post.category}
                          </span>
                        </div>

                        {/* Article Body */}
                        <div className="p-6 space-y-3.5">
                          <div className="flex items-center gap-3 text-[10px] text-[#2C2C2C]/70">
                            <span className="flex items-center gap-1 font-sans"><Calendar className="h-3 w-3 text-[#C5A059]" /> {post.date}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 font-sans"><Clock className="h-3 w-3 text-[#C5A059]" /> {post.readTime}</span>
                          </div>
                          
                          <h3 className="font-display text-lg font-bold text-[#1B3022] leading-snug group-hover:text-[#C5A059] transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          
                          <p className="text-xs text-[#2C2C2C] leading-relaxed line-clamp-3 font-sans">
                            {post.summary}
                          </p>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="p-6 pt-0 border-t border-[#C5A059]/15 flex items-center justify-between mt-auto">
                        <span className="text-[10px] text-[#2C2C2C]/80 italic font-sans">Por: {post.author.split(',')[0]}</span>
                        <button 
                          onClick={() => setSelectedPost(post)}
                          className="flex items-center gap-0.5 text-[10px] font-black uppercase tracking-widest text-[#1B3022] hover:text-[#C5A059] transition-colors cursor-pointer"
                        >
                          <span>Saber más</span>
                          <ChevronRight className="h-3.5 w-3.5 text-[#C5A059]" />
                        </button>
                      </div>
                    </motion.article>
                  ))}
                </div>

              </div>
            )}
          </>
        )}

      </div>

      {/* Reader Dialog Overlay Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="fixed inset-0 bg-[#2C2C2C]/75 backdrop-blur-xs"
            />

            {/* Modal Body container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
              className="bg-[#FCF9F8] w-full max-w-3xl rounded-[8px] overflow-hidden shadow-2xl relative z-50 max-h-[90vh] flex flex-col border border-[#C5A059]/40"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 bg-[#2C2C2C]/80 text-[#F5F2ED] hover:text-[#C5A059] rounded-[4px] p-2 transition-colors z-20 cursor-pointer border border-[#C5A059]/30"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="overflow-y-auto">
                {/* Hero Image */}
                <div className="h-64 sm:h-80 relative bg-[#C5A059]/10">
                  <img 
                    src={cleanGoogleDriveUrl(selectedPost.image)} 
                    alt={selectedPost.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2C]/90 via-black/25 to-transparent" />
                  
                  {/* Overlay Title */}
                  <div className="absolute bottom-6 left-6 right-6 text-[#F5F2ED] space-y-2">
                    <span className="bg-[#1B3022] text-[#F5F2ED] text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-[2px] border border-[#C5A059]/30">
                      {selectedPost.category}
                    </span>
                    <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight">
                      {selectedPost.title}
                    </h2>
                  </div>
                </div>

                {/* Meta details strip */}
                <div className="bg-[#F5F2ED] px-6 sm:px-8 py-4 border-b border-[#C5A059]/25 flex flex-wrap items-center gap-6 text-xs text-[#2C2C2C]">
                  <span className="flex items-center gap-1.5 font-sans"><Calendar className="h-4 w-4 text-[#C5A059]" /> <strong>Fecha:</strong> {selectedPost.date}</span>
                  <span className="flex items-center gap-1.5 font-sans"><User className="h-4 w-4 text-[#C5A059]" /> <strong>Autor/a:</strong> {selectedPost.author}</span>
                  <span className="flex items-center gap-1.5 font-sans"><Clock className="h-4 w-4 text-[#C5A059]" /> <strong>Lectura:</strong> {selectedPost.readTime}</span>
                </div>

                {/* Article Content */}
                <div className="p-6 sm:p-10 space-y-6">
                  {/* Summary / Lead paragraph */}
                  <p className="font-sans text-xs sm:text-sm font-bold text-[#1B3022] leading-relaxed border-l-4 border-[#C5A059] pl-4 italic bg-[#C5A059]/10 py-3.5 rounded-r-[4px]">
                    {selectedPost.summary}
                  </p>

                  {/* Body Paragraphs */}
                  <div className="text-xs sm:text-sm text-[#2C2C2C] leading-relaxed whitespace-pre-line space-y-4 font-sans">
                    {selectedPost.content}
                  </div>

                  {/* Corporate values seal */}
                  <div className="border-t border-[#C5A059]/20 pt-8 flex items-center justify-between gap-4 bg-[#FCF9F8]">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-[#C5A059]" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#1B3022]">VOSERDEM Bolivia • Sostenibilidad y Transparencia</span>
                    </div>
                    <button
                      onClick={() => setSelectedPost(null)}
                      className="px-5 py-2.5 bg-transparent hover:bg-[#1B3022]/10 text-[#1B3022] border border-[#1B3022] rounded-[4px] font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                    >
                      Cerrar Lectura
                    </button>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
