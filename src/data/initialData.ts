import { 
  EventConfig, 
  Participant, 
  Contribution, 
  BudgetItem, 
  LedgerEntry, 
  ReconciliationRecord, 
  AuditLog, 
  UserSession,
  SuratDokumen,
  RundownItem,
  KoordinatorAngkatan,
  BroadcastTemplate,
  ScoopAcara,
  DivisionTask,
  DAFTAR_ANGKATAN
} from '../types';

export const INITIAL_EVENT_CONFIG: EventConfig = {
  namaEvent: 'Reuni Akbar SUPM N Kotaagung Angkatan 1–19',
  namaAplikasi: 'SUPMN Kotaagung Reunion Command Center',
  namaSingkat: 'SUPMN Reunion OS',
  tanggalPelaksanaan: 'Menunggu Keputusan Rapat Pleno Panitia',
  lokasiPelaksanaan: 'Kampus SUPM Negeri Kotaagung (Menunggu Penetapan Panitia)',
  statusRekeningResmi: 'Menunggu SK Panitia & Penetapan Ketua Divisi Keuangan',
  catatanKebijakanIuran: 'Skema partisipasi iuran dan donasi sukarela ditetapkan secara mufakat oleh panitia bersama perwakilan angkatan 1–19, dikoordinasikan langsung oleh Divisi Keuangan.',
  kontakSekretariat: 'Sekretariat Panitia Reuni Akbar SUPM N Kotaagung (Fitri Ariantini & Amanda Cindy)',
};

