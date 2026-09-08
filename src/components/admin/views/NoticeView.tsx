import React, { useState } from 'react';
import { NoticeItem } from '../../../types';
import { saveNotice, deleteNotice, logActivity } from '../../../services/db';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { ConfirmationModal } from '../../common/ConfirmationModal';
import { Bell, Plus, Pin, Edit2, Trash2, Calendar, Search } from 'lucide-react';

interface NoticeViewProps {
  notices: NoticeItem[];
  onRefresh: () => void;
}

export const NoticeView: React.FC<NoticeViewProps> = ({ notices, onRefresh }) => {
  const { canAccess, userProfile, userRole } = useAuth();
  const { success, error } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNotice, setEditingNotice] = useState<Partial<NoticeItem> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice?.title || !editingNotice?.content) {
      error('বিজ্ঞপ্তির শিরোনাম ও বিষয়বস্তু লিখুন');
      return;
    }

    try {
      await saveNotice({
        title: editingNotice.title,
        content: editingNotice.content,
        category: editingNotice.category || 'general',
        publishedDate: editingNotice.publishedDate || new Date().toISOString().split('T')[0],
        isPinned: !!editingNotice.isPinned,
        author: editingNotice.author || userProfile?.displayName || 'কমিটি',
        status: 'published',
        id: editingNotice.id
      });
      await logActivity(
        editingNotice.id ? 'নোটিশ সম্পাদিত' : 'নতুন নোটিশ প্রকাশিত',
        editingNotice.title,
        userProfile?.displayName || 'অ্যাডমিন',
        userRole || 'admin'
      );
      success('নোটিশ সফলভাবে সংরক্ষিত হয়েছে।');
      setIsModalOpen(false);
      setEditingNotice(null);
      onRefresh();
    } catch (err) {
      error('সংরক্ষণ ব্যর্থ হয়েছে।');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteNotice(deletingId);
      success('নোটিশ অপসারিত হয়েছে।');
      setDeletingId(null);
      onRefresh();
    } catch (err) {
      error('মুছে ফেলতে সমস্যা হয়েছে।');
    }
  };

  const filtered = notices.filter(n =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">নোটিশ ও বিজ্ঞপ্তি ব্যবস্থাপনা</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            পাবলিক ওয়েবসাইট ও ডিজিটাল বোর্ডে নোটিশ প্রকাশনা ও পিনযুক্তকরণ
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
          />
          {canAccess('admin') && (
            <button
              onClick={() => {
                setEditingNotice({
                  title: '',
                  content: '',
                  category: 'general',
                  publishedDate: new Date().toISOString().split('T')[0],
                  isPinned: false
                });
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন নোটিশ লিখুন</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">তারিখ</th>
                <th className="py-3 px-4">শিরোনাম</th>
                <th className="py-3 px-4">ক্যাটাগরি</th>
                <th className="py-3 px-4">পিন অবস্থা</th>
                <th className="py-3 px-4">প্রকাশক</th>
                {canAccess('admin') && <th className="py-3 px-4 text-right">পদক্ষেপ</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((n) => (
                <tr key={n.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-english text-slate-500">{n.publishedDate}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 max-w-xs truncate">{n.title}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                      {n.category === 'eid' ? 'ঈদ জামাত' : n.category === 'financial' ? 'আর্থিক' : 'সাধারণ'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {n.isPinned ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                        <Pin className="w-3 h-3" /> পিনযুক্ত
                      </span>
                    ) : (
                      <span className="text-slate-400">সাধারণ</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{n.author}</td>
                  {canAccess('admin') && (
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingNotice(n);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-slate-100"
                        title="সম্পাদনা"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingId(n.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && editingNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              {editingNotice.id ? 'বিজ্ঞপ্তি সম্পাদনা' : 'নতুন বিজ্ঞপ্তি প্রকাশ'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">বিজ্ঞপ্তির শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={editingNotice.title || ''}
                  onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                  placeholder="যেমন: পবিত্র ঈদুল ফিতরের মাঠ পরিষ্কার সংক্রান্ত জরুরি নোটিশ"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                  <select
                    value={editingNotice.category || 'general'}
                    onChange={(e) => setEditingNotice({ ...editingNotice, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  >
                    <option value="general">সাধারণ নোটিশ</option>
                    <option value="eid">ঈদের জামাত সংক্রান্ত</option>
                    <option value="financial">দান ও আর্থিক</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">প্রকাশের তারিখ</label>
                  <input
                    type="date"
                    value={editingNotice.publishedDate || ''}
                    onChange={(e) => setEditingNotice({ ...editingNotice, publishedDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-english"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">বিজ্ঞপ্তির বিস্তারিত বিষয়বস্তু *</label>
                <textarea
                  rows={6}
                  required
                  value={editingNotice.content || ''}
                  onChange={(e) => setEditingNotice({ ...editingNotice, content: e.target.value })}
                  placeholder="বিজ্ঞপ্তির পূর্ণ বিবরণ লিখুন..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pinned"
                  checked={!!editingNotice.isPinned}
                  onChange={(e) => setEditingNotice({ ...editingNotice, isPinned: e.target.checked })}
                  className="rounded-sm text-emerald-800"
                />
                <label htmlFor="pinned" className="font-bold text-slate-700 cursor-pointer">
                  গুরুত্বপূর্ণ নোটিশ হিসেবে সবার উপরে পিন করুন
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingNotice(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold"
                >
                  প্রকাশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deletingId}
        title="নোটিশ মুছে ফেলা"
        message="আপনি কি নিশ্চিতভাবে এই বিজ্ঞপ্তিটি মুছে ফেলতে চান?"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
