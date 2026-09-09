'use client';

import React from 'react';
import { X, Printer, Download, FileText } from 'lucide-react';
import { Screening, ConfidenceDetail } from '@/types/screening';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  screening: Screening;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, screening }) => {
  if (!isOpen) return null;

  const rawConf = typeof screening.confidence === 'number' ? screening.confidence : (screening.confidence?.calibratedConfidence ?? 0.85);
  const qStatus = screening.imageQuality?.qualityStatus || screening.qualityStatus || 'GRADABLE';
  const isReferable = typeof screening.drGrade === 'object' ? screening.drGrade.referable : (screening.referable ?? (typeof screening.drGrade === 'number' && screening.drGrade >= 2));

  const confDetail: ConfidenceDetail = typeof screening.confidence === 'object' ? screening.confidence : {
    rawConfidence: rawConf,
    calibratedConfidence: rawConf * 0.96,
    uncertaintyStatus: (screening.uncertainty ?? 0.15) < 0.15 ? "HIGHER CONFIDENCE" : "UNCERTAIN",
    uncertaintyEntropy: screening.uncertainty ?? 0.15,
    requiresHumanReview: screening.requiresHumanReview ?? true,
    decisionBannerState: qStatus === 'UNGRADABLE' ? "IMAGE_UNGRADABLE" : (isReferable ? "HUMAN_REVIEW_RECOMMENDED" : "AUTO_SCREENED"),
    humanReviewReason: isReferable ? "Referable findings identified. Specialist evaluation recommended." : "No DR signs detected.",
    disclaimer: "System confidence and uncertainty labels are algorithmic decision support estimates, not clinical guarantees."
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const gradeTitle = typeof screening.drGrade === 'object' ? screening.drGrade.drGradeLabel : (screening.drGradeLabel || `Grade ${screening.drGrade}`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1728]/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#10213E] border border-[#3C5880]/60 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl my-8">
        
        {/* Printable Top Header Bar */}
        <div className="bg-[#0B1728] px-6 py-4 border-b border-[#3C5880]/40 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#384994]/15 rounded-xl border border-[#384994]/30 text-[#384994]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#F4F7FB]">Clinical Decision Support Slip</h3>
              <p className="text-[11px] text-[#F4F7FB]/60">RETINA-MITRA Tele-Ophthalmology Network • {screening.screeningId}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#384994] hover:bg-[#E3D7C1] text-[#0B1728] text-xs font-extrabold shadow transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#10213E] hover:bg-[#22304A] text-[#F4F7FB] text-xs font-bold border border-[#3C5880] transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#F4F7FB]/60 hover:text-[#F4F7FB] hover:bg-[#3C5880]/30 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Report Content Body */}
        <div className="p-8 bg-[#10213E] text-[#F4F7FB] space-y-6 text-xs print:text-slate-900 print:bg-white print:p-4">
          
          {/* RETINA-MITRA Clinical Header */}
          <div className="flex justify-between items-start border-b border-[#3C5880]/40 print:border-slate-300 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-[#384994] print:bg-amber-600" />
                <h2 className="text-xl font-black tracking-tight text-[#F4F7FB] print:text-slate-900 uppercase">RETINA-MITRA</h2>
              </div>
              <p className="text-[11px] text-[#384994] print:text-amber-700 font-bold mt-0.5">
                AI-Assisted Diabetic Retinopathy Screening Platform
              </p>
              <p className="text-[#F4F7FB]/60 print:text-slate-600 text-[11px] mt-1">
                {screening.phcCenter} • {screening.district} District
              </p>
            </div>
            <div className="text-right font-mono text-[11px] space-y-0.5">
              <span className="px-2.5 py-1 bg-[#0B1728] print:bg-slate-100 rounded-xl text-[#384994] print:text-slate-800 border border-[#3C5880]/60 print:border-slate-300 font-bold block">
                {screening.screeningId}
              </span>
              <p className="text-[#F4F7FB]/60 print:text-slate-600">Patient ID: {screening.patientAlias}</p>
              <p className="text-[#F4F7FB]/40 print:text-slate-500">Timestamp: {new Date(screening.createdAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Patient Details & Findings Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0B1728] print:bg-slate-50 p-4 rounded-2xl border border-[#3C5880]/40 print:border-slate-200">
            <div>
              <span className="text-[10px] text-[#F4F7FB]/50 font-bold uppercase">Patient Alias</span>
              <p className="font-extrabold text-[#F4F7FB] print:text-slate-800 mt-0.5">{screening.patientAlias}</p>
            </div>
            <div>
              <span className="text-[10px] text-[#F4F7FB]/50 font-bold uppercase">Operator / PHC</span>
              <p className="font-extrabold text-[#F4F7FB] print:text-slate-800 mt-0.5">{screening.operatorId}</p>
            </div>
            <div>
              <span className="text-[10px] text-[#F4F7FB]/50 font-bold uppercase">Quality Status</span>
              <p className="font-extrabold text-[#059669] print:text-emerald-700 mt-0.5">{qStatus}</p>
            </div>
            <div>
              <span className="text-[10px] text-[#F4F7FB]/50 font-bold uppercase">Confidence Level</span>
              <p className="font-extrabold text-[#384994] print:text-amber-700 mt-0.5">{confDetail.uncertaintyStatus === 'HIGHER CONFIDENCE' ? 'High' : 'Moderate'}</p>
            </div>
          </div>

          {/* Result Block */}
          <div className="p-5 rounded-2xl bg-[#0B1728] border border-[#3C5880]/60">
            <span className="text-[11px] font-bold text-[#384994] uppercase tracking-wider">Screening Result</span>
            <h4 className="text-xl font-black text-[#F4F7FB] mt-1">
              {gradeTitle}
            </h4>
            <p className="text-xs text-[#F4F7FB]/70 mt-1.5">
              {confDetail.humanReviewReason}
            </p>
          </div>

          {/* Regulatory Disclaimer */}
          <div className="p-3 bg-[#0B1728]/50 border border-[#3C5880]/30 rounded-xl text-[10px] text-[#F4F7FB]/50">
            <span className="font-bold">Medical Disclaimer: </span>
            {confDetail.disclaimer} This slip is for tele-screening decision support and does not replace a clinical examination by an ophthalmologist.
          </div>

        </div>
      </div>
    </div>
  );
};
