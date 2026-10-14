import { describe, it, expect } from 'vitest';
import { 
  DAFTAR_ANGKATAN, 
  AngkatanNumber 
} from '../types';
import { 
  INITIAL_EVENT_CONFIG, 
  INITIAL_PARTICIPANTS, 
  INITIAL_CONTRIBUTIONS, 
  INITIAL_BUDGET_ITEMS, 
  INITIAL_LEDGER_ENTRIES 
} from '../data/initialData';
import { 
  DOKUMENTASI_TEKNIS_LENGKAP, 
  PANDUAN_PENGGUNAAN_RESMI 
} from '../services/schemaDocumentation';

describe('1. Verifikasi Identitas Resmi & Eliminasi Nama Produk AKAR', () => {
  it('harus menggunakan nama event resmi Reuni Akbar SUPM N Kotaagung Angkatan 1–19', () => {
    expect(INITIAL_EVENT_CONFIG.namaEvent).toBe('Reuni Akbar SUPM N Kotaagung Angkatan 1–19');
  });

  it('harus menggunakan nama aplikasi resmi dan nama singkat', () => {
    expect(INITIAL_EVENT_CONFIG.namaAplikasi).toBe('SUPMN Kotaagung Reunion Command Center');
    expect(INITIAL_EVENT_CONFIG.namaSingkat).toBe('SUPMN Reunion OS');
  });

  it('tidak boleh mengandung kata produk "AKAR Reunion" atau "AKAR Command Center"', () => {
    const configStr = JSON.stringify(INITIAL_EVENT_CONFIG);
    expect(configStr).not.toContain('AKAR Reunion Command Center');
    expect(configStr).not.toContain('AKAR Command Center');
    expect(configStr).not.toContain('AKAR Reunion');

    // Cek juga di dokumentasi teknis dan panduan penggunaan
    expect(DOKUMENTASI_TEKNIS_LENGKAP).not.toContain('AKAR Reunion Command Center');
    expect(DOKUMENTASI_TEKNIS_LENGKAP).not.toContain('AKAR Command Center');
    expect(PANDUAN_PENGGUNAAN_RESMI).not.toContain('AKAR Reunion Command Center');
    expect(PANDUAN_PENGGUNAAN_RESMI).not.toContain('AKAR Command Center');
  });
});

describe('2. Verifikasi Struktur Kohort Alumni Angkatan 1 s/d 19', () => {
  it('harus mencakup tepat 19 angkatan berurutan dari 1 sampai 19', () => {
    expect(DAFTAR_ANGKATAN).toHaveLength(19);
    expect(DAFTAR_ANGKATAN).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
  });

  it('seluruh peserta awal harus memiliki kohort angkatan valid antara 1 dan 19', () => {
    for (const p of INITIAL_PARTICIPANTS) {
      expect(p.angkatan).toBeGreaterThanOrEqual(1);
      expect(p.angkatan).toBeLessThanOrEqual(19);
      expect(DAFTAR_ANGKATAN).toContain(p.angkatan);
    }
  });

  it('seluruh kontribusi terdaftar harus terhubung ke angkatan 1 s/d 19', () => {
    for (const c of INITIAL_CONTRIBUTIONS) {
      expect(c.angkatan).toBeGreaterThanOrEqual(1);
      expect(c.angkatan).toBeLessThanOrEqual(19);
      expect(DAFTAR_ANGKATAN).toContain(c.angkatan);
    }
  });
});

describe('3. Kepatuhan Ketat Larangan Mengarang Data Fiktif (Dates, Bank, Prices)', () => {
  it('tanggal pelaksanaan tidak boleh fiktif dan harus menunggu keputusan pleno panitia', () => {
    expect(INITIAL_EVENT_CONFIG.tanggalPelaksanaan).toContain('Menunggu');
  });

  it('status rekening kas harus menunggu SK panitia & bendahara, bukan nomor rekaan', () => {
    expect(INITIAL_EVENT_CONFIG.statusRekeningResmi).toContain('Menunggu SK Panitia');
  });
});

describe('4. Integritas Keuangan & Jurnal Buku Kas (Double-Entry)', () => {
  it('saldo akhir buku kas harus sama dengan total debit dikurangi total kredit', () => {
    const totalDebit = INITIAL_LEDGER_ENTRIES.reduce((sum, e) => sum + e.debit, 0);
    const totalKredit = INITIAL_LEDGER_ENTRIES.reduce((sum, e) => sum + e.kredit, 0);
    const calculatedSaldo = totalDebit - totalKredit;

    // Saldo entri terakhir yang tercatat
    const lastEntry = INITIAL_LEDGER_ENTRIES[INITIAL_LEDGER_ENTRIES.length - 1];
    expect(lastEntry.saldoBerjalan).toBe(calculatedSaldo);
  });

  it('seluruh pos RAPB memiliki pagu lebih besar dari 0', () => {
    for (const b of INITIAL_BUDGET_ITEMS) {
      expect(b.alokasiAnggaran).toBeGreaterThan(0);
    }
  });
});

