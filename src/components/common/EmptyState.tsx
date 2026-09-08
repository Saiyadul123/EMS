import React from 'react';
import { LucideIcon, FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'কোনো তথ্য পাওয়া যায়নি',
  description = 'বর্তমানে এই বিভাগে কোনো তথ্য প্রদর্শনের জন্য নেই।',
  icon: Icon = FolderOpen,
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-2xl border border-slate-200/80 my-4 shadow-sm">
      <div className="p-4 rounded-2xl bg-emerald-50/80 text-emerald-700 mb-4 ring-8 ring-emerald-50/30">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-base font-bold text-slate-800 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
