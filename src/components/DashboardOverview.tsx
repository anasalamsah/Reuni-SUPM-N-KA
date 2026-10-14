import React, { useState } from 'react';
import { 
  Users, 
  Wallet, 
  PieChart, 
  ShieldCheck, 
  TrendingUp, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar,
  Building2,
  CheckCircle,
  Clock,
  Layers,
  Sparkles,
  FileText,
  Megaphone,
  Coffee,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { 
  Participant, 
  Contribution, 
  BudgetItem, 
  LedgerEntry, 
  AuditLog, 
  EventConfig, 
  DAFTAR_ANGKATAN, 
  AngkatanNumber, 
  MainMenuId,
  DivisionTask,
  UserSession,
  TaskDivision
} from '../types';
import { DivisionPlanProgressModule } from './DivisionPlanProgressModule';

interface DashboardOverviewProps {
  participants: Participant[];
  contributions: Contribution[];
  budgetItems: BudgetItem[];
  ledgerEntries: LedgerEntry[];
  auditLogs: AuditLog[];
  eventConfig: EventConfig;
  tasks: DivisionTask[];
  onAddTask: (task: Omit<DivisionTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateTask: (task: DivisionTask) => void;
  onDeleteTask: (id: string) => void;
  currentUser: UserSession;
  users: UserSession[];
  onNavigateToCohort: (angkatan: AngkatanNumber) => void;
  onNavigateTab: (tab: string) => void;
  onNavigateDivision: (division: MainMenuId) => void;
  onOpenAdminUsers?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  participants,
  contributions,
  budgetItems,
  ledgerEntries,
  auditLogs,
  eventConfig,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  currentUser,
  users,
  onNavigateToCohort,
  onNavigateTab,
  onNavigateDivision,
  onOpenAdminUsers
}) => {
  const [hoveredAkt, setHoveredAkt] = useState<number | null>(null);

  // Perhitungan Data & KPI
  const totalPeserta = participants.length;
  const pesertaTerverifikasi = participants.filter(p => p.statusVerifikasi === 'terverifikasi').length;
  const pesertaAkanHadir = participants.filter(p => p.statusKehadiran === 'akan_hadir').length;
  const pesertaRagu = participants.filter(p => p.statusKehadiran === 'ragu_ragu').length;
  const totalPendamping = participants.reduce((acc, p) => acc + (p.jumlahPendamping || 0), 0);
  const totalJiwa = totalPeserta + totalPendamping;

  const totalIuranTerkumpul = contributions
    .filter(c => c.statusVerifikasi === 'terverifikasi')
    .reduce((acc, c) => acc + c.nominal, 0);

  const totalPaguAnggaran = budgetItems
    .filter(b => b.statusApproval === 'disetujui')
    .reduce((acc, b) => acc + b.alokasiAnggaran, 0);

  const totalPengeluaranAktual = ledgerEntries
    .filter(l => l.tipe === 'pengeluaran')
    .reduce((acc, l) => acc + l.kredit, 0);

  const totalPemasukanLedger = ledgerEntries
    .filter(l => l.tipe === 'pemasukan')
    .reduce((acc, l) => acc + l.debit, 0);

  const saldoKasBerjalan = totalPemasukanLedger - totalPengeluaranAktual;

  // Format Rupiah
  const formatRp = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Data Statistik per Angkatan 1–19 untuk Grafik Batang
  const cohortData = DAFTAR_ANGKATAN.map((akt) => {
    const list = participants.filter(p => p.angkatan === akt);
    const sumIuran = contributions
      .filter(c => c.angkatan === akt && c.statusVerifikasi === 'terverifikasi')
      .reduce((s, c) => s + c.nominal, 0);

    return {
      angkatan: akt,
      pesertaCount: list.length,
      iuranTotal: sumIuran
    };
  });

  const maxPeserta = Math.max(...cohortData.map(c => c.pesertaCount), 4);

  // Jurusan SUPM Breakdown
  const jurusanData = [
    { name: 'NKN (Nautika)', count: participants.filter(p => p.jurusan === 'NKN').length, color: '#06b6d4' },
    { name: 'TKPI (Teknika)', count: participants.filter(p => p.jurusan === 'TKPI').length, color: '#3b82f6' },
    { name: 'TPHP (Pengolahan)', count: participants.filter(p => p.jurusan === 'TPHP').length, color: '#10b981' },
    { name: 'TPL (Budidaya)', count: participants.filter(p => p.jurusan === 'TPL').length, color: '#8b5cf6' },
    { name: 'Umum / Lainnya', count: participants.filter(p => p.jurusan === 'Umum/Lainnya').length, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-6">
      {/* Official Status Banner with Glassmorphism */}
      <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-cyan-950 border border-cyan-800/40 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-950 text-cyan-300 border border-cyan-700/60 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                Live Command Center
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Almamater SUPM Negeri Kotaagung
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Reuni Akbar SUPM N Kotaagung Angkatan 1–19
            </h2>
            <div className="text-xs text-slate-300 flex items-center gap-2 flex-wrap">
              <span>Tanggal: <strong className="text-amber-300">[{eventConfig.tanggalPelaksanaan}]</strong></span>
              <span>&bull;</span>
              <span>Rekening: <strong className="text-cyan-300">[{eventConfig.statusRekeningResmi}]</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {onOpenAdminUsers && (
              <button
                onClick={onOpenAdminUsers}
                className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-xs font-bold text-amber-300 border border-amber-600/50 shadow-lg shadow-amber-950/30 flex items-center gap-1.5 transition"
                title="Kelola Nama, Jabatan, dan No HP Panitia"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Kelola Panitia (Admin)</span>
              </button>
            )}
            <button
              onClick={() => onNavigateDivision('sekretaris')}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-lg shadow-cyan-950/40 flex items-center gap-1.5 transition"
            >
              <span>+ Pendaftaran Alumni</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Kartu KPI Utama dengan Visual Glow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Peserta Terdaftar */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-800/60 transition shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Alumni Terdaftar</span>
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/60">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{totalPeserta}</span>
            <span className="text-xs text-slate-400">alumni</span>
          </div>
          <div className="mt-2 text-xs flex items-center justify-between text-slate-400">
            <span className="text-emerald-400 font-medium">{pesertaAkanHadir} konfirmasi hadir</span>
            <span>+{totalPendamping} pendamping</span>
          </div>
          <div className="mt-2 w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (pesertaTerverifikasi / Math.max(1, totalPeserta)) * 100)}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Total Iuran Terkumpul */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-800/60 transition shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Kontribusi Terverifikasi</span>
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-emerald-400 tracking-tight">
              {formatRp(totalIuranTerkumpul)}
            </span>
          </div>
          <div className="mt-2 text-xs flex items-center justify-between text-slate-400">
            <span>Kas Masuk Resmi</span>
            <button 
              onClick={() => onNavigateDivision('keuangan')}
              className="text-emerald-400 hover:underline text-[11px]"
            >
              Buku Kas &rarr;
            </button>
          </div>
          <div className="mt-2 w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full w-full" />
          </div>
        </div>

        {/* KPI 3: Saldo Kas Berjalan */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-800/60 transition shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Saldo Kas Berjalan</span>
            <div className="p-2 rounded-xl bg-blue-950 text-blue-400 border border-blue-800/60">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-cyan-300 tracking-tight">
              {formatRp(saldoKasBerjalan)}
            </span>
          </div>
          <div className="mt-2 text-xs flex items-center justify-between text-slate-400">
            <span>Masuk: {formatRp(totalPemasukanLedger)}</span>
            <span className="text-rose-400">Keluar: {formatRp(totalPengeluaranAktual)}</span>
          </div>
          <div className="mt-2 w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-cyan-400 rounded-full w-3/4" />
          </div>
        </div>

        {/* KPI 4: RAPB Disetujui */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-800/60 transition shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Pagu RAPB Disetujui</span>
            <div className="p-2 rounded-xl bg-purple-950 text-purple-400 border border-purple-800/60">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-purple-300 tracking-tight">
              {formatRp(totalPaguAnggaran)}
            </span>
          </div>
          <div className="mt-2 text-xs flex items-center justify-between text-slate-400">
            <span>Realisasi: {formatRp(totalPengeluaranAktual)}</span>
            <span className="text-purple-300 font-semibold">
              {totalPaguAnggaran > 0 ? Math.round((totalPengeluaranAktual / totalPaguAnggaran) * 100) : 0}% Terpakai
            </span>
          </div>
          <div className="mt-2 w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-purple-400 rounded-full"
              style={{ width: `${totalPaguAnggaran > 0 ? Math.min(100, Math.round((totalPengeluaranAktual / totalPaguAnggaran) * 100)) : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4 Tombol Pintu Masuk Divisi (Sub-Menu Shortcuts) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Akses Cepat 4 Divisi Resmi Panitia Pelaksana
          </h3>
          <span className="text-[11px] text-cyan-400">Klik divisi untuk membuka sub-menu</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Divisi 1: Sekretaris */}
          <button
            onClick={() => onNavigateDivision('sekretaris')}
            className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-sky-500/50 text-left transition shadow group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-sky-950 text-sky-400 border border-sky-800/60">
                  <FileText className="w-4 h-4" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition" />
              </div>
              <h4 className="font-bold text-white text-sm mt-3">Divisi Sekretaris</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Database alumni, rekap kohort 1–19, surat keputusan & perizinan kampus.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-sky-400 font-medium">
              <span>{totalPeserta} Alumni Terdaftar</span>
              <span>Buka &rarr;</span>
            </div>
          </button>

          {/* Divisi 2: Keuangan */}
          <button
            onClick={() => onNavigateDivision('keuangan')}
            className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 text-left transition shadow group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                  <Wallet className="w-4 h-4" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition" />
              </div>
              <h4 className="font-bold text-white text-sm mt-3">Divisi Keuangan</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Iuran angkatan, buku kas double-entry, RAPB persetujuan, rekonsiliasi bank.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-emerald-400 font-medium">
              <span>Saldo: {formatRp(saldoKasBerjalan)}</span>
              <span>Buka &rarr;</span>
            </div>
          </button>

          {/* Divisi 3: Acara */}
          <button
            onClick={() => onNavigateDivision('acara')}
            className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/50 text-left transition shadow group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-purple-950 text-purple-400 border border-purple-800/60">
                  <Calendar className="w-4 h-4" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition" />
              </div>
              <h4 className="font-bold text-white text-sm mt-3">Divisi Acara</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Rundown pleno, presensi check-in, vendor panggung & rekap konsumsi/kaos.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-purple-400 font-medium">
              <span>{pesertaAkanHadir} Konfirmasi Hadir</span>
              <span>Buka &rarr;</span>
            </div>
          </button>

          {/* Divisi 4: Publikasi */}
          <button
            onClick={() => onNavigateDivision('publikasi')}
            className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/50 text-left transition shadow group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-teal-950 text-teal-400 border border-teal-800/60">
                  <Megaphone className="w-4 h-4" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition" />
              </div>
              <h4 className="font-bold text-white text-sm mt-3">Divisi Publikasi</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Hub koordinator 19 angkatan, broadcast siaran WA, materi promosi & FAQ.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-teal-400 font-medium">
              <span>19 Korlap Terhubung</span>
              <span>Buka &rarr;</span>
            </div>
          </button>
        </div>
      </div>

      {/* EXECUTIVE PLAN & PROGRESS DASHBOARD (OVERALL DIVISI) */}
      <div className="pt-1">
        <DivisionPlanProgressModule
          divisi="all"
          tasks={tasks}
          onAddTask={onAddTask}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          currentUser={currentUser}
          users={users}
          title="Roadmap, Plan & Progress Eksekutif (Semua Divisi)"
          subtitle="Pemantauan target realisasi 4 divisi: Sekretariat, Keuangan, Acara (10 Pos Scoop), dan Komunikasi Eksternal & Publikasi."
          showDivisionTabs={true}
          onNavigateDivision={(d) => onNavigateDivision(d as MainMenuId)}
        />
      </div>

      {/* Visual Chart 1: Grafik Batang Partisipasi Angkatan 1 s/d 19 */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                Grafik Distribusi Pendaftaran Kohort Angkatan 1 s/d 19
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Jumlah alumni terdaftar di masing-masing angkatan (arahkan kursor untuk melihat rincian iuran)
            </p>
          </div>
          <button
            onClick={() => onNavigateDivision('sekretaris')}
            className="text-xs text-cyan-400 hover:underline"
          >
            Buka Matriks Angkatan Lengkap &rarr;
          </button>
        </div>

        {/* Visual Bar Chart SVG Container */}
        <div className="relative pt-4 pb-2">
          <div className="h-48 flex items-end justify-between gap-1 sm:gap-2 px-2 border-b border-slate-800">
            {cohortData.map((item) => {
              const heightPercent = Math.max(8, (item.pesertaCount / maxPeserta) * 100);
              const isHovered = hoveredAkt === item.angkatan;

              return (
                <div 
                  key={item.angkatan}
                  onMouseEnter={() => setHoveredAkt(item.angkatan)}
                  onMouseLeave={() => setHoveredAkt(null)}
                  onClick={() => onNavigateToCohort(item.angkatan as AngkatanNumber)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                >
                  {/* Tooltip on Hover */}
                  {isHovered && (
                    <div className="absolute -top-14 z-30 bg-slate-950 border border-cyan-500/60 px-2.5 py-1.5 rounded-lg shadow-xl text-center whitespace-nowrap pointer-events-none">
                      <div className="text-[10px] font-bold text-cyan-300">Angkatan {item.angkatan}</div>
                      <div className="text-[11px] text-white font-semibold">{item.pesertaCount} Alumni</div>
                      <div className="text-[9px] text-emerald-400">{formatRp(item.iuranTotal)}</div>
                    </div>
                  )}

                  {/* Count indicator above bar */}
                  <span className={`text-[10px] font-bold mb-1 transition ${
                    item.pesertaCount > 0 ? 'text-cyan-300' : 'text-slate-600'
                  }`}>
                    {item.pesertaCount}
                  </span>

                  {/* The Graphic Bar */}
                  <div 
                    className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 ${
                      item.pesertaCount > 0
                        ? isHovered
                          ? 'bg-gradient-to-t from-cyan-600 to-cyan-300 shadow-lg shadow-cyan-500/40'
                          : 'bg-gradient-to-t from-cyan-700 via-cyan-600 to-cyan-400'
                        : 'bg-slate-800/60 hover:bg-slate-800'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />

                  {/* Label X-Axis */}
                  <div className={`mt-2 text-[10px] font-semibold transition ${
                    isHovered ? 'text-cyan-300 font-bold scale-110' : 'text-slate-400'
                  }`}>
                    Akt {item.angkatan}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Columns: Program Keahlian SUPM & Arus Kas Realtime */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kolom 1: Distribusi Program Keahlian / Jurusan SUPM */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-cyan-400" />
              Komposisi Jurusan / Keahlian SUPM
            </h3>
            <span className="text-xs text-slate-400">{totalPeserta} Terdata</span>
          </div>

          <div className="space-y-3">
            {jurusanData.map((j) => {
              const pct = totalPeserta > 0 ? Math.round((j.count / totalPeserta) * 100) : 0;
              return (
                <div key={j.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{j.name}</span>
                    <span className="text-slate-400 font-mono">{j.count} orang ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: j.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kolom 2: Rekapitulasi Alokasi Pagu RAPB per Divisi */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-400" />
              Alokasi Pagu RAPB Panitia per Pos
            </h3>
            <button
              onClick={() => onNavigateDivision('keuangan')}
              className="text-xs text-purple-400 hover:underline"
            >
              Lihat Detail &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {budgetItems.slice(0, 4).map((b) => {
              const persentase = b.alokasiAnggaran > 0 
                ? Math.min(100, Math.round((b.realisasiTerpakai / b.alokasiAnggaran) * 100))
                : 0;

              return (
                <div key={b.id} className="p-3 rounded-xl bg-slate-850 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{b.divisi}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                      {b.statusApproval.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Pagu: {formatRp(b.alokasiAnggaran)}</span>
                    <span className="text-cyan-300">Realisasi: {formatRp(b.realisasiTerpakai)} ({persentase}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-purple-400 transition-all"
                      style={{ width: `${persentase}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
