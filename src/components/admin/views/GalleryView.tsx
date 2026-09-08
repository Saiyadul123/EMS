import React, { useState } from 'react';
import { GalleryItem } from '../../../types';
import { saveGalleryItem, deleteGalleryItem, logActivity } from '../../../services/db';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { ConfirmationModal } from '../../common/ConfirmationModal';
import { Image, Plus, Trash2, Edit2, Sparkles, ZoomIn } from 'lucide-react';

interface GalleryViewProps {
  gallery: GalleryItem[];
  onRefresh: () => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ gallery, onRefresh }) => {
  const { canAccess, userProfile, userRole } = useAuth();
  const { success, error } = useToast();
  const [editingItem, setEditingItem] = useState<Partial<GalleryItem> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title || !editingItem?.imageUrl) {
      error('ছবি ও শিরোনাম দিন');
      return;
    }

    try {
      await saveGalleryItem({
        title: editingItem.title,
        imageUrl: editingItem.imageUrl,
        category: editingItem.category || 'eid_ul_fitr',
        year: editingItem.year || '২০২৪',
        caption: editingItem.caption || '',
        order: editingItem.order || 1,
        id: editingItem.id
      });
      await logActivity(
        editingItem.id ? 'গ্যালারি ছবি সম্পাদিত' : 'নতুন ছবি যুক্ত',
        editingItem.title,
        userProfile?.displayName || 'অ্যাডমিন',
        userRole || 'admin'
      );
      success('ছবি সফলভাবে সংরক্ষিত হয়েছে।');
      setIsModalOpen(false);
      setEditingItem(null);
      onRefresh();
    } catch (err) {
      error('সংরক্ষণ ব্যর্থ হয়েছে।');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteGalleryItem(deletingId);
      success('ছবি অপসারিত হয়েছে।');
      setDeletingId(null);
      onRefresh();
    } catch (err) {
      error('মুছে ফেলতে সমস্যা হয়েছে।');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">ফটো ও ভিডিও গ্যালারি ব্যবস্থাপনা</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ঈদ জামাত, মেগা প্রজেক্ট ও মাহফিলের স্মরণীয় ছবি ও ক্যাপশন নিয়ন্ত্রণ
          </p>
        </div>

        {canAccess('admin') && (
          <button
            onClick={() => {
              setEditingItem({
                title: '',
                imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
                category: 'eid_ul_fitr',
                year: '২০২৪',
                caption: ''
              });
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন ছবি যোগ করুন</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs flex flex-col justify-between"
          >
            <div className="h-44 bg-slate-100 relative">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-900/80 text-white text-[11px] rounded-md font-semibold">
                {item.year}
              </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{item.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{item.caption || 'কোনো ক্যাপশন নেই'}</p>
              </div>

              {canAccess('admin') && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-slate-50"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingId(item.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              {editingItem.id ? 'ছবি তথ্য সম্পাদনা' : 'নতুন ছবি যোগ'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ছবির শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ছবির ওয়েব ইউআরএল (Image URL) *</label>
                <input
                  type="url"
                  required
                  value={editingItem.imageUrl || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-english"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                  <select
                    value={editingItem.category || 'eid_ul_fitr'}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  >
                    <option value="eid_ul_fitr">ঈদুল ফিতর জামাত</option>
                    <option value="eid_ul_adha">ঈদুল আজহা জামাত</option>
                    <option value="development">উন্নয়ন ও মিনার কাজ</option>
                    <option value="social">সামাজিক ও ইফতার আয়োজন</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">বছর (সাল)</label>
                  <input
                    type="text"
                    value={editingItem.year || '২০২৪'}
                    onChange={(e) => setEditingItem({ ...editingItem, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ক্যাপশন / বর্ণনা</label>
                <textarea
                  rows={3}
                  value={editingItem.caption || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={!!deletingId}
        title="ছবি মুছে ফেলা"
        message="আপনি কি নিশ্চিতভাবে এই ছবিটি গ্যালারি থেকে মুছে ফেলতে চান?"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
