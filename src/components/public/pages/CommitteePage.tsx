import React, { useState } from 'react';
import { CommitteeMember, CommitteeCategory } from '../../../types';
import { Phone, Mail, Sparkles, Users, Filter, Search } from 'lucide-react';

interface CommitteePageProps {
  committee: CommitteeMember[];
}

export const CommitteePage: React.FC<CommitteePageProps> = ({ committee }) => {
  const [selectedCategory, setSelectedCategory] = useState<CommitteeCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories: { key: CommitteeCategory | 'all'; label: string }[] = [
    { key: 'all', label: 'সকল সদস্য' },
    { key: 'executive', label: 'কার্যনির্বাহী পরিষদ' },
    { key: 'advisory', label: 'উপদেষ্টা পরিষদ' },
    { key: 'subcommittee', label: 'উপ-কমিটি' },
    { key: 'general', label: 'সাধারণ পরিষদ' }
  ];

  const filteredMembers = committee.filter((m) => {
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.nameEn && m.nameEn.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
          <Users className="w-3.5 h-3.5 text-emerald-700" />
          <span>নেতৃত্ব ও পরিচালনা</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          ঈদগাহ পরিচালনা ও উপদেষ্টা পরিষদ
        </h1>
        <p className="mt-3 text-base text-slate-600 font-medium">
          ঐতিহাসিক শাহী ঈদগাহ ময়দানের সুষ্ঠু পরিচালনা, অবকাঠামো উন্নয়ন ও পবিত্র জামাত আয়োজনে নিয়োজিত সম্মানিত সদস্যবৃন্দ
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

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="নাম বা পদবি দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center text-2xl font-bold border-2 border-emerald-200 mb-4 overflow-hidden shadow-inner">
                {member.photoUrl ? (
                  <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{member.name.split(' ')[0][0]}</span>
                )}
              </div>

              <h3 className="font-bold text-slate-900 text-base">{member.name}</h3>
              {member.nameEn && (
                <p className="text-xs text-slate-400 font-medium font-english">{member.nameEn}</p>
              )}
              <div className="mt-2 inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-100">
                {member.designation}
              </div>

              <p className="text-xs text-slate-500 mt-2 font-medium">মেয়াদকাল: {member.term}</p>

              {member.bio && (
                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed italic">
                  "{member.bio}"
                </p>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-4 text-xs text-slate-600 font-medium">
              <a
                href={`tel:${member.phone}`}
                className="inline-flex items-center gap-1 hover:text-emerald-700 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{member.phone}</span>
              </a>
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center gap-1 hover:text-emerald-700 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ইমেইল</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
