/**
 * Layanan Penyimpanan Lokal & Migrasi Skema Legacy
 * SUPMN Kotaagung Reunion Command Center (SUPMN Reunion OS)
 */

import { 
  Participant, 
  Contribution, 
  BudgetItem, 
  LedgerEntry, 
  ReconciliationRecord, 
  AuditLog, 
  EventConfig,
  UserSession,
  AngkatanNumber,
  DAFTAR_ANGKATAN,
  SuratDokumen,
  RundownItem,
  KoordinatorAngkatan,
  BroadcastTemplate,
  ScoopAcara,
  DivisionTask
} from '../types';

import {
  INITIAL_EVENT_CONFIG,
  INITIAL_USERS,
  INITIAL_PARTICIPANTS,
  INITIAL_CONTRIBUTIONS,
  INITIAL_BUDGET_ITEMS,
  INITIAL_LEDGER_ENTRIES,
  INITIAL_RECONCILIATION_RECORDS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SURAT_DOKUMEN,
  INITIAL_RUNDOWN_ITEMS,
  INITIAL_KOORDINATOR_LIST,
  INITIAL_BROADCAST_TEMPLATES,
  INITIAL_SCOOP_ACARA,
  INITIAL_DIVISION_TASKS
} from '../data/initialData';

const STORAGE_KEYS = {
  EVENT_CONFIG: 'supmn_reunion_config_v1',
  CURRENT_USER: 'supmn_reunion_currentUser_v1',
  USERS: 'supmn_reunion_users_v1',
  PARTICIPANTS: 'supmn_reunion_participants_v1',
  CONTRIBUTIONS: 'supmn_reunion_contributions_v1',
  BUDGET: 'supmn_reunion_budget_v1',
  LEDGER: 'supmn_reunion_ledger_v1',
  RECONCILIATION: 'supmn_reunion_reconciliation_v1',
  AUDIT_LOGS: 'supmn_reunion_audit_logs_v1',
  SURAT_DOKUMEN: 'supmn_reunion_surat_v1',
  RUNDOWN: 'supmn_reunion_rundown_v1',
  KOORDINATOR: 'supmn_reunion_koordinator_v1',
  BROADCAST: 'supmn_reunion_broadcast_v1',
  SCOOP_ACARA: 'supmn_reunion_scoop_acara_v1',
  TASKS: 'supmn_reunion_tasks_v1',
};

function isStorageAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

// Deteksi dan bersihkan peninggalan legacy key jika ada
export function migrateLegacyStorage(): void {
  if (!isStorageAvailable()) return;
  try {
    const legacyPrefixes = ['akar_', 'akar_reunion_', 'akar_command_'];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && legacyPrefixes.some(p => key.startsWith(p))) {
        // Simpan data jika ada nilai berguna sebelum dibersihkan
        const val = localStorage.getItem(key);
        console.warn(`[Migrasi Legacy] Menghapus kunci usang: ${key}`);
        localStorage.removeItem(key);
      }
    }
  } catch (err) {
    console.error('Gagal menjalankan pembersihan skema legacy:', err);
  }
}

export function loadEventConfig(): EventConfig {
  migrateLegacyStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EVENT_CONFIG);
    if (data) {
      const parsed = JSON.parse(data);
      // Pastikan nama resmi selalu terjaga
      return {
        ...INITIAL_EVENT_CONFIG,
        ...parsed,
        namaEvent: 'Reuni Akbar SUPM N Kotaagung Angkatan 1–19',
        namaAplikasi: 'SUPMN Kotaagung Reunion Command Center',
        namaSingkat: 'SUPMN Reunion OS'
      };
    }
  } catch (e) {
    console.error('Error membaca event config:', e);
  }
  return INITIAL_EVENT_CONFIG;
}

export function saveEventConfig(config: EventConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EVENT_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Error menyimpan event config:', e);
  }
}

