import React, { useState } from 'react';
import { Calendar, X, Save, AlertCircle } from 'lucide-react';
import { Period } from '../types';

interface PeriodEditModalProps {
  period?: Period | null;
  onSave: (periodData: Partial<Period>) => void;
  onClose: () => void;
}

export const PeriodEditModal: React.FC<PeriodEditModalProps> = ({
  period,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(period?.title || '');
  const [startDate, setStartDate] = useState(period?.startDate || '2026-08-01');
  const [endDate, setEndDate] = useState(period?.endDate || '2026-10-31');
  const [targetPoints, setTargetPoints] = useState<number>(period?.targetPoints || 500);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('يرجى إدخال عنوان الفترة التنافسية');
      return;
    }

    if (!startDate || !endDate) {
      setError('يرجى تحديد تواريخ البدء والانتهاء بشكل صحيح');
      return;
    }

    if (!targetPoints || targetPoints <= 0) {
      setError('يرجى تحديد عدد النقاط الهدف للفترة بشكل صحيح (أكبر من 0)');
      return;
    }

    onSave({
      id: period?.id,
      title: title.trim(),
      startDate,
      endDate,
      targetPoints: Number(targetPoints),
      isActive: period ? period.isActive : false,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-850 bg-slate-800 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
        
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-400" />
            <h3 className="text-lg font-bold text-white">
              {period ? 'تعديل الفترة التنافسية' : 'إنشاء فترة تنافسية جديدة'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-700 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-2">
              عنوان الفترة التنافسية:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: فترة منافسة الفصل الدراسي الأول 2026"
              className="w-full bg-slate-900 border border-slate-650 border-slate-600 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-2">
              عدد النقاط الهدف للوسام التنافسي:
            </label>
            <input
              type="number"
              value={targetPoints}
              onChange={(e) => setTargetPoints(Number(e.target.value))}
              placeholder="مثال: 500"
              className="w-full bg-slate-900 border border-slate-650 border-slate-600 text-amber-300 font-mono text-sm font-bold rounded-xl p-3 focus:outline-none focus:border-amber-400"
            />
            <p className="text-[11px] text-slate-300 mt-1">
              الهدف المطلوب تحقيقه من الطلاب خلال هذه الفترة التنافسية لتقييم نسبة التقدم والتتويج.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-2">
                تاريخ البدء:
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-650 border-slate-600 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-2">
                تاريخ الانتهاء:
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-650 border-slate-600 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-700 text-slate-200 text-xs font-bold hover:bg-slate-600 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition shadow-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>حفظ البيانات</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
