import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Building, 
  HelpCircle, 
  Search,
  CreditCard,
  FileCheck
} from 'lucide-react';
import { 
  ReconciliationRecord, 
  LedgerEntry, 
  UserSession, 
  EventConfig 
} from '../types';

interface ReconciliationPaymentModuleProps {
  reconciliationRecords: ReconciliationRecord[];
  ledgerEntries: LedgerEntry[];
  currentUser: UserSession;
  eventConfig: EventConfig;
  onAddReconciliation: (record: Omit<ReconciliationRecord, 'id'>) => void;
  onResolveReconciliation: (id: string, notes: string) => void;
}

export const ReconciliationPaymentModule: React.FC<ReconciliationPaymentModuleProps> = ({
  reconciliationRecords,
  ledgerEntries,
  currentUser,
  eventConfig,
  onAddReconciliation,
  onResolveReconciliation
}) => {
  const [selectedLedgerId, setSelectedLedgerId] = useState('');
  const [nominalMutasi, setNominalMutasi] = useState('');
  const [catatanAuditor, setCatatanAuditor] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const canAudit = currentUser.role === 'super_admin' || currentUser.role === 'auditor' || currentUser.role === 'bendahara';

  const formatRp = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry = ledgerEntries.find(l => l.id === selectedLedgerId);
    if (!entry) return;

    const nominalBukuKas = entry.debit > 0 ? entry.debit : entry.kredit;
    const nominalBank = Number(nominalMutasi.replace(/[^0-9]/g, '')) || 0;
    const selisih = nominalBukuKas - nominalBank;

    let status: ReconciliationRecord['status'] = 'cocok';
    if (selisih > 0) status = 'selisih_kurang';
    else if (selisih < 0) status = 'selisih_lebih';

    onAddReconciliation({
      ledgerEntryId: entry.id,
      tanggalRekonsiliasi: new Date().toISOString().split('T')[0],
      nominalBukuKas,
      nominalRekeningKoran: nominalBank,
      selisih,
      status,
      catatanAuditor: catatanAuditor.trim() || 'Verifikasi mutasi rekening koran',
      auditorName: currentUser.name,
      diselesaikan: selisih === 0
    });

    setSelectedLedgerId('');
    setNominalMutasi('');
    setCatatanAuditor('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              Rekonsiliasi Bank & Integrasi Pembayaran
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pencocokan mutasi rekening resmi panitia terhadap Buku Kas Umum untuk menjamin nol selisih
          </p>
        </div>
        {canAudit && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5 transition shadow"
          >
            <FileCheck className="w-4 h-4" />
            <span>+ Lakukan Rekonsiliasi Baru</span>
          </button>
        )}
      </div>

      {/* Official Status Rekening Panitia - Anti Fakta Fiktif */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-slate-800 text-cyan-400">
            <Building className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Status Rekening Resmi Panitia</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Pemberitahuan Resmi
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Rekening Kas Operasional: <span className="text-amber-300 font-medium">[{eventConfig.statusRekeningResmi}]</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              * Sesuai ketentuan akuntabilitas Reuni Akbar SUPM N Kotaagung Angkatan 1–19, nomor rekening hanya diterbitkan melalui Surat Keputusan (SK) resmi Panitia dan disosialisasikan langsung oleh Ketua Divisi Keuangan (Anas Rosyid).
            </p>
          </div>
        </div>
      </div>

      {/* Daftar Riwayat Rekonsiliasi */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80 shadow">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-850 text-slate-300 border-b border-slate-800 text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">ID & Tanggal Audit</th>
              <th className="py-3 px-4 font-semibold">Tautan Buku Kas</th>
              <th className="py-3 px-4 font-semibold text-right">Nominal Buku Kas</th>
              <th className="py-3 px-4 font-semibold text-right">Nominal Rekening Koran</th>
              <th className="py-3 px-4 font-semibold text-right">Selisih</th>
              <th className="py-3 px-4 font-semibold">Status Audit</th>
              <th className="py-3 px-4 font-semibold">Auditor & Catatan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {reconciliationRecords.map((rec) => {
              const matchedEntry = ledgerEntries.find(l => l.id === rec.ledgerEntryId);

              return (
                <tr key={rec.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-slate-200">{rec.id}</span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{rec.tanggalRekonsiliasi}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-cyan-300">
                      {matchedEntry?.nomorBukti || rec.ledgerEntryId}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">
                      {matchedEntry?.uraian || '-'}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-200">
                    {formatRp(rec.nominalBukuKas)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-200">
                    {formatRp(rec.nominalRekeningKoran)}
                  </td>
                  <td className={`py-3 px-4 text-right font-mono font-bold ${
                    rec.selisih === 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {formatRp(rec.selisih)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 w-fit ${
                      rec.status === 'cocok'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {rec.status === 'cocok' ? <CheckCircle className="w-2.5 h-2.5" /> : <AlertTriangle className="w-2.5 h-2.5" />}
                      {rec.status === 'cocok' ? 'Cocok (Nol Selisih)' : 'Ada Selisih'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[11px] text-slate-400">
                    <div className="text-slate-300 font-medium">Auditor: {rec.auditorName}</div>
                    <div className="text-[10px] italic text-slate-400">{rec.catatanAuditor}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah Rekonsiliasi */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Pencocokan Rekonsiliasi Bank
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Pilih Transaksi Buku Kas *
                </label>
                <select
                  required
                  value={selectedLedgerId}
                  onChange={(e) => {
                    setSelectedLedgerId(e.target.value);
                    const selected = ledgerEntries.find(l => l.id === e.target.value);
                    if (selected) {
                      setNominalMutasi((selected.debit || selected.kredit).toString());
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">-- Pilih Nomor Bukti Kas --</option>
                  {ledgerEntries.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.nomorBukti} - {l.uraian} ({formatRp(l.debit || l.kredit)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Nominal Mutasi Rekening Koran (IDR) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={nominalMutasi}
                  onChange={(e) => setNominalMutasi(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Catatan Auditor / Bukti Verifikasi
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan pencocokan mutasi slip bank atau rekening koran..."
                  value={catatanAuditor}
                  onChange={(e) => setCatatanAuditor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-750"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-semibold text-white"
                >
                  Simpan Hasil Rekonsiliasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