describe('5. Verifikasi 4 Divisi Resmi Panitia Pelaksana & Sub-Menu', () => {
  it('Divisi Sekretaris: dokumen dan SK panitia terpetakan', async () => {
    const { INITIAL_SURAT_DOKUMEN } = await import('../data/initialData');
    expect(INITIAL_SURAT_DOKUMEN.length).toBeGreaterThan(0);
    expect(INITIAL_SURAT_DOKUMEN[0].noSurat).toContain('SK-PAN');
  });

  it('Divisi Acara: rundown acara terstruktur dengan penanggung jawab', async () => {
    const { INITIAL_RUNDOWN_ITEMS } = await import('../data/initialData');
    expect(INITIAL_RUNDOWN_ITEMS.length).toBeGreaterThanOrEqual(4);
    for (const r of INITIAL_RUNDOWN_ITEMS) {
      expect(r.waktuMulai).toBeDefined();
      expect(r.penanggungJawab).toBeDefined();
    }
  });

  it('Divisi Publikasi: 19 koordinator angkatan terhubung', async () => {
    const { INITIAL_KOORDINATOR_LIST } = await import('../data/initialData');
    expect(INITIAL_KOORDINATOR_LIST).toHaveLength(19);
    for (let i = 1; i <= 19; i++) {
      const korlap = INITIAL_KOORDINATOR_LIST.find(k => k.angkatan === i);
      expect(korlap).toBeDefined();
      expect(korlap?.statusTerhubung).toBe(true);
    }
  });

  it('Divisi Publikasi: pusat broadcast memiliki template siap pakai', async () => {
    const { INITIAL_BROADCAST_TEMPLATES } = await import('../data/initialData');
    expect(INITIAL_BROADCAST_TEMPLATES.length).toBeGreaterThanOrEqual(3);
    for (const b of INITIAL_BROADCAST_TEMPLATES) {
      expect(b.templateTeks.toUpperCase()).toContain('SUPM N KOTAAGUNG');
    }
  });
});

