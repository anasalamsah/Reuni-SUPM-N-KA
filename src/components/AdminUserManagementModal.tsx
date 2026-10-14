import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Edit3, 
  Plus, 
  Trash2, 
  Phone, 
  Mail, 
  Search, 
  ShieldCheck, 
  Check, 
  X,
  BadgeCheck,
  Building2,
  Lock
} from 'lucide-react';
import { UserSession, UserRole, DAFTAR_ANGKATAN, AngkatanNumber } from '../types';

interface AdminUserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserSession[];
  currentUser: UserSession;
  onSaveUsers: (users: UserSession[]) => void;
  onSwitchUser: (user: UserSession) => void;
}

export const AdminUserManagementModal: React.FC<AdminUserManagementModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUser,
  onSaveUsers,
  onSwitchUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [divisiFilter, setDivisiFilter] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<UserSession | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formJabatanLabel, setFormJabatanLabel] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('anggota_acara');
  const [formDivisi, setFormDivisi] = useState<UserSession['divisi']>('Acara');
  const [formNoHp, setFormNoHp] = useState('');
  const [formAngkatan, setFormAngkatan] = useState<string>('6');
  const [formEmail, setFormEmail] = useState('');

  if (!isOpen) return null;

  const handleStartEdit = (user: UserSession) => {
    setEditingUser(user);
    setIsAddingNew(false);
    setFormName(user.name);
    setFormJabatanLabel(user.jabatanLabel || user.role);
    setFormRole(user.role);
    setFormDivisi(user.divisi || 'Acara');
    setFormNoHp(user.noHp || '');
    setFormAngkatan(user.angkatan ? user.angkatan.toString() : '');
    setFormEmail(user.email || '');
  };

  const handleStartAdd = () => {
    setEditingUser(null);
    setIsAddingNew(true);
    setFormName('');
    setFormJabatanLabel('Anggota Panitia');
    setFormRole('anggota_acara');
    setFormDivisi('Acara');
    setFormNoHp('0812-XXXX-XXXX');
    setFormAngkatan('6');
    setFormEmail('');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (isAddingNew) {
      const newUser: UserSession = {
        id: `USR-${Date.now().toString().slice(-4)}`,
        name: formName.trim(),
        role: formRole,
        jabatanLabel: formJabatanLabel.trim() || 'Anggota Panitia',
        divisi: formDivisi,
        noHp: formNoHp.trim() || '-',
        angkatan: isNaN(Number(formAngkatan)) ? formAngkatan : (Number(formAngkatan) as AngkatanNumber),
        email: formEmail.trim() || `${formName.toLowerCase().replace(/\s+/g, '.')}@reuni-supmn-kotaagung.org`
      };
      onSaveUsers([newUser, ...users]);
    } else if (editingUser) {
      const updated = users.map(u => {
        if (u.id === editingUser.id) {
          const updatedUser: UserSession = {
            ...u,
            name: formName.trim(),
            role: formRole,
            jabatanLabel: formJabatanLabel.trim(),
            divisi: formDivisi,
            noHp: formNoHp.trim(),
            angkatan: isNaN(Number(formAngkatan)) ? formAngkatan : (Number(formAngkatan) as AngkatanNumber),
            email: formEmail.trim()
          };
          // If editing active user, update active session too
          if (currentUser.id === u.id) {
            onSwitchUser(updatedUser);
          }
          return updatedUser;
        }
        return u;
      });
      onSaveUsers(updated);
    }

    setEditingUser(null);
    setIsAddingNew(false);
  };

  const handleDeleteUser = (id: string) => {
    if (users.length <= 1) return;
    const target = users.find(u => u.id === id);
    if (target?.id === currentUser.id) {
      alert('Tidak dapat menghapus user yang sedang aktif digunakan.');
      return;
    }
    if (confirm(`Yakin ingin menghapus ${target?.name} dari daftar panitia?`)) {
      onSaveUsers(users.filter(u => u.id !== id));
    }
  };

  const filteredUsers = users.filter(u => {
    if (divisiFilter !== 'all' && u.divisi !== divisiFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchJabatan = (u.jabatanLabel || '').toLowerCase().includes(q);
      const matchHp = (u.noHp || '').toLowerCase().includes(q);
      const matchAkt = (u.angkatan?.toString() || '').includes(q);
      if (!matchName && !matchJabatan && !matchHp && !matchAkt) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  Manajemen Pengguna & Panitia (Admin Access)
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  Akses Khusus Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Kelola nama panitia, nomor handphone (WhatsApp), jabatan resmi, hak akses peran & ganti sesi aktif
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Action Bar: Filter & Add */}
        <div className="p-3 bg-slate-900/80 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama, no hp, angkatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-amber-500"
              />
            </div>
            <select
              value={divisiFilter}
              onChange={(e) => setDivisiFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none"
            >
              <option value="all">Semua Divisi ({users.length})</option>
              <option value="Pimpinan">Pimpinan</option>
              <option value="Sekretariat">Sekretariat</option>
              <option value="Keuangan">Divisi Keuangan</option>
              <option value="Acara">Divisi Acara</option>
              <option value="Komunikasi Eksternal & Digital">Komunikasi & Digital</option>
              <option value="Pengarah">Dewan Pengarah</option>
            </select>
          </div>

          <button
            onClick={handleStartAdd}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold flex items-center justify-center gap-1.5 transition shadow"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Anggota Panitia</span>
          </button>
        </div>

        {/* Content Body: Two columns if editing, or full table */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col lg:flex-row gap-4">
          {/* User List Table */}
          <div className={`overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 flex-1 ${
            editingUser || isAddingNew ? 'lg:max-w-[55%]' : 'w-full'
          }`}>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-300 border-b border-slate-800 text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Nama & Jabatan</th>
                  <th className="py-2.5 px-3">Divisi & Angkatan</th>
                  <th className="py-2.5 px-3">No. HP (WA)</th>
                  <th className="py-2.5 px-3 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredUsers.map((u) => {
                  const isActive = currentUser.id === u.id;
                  const isBeingEdited = editingUser?.id === u.id;

                  return (
                    <tr 
                      key={u.id}
                      className={`transition ${
                        isBeingEdited
                          ? 'bg-amber-950/40 border-l-2 border-amber-400'
                          : isActive
                          ? 'bg-cyan-950/30'
                          : 'hover:bg-slate-850/40'
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          {isActive && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" title="Sesi Aktif" />
                          )}
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              {u.name}
                              {isActive && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                                  Aktif
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-amber-300/90 font-medium">
                              {u.jabatanLabel || u.role}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-medium">
                          {u.divisi || 'Panitia'}
                        </span>
                        <div className="text-[10px] text-cyan-400 mt-0.5">
                          Akt: {u.angkatan || '-'}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                        {u.noHp || '-'}
                      </td>

                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {!isActive && (
                            <button
                              onClick={() => onSwitchUser(u)}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] border border-slate-700 transition"
                              title="Pindah ke sesi user ini"
                            >
                              Ganti Sesi
                            </button>
                          )}
                          <button
                            onClick={() => handleStartEdit(u)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 transition"
                            title="Edit Data User"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {!isActive && (
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1 rounded bg-rose-950/40 hover:bg-rose-900 text-rose-400 transition"
                              title="Hapus User"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Edit / Add Form Panel */}
          {(editingUser || isAddingNew) && (
            <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/40 shadow-xl flex-1 text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  {isAddingNew ? 'Tambah Panitia Baru' : `Edit Panitia: ${editingUser?.name}`}
                </h3>
                <button
                  onClick={() => { setEditingUser(null); setIsAddingNew(false); }}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveForm} className="space-y-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Nama panitia..."
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Jabatan Resmi *</label>
                    <input
                      type="text"
                      required
                      value={formJabatanLabel}
                      onChange={(e) => setFormJabatanLabel(e.target.value)}
                      placeholder="Misal: Ketua Divisi Acara"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Divisi Panitia *</label>
                    <select
                      value={formDivisi}
                      onChange={(e) => setFormDivisi(e.target.value as any)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Pimpinan">Pimpinan</option>
                      <option value="Sekretariat">Sekretariat</option>
                      <option value="Keuangan">Divisi Keuangan</option>
                      <option value="Acara">Divisi Acara</option>
                      <option value="Komunikasi Eksternal & Digital">Komunikasi Eksternal & Digital</option>
                      <option value="Pengarah">Dewan Pengarah</option>
                      <option value="Koordinator Angkatan">Koordinator Angkatan</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Nomor Handphone (WhatsApp) *</label>
                    <input
                      type="text"
                      required
                      value={formNoHp}
                      onChange={(e) => setFormNoHp(e.target.value)}
                      placeholder="0812-XXXX-XXXX"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Kohort Angkatan (1–19)</label>
                    <input
                      type="text"
                      value={formAngkatan}
                      onChange={(e) => setFormAngkatan(e.target.value)}
                      placeholder="Contoh: 6 atau SUPMN"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Peran Akses Sistem (RBAC) *</label>
                    <select
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value as UserRole)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-amber-500"
                    >
                      <option value="super_admin">Super Admin / Pemegang Mandat (Full Admin)</option>
                      <option value="ketua_keuangan">Ketua Divisi Keuangan (Full Keuangan)</option>
                      <option value="sekretaris">Sekretaris (Registrasi & Surat)</option>
                      <option value="ketua_acara">Ketua Divisi Acara</option>
                      <option value="anggota_acara">Anggota Divisi Acara</option>
                      <option value="ketua_publikasi">Ketua Komunikasi & Digital</option>
                      <option value="anggota_publikasi">Anggota Komunikasi & Digital</option>
                      <option value="anggota_keuangan">Anggota Keuangan</option>
                      <option value="dewan_pengarah">Dewan Pengarah</option>
                      <option value="koordinator_angkatan">Koordinator Angkatan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Alamat Email Panitia</label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="email@reuni-supmn-kotaagung.org"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => { setEditingUser(null); setIsAddingNew(false); }}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 font-semibold text-white"
                  >
                    Simpan Perubahan User
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Total Panitia Terdaftar: <strong className="text-white">{users.length} Orang</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
          >
            Tutup Panel
          </button>
        </div>
      </div>
    </div>
  );
};