export const INITIAL_USERS: UserSession[] = [
  // Super User & Ketua Divisi Keuangan (Tanggung Jawab Keuangan Langsung)
  {
    id: 'USR-001',
    name: 'Anas Rosyid',
    role: 'super_admin',
    jabatanLabel: 'Super Admin & Ketua Divisi Keuangan',
    divisi: 'Keuangan',
    angkatan: 5,
    noHp: '0813-6789-0005',
    email: 'anas.rosyid@reuni-supmn-kotaagung.org'
  },
  // Pimpinan & Ketua Pelaksana
  {
    id: 'USR-002',
    name: 'Yurisa',
    role: 'super_admin',
    jabatanLabel: 'Ketua Pelaksana',
    divisi: 'Pimpinan',
    angkatan: 6,
    noHp: '0812-7890-0006',
    email: 'yurisa.ketua@reuni-supmn-kotaagung.org'
  },
  // Sekretariat
  {
    id: 'USR-003',
    name: 'Fitri Ariantini',
    role: 'sekretaris',
    jabatanLabel: 'Sekretaris I',
    divisi: 'Sekretariat',
    angkatan: 6,
    noHp: '0852-6701-0006',
    email: 'fitri.ariantini@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-004',
    name: 'Amanda Cindy',
    role: 'sekretaris',
    jabatanLabel: 'Sekretaris II',
    divisi: 'Sekretariat',
    angkatan: 6,
    noHp: '0853-6702-0006',
    email: 'amanda.cindy@reuni-supmn-kotaagung.org'
  },
  // Divisi Acara - Pimpinan
  {
    id: 'USR-005',
    name: 'Romi Handoko',
    role: 'ketua_acara',
    jabatanLabel: 'Ketua Divisi Acara',
    divisi: 'Acara',
    angkatan: 4,
    noHp: '0812-3401-0004',
    email: 'romi.handoko@reuni-supmn-kotaagung.org'
  },
  // Divisi Komunikasi External & Digital - Pimpinan
  {
    id: 'USR-006',
    name: 'Ira S',
    role: 'ketua_publikasi',
    jabatanLabel: 'Ketua Divisi Komunikasi External & Digital',
    divisi: 'Komunikasi Eksternal & Digital',
    angkatan: 14,
    noHp: '0878-5601-0014',
    email: 'ira.s@reuni-supmn-kotaagung.org'
  },
  // Anggota Divisi Acara (18 Anggota)
  {
    id: 'USR-ACR-01',
    name: 'Yogi Faisal',
    role: 'anggota_acara',
    jabatanLabel: 'Divisi Acara (PJ Protokoler & Upacara)',
    divisi: 'Acara',
    angkatan: 5,
    noHp: '0812-5501-0005',
    email: 'yogi.faisal@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-ACR-02',
    name: 'Arief',
    role: 'anggota_acara',
    jabatanLabel: 'Divisi Acara (Sesi Temu Kangen)',
    divisi: 'Acara',
    angkatan: 6,
    noHp: '0813-5502-0006',
    email: 'arief@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-ACR-03',
    name: 'Eko Rahmanto',
    role: 'anggota_acara',
    jabatanLabel: 'Divisi Acara (PJ Panggung & Sound)',
    divisi: 'Acara',
    angkatan: 6,
    noHp: '0821-5503-0006',
    email: 'eko.rahmanto@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-ACR-04',
    name: 'Muhammad Imdadur',
    role: 'anggota_acara',
    jabatanLabel: 'Divisi Acara (Teknis & Genset)',
    divisi: 'Acara',
    angkatan: 7,
    noHp: '0852-5504-0007',
    email: 'muhammad.imdadur@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-ACR-05',
    name: 'Rachel',
    role: 'anggota_acara',
    jabatanLabel: 'Divisi Acara (Gate & Registrasi Onsite)',
    divisi: 'Acara',
    angkatan: 14,
    noHp: '0896-5505-0014',
    email: 'rachel@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-ACR-06',
    name: 'Ayu Rihasni',
    role: 'anggota_acara',
    jabatanLabel: 'Divisi Acara (PJ Konsumsi & Prasmanan)',
    divisi: 'Acara',
    angkatan: 9,
    noHp: '0877-5506-0009',
    email: 'ayu.rihasni@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-ACR-07',
    name: 'Agus Wiyanto',
    role: 'anggota_acara',
    jabatanLabel: 'Divisi Acara (Venue & Lapangan Apel)',
    divisi: 'Acara',
    angkatan: 4,
    noHp: '0819-5507-0004',
    email: 'agus.wiyanto@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-ACR-08',
    name: 'Nadya Maulida',
    role: 'anggota_acara',
    jabatanLabel: 'Divisi Acara (Protokoler VIP Guru)',
    divisi: 'Acara',
    angkatan: 6,
    noHp: '0812-5508-0006',
    email: 'nadya.maulida@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-ACR-09',
    name: 'Imam Muddin',
    role: 'anggota_acara',
    jabatanLabel: 'Divisi Acara (Rundown & Doa Bersama)',
    divisi: 'Acara',
    angkatan: 4,
    noHp: '0813-5509-0004',
    email: 'imam.muddin@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-ACR-10',
    name: 'Zaiyin Sulaiman',
    role: 'anggota_acara',
    jabatanLabel: 'Divisi Acara (PJ Keamanan & Parkir)',
    divisi: 'Acara',
    angkatan: 7,
    noHp: '0822-5510-0007',
    email: 'zaiyin.sulaiman@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-ACR-11',
    name: 'Sarizon',
    role: 'anggota_acara',
    jabatanLabel: 'Divisi Acara (Logistik Perlengkapan)',
    divisi: 'Acara',
    angkatan: 13,
    noHp: '0853-5511-0013',
    email: 'sarizon@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-ACR-12',
    name: 'Virda',
    role: 'anggota_acara',
    jabatanLabel: 'Divisi Acara (Penerima Tamu & Kaos)',
    divisi: 'Acara',
    angkatan: 11,
    noHp: '0812-5512-0011',
    email: 'virda@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-ACR-13',
    name: 'Ali Gufron',
    role: 'anggota_acara',
    jabatanLabel: 'Divisi Acara (Tata Panggung & Multimedia)',
    divisi: 'Acara',
    angkatan: 14,
    noHp: '0878-5513-0014',
    email: 'ali.gufron@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-ACR-14',
    name: 'Novando',
    role: 'anggota_acara',
    jabatanLabel: 'Divisi Acara (PJ Gate Presensi)',
    divisi: 'Acara',
    angkatan: 10,
    noHp: '0895-5514-0010',
    email: 'novando@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-ACR-15',
    name: 'Ferly Primanasa',
    role: 'anggota_acara',
    jabatanLabel: 'Divisi Acara (Operasional Lapangan)',
    divisi: 'Acara',
    angkatan: 16,
    noHp: '0813-5515-0016',
    email: 'ferly.primanasa@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-ACR-16',
    name: 'Adi Nugroho',
    role: 'anggota_acara',
    jabatanLabel: 'Divisi Acara (Check-in Scanner)',
    divisi: 'Acara',
    angkatan: 10,
    noHp: '0821-5516-0010',
    email: 'adi.nugroho@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-ACR-17',
    name: 'Riva Rohadatul',
    role: 'anggota_acara',
    jabatanLabel: 'Divisi Acara (Konsumsi & P3K Medis)',
    divisi: 'Acara',
    angkatan: 15,
    noHp: '0852-5517-0015',
    email: 'riva.rohadatul@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-ACR-18',
    name: 'Kharis M',
    role: 'anggota_acara',
    jabatanLabel: 'Divisi Acara (PJ Seragam & Souvenir Kaos)',
    divisi: 'Acara',
    angkatan: 8,
    noHp: '0812-5518-0008',
    email: 'kharis.m@reuni-supmn-kotaagung.org'
  },
  // Anggota Divisi Keuangan (5 Anggota)
  {
    id: 'USR-KEU-01',
    name: 'Ohita',
    role: 'anggota_keuangan',
    jabatanLabel: 'Divisi Keuangan (Verifikasi Mutasi Bank)',
    divisi: 'Keuangan',
    angkatan: 7,
    noHp: '0812-4401-0007',
    email: 'ohita@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-KEU-02',
    name: 'Rona Elvisa',
    role: 'anggota_keuangan',
    jabatanLabel: 'Divisi Keuangan (Pelacakan Iuran Angkatan)',
    divisi: 'Keuangan',
    angkatan: 14,
    noHp: '0852-4402-0014',
    email: 'rona.elvisa@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-KEU-03',
    name: 'Nata Pasena',
    role: 'anggota_keuangan',
    jabatanLabel: 'Divisi Keuangan (Buku Kas Umum Masuk)',
    divisi: 'Keuangan',
    angkatan: 7,
    noHp: '0813-4403-0007',
    email: 'nata.pasena@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-KEU-04',
    name: 'Monica',
    role: 'anggota_keuangan',
    jabatanLabel: 'Divisi Keuangan (Kuitansi & Bukti Pengeluaran)',
    divisi: 'Keuangan',
    angkatan: 14,
    noHp: '0896-4404-0014',
    email: 'monica@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-KEU-05',
    name: 'Wisnu Prabowo',
    role: 'anggota_keuangan',
    jabatanLabel: 'Divisi Keuangan (Rekonsiliasi & Jurnal Kas)',
    divisi: 'Keuangan',
    angkatan: 10,
    noHp: '0821-4405-0010',
    email: 'wisnu.prabowo@reuni-supmn-kotaagung.org'
  },
  // Anggota Divisi Komunikasi External & Digital (5 Anggota)
  {
    id: 'USR-PUB-01',
    name: 'Ana Yuliana',
    role: 'anggota_publikasi',
    jabatanLabel: 'Divisi Komunikasi & Digital (Broadcast WhatsApp)',
    divisi: 'Komunikasi Eksternal & Digital',
    angkatan: 5,
    noHp: '0812-3301-0005',
    email: 'ana.yuliana@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-PUB-02',
    name: 'Dwi Salsabila',
    role: 'anggota_publikasi',
    jabatanLabel: 'Divisi Komunikasi & Digital (Desain & Sosial Media)',
    divisi: 'Komunikasi Eksternal & Digital',
    angkatan: 13,
    noHp: '0853-3302-0013',
    email: 'dwi.salsabila@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-PUB-03',
    name: 'Bastian Muiz',
    role: 'anggota_publikasi',
    jabatanLabel: 'Divisi Komunikasi & Digital (Hub Koordinator Angkatan)',
    divisi: 'Komunikasi Eksternal & Digital',
    angkatan: 6,
    noHp: '0813-3303-0006',
    email: 'bastian.muiz@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-PUB-04',
    name: 'Aji Anugrah Akbar',
    role: 'anggota_publikasi',
    jabatanLabel: 'Divisi Komunikasi & Digital (Dokumentasi & Video)',
    divisi: 'Komunikasi Eksternal & Digital',
    angkatan: 18,
    noHp: '0895-3304-0018',
    email: 'aji.anugrah@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-PUB-05',
    name: 'Disya Nasya',
    role: 'anggota_publikasi',
    jabatanLabel: 'Divisi Komunikasi & Digital (Informasi & Helpdesk)',
    divisi: 'Komunikasi Eksternal & Digital',
    angkatan: 19,
    noHp: '0878-3305-0019',
    email: 'disya.nasya@reuni-supmn-kotaagung.org'
  },
  // Dewan Pengarah
  {
    id: 'USR-DIR-01',
    name: 'Hasbi',
    role: 'dewan_pengarah',
    jabatanLabel: 'Ketua JALASKA (Dewan Pengarah)',
    divisi: 'Pengarah',
    angkatan: 'JALASKA',
    noHp: '0811-1001-0001',
    email: 'hasbi.jalaska@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-DIR-02',
    name: 'Kepala SUPMN Kota Agung',
    role: 'dewan_pengarah',
    jabatanLabel: 'Kepala Sekolah SUPM Negeri Kotaagung (Dewan Pengarah)',
    divisi: 'Pengarah',
    angkatan: 'SUPMN',
    noHp: '0811-1002-0002',
    email: 'kepala.supmn@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-DIR-03',
    name: 'Deni Aulia',
    role: 'dewan_pengarah',
    jabatanLabel: 'Perwakilan Alumni Angkatan I (Dewan Pengarah)',
    divisi: 'Pengarah',
    angkatan: 1,
    noHp: '0812-1003-0001',
    email: 'deni.aulia@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-DIR-04',
    name: 'Ikrom',
    role: 'dewan_pengarah',
    jabatanLabel: 'Perwakilan Alumni Angkatan II (Dewan Pengarah)',
    divisi: 'Pengarah',
    angkatan: 2,
    noHp: '0813-1004-0002',
    email: 'ikrom@reuni-supmn-kotaagung.org'
  },
  {
    id: 'USR-DIR-05',
    name: 'Aldo',
    role: 'dewan_pengarah',
    jabatanLabel: 'Perwakilan Alumni Angkatan III (Dewan Pengarah)',
    divisi: 'Pengarah',
    angkatan: 3,
    noHp: '0814-1005-0003',
    email: 'aldo@reuni-supmn-kotaagung.org'
  },
  // Koordinator Angkatan 1–19 (19 Koordinator sebagai User Terdaftar)
  {
    id: 'USR-KOR-01',
    name: 'Zulkifli Mansyur',
    role: 'koordinator_angkatan',
    jabatanLabel: 'Koordinator Angkatan 1',
    divisi: 'Koordinator Angkatan',
    angkatan: 1,
    noHp: '0812-3401-0001',
    email: 'kor.angkatan1@reuni-supmn-kotaagung.org',
    assignedAngkatan: 1
  },
  {
    id: 'USR-KOR-02',
    name: 'H. Sudrajat Effendi',
    role: 'koordinator_angkatan',
    jabatanLabel: 'Koordinator Angkatan 2',
    divisi: 'Koordinator Angkatan',
    angkatan: 2,
    noHp: '0813-3402-0002',
    email: 'kor.angkatan2@reuni-supmn-kotaagung.org',
    assignedAngkatan: 2
  },
  {
    id: 'USR-KOR-03',
    name: 'M. Yusuf Bahar',
    role: 'koordinator_angkatan',
    jabatanLabel: 'Koordinator Angkatan 3',
    divisi: 'Koordinator Angkatan',
    angkatan: 3,
    noHp: '0812-3403-0003',
    email: 'kor.angkatan3@reuni-supmn-kotaagung.org',
    assignedAngkatan: 3
  },
  {
    id: 'USR-KOR-04',
    name: 'Dewi Kartika',
    role: 'koordinator_angkatan',
    jabatanLabel: 'Koordinator Angkatan 4',
    divisi: 'Koordinator Angkatan',
    angkatan: 4,
    noHp: '0813-3404-0004',
    email: 'kor.angkatan4@reuni-supmn-kotaagung.org',
    assignedAngkatan: 4
  },
  {
    id: 'USR-KOR-05',
    name: 'Rahmat Hidayat',
    role: 'koordinator_angkatan',
    jabatanLabel: 'Koordinator Angkatan 5',
    divisi: 'Koordinator Angkatan',
    angkatan: 5,
    noHp: '0812-3405-0005',
    email: 'kor.angkatan5@reuni-supmn-kotaagung.org',
    assignedAngkatan: 5
  },
  {
    id: 'USR-KOR-06',
    name: 'Wahyudi Santoso',
    role: 'koordinator_angkatan',
    jabatanLabel: 'Koordinator Angkatan 6',
    divisi: 'Koordinator Angkatan',
    angkatan: 6,
    noHp: '0813-3406-0006',
    email: 'kor.angkatan6@reuni-supmn-kotaagung.org',
    assignedAngkatan: 6
  },
  {
    id: 'USR-KOR-07',
    name: 'Eko Prasetyo',
    role: 'koordinator_angkatan',
    jabatanLabel: 'Koordinator Angkatan 7',
    divisi: 'Koordinator Angkatan',
    angkatan: 7,
    noHp: '0812-3407-0007',
    email: 'kor.angkatan7@reuni-supmn-kotaagung.org',
    assignedAngkatan: 7
  },
  {
    id: 'USR-KOR-08',
    name: 'Herman Sutanto',
    role: 'koordinator_angkatan',
    jabatanLabel: 'Koordinator Angkatan 8',
    divisi: 'Koordinator Angkatan',
    angkatan: 8,
    noHp: '0813-3408-0008',
    email: 'kor.angkatan8@reuni-supmn-kotaagung.org',
    assignedAngkatan: 8
  },
  {
    id: 'USR-KOR-09',
    name: 'Rina Maryana',
    role: 'koordinator_angkatan',
    jabatanLabel: 'Koordinator Angkatan 9',
    divisi: 'Koordinator Angkatan',
    angkatan: 9,
    noHp: '0812-3409-0009',
    email: 'kor.angkatan9@reuni-supmn-kotaagung.org',
    assignedAngkatan: 9
  },
  {
    id: 'USR-KOR-10',
    name: 'Doni Firmansyah',
    role: 'koordinator_angkatan',
    jabatanLabel: 'Koordinator Angkatan 10',
    divisi: 'Koordinator Angkatan',
    angkatan: 10,
    noHp: '0813-3410-0010',
    email: 'kor.angkatan10@reuni-supmn-kotaagung.org',
    assignedAngkatan: 10
  },
  {
    id: 'USR-KOR-11',
    name: 'Fajar Nugraha',
    role: 'koordinator_angkatan',
    jabatanLabel: 'Koordinator Angkatan 11',
    divisi: 'Koordinator Angkatan',
    angkatan: 11,
    noHp: '0812-3411-0011',
    email: 'kor.angkatan11@reuni-supmn-kotaagung.org',
    assignedAngkatan: 11
  },
  {
    id: 'USR-KOR-12',
    name: 'Budi Kurniawan',
    role: 'koordinator_angkatan',
    jabatanLabel: 'Koordinator Angkatan 12',
    divisi: 'Koordinator Angkatan',
    angkatan: 12,
    noHp: '0813-3412-0012',
    email: 'kor.angkatan12@reuni-supmn-kotaagung.org',
    assignedAngkatan: 12
  },
  {
    id: 'USR-KOR-13',
    name: 'Irfan Hakim',
    role: 'koordinator_angkatan',
    jabatanLabel: 'Koordinator Angkatan 13',
    divisi: 'Koordinator Angkatan',
    angkatan: 13,
    noHp: '0812-3413-0013',
    email: 'kor.angkatan13@reuni-supmn-kotaagung.org',
    assignedAngkatan: 13
  },
  {
    id: 'USR-KOR-14',
    name: 'Arif Wibowo',
    role: 'koordinator_angkatan',
    jabatanLabel: 'Koordinator Angkatan 14',
    divisi: 'Koordinator Angkatan',
    angkatan: 14,
    noHp: '0813-3414-0014',
    email: 'kor.angkatan14@reuni-supmn-kotaagung.org',
    assignedAngkatan: 14
  },
  {
    id: 'USR-KOR-15',
    name: 'Bagus Priyambodo',
    role: 'koordinator_angkatan',
    jabatanLabel: 'Koordinator Angkatan 15',
    divisi: 'Koordinator Angkatan',
    angkatan: 15,
    noHp: '0812-3415-0015',
    email: 'kor.angkatan15@reuni-supmn-kotaagung.org',
    assignedAngkatan: 15
  },
  {
    id: 'USR-KOR-16',
    name: 'Rian Pratama',
    role: 'koordinator_angkatan',
    jabatanLabel: 'Koordinator Angkatan 16',
    divisi: 'Koordinator Angkatan',
    angkatan: 16,
    noHp: '0813-3416-0016',
    email: 'kor.angkatan16@reuni-supmn-kotaagung.org',
    assignedAngkatan: 16
  },
  {
    id: 'USR-KOR-17',
    name: 'Septian Dwi',
    role: 'koordinator_angkatan',
    jabatanLabel: 'Koordinator Angkatan 17',
    divisi: 'Koordinator Angkatan',
    angkatan: 17,
    noHp: '0812-3417-0017',
    email: 'kor.angkatan17@reuni-supmn-kotaagung.org',
    assignedAngkatan: 17
  },
  {
    id: 'USR-KOR-18',
    name: 'M. Rizky Pratama',
    role: 'koordinator_angkatan',
    jabatanLabel: 'Koordinator Angkatan 18',
    divisi: 'Koordinator Angkatan',
    angkatan: 18,
    noHp: '0813-3418-0018',
    email: 'kor.angkatan18@reuni-supmn-kotaagung.org',
    assignedAngkatan: 18
  },
  {
    id: 'USR-KOR-19',
    name: 'Dinda Ayu Lestari',
    role: 'koordinator_angkatan',
    jabatanLabel: 'Koordinator Angkatan 19',
    divisi: 'Koordinator Angkatan',
    angkatan: 19,
    noHp: '0812-3419-0019',
    email: 'kor.angkatan19@reuni-supmn-kotaagung.org',
    assignedAngkatan: 19
  }
];

