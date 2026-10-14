import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle, 
  UserCheck, 
  Package, 
  Coffee, 
  Plus, 
  Search, 
  Shirt, 
  Sparkles, 
  Layers, 
  Building,
  ShieldCheck,
  CheckSquare,
  Square,
  Users,
  Radio, 
  Music, 
  HeartPulse,
  Award,
  Camera,
  Heart,
  TrendingUp
} from 'lucide-react';
import { 
  RundownItem, 
  Participant, 
  UserSession, 
  SubMenuAcara, 
  BudgetItem,
  ScoopAcara,
  DivisionTask 
} from '../../types';
import { DivisionPlanProgressModule } from '../DivisionPlanProgressModule';

interface DivisiAcaraProps {
  currentSubMenu: SubMenuAcara;
  onSelectSubMenu: (sub: SubMenuAcara) => void;
  rundownItems: RundownItem[];
  onAddRundownItem: (item: Omit<RundownItem, 'id'>) => void;
  participants: Participant[];
  budgetItems: BudgetItem[];
  currentUser: UserSession;
  scoopAcara: ScoopAcara[];
  onUpdateScoopAcara: (scoops: ScoopAcara[]) => void;
  tasks: DivisionTask[];
  onAddTask: (task: Omit<DivisionTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateTask: (task: DivisionTask) => void;
  onDeleteTask: (id: string) => void;
  users: UserSession[];
}

export const DivisiAcara: React.FC<DivisiAcaraProps> = ({
  currentSubMenu,
  onSelectSubMenu,
  rundownItems,
  onAddRundownItem,
  participants,
  budgetItems,
  currentUser,
  scoopAcara,
  onUpdateScoopAcara,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  users
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddRundownModal, setShowAddRundownModal] = useState(false);

  // Form State Rundown
  const [namaSesi, setNamaSesi] = useState('');
  const [waktuMulai, setWaktuMulai] = useState('08:00');
  const [waktuSelesai, setWaktuSelesai] = useState('09:00');
  const [penanggungJawab, setPenanggungJawab] = useState('');
  const [lokasi, setLokasi] = useState('Aula / Lapangan SUPM');
  const [keterangan, setKeterangan] = useState('');

  const subMenus = [
    { id: 'plan_progress' as SubMenuAcara, label: 'Plan & Progress Acara', icon: TrendingUp, desc: 'Pantau Task & 10 Scoop' },
    { id: 'scoop_tim' as SubMenuAcara, label: '10 Scoop Tim Acara (19 Orang)', icon: Layers, desc: '10 Pos Tanggung Jawab' },
    { id: 'rundown' as SubMenuAcara, label: 'Rundown & Protokoler', icon: Calendar, desc: 'Susunan Acara Apel' },
    { id: 'checkin' as SubMenuAcara, label: 'Presensi & Gate Hari-H', icon: UserCheck, desc: 'Check-in Barcode' },
    { id: 'logistik' as SubMenuAcara, label: 'Panggung & Sound 15K W', icon: Package, desc: 'Audio, Tenda & Genset' },
    { id: 'konsumsi' as SubMenuAcara, label: 'Konsumsi & Jamuan Bahari', icon: Coffee, desc: 'Ikan Bakar & Gulai Taboh' },
    { id: 'seragam_merch' as SubMenuAcara, label: 'Distribusi Kaos & Merch', icon: Shirt, desc: 'Rekap S s/d XXXL' },
    { id: 'keamanan_medis' as SubMenuAcara, label: 'Keamanan, Parkir & Medis', icon: ShieldCheck, desc: 'PAMDAL & Ambulans Siaga' },
    { id: 'temu_kangen' as SubMenuAcara, label: 'Silaturahmi Guru & Tali Asih', icon: Award, desc: '15 Tokoh Purnabakti' },
    { id: 'hiburan' as SubMenuAcara, label: 'Musik Bahari & Wall of Fame', icon: Music, desc: 'Kilas Balik & Memorabilia' }
  ];

  // Hitung Ukuran Kaos
  const ukuranCounts: Record<string, number> = {
    S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0
  };
  participants.forEach(p => {
    if (p.ukuranKaos && ukuranCounts[p.ukuranKaos] !== undefined) {
      ukuranCounts[p.ukuranKaos]++;
    }
  });

  const totalPendamping = participants.reduce((s, p) => s + (p.jumlahPendamping || 0), 0);
  const totalPorsiMakan = participants.length + totalPendamping;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSesi.trim()) return;

