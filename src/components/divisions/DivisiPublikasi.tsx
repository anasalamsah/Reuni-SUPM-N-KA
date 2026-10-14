import React, { useState } from 'react';
import { 
  Megaphone, 
  Share2, 
  Copy, 
  Check, 
  MessageSquare, 
  Image, 
  HelpCircle, 
  Search, 
  Users, 
  Phone,
  FileCheck,
  TrendingUp
} from 'lucide-react';
import { 
  KoordinatorAngkatan, 
  BroadcastTemplate, 
  SubMenuPublikasi, 
  UserSession, 
  EventConfig,
  DivisionTask 
} from '../../types';
import { DivisionPlanProgressModule } from '../DivisionPlanProgressModule';

interface DivisiPublikasiProps {
  currentSubMenu: SubMenuPublikasi;
  onSelectSubMenu: (sub: SubMenuPublikasi) => void;
  koordinatorList: KoordinatorAngkatan[];
  broadcastTemplates: BroadcastTemplate[];
  eventConfig: EventConfig;
  currentUser: UserSession;
  tasks: DivisionTask[];
  onAddTask: (task: Omit<DivisionTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateTask: (task: DivisionTask) => void;
  onDeleteTask: (id: string) => void;
  users: UserSession[];
}

export const DivisiPublikasi: React.FC<DivisiPublikasiProps> = ({
  currentSubMenu,
  onSelectSubMenu,
  koordinatorList,
  broadcastTemplates,
  eventConfig,
  currentUser,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  users
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const subMenus = [
    { id: 'plan_progress' as SubMenuPublikasi, label: 'Plan & Progress', icon: TrendingUp, desc: 'Pantau Task Publikasi' },
    { id: 'koordinator' as SubMenuPublikasi, label: 'Korlap Angkatan 1–19', icon: Users, desc: 'Jejaring 19 Koordinator' },
    { id: 'broadcast' as SubMenuPublikasi, label: 'Pusat Broadcast', icon: Share2, desc: 'Template Siaran WhatsApp' },
    { id: 'materi' as SubMenuPublikasi, label: 'Materi & Banner', icon: Image, desc: 'Desain Promosi & Media' },
    { id: 'helpdesk' as SubMenuPublikasi, label: 'FAQ & Bantuan', icon: HelpCircle, desc: 'Pusat Informasi Alumni' }
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredKoordinator = koordinatorList.filter(k => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return k.namaKoordinator.toLowerCase().includes(q) ||
           k.kotaDomisili.toLowerCase().includes(q) ||
           `angkatan ${k.angkatan}`.toLowerCase().includes(q) ||
           k.angkatan.toString() === searchTerm.trim();
  });

  return (
    <div className="space-y-5">
      {/* Division Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-950/80 via-slate-900 to-slate-900 border border-teal-800/40 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-400/30 text-teal-400 shadow-md">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-900/60 text-teal-300 border border-teal-700/50">
                  Divisi Pelaksana
                </span>
                <h1 className="text-base sm:text-lg font-bold text-white">
                  Divisi Komunikasi Eksternal & Publikasi
                </h1>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Pengelolaan koordinasi perwakilan Angkatan 1 s/d 19, penyebaran broadcast siaran resmi, materi publikasi visual, dan layanan informasi alumni.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-teal-300 bg-teal-950/50 px-3 py-1.5 rounded-lg border border-teal-800/40">
            <Users className="w-4 h-4 text-teal-400" />
            <span>Koordinator: <strong>19 Angkatan Terhubung</strong></span>
          </div>
        </div>

        {/* Sub-Menu Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-800/80">
          {subMenus.map((sub) => {
            const Icon = sub.icon;
            const isActive = currentSubMenu === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => onSelectSubMenu(sub.id)}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-teal-600 text-white border-teal-400 shadow-md shadow-teal-900/40'
                    : 'bg-slate-850/80 hover:bg-slate-800 border-slate-750 text-slate-300 hover:text-white'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-teal-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">{sub.label}</div>
                  <div className={`text-[10px] truncate ${isActive ? 'text-teal-100' : 'text-slate-400'}`}>{sub.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-menu Content Router */}
      {currentSubMenu === 'koordinator' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-400" />
                Jejaring Koordinator Angkatan (Angkatan 1 s/d 19)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Daftar perwakilan resmi penghubung alumni SUPM N Kotaagung untuk koordinasi pendaftaran & iuran
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari korlap / angkatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-800 text-xs text-white border border-slate-700 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredKoordinator.map((k) => (
              <div 
                key={k.angkatan}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-teal-800/60 transition shadow-sm space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800/60">
                    Angkatan {k.angkatan}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Terhubung
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{k.namaKoordinator}</h4>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-teal-400" />
                    <span className="font-mono text-slate-300">{k.kontakWhatsApp}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Domisili: {k.kotaDomisili}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 italic">
                  Catatan: {k.catatanKhusus}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentSubMenu === 'broadcast' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-teal-400" />
              Pusat Template Broadcast Siaran WhatsApp
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Template teks resmi yang siap disalin dan dibagikan ke grup WhatsApp angkatan 1 s/d 19
            </p>
          </div>

          <div className="space-y-4">
            {broadcastTemplates.map((b) => (
              <div key={b.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{b.judul}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                      {b.kategori.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(b.id, b.templateTeks)}
                    className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-xs font-semibold text-white flex items-center gap-1.5 transition shadow"
                  >
                    {copiedId === b.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === b.id ? 'Tersalin!' : 'Salin Pesan'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-slate-950 border border-slate-850 font-sans text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {b.templateTeks}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentSubMenu === 'materi' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Image className="w-4 h-4 text-teal-400" />
              Materi Promosi & Aset Visual Resmi
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Spesifikasi banner, backdrop panggung, logo bahari, dan twibbon resmi Reuni Akbar Angkatan 1–19
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="font-bold text-white">Backdrop Panggung Utama</div>
              <p className="text-slate-400">Dimensi 6x3 meter dengan latar maritim Teluk Semaka & kampus SUPMN.</p>
              <div className="text-[10px] text-teal-400 font-mono">Format: High-Res TIFF / Vector PDF</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="font-bold text-white">Spanduk Selamat Datang</div>
              <p className="text-slate-400">Dipasang di gerbang masuk Jalan Samudra & pertigaan Kotaagung.</p>
              <div className="text-[10px] text-teal-400 font-mono">Ukuran: 5x1 meter (2 unit)</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="font-bold text-white">Twibbon Profil Media Sosial</div>
              <p className="text-slate-400">Bingkai foto profil WhatsApp/Facebook dengan bingkai Angkatan 1–19.</p>
              <div className="text-[10px] text-teal-400 font-mono">Format: PNG Transparan 1080x1080px</div>
            </div>
          </div>
        </div>
      )}

      {currentSubMenu === 'helpdesk' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-teal-400" />
              Pusat Bantuan & Pertanyaan Lazim (FAQ Alumni)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Jawaban standar untuk pertanyaan alumni mengenai pendaftaran, transportasi, dan partisipasi
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <h4 className="font-bold text-white">1. Siapa saja yang berhak hadir dalam reuni ini?</h4>
              <p className="text-slate-300">Seluruh alumni SUPM Negeri Kotaagung Angkatan 1 sampai dengan Angkatan 19, beserta guru purnabakti dan keluarga pendamping yang terkonfirmasi.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <h4 className="font-bold text-white">2. Kapan tanggal resmi pelaksanaan acara?</h4>
              <p className="text-slate-300">Tanggal pelaksanaan saat ini berstatus <span className="text-amber-300 font-medium">[{eventConfig.tanggalPelaksanaan}]</span> dan akan diumumkan secara resmi melalui Surat Keputusan Panitia.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <h4 className="font-bold text-white">3. Bagaimana cara melakukan verifikasi pembayaran iuran?</h4>
              <p className="text-slate-300">Pembayaran disalurkan melalui Koordinator Angkatan masing-masing atau langsung dikonfirmasi ke Ketua Divisi Keuangan (Anas Rosyid) dengan melampirkan bukti mutasi transfer resmi.</p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MENU 5: PLAN & PROGRESS DIVISI PUBLIKASI & KOMUNIKASI EKSTERNAL */}
      {currentSubMenu === 'plan_progress' && (
        <DivisionPlanProgressModule
          divisi="publikasi"
          tasks={tasks}
          onAddTask={onAddTask}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          currentUser={currentUser}
          users={users}
          title="Dashboard Plan & Progress Divisi Komunikasi Eksternal & Publikasi"
          subtitle="Pemantauan target produksi baliho/spanduk, siaran WA blast 19 angkatan, layanan hotline helpdesk, dan video teaser nostalgia."
        />
      )}
    </div>
  );
};
