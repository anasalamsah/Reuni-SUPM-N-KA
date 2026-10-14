/**
 * Dokumentasi Teknis & Panduan Penggunaan Resmi
 * SUPMN Kotaagung Reunion Command Center (SUPMN Reunion OS)
 * Bahasa Indonesia
 */

export const DOKUMENTASI_TEKNIS_LENGKAP = `
# DOKUMENTASI TEKNIS ARSITEKTUR & SKEMA SISTEM
## SUPMN Kotaagung Reunion Command Center (SUPMN Reunion OS)
### Reuni Akbar SUPM N Kotaagung Angkatan 1–19

---

### 1. RINGKASAN ARSITEKTUR SISTEM
Aplikasi ini dirancang sebagai Command Center operasional terpadu untuk mengelola seluruh aspek Reuni Akbar SUPM N Kotaagung Angkatan 1 s/d 19.

- **Frontend / Client Tier**: React 19 / Next.js dengan TypeScript, Tailwind CSS, Lucide Icons, dan Motion Animation.
- **Data & Persistence Tier**: 
  - Mode Aktif: LocalStorage State Machine dengan validasi tipe statis & migrasi otomatis dari skema legacy.
  - Mode Cloud/Production: Firebase Firestore Database terdistribusi dengan struktur koleksi modular & Security Rules berbasis peran (RBAC).
- **Integritas Keuangan**: Pencatatan kas double-entry (Debit/Kredit), saldo berjalan real-time, tautan ke pos anggaran RAPB, serta modul rekonsiliasi mutasi rekening resmi panitia.
- **Dukungan Kohort Alumni**: Struktur kohort terstandarisasi untuk Angkatan 1 hingga 19 tanpa deviasi data.

---

### 2. STRUKTUR SKEMA KOLEKSI FIREBASE FIRESTORE

#### A. Koleksi \`participants\` (Data Alumni Angkatan 1–19)
\`\`\`typescript
interface ParticipantDocument {
  id: string;                      // ID dokumen (misal ALM-xxx atau Firebase UID)
  namaLengkap: string;             // Nama lengkap alumni
  angkatan: number;                // 1 s/d 19 (Angkatan 1–19 SUPM N Kotaagung)
  jurusan: 'NKN' | 'TKPI' | 'TPHP' | 'TPL' | 'Umum/Lainnya'; // Keahlian maritim/perikanan
  nomorKontak: string;             // Kontak terkonfirmasi
  kotaDomisili: string;            // Kota/Kabupaten domisili saat ini
  statusKehadiran: 'akan_hadir' | 'ragu_ragu' | 'tidak_hadir';
  statusVerifikasi: 'terverifikasi' | 'menunggu_verifikasi' | 'ditolak';
  jumlahPendamping: number;        // Jumlah keluarga/pendamping
  ukuranKaos?: 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
  catatanKhusus?: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
\`\`\`

#### B. Koleksi \`contributions\` (Pelacakan Iuran & Donasi per Angkatan)
\`\`\`typescript
interface ContributionDocument {
  id: string;
  participantId?: string;          // Relasi opsional ke ID peserta
  namaPenyumbang: string;
  angkatan: number;                // 1 s/d 19 (Struktur Angkatan)
  jenis: 'iuran_wajib_angkatan' | 'donasi_sukarela' | 'sponsorship' | 'partisipasi_souvenir';
  nominal: number;                 // Nilai kontribusi dalam Rupiah
  tanggalTransaksi: string;        // YYYY-MM-DD
  metodePembayaran: 'transfer_bank' | 'qris' | 'tunai' | 'menunggu_konfirmasi';
  referensiTransaksi: string;      // No referensi mutasi transfer / invoice
  statusVerifikasi: 'terverifikasi' | 'menunggu_verifikasi' | 'ditolak';
  buktiBayarUrl?: string;          // Storage link bukti transfer
  catatan: string;
  diverifikasiOleh?: string;       // Nama/UID Ketua Divisi Keuangan (Anas Rosyid)
  diverifikasiPada?: FirebaseFirestore.Timestamp;
  createdAt: FirebaseFirestore.Timestamp;
}
\`\`\`

#### C. Koleksi \`budget_items\` (Persetujuan Anggaran RAPB)
\`\`\`typescript
interface BudgetItemDocument {
  id: string;
  kodePos: string;                 // Misal: ACR-01, KNS-01, SEK-01
  divisi: string;                  // Nama Seksi Panitia Pelaksana
  uraian: string;                  // Deskripsi peruntukan dana
  alokasiAnggaran: number;         // Pagu yang diajukan
  realisasiTerpakai: number;       // Total pengeluaran aktual dari buku kas
  statusApproval: 'draft' | 'menunggu_persetujuan' | 'disetujui' | 'ditolak';
  diajukanOleh: string;
  tanggalPengajuan: string;
  disetujuiOleh?: string;          // Otorisasi Ketua Panitia / Super Admin
  tanggalApproval?: string;
  catatanReview?: string;
}
\`\`\`

#### D. Koleksi \`ledger_entries\` (Buku Kas & Jurnal Keuangan)
\`\`\`typescript
interface LedgerEntryDocument {
  id: string;
  nomorBukti: string;              // BKM-xxx (Kas Masuk) / BKK-xxx (Kas Keluar)
  tanggal: string;                 // Tanggal transaksi
  tipe: 'pemasukan' | 'pengeluaran';
  kategori: string;
  posAnggaranId?: string;          // Relasi foreign-key ke budget_items
  angkatanTerkait?: number;        // Relasi ke Angkatan 1–19 jika dari iuran
  uraian: string;
  debit: number;                   // Nominal Kas Masuk
  kredit: number;                  // Nominal Kas Keluar
  saldoBerjalan: number;           // Saldo akumulatif
  pihakTerkait: string;
  statusRekonsiliasi: 'cocok' | 'selisih' | 'pending';
  dibuatOleh: string;
  catatanAuditor?: string;
  createdAt: FirebaseFirestore.Timestamp;
}
\`\`\`

#### E. Koleksi \`reconciliation_records\` (Rekonsiliasi Bank & Audit)
\`\`\`typescript
interface ReconciliationDocument {
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
\`\`\`

#### F. Koleksi \`audit_logs\` (Audit Trail & Jejak Keamanan)
\`\`\`typescript
interface AuditLogDocument {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  aksi: string;                    // APPROVE_BUDGET, VERIFY_PARTICIPANT, dll.
  modul: string;
  entitasId: string;
  deskripsi: string;
  detailSebelum?: string;
  detailSesudah?: string;
}
\`\`\`

---

### 3. KEBIJAKAN ATURAN KEAMANAN (FIRESTORE SECURITY RULES)
\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Fungsi pembantu pengecekan peran (RBAC)
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserRole() {
      return request.auth.token.role;
    }
    
    function isSuperAdmin() {
      return isAuthenticated() && getUserRole() == 'super_admin';
    }
    
    function isKetuaKeuangan() {
      return isAuthenticated() && (getUserRole() in ['ketua_keuangan', 'bendahara'] || isSuperAdmin());
    }
    
    function isAuditor() {
      return isAuthenticated() && (getUserRole() == 'auditor' || isSuperAdmin());
    }
    
    // Aturan Peserta: Pendaftaran terbuka, verifikasi oleh Sekretaris / Seksi Acara / Admin
    match /participants/{id} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if isAuthenticated() && (getUserRole() in ['sekretaris', 'seksi_acara', 'super_admin']);
    }
    
    // Aturan Kontribusi & Iuran: Ketua Divisi Keuangan dan Super Admin
    match /contributions/{id} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isKetuaKeuangan();
    }
    
    // Aturan Anggaran (RAPB): Ketua Pelaksana menyetujui, divisi mengajukan
    match /budget_items/{id} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isSuperAdmin() || isKetuaKeuangan();
      allow delete: if isSuperAdmin();
    }
    
    // Aturan Buku Kas (Ledger): Langsung Ketua Divisi Keuangan & Super Admin
    match /ledger_entries/{id} {
      allow read: if isAuthenticated();
      allow create, update: if isKetuaKeuangan();
      allow delete: if isSuperAdmin();
    }
    
    // Aturan Rekonsiliasi: Auditor, Ketua Divisi Keuangan, Super Admin
    match /reconciliation_records/{id} {
      allow read: if isAuthenticated();
      allow create, update: if isAuditor() || isKetuaKeuangan();
      allow delete: if isSuperAdmin();
    }
    
    // Aturan Audit Trail: Append-only, tidak boleh dihapus atau diubah
    match /audit_logs/{id} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if false; // Immutability guarantee
    }
  }
}
\`\`\`
`;