export const INITIAL_PARTICIPANTS: Participant[] = [
  {
    id: 'ALM-001',
    namaLengkap: 'Zulkifli Mansyur',
    angkatan: 1,
    jurusan: 'NKN',
    nomorKontak: '0812-XXXX-0001',
    kotaDomisili: 'Bandar Lampung',
    statusKehadiran: 'akan_hadir',
    statusVerifikasi: 'terverifikasi',
    jumlahPendamping: 1,
    ukuranKaos: 'XL',
    catatanKhusus: 'Alumni Angkatan Perintis (Angkatan 1)',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-02T10:15:00Z'
  },
  {
    id: 'ALM-002',
    namaLengkap: 'H. Sudrajat Effendi',
    angkatan: 2,
    jurusan: 'TKPI',
    nomorKontak: '0813-XXXX-0002',
    kotaDomisili: 'Kotaagung, Tanggamus',
    statusKehadiran: 'akan_hadir',
    statusVerifikasi: 'terverifikasi',
    jumlahPendamping: 0,
    ukuranKaos: 'L',
    catatanKhusus: 'Siap membantu koordinasi lokal Tanggamus',
    createdAt: '2026-09-03T09:20:00Z',
    updatedAt: '2026-09-03T11:00:00Z'
  },
  {
    id: 'ALM-003',
    namaLengkap: 'Dewi Kartika',
    angkatan: 4,
    jurusan: 'TPHP',
    nomorKontak: '0852-XXXX-0004',
    kotaDomisili: 'Jakarta Utara',
    statusKehadiran: 'akan_hadir',
    statusVerifikasi: 'terverifikasi',
    jumlahPendamping: 2,
    ukuranKaos: 'M',
    createdAt: '2026-09-05T14:10:00Z',
    updatedAt: '2026-09-05T15:00:00Z'
  },
  {
    id: 'ALM-004',
    namaLengkap: 'Agus Setiawan',
    angkatan: 5,
    jurusan: 'TPL',
    nomorKontak: '0821-XXXX-0005',
    kotaDomisili: 'Serang, Banten',
    statusKehadiran: 'akan_hadir',
    statusVerifikasi: 'terverifikasi',
    jumlahPendamping: 1,
    ukuranKaos: 'L',
    createdAt: '2026-09-07T11:45:00Z',
    updatedAt: '2026-09-08T09:30:00Z'
  },
  {
    id: 'ALM-005',
    namaLengkap: 'Eko Prasetyo',
    angkatan: 7,
    jurusan: 'NKN',
    nomorKontak: '0819-XXXX-0007',
    kotaDomisili: 'Surabaya',
    statusKehadiran: 'ragu_ragu',
    statusVerifikasi: 'menunggu_verifikasi',
    jumlahPendamping: 0,
    ukuranKaos: 'L',
    catatanKhusus: 'Menunggu konfirmasi jadwal cuti pelayaran',
    createdAt: '2026-09-10T16:00:00Z',
    updatedAt: '2026-09-10T16:00:00Z'
  },
  {
    id: 'ALM-006',
    namaLengkap: 'Rina Maryana',
    angkatan: 9,
    jurusan: 'TPHP',
    nomorKontak: '0878-XXXX-0009',
    kotaDomisili: 'Palembang',
    statusKehadiran: 'akan_hadir',
    statusVerifikasi: 'terverifikasi',
    jumlahPendamping: 1,
    ukuranKaos: 'M',
    createdAt: '2026-09-12T13:25:00Z',
    updatedAt: '2026-09-13T10:00:00Z'
  },
  {
    id: 'ALM-007',
    namaLengkap: 'Fajar Nugraha',
    angkatan: 11,
    jurusan: 'TKPI',
    nomorKontak: '0812-XXXX-0011',
    kotaDomisili: 'Tangerang',
    statusKehadiran: 'akan_hadir',
    statusVerifikasi: 'terverifikasi',
    jumlahPendamping: 0,
    ukuranKaos: 'XL',
    createdAt: '2026-09-14T08:50:00Z',
    updatedAt: '2026-09-15T12:00:00Z'
  },
  {
    id: 'ALM-008',
    namaLengkap: 'Irfan Hakim',
    angkatan: 13,
    jurusan: 'TPL',
    nomorKontak: '0813-XXXX-0013',
    kotaDomisili: 'Kalianda, Lampung Selatan',
    statusKehadiran: 'akan_hadir',
    statusVerifikasi: 'terverifikasi',
    jumlahPendamping: 1,
    ukuranKaos: 'L',
    createdAt: '2026-09-18T10:15:00Z',
    updatedAt: '2026-09-19T09:40:00Z'
  },
  {
    id: 'ALM-009',
    namaLengkap: 'Bagus Priyambodo',
    angkatan: 15,
    jurusan: 'NKN',
    nomorKontak: '0857-XXXX-0015',
    kotaDomisili: 'Cirebon',
    statusKehadiran: 'akan_hadir',
    statusVerifikasi: 'menunggu_verifikasi',
    jumlahPendamping: 0,
    ukuranKaos: 'XXL',
    catatanKhusus: 'Menunggu konfirmasi verifikasi nomor kontak',
    createdAt: '2026-09-21T15:20:00Z',
    updatedAt: '2026-09-21T15:20:00Z'
  },
  {
    id: 'ALM-010',
    namaLengkap: 'Muhammad Rizky Pratama',
    angkatan: 18,
    jurusan: 'TPHP',
    nomorKontak: '0896-XXXX-0018',
    kotaDomisili: 'Bandar Lampung',
    statusKehadiran: 'akan_hadir',
    statusVerifikasi: 'terverifikasi',
    jumlahPendamping: 0,
    ukuranKaos: 'L',
    createdAt: '2026-09-24T17:30:00Z',
    updatedAt: '2026-09-25T11:20:00Z'
  },
  {
    id: 'ALM-011',
    namaLengkap: 'Dinda Ayu Lestari',
    angkatan: 19,
    jurusan: 'TPL',
    nomorKontak: '0812-XXXX-0019',
    kotaDomisili: 'Kotaagung',
    statusKehadiran: 'akan_hadir',
    statusVerifikasi: 'terverifikasi',
    jumlahPendamping: 0,
    ukuranKaos: 'S',
    catatanKhusus: 'Angkatan termuda (Angkatan 19)',
    createdAt: '2026-09-26T09:00:00Z',
    updatedAt: '2026-09-26T14:30:00Z'
  }
];

export const INITIAL_CONTRIBUTIONS: Contribution[] = [
  {
    id: 'CTR-001',
    participantId: 'ALM-001',
    namaPenyumbang: 'Zulkifli Mansyur (Angkatan 1)',
    angkatan: 1,
    jenis: 'iuran_wajib_angkatan',
    nominal: 500000,
    tanggalTransaksi: '2026-09-02',
    metodePembayaran: 'transfer_bank',
    referensiTransaksi: 'TRX-SUPM-AKT01-001',
    statusVerifikasi: 'terverifikasi',
    catatan: 'Iuran partisipasi perwakilan Angkatan 1',
    diverifikasiOleh: 'Nur Aisyah, S.St.Pi',
    diverifikasiPada: '2026-09-02T11:00:00Z',
    createdAt: '2026-09-02T10:15:00Z',
    updatedAt: '2026-09-02T11:00:00Z'
  },
  {
    id: 'CTR-002',
    participantId: 'ALM-002',
    namaPenyumbang: 'H. Sudrajat Effendi (Angkatan 2)',
    angkatan: 2,
    jenis: 'donasi_sukarela',
    nominal: 2000000,
    tanggalTransaksi: '2026-09-03',
    metodePembayaran: 'transfer_bank',
    referensiTransaksi: 'TRX-SUPM-AKT02-DONASI',
    statusVerifikasi: 'terverifikasi',
    catatan: 'Donasi sukarela sarana & sound system',
    diverifikasiOleh: 'Nur Aisyah, S.St.Pi',
    diverifikasiPada: '2026-09-03T11:30:00Z',
    createdAt: '2026-09-03T11:00:00Z',
    updatedAt: '2026-09-03T11:30:00Z'
  },
  {
    id: 'CTR-003',
    participantId: 'ALM-004',
    namaPenyumbang: 'Kolektif Angkatan 5 (Koordinator Rahmat H)',
    angkatan: 5,
    jenis: 'iuran_wajib_angkatan',
    nominal: 2500000,
    tanggalTransaksi: '2026-09-08',
    metodePembayaran: 'transfer_bank',
    referensiTransaksi: 'TRX-SUPM-AKT05-KOLEKTIF',
    statusVerifikasi: 'terverifikasi',
    catatan: 'Setoran kolektif tahap 1 alumni Angkatan 5',
    diverifikasiOleh: 'Nur Aisyah, S.St.Pi',
    diverifikasiPada: '2026-09-08T10:00:00Z',
    createdAt: '2026-09-08T09:30:00Z',
    updatedAt: '2026-09-08T10:00:00Z'
  },
  {
    id: 'CTR-004',
    participantId: 'ALM-007',
    namaPenyumbang: 'Fajar Nugraha',
    angkatan: 11,
    jenis: 'iuran_wajib_angkatan',
    nominal: 500000,
    tanggalTransaksi: '2026-09-15',
    metodePembayaran: 'qris',
    referensiTransaksi: 'QRIS-SUPM-11002',
    statusVerifikasi: 'terverifikasi',
    catatan: 'Pembayaran QRIS panitia',
    diverifikasiOleh: 'Nur Aisyah, S.St.Pi',
    diverifikasiPada: '2026-09-15T13:00:00Z',
    createdAt: '2026-09-15T12:00:00Z',
    updatedAt: '2026-09-15T13:00:00Z'
  },
  {
    id: 'CTR-005',
    participantId: 'ALM-009',
    namaPenyumbang: 'Bagus Priyambodo',
    angkatan: 15,
    jenis: 'iuran_wajib_angkatan',
    nominal: 500000,
    tanggalTransaksi: '2026-09-22',
    metodePembayaran: 'transfer_bank',
    referensiTransaksi: 'TRX-SUPM-AKT15-0922',
    statusVerifikasi: 'menunggu_verifikasi',
    catatan: 'Upload bukti transfer via bank daerah, menunggu mutasi bank',
    createdAt: '2026-09-22T08:00:00Z',
    updatedAt: '2026-09-22T08:00:00Z'
  },
  {
    id: 'CTR-006',
    namaPenyumbang: 'Sponsor CV Samudra Mandiri Marine',
    angkatan: 8,
    jenis: 'sponsorship',
    nominal: 5000000,
    tanggalTransaksi: '2026-09-25',
    metodePembayaran: 'transfer_bank',
    referensiTransaksi: 'SPN-SMM-2026',
    statusVerifikasi: 'terverifikasi',
    catatan: 'Sponsorship paket banner & backdrop reuni',
    diverifikasiOleh: 'Nur Aisyah, S.St.Pi',
    diverifikasiPada: '2026-09-25T16:00:00Z',
    createdAt: '2026-09-25T15:00:00Z',
    updatedAt: '2026-09-25T16:00:00Z'
  }
];

export const INITIAL_BUDGET_ITEMS: BudgetItem[] = [
  {
    id: 'BGT-001',
    kodePos: 'ACR-01',
    divisi: 'Seksi Acara & Protokoler',
    uraian: 'Panggung Utama, Tenda Plenary, Sound System & Lighting',
    alokasiAnggaran: 8500000,
    realisasiTerpakai: 2500000,
    statusApproval: 'disetujui',
    diajukanOleh: 'Bambang Supriyanto',
    tanggalPengajuan: '2026-09-01',
    disetujuiOleh: 'Anas Rosyid',
    tanggalApproval: '2026-09-02',
    catatanReview: 'Disetujui untuk DP vendor panggung'
  },
  {
    id: 'BGT-002',
    kodePos: 'KNS-01',
    divisi: 'Seksi Konsumsi',
    uraian: 'Konsumsi Prasmanan Utama Alumni & Guru/Purnabakti',
    alokasiAnggaran: 12000000,
    realisasiTerpakai: 0,
    statusApproval: 'menunggu_persetujuan',
    diajukanOleh: 'Siti Rahmawati',
    tanggalPengajuan: '2026-09-20',
    catatanReview: 'Menunggu finalisasi jumlah estimasi peserta terdaftar'
  },
  {
    id: 'BGT-003',
    kodePos: 'SEK-01',
    divisi: 'Seksi Sekretariat & Pendaftaran',
    uraian: 'Cetak ID Card, Buku Kenangan Angkatan 1–19, dan Map Acara',
    alokasiAnggaran: 3500000,
    realisasiTerpakai: 1000000,
    statusApproval: 'disetujui',
    diajukanOleh: 'Nurul Hidayat',
    tanggalPengajuan: '2026-09-05',
    disetujuiOleh: 'Anas Rosyid',
    tanggalApproval: '2026-09-06',
    catatanReview: 'Disetujui sesuai pagu sekretariat'
  },
  {
    id: 'BGT-004',
    kodePos: 'PUB-01',
    divisi: 'Seksi Publikasi & Dokumentasi',
    uraian: 'Banner Selamat Datang, Backdrop Foto Booth & Video Dokumentasi',
    alokasiAnggaran: 2800000,
    realisasiTerpakai: 800000,
    statusApproval: 'disetujui',
    diajukanOleh: 'Aris Munandar',
    tanggalPengajuan: '2026-09-10',
    disetujuiOleh: 'Anas Rosyid',
    tanggalApproval: '2026-09-11',
    catatanReview: 'Disetujui'
  },
  {
    id: 'BGT-005',
    kodePos: 'MED-01',
    divisi: 'Seksi Keamanan & Medis',
    uraian: 'Posko P3K, Tenaga Paramedis Standby, dan Koordinasi Parkir',
    alokasiAnggaran: 1500000,
    realisasiTerpakai: 0,
    statusApproval: 'draft',
    diajukanOleh: 'Komarudin',
    tanggalPengajuan: '2026-09-25',
    catatanReview: 'Draf pos anggaran Seksi Keamanan'
  }
];

