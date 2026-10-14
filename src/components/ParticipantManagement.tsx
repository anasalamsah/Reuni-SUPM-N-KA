import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Filter, 
  Download, 
  UserCheck, 
  Clock, 
  ChevronRight,
  ShieldAlert,
  Edit,
  Trash2
} from 'lucide-react';
import { 
  Participant, 
  UserSession, 
  AngkatanNumber, 
  DAFTAR_ANGKATAN, 
  KehadiranStatus, 
  VerifikasiStatus 
} from '../types';

interface ParticipantManagementProps {
  participants: Participant[];
  currentUser: UserSession;
  selectedCohortFilter: AngkatanNumber | 'all';
  setSelectedCohortFilter: (akt: AngkatanNumber | 'all') => void;
  onAddParticipant: (participant: Omit<Participant, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateStatus: (id: string, status: VerifikasiStatus) => void;
  onDeleteParticipant?: (id: string) => void;
}

export const ParticipantManagement: React.FC<ParticipantManagementProps> = ({
  participants,
  currentUser,
  selectedCohortFilter,
  setSelectedCohortFilter,
  onAddParticipant,
  onUpdateStatus,
  onDeleteParticipant
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusKehadiranFilter, setStatusKehadiranFilter] = useState<string>('all');
  const [statusVerifikasiFilter, setStatusVerifikasiFilter] = useState<string>('all');
  const [jurusanFilter, setJurusanFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formNama, setFormNama] = useState('');
  const [formAngkatan, setFormAngkatan] = useState<AngkatanNumber>(
    selectedCohortFilter !== 'all' ? selectedCohortFilter : 1
  );
  const [formJurusan, setFormJurusan] = useState<Participant['jurusan']>('NKN');
  const [formKontak, setFormKontak] = useState('');
  const [formDomisili, setFormDomisili] = useState('');
  const [formKehadiran, setFormKehadiran] = useState<KehadiranStatus>('akan_hadir');
  const [formPendamping, setFormPendamping] = useState<number>(0);
  const [formUkuranKaos, setFormUkuranKaos] = useState<Participant['ukuranKaos']>('L');
  const [formCatatan, setFormCatatan] = useState('');

  // Hak Akses
  const canVerify = currentUser.role === 'super_admin' || currentUser.role === 'seksi_acara';

  // Filter Data
  const filteredParticipants = participants.filter(p => {
    if (selectedCohortFilter !== 'all' && p.angkatan !== selectedCohortFilter) {
      return false;
    }
    if (statusKehadiranFilter !== 'all' && p.statusKehadiran !== statusKehadiranFilter) {
      return false;
    }
    if (statusVerifikasiFilter !== 'all' && p.statusVerifikasi !== statusVerifikasiFilter) {
      return false;
    }
    if (jurusanFilter !== 'all' && p.jurusan !== jurusanFilter) {
      return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = p.namaLengkap.toLowerCase().includes(q);
      const matchCity = p.kotaDomisili.toLowerCase().includes(q);
      const matchNote = (p.catatanKhusus || '').toLowerCase().includes(q);
      const matchAngkatan = `angkatan ${p.angkatan}`.toLowerCase().includes(q);
      if (!matchName && !matchCity && !matchNote && !matchAngkatan) return false;
    }
    return true;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama.trim()) return;

    onAddParticipant({
      namaLengkap: formNama.trim(),
      angkatan: formAngkatan,
      jurusan: formJurusan,
      nomorKontak: formKontak.trim() || '-',
      kotaDomisili: formDomisili.trim() || 'Tanggamus / Lampung',
      statusKehadiran: formKehadiran,
      statusVerifikasi: canVerify ? 'terverifikasi' : 'menunggu_verifikasi',
      jumlahPendamping: Number(formPendamping) || 0,
      ukuranKaos: formUkuranKaos,
      catatanKhusus: formCatatan.trim() || undefined
    });

    // Reset Form
    setFormNama('');
    setFormKontak('');
    setFormDomisili('');
    setFormPendamping(0);
    setFormCatatan('');
    setShowAddModal(false);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Nama Lengkap', 'Angkatan', 'Jurusan', 'Domisili', 'Kontak', 'Status Kehadiran', 'Pendamping', 'Ukuran Kaos', 'Status Verifikasi', 'Catatan'];
    const rows = filteredParticipants.map(p => [
      p.id,
      `"${p.namaLengkap}"`,
      `Angkatan ${p.angkatan}`,
      p.jurusan,
      `"${p.kotaDomisili}"`,
      `"${p.nomorKontak}"`,
      p.statusKehadiran,
      p.jumlahPendamping,
      p.ukuranKaos || '-',
      p.statusVerifikasi,
      `"${p.catatanKhusus || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `peserta_reuni_supmn_kotaagung_${selectedCohortFilter === 'all' ? 'semua_angkatan' : `akt_${selectedCohortFilter}`}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">
              Database Registrasi Alumni Angkatan 1 s/d 19
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pengelolaan peserta resmi Reuni Akbar SUPM N Kotaagung dengan pemfilteran berbasis kohort
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 border border-slate-700 flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white flex items-center gap-1.5 transition shadow"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Peserta Alumni</span>
          </button>
        </div>
      </div>

      {/* Cohort Tabs (1–19) Filter Pills */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Pilih Filter Kohort Angkatan:</span>
          <span className="text-cyan-400 font-normal">
            {selectedCohortFilter === 'all' ? 'Semua Angkatan 1–19' : `Hanya Angkatan ${selectedCohortFilter}`}
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCohortFilter('all')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium whitespace-nowrap transition ${
              selectedCohortFilter === 'all'
                ? 'bg-cyan-600 text-white shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
            }`}
          >
            Semua (1–19)
          </button>
          {DAFTAR_ANGKATAN.map((akt) => {
            const count = participants.filter(p => p.angkatan === akt).length;
            return (
              <button
                key={akt}
                onClick={() => setSelectedCohortFilter(akt)}
                className={`px-2.5 py-1.5 text-xs rounded-lg font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                  selectedCohortFilter === akt
                    ? 'bg-cyan-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
                }`}
              >
                <span>Akt {akt}</span>
                {count > 0 && (
                  <span className={`px-1 rounded text-[10px] ${
                    selectedCohortFilter === akt ? 'bg-cyan-800 text-cyan-200' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Bar Tambahan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        {/* Pencarian */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari nama, kota, catatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-800 text-xs text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Kehadiran */}
        <div>
          <select
            value={statusKehadiranFilter}
            onChange={(e) => setStatusKehadiranFilter(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Status Kehadiran</option>
            <option value="akan_hadir">Akan Hadir</option>
            <option value="ragu_ragu">Ragu-ragu</option>
            <option value="tidak_hadir">Tidak Hadir</option>
          </select>
        </div>

        {/* Verifikasi */}
        <div>
          <select
            value={statusVerifikasiFilter}
            onChange={(e) => setStatusVerifikasiFilter(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Status Verifikasi</option>
            <option value="terverifikasi">Terverifikasi</option>
            <option value="menunggu_verifikasi">Menunggu Verifikasi</option>
            <option value="ditolak">Ditolak</option>
          </select>
        </div>

        {/* Jurusan SUPM */}
        <div>
          <select
            value={jurusanFilter}
            onChange={(e) => setJurusanFilter(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Jurusan SUPM</option>
            <option value="NKN">NKN (Nautika Perikanan)</option>
            <option value="TKPI">TKPI (Teknika Perikanan)</option>
            <option value="TPHP">TPHP (Pengolahan Hasil)</option>
            <option value="TPL">TPL (Budidaya / Pembenihan)</option>
            <option value="Umum/Lainnya">Umum / Lainnya</option>
          </select>
        </div>
      </div>

      {/* Tabel Peserta */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80 shadow">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-850 text-slate-300 border-b border-slate-800 text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Nama Alumni</th>
              <th className="py-3 px-4 font-semibold">Kohort & Jurusan</th>
              <th className="py-3 px-4 font-semibold">Domisili</th>
              <th className="py-3 px-4 font-semibold">Kontak</th>
              <th className="py-3 px-4 font-semibold">Kehadiran</th>
              <th className="py-3 px-4 font-semibold">Pendamping</th>
              <th className="py-3 px-4 font-semibold">Verifikasi</th>
              <th className="py-3 px-4 font-semibold text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredParticipants.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  Tidak ada peserta alumni yang sesuai dengan filter.
                </td>
              </tr>
            ) : (
              filteredParticipants.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{p.namaLengkap}</div>
                    <div className="text-[11px] text-slate-400">{p.id}</div>
                    {p.catatanKhusus && (
                      <div className="text-[10px] text-cyan-400/90 italic mt-0.5">
                        &quot;{p.catatanKhusus}&quot;
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-semibold border border-cyan-800/60 text-[10px]">
                        Angkatan {p.angkatan}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[10px]">
                        {p.jurusan}
                      </span>
                    </div>
                    {p.ukuranKaos && (
                      <div className="text-[10px] text-slate-500 mt-1">
                        Kaos: Size {p.ukuranKaos}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {p.kotaDomisili}
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                    {p.nomorKontak}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      p.statusKehadiran === 'akan_hadir'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : p.statusKehadiran === 'ragu_ragu'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {p.statusKehadiran === 'akan_hadir' ? 'Akan Hadir' : p.statusKehadiran === 'ragu_ragu' ? 'Ragu-ragu' : 'Tidak Hadir'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {p.jumlahPendamping > 0 ? `+${p.jumlahPendamping} orang` : 'Sendiri'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 w-fit ${
                      p.statusVerifikasi === 'terverifikasi'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : p.statusVerifikasi === 'menunggu_verifikasi'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {p.statusVerifikasi === 'terverifikasi' ? (
                        <CheckCircle className="w-2.5 h-2.5" />
                      ) : (
                        <Clock className="w-2.5 h-2.5" />
                      )}
                      {p.statusVerifikasi === 'terverifikasi' ? 'Terverifikasi' : p.statusVerifikasi === 'menunggu_verifikasi' ? 'Menunggu' : 'Ditolak'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {canVerify && p.statusVerifikasi !== 'terverifikasi' && (
                        <button
                          onClick={() => onUpdateStatus(p.id, 'terverifikasi')}
                          className="px-2 py-1 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-[11px] border border-emerald-700 transition"
                          title="Verifikasi Peserta"
                        >
                          Verifikasi
                        </button>
                      )}
                      {canVerify && p.statusVerifikasi === 'terverifikasi' && (
                        <button
                          onClick={() => onUpdateStatus(p.id, 'menunggu_verifikasi')}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 transition"
                          title="Batal Verifikasi"
                        >
                          Tinjau Ulang
                        </button>
                      )}
                      {onDeleteParticipant && currentUser.role === 'super_admin' && (
                        <button
                          onClick={() => onDeleteParticipant(p.id)}
                          className="p-1 rounded bg-rose-950/40 hover:bg-rose-900 text-rose-400 transition"
                          title="Hapus Data Peserta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah Peserta Baru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                Registrasi Peserta Alumni Baru
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
                  Nama Lengkap Alumni *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ahmad Fauzi, S.Pi"
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
                    Program Keahlian (Jurusan) *
                  </label>
                  <select
                    value={formJurusan}
                    onChange={(e) => setFormJurusan(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="NKN">NKN (Nautika Kapal Penangkap Ikan)</option>
                    <option value="TKPI">TKPI (Teknika Kapal Penangkap Ikan)</option>
                    <option value="TPHP">TPHP (Pengolahan Hasil Perikanan)</option>
                    <option value="TPL">TPL (Teknologi Budidaya / Pembenihan)</option>
                    <option value="Umum/Lainnya">Umum / Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Kota / Wilayah Domisili
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Kotaagung / Jakarta"
                    value={formDomisili}
                    onChange={(e) => setFormDomisili(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Nomor Kontak (WhatsApp)
                  </label>
                  <input
                    type="text"
                    placeholder="0812-XXXX-XXXX"
                    value={formKontak}
                    onChange={(e) => setFormKontak(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Konfirmasi Kehadiran
                  </label>
                  <select
                    value={formKehadiran}
                    onChange={(e) => setFormKehadiran(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="akan_hadir">Akan Hadir</option>
                    <option value="ragu_ragu">Ragu-ragu</option>
                    <option value="tidak_hadir">Tidak Hadir</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Jumlah Pendamping
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formPendamping}
                    onChange={(e) => setFormPendamping(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Ukuran Kaos Reuni
                  </label>
                  <select
                    value={formUkuranKaos}
                    onChange={(e) => setFormUkuranKaos(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                    <option value="XXXL">XXXL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Catatan Khusus / Profesi Maritim / Keterangan
                </label>
                <textarea
                  rows={2}
                  placeholder="Misal: Perwira Kapal Ikan, Pengusaha Tambak, Guru SUPM, dll."
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
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 font-semibold text-white"
                >
                  Simpan Peserta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
