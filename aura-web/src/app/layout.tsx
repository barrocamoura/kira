import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kira OS - Inteligência Artificial para Automação Espacial',
  description: 'O primeiro sistema operacional preditivo para residências e escritórios corporativos.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
