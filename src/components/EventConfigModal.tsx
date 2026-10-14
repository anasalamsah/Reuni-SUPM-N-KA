import React, { useState } from 'react';
import { 
  Settings, 
  AlertCircle, 
  CheckCircle, 
  RotateCcw, 
  Save, 
  ShieldCheck, 
  Info 
} from 'lucide-react';
import { EventConfig } from '../types';

interface EventConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventConfig: EventConfig;
  onSaveConfig: (newConfig: EventConfig) => void;
  onResetData: () => void;
}

export const EventConfigModal: React.FC<EventConfigModalProps> = ({
  isOpen,
  onClose,
  eventConfig,
  onSaveConfig,
  onResetData
}) => {
  const [config, setConfig] = useState<EventConfig>(eventConfig);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">
              Status & Informasi Resmi Acara
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        {/* Warning Anti Data Fiktif */}
        <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/40 text-amber-200 text-xs mt-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Prinsip Akurasi Data Resmi:</strong> Sistem tidak mengarang tanggal pelaksanaan, nominal iuran wajib fiktif, jumlah peserta fiktif, atau nomor rekening bank tiruan. Seluruh data berstatus resmi atau menunggu ketetapan pleno panitia.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Nama Resmi Event (Terkunci Sesuai SK)
            </label>
            <input
              type="text"
              disabled
              value={config.namaEvent}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 text-slate-400 border border-slate-800 cursor-not-allowed font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Nama Aplikasi
              </label>
              <input
                type="text"
                disabled
                value={config.namaAplikasi}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 text-slate-400 border border-slate-800 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Nama Singkat
              </label>
              <input
                type="text"
                disabled
                value={config.namaSingkat}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 text-slate-400 border border-slate-800 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Status Tanggal Pelaksanaan Acara
            </label>
            <input
              type="text"
              value={config.tanggalPelaksanaan}
              onChange={(e) => setConfig({ ...config, tanggalPelaksanaan: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Default: &quot;Menunggu Keputusan Rapat Pleno Panitia&quot;
            </span>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Status Lokasi Acara
            </label>
            <input
              type="text"
              value={config.lokasiPelaksanaan}
              onChange={(e) => setConfig({ ...config, lokasiPelaksanaan: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Status Rekening Kas Resmi Panitia
            </label>
            <input
              type="text"
              value={config.statusRekeningResmi}
              onChange={(e) => setConfig({ ...config, statusRekeningResmi: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Default: &quot;Menunggu SK Panitia & Penetapan Ketua Divisi Keuangan&quot;
            </span>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Kebijakan Iuran & Partisipasi Angkatan
            </label>
            <textarea
              rows={2}
              value={config.catatanKebijakanIuran}
              onChange={(e) => setConfig({ ...config, catatanKebijakanIuran: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="px-3 py-1.5 rounded-lg bg-rose-950/40 text-rose-300 hover:bg-rose-900 border border-rose-800/60 flex items-center gap-1.5 text-xs transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Data Sistem</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-rose-400">Yakin reset ke data awal?</span>
                <button
                  type="button"
                  onClick={() => {
                    onResetData();
                    setConfirmReset(false);
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs"
                >
                  Ya, Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-xs"
                >
                  Batal
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-750"
              >
                Tutup
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 font-semibold text-white flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Ketetapan</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
