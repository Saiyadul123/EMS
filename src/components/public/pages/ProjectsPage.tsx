import React from 'react';
import { DevelopmentProject } from '../../../types';
import { Building, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

interface ProjectsPageProps {
  projects: DevelopmentProject[];
  onDonateToProject: () => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects, onDonateToProject }) => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
          <Building className="w-3.5 h-3.5 text-emerald-700" />
          <span>পরিকল্পনা ও উন্নয়ন</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          ঈদগাহ উন্নয়ন ও সম্প্রসারণ প্রকল্পসমূহ
        </h1>
        <p className="mt-3 text-base text-slate-600 font-medium">
          ঐতিহাসিক শাহী ঈদগাহকে আধুনিক ও নান্দনিক রূপদানে গৃহীত বিভিন্ন মেগা ও মাঝারি প্রকল্পসমূহ
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((proj) => {
          const percent = Math.min(100, Math.round((proj.raisedBudget / proj.targetBudget) * 100));
          return (
            <div
              key={proj.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-48 bg-slate-100 relative overflow-hidden">
                  <img
                    src={proj.coverImage || 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80'}
                    alt={proj.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
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
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      {proj.title}
                    </h3>
                    {proj.titleEn && (
                      <p className="text-xs text-slate-400 font-english mt-0.5">{proj.titleEn}</p>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-4">
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">সংগৃহীত তহবিল:</span>
                    <span className="text-emerald-800 font-bold">
                      ৳{proj.raisedBudget.toLocaleString('bn-BD')} / ৳{proj.targetBudget.toLocaleString('bn-BD')}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span>{percent}% সংগৃহীত</span>
                    <span>শুরুর তারিখ: {proj.startDate}</span>
                  </div>
                </div>

                {proj.status !== 'completed' && (
                  <button
                    onClick={onDonateToProject}
                    className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-800 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>এই প্রকল্পে আর্থিক অনুদান দিন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