export const INITIAL_LEDGER_ENTRIES: LedgerEntry[] = [
  {
    id: 'LDG-001',
    nomorBukti: 'BKM-SUPM-2026-001',
    tanggal: '2026-09-02',
    tipe: 'pemasukan',
    kategori: 'Iuran Alumni Angkatan 1',
    angkatanTerkait: 1,
    uraian: 'Penerimaan iuran dari Zulkifli Mansyur (Angkatan 1)',
    debit: 500000,
    kredit: 0,
    saldoBerjalan: 500000,
    pihakTerkait: 'Zulkifli Mansyur',
    statusRekonsiliasi: 'cocok',
    dibuatOleh: 'Nur Aisyah, S.St.Pi',
    createdAt: '2026-09-02T11:05:00Z'
  },
  {
    id: 'LDG-002',
    nomorBukti: 'BKM-SUPM-2026-002',
    tanggal: '2026-09-03',
    tipe: 'pemasukan',
    kategori: 'Donasi Sukarela Angkatan 2',
    angkatanTerkait: 2,
    uraian: 'Penerimaan donasi khusus sarana dari H. Sudrajat Effendi',
    debit: 2000000,
    kredit: 0,
    saldoBerjalan: 2500000,
    pihakTerkait: 'H. Sudrajat Effendi',
    statusRekonsiliasi: 'cocok',
    dibuatOleh: 'Nur Aisyah, S.St.Pi',
    createdAt: '2026-09-03T11:35:00Z'
  },
  {
    id: 'LDG-003',
    nomorBukti: 'BKK-SUPM-2026-001',
    tanggal: '2026-09-04',
    tipe: 'pengeluaran',
    kategori: 'Uang Muka Vendor Panggung & Sound',
    posAnggaranId: 'BGT-001',
    uraian: 'Pembayaran DP 30% Sewa Panggung & Sound System ke CV Nada Bahari',
    debit: 0,
    kredit: 2500000,
    saldoBerjalan: 0,
    pihakTerkait: 'CV Nada Bahari',
    statusRekonsiliasi: 'cocok',
    dibuatOleh: 'Nur Aisyah, S.St.Pi',
    createdAt: '2026-09-04T14:00:00Z'
  },
  {
    id: 'LDG-004',
    nomorBukti: 'BKM-SUPM-2026-003',
    tanggal: '2026-09-08',
    tipe: 'pemasukan',
    kategori: 'Iuran Kolektif Angkatan 5',
    angkatanTerkait: 5,
    uraian: 'Setoran kolektif dari Koordinator Angkatan 5 (Rahmat Hidayat)',
    debit: 2500000,
    kredit: 0,
    saldoBerjalan: 2500000,
    pihakTerkait: 'Rahmat Hidayat (Korlap Akt 5)',
    statusRekonsiliasi: 'cocok',
    dibuatOleh: 'Nur Aisyah, S.St.Pi',
    createdAt: '2026-09-08T10:10:00Z'
  },
  {
    id: 'LDG-005',
    nomorBukti: 'BKK-SUPM-2026-002',
    tanggal: '2026-09-09',
    tipe: 'pengeluaran',
    kategori: 'Sekretariat & ATK',
    posAnggaranId: 'BGT-003',
    uraian: 'Pengadaan kertas piagam, badge name tag & tinta stempel panitia',
    debit: 0,
    kredit: 1000000,
    saldoBerjalan: 1500000,
    pihakTerkait: 'Toko ATK Kotaagung Grafika',
    statusRekonsiliasi: 'cocok',
    dibuatOleh: 'Nur Aisyah, S.St.Pi',
    createdAt: '2026-09-09T16:00:00Z'
  },
  {
    id: 'LDG-006',
    nomorBukti: 'BKM-SUPM-2026-004',
    tanggal: '2026-09-15',
    tipe: 'pemasukan',
    kategori: 'Iuran Alumni Angkatan 11',
    angkatanTerkait: 11,
    uraian: 'Pembayaran iuran via QRIS dari Fajar Nugraha',
    debit: 500000,
    kredit: 0,
    saldoBerjalan: 2000000,
    pihakTerkait: 'Fajar Nugraha',
    statusRekonsiliasi: 'cocok',
    dibuatOleh: 'Nur Aisyah, S.St.Pi',
    createdAt: '2026-09-15T13:10:00Z'
  },
  {
    id: 'LDG-007',
    nomorBukti: 'BKK-SUPM-2026-003',
    tanggal: '2026-09-18',
    tipe: 'pengeluaran',
    kategori: 'Publikasi & Spanduk',
    posAnggaranId: 'BGT-004',
    uraian: 'Cetak 4 spanduk selamat datang dan backdrop photobooth',
    debit: 0,
    kredit: 800000,
    saldoBerjalan: 1200000,
    pihakTerkait: 'Percetakan Tanggamus Prima',
    statusRekonsiliasi: 'cocok',
    dibuatOleh: 'Nur Aisyah, S.St.Pi',
    createdAt: '2026-09-18T15:30:00Z'
  },
  {
    id: 'LDG-008',
    nomorBukti: 'BKM-SUPM-2026-005',
    tanggal: '2026-09-25',
    tipe: 'pemasukan',
    kategori: 'Sponsorship CV Samudra Mandiri',
    angkatanTerkait: 8,
    uraian: 'Penerimaan dana sponsorship maritim dari CV Samudra Mandiri Marine',
    debit: 5000000,
    kredit: 0,
    saldoBerjalan: 6200000,
    pihakTerkait: 'CV Samudra Mandiri Marine',
    statusRekonsiliasi: 'cocok',
    dibuatOleh: 'Nur Aisyah, S.St.Pi',
    createdAt: '2026-09-25T16:10:00Z'
  }
];

export const INITIAL_RECONCILIATION_RECORDS: ReconciliationRecord[] = [
  {
    id: 'REC-001',
    ledgerEntryId: 'LDG-001',
    tanggalRekonsiliasi: '2026-09-05',
    nominalBukuKas: 500000,
    nominalRekeningKoran: 500000,
    selisih: 0,
    status: 'cocok',
    catatanAuditor: 'Tervalidasi cocok dengan mutasi kredit rekening resmi',
    auditorName: 'Drs. Suparman, M.Si',
    diselesaikan: true
  },
  {
    id: 'REC-002',
    ledgerEntryId: 'LDG-002',
    tanggalRekonsiliasi: '2026-09-05',
    nominalBukuKas: 2000000,
    nominalRekeningKoran: 2000000,
    selisih: 0,
    status: 'cocok',
    catatanAuditor: 'Mutasi kliring klir tanpa selisih',
    auditorName: 'Drs. Suparman, M.Si',
    diselesaikan: true
  },
  {
    id: 'REC-003',
    ledgerEntryId: 'LDG-003',
    tanggalRekonsiliasi: '2026-09-07',
    nominalBukuKas: 2500000,
    nominalRekeningKoran: 2500000,
    selisih: 0,
    status: 'cocok',
    catatanAuditor: 'Kuitansi bermaterai dan slip debit terlampir lengkap',
    auditorName: 'Drs. Suparman, M.Si',
    diselesaikan: true
  },
  {
    id: 'REC-004',
    ledgerEntryId: 'LDG-008',
    tanggalRekonsiliasi: '2026-09-28',
    nominalBukuKas: 5000000,
    nominalRekeningKoran: 5000000,
    selisih: 0,
    status: 'cocok',
    catatanAuditor: 'Sponsorship masuk rekening panitia dan diverifikasi',
    auditorName: 'Drs. Suparman, M.Si',
    diselesaikan: true
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-09-01T08:00:00Z',
    userId: 'USR-001',
    userName: 'Anas Rosyid',
    userRole: 'super_admin',
    aksi: 'SYSTEM_INITIALIZATION',
    modul: 'Sistem',
    entitasId: 'SYS-INIT',
    deskripsi: 'Inisialisasi SUPMN Kotaagung Reunion Command Center untuk Reuni Akbar Angkatan 1–19'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-09-02T10:15:00Z',
    userId: 'USR-003',
    userName: 'Bambang Supriyanto',
    userRole: 'seksi_acara',
    aksi: 'VERIFY_PARTICIPANT',
    modul: 'Registrasi',
    entitasId: 'ALM-001',
    deskripsi: 'Verifikasi pendaftaran alumni Zulkifli Mansyur (Angkatan 1 - NKN)'
  },
  {
    id: 'LOG-003',
    timestamp: '2026-09-02T11:00:00Z',
    userId: 'USR-002',
    userName: 'Nur Aisyah, S.St.Pi',
    userRole: 'bendahara',
    aksi: 'VERIFY_CONTRIBUTION',
    modul: 'Kontribusi',
    entitasId: 'CTR-001',
    deskripsi: 'Verifikasi iuran wajib Angkatan 1 sebesar Rp 500.000 via transfer'
  },
  {
    id: 'LOG-004',
    timestamp: '2026-09-02T14:00:00Z',
    userId: 'USR-001',
    userName: 'Anas Rosyid',
    userRole: 'super_admin',
    aksi: 'APPROVE_BUDGET',
    modul: 'Anggaran',
    entitasId: 'BGT-001',
    deskripsi: 'Persetujuan pagu anggaran Seksi Acara & Protokoler (Panggung & Sound System)'
  },
  {
    id: 'LOG-005',
    timestamp: '2026-09-04T14:00:00Z',
    userId: 'USR-002',
    userName: 'Nur Aisyah, S.St.Pi',
    userRole: 'bendahara',
    aksi: 'ADD_LEDGER_ENTRY',
    modul: 'Buku Kas',
    entitasId: 'LDG-003',
    deskripsi: 'Pencatatan pengeluaran kas BKK-SUPM-2026-001 sebesar Rp 2.500.000 (DP Panggung)'
  },
  {
    id: 'LOG-006',
    timestamp: '2026-09-05T10:00:00Z',
    userId: 'USR-005',
    userName: 'Drs. Suparman, M.Si',
    userRole: 'auditor',
    aksi: 'BANK_RECONCILIATION',
    modul: 'Rekonsiliasi',
    entitasId: 'REC-001',
    deskripsi: 'Rekonsiliasi saldo mutasi kredit bank untuk transaksi BKM-SUPM-2026-001'
  }
];

