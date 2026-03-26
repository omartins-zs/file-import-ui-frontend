"use client";

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Wifi, WifiOff, Loader2, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ServiceStatus() {
  const [showDetails, setShowDetails] = useState(false);
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['health-check'],
    queryFn: () => api.get('/health').then(res => res.data),
    retry: 1,
    enabled: true, // Só busca quando montado ou manualmente
  });

  const handleRetry = async () => {
    await refetch();
  };

  const isOnline = data?.status === 'ok' || (!isLoading && !isError);

  // Só mostra o estado de "Verificando" no carregamento inicial real
  // Depois disso, as atualizações de fundo (background) são silenciosas
  const isInitialLoading = isLoading && !data;

  return (
    <div className="relative">
      <button 
        onClick={() => !isOnline && setShowDetails(!showDetails)}
        className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all active:scale-95 ${
          isInitialLoading ? 'bg-slate-50 border-slate-200' :
          isOnline ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100' :
          'bg-rose-50 border-rose-200 hover:bg-rose-100 animate-pulse cursor-pointer'
        }`}
      >
        {isInitialLoading ? (
          <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
        ) : isOnline ? (
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
        ) : (
          <WifiOff className="w-3 h-3 text-rose-500" />
        )}
        
        <span className={`text-[10px] font-bold uppercase tracking-wider ${
          isLoading ? 'text-slate-500' :
          isOnline ? 'text-emerald-600' : 'text-rose-600'
        }`}>
          {isLoading ? 'Verificando...' : isOnline ? 'Online' : 'Offline'}
        </span>
      </button>

      {/* Popover de Detalhes do Erro */}
      <AnimatePresence>
        {showDetails && !isOnline && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowDetails(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-10 left-0 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-rose-100 p-5 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center border border-rose-100">
                   <AlertTriangle className="w-5 h-5 text-rose-500" />
                </div>
                <button onClick={() => setShowDetails(false)} className="text-slate-300 hover:text-slate-500 p-1">
                   <X className="w-4 h-4" />
                </button>
              </div>
              
              <div>
                <h4 className="text-sm font-black text-slate-800 leading-tight">Serviço de Importação Offline 🔌</h4>
                <p className="text-[11px] text-slate-500 font-medium mt-1.5 leading-relaxed">
                  Não conseguimos conectar ao servidor central. <br /><br />
                  Certifique-se de que o <strong>Backend</strong> está rodando e acessível no seu terminal ou Docker.
                </p>
              </div>

              <div className="pt-2">
                 <button 
                  onClick={handleRetry}
                  className="w-full py-2 bg-rose-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-rose-700 transition-colors shadow-sm shadow-rose-200 flex items-center justify-center gap-2"
                 >
                   {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Tentar Novamente'}
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
