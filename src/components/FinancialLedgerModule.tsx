import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Download, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { 
  LedgerEntry, 
  UserSession, 
  BudgetItem, 
  AngkatanNumber, 
  DAFTAR_ANGKATAN, 
  TipeTransaksi 
} from '../types';

interface FinancialLedgerModuleProps {
  ledgerEntries: LedgerEntry[];
  budgetItems: BudgetItem[];
  currentUser: UserSession;
  onAddLedgerEntry: (entry: Omit<LedgerEntry, 'id' | 'createdAt' | 'saldoBerjalan'>) => void;
}

export const FinancialLedgerModule: React.FC<FinancialLedgerModuleProps> = ({
  ledgerEntries,
  budgetItems,
  currentUser,
  onAddLedgerEntry
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipeFilter, setTipeFilter] = useState<string>('all');
  const [angkatanFilter, setAngkatanFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formTipe, setFormTipe] = useState<TipeTransaksi>('pemasukan');
  const [formNomorBukti, setFormNomorBukti] = useState('');
  const [formTanggal, setFormTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [formKategori, setFormKategori] = useState('');
  const [formUraian, setFormUraian] = useState('');
  const [formNominal, setFormNominal] = useState('');
  const [formPihakTerkait, setFormPihakTerkait] = useState('');
  const [formPosAnggaranId, setFormPosAnggaranId] = useState('');
  const [formAngkatanTerkait, setFormAngkatanTerkait] = useState<string>('');

  const canAdd = currentUser.role === 'super_admin' || currentUser.role === 'bendahara';

  const formatRp = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const filteredEntries = ledgerEntries.filter(entry => {
    if (tipeFilter !== 'all' && entry.tipe !== tipeFilter) return false;
    if (angkatanFilter !== 'all' && entry.angkatanTerkait?.toString() !== angkatanFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchUraian = entry.uraian.toLowerCase().includes(q);
      const matchBukti = entry.nomorBukti.toLowerCase().includes(q);
      const matchPihak = entry.pihakTerkait.toLowerCase().includes(q);
      const matchKategori = entry.kategori.toLowerCase().includes(q);
      if (!matchUraian && !matchBukti && !matchPihak && !matchKategori) return false;
    }
    return true;
  });

  const totalDebit = ledgerEntries.reduce((sum, e) => sum + e.debit, 0);
  const totalKredit = ledgerEntries.reduce((sum, e) => sum + e.kredit, 0);
  const saldoAkhir = totalDebit - totalKredit;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(formNominal.replace(/[^0-9]/g, ''));
    if (!formUraian.trim() || isNaN(num) || num <= 0) return;

    const isDebit = formTipe === 'pemasukan';
    const autoBukti = formNomorBukti.trim() || (isDebit ? `BKM-SUPM-${Date.now().toString().slice(-4)}` : `BKK-SUPM-${Date.now().toString().slice(-4)}`);

    onAddLedgerEntry({
      nomorBukti: autoBukti,
      tanggal: formTanggal,
      tipe: formTipe,
      kategori: formKategori.trim() || (isDebit ? 'Penerimaan Iuran / Dana' : 'Operasional Panitia'),
      posAnggaranId: formPosAnggaranId || undefined,
      angkatanTerkait: formAngkatanTerkait ? Number(formAngkatanTerkait) as AngkatanNumber : undefined,
      uraian: formUraian.trim(),
      debit: isDebit ? num : 0,
      kredit: !isDebit ? num : 0,
      pihakTerkait: formPihakTerkait.trim() || 'Kas Panitia',
      statusRekonsiliasi: 'pending',
      dibuatOleh: currentUser.name
    });

    setFormNomorBukti('');
    setFormUraian('');
    setFormNominal('');
    setFormPihakTerkait('');
    setFormPosAnggaranId('');
    setFormAngkatanTerkait('');
    setShowAddModal(false);
  };

  const handleExportCSV = () => {
    const headers = ['Nomor Bukti', 'Tanggal', 'Tipe', 'Kategori', 'Angkatan Terkait', 'Pihak Terkait', 'Uraian', 'Debit (Masuk)', 'Kredit (Keluar)', 'Saldo Berjalan', 'Status Rekonsiliasi'];
    const rows = filteredEntries.map(e => [
      e.nomorBukti,
      e.tanggal,
      e.tipe,
      `"${e.kategori}"`,
      e.angkatanTerkait ? `Angkatan ${e.angkatanTerkait}` : '-',
      `"${e.pihakTerkait}"`,
      `"${e.uraian}"`,
      e.debit,
      e.kredit,
      e.saldoBerjalan,
      e.statusRekonsiliasi
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `buku_kas_jurnal_supmn_kotaagung_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">
              Buku Kas & Jurnal Keuangan Panitia (Double-Entry)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pencatatan mutasi kas masuk (BKM) dan kas keluar (BKK) dengan saldo berjalan dan tautan RAPB
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 border border-slate-700 flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Jurnal CSV</span>
          </button>
          {canAdd && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white flex items-center gap-1.5 transition shadow"
            >
              <Plus className="w-4 h-4" />
              <span>+ Input Transaksi Kas</span>
            </button>
          )}
        </div>
      </div>

      {/* Ringkasan Saldo Buku Kas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-900/40">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Total Penerimaan (Debit)</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 mt-1">{formatRp(totalDebit)}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Iuran angkatan, donasi & sponsorship
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-rose-900/40">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Total Pengeluaran (Kredit)</span>
            <ArrowDownRight className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-rose-400 mt-1">{formatRp(totalKredit)}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Realisasi operasional seksi panitia
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-900/40">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Saldo Kas Bersih Saat Ini</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-300 mt-1">{formatRp(saldoAkhir)}</div>
          <div className="text-[11px] text-emerald-400 mt-1">
            Kas berjalan posisi seimbang
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari uraian, nomor bukti, pihak..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-800 text-xs text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <select
            value={tipeFilter}
            onChange={(e) => setTipeFilter(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Jenis Mutasi (Masuk & Keluar)</option>
            <option value="pemasukan">Hanya Kas Masuk (Debit)</option>
            <option value="pengeluaran">Hanya Kas Keluar (Kredit)</option>
          </select>
        </div>

        <div>
          <select
            value={angkatanFilter}
            onChange={(e) => setAngkatanFilter(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Tautan Angkatan</option>
            {DAFTAR_ANGKATAN.map((akt) => (
              <option key={akt} value={akt.toString()}>Angkatan {akt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabel Jurnal Buku Kas */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80 shadow">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-850 text-slate-300 border-b border-slate-800 text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Bukti & Tanggal</th>
              <th className="py-3 px-4 font-semibold">Uraian & Pihak Terkait</th>
              <th className="py-3 px-4 font-semibold">Tautan Pos/Angkatan</th>
              <th className="py-3 px-4 font-semibold text-right">Debit (Masuk)</th>
              <th className="py-3 px-4 font-semibold text-right">Kredit (Keluar)</th>
              <th className="py-3 px-4 font-semibold text-right">Saldo Berjalan</th>
              <th className="py-3 px-4 font-semibold text-center">Rekonsiliasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
            {filteredEntries.map((entry) => (
              <tr key={entry.id} className="hover:bg-slate-800/40 transition">
                <td className="py-3 px-4">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    entry.tipe === 'pemasukan' 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {entry.nomorBukti}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1 font-sans">{entry.tanggal}</div>
                </td>
                <td className="py-3 px-4 font-sans text-xs">
                  <div className="font-semibold text-white">{entry.uraian}</div>
                  <div className="text-[11px] text-slate-400">Pihak: {entry.pihakTerkait}</div>
                </td>
                <td className="py-3 px-4 font-sans text-xs">
                  {entry.angkatanTerkait ? (
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px]">
                      Angkatan {entry.angkatanTerkait}
                    </span>
                  ) : entry.posAnggaranId ? (
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px]">
                      Pos RAPB: {entry.posAnggaranId}
                    </span>
                  ) : (
                    <span className="text-slate-500 text-[10px]">Umum</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right font-semibold text-emerald-400">
                  {entry.debit > 0 ? formatRp(entry.debit) : '-'}
                </td>
                <td className="py-3 px-4 text-right font-semibold text-rose-400">
                  {entry.kredit > 0 ? formatRp(entry.kredit) : '-'}
                </td>
                <td className="py-3 px-4 text-right font-bold text-white">
                  {formatRp(entry.saldoBerjalan)}
                </td>
                <td className="py-3 px-4 text-center font-sans">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold inline-flex items-center gap-1 ${
                    entry.statusRekonsiliasi === 'cocok'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : entry.statusRekonsiliasi === 'selisih'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {entry.statusRekonsiliasi === 'cocok' ? 'Cocok' : entry.statusRekonsiliasi === 'selisih' ? 'Selisih' : 'Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Input Kas */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Input Transaksi Kas Buku Jurnal
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Jenis Transaksi Kas *
                  </label>
                  <select
                    value={formTipe}
                    onChange={(e) => setFormTipe(e.target.value as TipeTransaksi)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="pemasukan">Kas Masuk (Debit)</option>
                    <option value="pengeluaran">Kas Keluar (Kredit)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Nomor Bukti (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="BKM-2026-xxx / BKK-2026-xxx"
                    value={formNomorBukti}
                    onChange={(e) => setFormNomorBukti(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Nominal Rupiah (IDR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="1000"
                    placeholder="Contoh: 1000000"
                    value={formNominal}
                    onChange={(e) => setFormNominal(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Tanggal Transaksi
                  </label>
                  <input
                    type="date"
                    value={formTanggal}
                    onChange={(e) => setFormTanggal(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Uraian Lengkap Transaksi *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Keterangan lengkap pembayaran atau penerimaan kas..."
                  value={formUraian}
                  onChange={(e) => setFormUraian(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Pihak Terkait (Vendor / Alumni / Seksi)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: CV Nada Bahari / Alumni Angkatan 5"
                    value={formPihakTerkait}
                    onChange={(e) => setFormPihakTerkait(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {formTipe === 'pengeluaran' ? (
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Tautkan ke Pos RAPB
                    </label>
                    <select
                      value={formPosAnggaranId}
                      onChange={(e) => setFormPosAnggaranId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="">-- Pilih Pos RAPB Disetujui --</option>
                      {budgetItems
                        .filter(b => b.statusApproval === 'disetujui')
                        .map(b => (
                          <option key={b.id} value={b.id}>
                            {b.kodePos} - {b.divisi}
                          </option>
                        ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Tautkan ke Angkatan (1–19)
                    </label>
                    <select
                      value={formAngkatanTerkait}
                      onChange={(e) => setFormAngkatanTerkait(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="">-- Umum / Tanpa Kohort --</option>
                      {DAFTAR_ANGKATAN.map(akt => (
                        <option key={akt} value={akt.toString()}>
                          Angkatan {akt}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
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
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 font-semibold text-white"
                >
                  Simpan Jurnal Kas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
