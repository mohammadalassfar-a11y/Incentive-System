import React, { useState } from 'react';
import { Users, X, Plus, AlertCircle, FileText } from 'lucide-react';
import { Grade, Student } from '../types';

interface BulkStudentModalProps {
  grades: Grade[];
  existingStudents: Student[];
  onSaveBulk: (newStudents: Omit<Student, 'id' | 'points'>[]) => void;
  onClose: () => void;
}

export const BulkStudentModal: React.FC<BulkStudentModalProps> = ({
  grades,
  existingStudents,
  onSaveBulk,
  onClose,
}) => {
  const [selectedGradeId, setSelectedGradeId] = useState<string>(
    grades[0]?.id || ''
  );
  const [rawText, setRawText] = useState('');
  const [error, setError] = useState('');

  // Determine starting code
  const maxCodeNum = existingStudents.reduce((max, s) => {
    const num = parseInt(s.code, 10);
    return !isNaN(num) && num > max ? num : max;
  }, 5000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!rawText.trim()) {
      setError('يرجى إدخال أسماء الطلاب');
      return;
    }

    const lines = rawText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      setError('لا توجد أسماء صالحة في النص المكتوب');
      return;
    }

    // Generate random non-sequential unique 4-digit code
    const usedCodes = new Set(existingStudents.map((s) => s.code));

    const getRandomUniqueCode = (): string => {
      let code = '';
      let attempts = 0;
      do {
        code = Math.floor(1000 + Math.random() * 9000).toString();
        attempts++;
      } while (usedCodes.has(code) && attempts < 500);
      usedCodes.add(code);
      return code;
    };

    const newStudents: Omit<Student, 'id' | 'points'>[] = [];

    for (const line of lines) {
      // Check if line contains comma: "code, name" or just "name"
      const parts = line.split(',').map((p) => p.trim());
      if (parts.length >= 2 && !isNaN(parseInt(parts[0], 10))) {
        const customCode = parts[0];
        usedCodes.add(customCode);
        newStudents.push({
          code: customCode,
          name: parts[1],
          gradeId: selectedGradeId,
          notes: 'مضاف عبر الإدراج الجماعي',
        });
      } else {
        newStudents.push({
          code: getRandomUniqueCode(),
          name: line,
          gradeId: selectedGradeId,
          notes: 'مضاف عبر الإدراج الجماعي',
        });
      }
    }

    onSaveBulk(newStudents);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-850 bg-slate-800 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">إضافة مجموعة طلاب جملاً (Bulk Insert)</h3>
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
              تحديد الصف الدراسي الموحد لهذه المجموعة:
            </label>
            <select
              value={selectedGradeId}
              onChange={(e) => setSelectedGradeId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-650 border-slate-600 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-indigo-400"
            >
              {grades.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-2">
              قائمة أسماء الطلاب (اسم طالب بكل سطر):
            </label>
            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder={`أدخل الأسماء بسطور متتالية، مثال:\nمحمد أحمد السالم\nفهد بن عبدالمجيد\nعبدالعزيز الدوسري\n\nأو صيغة (الكود, الاسم):\n5010, خالد عبدالله`}
              className="w-full bg-slate-900 border border-slate-650 border-slate-600 text-white text-xs rounded-2xl p-4 focus:outline-none focus:border-indigo-400 font-mono"
            />
            <p className="text-[11px] text-slate-300 mt-1">
              سيتم إنشاء كود عشوائي فريد مكون من 4 أرقام لكل طالب تلقائياً (أو يمكنك كتابة الكود بنفسك).
            </p>
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
              className="px-6 py-2.5 rounded-xl bg-indigo-500 text-white text-xs font-bold hover:bg-indigo-400 transition shadow-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة المجموعة الآن</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