    onAddRundownItem({
      namaSesi: namaSesi.trim(),
      waktuMulai,
      waktuSelesai,
      penanggungJawab: penanggungJawab.trim() || 'Seksi Acara',
      lokasi: lokasi.trim() || 'Kampus SUPM N Kotaagung',
      status: 'siap',
      keterangan: keterangan.trim() || 'Sesi resmi Reuni Akbar'
    });

    setNamaSesi('');
    setPenanggungJawab('');
    setKeterangan('');
    setShowAddRundownModal(false);
  };

  const handleToggleChecklist = (scoopId: string, checkId: string) => {
    const updated = scoopAcara.map(s => {
      if (s.id === scoopId) {
        const updatedChecklist = s.itemChecklist.map(c => {
          if (c.id === checkId) return { ...c, selesai: !c.selesai };
          return c;
        });
        const completedCount = updatedChecklist.filter(c => c.selesai).length;
        const newPercent = Math.round((completedCount / updatedChecklist.length) * 100);
        return {
          ...s,
          itemChecklist: updatedChecklist,
          progresPersen: newPercent,
          statusKesiapan: newPercent === 100 ? 'siap_penuh' : newPercent >= 75 ? 'siap_75%' : 'persiapan'
        };
      }
      return s;
    });
    onUpdateScoopAcara(updated as any);
  };

  const filteredCheckin = participants.filter(p => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return p.namaLengkap.toLowerCase().includes(q) ||
           `angkatan ${p.angkatan}`.toLowerCase().includes(q) ||
           p.jurusan.toLowerCase().includes(q);
  });

  const acaraBudget = budgetItems.filter(b => 
    b.divisi.includes('Acara') || b.divisi.includes('Logistik') || b.divisi.includes('Konsumsi') || b.divisi.includes('Keamanan')
  );

  return (
    <div className="space-y-5">
      {/* Division Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-900 border border-purple-800/40 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-400/30 text-purple-400 shadow-md">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-700/50">
                  Divisi Terbesar
                </span>
                <h1 className="text-base sm:text-lg font-bold text-white">
                  Divisi Acara, Protokoler & Operasional
                </h1>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Ketua Divisi: <strong>Romi Handoko (Angkatan 4)</strong> &bull; Total <strong>19 Anggota Tim</strong> dengan 6 pos scoop tanggung jawab operasional Reuni Akbar.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-purple-300 bg-purple-950/50 px-3 py-1.5 rounded-lg border border-purple-800/40">
            <Users className="w-4 h-4 text-purple-400" />
            <span>Kekuatan Tim: <strong>1 Ketua + 18 Anggota</strong></span>
          </div>
        </div>

        {/* Sub-Menu Navigation Tabs (Expanded Scoop) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 mt-4 pt-3 border-t border-slate-800/80">
          {subMenus.map((sub) => {
            const Icon = sub.icon;
            const isActive = currentSubMenu === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => onSelectSubMenu(sub.id)}
                className={`p-2 rounded-xl border text-left transition flex flex-col justify-between ${
                  isActive
                    ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-900/40'
                    : 'bg-slate-850/80 hover:bg-slate-800 border-slate-750 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold leading-tight">{sub.label}</div>
                  <div className={`text-[9px] truncate ${isActive ? 'text-purple-100' : 'text-slate-400'}`}>{sub.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-MENU 1: PEMBAGIAN SCOOP & TUGAS 19 ANGGOTA TIM ACARA */}
      {currentSubMenu === 'scoop_tim' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                Matriks Pembagian 10 Scoop Tanggung Jawab (19 Anggota Tim)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Struktur penugasan spesifik bagi seluruh 19 panitia Divisi Acara yang dipimpin Romi Handoko (4)
              </p>
            </div>
            <span className="text-xs text-purple-300 bg-purple-950 px-2.5 py-1 rounded border border-purple-800 font-semibold">
              {scoopAcara.length} Pos Scoop Aktif
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scoopAcara.map((scoop) => (
              <div 
                key={scoop.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-800/60 transition shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                      {scoop.id}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-1">{scoop.namaScoop}</h4>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                    scoop.progresPersen >= 85 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {scoop.progresPersen}% Kesiapan
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {scoop.deskripsi}
                </p>

                {/* Team Assignment */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 space-y-1.5 text-xs">
                  <div className="text-[11px] text-slate-400">
                    Koordinator Pos: <strong className="text-cyan-300">{scoop.koordinatorScoop}</strong>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 flex-wrap">
                    <span>Anggota Bertugas:</span>
                    {scoop.anggotaTim.map((anggota, i) => (
                      <span key={i} className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-200 text-[10px] border border-slate-700">
                        {anggota}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interactive Checklist */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400">Daftar Kesiapan Operasional:</div>
                  {scoop.itemChecklist.map((chk) => (
                    <button
                      key={chk.id}
                      onClick={() => handleToggleChecklist(scoop.id, chk.id)}
                      className="w-full text-left p-2 rounded-lg bg-slate-850/80 hover:bg-slate-800 border border-slate-800 flex items-center gap-2 text-xs transition"
                    >
                      {chk.selesai ? (
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      )}
                      <span className={chk.selesai ? 'line-through text-slate-400' : 'text-slate-200'}>
                        {chk.nama}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 italic">
                  Catatan: {scoop.catatanOperasional}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-MENU 2: RUNDOWN */}
      {currentSubMenu === 'rundown' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                Susunan Rundown Acara Reuni Akbar
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Jadwal rangkaian prosesi temu kangen, upacara bahari, tali asih guru, dan musyawarah alumni
              </p>
            </div>
            <button
              onClick={() => setShowAddRundownModal(true)}
              className="px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white flex items-center gap-1.5 transition shadow"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Sesi Acara</span>
            </button>
          </div>

          <div className="space-y-3">
            {rundownItems.map((item) => (
              <div 
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-800/60 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="px-2.5 py-1.5 rounded-lg bg-purple-950 text-purple-300 border border-purple-800 font-mono font-bold text-xs text-center shrink-0">
                    <div>{item.waktuMulai}</div>
                    <div className="text-[10px] text-slate-400">s/d {item.waktuSelesai}</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{item.namaSesi}</h4>
                    <p className="text-slate-300 text-xs mt-0.5">{item.keterangan}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 flex-wrap">
                      <span className="flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3 h-3 text-purple-400" /> {item.lokasi}
                      </span>
                      <span>&bull;</span>
                      <span className="text-cyan-300">PJ: {item.penanggungJawab}</span>
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0">
                  {item.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          {/* Modal Tambah Rundown */}
          {showAddRundownModal && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    Tambah Sesi Rundown Acara
                  </h3>
                  <button onClick={() => setShowAddRundownModal(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleAddSubmit} className="space-y-3.5 mt-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Nama Sesi Acara *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Temu Kangen & Ramah Tamah"
                      value={namaSesi}
                      onChange={(e) => setNamaSesi(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Waktu Mulai</label>
                      <input
                        type="time"
                        value={waktuMulai}
                        onChange={(e) => setWaktuMulai(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Waktu Selesai</label>
                      <input
                        type="time"
                        value={waktuSelesai}
                        onChange={(e) => setWaktuSelesai(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Penanggung Jawab (PJ)</label>
                      <input
                        type="text"
                        placeholder="Misal: Yogi Faisal (5)"
                        value={penanggungJawab}
                        onChange={(e) => setPenanggungJawab(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Lokasi Sesi</label>
                      <input
                        type="text"
                        placeholder="Lapangan Apel / Hall Plenary"
                        value={lokasi}
                        onChange={(e) => setLokasi(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Keterangan / Uraian</label>
                    <textarea
                      rows={2}
                      placeholder="Rincian kegiatan..."
                      value={keterangan}
                      onChange={(e) => setKeterangan(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddRundownModal(false)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 font-semibold text-white"
                    >
                      Simpan Sesi
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-MENU 3: CHECKIN GATE */}
      {currentSubMenu === 'checkin' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                Presensi & Gate Check-in Hari-H
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Koordinator: Novando (10) &bull; Anggota: Adi Nugroho (10), Rachel (14), Virda (11)
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-semibold">
              {participants.filter(p => p.statusKehadiran === 'akan_hadir').length} Terkonfirmasi Hadir
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama alumni atau angkatan untuk presensi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-850 text-xs text-white border border-slate-750 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-850 text-slate-300 border-b border-slate-800 text-[11px] uppercase">
                  <th className="py-3 px-4">Nama Alumni</th>
                  <th className="py-3 px-4">Angkatan & Jurusan</th>
                  <th className="py-3 px-4">Kontak</th>
                  <th className="py-3 px-4">Ukuran Kaos</th>
                  <th className="py-3 px-4">Status Kehadiran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredCheckin.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">{p.namaLengkap}</td>
                    <td className="py-3 px-4">Angkatan {p.angkatan} &bull; {p.jurusan}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{p.nomorKontak}</td>
                    <td className="py-3 px-4 font-semibold text-cyan-300">{p.ukuranKaos || 'L'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        p.statusKehadiran === 'akan_hadir'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {p.statusKehadiran === 'akan_hadir' ? 'Akan Hadir' : 'Ragu-ragu'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-MENU 4: LOGISTIK & PANGGUNG */}
      {currentSubMenu === 'logistik' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-purple-400" />
              Pos Perlengkapan, Venue & Vendor Panggung
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Koordinator: Eko Rahmanto (6) &bull; Anggota: M. Imdadur (7), Agus Wiyanto (4), Ali Gufron (14)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {acaraBudget.map((b) => (
              <div key={b.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                    {b.kodePos}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400">
                    Status: {b.statusApproval.toUpperCase()}
                  </span>
                </div>
                <h4 className="font-bold text-white">{b.divisi}</h4>
                <p className="text-slate-300">{b.uraian}</p>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-400 text-[11px]">
                  <span>Pagu: Rp {b.alokasiAnggaran.toLocaleString('id-ID')}</span>
                  <span className="text-cyan-300">Realisasi: Rp {b.realisasiTerpakai.toLocaleString('id-ID')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-MENU 5: KONSUMSI & CATERING */}
      {currentSubMenu === 'konsumsi' && (
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Coffee className="w-4 h-4 text-purple-400" />
              Pos Konsumsi & Catering Jamuan Pesisir
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Koordinator: Ayu Rihasni (9) &bull; Anggota: Virda (11), Rachel (14), Riva Rohadatul (15)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 text-[11px]">Alumni Terdaftar</span>
              <div className="text-xl font-bold text-white mt-1">{participants.length} Orang</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 text-[11px]">Keluarga / Pendamping</span>
              <div className="text-xl font-bold text-cyan-300 mt-1">+{totalPendamping} Orang</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 text-[11px]">Total Porsi Prasmanan</span>
              <div className="text-xl font-bold text-emerald-400 mt-1">{totalPorsiMakan} Porsi</div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MENU 6: SERAGAM & MERCHANDISE KAOS */}
      {currentSubMenu === 'seragam_merch' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shirt className="w-4 h-4 text-cyan-400" />
                Pos Seragam Kaos Polo Reuni & Goodie Bag
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Koordinator: Kharis M (8) &bull; Anggota: Sarizon (13), Ferly Primanasa (16), Zaiyin Sulaiman (7)
              </p>
            </div>
            <span className="text-xs text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800 font-semibold">
              Total: {participants.length} Kaos
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            {Object.entries(ukuranCounts).map(([size, count]) => (
              <div key={size} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-xs font-bold text-cyan-400">Ukuran {size}</div>
                <div className="text-2xl font-bold text-white mt-1">{count} pcs</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {participants.length > 0 ? Math.round((count / participants.length) * 100) : 0}% Alokasi
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-MENU 7: KEAMANAN & MEDIS */}
      {currentSubMenu === 'keamanan_medis' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              Pos Keamanan, Parkir & Posko Medis Darurat P3K
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Koordinator: Zaiyin Sulaiman (7) &bull; Anggota: Sarizon (13), Ferly Primanasa (16), Arief (6)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Rekayasa Kantong Parkir & Pamdal
              </h4>
              <p className="text-slate-300">
                Pemisahan jalur roda 4 di lapangan basket dan roda 2 di area dermaga praktik SUPMN. Akses satu pintu untuk sterilisasi alur penjemputan.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-400" />
                Posko Medis P3K & Ambulans Standby
              </h4>
              <p className="text-slate-300">
                Tenaga paramedis siaga dengan tabung oksigen portabel dan ambulans siaga darurat berkoordinasi langsung dengan RSUD Batin Mangunang Kotaagung.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MENU 8: SILATURAHMI GURU PURNABAKTI & TALI ASIH */}
      {currentSubMenu === 'temu_kangen' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Pos Silaturahmi Guru Purnabakti, Kesan-Pesan & Tali Asih
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Koordinator: Nadya Maulida (6) &bull; Anggota: Yogi Faisal (5), Imam Muddin (4), Ayu Rihasni (9)
              </p>
            </div>
            <span className="text-xs text-amber-300 bg-amber-950 px-2.5 py-1 rounded border border-amber-800 font-semibold">
              15 Guru & Instruktur Purnabakti
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Award className="w-4 h-4" />
                <span>Paket Plakat & Cinderamata</span>
              </div>
              <p className="text-slate-300">
                Plakat penghargaan cor kuningan lambang SUPMN Kotaagung dan paket tali asih uang kehormatan dari donasi lintas Angkatan 1–19.
              </p>
              <div className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/50 p-1.5 rounded border border-emerald-800/40">
                ✓ 15 Plakat dipesan melalui CV Grafika Bahari
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Users className="w-4 h-4" />
                <span>Layanan Antar-Jemput VIP</span>
              </div>
              <p className="text-slate-300">
                Armada mobil panitia khusus menjemput sesepuh guru sepuh dari wilayah Kotaagung, Gisting, dan Talang Padang ke kampus SUPMN.
              </p>
              <div className="text-[10px] text-cyan-400 font-semibold bg-cyan-950/50 p-1.5 rounded border border-cyan-800/40">
                ✓ 3 Unit Kendaraan Siaga PJ Imam Muddin (4)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <Heart className="w-4 h-4" />
                <span>Sesi Doa Bersama & Sungkeman</span>
              </div>
              <p className="text-slate-300">
                Prosesi khidmat testimoni perwakilan Angkatan 1 (perintis) hingga Angkatan 19 serta doa bersama mengenang pendidik yang telah berpulang.
              </p>
              <div className="text-[10px] text-rose-400 font-semibold bg-rose-950/50 p-1.5 rounded border border-rose-800/40">
                ✓ Durasi 45 Menit di Panggung Utama
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MENU 9: MUSIK BAHARI & WALL OF FAME */}
      {currentSubMenu === 'hiburan' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Music className="w-4 h-4 text-cyan-400" />
                Pos Musik Bahari, Kilas Balik Nostalgia & Wall of Fame
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Koordinator Musik: Ali Gufron (14) &bull; Koordinator Wall of Fame: Agus Wiyanto (4)
              </p>
            </div>
            <span className="text-xs text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800 font-semibold">
              Live Musik & Spot Kenangan
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                <Music className="w-4 h-4 text-cyan-400" />
                Live Band & Akustik Pelaut (Kompak Angkatan)
              </h4>
              <p className="text-slate-300">
                Pertunjukan musik akustik membawakan lagu mars SUPMN, lagu pop nostalgia 80-an, 90-an & 2000-an era asrama, serta kuis games interaktif antar angkatan berhadiah merchandise.
              </p>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[11px]">Rundown Panggung Hiburan:</div>
                <div className="text-slate-200">1. Sesi Santai Saat Jamuan Makan Siang (12:00 – 13:30)</div>
                <div className="text-slate-200">2. Lagu Kebersamaan Lintas Angkatan (15:00 – 16:30)</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                <Camera className="w-4 h-4 text-amber-400" />
                Photo Wall of Fame & Display Memorabilia Bahari
              </h4>
              <p className="text-slate-300">
                Lorong lorong nostalgia berisi arsip foto taruna/taruni angkatan 1 s/d 19, display helm selam, topi pet pesiar, jangkar, dan backdrop Instagramable almamater kampus SUPM.
              </p>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[11px]">Fasilitas Foto Onsite:</div>
                <div className="text-slate-200">✓ Fotografer stanby dengan QR Code download foto instan</div>
                <div className="text-slate-200">✓ Dinding tanda tangan reuni akbar kain kanvas 6 meter</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MENU 10: PLAN & PROGRESS DIVISI ACARA */}
      {currentSubMenu === 'plan_progress' && (
        <DivisionPlanProgressModule
          divisi="acara"
          tasks={tasks}
          onAddTask={onAddTask}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          currentUser={currentUser}
          users={users}
          title="Dashboard Plan & Progress Divisi Acara"
          subtitle="Pemantauan 10 Pos Scoop Tanggung Jawab (19 Anggota): Gladi upacara apel, rigging panggung, konsumsi pesisir, presensi gate, dan silaturahmi purnabakti."
        />
      )}
    </div>
  );
};
