"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { importsService } from '@/lib/api';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Database, 
  FileText,
  Terminal,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useState } from 'react';

const STATUS_MAP: Record<string, string> = {
  PENDING: 'Pendente',
  PROCESSING: 'Processando',
  COMPLETED: 'Concluído',
  FAILED: 'Falhou',
  PARTIAL: 'Parcial',
}

export default function ImportDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errorPage, setErrorPage] = useState(1);
  const [logPage, setLogPage] = useState(1);

  const { data: importData, isLoading } = useQuery({
    queryKey: ['import', id],
    queryFn: () => importsService.get(id as string),
    refetchInterval: (query) => 
      query.state.data?.status === 'PROCESSING' || query.state.data?.status === 'PENDING' ? 2000 : false,
  });

  const { data: errors } = useQuery({
    queryKey: ['import-errors', id, errorPage],
    queryFn: () => importsService.errors(id as string, { page: errorPage, limit: 10 }),
    enabled: !!id,
  });

  const { data: logs } = useQuery({
    queryKey: ['import-logs', id, logPage],
    queryFn: () => importsService.logs(id as string, { page: logPage, limit: 10 }),
    enabled: !!id,
  });

  const retryMutation = useMutation({
    mutationFn: () => importsService.retry(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['import', id] });
    },
  });

  if (isLoading) return (
    <div className="py-20 text-center animate-pulse flex flex-col items-center gap-4">
      <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
      <div className="h-4 w-48 bg-slate-200 rounded"></div>
    </div>
  );

  if (!importData) return (
    <div className="py-20 text-center bg-white rounded-2xl border border-slate-200">
      <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
      <h2 className="text-xl font-bold">Importação não encontrada</h2>
      <button onClick={() => router.push('/')} className="mt-4 text-blue-600 font-bold underline">Voltar para Dashboard</button>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/')}
            className="p-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-all text-slate-500 hover:text-slate-900 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`badge badge-${importData.status.toLowerCase()}`}>
                {STATUS_MAP[importData.status] || importData.status}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-0.5 border border-slate-100 rounded bg-white">
                ID: {importData.id.slice(-12)}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 truncate max-w-md">{importData.originalFilename}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           {(importData.status === 'FAILED' || importData.status === 'PARTIAL') && (
             <button 
               onClick={() => retryMutation.mutate()}
               disabled={retryMutation.isPending}
               className="btn-primary bg-amber-600 hover:bg-amber-700 shadow-amber-100"
             >
               <RotateCcw className={`w-4 h-4 ${retryMutation.isPending ? 'animate-spin' : ''}`} />
               Tentar Novamente
             </button>
           )}
           <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="text-right">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none">Total Linhas</p>
                 <p className="text-lg font-black text-slate-900 leading-none mt-1">{importData.totalRows || '?'}</p>
              </div>
              <div className="w-px h-8 bg-slate-100"></div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                 <Database className="w-5 h-5" />
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="card p-8 relative overflow-hidden">
            {importData.status === 'PROCESSING' && (
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${importData.progressPercentage}%` }}
                  className="h-full bg-blue-600 shadow-[0_0_10px_rgba(59,130,246,1)]"
                ></motion.div>
              </div>
            )}
            
            <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
              <MetricItem 
                label="Sucesso" 
                value={importData.successRows} 
                icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />} 
                subValue={`${((importData.successRows / importData.totalRows || 0) * 100).toFixed(1)}%`}
              />
              <MetricItem 
                label="Erros" 
                value={importData.errorRows} 
                icon={<AlertCircle className="w-5 h-5 text-rose-500" />} 
                subValue={`${((importData.errorRows / importData.totalRows || 0) * 100).toFixed(1)}%`}
              />
              <MetricItem 
                label="Processadas" 
                value={importData.processedRows} 
                icon={<Clock className="w-5 h-5 text-blue-500" />} 
                subValue={`${importData.progressPercentage}%`}
              />
              <MetricItem 
                label="Duração" 
                value={importData.durationMs ? `${(importData.durationMs / 1000).toFixed(2)}s` : 'Processando...'} 
                icon={<RotateCcw className="w-5 h-5 text-slate-400" />} 
              />
            </div>

            <div className="h-4 w-full bg-slate-50 rounded-full border border-slate-100 overflow-hidden shadow-inner">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${importData.progressPercentage}%` }}
                 className={`h-full ${importData.status === 'FAILED' ? 'bg-rose-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600'}`}
               />
            </div>
          </div>

          <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                Erros por Linha
                {errors?.total > 0 && <span className="text-xs px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-full font-bold">{errors.total}</span>}
              </h3>
              <div className="card shadow-none">
                {!errors?.items || errors.items.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 font-medium">Nenhum erro detectado neste lote.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <tr>
                          <th className="px-6 py-4">Linha</th>
                          <th className="px-6 py-4">Campo</th>
                          <th className="px-6 py-4">Mensagem</th>
                          <th className="px-6 py-4">Dados Brutos</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {errors.items.map((err: any) => (
                          <tr key={err.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-black text-slate-800">#{err.rowNumber}</td>
                            <td className="px-6 py-4 text-slate-500 font-bold">{err.fieldName || 'Global'}</td>
                            <td className="px-6 py-4">
                              <span className="text-rose-600 font-medium bg-rose-50 px-2 py-0.5 rounded border border-rose-100/50">{err.errorMessage}</span>
                            </td>
                            <td className="px-6 py-4 max-w-xs transition-opacity hover:opacity-100 opacity-60">
                              <code className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 truncate block">
                                {JSON.stringify(JSON.parse(err.rawData || '{}'))}
                              </code>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {errors?.totalPages > 1 && (
                  <Pagination current={errorPage} total={errors.total} limit={10} onPageChange={setErrorPage} />
                )}
              </div>
          </div>
        </div>

        <div className="space-y-8">
            <div className="card p-6 border-slate-100 bg-slate-50/30">
               <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <FileText className="w-3.5 h-3.5" />
                 Metadados do Arquivo
               </h4>
               <div className="space-y-4">
                  <SideInfo label="Nome Original" value={importData.originalFilename} />
                  <SideInfo label="Mime Type" value={importData.mimeType} />
                  <SideInfo label="Tamanho" value={`${(importData.fileSize / 1024).toFixed(2)} KB`} />
                  <SideInfo label="Checksum MD5" value={importData.checksum.slice(0, 16) + '...'} />
                  <SideInfo label="Iniciado em" value={importData.startedAt ? format(new Date(importData.startedAt), 'dd/MM/yyyy HH:mm:ss') : '-'} />
                  <SideInfo label="Finalizado em" value={importData.finishedAt ? format(new Date(importData.finishedAt), 'dd/MM/yyyy HH:mm:ss') : '-'} />
               </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5" />
                Logs de Execução
              </h4>
              <div className="card rounded-2xl bg-slate-900 border-none shadow-xl border-slate-800 p-2">
                 <div className="space-y-2 max-h-[400px] overflow-y-auto p-4 font-mono text-[11px] leading-relaxed custom-scrollbar">
                    {!logs?.items || logs.items.length === 0 ? (
                       <div className="text-slate-600 italic">Sem logs de execução disponíveis.</div>
                    ) : (
                      logs.items.map((log: any) => (
                        <div key={log.id} className="flex gap-3 group">
                           <span className="text-slate-500 whitespace-nowrap opacity-50 font-bold">[{format(new Date(log.createdAt), 'HH:mm:ss')}]</span>
                           <span className={`font-black ${log.level === 'ERROR' ? 'text-rose-400' : 'text-blue-400'}`}>{log.level}</span>
                           <span className="text-slate-300 group-hover:text-white transition-colors">{log.message}</span>
                        </div>
                      )).reverse()
                    )}
                 </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function MetricItem({ label, value, icon, subValue }: any) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-white border border-slate-100 shadow-sm">
          {icon}
        </div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{label}</span>
      </div>
      <div className="flex items-baseline gap-2 pl-1">
        <span className="text-2xl font-black text-slate-900">{value}</span>
        {subValue && <span className="text-[10px] font-bold text-slate-400 uppercase">{subValue}</span>}
      </div>
    </div>
  );
}

function SideInfo({ label, value }: any) {
  return (
    <div className="flex flex-col">
       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">{label}</span>
       <span className="text-xs font-bold text-slate-700 truncate">{value}</span>
    </div>
  );
}

function Pagination({ current, total, limit, onPageChange }: any) {
  const totalPages = Math.ceil(total / limit);
  return (
    <div className="px-6 py-4 bg-slate-50/50 flex items-center justify-between border-t border-slate-100">
       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Página {current} de {totalPages}</span>
       <div className="flex items-center gap-1">
          <button 
            onClick={() => onPageChange(Math.max(1, current - 1))}
            disabled={current === 1}
            className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          >
             <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
             onClick={() => onPageChange(Math.min(totalPages, current + 1))}
             disabled={current === totalPages}
             className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          >
             <ChevronRight className="w-4 h-4" />
          </button>
       </div>
    </div>
  )
}
