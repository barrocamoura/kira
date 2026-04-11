import Link from "next/link";
import { MoveLeft, Cpu, ShieldAlert, BarChart4, Wifi } from "lucide-react";
import "../../page.css";
import { useTranslations } from 'next-intl';

export default function Hardware({ params: { locale } }: { params: { locale: string } }) {
  const tHW = useTranslations('Hardware');

  return (
    <main className="main-wrapper" style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="container">
         <Link href={`/${locale}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-action-blue)', textDecoration: 'none', marginBottom: '2rem', fontWeight: 600 }}>
            <MoveLeft size={18} /> {tHW('back')}
         </Link>
         
         <div className="section-header">
            <h1 style={{ color: 'var(--color-corporate-blue)', fontSize: '2.5rem', marginBottom: '1rem' }}>{tHW('title')}</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>{tHW('subtitle')}</p>
         </div>

         <div className="iot-grid" style={{ marginTop: '3rem' }}>
            <div className="clean-card iot-card">
               <div className="iot-icon-wrapper"><Cpu size={28} /></div>
               <div className="iot-content">
                  <h3>Sensores de Vibração</h3>
                  <p>Equipamento IoT de alta sensibilidade para análise acústica e vibração. Essencial para Manutenção Preditiva.</p>
               </div>
            </div>

            <div className="clean-card iot-card">
               <div className="iot-icon-wrapper"><ShieldAlert size={28} /></div>
               <div className="iot-content">
                  <h3>Painéis de Controlo</h3>
                  <p>Ecrãs industriais touch-screen para apontamentos do operador em chão de fábrica.</p>
               </div>
            </div>

            <div className="clean-card iot-card">
               <div className="iot-icon-wrapper"><BarChart4 size={28} /></div>
               <div className="iot-content">
                  <h3>Câmaras Inteligentes</h3>
                  <p>Sensores ópticos para inspeção de qualidade automática no final da linha.</p>
               </div>
            </div>

            <div className="clean-card iot-card">
               <div className="iot-icon-wrapper"><Wifi size={28} /></div>
               <div className="iot-content">
                  <h3>IoT Hub Master</h3>
                  <p>O gateway central que conecta todos os sensores da linha de produção ao servidor MES.</p>
               </div>
            </div>
         </div>
      </div>
    </main>
  );
}
