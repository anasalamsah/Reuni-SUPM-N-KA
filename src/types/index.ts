/**
 * SUPMN Kotaagung Reunion Command Center (SUPMN Reunion OS)
 * Sistem Operasional Reuni Akbar SUPM N Kotaagung Angkatan 1–19
 * Definisi Tipe Data & Skema Arsitektur (Bahasa Indonesia)
 */

export type AngkatanNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19;

export const DAFTAR_ANGKATAN: AngkatanNumber[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
];

export type UserRole = 
  | 'super_admin'             // Ketua Pelaksana (Yurisa)
  | 'ketua_keuangan'          // Ketua Divisi Keuangan (Anas Rosyid) - Tanggung jawab keuangan langsung
  | 'bendahara'               // Alias kompatibilitas internal Ketua Divisi Keuangan
  | 'sekretaris'              // Sekretaris (Fitri Ariantini / Amanda Cindy)
  | 'seksi_acara'             // Divisi Acara
  | 'ketua_acara'             // Ketua Divisi Acara (Romi Handoko)
  | 'anggota_acara'           // Anggota Divisi Acara
  | 'ketua_publikasi'         // Ketua Divisi Komunikasi Eksternal & Digital (Ira S)
  | 'anggota_publikasi'       // Anggota Divisi Komunikasi Eksternal & Digital
  | 'anggota_keuangan'        // Anggota Divisi Keuangan
  | 'dewan_pengarah'          // Dewan Pengarah
  | 'koordinator_angkatan'     // Koordinator Angkatan (1–19)
  | 'auditor';                // Tim Audit & Pengawas Internal

export interface UserSession {
  id: string;
  name: string;
  role: UserRole;
  jabatanLabel: string;
  divisi: 'Pengarah' | 'Pimpinan' | 'Sekretariat' | 'Keuangan' | 'Acara' | 'Komunikasi Eksternal & Digital' | 'Koordinator Angkatan' | 'Pengawas';
  noHp: string;
  angkatan?: AngkatanNumber | string;
  email?: string;
  assignedAngkatan?: AngkatanNumber; // Jika role koordinator_angkatan
}

export type KehadiranStatus = 'akan_hadir' | 'ragu_ragu' | 'tidak_hadir';
export type VerifikasiStatus = 'terverifikasi' | 'menunggu_verifikasi' | 'ditolak';

export interface Participant {
  id: string;
  namaLengkap: string;
  angkatan: AngkatanNumber;
  jurusan: 'NKN' | 'TKPI' | 'TPHP' | 'TPL' | 'Umum/Lainnya'; // Program keahlian SUPM
  nomorKontak: string; // Catatan: nomor kontak resmi/opsional terkonfirmasi
  kotaDomisili: string;
  statusKehadiran: KehadiranStatus;
  statusVerifikasi: VerifikasiStatus;
  jumlahPendamping: number; // Anggota keluarga yang mendampingi
  ukuranKaos?: 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
  catatanKhusus?: string;
  createdAt: string;
  updatedAt: string;
  // Kompatibilitas skema legacy
  legacyId?: string;
  legacyData?: Record<string, unknown>;
}

export type JenisKontribusi = 
  | 'iuran_wajib_angkatan'
  | 'donasi_sukarela'
  | 'sponsorship'
  | 'partisipasi_souvenir';

export type MetodePembayaran = 
  | 'transfer_bank'
  | 'qris'
  | 'tunai'
  | 'menunggu_konfirmasi';

export interface Contribution {
  id: string;
  participantId?: string;
  namaPenyumbang: string;
  angkatan: AngkatanNumber;
  jenis: JenisKontribusi;
  nominal: number;
  tanggalTransaksi: string;
  metodePembayaran: MetodePembayaran;
  referensiTransaksi: string; // No referensi/mutasi
  statusVerifikasi: VerifikasiStatus;
  buktiBayarUrl?: string;
  catatan: string;
  diverifikasiOleh?: string;
  diverifikasiPada?: string;
  createdAt: string;
  updatedAt: string;
}

export type DivisiPanitia = 
  | 'Seksi Acara & Protokoler'
  | 'Seksi Logistik & Perlengkapan'
  | 'Seksi Konsumsi'
  | 'Seksi Publikasi & Dokumentasi'
  | 'Seksi Sekretariat & Pendaftaran'
  | 'Seksi Keamanan & Medis';

export type ApprovalStatus = 
  | 'draft'
  | 'menunggu_persetujuan'
  | 'disetujui'
  | 'ditolak';

export interface BudgetItem {
  id: string;
  kodePos: string;
  divisi: DivisiPanitia;
  uraian: string;
  alokasiAnggaran: number; // Pagu yang diajukan
  realisasiTerpakai: number; // Realisasi aktual dari buku kas
  statusApproval: ApprovalStatus;
  diajukanOleh: string;
  tanggalPengajuan: string;
  disetujuiOleh?: string;
  tanggalApproval?: string;
  catatanReview?: string;
}

export type TipeTransaksi = 'pemasukan' | 'pengeluaran';
export type StatusRekonsiliasi = 'cocok' | 'selisih' | 'pending';

export interface LedgerEntry {
  id: string;
  nomorBukti: string; // Misal: BKM-2026-001 atau BKK-2026-001
  tanggal: string;
  tipe: TipeTransaksi;
  kategori: string;
  posAnggaranId?: string; // Tautan ke RAPB jika pengeluaran
  angkatanTerkait?: AngkatanNumber; // Tautan ke angkatan 1–19 jika pemasukan iuran
  uraian: string;
  debit: number;   // Masuk
  kredit: number;  // Keluar
  saldoBerjalan: number;
  pihakTerkait: string; // Nama alumni, vendor, atau seksi
  statusRekonsiliasi: StatusRekonsiliasi;
  dibuatOleh: string;
  catatanAuditor?: string;
  createdAt: string;
}

