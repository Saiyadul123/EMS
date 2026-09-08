import React, { useState } from 'react';
import { DevelopmentProject } from '../../../types';
import { saveProject, deleteProject, logActivity } from '../../../services/db';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { ConfirmationModal } from '../../common/ConfirmationModal';
import { Building, Plus, Edit2, Trash2, CheckCircle2, Clock } from 'lucide-react';

interface ProjectsViewProps {
  projects: DevelopmentProject[];
  onRefresh: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, onRefresh }) => {
  const { canAccess, userProfile, userRole } = useAuth();
  const { success, error } = useToast();
  const [editingProject, setEditingProject] = useState<Partial<DevelopmentProject> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title || !editingProject?.targetBudget) {
      error('প্রকল্পের নাম ও বাজেট পূরণ করুন');
      return;
    }

    try {
      await saveProject({
        title: editingProject.title,
        titleEn: editingProject.titleEn || '',
        description: editingProject.description || '',
        targetBudget: Number(editingProject.targetBudget),
        raisedBudget: Number(editingProject.raisedBudget || 0),
        status: editingProject.status || 'ongoing',
        startDate: editingProject.startDate || '২০২৪-০১-০১',
        completionDate: editingProject.completionDate || '',
        coverImage: editingProject.coverImage || 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80',
        id: editingProject.id
      });
      await logActivity(
        editingProject.id ? 'উন্নয়ন প্রকল্প সম্পাদিত' : 'নতুন উন্নয়ন প্রকল্প গৃহীত',
        editingProject.title,
        userProfile?.displayName || 'অ্যাডমিন',
        userRole || 'admin'
      );
      success('উন্নয়ন প্রকল্প সংরক্ষিত হয়েছে।');
      setIsModalOpen(false);
      setEditingProject(null);
      onRefresh();
    } catch (err) {
      error('সংরক্ষণ ব্যর্থ হয়েছে।');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteProject(deletingId);
      success('প্রকল্প অপসারিত হয়েছে।');
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
          <h2 className="text-2xl font-extrabold text-slate-900">উন্নয়ন প্রকল্প ব্যবস্থাপনা (Projects)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ঈদগাহ ময়দানের অবকাঠামো, মিনার নির্মাণ ও সম্প্রসারণ প্রকল্পের বাজেট ও অগ্রগতি
          </p>
        </div>

        {canAccess('admin') && (
          <button
            onClick={() => {
              setEditingProject({
                title: '',
                description: '',
                targetBudget: 500000,
                raisedBudget: 0,
                status: 'ongoing',
                startDate: new Date().toISOString().split('T')[0]
              });
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন প্রকল্প যোগ করুন</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => {
          const percent = Math.min(100, Math.round((proj.raisedBudget / proj.targetBudget) * 100));
          return (
            <div
              key={proj.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="h-40 bg-slate-100 relative">
                  <img
                    src={proj.coverImage}
                    alt={proj.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
                      proj.status === 'completed'
                        ? 'bg-emerald-600 text-white'
                        : proj.status === 'ongoing'
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-700 text-white'
                    }`}
                  >
                    {proj.status === 'completed' ? 'সম্পন্ন' : proj.status === 'ongoing' ? 'চলমান' : 'পরিকল্পনাধীন'}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-base font-bold text-slate-900">{proj.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{proj.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0 space-y-3">
                <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-500">সংগৃহীত:</span>
                    <span className="text-emerald-800 font-bold">
                      ৳{proj.raisedBudget.toLocaleString('bn-BD')} / ৳{proj.targetBudget.toLocaleString('bn-BD')}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                  <div className="text-[11px] text-slate-400 text-right">{percent}% সম্পন্ন</div>
                </div>

                {canAccess('admin') && (
                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setEditingProject(proj);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(proj.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              {editingProject.id ? 'প্রকল্প সম্পাদনা' : 'নতুন উন্নয়ন প্রকল্প'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">প্রকল্পের নাম *</label>
                <input
                  type="text"
                  required
                  value={editingProject.title || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">টার্গেট বাজেট (টাকা) *</label>
                  <input
                    type="number"
                    required
                    value={editingProject.targetBudget || 0}
                    onChange={(e) => setEditingProject({ ...editingProject, targetBudget: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">উত্তোলিত অর্থ (টাকা)</label>
                  <input
                    type="number"
                    value={editingProject.raisedBudget || 0}
                    onChange={(e) => setEditingProject({ ...editingProject, raisedBudget: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">অবস্থা (Status)</label>
                  <select
                    value={editingProject.status || 'ongoing'}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  >
                    <option value="planning">পরিকল্পনাধীন</option>
                    <option value="ongoing">চলমান</option>
                    <option value="completed">সম্পন্ন</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">শুরুর তারিখ</label>
                  <input
                    type="date"
                    value={editingProject.startDate || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-english"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">প্রকল্পের বর্ণনা</label>
                <textarea
                  rows={3}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingProject(null);
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
        title="প্রকল্প মুছে ফেলা"
        message="আপনি কি নিশ্চিতভাবে এই প্রকল্পটি মুছে ফেলতে চান?"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
