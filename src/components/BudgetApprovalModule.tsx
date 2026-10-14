import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Plus, 
  FileCheck, 
  AlertCircle, 
  FileText,
  DollarSign
} from 'lucide-react';
import { 
  BudgetItem, 
  UserSession, 
  DivisiPanitia, 
  ApprovalStatus 
} from '../types';

interface BudgetApprovalModuleProps {
  budgetItems: BudgetItem[];
  currentUser: UserSession;
  onAddBudgetItem: (item: Omit<BudgetItem, 'id'>) => void;
  onReviewBudget: (id: string, status: ApprovalStatus, catatanReview: string) => void;
}

export const BudgetApprovalModule: React.FC<BudgetApprovalModuleProps> = ({
  budgetItems,
  currentUser,
  onAddBudgetItem,
  onReviewBudget
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [reviewModalItem, setReviewModalItem] = useState<BudgetItem | null>(null);
  const [catatanReviewInput, setCatatanReviewInput] = useState('');

  // Form State
  const [formKodePos, setFormKodePos] = useState('');
  const [formDivisi, setFormDivisi] = useState<DivisiPanitia>('Seksi Acara & Protokoler');
  const [formUraian, setFormUraian] = useState('');
  const [formAlokasi, setFormAlokasi] = useState('');

  const canApprove = currentUser.role === 'super_admin';

  const formatRp = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const totalAlokasi = budgetItems
    .filter(b => b.statusApproval === 'disetujui')
    .reduce((sum, b) => sum + b.alokasiAnggaran, 0);

  const totalRealisasi = budgetItems.reduce((sum, b) => sum + b.realisasiTerpakai, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(formAlokasi.replace(/[^0-9]/g, ''));
    if (!formUraian.trim() || isNaN(num) || num <= 0) return;

    onAddBudgetItem({
      kodePos: formKodePos.trim() || `POS-${Date.now().toString().slice(-4)}`,
      divisi: formDivisi,
      uraian: formUraian.trim(),
      alokasiAnggaran: num,
      realisasiTerpakai: 0,
      statusApproval: canApprove ? 'disetujui' : 'menunggu_persetujuan',
      diajukanOleh: currentUser.name,
      tanggalPengajuan: new Date().toISOString().split('T')[0],
      disetujuiOleh: canApprove ? currentUser.name : undefined,
      tanggalApproval: canApprove ? new Date().toISOString().split('T')[0] : undefined,
      catatanReview: canApprove ? 'Disetujui langsung oleh Ketua Panitia' : undefined
    });

    setFormKodePos('');
    setFormUraian('');
    setFormAlokasi('');
    setShowAddModal(false);
  };

  const handleReviewAction = (status: ApprovalStatus) => {
    if (!reviewModalItem) return;
    onReviewBudget(reviewModalItem.id, status, catatanReviewInput.trim() || `Diproses oleh ${currentUser.name}`);
    setReviewModalItem(null);
    setCatatanReviewInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-white">
              Persetujuan Anggaran RAPB (Rencana Anggaran Pendapatan & Belanja)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Alur otorisasi pagu anggaran per divisi panitia pelaksana dengan kontrol persetujuan Ketua Panitia
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white flex items-center gap-1.5 transition shadow"
        >
          <Plus className="w-4 h-4" />
          <span>+ Ajukan Pos Anggaran RAPB</span>
        </button>
      </div>

      {/* Ringkasan Pagu & Realisasi */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-xs text-slate-400">Total Pagu Anggaran Disetujui</div>
          <div className="text-xl font-bold text-white mt-1">{formatRp(totalAlokasi)}</div>
          <div className="text-[11px] text-emerald-400 mt-1">
            {budgetItems.filter(b => b.statusApproval === 'disetujui').length} pos anggaran sah
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-xs text-slate-400">Total Realisasi Kas Terpakai</div>
          <div className="text-xl font-bold text-cyan-300 mt-1">{formatRp(totalRealisasi)}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Berdasarkan pengeluaran sah di Buku Kas
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-xs text-slate-400">Sisa Pagu Belum Terealisasi</div>
          <div className="text-xl font-bold text-purple-400 mt-1">
            {formatRp(Math.max(0, totalAlokasi - totalRealisasi))}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Daya serap: {totalAlokasi > 0 ? Math.round((totalRealisasi / totalAlokasi) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Daftar Pos Anggaran */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80 shadow">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-850 text-slate-300 border-b border-slate-800 text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Kode & Divisi</th>
              <th className="py-3 px-4 font-semibold">Uraian Keperluan</th>
              <th className="py-3 px-4 font-semibold">Pagu Diajukan</th>
              <th className="py-3 px-4 font-semibold">Realisasi Kas</th>
              <th className="py-3 px-4 font-semibold">Status Persetujuan</th>
              <th className="py-3 px-4 font-semibold">Pengaju / Approval</th>
              <th className="py-3 px-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {budgetItems.map((item) => {
              const persentase = item.alokasiAnggaran > 0 
                ? Math.min(100, Math.round((item.realisasiTerpakai / item.alokasiAnggaran) * 100))
                : 0;

              return (
                <tr key={item.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-purple-300 font-semibold">
                      {item.kodePos}
                    </span>
                    <div className="font-semibold text-white mt-1">{item.divisi}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-300 max-w-xs">
                    <div>{item.uraian}</div>
                    {item.catatanReview && (
                      <div className="text-[10px] text-slate-400 italic mt-0.5">
                        Review: {item.catatanReview}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-bold text-white text-sm">
                    {formatRp(item.alokasiAnggaran)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-cyan-300">
                      {formatRp(item.realisasiTerpakai)}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {persentase}% terserap
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 w-fit ${
                      item.statusApproval === 'disetujui'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : item.statusApproval === 'menunggu_persetujuan'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : item.statusApproval === 'ditolak'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.statusApproval === 'disetujui' && <CheckCircle className="w-2.5 h-2.5" />}
                      {item.statusApproval === 'menunggu_persetujuan' && <Clock className="w-2.5 h-2.5" />}
                      {item.statusApproval === 'ditolak' && <XCircle className="w-2.5 h-2.5" />}
                      {item.statusApproval.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[11px] text-slate-400">
                    <div>Diajukan: {item.diajukanOleh}</div>
                    {item.disetujuiOleh && (
                      <div className="text-emerald-400 font-medium">Otorisasi: {item.disetujuiOleh}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {canApprove && item.statusApproval === 'menunggu_persetujuan' && (
                      <button
                        onClick={() => {
                          setReviewModalItem(item);
                          setCatatanReviewInput('');
                        }}
                        className="px-2.5 py-1 rounded bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-[11px] border border-purple-700 transition"
                      >
                        Review Pagu
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Review Approval (Khusus Super Admin / Ketua Panitia) */}
      {reviewModalItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <FileCheck className="w-4 h-4 text-purple-400" />
              Otorisasi Persetujuan Pos Anggaran RAPB
            </h3>
            <div className="mt-3 text-xs space-y-2 text-slate-300">
              <div><strong className="text-white">Divisi:</strong> {reviewModalItem.divisi}</div>
              <div><strong className="text-white">Uraian:</strong> {reviewModalItem.uraian}</div>
              <div><strong className="text-white">Pagu yang Diajukan:</strong> {formatRp(reviewModalItem.alokasiAnggaran)}</div>
              <div><strong className="text-white">Pengaju:</strong> {reviewModalItem.diajukanOleh}</div>
            </div>

            <div className="mt-4">
              <label className="block text-slate-300 text-xs font-medium mb-1">
                Catatan Evaluasi / Rekomendasi Ketua Panitia
              </label>
              <textarea
                rows={2}
                placeholder="Misal: Disetujui sesuai pagu pleno, pencairan termin 1"
                value={catatanReviewInput}
                onChange={(e) => setCatatanReviewInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white text-xs border border-slate-700 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="mt-5 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setReviewModalItem(null)}
                className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-750"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleReviewAction('ditolak')}
                className="px-3 py-2 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-rose-200 border border-rose-700"
              >
                Tolak Pengajuan
              </button>
              <button
                type="button"
                onClick={() => handleReviewAction('disetujui')}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-semibold text-white"
              >
                Setujui Pagu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Pos Anggaran */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-400" />
                Pengajuan Pos Anggaran RAPB Baru
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Kode Pos (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: ACR-02, KNS-02"
                    value={formKodePos}
                    onChange={(e) => setFormKodePos(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Divisi / Seksi Panitia *
                  </label>
                  <select
                    value={formDivisi}
                    onChange={(e) => setFormDivisi(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Seksi Acara & Protokoler">Seksi Acara & Protokoler</option>
                    <option value="Seksi Logistik & Perlengkapan">Seksi Logistik & Perlengkapan</option>
                    <option value="Seksi Konsumsi">Seksi Konsumsi</option>
                    <option value="Seksi Publikasi & Dokumentasi">Seksi Publikasi & Dokumentasi</option>
                    <option value="Seksi Sekretariat & Pendaftaran">Seksi Sekretariat & Pendaftaran</option>
                    <option value="Seksi Keamanan & Medis">Seksi Keamanan & Medis</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Uraian Keperluan Dana *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Rincian pos kebutuhan logistik/operasional panitia..."
                  value={formUraian}
                  onChange={(e) => setFormUraian(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Alokasi Pagu Anggaran (IDR) *
                </label>
                <input
                  type="number"
                  required
                  min="10000"
                  step="10000"
                  placeholder="Contoh: 5000000"
                  value={formAlokasi}
                  onChange={(e) => setFormAlokasi(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-purple-500"
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
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 font-semibold text-white"
                >
                  Kirim Pengajuan RAPB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