export const PANDUAN_PENGGUNAAN_RESMI = `
# PANDUAN PENGGUNAAN RESMI (USER MANUAL)
## SUPMN Kotaagung Reunion Command Center (SUPMN Reunion OS)
### Reuni Akbar SUPM N Kotaagung Angkatan 1–19

Selamat datang di sistem komando dan manajemen data resmi Reuni Akbar SUPM N Kotaagung Angkatan 1 s/d 19.
Sistem ini memfasilitasi koordinasi lintas 19 angkatan alumni dengan akuntabilitas penuh dan transparansi anggaran.

---

### PERAN PENGGUNA (ROLE-BASED ACCESS CONTROL)
1. **Ketua Pelaksana (Super Admin - Yurisa)**:
   - Akses penuh ke seluruh modul sistem dan pengelolaan panitia (Admin Access).
   - Otorisasi dan persetujuan pengajuan anggaran (Budget Approval RAPB).
   - Peninjauan ringkasan eksekutif dan jejak audit (Audit Trail).

2. **Ketua Divisi Keuangan (Anas Rosyid - Angkatan 5)**:
   - *Catatan Penting*: Tidak ada Bendahara Umum; tanggung jawab dan kewenangan mutasi kas, iuran, dan pembukuan berada langsung di bawah Ketua Divisi Keuangan.
   - Pengelolaan verifikasi iuran dan donasi masuk dari Angkatan 1–19.
   - Pencatatan transaksi Buku Kas Umum (BKM Kas Masuk dan BKK Kas Keluar).
   - Pengelolaan rekonsiliasi bank dan bukti transfer.

3. **Sekretariat (Fitri Ariantini / Amanda Cindy - Angkatan 6)**:
   - Pengelolaan database peserta pendaftaran alumni per Angkatan 1–19.
   - Administrasi dokumen SK, surat keluar/masuk, dan notula rapat pleno.

4. **Divisi Acara (Ketua: Romi Handoko - Angkatan 4)**:
   - Divisi terbesar dengan 19 personil panitia dan 10 scoop tugas operasional terinci.
   - Penanggung jawab rundown, panggung/sound, konsumsi pesisir, seragam/kaos, gate check-in, pamdal/parkir, posko medis, sesi guru purnabakti, hiburan nostalgia, dan photo wall of fame.

5. **Divisi Komunikasi Eksternal & Digital (Ketua: Ira S - Angkatan 14)**:
   - Koordinasi 19 Koordinator Angkatan (Angkatan 1–19).
   - Penyebaran broadcast resmi WhatsApp dan materi publikasi.

6. **Koordinator Angkatan (Angkatan 1–19)**:
   - Akses terfokus pada kemajuan pendaftaran dan kontribusi angkatannya masing-masing.
   - Pendaftaran peserta alumni secara kolektif untuk angkatan yang diwakili.

7. **Auditor & Dewan Pengarah (JALASKA)**:
   - Akses pengawasan independen terhadap transaksi keuangan.
   - Melakukan rekonsiliasi mutasi rekening koran terhadap Buku Kas.
   - Memastikan transparansi dan akuntabilitas kepanitiaan.

---

### ALUR OPERASIONAL UTAMA

#### 1. Registrasi Peserta & Database Kohort Alumni
- Buka submenu **Divisi Sekretaris -> Database Peserta**.
- Gunakan filter **Angkatan 1 s/d 19** untuk menyaring data spesifik angkatan tertentu.
- Klik **+ Tambah Peserta Alumni** untuk mendaftarkan nama alumni, angkatan (1–19), program keahlian (NKN, TKPI, TPHP, TPL), kota domisili, status kehadiran, dan pendamping.
- Petugas Registrasi dapat memverifikasi status pendaftaran dengan satu kali klik.

#### 2. Pelacakan Kontribusi & Iuran Angkatan
- Buka submenu **Divisi Keuangan -> Pelacakan Iuran**.
- Setiap setoran kontribusi (iuran per angkatan, donasi, atau sponsor) dicatat dengan memilih Angkatan 1–19 terkait.
- Ketua Divisi Keuangan meninjau nomor referensi dan mengubah status menjadi **Terverifikasi**.

#### 3. Persetujuan Anggaran (RAPB)
- Buka submenu **Divisi Keuangan -> Alokasi Anggaran (RAPB)**.
- Setiap divisi panitia dapat mengajukan pos anggaran (contoh: Panggung, Konsumsi, Publikasi).
- Ketua Pelaksana / Super Admin dapat menyetujui (**Disetujui**) atau menolak (**Ditolak**) disertai catatan review resmi.

#### 4. Buku Kas & Jurnal Umum (Double-Entry)
- Buka submenu **Divisi Keuangan -> Buku Kas Umum**.
- Setiap pengeluaran harus ditautkan ke Pos Anggaran yang telah disetujui.
- Saldo kas dihitung secara otomatis dan real-time.

#### 5. Rekonsiliasi Bank & Pembayaran
- Buka submenu **Divisi Keuangan -> Rekonsiliasi Bank**.
- Ketua Divisi Keuangan & Auditor membandingkan mutasi fisik/digital bank dengan jurnal buku kas.
- Sistem menandai status **Cocok** atau **Selisih** untuk memastikan transparansi tanpa toleransi kebocoran.

#### 6. Manajemen Pengguna & Hak Akses (Admin Access)
- Klik tombol **Kelola Panitia (Admin)** untuk mengedit nama, nomor handphone (WA), jabatan resmi, dan divisi anggota panitia secara fleksibel.
- Seluruh tindakan penting dicatat secara otomatis dalam log audit yang tidak dapat diubah (append-only).
`;