export const INITIAL_SURAT_DOKUMEN: SuratDokumen[] = [
  {
    id: 'DOC-001',
    noSurat: '01/SK-PAN/REUNI-SUPMN/IX/2026',
    perihal: 'Surat Keputusan Susunan Panitia Pelaksana Reuni Akbar SUPM N Kotaagung Angkatan 1–19',
    jenis: 'SK_Panitia',
    tanggal: '2026-09-01',
    status: 'diterbitkan',
    ringkasan: 'Penetapan struktur panitia inti, sekretariat, bendahara, dan seksi pelaksana lintas angkatan.'
  },
  {
    id: 'DOC-002',
    noSurat: '02/PAN-REUNI/IZIN/IX/2026',
    perihal: 'Permohonan Penggunaan Fasilitas Aula & Lapangan Upacara SUPM Negeri Kotaagung',
    jenis: 'Surat_Izin',
    tanggal: '2026-09-10',
    status: 'diterbitkan',
    ringkasan: 'Pengajuan izin resmi kepada pihak sekolah SUPM N Kotaagung untuk venue utama Reuni Akbar.'
  },
  {
    id: 'DOC-003',
    noSurat: '03/NOTULA/PLENO-I/IX/2026',
    perihal: 'Notula Rapat Pleno I: Penetapan Pedoman Iuran & Mekanisme Verifikasi Angkatan 1–19',
    jenis: 'Notula_Pleno',
    tanggal: '2026-09-15',
    status: 'diterbitkan',
    ringkasan: 'Keputusan bersama perwakilan angkatan terkait akuntabilitas buku kas umum dan transparansi anggaran.'
  },
  {
    id: 'DOC-004',
    noSurat: '04/UND/ALUMNI-1-19/X/2026',
    perihal: 'Surat Undangan Terbuka Reuni Akbar Alumni SUPM N Kotaagung Angkatan 1 s/d 19',
    jenis: 'Undangan_Alumni',
    tanggal: '2026-09-25',
    status: 'dalam_draf',
    ringkasan: 'Draf undangan resmi untuk disebarluaskan oleh masing-masing Koordinator Angkatan.'
  }
];

export const INITIAL_RUNDOWN_ITEMS: RundownItem[] = [
  {
    id: 'RND-001',
    waktuMulai: '07:30',
    waktuSelesai: '08:30',
    namaSesi: 'Registrasi Ulang, Pembagian Seragam & Snack Pagi',
    penanggungJawab: 'Seksi Sekretariat & Registrasi',
    lokasi: 'Meja Depan Gerbang Utama Kampus SUPM',
    status: 'siap',
    keterangan: 'Verifikasi barcode/nama alumni dan serah terima paket kenang-kenangan kaos reuni.'
  },
  {
    id: 'RND-002',
    waktuMulai: '08:30',
    waktuSelesai: '09:30',
    namaSesi: 'Upacara Pembukaan, Menyanyikan Indonesia Raya & Mars SUPM',
    penanggungJawab: 'Seksi Acara & Protokoler',
    lokasi: 'Lapangan Apel Bahari SUPM Kotaagung',
    status: 'siap',
    keterangan: 'Penghormatan bendera, sambutan Kepala SUPM N Kotaagung & Ketua Panitia Pelaksana.'
  },
  {
    id: 'RND-003',
    waktuMulai: '09:30',
    waktuSelesai: '11:00',
    namaSesi: 'Sesi Foto Bersama Per Kohort Angkatan 1–19 & Napak Tilas Kampus',
    penanggungJawab: 'Seksi Dokumentasi & Publikasi',
    lokasi: 'Plaza Dermaga & Laboratorium Praktik Kampus',
    status: 'siap',
    keterangan: 'Sesi foto resmi bergantian Angkatan 1 s/d 19 bersama guru dan instruktur purnabakti.'
  },
  {
    id: 'RND-004',
    waktuMulai: '11:00',
    waktuSelesai: '12:00',
    namaSesi: 'Tali Asih Guru Purnabakti & Santunan Sosial Bahari',
    penanggungJawab: 'Ketua Pelaksana & Ketua Divisi Keuangan',
    lokasi: 'Panggung Utama Hall Plenary',
    status: 'siap',
    keterangan: 'Penyerahan cinderamata kehormatan kepada para pendidik perintis SUPM N Kotaagung.'
  },
  {
    id: 'RND-005',
    waktuMulai: '12:00',
    waktuSelesai: '13:30',
    namaSesi: 'Istirahat, Sholat Berjamaah & Santap Siang Kuliner Khas Pesisir',
    penanggungJawab: 'Seksi Konsumsi',
    lokasi: 'Area Prasmanan & Masjid Kampus',
    status: 'siap',
    keterangan: 'Prasmanan hidangan laut lokal Kotaagung dan ramah tamah santai antar angkatan.'
  },
  {
    id: 'RND-006',
    waktuMulai: '13:30',
    waktuSelesai: '15:30',
    namaSesi: 'Musyawarah Akbar Alumni & Pembentukan ILUNI SUPM N Kotaagung',
    penanggungJawab: 'Presidium Sidang Alumni',
    lokasi: 'Aula Utama Kampus',
    status: 'siap',
    keterangan: 'Pembahasan AD/ART paguyuban alumni dan pemilihan dewan presidium alumni lintas angkatan.'
  }
];

export const INITIAL_KOORDINATOR_LIST: KoordinatorAngkatan[] = DAFTAR_ANGKATAN.map((akt) => {
  const names: Record<number, { nama: string; domisili: string; terhubung: boolean; catatan: string }> = {
    1: { nama: 'Zulkifli Mansyur', domisili: 'Bandar Lampung', terhubung: true, catatan: 'Angkatan Perintis 1' },
    2: { nama: 'H. Sudrajat Effendi', domisili: 'Kotaagung', terhubung: true, catatan: 'Koordinator wilayah Tanggamus' },
    3: { nama: 'M. Yusuf Bahar', domisili: 'Jakarta', terhubung: true, catatan: 'Korlap Alumni Jabodetabek' },
    4: { nama: 'Dewi Kartika', domisili: 'Jakarta Utara', terhubung: true, catatan: 'Koordinator Angkatan 4' },
    5: { nama: 'Rahmat Hidayat', domisili: 'Serang, Banten', terhubung: true, catatan: 'Aktif koordinasi grup WA' },
    6: { nama: 'Wahyudi Santoso', domisili: 'Lampung Selatan', terhubung: true, catatan: 'Koordinator Angkatan 6' },
    7: { nama: 'Eko Prasetyo', domisili: 'Surabaya', terhubung: true, catatan: 'Koordinator Jawa Timur & Pelayaran' },
    8: { nama: 'Herman Sutanto', domisili: 'Cirebon', terhubung: true, catatan: 'Koordinator Angkatan 8' },
    9: { nama: 'Rina Maryana', domisili: 'Palembang', terhubung: true, catatan: 'Koordinator Sumatera Selatan' },
    10: { nama: 'Doni Firmansyah', domisili: 'Bandar Lampung', terhubung: true, catatan: 'Koordinator Angkatan 10' },
    11: { nama: 'Fajar Nugraha', domisili: 'Tangerang', terhubung: true, catatan: 'Koordinator Angkatan 11' },
    12: { nama: 'Budi Kurniawan', domisili: 'Kotaagung', terhubung: true, catatan: 'Koordinator Angkatan 12' },
    13: { nama: 'Irfan Hakim', domisili: 'Kalianda', terhubung: true, catatan: 'Koordinator Angkatan 13' },
    14: { nama: 'Arif Wibowo', domisili: 'Semarang', terhubung: true, catatan: 'Koordinator Angkatan 14' },
    15: { nama: 'Bagus Priyambodo', domisili: 'Cirebon', terhubung: true, catatan: 'Koordinator Angkatan 15' },
    16: { nama: 'Rian Pratama', domisili: 'Lampung Tengah', terhubung: true, catatan: 'Koordinator Angkatan 16' },
    17: { nama: 'Septian Dwi', domisili: 'Bandar Lampung', terhubung: true, catatan: 'Koordinator Angkatan 17' },
    18: { nama: 'M. Rizky Pratama', domisili: 'Bandar Lampung', terhubung: true, catatan: 'Koordinator Angkatan 18' },
    19: { nama: 'Dinda Ayu Lestari', domisili: 'Kotaagung', terhubung: true, catatan: 'Koordinator Angkatan Muda 19' },
  };

  const info = names[akt] || {
    nama: `Koordinator Perwakilan Angkatan ${akt}`,
    domisili: 'Lampung / Nasional',
    terhubung: true,
    catatan: `Perwakilan resmi Angkatan ${akt}`
  };

  return {
    angkatan: akt,
    namaKoordinator: info.nama,
    kontakWhatsApp: `0812-XXXX-${akt.toString().padStart(4, '0')}`,
    kotaDomisili: info.domisili,
    statusTerhubung: info.terhubung,
    catatanKhusus: info.catatan
  };
});

export const INITIAL_BROADCAST_TEMPLATES: BroadcastTemplate[] = [
  {
    id: 'BC-001',
    judul: 'Undangan Resmi & Alur Registrasi Angkatan 1–19',
    kategori: 'Undangan_Pendaftaran',
    templateTeks: `*UNDANGAN RESMI REUNI AKBAR SUPM N KOTAAGUNG ANGKATAN 1–19*\n\nSalam Bahari Rekan Alumni!\nMari eratkan kembali persaudaraan bahari di almamater tercinta SUPM Negeri Kotaagung.\n\nNama Kegiatan: Reuni Akbar SUPM N Kotaagung Angkatan 1–19\nVenue: Kampus SUPM N Kotaagung\nStatus Tanggal: [Menunggu Keputusan Rapat Pleno Panitia]\n\nMohon rekan alumni Angkatan 1 s/d 19 melakukan pendaftaran melalui Koordinator Angkatan masing-masing atau Command Center Resmi SUPMN Reunion OS.\n\nJalesveva Jayamahe, Di Laut Kita Berjaya!`
  },
  {
    id: 'BC-002',
    judul: 'Format Konfirmasi Iuran & Donasi Kas Panitia',
    kategori: 'Pengingat_Iuran',
    templateTeks: `*PEMBERITAHUAN IURAN & PARTISIPASI ALUMNI*\n\nKepada Yth. Alumni SUPM N Kotaagung Angkatan 1–19,\nUntuk mendukung kelancaran sarana panggung, tenda, konsumsi, dan tali asih guru purnabakti, mohon konfirmasi setoran iuran melalui:\n\nRekening Resmi: [Menunggu SK Panitia & Penetapan Ketua Divisi Keuangan]\nFormat Konfirmasi: NAMA_ANGKATAN_NOMINAL_NOMOR REFENSI\n\nSeluruh mutasi kas dicatat transparan di Buku Kas Umum dan diverifikasi langsung oleh Divisi Keuangan.`
  },
  {
    id: 'BC-003',
    judul: 'Informasi Seragam, Kaos Kenangan & Rundown Acara',
    kategori: 'Info_Acara',
    templateTeks: `*INFO DISTRIBUSI SERAGAM & RUNDOWN REUNI AKBAR SUPM N KOTAAGUNG ANGKATAN 1–19*\n\nHalo Rekan Alumni Angkatan 1–19,\nPaket kaos reuni, tanda peserta, dan buku kenangan akan dibagikan di meja Sekretariat gerbang utama kampus saat registrasi ulang.\n\nPastikan data ukuran kaos (S/M/L/XL/XXL/XXXL) sudah tervalidasi di sistem panitia.\nSampai jumpa di Bumi Bahari SUPM N Kotaagung!`
  }
];

