import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReactQueryProvider } from '@/lib/query-client';
import { ptBR } from 'date-fns/locale';
import ServiceStatus from '@/components/ServiceStatus';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ImportFlow | Gestão de Arquivos',
  description: 'Sistema profissional para importação de arquivos em larga escala',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <ReactQueryProvider>
          <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">I</div>
                    <span className="font-bold text-lg tracking-tight text-slate-900">ImportFlow</span>
                  </div>
                  <ServiceStatus />
                </div>
                <nav className="hidden md:flex items-center gap-6">
                  <a href="/" className="text-slate-600 hover:text-blue-600 text-sm font-semibold transition-colors">Dashboard</a>
                  <a href="/historico" className="text-slate-600 hover:text-blue-600 text-sm font-semibold transition-colors">Histórico</a>
                  <a href="/configuracoes" className="text-slate-600 hover:text-blue-600 text-sm font-semibold transition-colors">Configurações</a>
                </nav>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center text-xs font-bold text-slate-600">A</div>
                </div>
              </div>
            </header>
            <main className="flex-1 py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
            <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-400 text-xs font-medium">
              &copy; 2026 ImportFlow Inc. Importação Profissional de Arquivos.
            </footer>
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
