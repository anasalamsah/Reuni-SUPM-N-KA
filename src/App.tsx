/**
 * SUPMN Kotaagung Reunion Command Center (SUPMN Reunion OS)
 * Sistem Operasional Reuni Akbar SUPM N Kotaagung Angkatan 1–19
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { DivisiSekretaris } from './components/divisions/DivisiSekretaris';
import { DivisiKeuangan } from './components/divisions/DivisiKeuangan';
import { DivisiAcara } from './components/divisions/DivisiAcara';
import { DivisiPublikasi } from './components/divisions/DivisiPublikasi';
import { TechnicalDocsModal } from './components/TechnicalDocsModal';
import { EventConfigModal } from './components/EventConfigModal';
import { AdminUserManagementModal } from './components/AdminUserManagementModal';

import {
  UserSession,
  EventConfig,
  Participant,
  Contribution,
  BudgetItem,
  LedgerEntry,
  ReconciliationRecord,
  AuditLog,
  SuratDokumen,
  RundownItem,
  KoordinatorAngkatan,
  BroadcastTemplate,
  ScoopAcara,
  DivisionTask,
  AngkatanNumber,
  VerifikasiStatus,
  ApprovalStatus,
  MainMenuId,
  SubMenuSekretaris,
  SubMenuKeuangan,
  SubMenuAcara,
  SubMenuPublikasi
} from './types';

import {
  loadEventConfig,
  saveEventConfig,
  loadCurrentUser,
  saveCurrentUser,
  loadUsers,
  saveUsers,
  loadParticipants,
  saveParticipants,
  loadContributions,
  saveContributions,
  loadBudgetItems,
  saveBudgetItems,
  loadLedgerEntries,
  saveLedgerEntries,
  loadReconciliationRecords,
  saveReconciliationRecords,
  loadAuditLogs,
  saveAuditLogs,
  loadSuratDokumen,
  saveSuratDokumen,
  loadRundownItems,
  saveRundownItems,
  loadKoordinatorList,
  saveKoordinatorList,
  loadBroadcastTemplates,
  saveBroadcastTemplates,
  loadScoopAcara,
  saveScoopAcara,
  loadDivisionTasks,
  saveDivisionTasks,
  addAuditLogEntry,
  resetAllDataToDefault
} from './services/storageService';

export default function App() {
  const [users, setUsers] = useState<UserSession[]>(loadUsers());
  const [currentUser, setCurrentUser] = useState<UserSession>(loadCurrentUser());
  const [eventConfig, setEventConfig] = useState<EventConfig>(loadEventConfig());
  const [participants, setParticipants] = useState<Participant[]>(loadParticipants());
  const [contributions, setContributions] = useState<Contribution[]>(loadContributions());
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(loadBudgetItems());
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(loadLedgerEntries());
  const [reconciliationRecords, setReconciliationRecords] = useState<ReconciliationRecord[]>(loadReconciliationRecords());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(loadAuditLogs());
  const [suratDokumen, setSuratDokumen] = useState<SuratDokumen[]>(loadSuratDokumen());
  const [rundownItems, setRundownItems] = useState<RundownItem[]>(loadRundownItems());
  const [koordinatorList, setKoordinatorList] = useState<KoordinatorAngkatan[]>(loadKoordinatorList());
  const [broadcastTemplates, setBroadcastTemplates] = useState<BroadcastTemplate[]>(loadBroadcastTemplates());
  const [scoopAcara, setScoopAcara] = useState<ScoopAcara[]>(loadScoopAcara());
  const [tasks, setTasks] = useState<DivisionTask[]>(loadDivisionTasks());

  // Division Navigation State
  const [activeTab, setActiveTab] = useState<MainMenuId>('dashboard');
  const [subMenuSekretaris, setSubMenuSekretaris] = useState<SubMenuSekretaris>('peserta');
  const [subMenuKeuangan, setSubMenuKeuangan] = useState<SubMenuKeuangan>('iuran');
  const [subMenuAcara, setSubMenuAcara] = useState<SubMenuAcara>('scoop_tim');
  const [subMenuPublikasi, setSubMenuPublikasi] = useState<SubMenuPublikasi>('koordinator');

  const [selectedCohortFilter, setSelectedCohortFilter] = useState<AngkatanNumber | 'all'>('all');
  
  // Modals
  const [showDocsModal, setShowDocsModal] = useState<boolean>(false);
  const [showEventConfigModal, setShowEventConfigModal] = useState<boolean>(false);
  const [showAdminUsersModal, setShowAdminUsersModal] = useState<boolean>(false);

  // Sync state to storage
  useEffect(() => { saveCurrentUser(currentUser); }, [currentUser]);
  useEffect(() => { saveUsers(users); }, [users]);
  useEffect(() => { saveEventConfig(eventConfig); }, [eventConfig]);
  useEffect(() => { saveParticipants(participants); }, [participants]);
  useEffect(() => { saveContributions(contributions); }, [contributions]);
  useEffect(() => { saveBudgetItems(budgetItems); }, [budgetItems]);
  useEffect(() => { saveLedgerEntries(ledgerEntries); }, [ledgerEntries]);
  useEffect(() => { saveReconciliationRecords(reconciliationRecords); }, [reconciliationRecords]);
  useEffect(() => { saveSuratDokumen(suratDokumen); }, [suratDokumen]);
  useEffect(() => { saveRundownItems(rundownItems); }, [rundownItems]);
  useEffect(() => { saveKoordinatorList(koordinatorList); }, [koordinatorList]);
  useEffect(() => { saveBroadcastTemplates(broadcastTemplates); }, [broadcastTemplates]);
  useEffect(() => { saveScoopAcara(scoopAcara); }, [scoopAcara]);
  useEffect(() => { saveDivisionTasks(tasks); }, [tasks]);

  // Actions: Participants
  const handleAddParticipant = (newP: Omit<Participant, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `ALM-${(participants.length + 1).toString().padStart(3, '0')}`;
    const timestamp = new Date().toISOString();
    const created: Participant = {
      ...newP,
      id,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    const updated = [created, ...participants];
    setParticipants(updated);

    const logs = addAuditLogEntry(
      currentUser,
      'REGISTER_PARTICIPANT',
      'Registrasi',
      id,
      `Pendaftaran alumni ${created.namaLengkap} (Angkatan ${created.angkatan} - ${created.jurusan})`
    );
    setAuditLogs(logs);
  };

  const handleUpdateParticipantStatus = (id: string, status: VerifikasiStatus) => {
    const target = participants.find(p => p.id === id);
    if (!target) return;

    const updated = participants.map(p => {
      if (p.id === id) {
        return {
          ...p,
          statusVerifikasi: status,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });
    setParticipants(updated);

    const logs = addAuditLogEntry(
      currentUser,
      'VERIFY_PARTICIPANT',
      'Registrasi',
      id,
      `Perubahan status verifikasi peserta ${target.namaLengkap} menjadi ${status}`
    );
    setAuditLogs(logs);
  };

  const handleDeleteParticipant = (id: string) => {
    const target = participants.find(p => p.id === id);
    if (!target) return;
    const updated = participants.filter(p => p.id !== id);
    setParticipants(updated);

    const logs = addAuditLogEntry(
      currentUser,
      'DELETE_PARTICIPANT',
      'Registrasi',
      id,
      `Penghapusan data peserta ${target.namaLengkap} (Angkatan ${target.angkatan})`
    );
    setAuditLogs(logs);
  };

  // Actions: Contributions
  const handleAddContribution = (newC: Omit<Contribution, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `CTR-${(contributions.length + 1).toString().padStart(3, '0')}`;
    const timestamp = new Date().toISOString();
    const created: Contribution = {
      ...newC,
      id,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    const updated = [created, ...contributions];
    setContributions(updated);

    if (created.statusVerifikasi === 'terverifikasi') {
      const prevTotalDebit = ledgerEntries.reduce((s, e) => s + e.debit, 0);
      const prevTotalKredit = ledgerEntries.reduce((s, e) => s + e.kredit, 0);
      const newSaldo = prevTotalDebit + created.nominal - prevTotalKredit;

      const newLedger: LedgerEntry = {
        id: `LDG-${(ledgerEntries.length + 1).toString().padStart(3, '0')}`,
        nomorBukti: `BKM-SUPM-${Date.now().toString().slice(-4)}`,
        tanggal: created.tanggalTransaksi,
        tipe: 'pemasukan',
        kategori: `Iuran Angkatan ${created.angkatan}`,
        angkatanTerkait: created.angkatan,
        uraian: `Penerimaan iuran dari ${created.namaPenyumbang}`,
        debit: created.nominal,
        kredit: 0,
        saldoBerjalan: newSaldo,
        pihakTerkait: created.namaPenyumbang,
        statusRekonsiliasi: 'cocok',
        dibuatOleh: currentUser.name,
        createdAt: timestamp
      };
      setLedgerEntries([newLedger, ...ledgerEntries]);
    }

    const logs = addAuditLogEntry(
      currentUser,
      'ADD_CONTRIBUTION',
      'Kontribusi',
      id,
      `Pencatatan ${created.jenis} dari ${created.namaPenyumbang} sebesar Rp ${created.nominal.toLocaleString('id-ID')}`
    );
    setAuditLogs(logs);
  };

  const handleUpdateContributionStatus = (id: string, status: VerifikasiStatus) => {
    const target = contributions.find(c => c.id === id);
    if (!target) return;

    const updated = contributions.map(c => {
      if (c.id === id) {
        return {
          ...c,
          statusVerifikasi: status,
          diverifikasiOleh: currentUser.name,
          diverifikasiPada: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    });
    setContributions(updated);

    const logs = addAuditLogEntry(
      currentUser,
      'VERIFY_CONTRIBUTION',
      'Kontribusi',
      id,
      `Verifikasi kontribusi ${target.namaPenyumbang} (Angkatan ${target.angkatan}) menjadi ${status}`
    );
    setAuditLogs(logs);
  };

  // Actions: Budget
  const handleAddBudgetItem = (item: Omit<BudgetItem, 'id'>) => {
    const id = `BGT-${(budgetItems.length + 1).toString().padStart(3, '0')}`;
    const created: BudgetItem = {
      ...item,
      id
    };
    const updated = [...budgetItems, created];
    setBudgetItems(updated);

    const logs = addAuditLogEntry(
      currentUser,
      'SUBMIT_BUDGET',
      'Anggaran',
      id,
      `Pengajuan pagu anggaran ${created.divisi}: ${created.uraian} sebesar Rp ${created.alokasiAnggaran.toLocaleString('id-ID')}`
    );
    setAuditLogs(logs);
  };

  const handleReviewBudget = (id: string, status: ApprovalStatus, catatanReview: string) => {
    const target = budgetItems.find(b => b.id === id);
    if (!target) return;

    const updated = budgetItems.map(b => {
      if (b.id === id) {
        return {
          ...b,
          statusApproval: status,
          disetujuiOleh: currentUser.name,
          tanggalApproval: new Date().toISOString().split('T')[0],
          catatanReview
        };
      }
      return b;
    });
    setBudgetItems(updated);

    const logs = addAuditLogEntry(
      currentUser,
      'REVIEW_BUDGET',
      'Anggaran',
      id,
      `Keputusan ${status.toUpperCase()} untuk pos anggaran ${target.kodePos} (${target.divisi}) oleh ${currentUser.name}`
    );
    setAuditLogs(logs);
  };

  // Actions: Ledger
  const handleAddLedgerEntry = (entry: Omit<LedgerEntry, 'id' | 'createdAt' | 'saldoBerjalan'>) => {
    const id = `LDG-${(ledgerEntries.length + 1).toString().padStart(3, '0')}`;
    const timestamp = new Date().toISOString();

    const prevDebit = ledgerEntries.reduce((s, e) => s + e.debit, 0);
    const prevKredit = ledgerEntries.reduce((s, e) => s + e.kredit, 0);
    const newSaldo = prevDebit + entry.debit - (prevKredit + entry.kredit);

    const created: LedgerEntry = {
      ...entry,
      id,
      saldoBerjalan: newSaldo,
      createdAt: timestamp
    };
    setLedgerEntries([created, ...ledgerEntries]);

    if (created.posAnggaranId && created.tipe === 'pengeluaran') {
      setBudgetItems(prev => prev.map(b => {
        if (b.id === created.posAnggaranId) {
          return {
            ...b,
            realisasiTerpakai: b.realisasiTerpakai + created.kredit
          };
        }
        return b;
      }));
    }

    const logs = addAuditLogEntry(
      currentUser,
      'ADD_LEDGER_ENTRY',
      'Buku Kas',
      id,
      `Pencatatan kas ${created.tipe.toUpperCase()} [${created.nomorBukti}]: ${created.uraian} (${created.debit > 0 ? `Debit Rp ${created.debit.toLocaleString('id-ID')}` : `Kredit Rp ${created.kredit.toLocaleString('id-ID')}`})`
    );
    setAuditLogs(logs);
  };

  // Actions: Reconciliation
  const handleAddReconciliation = (record: Omit<ReconciliationRecord, 'id'>) => {
    const id = `REC-${(reconciliationRecords.length + 1).toString().padStart(3, '0')}`;
    const created: ReconciliationRecord = {
      ...record,
      id
    };
    setReconciliationRecords([created, ...reconciliationRecords]);

    setLedgerEntries(prev => prev.map(l => {
      if (l.id === created.ledgerEntryId) {
        return {
          ...l,
          statusRekonsiliasi: created.status === 'cocok' ? 'cocok' : 'selisih'
        };
      }
      return l;
    }));

    const logs = addAuditLogEntry(
      currentUser,
      'RECONCILIATION_AUDIT',
      'Rekonsiliasi',
      id,
      `Audit rekonsiliasi mutasi rekening untuk ${created.ledgerEntryId} status: ${created.status} (Selisih: Rp ${created.selisih.toLocaleString('id-ID')})`
    );
    setAuditLogs(logs);
  };

  const handleResolveReconciliation = (id: string, notes: string) => {
    const updated = reconciliationRecords.map(r => {
      if (r.id === id) {
        return {
          ...r,
          diselesaikan: true,
          catatanAuditor: `${r.catatanAuditor} | Diselesaikan: ${notes}`
        };
      }
      return r;
    });
    setReconciliationRecords(updated);

    const logs = addAuditLogEntry(
      currentUser,
      'RESOLVE_RECONCILIATION',
      'Rekonsiliasi',
      id,
      `Penyelesaian status rekonsiliasi ${id} oleh ${currentUser.name}`
    );
    setAuditLogs(logs);
  };

  // Actions: Surat Dokumen & Rundown
  const handleAddSuratDokumen = (doc: Omit<SuratDokumen, 'id'>) => {
    const id = `DOC-${(suratDokumen.length + 1).toString().padStart(3, '0')}`;
    const created: SuratDokumen = { ...doc, id };
    setSuratDokumen([created, ...suratDokumen]);
    const logs = addAuditLogEntry(
      currentUser,
      'PUBLISH_DOCUMENT',
      'Sekretariat',
      id,
      `Penerbitan dokumen/SK ${created.noSurat}: ${created.perihal}`
    );
    setAuditLogs(logs);
  };

  const handleAddRundownItem = (item: Omit<RundownItem, 'id'>) => {
    const id = `RND-${(rundownItems.length + 1).toString().padStart(3, '0')}`;
    const created: RundownItem = { ...item, id };
    setRundownItems([...rundownItems, created]);
    const logs = addAuditLogEntry(
      currentUser,
      'ADD_RUNDOWN',
      'Acara',
      id,
      `Penambahan sesi rundown acara: ${created.namaSesi} (${created.waktuMulai}-${created.waktuSelesai})`
    );
    setAuditLogs(logs);
  };

  // Actions: Tasks / Plan & Progress
  const handleAddTask = (taskData: Omit<DivisionTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `TSK-${Date.now()}`;
    const now = new Date().toISOString();
    const newTask: DivisionTask = {
      ...taskData,
      id,
      createdAt: now,
      updatedAt: now
    };
    setTasks(prev => [newTask, ...prev]);
    const logs = addAuditLogEntry(
      currentUser,
      'CREATE_TASK',
      'Sistem',
      id,
      `Penambahan task rencana divisi ${newTask.divisi.toUpperCase()}: ${newTask.judul} (PIC: ${newTask.pic})`
    );
    setAuditLogs(logs);
  };

  const handleUpdateTask = (updatedTask: DivisionTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    const logs = addAuditLogEntry(
      currentUser,
      'UPDATE_TASK',
      'Sistem',
      updatedTask.id,
      `Pembaruan task ${updatedTask.judul} (${updatedTask.progresPersen}%, status: ${updatedTask.status})`
    );
    setAuditLogs(logs);
  };

  const handleDeleteTask = (id: string) => {
    const target = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    if (target) {
      const logs = addAuditLogEntry(
        currentUser,
        'DELETE_TASK',
        'Sistem',
        id,
        `Penghapusan rencana kerja divisi ${target.divisi.toUpperCase()}: ${target.judul}`
      );
      setAuditLogs(logs);
    }
  };

  // Actions: Reset Data
  const handleResetData = () => {
    resetAllDataToDefault();
    setEventConfig(loadEventConfig());
    setUsers(loadUsers());
    setCurrentUser(loadCurrentUser());
    setParticipants(loadParticipants());
    setContributions(loadContributions());
    setBudgetItems(loadBudgetItems());
    setLedgerEntries(loadLedgerEntries());
    setReconciliationRecords(loadReconciliationRecords());
    setAuditLogs(loadAuditLogs());
    setSuratDokumen(loadSuratDokumen());
    setRundownItems(loadRundownItems());
    setKoordinatorList(loadKoordinatorList());
    setBroadcastTemplates(loadBroadcastTemplates());
    setScoopAcara(loadScoopAcara());
    setTasks(loadDivisionTasks());
    setActiveTab('dashboard');
  };

  const handleNavigateToCohort = (angkatan: AngkatanNumber) => {
    setSelectedCohortFilter(angkatan);
    setActiveTab('sekretaris');
    setSubMenuSekretaris('peserta');
  };

  const handleSelectCohortForContributions = (angkatan: AngkatanNumber) => {
    setSelectedCohortFilter(angkatan);
    setActiveTab('keuangan');
    setSubMenuKeuangan('iuran');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        users={users}
        onOpenDocs={() => setShowDocsModal(true)}
        onOpenEventConfig={() => setShowEventConfigModal(true)}
        onOpenAdminUsers={() => setShowAdminUsersModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            participants={participants}
            contributions={contributions}
            budgetItems={budgetItems}
            ledgerEntries={ledgerEntries}
            auditLogs={auditLogs}
            eventConfig={eventConfig}
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            currentUser={currentUser}
            users={users}
            onNavigateToCohort={handleNavigateToCohort}
            onNavigateTab={(tab) => {
              if (tab === 'participants') {
                setActiveTab('sekretaris');
                setSubMenuSekretaris('peserta');
              } else if (tab === 'contributions') {
                setActiveTab('keuangan');
                setSubMenuKeuangan('iuran');
              } else if (tab === 'budget') {
                setActiveTab('keuangan');
                setSubMenuKeuangan('rapb');
              }
            }}
            onNavigateDivision={(divId) => setActiveTab(divId)}
            onOpenAdminUsers={() => setShowAdminUsersModal(true)}
          />
        )}

        {/* Divisi 1: Sekretaris */}
        {activeTab === 'sekretaris' && (
          <DivisiSekretaris
            currentSubMenu={subMenuSekretaris}
            onSelectSubMenu={setSubMenuSekretaris}
            participants={participants}
            currentUser={currentUser}
            selectedCohortFilter={selectedCohortFilter}
            setSelectedCohortFilter={setSelectedCohortFilter}
            onAddParticipant={handleAddParticipant}
            onUpdateParticipantStatus={handleUpdateParticipantStatus}
            onDeleteParticipant={handleDeleteParticipant}
            suratDokumen={suratDokumen}
            onAddSuratDokumen={handleAddSuratDokumen}
            auditLogs={auditLogs}
            onSelectCohortForContributions={handleSelectCohortForContributions}
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            users={users}
          />
        )}

        {/* Divisi 2: Keuangan */}
        {activeTab === 'keuangan' && (
          <DivisiKeuangan
            currentSubMenu={subMenuKeuangan}
            onSelectSubMenu={setSubMenuKeuangan}
            contributions={contributions}
            ledgerEntries={ledgerEntries}
            budgetItems={budgetItems}
            reconciliationRecords={reconciliationRecords}
            currentUser={currentUser}
            eventConfig={eventConfig}
            selectedCohortFilter={selectedCohortFilter}
            setSelectedCohortFilter={setSelectedCohortFilter}
            onAddContribution={handleAddContribution}
            onUpdateContributionStatus={handleUpdateContributionStatus}
            onAddLedgerEntry={handleAddLedgerEntry}
            onAddBudgetItem={handleAddBudgetItem}
            onReviewBudget={handleReviewBudget}
            onAddReconciliation={handleAddReconciliation}
            onResolveReconciliation={handleResolveReconciliation}
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            users={users}
          />
        )}

        {/* Divisi 3: Acara */}
        {activeTab === 'acara' && (
          <DivisiAcara
            currentSubMenu={subMenuAcara}
            onSelectSubMenu={setSubMenuAcara}
            rundownItems={rundownItems}
            onAddRundownItem={handleAddRundownItem}
            participants={participants}
            budgetItems={budgetItems}
            currentUser={currentUser}
            scoopAcara={scoopAcara}
            onUpdateScoopAcara={setScoopAcara}
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            users={users}
          />
        )}

        {/* Divisi 4: Komunikasi Eksternal & Publikasi */}
        {activeTab === 'publikasi' && (
          <DivisiPublikasi
            currentSubMenu={subMenuPublikasi}
            onSelectSubMenu={setSubMenuPublikasi}
            koordinatorList={koordinatorList}
            broadcastTemplates={broadcastTemplates}
            eventConfig={eventConfig}
            currentUser={currentUser}
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            users={users}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-slate-400">SUPMN Kotaagung Reunion Command Center</span> &bull; 
            Reuni Akbar SUPM N Kotaagung Angkatan 1–19
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>Sekretaris</span>
            <span>&bull;</span>
            <span>Div Keuangan</span>
            <span>&bull;</span>
            <span>Div Acara</span>
            <span>&bull;</span>
            <span>Div Publikasi</span>
            <span>&bull;</span>
            <button 
              onClick={() => setShowAdminUsersModal(true)} 
              className="text-amber-400 hover:underline"
            >
              Kelola Panitia (Admin)
            </button>
            <span>&bull;</span>
            <button 
              onClick={() => setShowDocsModal(true)} 
              className="text-cyan-400 hover:underline"
            >
              Panduan & Dok. Teknis
            </button>
          </div>
        </div>
      </footer>

      {/* Admin User Management Modal */}
      <AdminUserManagementModal
        isOpen={showAdminUsersModal}
        onClose={() => setShowAdminUsersModal(false)}
        users={users}
        currentUser={currentUser}
        onSaveUsers={setUsers}
        onSwitchUser={(u) => {
          setCurrentUser(u);
          saveCurrentUser(u);
        }}
      />

      {/* Technical Documentation & User Manual Modal */}
      <TechnicalDocsModal
        isOpen={showDocsModal}
        onClose={() => setShowDocsModal(false)}
      />

      {/* Event Configuration & Status Modal */}
      <EventConfigModal
        isOpen={showEventConfigModal}
        onClose={() => setShowEventConfigModal(false)}
        eventConfig={eventConfig}
        onSaveConfig={setEventConfig}
        onResetData={handleResetData}
      />
    </div>
  );
}