export const INITIAL_SCOOP_ACARA: ScoopAcara[] = [
  {
    id: 'SCP-01',
    namaScoop: 'Rundown, Protokoler & Upacara Apel Bahari',
    deskripsi: 'Penataan susunan prosesi apel upacara bahari di lapangan kampus, gladi resik MC, sambutan pimpinan sekolah SUPM, dan tata urutan acara resmi lintas angkatan 1–19.',
    koordinatorScoop: 'Yogi Faisal (Angkatan 5)',
    anggotaTim: ['Arief (6)', 'Nadya Maulida (6)', 'Imam Muddin (4)'],
    statusKesiapan: 'siap_penuh',
    progresPersen: 85,
    itemChecklist: [
      { id: 'chk-1', nama: 'Penyusunan naskah MC & tata urutan apel bahari', selesai: true },
      { id: 'chk-2', nama: 'Koordinasi pembacaan ikrar alumni lintas angkatan 1–19', selesai: true },
      { id: 'chk-3', nama: 'Daftar nama guru & instruktur purnabakti kehormatan', selesai: true },
      { id: 'chk-4', nama: 'Gladi resik petugas upacara dan korsik sangkakala bahari', selesai: false }
    ],
    catatanOperasional: 'Dipimpin langsung di bawah koordinasi Ketua Divisi Acara Romi Handoko (4).'
  },
  {
    id: 'SCP-02',
    namaScoop: 'Panggung Utama, Sound System & Tata Cahaya LED',
    deskripsi: 'Pengawasan vendor tenda plenary, panggung utama 6x8m, line array audio system 15.000 watt, genset cadangan 60 KVA, dan monitor LED panggung.',
    koordinatorScoop: 'Eko Rahmanto (Angkatan 6)',
    anggotaTim: ['Muhammad Imdadur (7)', 'Agus Wiyanto (4)', 'Ali Gufron (14)'],
    statusKesiapan: 'siap_75%',
    progresPersen: 75,
    itemChecklist: [
      { id: 'chk-5', nama: 'Survei tapak panggung aula & lapangan apel kampus', selesai: true },
      { id: 'chk-6', nama: 'Negosiasi dan DP vendor panggung & sound CV Nada Bahari', selesai: true },
      { id: 'chk-7', nama: 'Uji instalasi genset & kabel kelistrikan bebas padam', selesai: false },
      { id: 'chk-8', nama: 'Pemasangan backdrop utama 6x3m & LED monitor wall', selesai: false }
    ],
    catatanOperasional: 'Loading perlengkapan vendor dijadwalkan H-1 pukul 14:00 WIB.'
  },
  {
    id: 'SCP-03',
    namaScoop: 'Konsumsi Prasmanan & Jamuan Bahari',
    deskripsi: 'Pengelolaan catering hidangan laut khas Teluk Semaka Kotaagung (Ikan Bakar, Gulai Taboh), prasmanan alumni + pendamping, snack box kopi pagi, dan jamuan VIP ruang kepsek.',
    koordinatorScoop: 'Ayu Rihasni (Angkatan 9)',
    anggotaTim: ['Virda (11)', 'Rachel (14)', 'Riva Rohadatul (15)'],
    statusKesiapan: 'siap_75%',
    progresPersen: 70,
    itemChecklist: [
      { id: 'chk-9', nama: 'Penetapan menu kuliner pesisir khas Tanggamus (Ikan Bakar, Gulai Taboh)', selesai: true },
      { id: 'chk-10', nama: 'Sinkronisasi jumlah porsi dengan data peserta & pendamping', selesai: true },
      { id: 'chk-11', nama: 'Penyiapan area air mineral & stand kopi robusta Lampung', selesai: true },
      { id: 'chk-12', nama: 'Pemisahan 4 lajur prasmanan alumni muda dan senior untuk kelancaran', selesai: false }
    ],
    catatanOperasional: 'Estimasi porsi dinamis mengikuti real-time data registrasi di sistem panitia.'
  },
  {
    id: 'SCP-04',
    namaScoop: 'Distribusi Kaos Kenangan & Goodie Bag',
    deskripsi: 'Pengecekan kualitas kaos polo reuni bordir SUPMN, sortasi ukuran S s/d XXXL per kohort Angkatan 1–19, dan pembagian paket goodie bag souvenir.',
    koordinatorScoop: 'Kharis M (Angkatan 8)',
    anggotaTim: ['Sarizon (13)', 'Ferly Primanasa (16)', 'Zaiyin Sulaiman (7)'],
    statusKesiapan: 'siap_penuh',
    progresPersen: 90,
    itemChecklist: [
      { id: 'chk-13', nama: 'Pemeriksaan cetak bordir logo Reuni Akbar & emblem SUPMN', selesai: true },
      { id: 'chk-14', nama: 'Pengelompokan polybag kaos per binder angkatan 1–19', selesai: true },
      { id: 'chk-15', nama: 'Penyelipan pin korps alumni, stiker & buku kenangan', selesai: true },
      { id: 'chk-16', nama: 'Penyiapan stok buffer cadangan ukuran L & XL', selesai: false }
    ],
    catatanOperasional: 'Distribusi dilakukan saat registrasi ulang dengan tanda terima kartu peserta.'
  },
  {
    id: 'SCP-05',
    namaScoop: 'Presensi Check-in Barcode & Gate Gerbang Masuk Hari-H',
    deskripsi: 'Manajemen alur masuk gerbang utama kampus, verifikasi nama/barcode alumni, stempel tanda masuk, dan sinkronisasi data absensi ke dashboard panitia.',
    koordinatorScoop: 'Novando (Angkatan 10)',
    anggotaTim: ['Adi Nugroho (10)', 'Rachel (14)', 'Virda (11)'],
    statusKesiapan: 'siap_75%',
    progresPersen: 80,
    itemChecklist: [
      { id: 'chk-17', nama: 'Penyediaan 4 jalur meja registrasi pembagi angkatan', selesai: true },
      { id: 'chk-18', nama: 'Uji sistem presensi digital & formulir manual backup', selesai: true },
      { id: 'chk-19', nama: 'Pemberian ID card lanyard & kupon konsumsi prasmanan', selesai: true },
      { id: 'chk-20', nama: 'Laporan rekap kehadiran per jam ke Ketua Pelaksana', selesai: false }
    ],
    catatanOperasional: 'Meja gate dibuka mulai pukul 07:00 WIB di gerbang depan kampus SUPM.'
  },
  {
    id: 'SCP-06',
    namaScoop: 'Keamanan, PAMDAL, Rekayasa Parkir & Lalin',
    deskripsi: 'Pengamanan lingkungan kampus, koordinasi dengan PAMDAL internal SUPM, rekayasa kantong parkir mobil/motor lapangan dermaga, dan sirkulasi satu pintu.',
    koordinatorScoop: 'Zaiyin Sulaiman (Angkatan 7)',
    anggotaTim: ['Sarizon (13)', 'Ferly Primanasa (16)', 'Arief (6)'],
    statusKesiapan: 'siap_75%',
    progresPersen: 75,
    itemChecklist: [
      { id: 'chk-21', nama: 'Pemetaan kantong parkir lapangan basket & dermaga praktik', selesai: true },
      { id: 'chk-22', nama: 'Penataan alur keluar masuk satu pintu dan petugas buka portal', selesai: true },
      { id: 'chk-23', nama: 'Koordinasi izin lintas sektor polsek & dinas perhubungan', selesai: false },
      { id: 'chk-24', nama: 'Pemasangan rambu penunjuk arah parkir per angkatan', selesai: false }
    ],
    catatanOperasional: 'Sterilisasi jalur ambulans darurat langsung menuju jalan raya protokol Kotaagung.'
  },
  {
    id: 'SCP-07',
    namaScoop: 'Medis, Posko P3K, Tabung Oksigen & Ambulans Siaga',
    deskripsi: 'Penyediaan posko kesehatan darurat P3K, tabung oksigen medis, tensimeter, obat-obatan pertolongan pertama, serta unit ambulans siaga kerja sama RSUD/Puskesmas.',
    koordinatorScoop: 'Riva Rohadatul (Angkatan 15)',
    anggotaTim: ['Virda (11)', 'Arief (6)', 'Muhammad Imdadur (7)'],
    statusKesiapan: 'siap_75%',
    progresPersen: 80,
    itemChecklist: [
      { id: 'chk-25', nama: 'Penyiapan ruangan posko medis ber-AC di poliklinik kampus', selesai: true },
      { id: 'chk-26', nama: 'Penyediaan 2 unit tabung oksigen medis & kotak P3K lengkap', selesai: true },
      { id: 'chk-27', nama: 'Surat tugas 2 orang paramedis perawat siaga', selesai: true },
      { id: 'chk-28', nama: 'Standby 1 unit ambulans darurat di pintu timur lapangan', selesai: false }
    ],
    catatanOperasional: 'Prioritas pemantauan kesehatan untuk para sesepuh guru dan alumni perintis senior.'
  },
  {
    id: 'SCP-08',
    namaScoop: 'Silaturahmi Guru Purnabakti, Kesan-Pesan & Tali Asih',
    deskripsi: 'Prosesi penghormatan khusus kepada guru, instruktur, dan pembina asrama purnabakti yang telah mendidik alumni Angkatan 1 s/d 19, penyampaian testimoni dan serah terima tali asih kehormatan.',
    koordinatorScoop: 'Nadya Maulida (Angkatan 6)',
    anggotaTim: ['Yogi Faisal (5)', 'Imam Muddin (4)', 'Ayu Rihasni (9)'],
    statusKesiapan: 'siap_penuh',
    progresPersen: 85,
    itemChecklist: [
      { id: 'chk-29', nama: 'Pendataan 15 guru & instruktur purnabakti penerima kehormatan', selesai: true },
      { id: 'chk-30', nama: 'Penyiapan plakat penghargaan cor kuningan & paket tali asih', selesai: true },
      { id: 'chk-31', nama: 'Pengaturan kursi kehormatan VIP baris depan panggung utama', selesai: true },
      { id: 'chk-32', nama: 'Penjemputan khusus guru sepuh dari kediaman Kotaagung', selesai: false }
    ],
    catatanOperasional: 'Dikoordinasikan bersama Ketua Pelaksana dan Dewan Pengarah JALASKA.'
  },
  {
    id: 'SCP-09',
    namaScoop: 'Hiburan Musik Bahari, Kilas Balik Nostalgia & Games Kompak',
    deskripsi: 'Pengisi acara selingan, live musik akustik/electone bahari, lagu-lagu kenangan masa pendidikan SUPM, pemutaran slideshow arsip foto taruna/taruni, dan games kekeluargaan lintas generasi.',
    koordinatorScoop: 'Ali Gufron (Angkatan 14)',
    anggotaTim: ['Eko Rahmanto (6)', 'Kharis M (8)', 'Ferly Primanasa (16)'],
    statusKesiapan: 'siap_75%',
    progresPersen: 70,
    itemChecklist: [
      { id: 'chk-33', nama: 'Seleksi grup musik lokal akustik/band lagu kenangan maritim', selesai: true },
      { id: 'chk-34', nama: 'Kompilasi slide foto arsip asrama taruna angkatan 1–19', selesai: true },
      { id: 'chk-35', nama: 'Penyusunan 3 kuis interaktif berhadiah seputar sejarah SUPM', selesai: false },
      { id: 'chk-36', nama: 'Penyelarasan durasi hiburan agar tidak memotong ibadah sholat', selesai: true }
    ],
    catatanOperasional: 'Musik santai mengiringi sesi makan siang dan temu ramah tamah.'
  },
  {
    id: 'SCP-10',
    namaScoop: 'Photo Wall of Fame, Dokumentasi & Display Memorabilia SUPM',
    deskripsi: 'Pembuatan instalasi lorong kenangan dinding sejarah (Wall of Fame Angkatan 1–19), display memorabilia topi/pet taruna SUPM, photo booth Instagramable dengan background kapal latih/almamater.',
    koordinatorScoop: 'Agus Wiyanto (Angkatan 4)',
    anggotaTim: ['Adi Nugroho (10)', 'Sarizon (13)', 'Novando (10)'],
    statusKesiapan: 'siap_75%',
    progresPersen: 75,
    itemChecklist: [
      { id: 'chk-37', nama: 'Pembangunan backdrop photo booth 4x2.4m di selasar aula', selesai: true },
      { id: 'chk-38', nama: 'Display foto kompilasi angkatan 1 s/d 19 berbingkai rapi', selesai: true },
      { id: 'chk-39', nama: 'Penyediaan properti foto unik (dayung, helm selam, jangkar kenangan)', selesai: false },
      { id: 'chk-40', nama: 'Penyediaan fotografer cetak cepat / QR download foto hari-H', selesai: false }
    ],
    catatanOperasional: 'Bekerja sama erat dengan Divisi Komunikasi Eksternal & Digital.'
  }
];

