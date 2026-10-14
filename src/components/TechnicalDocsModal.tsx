import React, { useState } from 'react';
import { 
  FileText, 
  HelpCircle, 
  ShieldCheck, 
  Database, 
  Layers, 
  BookOpen, 
  Copy, 
  Check 
} from 'lucide-react';
import { DOKUMENTASI_TEKNIS_LENGKAP, PANDUAN_PENGGUNAAN_RESMI } from '../services/schemaDocumentation';

interface TechnicalDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalDocsModal: React.FC<TechnicalDocsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'panduan' | 'arsitektur' | 'rules'>('panduan');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-white">
                Pusat Dokumentasi Teknis & Panduan Penggunaan Resmi
              </h2>
              <p className="text-xs text-slate-400">
                SUPMN Kotaagung Reunion Command Center (Bahasa Indonesia)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800 bg-slate-900/60 text-xs">
          <button
            onClick={() => setActiveTab('panduan')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              activeTab === 'panduan'
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Panduan Penggunaan Panitia (User Manual)</span>
          </button>
          <button
            onClick={() => setActiveTab('arsitektur')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              activeTab === 'arsitektur'
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Arsitektur & Skema Firestore</span>
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              activeTab === 'rules'
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Aturan Keamanan (firestore.rules)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs text-slate-300 space-y-4">
          {activeTab === 'panduan' && (
            <div className="prose prose-invert max-w-none space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={() => handleCopy(PANDUAN_PENGGUNAAN_RESMI)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center gap-1 text-[11px]"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Tersalin' : 'Salin Panduan'}</span>
                </button>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-xs bg-slate-950 p-4 rounded-xl border border-slate-800 leading-relaxed text-slate-200">
                {PANDUAN_PENGGUNAAN_RESMI}
              </pre>
            </div>
          )}

          {activeTab === 'arsitektur' && (
            <div className="prose prose-invert max-w-none space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={() => handleCopy(DOKUMENTASI_TEKNIS_LENGKAP)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center gap-1 text-[11px]"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Tersalin' : 'Salin Dok. Arsitektur'}</span>
                </button>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-xs bg-slate-950 p-4 rounded-xl border border-slate-800 leading-relaxed text-slate-200">
                {DOKUMENTASI_TEKNIS_LENGKAP}
              </pre>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-cyan-300">
                Berikut adalah aturan Firebase Firestore Rules resmi untuk menjamin integritas data multi-role RBAC:
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] border border-slate-800 overflow-x-auto leading-relaxed">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserRole() {
      return request.auth.token.role;
    }
    
    function isSuperAdmin() {
      return isAuthenticated() && getUserRole() == 'super_admin';
    }
    
    function isKetuaKeuangan() {
      return isAuthenticated() && (getUserRole() in ['ketua_keuangan', 'bendahara'] || isSuperAdmin());
    }
    
    function isAuditor() {
      return isAuthenticated() && (getUserRole() == 'auditor' || isSuperAdmin());
    }
    
    // Koleksi Peserta (Angkatan 1–19)
    match /participants/{id} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if isAuthenticated() && (getUserRole() in ['sekretaris', 'seksi_acara', 'super_admin']);
    }
    
    // Koleksi Iuran & Kontribusi
    match /contributions/{id} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isKetuaKeuangan();
    }
    
    // Koleksi RAPB Anggaran
    match /budget_items/{id} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isSuperAdmin() || isKetuaKeuangan();
      allow delete: if isSuperAdmin();
    }
    
    // Koleksi Buku Kas (Ledger) - Tanggung Jawab Langsung Ketua Divisi Keuangan
    match /ledger_entries/{id} {
      allow read: if isAuthenticated();
      allow create, update: if isKetuaKeuangan();
      allow delete: if isSuperAdmin();
    }
    
    // Koleksi Rekonsiliasi Bank
    match /reconciliation_records/{id} {
      allow read: if isAuthenticated();
      allow create, update: if isAuditor() || isKetuaKeuangan();
      allow delete: if isSuperAdmin();
    }
    
    // Koleksi Audit Log (Immutability guarantee)
    match /audit_logs/{id} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if false; // Jejak audit tidak boleh dihapus atau direvisi
    }
  }
}`}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>SUPMN Kotaagung Reunion Command Center &bull; Angkatan 1–19</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
