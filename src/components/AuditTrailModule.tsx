import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Download, 
  Clock, 
  User, 
  Layers, 
  FileText 
} from 'lucide-react';
import { AuditLog, UserSession } from '../types';

interface AuditTrailModuleProps {
  auditLogs: AuditLog[];
  currentUser: UserSession;
}

export const AuditTrailModule: React.FC<AuditTrailModuleProps> = ({
  auditLogs,
  currentUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modulFilter, setModulFilter] = useState<string>('all');

  const filteredLogs = auditLogs.filter(log => {
    if (modulFilter !== 'all' && log.modul !== modulFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchDesc = log.deskripsi.toLowerCase().includes(q);
      const matchUser = log.userName.toLowerCase().includes(q);
      const matchAksi = log.aksi.toLowerCase().includes(q);
      const matchEntity = log.entitasId.toLowerCase().includes(q);
      if (!matchDesc && !matchUser && !matchAksi && !matchEntity) return false;
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = ['ID Log', 'Waktu', 'Pengguna', 'Peran', 'Aksi', 'Modul', 'ID Entitas', 'Deskripsi'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.timestamp,
      `"${l.userName}"`,
      l.userRole,
      l.aksi,
      l.modul,
      l.entitasId,
      `"${l.deskripsi}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audit_trail_supmn_reunion_os_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">
              Jejak Audit & Log Keamanan Sistem (Audit Trail)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Rekam jejak seluruh mutasi data, persetujuan anggaran, registrasi peserta, dan verifikasi keuangan
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 border border-slate-700 flex items-center gap-1.5 transition"
        >
          <Download className="w-4 h-4" />
          <span>Ekspor Log Audit</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari deskripsi log, nama pengguna, aksi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-800 text-xs text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <select
            value={modulFilter}
            onChange={(e) => setModulFilter(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Modul Sistem</option>
            <option value="Registrasi">Modul Registrasi Peserta</option>
            <option value="Kontribusi">Modul Kontribusi & Iuran</option>
            <option value="Anggaran">Modul Persetujuan Anggaran</option>
            <option value="Buku Kas">Modul Buku Kas & Jurnal</option>
            <option value="Rekonsiliasi">Modul Rekonsiliasi Bank</option>
            <option value="Sistem">Modul Konfigurasi Sistem</option>
          </select>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-3">
        {filteredLogs.map((log) => (
          <div 
            key={log.id} 
            className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-semibold">
                  {log.aksi}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-850 text-slate-400 border border-slate-800">
                  {log.modul}
                </span>
                <span className="text-[11px] font-bold text-white">
                  {log.userName} ({log.userRole})
                </span>
              </div>
              <p className="text-slate-300 text-xs font-normal">
                {log.deskripsi}
              </p>
              {log.entitasId && (
                <div className="text-[10px] text-slate-500 font-mono">
                  Target Entitas: {log.entitasId}
                </div>
              )}
            </div>
            <div className="text-[11px] text-slate-400 sm:text-right whitespace-nowrap">
              <div>{new Date(log.timestamp).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</div>
              <div className="text-[10px] text-slate-500">
                {new Date(log.timestamp).toLocaleTimeString('id-ID')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