export const INITIAL_DIVISION_TASKS: DivisionTask[] = [
  // --- DIVISI 1: SEKRETARIS ---
  {
    id: 'TSK-SEK-01',
    divisi: 'sekretaris',
    judul: 'Penerbitan SK Kepanitiaan Resmi Reuni Akbar & Notula Pleno',
    deskripsi: 'Menyusun naskah SK penetapan struktur panitia pelaksana lintas angkatan 1–19, membukukan tanda tangan ketua, dan mengarsipkan dokumen legal formal kegiatan.',
    pic: 'Fitri Ariantini',
    picUserId: 'USR-003',
    targetSelesai: '2026-09-15',
    prioritas: 'mendesak',
    status: 'selesai',
    progresPersen: 100,
    kategori: 'Legalitas & Dokumen',
    outputDeliverable: 'SK Panitia No. 01/SK-PAN/REUNI-SUPMN/IX/2026 bernomor resmi dan ditandatangani.',
    anggaranEstimasi: 350000,
    catatanUpdate: 'SK panitia telah terbit dan didistribusikan ke seluruh korlap angkatan.',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-15T16:00:00Z'
  },
  {
    id: 'TSK-SEK-02',
    divisi: 'sekretaris',
    judul: 'Validasi & Rekapitulasi Data Kontak 19 Koordinator Angkatan',
    deskripsi: 'Memastikan seluruh perwakilan Koordinator Angkatan 1 s/d 19 terverifikasi nomor WhatsApp aktif, kota domisili, dan grup komunikasi antar angkatan.',
    pic: 'Amanda Cindy',
    picUserId: 'USR-004',
    targetSelesai: '2026-10-10',
    prioritas: 'tinggi',
    status: 'dalam_proses',
    progresPersen: 85,
    kategori: 'Database & Jejaring',
    outputDeliverable: 'Direktori master kontak 19 Koordinator Angkatan lengkap dengan link grup koordinasi.',
    anggaranEstimasi: 200000,
    catatanUpdate: 'Tersisa 2 angkatan yang sedang proses sinkronisasi update nomor kontak aktif.',
    createdAt: '2026-09-05T09:00:00Z',
    updatedAt: '2026-10-02T11:30:00Z'
  },
  {
    id: 'TSK-SEK-03',
    divisi: 'sekretaris',
    judul: 'Rekapitulasi Presensi Peserta, Pendamping & Pemetaan Ukuran Kaos',
    deskripsi: 'Mengolah database registrasi alumni peserta per kohort angkatan, jumlah pendamping keluarga, rekapitulasi ukuran seragam kaos (S sampai XXXL) untuk vendor konveksi.',
    pic: 'Fitri Ariantini',
    picUserId: 'USR-003',
    targetSelesai: '2026-10-25',
    prioritas: 'tinggi',
    status: 'dalam_proses',
    progresPersen: 65,
    kategori: 'Registrasi Alumni',
    outputDeliverable: 'Spreadsheet matriks ukuran kaos & daftar hadir cetak ID card barcode per angkatan.',
    anggaranEstimasi: 500000,
    catatanUpdate: 'Angkatan 1–10 sudah rekap 80%, angkatan muda sedang proses finalisasi ukuran kaos.',
    createdAt: '2026-09-10T10:00:00Z',
    updatedAt: '2026-10-05T14:20:00Z'
  },
  {
    id: 'TSK-SEK-04',
    divisi: 'sekretaris',
    judul: 'Penyusunan & Distribusi Undangan Resmi Guru & Instruktur Purnabakti',
    deskripsi: 'Pendataan alamat tempat tinggal dan nomor kontak para sesepuh, mantan kepala sekolah, dewan guru dan instruktur purnabakti SUPM N Kotaagung serta pembuatan surat undangan fisik beramplop formal.',
    pic: 'Amanda Cindy',
    picUserId: 'USR-004',
    targetSelesai: '2026-10-30',
    prioritas: 'sedang',
    status: 'dalam_proses',
    progresPersen: 45,
    kategori: 'Persuratan & Protokoler',
    outputDeliverable: '30 paket surat undangan cetak eksklusif & draf undangan digital PDF siap kurir/antar.',
    anggaranEstimasi: 750000,
    catatanUpdate: '18 nama guru purnabakti sudah terverifikasi alamat terbarunya.',
    createdAt: '2026-09-15T11:00:00Z',
    updatedAt: '2026-10-04T10:00:00Z'
  },
  {
    id: 'TSK-SEK-05',
    divisi: 'sekretaris',
    judul: 'Penyusunan Draf Buku Kenangan 19 Angkatan & Arsip Sejarah SUPM',
    deskripsi: 'Mengumpulkan foto-foto arsip jadul asrama, kegiatan praktik laut, pelayaran latih, dan menyusun layout buku kenangan Reuni Akbar Angkatan 1–19.',
    pic: 'Fitri Ariantini',
    picUserId: 'USR-003',
    targetSelesai: '2026-11-10',
    prioritas: 'sedang',
    status: 'belum_mulai',
    progresPersen: 20,
    kategori: 'Publikasi & Kenangan',
    outputDeliverable: 'Master PDF Buku Kenangan 19 Angkatan siap cetak dan versi e-Book interaktif.',
    anggaranEstimasi: 1500000,
    catatanUpdate: 'Bahan foto dari angkatan 1 s/d 6 mulai masuk via posko sekretariat.',
    createdAt: '2026-09-20T14:00:00Z',
    updatedAt: '2026-09-28T09:15:00Z'
  },

  // --- DIVISI 2: KEUANGAN ---
  {
    id: 'TSK-KEU-01',
    divisi: 'keuangan',
    judul: 'Rekonsiliasi Harian Buku Kas vs Rekening Koran Bank Mandiri/BSI',
    deskripsi: 'Mencocokkan mutasi kredit rekening bank resmi panitia dengan entri buku kas umum, memastikan tidak ada selisih iuran angkatan atau transfer tak bertuan.',
    pic: 'Anas Rosyid',
    picUserId: 'USR-001',
    targetSelesai: '2026-11-20',
    prioritas: 'mendesak',
    status: 'dalam_proses',
    progresPersen: 80,
    kategori: 'Akuntansi & Perbankan',
    outputDeliverable: 'Berita acara rekonsiliasi berkala tanpa selisih dan mutasi buku kas terverifikasi penuh.',
    anggaranEstimasi: 0,
    catatanUpdate: 'Buku kas dan rekening koran tervalidasi klir hingga transaksi pekan ini.',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-10-06T15:00:00Z'
  },
  {
    id: 'TSK-KEU-02',
    divisi: 'keuangan',
    judul: 'Pengesahan & Pencairan Pagu Anggaran RAPB Divisi Acara & Logistik',
    deskripsi: 'Memeriksa permohonan anggaran belanja DP vendor panggung, sewa genset, tenda plenary, dan sistem pencahayaan upacara apel bahari.',
    pic: 'Anas Rosyid',
    picUserId: 'USR-001',
    targetSelesai: '2026-09-20',
    prioritas: 'tinggi',
    status: 'selesai',
    progresPersen: 100,
    kategori: 'Pencairan RAPB',
    outputDeliverable: 'Slip transfer DP vendor panggung Rp 2.500.000 dengan kuitansi dan bukti bayar.',
    anggaranEstimasi: 8500000,
    catatanUpdate: 'Pencairan DP panggung disetujui dan dicatat di BKK-SUPM-2026-001.',
    createdAt: '2026-09-02T10:00:00Z',
    updatedAt: '2026-09-18T16:00:00Z'
  },
  {
    id: 'TSK-KEU-03',
    divisi: 'keuangan',
    judul: 'Pemantauan Target Realisasi Iuran Pokok Angkatan 1 s/d 19',
    deskripsi: 'Mengirimkan rekapitulasi penerimaan kas iuran wajib ke tiap Koordinator Angkatan dan memastikan target iuran minimal per angkatan tercapai.',
    pic: 'Anas Rosyid',
    picUserId: 'USR-001',
    targetSelesai: '2026-10-28',
    prioritas: 'mendesak',
    status: 'dalam_proses',
    progresPersen: 70,
    kategori: 'Target Pendapatan',
    outputDeliverable: 'Laporan progres iuran per kohort dan sertifikat tanda terima lunas angkatan.',
    anggaranEstimasi: 0,
    catatanUpdate: 'Total penerimaan terverifikasi Rp 9.500.000 dari target awal Rp 25.000.000.',
    createdAt: '2026-09-05T13:00:00Z',
    updatedAt: '2026-10-05T18:00:00Z'
  },
  {
    id: 'TSK-KEU-04',
    divisi: 'keuangan',
    judul: 'Penyiapan Alokasi Dana Tali Asih Guru Purnabakti & Santunan Sosial',
    deskripsi: 'Menyisihkan pos anggaran khusus untuk bingkisan tali asih dewan guru purnabakti, santunan perintis SUPM, dan cinderamata plakat kehormatan.',
    pic: 'Anas Rosyid',
    picUserId: 'USR-001',
    targetSelesai: '2026-11-05',
    prioritas: 'tinggi',
    status: 'dalam_proses',
    progresPersen: 55,
    kategori: 'Sosial & Tali Asih',
    outputDeliverable: 'Amplop tali asih per guru purnabakti serta kuitansi serah terima kehormatan.',
    anggaranEstimasi: 5000000,
    catatanUpdate: 'Alokasi telah dicadangkan dalam draf RAPB pos Tali Asih Sosial.',
    createdAt: '2026-09-15T15:00:00Z',
    updatedAt: '2026-10-03T11:00:00Z'
  },
  {
    id: 'TSK-KEU-05',
    divisi: 'keuangan',
    judul: 'Audit Keuangan Internal Bersama Tim Pengawas & Penyusunan LPJ Kas',
    deskripsi: 'Melakukan pra-audit buku kas umum, memeriksa seluruh nota fisik/faktur bermaterai, dan menyusun template Laporan Pertanggungjawaban (LPJ) Keuangan terbuka.',
    pic: 'Anas Rosyid',
    picUserId: 'USR-001',
    targetSelesai: '2026-11-25',
    prioritas: 'sedang',
    status: 'dalam_proses',
    progresPersen: 40,
    kategori: 'Akuntabilitas & Audit',
    outputDeliverable: 'Draf Neraca Keuangan Konsolidasi & Laporan Audit Independen siap rapat pleno.',
    anggaranEstimasi: 250000,
    catatanUpdate: 'Arsip bukti pengeluaran sudah terarsip digital dan fisik dalam binder tertata rapi.',
    createdAt: '2026-09-20T10:00:00Z',
    updatedAt: '2026-10-04T16:00:00Z'
  },

  // --- DIVISI 3: ACARA ---
  {
    id: 'TSK-ACR-01',
    divisi: 'acara',
    judul: 'Gladi Bersih & Finalisasi Rundown Sesi Upacara Apel Bahari Kampus',
    deskripsi: 'Menyusun naskah protokoler MC, susunan barisan per kohort angkatan 1–19, inspektur upacara, pembacaan Ikrar Alumni SUPM Kotaagung, dan musik Mars SUPM.',
    pic: 'Romi Handoko',
    picUserId: 'USR-005',
    targetSelesai: '2026-11-01',
    prioritas: 'mendesak',
    status: 'dalam_proses',
    progresPersen: 75,
    kategori: 'Rundown & Protokoler',
    outputDeliverable: 'Buku saku rundown teknis per menit, teks MC upacara bahari, dan peta tata letak barisan.',
    anggaranEstimasi: 500000,
    catatanUpdate: 'Rundown 6 sesi utama telah matang, gladi kotor dijadwalkan H-3.',
    createdAt: '2026-09-01T09:00:00Z',
    updatedAt: '2026-10-06T10:00:00Z'
  },
  {
    id: 'TSK-ACR-02',
    divisi: 'acara',
    judul: 'Pemasangan & Uji Coba Panggung Utama, Sound System 20k Watt & Genset',
    deskripsi: 'Pengawasan vendor rigging panggung 12x8m, instalasi sound system line-array lapangan terbuka, tata lampu panggung sore/malam, serta backup genset 40 kVA.',
    pic: 'Eko Rahmanto',
    picUserId: 'USR-ACR-03',
    targetSelesai: '2026-11-12',
    prioritas: 'tinggi',
    status: 'dalam_proses',
    progresPersen: 60,
    kategori: 'Panggung & Logistik',
    outputDeliverable: 'Layout panggung disetujui, kontrak sewa vendor panggung & sertifikat genset standby.',
    anggaranEstimasi: 8500000,
    catatanUpdate: 'Vendor telah survei lapangan kampus SUPM, daya listrik PLN + genset telah dipetakan.',
    createdAt: '2026-09-05T14:00:00Z',
    updatedAt: '2026-10-05T16:00:00Z'
  },
  {
    id: 'TSK-ACR-03',
    divisi: 'acara',
    judul: 'Finalisasi Menu Jamuan Khas Pesisir & Pengawasan Catering Prasmanan',
    deskripsi: 'Menentukan menu hidangan laut khas pesisir Kotaagung/Teluk Semangka (ikan bakar, pindang baung/patin, seruit Lampung), alur antrean 4 lajur prasmanan, dan jamuan VIP guru purnabakti.',
    pic: 'Rizal',
    picUserId: 'USR-ACR-07',
    targetSelesai: '2026-11-05',
    prioritas: 'tinggi',
    status: 'dalam_proses',
    progresPersen: 70,
    kategori: 'Konsumsi & Jamuan',
    outputDeliverable: 'Kontrak catering untuk 500 porsi makan siang, snack box coffee break pagi, dan air mineral botol.',
    anggaranEstimasi: 12000000,
    catatanUpdate: 'Test food menu pindang dan ikan bakar khas pesisir telah disetujui pimpinan tim acara.',
    createdAt: '2026-09-10T11:00:00Z',
    updatedAt: '2026-10-04T14:00:00Z'
  },
  {
    id: 'TSK-ACR-04',
    divisi: 'acara',
    judul: 'Sistem Gate Presensi Digital, Meja Registrasi Onsite & Paket Souvenir',
    deskripsi: 'Menyiapkan meja check-in gate depan gerbang, scan barcode kartu alumni digital, serah terima goody bag, kalung ID Card peserta, dan penukaran kupon konsumsi.',
    pic: 'Rachel',
    picUserId: 'USR-ACR-05',
    targetSelesai: '2026-11-08',
    prioritas: 'tinggi',
    status: 'dalam_proses',
    progresPersen: 65,
    kategori: 'Gate & Presensi',
    outputDeliverable: '6 jalur meja registrasi onsite terbagi per angkatan dengan tablet scanner barcode teruji.',
    anggaranEstimasi: 1200000,
    catatanUpdate: 'Uji coba scanner QR code lancar, pembagian tugas 4 panitia per meja telah ditentukan.',
    createdAt: '2026-09-12T10:00:00Z',
    updatedAt: '2026-10-05T11:00:00Z'
  },
  {
    id: 'TSK-ACR-05',
    divisi: 'acara',
    judul: 'Pengadaan Plakat Penghormatan & Sesi Khusus Tali Asih Guru Purnabakti',
    deskripsi: 'Membuat plakat kayu bahari eksklusif berlogo SUPM, selempang kehormatan, dan penataan seremoni penyerahan tali asih di panggung utama plenary.',
    pic: 'Arief',
    picUserId: 'USR-ACR-02',
    targetSelesai: '2026-11-05',
    prioritas: 'sedang',
    status: 'dalam_proses',
    progresPersen: 50,
    kategori: 'Temu Kangen & Tali Asih',
    outputDeliverable: '30 set plakat kehormatan bertuliskan nama guru, cenderamata kain tapis/khas Lampung.',
    anggaranEstimasi: 3000000,
    catatanUpdate: 'Desain plakat bahari telah masuk workshop pengrajin.',
    createdAt: '2026-09-18T13:00:00Z',
    updatedAt: '2026-10-03T15:00:00Z'
  },
  {
    id: 'TSK-ACR-06',
    divisi: 'acara',
    judul: 'Manajemen Keamanan Kampus, Sterilisasi Parkir & Posko Medis P3K',
    deskripsi: 'Koordinasi dengan Polsek Kotaagung, satpam internal sekolah, penyediaan kantong parkir mobil/motor 200+ unit, dan tenaga paramedis dengan ambulans siaga.',
    pic: 'Bambang Irawan',
    picUserId: 'USR-ACR-09',
    targetSelesai: '2026-11-10',
    prioritas: 'tinggi',
    status: 'dalam_proses',
    progresPersen: 55,
    kategori: 'Keamanan & Medis',
    outputDeliverable: 'Plotting denah parkir, izin keramaian Polsek/Dishub, pos medis P3K lengkap tabung oksigen & obat darurat.',
    anggaranEstimasi: 1500000,
    catatanUpdate: 'Surat koordinasi ke Puskesmas dan polsek terdekat sudah diantarkan.',
    createdAt: '2026-09-22T09:00:00Z',
    updatedAt: '2026-10-06T09:30:00Z'
  },

  // --- DIVISI 4: KOMUNIKASI EKSTERNAL & PUBLIKASI ---
  {
    id: 'TSK-PUB-01',
    divisi: 'publikasi',
    judul: 'Produksi Baliho Gerbang Utama, Backdrop Panggung & Spanduk Sambutan',
    deskripsi: 'Desain grafis bertema maritim modern khas almamater, cetak baliho 4x6m di persimpangan jalan masuk SUPM Kotaagung, dan spanduk selamat datang alumni.',
    pic: 'Ira S',
    picUserId: 'USR-006',
    targetSelesai: '2026-10-25',
    prioritas: 'tinggi',
    status: 'dalam_proses',
    progresPersen: 80,
    kategori: 'Desain & Baliho',
    outputDeliverable: 'File cetak TIFF resolusi tinggi, 2 baliho jalan raya, 3 spanduk gerbang, 1 backdrop panggung.',
    anggaranEstimasi: 2800000,
    catatanUpdate: 'Desain approved oleh pimpinan panitia, materi dalam antrean percetakan rekanan.',
    createdAt: '2026-09-05T10:00:00Z',
    updatedAt: '2026-10-05T13:00:00Z'
  },
  {
    id: 'TSK-PUB-02',
    divisi: 'publikasi',
    judul: 'Otomatisasi Siaran Broadcast WhatsApp Blast ke 19 Grup Angkatan',
    deskripsi: 'Menyusun copy paste template pesan undangan berkala, reminder konfirmasi kehadiran, tata cara pelunasan iuran, dan rute lokasi kampus SUPM Kotaagung.',
    pic: 'Ira S',
    picUserId: 'USR-006',
    targetSelesai: '2026-11-05',
    prioritas: 'mendesak',
    status: 'dalam_proses',
    progresPersen: 90,
    kategori: 'Broadcast & Komunikasi',
    outputDeliverable: '4 template siaran resmi WhatsApp siap salin dengan tautan google maps dan kontak sekretariat.',
    anggaranEstimasi: 150000,
    catatanUpdate: 'Siaran Tahap 1 dan 2 telah tereksekusi dengan engagement respon alumni mencapai 70%.',
    createdAt: '2026-09-08T11:00:00Z',
    updatedAt: '2026-10-06T12:00:00Z'
  },
  {
    id: 'TSK-PUB-03',
    divisi: 'publikasi',
    judul: 'Helpdesk Layanan Alumni & Verifikasi Pertanyaan Rekening/Akomodasi',
    deskripsi: 'Membuka hotline layanan informasi 24/7 bagi alumni luar pulau/daerah yang menanyakan penginapan hotel di Tanggamus, transportasi penjemputan dari bandara Branti, dll.',
    pic: 'Ira S',
    picUserId: 'USR-006',
    targetSelesai: '2026-11-15',
    prioritas: 'sedang',
    status: 'dalam_proses',
    progresPersen: 70,
    kategori: 'Helpdesk & Akomodasi',
    outputDeliverable: 'Nomor WhatsApp Hotline Helpdesk dengan panduan list penginapan/hotel terdekat di Kotaagung.',
    anggaranEstimasi: 200000,
    catatanUpdate: 'Daftar 6 hotel & homestay rekanan di Tanggamus telah siap dibagikan ke alumni luar kota.',
    createdAt: '2026-09-12T14:00:00Z',
    updatedAt: '2026-10-04T17:00:00Z'
  },
  {
    id: 'TSK-PUB-04',
    divisi: 'publikasi',
    judul: 'Produksi Video Teaser Nostalgia Kenangan Almamater SUPM Kotaagung',
    deskripsi: 'Mengedit video pendek 60 detik berisi kompilasi video drone kampus tepi laut, foto taruna zaman dulu, diiringi musik haru untuk disebar di TikTok, Instagram Reels, dan WhatsApp Story.',
    pic: 'Ira S',
    picUserId: 'USR-006',
    targetSelesai: '2026-10-20',
    prioritas: 'sedang',
    status: 'dalam_proses',
    progresPersen: 50,
    kategori: 'Media Kreatif & Video',
    outputDeliverable: '3 reels/video teaser resolusi 1080x1920 MP4 siap viral di medsos alumni.',
    anggaranEstimasi: 600000,
    catatanUpdate: 'Teaser seri 1 sudah dirilis dan ditonton lebih dari 1.200 alumni.',
    createdAt: '2026-09-15T16:00:00Z',
    updatedAt: '2026-10-03T18:00:00Z'
  },
  {
    id: 'TSK-PUB-05',
    divisi: 'publikasi',
    judul: 'Persiapan Live Streaming Upacara & Liputan Media Massa Lokal',
    deskripsi: 'Menyiapkan koneksi internet satelit/modem seluler di lapangan upacara, tim camera operator untuk siaran langsung di YouTube Almamater, dan rilis pers media lokal Lampung.',
    pic: 'Ira S',
    picUserId: 'USR-006',
    targetSelesai: '2026-11-12',
    prioritas: 'rendah',
    status: 'belum_mulai',
    progresPersen: 25,
    kategori: 'Live Streaming & Media',
    outputDeliverable: 'Kanal live streaming YouTube siap siar untuk alumni yang berlayar di luar negeri & naskah rilis berita media.',
    anggaranEstimasi: 1000000,
    catatanUpdate: 'Kanal YouTube disiapkan, sedang uji kecepatan upload di area plaza lapangan kampus.',
    createdAt: '2026-09-25T11:00:00Z',
    updatedAt: '2026-10-02T15:00:00Z'
  }
];


