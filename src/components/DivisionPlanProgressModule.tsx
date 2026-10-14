import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  AlertCircle, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Target, 
  FileText, 
  Edit3, 
  Trash2, 
  Database, 
  ChevronRight, 
  TrendingUp, 
  Sliders, 
  Check, 
  X, 
  BarChart2, 
  Layers,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { 
  DivisionTask, 
  TaskDivision, 
  TaskPriority, 
  TaskStatus, 
  UserSession 
} from '../types';

interface DivisionPlanProgressModuleProps {
  divisi: TaskDivision | 'all';
  tasks: DivisionTask[];
  onAddTask: (task: Omit<DivisionTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateTask: (task: DivisionTask) => void;
  onDeleteTask: (id: string) => void;
  currentUser: UserSession;
  users: UserSession[];
  title?: string;
  subtitle?: string;
  showDivisionTabs?: boolean;
  onNavigateDivision?: (div: TaskDivision) => void;
}

export const DivisionPlanProgressModule: React.FC<DivisionPlanProgressModuleProps> = ({
  divisi,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  currentUser,
  users,
  title,
  subtitle,
  showDivisionTabs = false,
  onNavigateDivision
}) => {
  // Filters & State
  const [selectedDivisiTab, setSelectedDivisiTab] = useState<TaskDivision | 'all'>(divisi);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<DivisionTask | null>(null);

  // Form State
  const [formDivisi, setFormDivisi] = useState<TaskDivision>(divisi === 'all' ? 'sekretaris' : divisi);
  const [formJudul, setFormJudul] = useState('');
  const [formDeskripsi, setFormDeskripsi] = useState('');
  const [formPic, setFormPic] = useState('');
  const [formTargetSelesai, setFormTargetSelesai] = useState('');
  const [formPrioritas, setFormPrioritas] = useState<TaskPriority>('sedang');
  const [formStatus, setFormStatus] = useState<TaskStatus>('dalam_proses');
  const [formProgresPersen, setFormProgresPersen] = useState<number>(0);
  const [formKategori, setFormKategori] = useState('');
  const [formOutputDeliverable, setFormOutputDeliverable] = useState('');
  const [formCatatanUpdate, setFormCatatanUpdate] = useState('');
  const [formAnggaranEstimasi, setFormAnggaranEstimasi] = useState<number | ''>('');

  // Active Division for filtering
  const activeDivisi = divisi === 'all' ? selectedDivisiTab : divisi;

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      // Division filter
      if (activeDivisi !== 'all' && t.divisi !== activeDivisi) return false;
      // Status filter
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      // Priority filter
      if (priorityFilter !== 'all' && t.prioritas !== priorityFilter) return false;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.judul.toLowerCase().includes(q);
        const matchPic = t.pic.toLowerCase().includes(q);
        const matchKat = t.kategori.toLowerCase().includes(q);
        const matchDesc = t.deskripsi.toLowerCase().includes(q);
        if (!matchTitle && !matchPic && !matchKat && !matchDesc) return false;
      }
      return true;
    });
  }, [tasks, activeDivisi, statusFilter, priorityFilter, searchQuery]);

  // Overall statistics for current scope
  const scopedTasks = useMemo(() => {
    return activeDivisi === 'all' ? tasks : tasks.filter(t => t.divisi === activeDivisi);
  }, [tasks, activeDivisi]);

  const stats = useMemo(() => {
    const total = scopedTasks.length;
    const selesai = scopedTasks.filter(t => t.status === 'selesai').length;
    const dalamProses = scopedTasks.filter(t => t.status === 'dalam_proses').length;
    const belumMulai = scopedTasks.filter(t => t.status === 'belum_mulai').length;
    const terkendala = scopedTasks.filter(t => t.status === 'terkendala').length;
    
    // Average weighted or linear progress percentage
    const avgProgress = total > 0 
      ? Math.round(scopedTasks.reduce((acc, t) => acc + (t.progresPersen || 0), 0) / total) 
      : 0;

    return { total, selesai, dalamProses, belumMulai, terkendala, avgProgress };
  }, [scopedTasks]);

  // Division-specific breakdown (when in 'all' view)
  const divisionBreakdowns = useMemo(() => {
    const divs: { id: TaskDivision; label: string; color: string; bg: string }[] = [
      { id: 'sekretaris', label: 'Sekretariat', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
      { id: 'keuangan', label: 'Keuangan', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
      { id: 'acara', label: 'Acara (10 Scoop)', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
      { id: 'publikasi', label: 'Publikasi & Korlap', color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/30' },
    ];

    return divs.map(d => {
      const dTasks = tasks.filter(t => t.divisi === d.id);
      const total = dTasks.length;
      const selesai = dTasks.filter(t => t.status === 'selesai').length;
      const progress = total > 0 
        ? Math.round(dTasks.reduce((acc, t) => acc + (t.progresPersen || 0), 0) / total) 
        : 0;
      return { ...d, total, selesai, progress };
    });
  }, [tasks]);

  const openAddModal = (targetDiv?: TaskDivision) => {
    setEditingTask(null);
    setFormDivisi(targetDiv || (activeDivisi === 'all' ? 'sekretaris' : activeDivisi));
    setFormJudul('');
    setFormDeskripsi('');
    setFormPic(currentUser.name || '');
    setFormTargetSelesai(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
    setFormPrioritas('sedang');
    setFormStatus('dalam_proses');
    setFormProgresPersen(0);
    setFormKategori('');
    setFormOutputDeliverable('');
    setFormCatatanUpdate('');
    setFormAnggaranEstimasi('');
    setIsModalOpen(true);
  };

  const openEditModal = (task: DivisionTask) => {
    setEditingTask(task);
    setFormDivisi(task.divisi);
    setFormJudul(task.judul);
    setFormDeskripsi(task.deskripsi);
    setFormPic(task.pic);
    setFormTargetSelesai(task.targetSelesai);
    setFormPrioritas(task.prioritas);
    setFormStatus(task.status);
    setFormProgresPersen(task.progresPersen);
    setFormKategori(task.kategori);
    setFormOutputDeliverable(task.outputDeliverable);
    setFormCatatanUpdate(task.catatanUpdate || '');
    setFormAnggaranEstimasi(task.anggaranEstimasi ?? '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul.trim() || !formPic.trim()) return;

    if (editingTask) {
      const updated: DivisionTask = {
        ...editingTask,
        divisi: formDivisi,
        judul: formJudul.trim(),
        deskripsi: formDeskripsi.trim(),
        pic: formPic.trim(),
        targetSelesai: formTargetSelesai || editingTask.targetSelesai,
        prioritas: formPrioritas,
        status: formProgresPersen === 100 ? 'selesai' : formStatus,
        progresPersen: Number(formProgresPersen),
        kategori: formKategori.trim() || 'Umum',
        outputDeliverable: formOutputDeliverable.trim() || '-',
        anggaranEstimasi: formAnggaranEstimasi === '' ? undefined : Number(formAnggaranEstimasi),
        catatanUpdate: formCatatanUpdate.trim(),
        updatedAt: new Date().toISOString()
      };
      onUpdateTask(updated);
    } else {
      const newTask: Omit<DivisionTask, 'id' | 'createdAt' | 'updatedAt'> = {
        divisi: formDivisi,
        judul: formJudul.trim(),
        deskripsi: formDeskripsi.trim(),
        pic: formPic.trim(),
        targetSelesai: formTargetSelesai || new Date().toISOString().split('T')[0],
        prioritas: formPrioritas,
        status: formProgresPersen === 100 ? 'selesai' : formStatus,
        progresPersen: Number(formProgresPersen),
        kategori: formKategori.trim() || 'Umum',
        outputDeliverable: formOutputDeliverable.trim() || '-',
        anggaranEstimasi: formAnggaranEstimasi === '' ? undefined : Number(formAnggaranEstimasi),
        catatanUpdate: formCatatanUpdate.trim()
      };
      onAddTask(newTask);
    }
    setIsModalOpen(false);
  };

  const handleQuickProgressUpdate = (task: DivisionTask, newPercent: number) => {
    const newStatus: TaskStatus = newPercent >= 100 ? 'selesai' : (newPercent > 0 ? 'dalam_proses' : 'belum_mulai');
    const updated: DivisionTask = {
      ...task,
      progresPersen: Math.min(100, Math.max(0, newPercent)),
      status: newStatus,
      updatedAt: new Date().toISOString()
    };
    onUpdateTask(updated);
  };

  const getDivisionBadge = (div: TaskDivision) => {
    switch (div) {
      case 'sekretaris':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">Sekretariat</span>;
      case 'keuangan':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Keuangan</span>;
      case 'acara':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">Acara</span>;
      case 'publikasi':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">Publikasi & Korlap</span>;
    }
  };

  const getPriorityBadge = (pri: TaskPriority) => {
    switch (pri) {
      case 'mendesak':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse"><AlertTriangle className="w-2.5 h-2.5" /> Mendesak</span>;
      case 'tinggi':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">Tinggi</span>;
      case 'sedang':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">Sedang</span>;
      case 'rendah':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-700/60 text-slate-300 border border-slate-600">Rendah</span>;
    }
  };

  const getStatusBadge = (st: TaskStatus) => {
    switch (st) {
      case 'selesai':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Selesai</span>;
      case 'dalam_proses':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40"><Clock className="w-3 h-3 text-blue-400" /> Dalam Proses</span>;
      case 'terkendala':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/40"><AlertCircle className="w-3 h-3 text-red-400" /> Terkendala</span>;
      case 'belum_mulai':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">Belum Mulai</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-700/70 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <TrendingUp className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-wide">
                {title || (divisi === 'all' ? 'Dashboard Plan & Progress Terpadu Seluruh Divisi' : `Dashboard Plan & Progress Divisi ${divisi.toUpperCase()}`)}
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl">
              {subtitle || 'Pemantauan real-time rencana kerja, deliverable, penanggung jawab (PIC), dan progress pencapaian target Reuni Akbar SUPM N Kotaagung.'}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => openAddModal()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Input Task / Rencana Baru</span>
            </button>
          </div>
        </div>

        {/* Database Persistence Banner Indicator */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium">Data Tersimpan Aman:</span>
            <span className="text-slate-300">Semua progress &amp; task tersinkronisasi otomatis di storage lokal &amp; database sistem (tidak akan hilang saat refresh).</span>
          </div>
          <span className="text-slate-400">
            Terakhir diperbarui: <span className="text-slate-200">{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
          </span>
        </div>
      </div>

      {/* KPI & Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Progress % */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 font-medium">Tingkat Capaian</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-cyan-400">{stats.avgProgress}%</span>
            <span className="text-[11px] text-slate-400">Target 100%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${stats.avgProgress}%` }}
            />
          </div>
        </div>

        {/* Total Tasks */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 font-medium">Total Rencana Task</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-white">{stats.total}</span>
            <span className="text-[11px] text-slate-400">item kerja</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-2">Tersebar di {divisi === 'all' ? '4 divisi' : `divisi ${divisi}`}</span>
        </div>

        {/* Selesai */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 flex flex-col justify-between">
          <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Selesai (100%)
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-emerald-300">{stats.selesai}</span>
            <span className="text-[11px] text-emerald-400/70">
              {stats.total > 0 ? Math.round((stats.selesai / stats.total) * 100) : 0}%
            </span>
          </div>
          <span className="text-[10px] text-emerald-400/60 mt-2">Tervalidasi tuntas</span>
        </div>

        {/* Dalam Proses */}
        <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-800/40 flex flex-col justify-between">
          <span className="text-[11px] text-blue-400 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-400" /> Sedang Berjalan
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-blue-300">{stats.dalamProses}</span>
            <span className="text-[11px] text-blue-400/70">
              {stats.total > 0 ? Math.round((stats.dalamProses / stats.total) * 100) : 0}%
            </span>
          </div>
          <span className="text-[10px] text-blue-400/60 mt-2">Dalam eksekusi PIC</span>
        </div>

        {/* Belum Mulai */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 font-medium">Belum Dimulai</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-slate-300">{stats.belumMulai}</span>
            <span className="text-[11px] text-slate-400">
              {stats.total > 0 ? Math.round((stats.belumMulai / stats.total) * 100) : 0}%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-2">Menunggu jadwal</span>
        </div>

        {/* Terkendala */}
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 flex flex-col justify-between">
          <span className="text-[11px] text-rose-400 font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-rose-400" /> Terkendala
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-rose-300">{stats.terkendala}</span>
            <span className="text-[11px] text-rose-400/70">
              {stats.total > 0 ? Math.round((stats.terkendala / stats.total) * 100) : 0}%
            </span>
          </div>
          <span className="text-[10px] text-rose-400/60 mt-2">Perlu perhatian</span>
        </div>
      </div>

      {/* Division Comparison Breakdown (shown when in 'all' view or showDivisionTabs is true) */}
      {divisi === 'all' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {divisionBreakdowns.map((d) => (
            <div 
              key={d.id}
              onClick={() => {
                setSelectedDivisiTab(selectedDivisiTab === d.id ? 'all' : d.id);
                if (onNavigateDivision && selectedDivisiTab === d.id) {
                  onNavigateDivision(d.id);
                }
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedDivisiTab === d.id 
                  ? 'bg-slate-800 border-cyan-500 ring-1 ring-cyan-500' 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold ${d.color}`}>{d.label}</span>
                <span className="text-xs font-bold text-white">{d.progress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-2">
                <div 
                  className={`h-1.5 rounded-full ${
                    d.id === 'sekretaris' ? 'bg-blue-500' :
                    d.id === 'keuangan' ? 'bg-emerald-500' :
                    d.id === 'acara' ? 'bg-purple-500' : 'bg-teal-500'
                  }`}
                  style={{ width: `${d.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{d.selesai} dari {d.total} task selesai</span>
                <span className="text-cyan-400 text-[10px] hover:underline flex items-center gap-0.5">
                  {selectedDivisiTab === d.id ? 'Filter Aktif' : 'Pilih'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Cari rencana task, PIC, milestone, deliverable..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Division Tabs (if in 'all' view) */}
          {divisi === 'all' && (
            <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setSelectedDivisiTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedDivisiTab === 'all'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Semua Divisi
              </button>
              <button
                onClick={() => setSelectedDivisiTab('sekretaris')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedDivisiTab === 'sekretaris'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Sekretariat
              </button>
              <button
                onClick={() => setSelectedDivisiTab('keuangan')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedDivisiTab === 'keuangan'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Keuangan
              </button>
              <button
                onClick={() => setSelectedDivisiTab('acara')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedDivisiTab === 'acara'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Acara
              </button>
              <button
                onClick={() => setSelectedDivisiTab('publikasi')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedDivisiTab === 'publikasi'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Publikasi
              </button>
            </div>
          )}

          {/* Status & Priority Filter */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Semua Status</option>
              <option value="belum_mulai">Belum Mulai</option>
              <option value="dalam_proses">Dalam Proses</option>
              <option value="selesai">Selesai</option>
              <option value="terkendala">Terkendala</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'all')}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Semua Prioritas</option>
              <option value="mendesak">Mendesak</option>
              <option value="tinggi">Tinggi</option>
              <option value="sedang">Sedang</option>
              <option value="rendah">Rendah</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List / Cards */}
      {filteredTasks.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800">
          <Clock className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-300">Tidak ada task yang cocok dengan kriteria filter</h4>
          <p className="text-xs text-slate-500 mt-1">Coba sesuaikan pencarian atau input rencana baru.</p>
          <button
            onClick={() => openAddModal()}
            className="mt-4 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors"
          >
            + Input Task Baru
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'selesai' || task.progresPersen === 100;

            return (
              <div 
                key={task.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCompleted 
                    ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' 
                    : task.status === 'terkendala'
                    ? 'bg-red-950/10 border-red-900/40 hover:border-red-800/60'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-md'
                }`}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  {/* Left: Info & Badges */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {getDivisionBadge(task.divisi)}
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {task.kategori}
                      </span>
                      {getPriorityBadge(task.prioritas)}
                      {getStatusBadge(task.status)}
                    </div>

                    <h3 className={`text-sm font-bold ${isCompleted ? 'text-slate-300 line-through' : 'text-white'}`}>
                      {task.judul}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      {task.deskripsi}
                    </p>

                    {/* Deliverable & Output */}
                    {task.outputDeliverable && (
                      <div className="text-[11px] text-cyan-300/90 flex items-start gap-1 pt-0.5">
                        <Target className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span><strong className="text-cyan-200">Target Output:</strong> {task.outputDeliverable}</span>
                      </div>
                    )}

                    {/* Progress Update Notes if any */}
                    {task.catatanUpdate && (
                      <div className="text-[11px] text-slate-400 italic bg-slate-950/60 p-1.5 rounded border border-slate-800/60">
                        Update Progres: &quot;{task.catatanUpdate}&quot;
                      </div>
                    )}
                  </div>

                  {/* Right: PIC, Deadline, Progress & Action Controls */}
                  <div className="w-full md:w-72 shrink-0 flex flex-col justify-between items-start md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                    {/* PIC & Deadline Info */}
                    <div className="flex items-center justify-between md:justify-end gap-3 w-full text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-slate-300">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <strong>{task.pic}</strong>
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Target: {task.targetSelesai}</span>
                      </span>
                    </div>

                    {/* Progress Slider / Bar with Percentage */}
                    <div className="w-full space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 text-[11px]">Progres Pelaksanaan</span>
                        <span className="font-bold text-cyan-400">{task.progresPersen}%</span>
                      </div>
                      
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            isCompleted ? 'bg-emerald-500' :
                            task.status === 'terkendala' ? 'bg-red-500' :
                            'bg-gradient-to-r from-cyan-500 to-blue-500'
                          }`}
                          style={{ width: `${task.progresPersen}%` }}
                        />
                      </div>

                      {/* Quick progress increment buttons */}
                      <div className="flex items-center justify-between gap-1 pt-1">
                        <button
                          type="button"
                          onClick={() => handleQuickProgressUpdate(task, task.progresPersen + 10)}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Tambah progres +10%"
                        >
                          +10%
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickProgressUpdate(task, task.progresPersen + 25)}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Tambah progres +25%"
                        >
                          +25%
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickProgressUpdate(task, 100)}
                          className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/40 transition-colors flex items-center gap-0.5"
                          title="Tandai selesai 100%"
                        >
                          <Check className="w-2.5 h-2.5" /> Set 100%
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons: Edit & Delete */}
                    <div className="flex items-center gap-1.5 w-full justify-end pt-1">
                      <button
                        onClick={() => openEditModal(task)}
                        className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3 text-cyan-400" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus task "${task.judul}"? Progress yang telah dicatat akan dihapus.`)) {
                            onDeleteTask(task.id);
                          }
                        }}
                        className="px-2 py-1 rounded-lg text-xs bg-slate-800/60 hover:bg-red-950/60 text-slate-400 hover:text-red-300 transition-colors"
                        title="Hapus Task"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Input / Edit Task Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-750 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Sliders className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-white text-base">
                  {editingTask ? 'Edit Rencana & Progres Task' : 'Input Task / Rencana Kerja Baru'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              {/* Row 1: Divisi & Kategori */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Divisi Pelaksana *
                  </label>
                  <select
                    value={formDivisi}
                    onChange={(e) => setFormDivisi(e.target.value as TaskDivision)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
                    required
                  >
                    <option value="sekretaris">Divisi Sekretariat</option>
                    <option value="keuangan">Divisi Keuangan</option>
                    <option value="acara">Divisi Acara (10 Pos Scoop)</option>
                    <option value="publikasi">Divisi Komunikasi Eksternal &amp; Publikasi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Kategori / Milestone *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Rundown, Logistik, Panggung, Iuran..."
                    value={formKategori}
                    onChange={(e) => setFormKategori(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              {/* Judul Task */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Judul Rencana Kerja / Task *
                </label>
                <input
                  type="text"
                  placeholder="Deskripsikan nama rencana kerja secara ringkas dan spesifik..."
                  value={formJudul}
                  onChange={(e) => setFormJudul(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Deskripsi Pelaksanaan
                </label>
                <textarea
                  rows={2}
                  placeholder="Langkah-langkah operasional yang akan dijalankan..."
                  value={formDeskripsi}
                  onChange={(e) => setFormDeskripsi(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              {/* Row 2: PIC & Target Selesai */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Penanggung Jawab (PIC) *
                  </label>
                  <div className="space-y-1">
                    <input
                      type="text"
                      list="userSuggestions"
                      placeholder="Nama PIC (contoh: Anas Rosyid, Romi Handoko...)"
                      value={formPic}
                      onChange={(e) => setFormPic(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      required
                    />
                    <datalist id="userSuggestions">
                      {users.map((u) => (
                        <option key={u.id} value={u.name}>
                          {u.jabatanLabel} ({u.divisi})
                        </option>
                      ))}
                    </datalist>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Target Tanggal Selesai (Deadline) *
                  </label>
                  <input
                    type="date"
                    value={formTargetSelesai}
                    onChange={(e) => setFormTargetSelesai(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              {/* Row 3: Prioritas & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Tingkat Prioritas *
                  </label>
                  <select
                    value={formPrioritas}
                    onChange={(e) => setFormPrioritas(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="mendesak">Mendesak (Prioritas Utama)</option>
                    <option value="tinggi">Tinggi (Krusial)</option>
                    <option value="sedang">Sedang (Standar)</option>
                    <option value="rendah">Rendah (Fleksibel)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Status Eksekusi *
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => {
                      const newSt = e.target.value as TaskStatus;
                      setFormStatus(newSt);
                      if (newSt === 'selesai' && formProgresPersen < 100) {
                        setFormProgresPersen(100);
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="belum_mulai">Belum Mulai (0%)</option>
                    <option value="dalam_proses">Dalam Proses</option>
                    <option value="selesai">Selesai (100%)</option>
                    <option value="terkendala">Terkendala (Ada Hambatan)</option>
                  </select>
                </div>
              </div>

              {/* Progres Slider (0 - 100%) */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-200 font-semibold">
                    Persentase Capaian Progres
                  </label>
                  <span className="text-base font-bold text-cyan-400">
                    {formProgresPersen}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formProgresPersen}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFormProgresPersen(val);
                    if (val === 100) setFormStatus('selesai');
                    else if (val > 0 && formStatus === 'belum_mulai') setFormStatus('dalam_proses');
                  }}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0% (Mulai)</span>
                  <span>25%</span>
                  <span>50% (Separuh)</span>
                  <span>75%</span>
                  <span>100% (Tuntas)</span>
                </div>
              </div>

              {/* Output Deliverable & Catatan */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Target Output / Deliverable yang Diharapkan *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Dokumen SK tercetak, Kontrak panggung disepakati, 500 porsi catering siap..."
                  value={formOutputDeliverable}
                  onChange={(e) => setFormOutputDeliverable(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Catatan Progres / Log Hambatan Terkini
                </label>
                <textarea
                  rows={2}
                  placeholder="Tambahkan catatan realisasi atau kendala terbaru yang dihadapi di lapangan..."
                  value={formCatatanUpdate}
                  onChange={(e) => setFormCatatanUpdate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-600/20 transition-all cursor-pointer"
                >
                  {editingTask ? 'Simpan Pembaruan' : 'Simpan Task Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
