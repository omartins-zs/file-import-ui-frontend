"use client";

import { useQuery } from '@tanstack/react-query';
import { importsService } from '@/lib/api';
import { 
  History, 
  Search, 
  Filter, 
  ArrowRight,
  RefreshCw,
  FileText
} from 'lucide-react';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const STATUS_MAP: Record<string, string> = {
  PENDING: 'Pendente',
  PROCESSING: 'Processando',
  COMPLETED: 'Concluído',
  FAILED: 'Falhou',
  PARTIAL: 'Parcial',
}

export default function HistoricoPage() {
  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ['all-imports'],
    queryFn: () => importsService.list({ limit: 100 }),
  });

  const imports = stats?.items || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <History className="w-8 h-8 text-blue-600" />
            Histórico Geral
          </h1>
          <p className="text-slate-500 font-medium">Veja todos os arquivos processados pelo sistema desde o início.</p>
        </div>
        <button onClick={() => refetch()} className="btn-secondary">
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      <div className="card">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input 
               type="text" 
               placeholder="Pesquisar por nome do arquivo..." 
               className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
             />
          </div>
          <button className="btn-secondary !py-2">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>

        {isLoading ? (
          <div className="p-12 text-center flex flex-col items-center gap-4">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Carregando histórico...</p>
          </div>
        ) : imports.length === 0 ? (
          <div className="p-20 text-center">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-300" />
             </div>
             <p className="text-slate-500 font-medium">Nenhum registro encontrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                  <th className="px-6 py-4">Arquivo</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Resultados</th>
                  <th className="px-6 py-4">Data de Importação</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {imports.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                       <span className="font-bold text-slate-800 text-sm">{item.originalFilename}</span>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`badge badge-${item.status.toLowerCase()}`}>
                         {STATUS_MAP[item.status] || item.status}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="text-xs font-bold text-slate-600">
                         {item.successRows} sucessos / {item.errorRows} erros
                       </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-400">
                       {format(new Date(item.createdAt), "dd 'de' MMMM, HH:mm", { locale: ptBR })}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <a href={`/imports/${item.id}`} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all inline-block border border-transparent hover:border-slate-200">
                          <ArrowRight className="w-4 h-4 text-blue-600" />
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
  );
}
