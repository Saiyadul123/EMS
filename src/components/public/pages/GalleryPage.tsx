import React, { useState } from 'react';
import { GalleryItem } from '../../../types';
import { Image, Calendar, Tag, X, ZoomIn } from 'lucide-react';

interface GalleryPageProps {
  gallery: GalleryItem[];
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ gallery }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const categories = [
    { key: 'all', label: 'সব ছবি' },
    { key: 'eid_ul_fitr', label: 'ঈদুল ফিতর জামাত' },
    { key: 'eid_ul_adha', label: 'ঈদুল আজহা জামাত' },
    { key: 'development', label: 'উন্নয়ন ও মিনার কাজ' },
    { key: 'social', label: 'সামাজিক ও ইফতার আয়োজন' }
  ];

  const filteredItems = gallery.filter(
    (item) => activeCategory === 'all' || item.category === activeCategory
  );

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
          <Image className="w-3.5 h-3.5 text-emerald-700" />
          <span>ঐতিহাসিক স্মৃতিমালা</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          ফটো ও ভিডিও গ্যালারি
        </h1>
        <p className="mt-3 text-base text-slate-600 font-medium">
          ঐতিহাসিক শাহী ঈদগাহ ময়দানে অনুষ্ঠিত বিভিন্ন বছরের ঈদ জামাত, উন্নয়ন প্রকল্প ও দোয়া মাহফিলের স্মরণীয় চিত্রমালা
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeCategory === cat.key
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedPhoto(item)}
            className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col"
          >
            <div className="relative h-64 bg-slate-100 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="p-3 rounded-full bg-white/90 text-slate-900 shadow-md">
                  <ZoomIn className="w-5 h-5" />
                </span>
              </div>
              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                {item.year}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-emerald-800 transition-colors">
                  {item.title}
                </h3>
                {item.caption && (
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">
                    {item.caption}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 text-white">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] bg-black flex items-center justify-center">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="max-h-[70vh] w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-6 bg-slate-900 border-t border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{selectedPhoto.year} সাল</span>
              </div>
              <h3 className="text-lg font-bold text-white">{selectedPhoto.title}</h3>
              {selectedPhoto.caption && (
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  {selectedPhoto.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