export function loadCurrentUser(): UserSession {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (data) {
      const parsed: UserSession = JSON.parse(data);
      // Alihkan jika user sebelumnya adalah Capt. Hendra Gunawan
      if (parsed.name && parsed.name.toLowerCase().includes('hendra')) {
        return INITIAL_USERS[0];
      }
      // Jika user adalah Anas Rosyid, pastikan role super_admin
      if (parsed.name === 'Anas Rosyid') {
        return {
          ...parsed,
          role: 'super_admin',
          jabatanLabel: 'Super Admin & Ketua Divisi Keuangan'
        };
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error membaca current user:', e);
  }
  return INITIAL_USERS[0]; // Anas Rosyid (Super Admin & Ketua Divisi Keuangan)
}

export function saveCurrentUser(user: UserSession): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } catch (e) {
    console.error('Error menyimpan current user:', e);
  }
}

export function loadParticipants(): Participant[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
    if (data) {
      const list: Participant[] = JSON.parse(data);
      // Validasi angkatan agar selalu berada di 1–19
      return list.map(item => {
        let angkatanNum = Number(item.angkatan) as AngkatanNumber;
        if (!DAFTAR_ANGKATAN.includes(angkatanNum)) {
          angkatanNum = 1;
        }
        return {
          ...item,
          angkatan: angkatanNum
        };
      });
    }
  } catch (e) {
    console.error('Error membaca participants:', e);
  }
  return INITIAL_PARTICIPANTS;
}

export function saveParticipants(participants: Participant[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(participants));
  } catch (e) {
    console.error('Error menyimpan participants:', e);
  }
}

export function loadContributions(): Contribution[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONTRIBUTIONS);
    if (data) {
      const list: Contribution[] = JSON.parse(data);
      return list.map(item => {
        let angkatanNum = Number(item.angkatan) as AngkatanNumber;
        if (!DAFTAR_ANGKATAN.includes(angkatanNum)) {
          angkatanNum = 1;
        }
        return {
          ...item,
          angkatan: angkatanNum
        };
      });
    }
  } catch (e) {
    console.error('Error membaca contributions:', e);
  }
  return INITIAL_CONTRIBUTIONS;
}

export function saveContributions(contributions: Contribution[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONTRIBUTIONS, JSON.stringify(contributions));
  } catch (e) {
    console.error('Error menyimpan contributions:', e);
  }
}

export function loadBudgetItems(): BudgetItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BUDGET);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error membaca budget items:', e);
  }
  return INITIAL_BUDGET_ITEMS;
}

export function saveBudgetItems(budget: BudgetItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budget));
  } catch (e) {
    console.error('Error menyimpan budget items:', e);
  }
}

export function loadLedgerEntries(): LedgerEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LEDGER);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error membaca ledger:', e);
  }
  return INITIAL_LEDGER_ENTRIES;
}

export function saveLedgerEntries(ledger: LedgerEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LEDGER, JSON.stringify(ledger));
  } catch (e) {
    console.error('Error menyimpan ledger:', e);
  }
}

export function loadReconciliationRecords(): ReconciliationRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECONCILIATION);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error membaca reconciliation:', e);
  }
  return INITIAL_RECONCILIATION_RECORDS;
}

export function saveReconciliationRecords(records: ReconciliationRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.RECONCILIATION, JSON.stringify(records));
  } catch (e) {
    console.error('Error menyimpan reconciliation:', e);
  }
}

export function loadAuditLogs(): AuditLog[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error membaca audit logs:', e);
  }
  return INITIAL_AUDIT_LOGS;
}

export function saveAuditLogs(logs: AuditLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Error menyimpan audit logs:', e);
  }
}

export function addAuditLogEntry(
  currentUser: UserSession,
  aksi: string,
  modul: AuditLog['modul'],
  entitasId: string,
  deskripsi: string,
  detailSebelum?: string,
  detailSesudah?: string
): AuditLog[] {
  const currentLogs = loadAuditLogs();
  const newLog: AuditLog = {
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toISOString(),
    userId: currentUser.id,
    userName: currentUser.name,
    userRole: currentUser.role,
    aksi,
    modul,
    entitasId,
    deskripsi,
    detailSebelum,
    detailSesudah
  };
  const updated = [newLog, ...currentLogs];
  saveAuditLogs(updated);
  return updated;
}

export function loadSuratDokumen(): SuratDokumen[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SURAT_DOKUMEN);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error membaca surat dokumen:', e);
  }
  return INITIAL_SURAT_DOKUMEN;
}

