"use client";

import { useState } from 'react';
import { 
  Settings as SettingsIcon,
  Save, 
  Database, 
  Server, 
  Bell, 
  ShieldCheck, 
  Cpu, 
  Network, 
  Activity, 
  Globe,
  HardDrive
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('geral');

  const tabs = [
    { id: 'geral', label: 'Geral', icon: <Globe className="w-4 h-4" /> },
    { id: 'conexoes', label: 'Conexões de Banco', icon: <Database className="w-4 h-4" /> },
    { id: 'notificacoes', label: 'Notificações', icon: <Bell className="w-4 h-4" /> },
    { id: 'seguranca', label: 'Segurança', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="animate-in fade-in slide-in-from-left duration-500">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-blue-600" />
          Configurações
        </h1>
        <p className="text-slate-500 font-medium">Gerencie os parâmetros do motor de importação e conexões.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2 animate-in fade-in duration-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all relative ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-[-4px] w-2 h-6 bg-blue-400 rounded-full blur-sm"
                />
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === 'geral' && (
              <motion.div
                key="geral"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="card p-8 space-y-8 border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
                       <Server className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-800">Parâmetros do Servidor</h2>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Configurações globais do Worker</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Timeout de Processamento (ms)</label>
                        <input type="number" defaultValue={30000} className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                        <p className="text-[10px] text-slate-400 font-medium">Tempo máximo antes de um Job falhar por timeout.</p>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Limite de Linhas por Lote</label>
                        <input type="number" defaultValue={100} className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                        <p className="text-[10px] text-slate-400 font-medium">Chunk size para o processamento idempotente.</p>
                     </div>
                  </div>

                  <hr className="border-slate-100" />

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100/50 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                           <HardDrive className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                           <p className="font-black text-slate-800 text-sm">Limpeza Automática</p>
                           <p className="text-xs text-slate-500 font-medium">Excluir arquivos originais após 30 dias.</p>
                        </div>
                     </div>
                     <Toggle checked />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="btn-primary flex items-center gap-2 px-8 shadow-lg shadow-blue-100">
                    <Save className="w-4 h-4" />
                    Salvar Alterações
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'conexoes' && (
              <motion.div
                key="conexoes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="grid gap-6">
                  <ConnectionCard 
                     title="PostgreSQL (Main Database)" 
                     host="localhost:5432"
                     mode="Local Environment"
                     status="online"
                     dbName="file_import_db"
                     icon={<Database className="w-5 h-5 text-indigo-600" />}
                  />
                  
                  <ConnectionCard 
                     title="Redis (Job Queue)" 
                     host="redis:6379"
                     mode="Docker Container"
                     status="online"
                     dbName="BullMQ Engine"
                     icon={<Activity className="w-5 h-5 text-rose-600" />}
                  />

                  <div className="card p-6 border-slate-200 bg-slate-900 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-xl"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                           <Network className="w-5 h-5 text-blue-400" />
                           <span className="font-extrabold text-sm uppercase tracking-tighter">Resumo da Infraestrutura</span>
                        </div>
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-[9px] font-black rounded-lg uppercase tracking-widest border border-blue-500/30">Híbrido Detectado</span>
                      </div>
                      <div className="space-y-3 font-mono text-[10px]">
                         <p className="text-slate-400 flex justify-between border-b border-white/5 pb-2">
                           <span>ESTADO:</span>
                           <span className="text-blue-400">ATIVO (RODANDO NO WINDOWS)</span>
                         </p>
                         <p className="text-slate-400 flex justify-between border-b border-white/5 pb-2">
                           <span>CONTAINERS:</span>
                           <span className="text-rose-400">REDIS, POSTGRES (DOCKER)</span>
                         </p>
                         <p className="text-slate-400 flex justify-between">
                           <span>LATÊNCIA:</span>
                           <span className="text-emerald-400">{'< 1ms (INTERNO)'}</span>
                         </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notificacoes' && (
              <motion.div
                key="notificacoes"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="card p-16 text-center border-slate-100"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
                   <Bell className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">Notificações por E-mail</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                  Em breve você poderá configurar Webhooks e alertas de e-mail para acompanhar suas importações em tempo real.
                </p>
                <button className="mt-8 px-6 py-2 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs uppercase cursor-not-allowed">
                   Funcionalidade em desenvolvimento
                </button>
              </motion.div>
            )}

            {activeTab === 'seguranca' && (
              <motion.div
                key="seguranca"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="card p-16 text-center border-slate-100"
              >
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
                   <ShieldCheck className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">Segurança & API</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                  Gere chaves de API secundárias e limite o número de linhas por arquivo para garantir a estabilidade do seu cluster.
                </p>
                <button className="mt-8 px-6 py-2 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs uppercase cursor-not-allowed">
                   Painel Restrito
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ConnectionCard({ title, host, mode, status, dbName, icon }: any) {
  return (
    <div className="card p-6 border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-xl hover:translate-y-[-2px] transition-all bg-white group">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner group-hover:bg-blue-50/50 transition-colors">
           {icon}
        </div>
        <div>
          <h4 className="font-black text-slate-800">{title}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{host}</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className={`text-[10px] font-black uppercase tracking-widest ${mode.includes('Local') ? 'text-amber-600' : 'text-blue-600'}`}>{mode}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="text-right hidden sm:block">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base/Schema</p>
           <p className="text-sm font-bold text-slate-700">{dbName}</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status === 'online' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <span className="text-[10px] font-black uppercase tracking-tighter">{status}</span>
        </div>
      </div>
    </div>
  );
}

function Toggle({ checked = false }: { checked?: boolean }) {
  const [isOn, setIsOn] = useState(checked);
  return (
    <button 
      onClick={() => setIsOn(!isOn)}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors outline-none focus:ring-4 focus:ring-blue-100/50 ${isOn ? 'bg-blue-600' : 'bg-slate-200'}`}
    >
      <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isOn ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}
