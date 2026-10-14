import React, { useState } from 'react';
import { 
  Layers, 
  Users, 
  Wallet, 
  Download, 
  Search, 
  Filter, 
  ArrowUpRight,
  CheckCircle,
  Clock,
  UserCheck
} from 'lucide-react';
import { 
  Participant, 
  Contribution, 
  DAFTAR_ANGKATAN, 
  AngkatanNumber 
} from '../types';

interface CohortMatrixModuleProps {
  participants: Participant[];
  contributions: Contribution[];
  onSelectCohortForParticipants: (angkatan: AngkatanNumber) => void;
  onSelectCohortForContributions: (angkatan: AngkatanNumber) => void;
}

export const CohortMatrixModule: React.FC<CohortMatrixModuleProps> = ({
  participants,
  contributions,
  onSelectCohortForParticipants,
  onSelectCohortForContributions
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const formatRp = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Hitung data per angkatan 1–19
  const cohortStats = DAFTAR_ANGKATAN.map((akt) => {
    const listPeserta = participants.filter(p => p.angkatan === akt);
    const terverifikasi = listPeserta.filter(p => p.statusVerifikasi === 'terverifikasi').length;
    const pending = listPeserta.filter(p => p.statusVerifikasi === 'menunggu_verifikasi').length;
    const akanHadir = listPeserta.filter(p => p.statusKehadiran === 'akan_hadir').length;
    const raguRagu = listPeserta.filter(p => p.statusKehadiran === 'ragu_ragu').length;
    const tidakHadir = listPeserta.filter(p => p.statusKehadiran === 'tidak_hadir').length;
    const totalPendamping = listPeserta.reduce((acc, p) => acc + (p.jumlahPendamping || 0), 0);

    const listIuran = contributions.filter(c => c.angkatan === akt && c.statusVerifikasi === 'terverifikasi');
    const totalDana = listIuran.reduce((sum, c) => sum + c.nominal, 0);

    return {
      angkatan: akt,
      totalPeserta: listPeserta.length,
      terverifikasi,
      pending,
      akanHadir,
      raguRagu,
      tidakHadir,
      totalPendamping,
      totalJiwa: listPeserta.length + totalPendamping,
      totalDana,
      jumlahTransaksi: listIuran.length
    };
  });

  const filteredStats = cohortStats.filter(item => {
    if (!searchTerm) return true;
    return `angkatan ${item.angkatan}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
           `akt ${item.angkatan}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.angkatan.toString() === searchTerm.trim();
  });

  // Rekapitulasi Total Keseluruhan
  const grandTotalPeserta = cohortStats.reduce((sum, i) => sum + i.totalPeserta, 0);
  const grandTotalJiwa = cohortStats.reduce((sum, i) => sum + i.totalJiwa, 0);
  const grandTotalDana = cohortStats.reduce((sum, i) => sum + i.totalDana, 0);
  const grandTotalAkanHadir = cohortStats.reduce((sum, i) => sum + i.akanHadir, 0);

  const handleExportCSV = () => {
    const headers = ['Angkatan', 'Total Peserta', 'Terverifikasi', 'Pending', 'Akan Hadir', 'Ragu-ragu', 'Tidak Hadir', 'Pendamping', 'Total Jiwa', 'Total Kontribusi (IDR)'];
    const rows = cohortStats.map(s => [
      `Angkatan ${s.angkatan}`,
      s.totalPeserta,
      s.terverifikasi,
      s.pending,
      s.akanHadir,
      s.raguRagu,
      s.tidakHadir,
      s.totalPendamping,
      s.totalJiwa,
      s.totalDana
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'rekapitulasi_kohort_angkatan_1-19_supmn_kotaagung.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Modul Kohort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">
              Matriks Struktur Kohort Alumni Angkatan 1 s/d 19
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Rekapitulasi partisipasi alumni dan capaian penerimaan iuran/kontribusi resmi untuk seluruh 19 angkatan
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 border border-slate-700 flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV Rekapitulasi</span>
          </button>
        </div>
      </div>

      {/* Ringkasan Akumulatif */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Total Angkatan Resmi</div>
          <div className="text-xl font-bold text-cyan-400 mt-1">19 Angkatan (1–19)</div>
          <div className="text-[10px] text-slate-500 mt-0.5">SUPM N Kotaagung</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Total Alumni & Jiwa</div>
          <div className="text-xl font-bold text-white mt-1">{grandTotalPeserta} Alumni</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">{grandTotalJiwa} Jiwa termasuk pendamping</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Konfirmasi Kehadiran</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">{grandTotalAkanHadir} Hadir</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Siap menghadiri acara</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Akumulasi Iuran Terverifikasi</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">{formatRp(grandTotalDana)}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Buku kas resmi</div>
        </div>
      </div>

      {/* Filter & Pencarian */}
      <div className="flex items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari angkatan (misal: Angkatan 5 atau 5)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-800 text-xs text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="text-xs text-slate-400">
          Menampilkan {filteredStats.length} dari 19 Angkatan
        </div>
      </div>

      {/* Tabel Rinci Matriks Kohort 1–19 */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80 shadow-md">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-850 text-slate-300 border-b border-slate-800 text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Angkatan</th>
              <th className="py-3 px-4 font-semibold">Total Pendaftar</th>
              <th className="py-3 px-4 font-semibold">Status Verifikasi</th>
              <th className="py-3 px-4 font-semibold">Kehadiran</th>
              <th className="py-3 px-4 font-semibold">Pendamping</th>
              <th className="py-3 px-4 font-semibold">Total Jiwa</th>
              <th className="py-3 px-4 font-semibold">Iuran Terverifikasi</th>
              <th className="py-3 px-4 font-semibold text-right">Aksi Cepat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredStats.map((item) => (
              <tr 
                key={item.angkatan}
                className="hover:bg-slate-800/50 transition"
              >
                <td className="py-3 px-4 font-bold text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-xs font-bold">
                      {item.angkatan}
                    </span>
                    <span>Angkatan {item.angkatan}</span>
                  </div>
                </td>
                <td className="py-3 px-4 font-medium text-slate-200">
                  {item.totalPeserta} orang
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
                      <CheckCircle className="w-2.5 h-2.5" /> {item.terverifikasi}
                    </span>
                    {item.pending > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-950/80 text-amber-300 border border-amber-800/60 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> {item.pending}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-[11px] space-y-0.5">
                    <div className="text-emerald-400 font-medium">{item.akanHadir} Hadir</div>
                    {item.raguRagu > 0 && <div className="text-amber-400">{item.raguRagu} Ragu</div>}
                    {item.tidakHadir > 0 && <div className="text-slate-500">{item.tidakHadir} Absen</div>}
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-300">
                  +{item.totalPendamping} orang
                </td>
                <td className="py-3 px-4 font-semibold text-white">
                  {item.totalJiwa} jiwa
                </td>
                <td className="py-3 px-4 font-semibold text-emerald-400">
                  {formatRp(item.totalDana)}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onSelectCohortForParticipants(item.angkatan)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] border border-slate-700 transition"
                      title="Lihat Data Peserta"
                    >
                      Peserta &rarr;
                    </button>
                    <button
                      onClick={() => onSelectCohortForContributions(item.angkatan)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[11px] border border-slate-700 transition"
                      title="Lihat Data Iuran"
                    >
                      Iuran &rarr;
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-850 font-bold text-white border-t-2 border-slate-700">
              <td className="py-3 px-4">TOTAL REKAPITULASI</td>
              <td className="py-3 px-4">{grandTotalPeserta} orang</td>
              <td className="py-3 px-4">Semua Angkatan 1–19</td>
              <td className="py-3 px-4">{grandTotalAkanHadir} Hadir</td>
              <td className="py-3 px-4">
                +{cohortStats.reduce((s, i) => s + i.totalPendamping, 0)} orang
              </td>
              <td className="py-3 px-4">{grandTotalJiwa} jiwa</td>
              <td className="py-3 px-4 text-emerald-400">{formatRp(grandTotalDana)}</td>
              <td className="py-3 px-4 text-right">Lengkap</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
