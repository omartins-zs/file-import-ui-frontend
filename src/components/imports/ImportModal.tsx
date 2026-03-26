"use client";

import { useState, useCallback } from 'react';
import { useUploadFile } from '@/hooks/useUploadFile';
import { usePreview } from '@/hooks/usePreview';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';

export default function ImportModal({ onClose }: { onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const { preview, isLoading: previewLoading } = usePreview(file);
  const { upload, isLoading: uploadLoading, isSuccess } = useUploadFile();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
  });

  const handleUpload = async () => {
    if (file) {
      await upload(file);
      setTimeout(onClose, 2000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0">
          <h2 className="text-xl font-bold text-slate-800">Nova Importação</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {isSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-100">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-800">Transferência Concluída!</h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto">Seu arquivo está sendo processado. Você pode acompanhar o progresso no dashboard.</p>
            </div>
          ) : !file ? (
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer shadow-inner ${isDragActive ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-100' : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'}`}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-100 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">Arraste sua planilha aqui</h4>
              <p className="text-slate-500 text-sm font-medium mb-8">Suporta CSV, XLSX de até 50MB</p>
              <button className="btn-primary">Selecionar Arquivo</button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{file.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 capitalize">{(file.size / 1024).toFixed(1)} KB • {file.name.split('.').pop()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setFile(null)} 
                  className="text-xs font-bold text-rose-500 hover:underline"
                >
                  Alterar Arquivo
                </button>
              </div>

              {previewLoading ? (
                <div className="py-12 flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gerando pré-visualização...</p>
                </div>
              ) : preview ? (
                <div className="space-y-3">
                  <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    Pré-visualização
                    <span className="h-px flex-1 bg-slate-100"></span>
                  </h5>
                  <div className="card shadow-none border-slate-200 bg-slate-50/50">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11px] font-medium text-slate-600">
                        <thead className="bg-white border-b border-slate-200">
                          <tr>
                            {Object.keys(preview.items[0] || {}).map(h => (
                              <th key={h} className="px-4 py-2 font-bold text-slate-400">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {preview.items.slice(0, 5).map((row: any, i: number) => (
                            <tr key={i}>
                              {Object.values(row).map((v: any, j: number) => (
                                <td key={j} className="px-4 py-2 truncate max-w-[150px]">{String(v)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Mostrando as primeiras {preview.items.length} linhas para validação.
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="btn-secondary"
            disabled={uploadLoading}
          >
            Cancelar
          </button>
          <button 
            onClick={handleUpload} 
            className={`btn-primary shadow-blue-200 shadow-lg min-w-[120px] ${!file || uploadLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!file || uploadLoading || isSuccess}
          >
            {uploadLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Iniciar Importação'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
