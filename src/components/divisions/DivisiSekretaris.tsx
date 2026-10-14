import React, { useState } from 'react';
import { 
  FileText, 
  Users, 
  Layers, 
  FileCheck, 
  Clock, 
  Plus, 
  Download, 
  ShieldCheck, 
  Search,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { 
  Participant, 
  UserSession, 
  AngkatanNumber, 
  SubMenuSekretaris, 
  SuratDokumen, 
  AuditLog,
  VerifikasiStatus,
  DivisionTask
} from '../../types';
import { ParticipantManagement } from '../ParticipantManagement';
import { CohortMatrixModule } from '../CohortMatrixModule';
import { DivisionPlanProgressModule } from '../DivisionPlanProgressModule';

interface DivisiSekretarisProps {
  currentSubMenu: SubMenuSekretaris;
  onSelectSubMenu: (sub: SubMenuSekretaris) => void;
  participants: Participant[];
  currentUser: UserSession;
  selectedCohortFilter: AngkatanNumber | 'all';
  setSelectedCohortFilter: (akt: AngkatanNumber | 'all') => void;
  onAddParticipant: (participant: Omit<Participant, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateParticipantStatus: (id: string, status: VerifikasiStatus) => void;
  onDeleteParticipant?: (id: string) => void;
  suratDokumen: SuratDokumen[];
  onAddSuratDokumen: (doc: Omit<SuratDokumen, 'id'>) => void;
  auditLogs: AuditLog[];
  onSelectCohortForContributions: (akt: AngkatanNumber) => void;
  tasks: DivisionTask[];
  onAddTask: (task: Omit<DivisionTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateTask: (task: DivisionTask) => void;
  onDeleteTask: (id: string) => void;
  users: UserSession[];
}

export const DivisiSekretaris: React.FC<DivisiSekretarisProps> = ({
  currentSubMenu,
  onSelectSubMenu,
  participants,
  currentUser,
  selectedCohortFilter,
  setSelectedCohortFilter,
  onAddParticipant,
  onUpdateParticipantStatus,
  onDeleteParticipant,
  suratDokumen,
  onAddSuratDokumen,
  auditLogs,
  onSelectCohortForContributions,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  users
}) => {
  const [showAddSuratModal, setShowAddSuratModal] = useState(false);
  const [noSurat, setNoSurat] = useState('');
  const [perihal, setPerihal] = useState('');
  const [jenisSurat, setJenisSurat] = useState<SuratDokumen['jenis']>('SK_Panitia');
  const [ringkasan, setRingkasan] = useState('');

  const subMenus = [
    { id: 'plan_progress' as SubMenuSekretaris, label: 'Plan & Progress', icon: TrendingUp, desc: 'Pantau Task Sekretariat' },
    { id: 'peserta' as SubMenuSekretaris, label: 'Registrasi Alumni', icon: Users, desc: 'Pendaftaran & Verifikasi' },
    { id: 'kohort' as SubMenuSekretaris, label: 'Matriks Angkatan 1–19', icon: Layers, desc: 'Rekapitulasi 19 Angkatan' },
    { id: 'dokumen_sk' as SubMenuSekretaris, label: 'Dokumen & SK Panitia', icon: FileCheck, desc: 'Arsip Persuratan Resmi' },
    { id: 'audit_sekretariat' as SubMenuSekretaris, label: 'Jejak Audit Sekretariat', icon: ShieldCheck, desc: 'Log Perubahan Data' }
  ];

  const handleCreateSurat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!perihal.trim()) return;

    onAddSuratDokumen({
      noSurat: noSurat.trim() || `0${suratDokumen.length + 1}/PAN-REUNI/X/2026`,
      perihal: perihal.trim(),
      jenis: jenisSurat,
      tanggal: new Date().toISOString().split('T')[0],
      status: 'diterbitkan',
      ringkasan: ringkasan.trim() || 'Arsip resmi sekretariat panitia'
    });

    setNoSurat('');
    setPerihal('');
    setRingkasan('');
    setShowAddSuratModal(false);
  };

  const sekretariatLogs = auditLogs.filter(l => l.modul === 'Registrasi' || l.modul === 'Sekretariat');

  return (
    <div className="space-y-5">
      {/* Division Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/80 via-slate-900 to-slate-900 border border-sky-800/40 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-400/30 text-sky-400 shadow-md">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-900/60 text-sky-300 border border-sky-700/50">
                  Divisi Pelaksana
                </span>
                <h1 className="text-base sm:text-lg font-bold text-white">
                  Divisi Sekretaris & Kesekretariatan
                </h1>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Pengelolaan pusat data alumni Angkatan 1–19, verifikasi kehadiran, arsip surat keputusan (SK), serta persuratan resmi Reuni Akbar.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-sky-300 bg-sky-950/50 px-3 py-1.5 rounded-lg border border-sky-800/40">
            <Users className="w-4 h-4 text-sky-400" />
            <span>Total Terdata: <strong>{participants.length} Alumni</strong></span>
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
                    ? 'bg-sky-600 text-white border-sky-400 shadow-md shadow-sky-900/40'
                    : 'bg-slate-850/80 hover:bg-slate-800 border-slate-750 text-slate-300 hover:text-white'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-sky-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">{sub.label}</div>
                  <div className={`text-[10px] truncate ${isActive ? 'text-sky-100' : 'text-slate-400'}`}>{sub.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-menu Content Router */}
      {currentSubMenu === 'peserta' && (
        <ParticipantManagement
          participants={participants}
          currentUser={currentUser}
          selectedCohortFilter={selectedCohortFilter}
          setSelectedCohortFilter={setSelectedCohortFilter}
          onAddParticipant={onAddParticipant}
          onUpdateStatus={onUpdateParticipantStatus}
          onDeleteParticipant={onDeleteParticipant}
        />
      )}

      {currentSubMenu === 'kohort' && (
        <CohortMatrixModule
          participants={participants}
          contributions={[]}
          onSelectCohortForParticipants={(akt) => {
            setSelectedCohortFilter(akt);
            onSelectSubMenu('peserta');
          }}
          onSelectCohortForContributions={onSelectCohortForContributions}
        />
      )}

      {currentSubMenu === 'dokumen_sk' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-sky-400" />
                Arsip Persuratan & SK Resmi Panitia
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Surat Keputusan (SK), perizinan lokasi kampus SUPM, dan notula pleno Reuni Akbar Angkatan 1–19
              </p>
            </div>
            <button
              onClick={() => setShowAddSuratModal(true)}
              className="px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white flex items-center gap-1.5 transition shadow"
            >
              <Plus className="w-4 h-4" />
              <span>+ Terbitkan Dokumen Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suratDokumen.map((doc) => (
              <div 
                key={doc.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-sky-800/60 transition shadow-sm space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/60 font-semibold">
                    {doc.noSurat}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 capitalize flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {doc.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white leading-snug">
                  {doc.perihal}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {doc.ringkasan}
                </p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Tanggal: {doc.tanggal}</span>
                  <span className="text-sky-400 font-medium">Jenis: {doc.jenis.replace(/_/g, ' ')}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Modal Terbitkan Dokumen */}
          {showAddSuratModal && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-sky-400" />
                    Penerbitan Dokumen / SK Panitia Baru
                  </h3>
                  <button onClick={() => setShowAddSuratModal(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleCreateSurat} className="space-y-3.5 mt-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Nomor Surat Resmi</label>
                    <input
                      type="text"
                      placeholder="Contoh: 05/SK-PAN/X/2026"
                      value={noSurat}
                      onChange={(e) => setNoSurat(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Jenis Dokumen *</label>
                    <select
                      value={jenisSurat}
                      onChange={(e) => setJenisSurat(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-sky-500"
                    >
                      <option value="SK_Panitia">SK Panitia</option>
                      <option value="Surat_Izin">Surat Izin / Tempat</option>
                      <option value="Notula_Pleno">Notula Rapat Pleno</option>
                      <option value="Undangan_Alumni">Undangan Resmi Alumni</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Perihal Dokumen *</label>
                    <input
                      type="text"
                      required
                      placeholder="Uraian perihal surat atau keputusan pleno..."
                      value={perihal}
                      onChange={(e) => setPerihal(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Ringkasan Isi / Keputusan</label>
                    <textarea
                      rows={3}
                      placeholder="Rincian pokok keputusan atau isi dokumen..."
                      value={ringkasan}
                      onChange={(e) => setRingkasan(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddSuratModal(false)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 font-semibold text-white"
                    >
                      Simpan Dokumen
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {currentSubMenu === 'audit_sekretariat' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                Jejak Audit Khusus Divisi Sekretariat
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Log mutasi data pendaftaran alumni dan penerbitan persuratan
              </p>
            </div>
            <span className="text-xs text-sky-300 bg-sky-950 px-2.5 py-1 rounded border border-sky-800">
              {sekretariatLogs.length} Aktivitas Tercatat
            </span>
          </div>

          <div className="space-y-2.5">
            {sekretariatLogs.map((log) => (
              <div 
                key={log.id}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 font-bold">
                      {log.aksi}
                    </span>
                    <span className="font-semibold text-white">{log.userName}</span>
                    <span className="text-[10px] text-slate-400">({log.userRole})</span>
                  </div>
                  <p className="text-slate-300 text-xs mt-1">{log.deskripsi}</p>
                </div>
                <div className="text-[10px] text-slate-500 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} &bull; {new Date(log.timestamp).toLocaleDateString('id-ID')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-MENU 5: PLAN & PROGRESS DIVISI SEKRETARIAT */}
      {currentSubMenu === 'plan_progress' && (
        <DivisionPlanProgressModule
          divisi="sekretaris"
          tasks={tasks}
          onAddTask={onAddTask}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          currentUser={currentUser}
          users={users}
          title="Dashboard Plan & Progress Divisi Sekretariat"
          subtitle="Pemantauan target persuratan resmi, rekapitulasi data kontak 19 angkatan, distribusi undangan guru purnabakti, dan buku kenangan."
        />
      )}
    </div>
  );
};