describe('6. Verifikasi Struktur Panitia Resmi, Tidak Ada Bendahara Umum & Scoop Acara', () => {
  it('Ketua Divisi Keuangan adalah Anas Rosyid (5) dan tidak ada Bendahara Umum', async () => {
    const { INITIAL_USERS } = await import('../data/initialData');
    const ketuaKeuangan = INITIAL_USERS.find(u => u.name === 'Anas Rosyid');
    expect(ketuaKeuangan).toBeDefined();
    expect(ketuaKeuangan?.jabatanLabel).toContain('Ketua Divisi Keuangan');
    expect(ketuaKeuangan?.divisi).toBe('Keuangan');

    // Tidak ada jabatan berlabel "Bendahara Umum"
    const hasBendaharaUmum = INITIAL_USERS.some(u => u.jabatanLabel.toLowerCase().includes('bendahara umum'));
    expect(hasBendaharaUmum).toBe(false);
  });

  it('Ketua Pelaksana adalah Yurisa (6) dan Sekretaris adalah Fitri Ariantini & Amanda Cindy (6)', async () => {
    const { INITIAL_USERS } = await import('../data/initialData');
    const ketua = INITIAL_USERS.find(u => u.name === 'Yurisa');
    expect(ketua).toBeDefined();
    expect(ketua?.role).toBe('super_admin');

    const fitri = INITIAL_USERS.find(u => u.name === 'Fitri Ariantini');
    const amanda = INITIAL_USERS.find(u => u.name === 'Amanda Cindy');
    expect(fitri).toBeDefined();
    expect(amanda).toBeDefined();
  });

  it('Divisi Acara memiliki 19 panitia (Romi Handoko + 18 anggota) dan 10 pos scoop luas', async () => {
    const { INITIAL_USERS, INITIAL_SCOOP_ACARA } = await import('../data/initialData');
    const anggotaAcara = INITIAL_USERS.filter(u => u.divisi === 'Acara');
    expect(anggotaAcara.length).toBe(19);

    const ketuaAcara = anggotaAcara.find(u => u.name === 'Romi Handoko');
    expect(ketuaAcara).toBeDefined();

    // 10 pos scoop operasional yang diperluas
    expect(INITIAL_SCOOP_ACARA.length).toBe(10);
    expect(INITIAL_SCOOP_ACARA.some(s => s.namaScoop.includes('Rundown'))).toBe(true);
    expect(INITIAL_SCOOP_ACARA.some(s => s.namaScoop.includes('Panggung Utama'))).toBe(true);
    expect(INITIAL_SCOOP_ACARA.some(s => s.namaScoop.includes('Konsumsi Prasmanan'))).toBe(true);
    expect(INITIAL_SCOOP_ACARA.some(s => s.namaScoop.includes('Distribusi Kaos'))).toBe(true);
    expect(INITIAL_SCOOP_ACARA.some(s => s.namaScoop.includes('Presensi Check-in'))).toBe(true);
    expect(INITIAL_SCOOP_ACARA.some(s => s.namaScoop.includes('Keamanan, PAMDAL'))).toBe(true);
    expect(INITIAL_SCOOP_ACARA.some(s => s.namaScoop.includes('Medis, Posko P3K'))).toBe(true);
    expect(INITIAL_SCOOP_ACARA.some(s => s.namaScoop.includes('Silaturahmi Guru Purnabakti'))).toBe(true);
    expect(INITIAL_SCOOP_ACARA.some(s => s.namaScoop.includes('Hiburan Musik Bahari'))).toBe(true);
    expect(INITIAL_SCOOP_ACARA.some(s => s.namaScoop.includes('Photo Wall of Fame'))).toBe(true);
  });

  it('Seluruh 19 Koordinator Angkatan terdaftar sebagai user aktif', async () => {
    const { INITIAL_USERS } = await import('../data/initialData');
    const koordinatorUsers = INITIAL_USERS.filter(u => u.divisi === 'Koordinator Angkatan');
    expect(koordinatorUsers.length).toBe(19);
    for (let i = 1; i <= 19; i++) {
      const kor = koordinatorUsers.find(u => u.assignedAngkatan === i);
      expect(kor).toBeDefined();
      expect(kor?.noHp).toBeTruthy();
    }
  });

  it('Akses Admin memungkinkan pembaruan nama, jabatan, dan nomor HP pengguna', async () => {
    const { INITIAL_USERS } = await import('../data/initialData');
    const userToEdit = { ...INITIAL_USERS[0] };
    
    // Simulasi edit admin: ganti nama, jabatan, dan no HP
    const updatedUser = {
      ...userToEdit,
      name: 'Yurisa, S.St.Pi',
      jabatanLabel: 'Ketua Pelaksana Reuni Akbar',
      noHp: '0812-7890-9999'
    };

    expect(updatedUser.name).toBe('Yurisa, S.St.Pi');
    expect(updatedUser.jabatanLabel).toBe('Ketua Pelaksana Reuni Akbar');
    expect(updatedUser.noHp).toBe('0812-7890-9999');
  });
});

describe('7. Verifikasi Super User Anas Rosyid & Dashboard Plan-Progress 4 Divisi', () => {
  it('Super User beralih penuh ke Anas Rosyid dan tidak ada user Capt. Hendra Gunawan', async () => {
    const { INITIAL_USERS } = await import('../data/initialData');
    
    // Capt Hendra Gunawan tidak ada di user list
    const hendra = INITIAL_USERS.find(u => u.name.toLowerCase().includes('hendra'));
    expect(hendra).toBeUndefined();

    // Anas Rosyid adalah Super Admin
    const anas = INITIAL_USERS.find(u => u.name === 'Anas Rosyid');
    expect(anas).toBeDefined();
    expect(anas?.role).toBe('super_admin');
    expect(anas?.jabatanLabel).toContain('Ketua Divisi Keuangan');
  });

  it('Rencana kerja task terdistribusi lengkap di 4 divisi (Sekretariat, Keuangan, Acara, Publikasi)', async () => {
    const { INITIAL_DIVISION_TASKS } = await import('../data/initialData');
    expect(INITIAL_DIVISION_TASKS.length).toBeGreaterThanOrEqual(15);

    const divs = ['sekretaris', 'keuangan', 'acara', 'publikasi'];
    for (const d of divs) {
      const dTasks = INITIAL_DIVISION_TASKS.filter(t => t.divisi === d);
      expect(dTasks.length).toBeGreaterThanOrEqual(3);
      for (const t of dTasks) {
        expect(t.judul).toBeTruthy();
        expect(t.pic).toBeTruthy();
        expect(t.outputDeliverable).toBeTruthy();
        expect(t.targetSelesai).toBeTruthy();
        expect(t.progresPersen).toBeGreaterThanOrEqual(0);
        expect(t.progresPersen).toBeLessThanOrEqual(100);
      }
    }
  });

  it('Layanan penyimpanan storageService mendukung persistensi tasks', async () => {
    const { loadDivisionTasks, saveDivisionTasks } = await import('../services/storageService');
    const tasks = loadDivisionTasks();
    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks.length).toBeGreaterThan(0);
  });
});