export function saveSuratDokumen(items: SuratDokumen[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SURAT_DOKUMEN, JSON.stringify(items));
  } catch (e) {
    console.error('Error menyimpan surat dokumen:', e);
  }
}

export function loadRundownItems(): RundownItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RUNDOWN);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error membaca rundown items:', e);
  }
  return INITIAL_RUNDOWN_ITEMS;
}

export function saveRundownItems(items: RundownItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.RUNDOWN, JSON.stringify(items));
  } catch (e) {
    console.error('Error menyimpan rundown items:', e);
  }
}

export function loadKoordinatorList(): KoordinatorAngkatan[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.KOORDINATOR);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error membaca koordinator:', e);
  }
  return INITIAL_KOORDINATOR_LIST;
}

export function saveKoordinatorList(items: KoordinatorAngkatan[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.KOORDINATOR, JSON.stringify(items));
  } catch (e) {
    console.error('Error menyimpan koordinator:', e);
  }
}

export function loadBroadcastTemplates(): BroadcastTemplate[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BROADCAST);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error membaca broadcast templates:', e);
  }
  return INITIAL_BROADCAST_TEMPLATES;
}

export function saveBroadcastTemplates(items: BroadcastTemplate[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BROADCAST, JSON.stringify(items));
  } catch (e) {
    console.error('Error menyimpan broadcast templates:', e);
  }
}

export function loadUsers(): UserSession[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (data) {
      const parsed: UserSession[] = JSON.parse(data);
      // Bersihkan peninggalan Capt. Hendra Gunawan jika ada di storage lokal
      const cleaned = parsed.filter(u => !u.name.toLowerCase().includes('hendra'));
      // Pastikan Anas Rosyid terdaftar dengan role super_admin
      const anasIdx = cleaned.findIndex(u => u.name === 'Anas Rosyid');
      if (anasIdx !== -1) {
        cleaned[anasIdx].role = 'super_admin';
        cleaned[anasIdx].jabatanLabel = 'Super Admin & Ketua Divisi Keuangan';
      } else {
        cleaned.unshift(INITIAL_USERS[0]);
      }
      return cleaned;
    }
  } catch (e) {
    console.error('Error membaca users:', e);
  }
  return INITIAL_USERS;
}

export function saveUsers(users: UserSession[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Error menyimpan users:', e);
  }
}

export function loadScoopAcara(): ScoopAcara[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SCOOP_ACARA);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error membaca scoop acara:', e);
  }
  return INITIAL_SCOOP_ACARA;
}

export function saveScoopAcara(items: ScoopAcara[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SCOOP_ACARA, JSON.stringify(items));
  } catch (e) {
    console.error('Error menyimpan scoop acara:', e);
  }
}

export function loadDivisionTasks(): DivisionTask[] {
  if (!isStorageAvailable()) return INITIAL_DIVISION_TASKS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (data) {
      const list: DivisionTask[] = JSON.parse(data);
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
    }
  } catch (e) {
    console.error('Error membaca division tasks:', e);
  }
  return INITIAL_DIVISION_TASKS;
}

export function saveDivisionTasks(tasks: DivisionTask[]): void {
  if (!isStorageAvailable()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Error menyimpan division tasks:', e);
  }
}

export function resetAllDataToDefault(): void {
  if (!isStorageAvailable()) return;
  localStorage.removeItem(STORAGE_KEYS.EVENT_CONFIG);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.PARTICIPANTS);
  localStorage.removeItem(STORAGE_KEYS.CONTRIBUTIONS);
  localStorage.removeItem(STORAGE_KEYS.BUDGET);
  localStorage.removeItem(STORAGE_KEYS.LEDGER);
  localStorage.removeItem(STORAGE_KEYS.RECONCILIATION);
  localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
  localStorage.removeItem(STORAGE_KEYS.SURAT_DOKUMEN);
  localStorage.removeItem(STORAGE_KEYS.RUNDOWN);
  localStorage.removeItem(STORAGE_KEYS.KOORDINATOR);
  localStorage.removeItem(STORAGE_KEYS.BROADCAST);
  localStorage.removeItem(STORAGE_KEYS.SCOOP_ACARA);
  localStorage.removeItem(STORAGE_KEYS.TASKS);
  migrateLegacyStorage();
}
