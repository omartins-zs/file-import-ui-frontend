"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { importsService } from '@/lib/api';
import { 
  FileUp, 
  LayoutDashboard, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  RefreshCw,
  Search,
  Filter,
  Plus,
  WifiOff,
  FileText
} from 'lucide-react';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import ImportModal from '@/components/imports/ImportModal';

const STATUS_MAP: Record<string, string> = {
  PENDING: 'Pendente',
  PROCESSING: 'Processando',
  COMPLETED: 'Concluído',
  FAILED: 'Falhou',
  PARTIAL: 'Parcial',
}

export default function Dashboard() {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  
  // States para busca e filtro
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: stats, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['recent-imports', searchTerm, statusFilter],
    queryFn: () => importsService.list({ 
      search: searchTerm || undefined, 
      status: statusFilter || undefined,
      limit: 10 
    }),
    retry: 1,
    staleTime: 5000,
  });

  const handleManualRefresh = async () => {
    setIsManualRefreshing(true);
    await refetch();
    setTimeout(() => setIsManualRefreshing(false), 600);
  };

  const backendOffline = isError && !stats;

  const imports = stats?.items || [];
  const counts = {
    total: stats?.total || 0,
    processing: imports.filter((i: any) => i.status === 'PROCESSING' || i.status === 'PENDING').length,
    completed: imports.filter((i: any) => i.status === 'COMPLETED').length,
    failed: imports.filter((i: any) => i.status === 'FAILED').length,
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
           <p className="text-slate-500 font-medium tracking-tight">Gerencie e acompanhe suas importações de arquivos em tempo real.</p>
        </div>
        <button 
          onClick={() => setIsImportModalOpen(true)}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" />
          Nova Importação
        </button>
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total de Importações" 
          value={counts.total} 
          icon={<LayoutDashboard className="w-6 h-6 text-blue-600" />} 
          color="blue"
        />
        <StatCard 
          title="Em Processamento" 
          value={counts.processing} 
          icon={<Clock className="w-6 h-6 text-amber-600" />} 
          color="amber"
          pulse={counts.processing > 0}
        />
        <StatCard 
          title="Concluídas" 
          value={counts.completed} 
          icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />} 
          color="emerald"
        />
        <StatCard 
          title="Falhas" 
          value={counts.failed} 
          icon={<AlertCircle className="w-6 h-6 text-rose-600" />} 
          color="rose"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Imports List */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Importações Recentes
              <span className="text-xs font-medium px-2 py-0.5 bg-slate-200 rounded-full">{imports.length}</span>
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative group">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Pesquisar..." 
                  className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-48 shadow-sm transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="relative group">
                <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                <select 
                  className="appearance-none pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Todos Status</option>
                  <option value="PENDING">Pendentes</option>
                  <option value="PROCESSING">Processando</option>
                  <option value="COMPLETED">Concluídos</option>
                  <option value="PARTIAL">Sucesso Parcial</option>
                  <option value="FAILED">Falhas</option>
                </select>
              </div>

              <button 
                onClick={handleManualRefresh}
                disabled={isManualRefreshing || isFetching}
                className={`p-2 text-slate-400 hover:text-blue-600 bg-white border border-slate-200 rounded-lg shadow-sm transition-all active:scale-95 ${isManualRefreshing || isFetching ? 'animate-spin text-blue-500' : ''}`}
                title="Atualizar dados"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="card">
            {isLoading && !stats ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-4">
                <RefreshCw className="w-8 h-8 animate-spin" />
                <p className="font-medium uppercase text-[10px] tracking-widest">Iniciando Dashboard...</p>
              </div>
            ) : imports.length === 0 ? (
              <div className="p-20 text-center animate-in fade-in duration-700">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
                  <FileText className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-slate-800 font-bold mb-1">Nenhuma importação ainda</h3>
                <p className="text-slate-500 text-sm max-w-[200px] mx-auto leading-relaxed">Faça seu primeiro upload para começar a ver as estatísticas.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                      <th className="px-6 py-4">Nome do Arquivo</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Progresso</th>
                      <th className="px-6 py-4">Data</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {imports.map((item: any) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${item.fileType === 'CSV' ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'} border border-slate-100`}>
                              {item.fileType}
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 text-sm truncate max-w-[200px]">{item.originalFilename}</p>
                                <p className="text-[10px] font-bold text-slate-400">ID: ...{item.id.slice(-8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`badge badge-${item.status.toLowerCase()}`}>
                            {STATUS_MAP[item.status] || item.status}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="w-full max-w-[120px] space-y-1.5">
                            <div className="flex justify-between text-[10px] font-bold text-slate-500">
                              <span>{item.progressPercentage}%</span>
                              <span>{item.successRows}/{item.totalRows || '?'}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${item.progressPercentage}%` }}
                                className={`h-full ${item.status === 'FAILED' ? 'bg-rose-500' : 'bg-blue-600 shadow-[0_0_8px_rgba(59,130,246,0.5)]'}`}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-xs font-bold text-slate-600">{format(new Date(item.createdAt), 'dd MMM, HH:mm', { locale: ptBR })}</p>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <a href={`/imports/${item.id}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">
                            Ver Detalhes
                            <ArrowRight className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <div className="card p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-blue-200 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Pronto para importar?</h3>
              <p className="text-blue-100 text-xs font-medium mb-6 leading-relaxed">Processamento rápido, confiável e assíncrono para suas planilhas.</p>
              <button 
                onClick={() => setIsImportModalOpen(true)}
                className="w-full py-2.5 bg-white text-blue-700 rounded-xl font-bold text-sm shadow-sm hover:bg-blue-50 transition-colors active:scale-[0.98]"
              >
                Upload de Arquivo
              </button>
            </div>
          </div>

          <div className="card p-6 border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Resumo Técnico</h3>
            <div className="space-y-4">
               <SummaryItem 
                 label="Status da API" 
                 value={!stats || isError ? 'Offline' : 'Online'} 
                 status={!stats || isError ? 'error' : 'success'} 
               />
               <SummaryItem 
                 label="Versão do Sistema" 
                 value="v1.0.5" 
               />
               <SummaryItem 
                 label="Processamento" 
                 value={isError ? 'Pausado' : 'Em Espera'} 
                 status={isError ? 'error' : 'success'}
               />
               <SummaryItem 
                 label="Uptime do UI" 
                 value="Ativo" 
                 status="success"
               />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isImportModalOpen && (
          <ImportModal onClose={() => setIsImportModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ title, value, icon, color, pulse = false }: any) {
  const colors: any = {
    blue: 'border-blue-100 bg-blue-50/30',
    amber: 'border-amber-100 bg-amber-50/30',
    emerald: 'border-emerald-100 bg-emerald-50/30',
    rose: 'border-rose-100 bg-rose-50/30',
  };

  return (
    <div className={`card p-6 flex items-start justify-between border-b-4 transition-all hover:translate-y-[-2px] hover:shadow-md ${colors[color]}`}>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
        <h4 className="text-2xl font-black text-slate-800">{value}</h4>
      </div>
      <div className={`p-3 rounded-2xl bg-white shadow-sm border border-slate-100 ${pulse ? 'animate-pulse' : ''}`}>
        {icon}
      </div>
    </div>
  );
}

function SummaryItem({ label, value, status }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <div className="flex items-center gap-1.5">
        {status === 'success' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>}
        {status === 'error' && <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>}
        <span className="text-xs font-bold text-slate-700">{value}</span>
      </div>
    </div>
  );
}
