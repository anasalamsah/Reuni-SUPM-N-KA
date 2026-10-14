import React, { useState } from 'react';
import { 
  Wallet, 
  Search, 
  Plus, 
  CheckCircle, 
  Clock, 
  Download, 
  ArrowUpRight, 
  DollarSign, 
  Filter,
  CreditCard,
  Building
} from 'lucide-react';
import { 
  Contribution, 
  UserSession, 
  AngkatanNumber, 
  DAFTAR_ANGKATAN, 
  JenisKontribusi, 
  MetodePembayaran, 
  VerifikasiStatus 
} from '../types';

interface ContributionTrackerProps {
  contributions: Contribution[];
  currentUser: UserSession;
  selectedCohortFilter: AngkatanNumber | 'all';
  setSelectedCohortFilter: (akt: AngkatanNumber | 'all') => void;
  onAddContribution: (contribution: Omit<Contribution, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateStatus: (id: string, status: VerifikasiStatus) => void;
}

export const ContributionTracker: React.FC<ContributionTrackerProps> = ({
  contributions,
  currentUser,
  selectedCohortFilter,
  setSelectedCohortFilter,
  onAddContribution,
  onUpdateStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jenisFilter, setJenisFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [metodeFilter, setMetodeFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formNama, setFormNama] = useState('');
  const [formAngkatan, setFormAngkatan] = useState<AngkatanNumber>(
    selectedCohortFilter !== 'all' ? selectedCohortFilter : 1
  );
  const [formJenis, setFormJenis] = useState<JenisKontribusi>('iuran_wajib_angkatan');
  const [formNominal, setFormNominal] = useState<string>('');
  const [formMetode, setFormMetode] = useState<MetodePembayaran>('transfer_bank');
  const [formReferensi, setFormReferensi] = useState('');
  const [formCatatan, setFormCatatan] = useState('');
  const [formTanggal, setFormTanggal] = useState(new Date().toISOString().split('T')[0]);

  const canVerify = currentUser.role === 'super_admin' || currentUser.role === 'ketua_keuangan' || currentUser.role === 'bendahara' || currentUser.divisi === 'Keuangan';

  const formatRp = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const filteredContributions = contributions.filter(c => {
    if (selectedCohortFilter !== 'all' && c.angkatan !== selectedCohortFilter) {
      return false;
    }
    if (jenisFilter !== 'all' && c.jenis !== jenisFilter) {
      return false;
    }
    if (statusFilter !== 'all' && c.statusVerifikasi !== statusFilter) {
      return false;
    }
    if (metodeFilter !== 'all' && c.metodePembayaran !== metodeFilter) {
      return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = c.namaPenyumbang.toLowerCase().includes(q);
      const matchRef = c.referensiTransaksi.toLowerCase().includes(q);
      const matchNote = c.catatan.toLowerCase().includes(q);
      if (!matchName && !matchRef && !matchNote) return false;
    }
    return true;
  });

  const totalTerverifikasi = filteredContributions
    .filter(c => c.statusVerifikasi === 'terverifikasi')
    .reduce((sum, c) => sum + c.nominal, 0);

  const totalMenunggu = filteredContributions
    .filter(c => c.statusVerifikasi === 'menunggu_verifikasi')
    .reduce((sum, c) => sum + c.nominal, 0);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(formNominal.replace(/[^0-9]/g, ''));
    if (!formNama.trim() || isNaN(num) || num <= 0) return;

    onAddContribution({
      namaPenyumbang: formNama.trim(),
      angkatan: formAngkatan,
      jenis: formJenis,
      nominal: num,
      tanggalTransaksi: formTanggal,
      metodePembayaran: formMetode,
      referensiTransaksi: formReferensi.trim() || `TRX-${Date.now().toString().slice(-6)}`,
      statusVerifikasi: canVerify ? 'terverifikasi' : 'menunggu_verifikasi',
      catatan: formCatatan.trim() || 'Penerimaan dana terkonfirmasi',
      diverifikasiOleh: canVerify ? currentUser.name : undefined,
      diverifikasiPada: canVerify ? new Date().toISOString() : undefined
    });

    setFormNama('');
    setFormNominal('');
    setFormReferensi('');
    setFormCatatan('');
    setShowAddModal(false);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Penyumbang', 'Angkatan', 'Jenis', 'Nominal (IDR)', 'Tanggal', 'Metode', 'Referensi', 'Status', 'Catatan'];
    const rows = filteredContributions.map(c => [
      c.id,
      `"${c.namaPenyumbang}"`,
      `Angkatan ${c.angkatan}`,
      c.jenis,
      c.nominal,
      c.tanggalTransaksi,
      c.metodePembayaran,
      `"${c.referensiTransaksi}"`,
      c.statusVerifikasi,
      `"${c.catatan}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pelacakan_iuran_supmn_kotaagung_${selectedCohortFilter === 'all' ? 'semua_angkatan' : `akt_${selectedCohortFilter}`}.csv`);
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
            <Wallet className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              Pelacakan Iuran & Kontribusi Alumni Angkatan 1 s/d 19
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pencatatan iuran wajib angkatan, donasi sukarela, dan sponsorship dengan verifikasi langsung Ketua Divisi Keuangan
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 border border-slate-700 flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Rekap CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5 transition shadow"
          >
            <Plus className="w-4 h-4" />
            <span>+ Catat Kontribusi Baru</span>
          </button>
        </div>
      </div>

      {/* Cohort Selector Pills */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Saring Berdasarkan Kohort Angkatan:</span>
          <span className="text-emerald-400 font-normal">
            {selectedCohortFilter === 'all' ? 'Semua Angkatan 1–19' : `Angkatan ${selectedCohortFilter}`}
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCohortFilter('all')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium whitespace-nowrap transition ${
              selectedCohortFilter === 'all'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
            }`}
          >
            Semua (1–19)
          </button>
          {DAFTAR_ANGKATAN.map((akt) => {
            const sum = contributions
              .filter(c => c.angkatan === akt && c.statusVerifikasi === 'terverifikasi')
              .reduce((s, c) => s + c.nominal, 0);

            return (
              <button
                key={akt}
                onClick={() => setSelectedCohortFilter(akt)}
                className={`px-2.5 py-1.5 text-xs rounded-lg font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                  selectedCohortFilter === akt
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
                }`}
              >
                <span>Akt {akt}</span>
                {sum > 0 && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Ringkasan Filter Saat Ini */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-900/40">
          <div className="text-xs text-slate-400">Total Iuran Terverifikasi (Kolektif)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {formatRp(totalTerverifikasi)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Sah masuk rekening kas panitia & tervalidasi di buku kas
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-900/40">
          <div className="text-xs text-slate-400">Menunggu Verifikasi Mutasi Bank</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {formatRp(totalMenunggu)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {filteredContributions.filter(c => c.statusVerifikasi === 'menunggu_verifikasi').length} transaksi pending rekonsiliasi
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari nama, nomor referensi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-800 text-xs text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <select
            value={jenisFilter}
            onChange={(e) => setJenisFilter(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Jenis Kontribusi</option>
            <option value="iuran_wajib_angkatan">Iuran Wajib Angkatan</option>
            <option value="donasi_sukarela">Donasi Sukarela</option>
            <option value="sponsorship">Sponsorship</option>
            <option value="partisipasi_souvenir">Partisipasi Souvenir</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Status</option>
            <option value="terverifikasi">Terverifikasi</option>
            <option value="menunggu_verifikasi">Menunggu Verifikasi</option>
            <option value="ditolak">Ditolak</option>
          </select>
        </div>

        <div>
          <select
            value={metodeFilter}
            onChange={(e) => setMetodeFilter(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Metode Pembayaran</option>
            <option value="transfer_bank">Transfer Bank</option>
            <option value="qris">QRIS Panitia</option>
            <option value="tunai">Tunai / Sekretariat</option>
          </select>
        </div>
      </div>

      {/* Tabel Kontribusi */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80 shadow">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-850 text-slate-300 border-b border-slate-800 text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Penyumbang / Alumni</th>
              <th className="py-3 px-4 font-semibold">Kohort Angkatan</th>
              <th className="py-3 px-4 font-semibold">Jenis & Nominal</th>
              <th className="py-3 px-4 font-semibold">Metode & Referensi</th>
              <th className="py-3 px-4 font-semibold">Tanggal</th>
              <th className="py-3 px-4 font-semibold">Status Verifikasi</th>
              <th className="py-3 px-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredContributions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  Tidak ada catatan kontribusi sesuai kriteria filter.
                </td>
              </tr>
            ) : (
              filteredContributions.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{c.namaPenyumbang}</div>
                    <div className="text-[11px] text-slate-400">{c.catatan}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-semibold border border-cyan-800/60 text-[11px]">
                      Angkatan {c.angkatan}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-emerald-400 text-sm">
                      {formatRp(c.nominal)}
                    </div>
                    <div className="text-[10px] text-slate-400 capitalize">
                      {c.jenis.replace(/_/g, ' ')}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-300 font-medium capitalize">
                      {c.metodePembayaran.replace(/_/g, ' ')}
                    </div>
                    <div className="font-mono text-[10px] text-slate-500">
                      Ref: {c.referensiTransaksi}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {c.tanggalTransaksi}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 w-fit ${
                      c.statusVerifikasi === 'terverifikasi'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : c.statusVerifikasi === 'menunggu_verifikasi'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {c.statusVerifikasi === 'terverifikasi' ? (
                        <CheckCircle className="w-2.5 h-2.5" />
                      ) : (
                        <Clock className="w-2.5 h-2.5" />
                      )}
                      {c.statusVerifikasi === 'terverifikasi' ? 'Terverifikasi' : c.statusVerifikasi === 'menunggu_verifikasi' ? 'Menunggu' : 'Ditolak'}
                    </span>
                    {c.diverifikasiOleh && (
                      <div className="text-[9px] text-slate-500 mt-0.5">
                        Oleh: {c.diverifikasiOleh}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {canVerify && (
                      <div className="flex items-center justify-end gap-1.5">
                        {c.statusVerifikasi !== 'terverifikasi' && (
                          <button
                            onClick={() => onUpdateStatus(c.id, 'terverifikasi')}
                            className="px-2 py-1 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-[11px] border border-emerald-700 transition"
                          >
                            Verifikasi
                          </button>
                        )}
                        {c.statusVerifikasi === 'terverifikasi' && (
                          <button
                            onClick={() => onUpdateStatus(c.id, 'menunggu_verifikasi')}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 transition"
                          >
                            Revisi
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah Kontribusi */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-400" />
                Pencatatan Iuran / Donasi Baru
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Nama Alumni / Donatur / Kolektif *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Bambang (Angkatan 3) atau Setoran Kolektif Angkatan 12"
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Kohort Angkatan (1–19) *
                  </label>
                  <select
                    value={formAngkatan}
                    onChange={(e) => setFormAngkatan(Number(e.target.value) as AngkatanNumber)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
                  >
                    {DAFTAR_ANGKATAN.map((akt) => (
                      <option key={akt} value={akt}>Angkatan {akt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Jenis Kontribusi *
                  </label>
                  <select
                    value={formJenis}
                    onChange={(e) => setFormJenis(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="iuran_wajib_angkatan">Iuran Wajib Angkatan</option>
                    <option value="donasi_sukarela">Donasi Sukarela</option>
                    <option value="sponsorship">Sponsorship Maritim</option>
                    <option value="partisipasi_souvenir">Partisipasi Souvenir</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Nominal Setoran (IDR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="1000"
                    placeholder="Contoh: 500000"
                    value={formNominal}
                    onChange={(e) => setFormNominal(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    (Catatan: Nominal sesuai transfer asli tanpa angka rekaan)
                  </span>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Metode Pembayaran
                  </label>
                  <select
                    value={formMetode}
                    onChange={(e) => setFormMetode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="transfer_bank">Transfer Bank Resmi</option>
                    <option value="qris">QRIS Panitia</option>
                    <option value="tunai">Tunai / Sekretariat</option>
                    <option value="menunggu_konfirmasi">Menunggu Konfirmasi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Nomor Referensi Transaksi
                  </label>
                  <input
                    type="text"
                    placeholder="TRX-AKTxx-xxxx"
                    value={formReferensi}
                    onChange={(e) => setFormReferensi(e.target.value)}
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
                  Catatan / Keterangan Transfer
                </label>
                <textarea
                  rows={2}
                  placeholder="Catatan rincian transfer, rekening pengirim, atau pesan alumni"
                  value={formCatatan}
                  onChange={(e) => setFormCatatan(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
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
                  Simpan Catatan Iuran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
