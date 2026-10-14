import React, { useState } from 'react';
import { 
  Anchor, 
  Users, 
  ShieldCheck, 
  FileText, 
  HelpCircle, 
  Settings, 
  CheckCircle2,
  ChevronDown,
  Wallet,
  Calendar,
  Megaphone,
  LayoutDashboard,
  UserCog
} from 'lucide-react';
import { UserSession, UserRole, DAFTAR_ANGKATAN, AngkatanNumber, MainMenuId } from '../types';

interface NavbarProps {
  activeTab: MainMenuId;
  setActiveTab: (tab: MainMenuId) => void;
  currentUser: UserSession;
  setCurrentUser: (user: UserSession) => void;
  users: UserSession[];
  onOpenDocs: () => void;
  onOpenEventConfig: () => void;
  onOpenAdminUsers: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  setCurrentUser,
  users,
  onOpenDocs,
  onOpenEventConfig,
  onOpenAdminUsers
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const mainMenus: { id: MainMenuId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
    { id: 'sekretaris', label: 'Sekretaris', icon: FileText },
    { id: 'keuangan', label: 'Div Keuangan', icon: Wallet },
    { id: 'acara', label: 'Div Acara', icon: Calendar },
    { id: 'publikasi', label: 'Div Komunikasi Eksternal & Publikasi', icon: Megaphone }
  ];

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'ketua_keuangan': 
      case 'bendahara': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'sekretaris': return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'ketua_acara':
      case 'anggota_acara':
      case 'seksi_acara': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'ketua_publikasi':
      case 'anggota_publikasi': return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
      case 'dewan_pengarah': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      default: return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-cyan-900/40 shadow-xl">
      {/* Top Banner: Official Identity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-900/30 border border-cyan-400/30 shrink-0">
            <Anchor className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                SUPMN Kotaagung Reunion Command Center
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-cyan-950 text-cyan-300 border border-cyan-800/80">
                SUPMN Reunion OS
              </span>
              <span className="px-2 py-0.5 text-xs font-medium rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Angkatan 1–19
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Sistem Operasional Resmi &bull; <span className="text-cyan-400 font-semibold">Reuni Akbar SUPM N Kotaagung Angkatan 1–19</span>
            </p>
          </div>
        </div>

        {/* Right side controls: Admin panitia, Role simulator & quick action modals */}
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-between md:justify-end flex-wrap">
          {/* Admin User Management Button */}
          <button
            onClick={onOpenAdminUsers}
            className="px-2.5 py-1.5 rounded-lg bg-amber-950/50 hover:bg-amber-900/60 text-xs text-amber-300 border border-amber-700/60 flex items-center gap-1.5 transition shadow-sm"
            title="Kelola Data Panitia, Jabatan & No HP"
          >
            <UserCog className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">Kelola Panitia (Admin)</span>
          </button>

          {/* Official Info Button */}
          <button
            onClick={onOpenEventConfig}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition shadow-sm"
            title="Lihat Status Resmi Acara"
          >
            <Settings className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Info Resmi Acara</span>
          </button>

          {/* Docs & Manual Button */}
          <button
            onClick={onOpenDocs}
            className="px-2.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/70 text-xs text-cyan-300 border border-cyan-700/50 flex items-center gap-1.5 transition shadow-sm"
            title="Dokumentasi Teknis & Panduan Penggunaan"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium">Panduan</span>
          </button>

          {/* User Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs transition"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-left">
                <div className="text-[11px] font-semibold text-slate-200 leading-none">
                  {currentUser.name} {currentUser.angkatan ? `(${currentUser.angkatan})` : ''}
                </div>
                <div className="text-[10px] text-cyan-400 font-medium truncate max-w-[140px]">
                  {currentUser.jabatanLabel || currentUser.role}
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 max-h-[75vh] overflow-y-auto">
                <div className="px-2 py-1.5 border-b border-slate-800 flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <span>Pilih Sesi Panitia ({users.length})</span>
                  <span className="text-[10px] text-amber-400 font-bold">Admin Active</span>
                </div>
                <button
                  onClick={() => { setShowRoleMenu(false); onOpenAdminUsers(); }}
                  className="w-full mt-1.5 mb-1 py-1.5 px-2.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-600/50 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <UserCog className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kelola Panitia / Edit Jabatan & No HP</span>
                </button>
                <div className="space-y-1 mt-1">
                  {users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setCurrentUser(user);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition ${
                        currentUser.id === user.id
                          ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-800/60'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <div className="font-bold text-slate-200 flex items-center gap-1.5">
                          <span>{user.name}</span>
                          {user.angkatan && (
                            <span className="text-[10px] text-slate-400">({user.angkatan})</span>
                          )}
                        </div>
                        <div className="text-[10px] text-amber-300/80 truncate">
                          {user.jabatanLabel || user.role}
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono">
                          {user.noHp}
                        </div>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded border whitespace-nowrap shrink-0 ${getRoleBadgeColor(user.role)}`}>
                        {user.divisi}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Primary Division Navigation Bar Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1.5 overflow-x-auto py-2.5 scrollbar-none">
          {mainMenus.map((menu) => {
            const Icon = menu.icon;
            const isActive = activeTab === menu.id;
            return (
              <button
                key={menu.id}
                onClick={() => setActiveTab(menu.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition flex items-center gap-2 ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-md shadow-cyan-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{menu.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
