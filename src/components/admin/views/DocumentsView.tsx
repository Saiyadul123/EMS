import React, { useState } from 'react';
import { LegalDocument } from '../../../types';
import { saveDocument, deleteDocument, logActivity } from '../../../services/db';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { ConfirmationModal } from '../../common/ConfirmationModal';
import { FileCheck, Plus, Trash2, Download, Shield, Eye, Lock } from 'lucide-react';

interface DocumentsViewProps {
  documents: LegalDocument[];
  onRefresh: () => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ documents, onRefresh }) => {
  const { canAccess, userProfile, userRole } = useAuth();
  const { success, error } = useToast();
  const [editingDoc, setEditingDoc] = useState<Partial<LegalDocument> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc?.title) {
      error('দলিলের নাম লিখুন');
      return;
    }

    try {
      await saveDocument({
        title: editingDoc.title,
        docType: editingDoc.docType || 'waqf_deed',
        fileUrl: editingDoc.fileUrl || 'https://example.com/doc.pdf',
        uploadDate: editingDoc.uploadDate || new Date().toISOString().split('T')[0],
        accessLevel: editingDoc.accessLevel || 'admin',
        fileSize: editingDoc.fileSize || '২.৪ মেগাবাইট',
        description: editingDoc.description || '',
        id: editingDoc.id
      });
      await logActivity(
        'আইনি ও ওয়াকফ নথি আপলোড/হালনাগাদ',
        editingDoc.title,
        userProfile?.displayName || 'অ্যাডমিন',
        userRole || 'admin'
      );
      success('নথি সফলভাবে সংরক্ষিত হয়েছে।');
      setIsModalOpen(false);
      setEditingDoc(null);
      onRefresh();
    } catch (err) {
      error('সংরক্ষণ ব্যর্থ হয়েছে।');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteDocument(deletingId);
      success('নথি অপসারিত হয়েছে।');
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
          <h2 className="text-2xl font-extrabold text-slate-900">নথিপত্র, ওয়াকফ সনদ ও দলিল সংরক্ষণাগার</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            বাংলাদেশ ওয়াকফ প্রশাসন সনদ, ভূমি খতিয়ান, গঠনতন্ত্র ও বাৎসরিক অডিট রিপোর্ট
          </p>
        </div>

        {canAccess('admin') && (
          <button
            onClick={() => {
              setEditingDoc({
                title: '',
                docType: 'waqf_deed',
                accessLevel: 'admin',
                uploadDate: new Date().toISOString().split('T')[0],
                fileSize: '১.৮ মেগাবাইট'
              });
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন নথি যুক্ত করুন</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
                  <FileCheck className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  {doc.accessLevel === 'public' ? 'উন্মুক্ত' : 'প্রশাসনিক'}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm">{doc.title}</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{doc.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="text-[11px] text-slate-400 font-english">
                {doc.uploadDate} • {doc.fileSize}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => success(`${doc.title} ফাইলটি ডাউনলোড শুরু হয়েছে`)}
                  className="p-1.5 text-emerald-800 hover:bg-emerald-50 rounded-lg"
                  title="ডাউনলোড"
                >
                  <Download className="w-4 h-4" />
                </button>
                {canAccess('admin') && (
                  <button
                    onClick={() => setDeletingId(doc.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              নতুন নথি সংরক্ষণ
            </h3>
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">নথির নাম *</label>
                <input
                  type="text"
                  required
                  value={editingDoc.title || ''}
                  onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                  placeholder="যেমন: ওয়াকফ প্রশাসন নিবন্ধন সনদপত্র"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">নথির ধরন</label>
                  <select
                    value={editingDoc.docType || 'waqf_deed'}
                    onChange={(e) => setEditingDoc({ ...editingDoc, docType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  >
                    <option value="waqf_deed">ওয়াকফ দলিল</option>
                    <option value="land_record">ভূমির খতিয়ান/পর্চা</option>
                    <option value="audit_report">অডিট রিপোর্ট</option>
                    <option value="constitution">গঠনতন্ত্র</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">অ্যাক্সেস লেভেল</label>
                  <select
                    value={editingDoc.accessLevel || 'admin'}
                    onChange={(e) => setEditingDoc({ ...editingDoc, accessLevel: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  >
                    <option value="admin">প্রশাসনিক (Admin Only)</option>
                    <option value="committee">কমিটি সদস্য (Committee)</option>
                    <option value="public">পাবলিক (উন্মুক্ত)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">সংক্ষিপ্ত বিবরণ</label>
                <textarea
                  rows={3}
                  value={editingDoc.description || ''}
                  onChange={(e) => setEditingDoc({ ...editingDoc, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingDoc(null)}
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
        title="নথি মুছে ফেলা"
        message="আপনি কি নিশ্চিতভাবে এই নথিটি মুছে ফেলতে চান?"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
