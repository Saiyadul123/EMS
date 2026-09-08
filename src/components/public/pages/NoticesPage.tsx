import React, { useState } from 'react';
import { NoticeItem } from '../../../types';
import { Megaphone, Pin, Calendar, Search, FileText, ArrowRight } from 'lucide-react';

interface NoticesPageProps {
  notices: NoticeItem[];
}

export const NoticesPage: React.FC<NoticesPageProps> = ({ notices }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedNotice, setExpandedNotice] = useState<string | null>(null);

  const categories = [
    { key: 'all', label: 'সব বিজ্ঞপ্তি' },
    { key: 'eid', label: 'ঈদ জামাত সংক্রান্ত' },
    { key: 'financial', label: 'দান ও আর্থিক' },
    { key: 'general', label: 'সাধারণ বিজ্ঞপ্তি' }
  ];

  const filteredNotices = notices.filter((n) => {
    const matchesCat = selectedCategory === 'all' || n.category === selectedCategory;
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
          <Megaphone className="w-3.5 h-3.5 text-emerald-700" />
          <span>দাপ্তরিক বিজ্ঞপ্তি বোর্ড</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          ঈদগাহের নোটিশ ও ঘোষণা
        </h1>
        <p className="mt-3 text-base text-slate-600 font-medium">
          ঈদগাহ ময়দান পরিচালনা কমিটি কর্তৃক জারিকৃত সর্বশেষ আনুষ্ঠানিক বিজ্ঞপ্তি ও সাধারণ নির্দেশিকাসমূহ
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                selectedCategory === cat.key
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="বিজ্ঞপ্তি বিষয়বস্তু খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map((notice) => {
          const isExpanded = expandedNotice === notice.id;
          return (
            <div
              key={notice.id}
              className={`bg-white rounded-2xl border p-6 transition-all shadow-xs ${
                notice.isPinned
                  ? 'border-amber-400/80 bg-amber-50/10'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {notice.isPinned && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white">
                        <Pin className="w-3 h-3" />
                        পিনযুক্ত নোটিশ
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      {notice.publishedDate}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500 font-medium">
                      প্রকাশক: {notice.author}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {notice.title}
                  </h3>

                  <div className={`text-sm text-slate-600 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                    {notice.content}
                  </div>
                </div>

                <div className="sm:self-center shrink-0">
                  <button
                    onClick={() => setExpandedNotice(isExpanded ? null : notice.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                  >
                    <span>{isExpanded ? 'সংক্ষিপ্ত করুন' : 'বিস্তারিত পড়ুন'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