export interface ReconciliationRecord {
  id: string;
  ledgerEntryId: string;
  tanggalRekonsiliasi: string;
  nominalBukuKas: number;
  nominalRekeningKoran: number;
  selisih: number;
  status: 'cocok' | 'selisih_kurang' | 'selisih_lebih' | 'dalam_investigasi';
  catatanAuditor: string;
  auditorName: string;
  diselesaikan: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  aksi: string; // e.g. "APPROVE_BUDGET", "VERIFY_PARTICIPANT", "ADD_LEDGER_ENTRY"
  modul: 'Registrasi' | 'Kontribusi' | 'Anggaran' | 'Buku Kas' | 'Rekonsiliasi' | 'Sistem' | 'Sekretariat' | 'Acara' | 'Publikasi';
  entitasId: string;
  deskripsi: string;
  detailSebelum?: string;
  detailSesudah?: string;
}

export interface EventConfig {
  namaEvent: string;
  namaAplikasi: string;
  namaSingkat: string;
  tanggalPelaksanaan: string; // Status: 'Menunggu Keputusan Rapat Pleno Panitia' jika belum confirmed
  lokasiPelaksanaan: string;  // Status: 'SUPM Negeri Kotaagung / Menunggu Konfirmasi Panitia'
  statusRekeningResmi: string; // Status: 'Rekening Resmi Ditetapkan SK Panitia'
  catatanKebijakanIuran: string;
  kontakSekretariat: string;
}

// Navigasi Terstruktur Berdasarkan 4 Divisi Resmi
export type MainMenuId = 
  | 'dashboard'
  | 'sekretaris'
  | 'keuangan'
  | 'acara'
  | 'publikasi';

export type SubMenuSekretaris = 'peserta' | 'kohort' | 'dokumen_sk' | 'audit_sekretariat' | 'plan_progress';
export type SubMenuKeuangan = 'iuran' | 'buku_kas' | 'rapb' | 'rekonsiliasi' | 'plan_progress';
export type SubMenuAcara = 
  | 'scoop_tim'         // Pembagian 10 Scoop Tanggung Jawab Tim Acara (19 Anggota)
  | 'rundown'           // Rundown & Protokoler Acara
  | 'checkin'           // Presensi & Gate Check-in Hari-H
  | 'logistik'          // Panggung, Tenda, Sound & Lighting
  | 'konsumsi'          // Catering & Konsumsi Bahari Pesisir
  | 'seragam_merch'     // Kaos Kenangan & Goodie Bag
  | 'keamanan_medis'    // Keamanan, Parkir & Pos Medis P3K
  | 'temu_kangen'       // Temu Kangen Guru Purnabakti & Tali Asih
  | 'hiburan'           // Musik Bahari & Wall of Fame Kenangan
  | 'plan_progress';    // Dashboard Plan & Progress Task Divisi Acara
export type SubMenuPublikasi = 'koordinator' | 'broadcast' | 'materi' | 'helpdesk' | 'plan_progress';

export type TaskDivision = 'sekretaris' | 'keuangan' | 'acara' | 'publikasi';
export type TaskPriority = 'rendah' | 'sedang' | 'tinggi' | 'mendesak';
export type TaskStatus = 'belum_mulai' | 'dalam_proses' | 'selesai' | 'terkendala';

export interface DivisionTask {
  id: string;
  divisi: TaskDivision;
  judul: string;
  deskripsi: string;
  pic: string;
  picUserId?: string;
  targetSelesai: string; // Format: YYYY-MM-DD
  prioritas: TaskPriority;
  status: TaskStatus;
  progresPersen: number; // 0 sampai 100
  kategori: string;
  outputDeliverable: string;
  anggaranEstimasi?: number;
  catatanUpdate?: string;
  updatedAt: string;
  createdAt: string;
}

export interface ScoopAcara {
  id: string;
  namaScoop: string;
  deskripsi: string;
  koordinatorScoop: string;
  anggotaTim: string[];
  statusKesiapan: 'persiapan' | 'siap_75%' | 'siap_penuh' | 'selesai';
  progresPersen: number;
  itemChecklist: { id: string; nama: string; selesai: boolean }[];
  catatanOperasional: string;
}

export interface SuratDokumen {
  id: string;
  noSurat: string;
  perihal: string;
  jenis: 'SK_Panitia' | 'Surat_Izin' | 'Notula_Pleno' | 'Undangan_Alumni';
  tanggal: string;
  status: 'diterbitkan' | 'dalam_draf' | 'menunggu_tanda_tangan';
  ringkasan: string;
}

export interface RundownItem {
  id: string;
  waktuMulai: string;
  waktuSelesai: string;
  namaSesi: string;
  penanggungJawab: string;
  lokasi: string;
  status: 'siap' | 'menunggu_konfirmasi_waktu';
  keterangan: string;
}

export interface KoordinatorAngkatan {
  angkatan: AngkatanNumber;
  namaKoordinator: string;
  kontakWhatsApp: string;
  kotaDomisili: string;
  statusTerhubung: boolean;
  catatanKhusus: string;
}

export interface BroadcastTemplate {
  id: string;
  judul: string;
  kategori: 'Undangan_Pendaftaran' | 'Pengingat_Iuran' | 'Info_Acara' | 'Pemberitahuan_Resmi';
  templateTeks: string;
}

