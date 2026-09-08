import React, { useState } from 'react';
import { CommitteeMember, CommitteeCategory } from '../../../types';
import { saveCommitteeMember, deleteCommitteeMember } from '../../../services/db';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { ConfirmationModal } from '../../common/ConfirmationModal';
import { Plus, Edit2, Trash2, Phone, Mail, UserCheck, Search } from 'lucide-react';

interface CommitteeViewProps {
  committee: CommitteeMember[];
  onRefresh: () => void;
}

export const CommitteeView: React.FC<CommitteeViewProps> = ({ committee, onRefresh }) => {
  const { canAccess } = useAuth();
  const { success, error } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMember, setEditingMember] = useState<Partial<CommitteeMember> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember?.name || !editingMember?.designation) {
      error('নাম ও পদবি পূরণ করুন');
      return;
    }

    try {
      await saveCommitteeMember({
        name: editingMember.name,
        nameEn: editingMember.nameEn || '',
        designation: editingMember.designation,
        category: editingMember.category || 'executive',
        phone: editingMember.phone || '',
        email: editingMember.email || '',
        order: editingMember.order || 1,
        term: editingMember.term || '২০২৪-২০২৬',
        bio: editingMember.bio || '',
        status: editingMember.status || 'active',
        id: editingMember.id
      });
      success('কমিটি সদস্য সফলভাবে সংরক্ষিত হয়েছে।');
      setIsModalOpen(false);
      setEditingMember(null);
      onRefresh();
    } catch (err) {
      error('সংরক্ষণ ব্যর্থ হয়েছে।');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteCommitteeMember(deletingId);
      success('সদস্য অপসারিত হয়েছে।');
      setDeletingId(null);
      onRefresh();
    } catch (err) {
      error('মুছে ফেলতে সমস্যা হয়েছে।');
    }
  };

  const filtered = committee.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">কমিটি সদস্য ব্যবস্থাপনা</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            পরিচালনা পরিষদ, উপদেষ্টা মণ্ডলী ও উপ-কমিটির সদস্যদের তথ্য হালনাগাদ
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
                setEditingMember({
                  name: '',
                  designation: '',
                  category: 'executive',
                  phone: '',
                  order: committee.length + 1,
                  term: '২০২৪-২০২৬'
                });
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন সদস্য যোগ করুন</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">ক্রম</th>
                <th className="py-3 px-4">নাম</th>
                <th className="py-3 px-4">পদবি</th>
                <th className="py-3 px-4">ক্যাটাগরি</th>
                <th className="py-3 px-4">মোবাইল</th>
                <th className="py-3 px-4">মেয়াদ</th>
                {canAccess('admin') && <th className="py-3 px-4 text-right">পদক্ষেপ</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-400">{m.order}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{m.name}</td>
                  <td className="py-3 px-4 text-emerald-800 font-semibold">{m.designation}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 font-medium">
                      {m.category === 'executive' ? 'কার্যনির্বাহী' : m.category === 'advisory' ? 'উপদেষ্টা' : 'অন্যান্য'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-english">{m.phone}</td>
                  <td className="py-3 px-4 text-slate-500">{m.term}</td>
                  {canAccess('admin') && (
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingMember(m);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-slate-100"
                        title="সম্পাদনা"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingId(m.id)}
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
      {isModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              {editingMember.id ? 'সদস্য তথ্য সম্পাদনা' : 'নতুন কমিটি সদস্য যোগ'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">নাম (বাংলা) *</label>
                <input
                  type="text"
                  required
                  value={editingMember.name || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">পদবি *</label>
                  <input
                    type="text"
                    required
                    value={editingMember.designation || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, designation: e.target.value })}
                    placeholder="যেমন: সাধারণ সম্পাদক"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                  <select
                    value={editingMember.category || 'executive'}
                    onChange={(e) => setEditingMember({ ...editingMember, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  >
                    <option value="executive">কার্যনির্বাহী পরিষদ</option>
                    <option value="advisory">উপদেষ্টা পরিষদ</option>
                    <option value="subcommittee">উপ-কমিটি</option>
                    <option value="general">সাধারণ পরিষদ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর</label>
                  <input
                    type="text"
                    value={editingMember.phone || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-english"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">প্রদর্শন ক্রম (Order)</label>
                  <input
                    type="number"
                    value={editingMember.order || 1}
                    onChange={(e) => setEditingMember({ ...editingMember, order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingMember(null);
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

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deletingId}
        title="সদস্য অপসারণ"
        message="আপনি কি নিশ্চিতভাবে এই সদস্যকে কমিটি তালিকা থেকে মুছে ফেলতে চান?"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
