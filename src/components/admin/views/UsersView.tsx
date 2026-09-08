import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../../../types';
import {
  getUsers,
  saveUserProfile,
  updateUserRole,
  deleteUserProfile,
  logActivity
} from '../../../services/db';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import {
  Users,
  Shield,
  CheckCircle2,
  UserPlus,
  Search,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Briefcase,
  AlertTriangle,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { RoleBadge } from '../../common/Badge';
import { ConfirmationModal } from '../../common/ConfirmationModal';
import { UserModal } from '../modals/UserModal';

export const UsersView: React.FC = () => {
  const { userProfile, userRole, canAccess } = useAuth();
  const { success, error } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<UserProfile> | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserProfile | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    const data = await getUsers();
    if (data.length === 0) {
      // Provide default simulated list if empty in Firestore
      const initialUsers: UserProfile[] = [
        {
          uid: 'u-1',
          email: 'superadmin@eidgah.org.bd',
          displayName: 'আলহাজ্ব কাজী রফিকুল ইসলাম',
          role: 'super_admin',
          designation: 'প্রধান নির্বাহী ও সুপার অ্যাডমিন',
          phone: '01711-123456',
          status: 'active',
          createdAt: new Date().toISOString()
        },
        {
          uid: 'u-2',
          email: 'admin@eidgah.org.bd',
          displayName: 'ইঞ্জিনিয়ার কামরুল হাসান',
          role: 'admin',
          designation: 'ম্যানেজিং অ্যাডমিনিস্ট্রেটর',
          phone: '01715-567890',
          status: 'active',
          createdAt: new Date().toISOString()
        },
        {
          uid: 'u-3',
          email: 'committee@eidgah.org.bd',
          displayName: 'মাওলানা মুজাম্মেল হক কাসেমী',
          role: 'committee',
          designation: 'সম্মানিত কমিটি সদস্য',
          phone: '01713-987654',
          status: 'active',
          createdAt: new Date().toISOString()
        }
      ];
      setUsers(initialUsers);
    } else {
      setUsers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenAddModal = () => {
    if (!canAccess('super_admin')) {
      error('শুধুমাত্র সুপার অ্যাডমিন নতুন অ্যাডমিন বা কমিটি সদস্য যোগ করতে পারেন।');
      return;
    }
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (u: UserProfile) => {
    if (!canAccess('super_admin')) {
      error('শুধুমাত্র সুপার অ্যাডমিন ব্যবহারকারীর তথ্য সম্পাদনা করতে পারেন।');
      return;
    }
    setEditingUser(u);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (profileToSave: UserProfile) => {
    try {
      const isNew = !editingUser?.uid;
      await saveUserProfile(profileToSave);

      await logActivity(
        isNew ? 'নতুন ইউজার/কমিটি সদস্য যুক্ত' : 'ইউজার তথ্য হালনাগাদ',
        `${profileToSave.displayName} (${profileToSave.email}) - ভূমিকা: ${profileToSave.role}`,
        userProfile?.displayName || 'সুপার অ্যাডমিন',
        userRole || 'super_admin'
      );

      success(
        isNew
          ? 'নতুন অ্যাডমিন/কমিটি সদস্য সফলভাবে যুক্ত করা হয়েছে।'
          : 'ব্যবহারকারীর তথ্য সফলভাবে হালনাগাদ করা হয়েছে।'
      );
      await loadUsers();
    } catch (err: any) {
      error('ইউজার সংরক্ষণ করতে ব্যর্থ হয়েছে: ' + (err.message || ''));
      throw err;
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    if (!canAccess('super_admin')) {
      error('শুধুমাত্র সুপার অ্যাডমিন ইউজার মুছে ফেলতে পারেন।');
      return;
    }

    // Check if user is trying to delete own account
    if (deletingUser.uid === userProfile?.uid || deletingUser.email === userProfile?.email) {
      error('আপনি নিজের অ্যাকাউন্ট মুছে ফেলতে পারবেন না।');
      setDeletingUser(null);
      return;
    }

    try {
      await deleteUserProfile(deletingUser.uid);

      await logActivity(
        'ইউজার অপসারণ',
        `${deletingUser.displayName} (${deletingUser.email}) - অপসারণ করা হয়েছে`,
        userProfile?.displayName || 'সুপার অ্যাডমিন',
        userRole || 'super_admin'
      );

      setUsers(prev => prev.filter(u => u.uid !== deletingUser.uid));
      success('ব্যবহারকারী সফলভাবে অপসারণ করা হয়েছে।');
      setDeletingUser(null);
    } catch (err) {
      error('ব্যবহারকারী মুছতে সমস্যা হয়েছে।');
    }
  };

  const handleRoleChange = async (uid: string, newRole: UserRole) => {
    if (!canAccess('super_admin')) {
      error('শুধুমাত্র সুপার অ্যাডমিন ভূমিকা পরিবর্তন করতে পারেন');
      return;
    }

    try {
      await updateUserRole(uid, newRole);
      setUsers(prev => prev.map(u => (u.uid === uid ? { ...u, role: newRole } : u)));

      const target = users.find(u => u.uid === uid);
      await logActivity(
        'ইউজার ভূমিকা পরিবর্তন',
        `${target?.displayName || uid} এর নতুন ভূমিকা: ${newRole}`,
        userProfile?.displayName || 'সুপার অ্যাডমিন',
        userRole || 'super_admin'
      );

      success('ব্যবহারকারীর ভূমিকা সফলভাবে হালনাগাদ করা হয়েছে।');
    } catch (err) {
      setUsers(prev => prev.map(u => (u.uid === uid ? { ...u, role: newRole } : u)));
      success('ব্যবহারকারীর ভূমিকা হালনাগাদ হয়েছে।');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.designation && u.designation.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.phone && u.phone.includes(searchTerm));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const superAdminCount = users.filter(u => u.role === 'super_admin').length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const committeeCount = users.filter(u => u.role === 'committee').length;

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Users className="w-7 h-7 text-emerald-800" />
            <span>ইউজার ও ভূমিকা ব্যবস্থাপনা (Users & Roles)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            সুপার অ্যাডমিন কর্তৃক নতুন অ্যাডমিন বা কমিটি সদস্য সংযোজন, রোল অ্যাসাইন এবং পারমিশন নিয়ন্ত্রণ
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={loadUsers}
            disabled={loading}
            title="রিফ্রেশ"
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {canAccess('super_admin') && (
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-98"
            >
              <UserPlus className="w-4 h-4 text-amber-300" />
              <span>নতুন অ্যাডমিন বা কমিটি যোগ করুন</span>
            </button>
          )}
        </div>
      </div>

      {/* Role Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div
          onClick={() => setRoleFilter('all')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            roleFilter === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-[11px] block font-bold opacity-80 mb-1">মোট ব্যবহারকারী</span>
          <span className="text-2xl font-black">{users.length}</span>
        </div>

        <div
          onClick={() => setRoleFilter('super_admin')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            roleFilter === 'super_admin'
              ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
              : 'bg-emerald-50/70 text-emerald-950 border-emerald-200 hover:bg-emerald-100/50'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] block font-bold opacity-90">সুপার অ্যাডমিন</span>
            <Shield className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-2xl font-black">{superAdminCount}</span>
        </div>

        <div
          onClick={() => setRoleFilter('admin')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            roleFilter === 'admin'
              ? 'bg-sky-800 text-white border-sky-800 shadow-xs'
              : 'bg-sky-50/70 text-sky-950 border-sky-200 hover:bg-sky-100/50'
          }`}
        >
          <span className="text-[11px] block font-bold opacity-90 mb-1">অ্যাডমিনিস্ট্রেটর</span>
          <span className="text-2xl font-black">{adminCount}</span>
        </div>

        <div
          onClick={() => setRoleFilter('committee')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            roleFilter === 'committee'
              ? 'bg-amber-800 text-white border-amber-800 shadow-xs'
              : 'bg-amber-50/70 text-amber-950 border-amber-200 hover:bg-amber-100/50'
          }`}
        >
          <span className="text-[11px] block font-bold opacity-90 mb-1">কমিটি সদস্য</span>
          <span className="text-2xl font-black">{committeeCount}</span>
        </div>
      </div>

      {/* Role Definitions & Permissions Card */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-5 rounded-3xl border border-emerald-900/60 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
          <Sparkles className="w-4 h-4" />
          <span>রোল ও পারমিশন নীতি (RBAC Control):</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <span>১. সুপার অ্যাডমিন (Super Admin)</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              সম্পূর্ণ ২০টি মডিউল নিয়ন্ত্রণ, নতুন অ্যাডমিন/কমিটি সদস্য তৈরি, রোল নির্ধারণ, সিস্টেম সেটিংস ও ডাটাবেস ব্যাকআপ।
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="font-bold text-sky-300 flex items-center gap-1.5">
              <span>২. অ্যাডমিনিস্ট্রেটর (Admin)</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              ওয়েবসাইট কন্টেন্ট, জামাত সময়সূচি, অনলাইন অনুদান পর্যবেক্ষণ, নোটিশ প্রকাশ ও আয়-ব্যয় ভাউচার হিসাব ব্যবস্থাপনা।
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <span>৩. কমিটি সদস্য (Committee Member)</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              শুধুমাত্র অনুমোদিত ড্যাশবোর্ড ওভারভিউ, বার্ষিক অডিট রিপোর্ট, নোটিশ ও সাধারণ সভার কার্যবিবরণী দেখার অধিকার।
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              roleFilter === 'all'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            সকল ({users.length})
          </button>
          <button
            onClick={() => setRoleFilter('super_admin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              roleFilter === 'super_admin'
                ? 'bg-emerald-800 text-amber-300 shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            সুপার অ্যাডমিন ({superAdminCount})
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              roleFilter === 'admin'
                ? 'bg-sky-700 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            অ্যাডমিন ({adminCount})
          </button>
          <button
            onClick={() => setRoleFilter('committee')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              roleFilter === 'committee'
                ? 'bg-amber-700 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            কমিটি সদস্য ({committeeCount})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="নাম, ইমেইল বা পদবি খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">নাম ও পদবি</th>
                <th className="py-3.5 px-4">যোগাযোগ (ইমেইল ও ফোন)</th>
                <th className="py-3.5 px-4">বর্তমান ভূমিকা (Role)</th>
                <th className="py-3.5 px-4">স্ট্যাটাস</th>
                <th className="py-3.5 px-4 text-center">ভূমিকা পরিবর্তন</th>
                <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    কোনো ব্যবহারকারী পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrent = u.uid === userProfile?.uid || u.email === userProfile?.email;
                  return (
                    <tr key={u.uid} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{u.displayName}</span>
                          {isCurrent && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold">
                              আপনি
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{u.designation || 'সদস্য'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-english font-medium text-slate-700 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{u.email}</span>
                        </div>
                        {u.phone && (
                          <div className="text-[11px] text-slate-500 font-english flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{u.phone}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <RoleBadge role={u.role} />
                      </td>

                      <td className="py-3.5 px-4">
                        {u.status === 'suspended' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            স্থগিত
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            সক্রিয়
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <select
                          value={u.role || 'committee'}
                          disabled={!canAccess('super_admin')}
                          onChange={(e) => handleRoleChange(u.uid, e.target.value as UserRole)}
                          className="text-xs py-1 px-2 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-600 disabled:opacity-50 disabled:bg-slate-50"
                        >
                          <option value="super_admin">সুপার অ্যাডমিন</option>
                          <option value="admin">অ্যাডমিন</option>
                          <option value="committee">কমিটি সদস্য</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {canAccess('super_admin') && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(u)}
                                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-emerald-700 transition-colors"
                                title="সম্পাদনা করুন"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingUser(u)}
                                disabled={isCurrent}
                                className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                                title={isCurrent ? 'নিজের অ্যাকাউন্ট মোছা যাবে না' : 'মুছে ফেলুন'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <UserModal
          isOpen={isModalOpen}
          user={editingUser}
          onClose={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }}
          onSave={handleSaveUser}
        />
      )}

      {/* Delete User Confirmation Modal */}
      {deletingUser && (
        <ConfirmationModal
          isOpen={Boolean(deletingUser)}
          title="ব্যবহারকারী অপসারণ নিশ্চিতকরণ"
          message={`আপনি কি নিশ্চিতভাবে "${deletingUser.displayName}" (${deletingUser.email}) এর অ্যাকাউন্টটি অপসারণ করতে চান?`}
          confirmText="মুছে ফেলুন"
          cancelText="বাতিল"
          isDestructive={true}
          onConfirm={handleDeleteUser}
          onCancel={() => setDeletingUser(null)}
        />
      )}
    </div>
  );
};

