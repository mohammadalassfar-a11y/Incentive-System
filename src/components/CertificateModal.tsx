import React from 'react';
import { Crown, Sparkles, Award, Printer, X, ShieldCheck } from 'lucide-react';
import { Hero } from '../types';

interface CertificateModalProps {
  hero: Hero;
  schoolName: string;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  hero,
  schoolName,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative max-w-3xl w-full bg-slate-950 rounded-3xl border-2 border-amber-500/40 p-2 shadow-2xl my-8">
        
        {/* Controls header (hidden during printing) */}
        <div className="no-print flex items-center justify-between p-4 bg-slate-900 rounded-t-2xl border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-sm">شهادة التتويج الملكية</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black hover:bg-amber-400 transition flex items-center gap-1.5 shadow-lg"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الشهادة</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Royal Certificate Frame */}
        <div className="certificate-print bg-gradient-to-br from-amber-950/30 via-slate-950 to-amber-950/20 p-8 sm:p-12 rounded-2xl border-4 border-double border-amber-500/60 relative overflow-hidden text-center text-slate-100">
          
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-3 right-3 text-amber-400 opacity-60 text-xl font-bold">⚜️</div>
          <div className="absolute top-3 left-3 text-amber-400 opacity-60 text-xl font-bold">⚜️</div>
          <div className="absolute bottom-3 right-3 text-amber-400 opacity-60 text-xl font-bold">⚜️</div>
          <div className="absolute bottom-3 left-3 text-amber-400 opacity-60 text-xl font-bold">⚜️</div>

          {/* School Name & Royal Insignia */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-xl mb-3">
              <Crown className="w-10 h-10 drop-shadow-md" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-amber-400 tracking-wide">
              {schoolName}
            </h2>
            <span className="text-xs font-semibold text-slate-400 mt-0.5">
              منظومة تحفيز الطلاب السلوكية والتربوية
            </span>
          </div>

          <div className="my-6">
            <span className="inline-block px-6 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-extrabold text-sm sm:text-base mb-4">
              📜 شهادة تتويج بطل التميز السلوكي والأكاديمي
            </span>

            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-xl mx-auto">
              تُهدى هذه الشهادة الملكية ببالغ الفخر والاعتزاز للـطالب الـمـبـدع:
            </p>

            {/* Student Name Display */}
            <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 my-4 py-1 tracking-tight glow-text-gold">
              {hero.studentName}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl mx-auto leading-relaxed">
              من <span className="text-amber-300 font-bold">{hero.gradeName}</span> (كود: <span className="font-mono text-amber-300 font-bold">{hero.studentCode}</span>)، وذلك لتصده المركز الأول وتتويجه بطلاً في <span className="text-amber-300 font-bold">{hero.periodTitle}</span> برصيد إجمالي بلغ <span className="text-amber-400 font-black font-mono text-base">{hero.points}</span> نقطة.
            </p>
          </div>

          {/* Certificate Footer / Signatures */}
          <div className="mt-10 pt-6 border-t border-amber-500/30 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-300">
            <div className="text-right">
              <span className="block text-slate-500 text-[11px]">تاريخ التتويج:</span>
              <span className="font-mono text-amber-300">{hero.crownedDate}</span>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full border border-amber-500/40 bg-amber-500/10 flex items-center justify-center mx-auto mb-1 text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] text-amber-400 font-mono block">
                كود الاعتماد: {hero.certificateId}
              </span>
            </div>

            <div className="text-left">
              <span className="block text-slate-500 text-[11px]">اعتماد إدارة المدرسة:</span>
              <span className="text-amber-300 font-bold">المدير المنسق العام</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
