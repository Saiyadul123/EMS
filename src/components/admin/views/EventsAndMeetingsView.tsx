import React, { useState } from 'react';
import { CommunityEvent, CommitteeMeeting } from '../../../types';
import {
  saveEvent,
  deleteEvent,
  saveMeeting,
  deleteMeeting,
  logActivity
} from '../../../services/db';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { ConfirmationModal } from '../../common/ConfirmationModal';
import {
  Calendar,
  Briefcase,
  Plus,
  Clock,
  MapPin,
  FileText,
  Trash2,
  Edit2,
  Users
} from 'lucide-react';

interface EventsAndMeetingsViewProps {
  initialTab?: 'events' | 'meetings';
  events: CommunityEvent[];
  meetings: CommitteeMeeting[];
  onRefresh: () => void;
}

export const EventsAndMeetingsView: React.FC<EventsAndMeetingsViewProps> = ({
  initialTab = 'events',
  events,
  meetings,
  onRefresh
}) => {
  const { canAccess, userProfile, userRole } = useAuth();
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<'events' | 'meetings'>(initialTab);

  // Event modal state
  const [editingEvent, setEditingEvent] = useState<Partial<CommunityEvent> | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  // Meeting modal state
  const [editingMeeting, setEditingMeeting] = useState<Partial<CommitteeMeeting> | null>(null);
  const [deletingMeetingId, setDeletingMeetingId] = useState<string | null>(null);

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent?.title || !editingEvent?.date) {
      error('কর্মসূচির নাম ও তারিখ পূরণ করুন');
      return;
    }

    try {
      await saveEvent({
        title: editingEvent.title,
        description: editingEvent.description || '',
        date: editingEvent.date,
        time: editingEvent.time || 'সকাল ১০:০০',
        venue: editingEvent.venue || 'ঈদগাহ কমপ্লেক্স',
        chiefGuest: editingEvent.chiefGuest || '',
        status: editingEvent.status || 'upcoming',
        id: editingEvent.id
      });
      await logActivity(
        editingEvent.id ? 'কর্মসূচি সম্পাদিত' : 'নতুন কর্মসূচি নির্ধারিত',
        editingEvent.title,
        userProfile?.displayName || 'অ্যাডমিন',
        userRole || 'admin'
      );
      success('কর্মসূচি সংরক্ষিত হয়েছে।');
      setEditingEvent(null);
      onRefresh();
    } catch (err) {
      error('সংরক্ষণ ব্যর্থ হয়েছে।');
    }
  };

  const handleSaveMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMeeting?.meetingTitle || !editingMeeting?.date) {
      error('মিটিংয়ের নাম ও তারিখ পূরণ করুন');
      return;
    }

    try {
      await saveMeeting({
        meetingTitle: editingMeeting.meetingTitle,
        meetingNo: editingMeeting.meetingNo || `সভাসংখ্যা-${meetings.length + 1}`,
        date: editingMeeting.date,
        time: editingMeeting.time || 'বিকাল ৫:০০',
        location: editingMeeting.location || 'ঈদগাহ প্রশাসনিক কক্ষ',
        agenda: editingMeeting.agenda || '',
        decisions: editingMeeting.decisions || '',
        presidedBy: editingMeeting.presidedBy || 'সভাপতি মহোদয়',
        attendeesCount: editingMeeting.attendeesCount || 15,
        status: editingMeeting.status || 'upcoming',
        id: editingMeeting.id
      });
      await logActivity(
        editingMeeting.id ? 'সভা বিবরণী সম্পাদিত' : 'নতুন মিটিং রেকর্ড যুক্ত',
        editingMeeting.meetingTitle,
        userProfile?.displayName || 'অ্যাডমিন',
        userRole || 'admin'
      );
      success('মিটিং তথ্য সংরক্ষিত হয়েছে।');
      setEditingMeeting(null);
      onRefresh();
    } catch (err) {
      error('সংরক্ষণ ব্যর্থ হয়েছে।');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">কর্মসূচি ও কমিটির সভা ব্যবস্থাপনা</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ঈদগাহের দোয়া মাহফিল, গণ-ইফতার ও কার্যনির্বাহী পরিষদের মিটিং রেজোলিউশন
          </p>
        </div>

        {canAccess('admin') && (
          <button
            onClick={() => {
              if (activeTab === 'events') {
                setEditingEvent({
                  title: '',
                  description: '',
                  date: new Date().toISOString().split('T')[0],
                  time: 'সকাল ১০:০০',
                  venue: 'ঈদগাহ মাঠ',
                  status: 'upcoming'
                });
              } else {
                setEditingMeeting({
                  meetingTitle: '',
                  date: new Date().toISOString().split('T')[0],
                  time: 'বিকাল ৫:০০',
                  location: 'ঈদগাহ কার্যালয়',
                  status: 'upcoming',
                  attendeesCount: 15
                });
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{activeTab === 'events' ? 'নতুন কর্মসূচি যোগ করুন' : 'নতুন মিটিং সিডিউল করুন'}</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-200/70 rounded-2xl w-fit text-xs font-bold">
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'events' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span>কর্মসূচি ও মাহফিল (Events)</span>
        </button>
        <button
          onClick={() => setActiveTab('meetings')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'meetings' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
          <span>কমিটি মিটিং ও রেজোলিউশন (Meetings)</span>
        </button>
      </div>

      {/* Events List */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    evt.status === 'upcoming' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {evt.status === 'upcoming' ? 'আসন্ন' : 'সম্পন্ন'}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{evt.date}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{evt.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{evt.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{evt.time}</span>
                  <span className="text-slate-300">•</span>
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{evt.venue}</span>
                </div>

                {canAccess('admin') && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingEvent(evt)}
                      className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingEventId(evt.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Meetings List */}
      {activeTab === 'meetings' && (
        <div className="space-y-4">
          {meetings.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full mr-2">
                    {m.meetingNo}
                  </span>
                  <span className="text-base font-bold text-slate-900">{m.meetingTitle}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-english">
                  <span>{m.date}</span>
                  <span>({m.time})</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-slate-700">আলোচ্যসূচি (Agenda):</span>
                  <p className="text-slate-600 bg-slate-50 p-3 rounded-xl leading-relaxed">{m.agenda}</p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-700">গৃহীত সিদ্ধান্ত / রেজোলিউশন (Decisions):</span>
                  <p className="text-slate-600 bg-emerald-50/40 border border-emerald-100 p-3 rounded-xl leading-relaxed">
                    {m.decisions || 'সিদ্ধান্ত প্রক্রিয়াধীন'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <span>সভাপতি: <strong>{m.presidedBy}</strong></span>
                  <span>উপস্থিতি: <strong>{m.attendeesCount} জন</strong></span>
                </div>

                {canAccess('admin') && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingMeeting(m)}
                      className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingMeetingId(m.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              {editingEvent.id ? 'কর্মসূচি সম্পাদনা' : 'নতুন কর্মসূচি'}
            </h3>
            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">কর্মসূচির নাম *</label>
                <input
                  type="text"
                  required
                  value={editingEvent.title || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">তারিখ *</label>
                  <input
                    type="date"
                    required
                    value={editingEvent.date || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-english"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">সময়</label>
                  <input
                    type="text"
                    value={editingEvent.time || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">স্থান / ভেন্যু</label>
                <input
                  type="text"
                  value={editingEvent.venue || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">বিবরণ</label>
                <textarea
                  rows={3}
                  value={editingEvent.description || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
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

      {/* Edit Meeting Modal */}
      {editingMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              {editingMeeting.id ? 'মিটিং বিবরণী সম্পাদনা' : 'নতুন মিটিং রেকর্ড'}
            </h3>
            <form onSubmit={handleSaveMeeting} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">মিটিংয়ের শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={editingMeeting.meetingTitle || ''}
                  onChange={(e) => setEditingMeeting({ ...editingMeeting, meetingTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">তারিখ</label>
                  <input
                    type="date"
                    required
                    value={editingMeeting.date || ''}
                    onChange={(e) => setEditingMeeting({ ...editingMeeting, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-english"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">মিটিং নম্বর</label>
                  <input
                    type="text"
                    value={editingMeeting.meetingNo || ''}
                    onChange={(e) => setEditingMeeting({ ...editingMeeting, meetingNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">আলোচ্য বিষয় (Agenda)</label>
                <textarea
                  rows={2}
                  value={editingMeeting.agenda || ''}
                  onChange={(e) => setEditingMeeting({ ...editingMeeting, agenda: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">গৃহীত সিদ্ধান্ত ও রেজোলিউশন (Decisions)</label>
                <textarea
                  rows={3}
                  value={editingMeeting.decisions || ''}
                  onChange={(e) => setEditingMeeting({ ...editingMeeting, decisions: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingMeeting(null)}
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

      {/* Delete Modals */}
      <ConfirmationModal
        isOpen={!!deletingEventId}
        title="কর্মসূচি মুছে ফেলা"
        message="আপনি কি নিশ্চিতভাবে এই কর্মসূচিটি মুছে ফেলতে চান?"
        onConfirm={async () => {
          if (deletingEventId) {
            await deleteEvent(deletingEventId);
            setDeletingEventId(null);
            onRefresh();
          }
        }}
        onCancel={() => setDeletingEventId(null)}
      />

      <ConfirmationModal
        isOpen={!!deletingMeetingId}
        title="মিটিং মুছে ফেলা"
        message="আপনি কি নিশ্চিতভাবে এই মিটিং রেকর্ড মুছে ফেলতে চান?"
        onConfirm={async () => {
          if (deletingMeetingId) {
            await deleteMeeting(deletingMeetingId);
            setDeletingMeetingId(null);
            onRefresh();
          }
        }}
        onCancel={() => setDeletingMeetingId(null)}
      />
    </div>
  );
};
