import React from 'react';
import { 
  Wallet, 
  BookOpen, 
  Building2, 
  ShieldCheck, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { 
  Contribution, 
  LedgerEntry, 
  BudgetItem, 
  ReconciliationRecord, 
  UserSession, 
  AngkatanNumber, 
  SubMenuKeuangan, 
  VerifikasiStatus, 
  ApprovalStatus,
  EventConfig,
  DivisionTask
} from '../../types';
import { ContributionTracker } from '../ContributionTracker';
import { FinancialLedgerModule } from '../FinancialLedgerModule';
import { BudgetApprovalModule } from '../BudgetApprovalModule';
import { ReconciliationPaymentModule } from '../ReconciliationPaymentModule';
import { DivisionPlanProgressModule } from '../DivisionPlanProgressModule';

interface DivisiKeuanganProps {
  currentSubMenu: SubMenuKeuangan;
  onSelectSubMenu: (sub: SubMenuKeuangan) => void;
  contributions: Contribution[];
  ledgerEntries: LedgerEntry[];
  budgetItems: BudgetItem[];
  reconciliationRecords: ReconciliationRecord[];
  currentUser: UserSession;
  eventConfig: EventConfig;
  selectedCohortFilter: AngkatanNumber | 'all';
  setSelectedCohortFilter: (akt: AngkatanNumber | 'all') => void;
  onAddContribution: (contribution: Omit<Contribution, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateContributionStatus: (id: string, status: VerifikasiStatus) => void;
  onAddLedgerEntry: (entry: Omit<LedgerEntry, 'id' | 'createdAt' | 'saldoBerjalan'>) => void;
  onAddBudgetItem: (item: Omit<BudgetItem, 'id'>) => void;
  onReviewBudget: (id: string, status: ApprovalStatus, catatanReview: string) => void;
  onAddReconciliation: (record: Omit<ReconciliationRecord, 'id'>) => void;
  onResolveReconciliation: (id: string, notes: string) => void;
  tasks: DivisionTask[];
  onAddTask: (task: Omit<DivisionTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateTask: (task: DivisionTask) => void;
  onDeleteTask: (id: string) => void;
  users: UserSession[];
}

export const DivisiKeuangan: React.FC<DivisiKeuanganProps> = ({
  currentSubMenu,
  onSelectSubMenu,
  contributions,
  ledgerEntries,
  budgetItems,
  reconciliationRecords,
  currentUser,
  eventConfig,
  selectedCohortFilter,
  setSelectedCohortFilter,
  onAddContribution,
  onUpdateContributionStatus,
  onAddLedgerEntry,
  onAddBudgetItem,
  onReviewBudget,
  onAddReconciliation,
  onResolveReconciliation,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  users
}) => {
  const subMenus = [
    { id: 'plan_progress' as SubMenuKeuangan, label: 'Plan & Progress', icon: TrendingUp, desc: 'Pantau Task Keuangan' },
    { id: 'iuran' as SubMenuKeuangan, label: 'Iuran & Kontribusi', icon: Wallet, desc: 'Penerimaan Angkatan 1–19' },
    { id: 'buku_kas' as SubMenuKeuangan, label: 'Buku Kas & Jurnal', icon: BookOpen, desc: 'Double-Entry Debit/Kredit' },
    { id: 'rapb' as SubMenuKeuangan, label: 'Persetujuan RAPB', icon: Building2, desc: 'Pagu Anggaran Divisi' },
    { id: 'rekonsiliasi' as SubMenuKeuangan, label: 'Rekonsiliasi Bank', icon: ShieldCheck, desc: 'Audit Mutasi Rekening' }
  ];

  const totalMasuk = ledgerEntries.reduce((s, e) => s + e.debit, 0);
  const totalKeluar = ledgerEntries.reduce((s, e) => s + e.kredit, 0);
  const saldoKas = totalMasuk - totalKeluar;

  const formatRp = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="space-y-5">
      {/* Division Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-800/40 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 shadow-md">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                  Divisi Pelaksana
                </span>
                <h1 className="text-base sm:text-lg font-bold text-white">
                  Divisi Keuangan & Perbendaharaan
                </h1>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Ketua Divisi: <strong>Anas Rosyid (Angkatan 5)</strong> &bull; Bertanggung jawab langsung atas seluruh pembukuan kas umum, verifikasi iuran kohort 1–19, otorisasi pagu RAPB, dan rekonsiliasi mutasi rekening resmi panitia.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-emerald-800/40 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">Saldo Kas Berjalan</span>
              <span className="text-sm font-bold text-emerald-400">{formatRp(saldoKas)}</span>
            </div>
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
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-900/40'
                    : 'bg-slate-850/80 hover:bg-slate-800 border-slate-750 text-slate-300 hover:text-white'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-emerald-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">{sub.label}</div>
                  <div className={`text-[10px] truncate ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>{sub.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-menu Content Router */}
      {currentSubMenu === 'iuran' && (
        <ContributionTracker
          contributions={contributions}
          currentUser={currentUser}
          selectedCohortFilter={selectedCohortFilter}
          setSelectedCohortFilter={setSelectedCohortFilter}
          onAddContribution={onAddContribution}
          onUpdateStatus={onUpdateContributionStatus}
        />
      )}

      {currentSubMenu === 'buku_kas' && (
        <FinancialLedgerModule
          ledgerEntries={ledgerEntries}
          budgetItems={budgetItems}
          currentUser={currentUser}
          onAddLedgerEntry={onAddLedgerEntry}
        />
      )}

      {currentSubMenu === 'rapb' && (
        <BudgetApprovalModule
          budgetItems={budgetItems}
          currentUser={currentUser}
          onAddBudgetItem={onAddBudgetItem}
          onReviewBudget={onReviewBudget}
        />
      )}

      {currentSubMenu === 'rekonsiliasi' && (
        <ReconciliationPaymentModule
          reconciliationRecords={reconciliationRecords}
          ledgerEntries={ledgerEntries}
          currentUser={currentUser}
          eventConfig={eventConfig}
          onAddReconciliation={onAddReconciliation}
          onResolveReconciliation={onResolveReconciliation}
        />
      )}

      {/* SUB-MENU 5: PLAN & PROGRESS DIVISI KEUANGAN */}
      {currentSubMenu === 'plan_progress' && (
        <DivisionPlanProgressModule
          divisi="keuangan"
          tasks={tasks}
          onAddTask={onAddTask}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          currentUser={currentUser}
          users={users}
          title="Dashboard Plan & Progress Divisi Keuangan"
          subtitle="Pemantauan target rekonsiliasi harian, target realisasi iuran pokok 19 angkatan, pencairan RAPB, dan persiapan dana tali asih."
        />
      )}
    </div>
  );
};
