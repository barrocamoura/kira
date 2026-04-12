import Link from "next/link";
import { MoveLeft, Cpu, Activity, Box, Zap, Cloud, Database, Wifi, ScanLine, UserCheck } from "lucide-react";
import "../../page.css";
import { useTranslations } from 'next-intl';

export default function Hardware({ params: { locale } }: { params: { locale: string } }) {
  const tHW = useTranslations('Hardware');
  const tNav = useTranslations('Navigation');

  const hwCatalog = [
    { id: 1, img: 'iot-1.jpeg', title: tHW('hcard1Title'), text: tHW('hcard1Text'), tag: 'FLOW CONTROL', icon: <Activity size={18} /> },
    { id: 2, img: 'iot-2.jpeg', title: tHW('hcard2Title'), text: tHW('hcard2Text'), tag: 'RFID / NFC', icon: <ScanLine size={18} /> },
    { id: 3, img: 'iot-3.jpeg', title: tHW('hcard3Title'), text: tHW('hcard3Text'), tag: 'LOAD TRACKING', icon: <Box size={18} /> },
    { id: 4, img: 'iot-4.jpeg', title: tHW('hcard4Title'), text: tHW('hcard4Text'), tag: 'OEE & CNC', icon: <Cpu size={18} /> },
    { id: 5, img: 'iot-5.jpeg', title: tHW('hcard5Title'), text: tHW('hcard5Text'), tag: 'ENVIRONMENTAL', icon: <Cloud size={18} /> },
    { id: 6, img: 'iot-6.jpeg', title: tHW('hcard6Title'), text: tHW('hcard6Text'), tag: 'ULTRASONIC LEVEL', icon: <Database size={18} /> },
    { id: 7, img: 'iot-7.jpeg', title: tHW('hcard7Title'), text: tHW('hcard7Text'), tag: 'GSM COMMS', icon: <Wifi size={18} /> },
    { id: 8, img: 'iot-8.jpeg', title: tHW('hcard8Title'), text: tHW('hcard8Text'), tag: 'INDUSTRIAL VISION', icon: <Zap size={18} /> },
    { id: 9, img: 'iot-9.jpeg', title: tHW('hcard9Title'), text: tHW('hcard9Text'), tag: 'BIOMETRICS', icon: <UserCheck size={18} /> },
  ];

  return (
    <main className="main-wrapper hw-nasa-section" style={{ minHeight: '100vh', padding: '100px 0 0' }}>
      <header className="navbar">
        <div className="container nav-content">
          <div className="logo-container">
            <img src="/media/software/logo.png" alt="Spero Systems" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
          </div>
          <nav className="nav-links">
            <Link href={`/${locale}#mes`}>{tNav('software')}</Link>
            <Link href={`/${locale}#iot`}>{tNav('iot')}</Link>
            <Link href={`/${locale}#beneficios`}>{tNav('benefits')}</Link>
            <Link href={`/${locale}/hardware`} style={{ color: 'var(--color-corporate-blue)' }}>{tNav('hardware')}</Link>
          </nav>
          <div className="language-switcher">
            <Link href="/pt/hardware" className={locale === 'pt' ? 'active' : ''}>PT</Link> | 
            <Link href="/en/hardware" className={locale === 'en' ? 'active' : ''}>EN</Link> | 
            <Link href="/es/hardware" className={locale === 'es' ? 'active' : ''}>ES</Link>
          </div>
        </div>
      </header>

      <div className="container" style={{ paddingTop: '50px' }}>
         <Link href={`/${locale}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-corporate-blue)', textDecoration: 'none', marginBottom: '3rem', fontWeight: 600 }}>
            <MoveLeft size={18} /> {tHW('back')}
         </Link>
         
         <div className="hw-nasa-header">
            <h1>{tHW('title')}</h1>
            <p>{tHW('subtitle')}</p>
         </div>

         <div className="hw-nasa-grid">
            {hwCatalog.map((device) => (
              <div key={device.id} className="hw-nasa-card">
                 <div className="hw-nasa-image-wrapper">
                    <img src={`/media/iot/${device.img}`} alt={device.title} className="hw-nasa-image" />
                 </div>
                 <div className="hw-nasa-content">
                    <div className="hw-nasa-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                       {device.icon} {device.tag}
                    </div>
                    <h2 className="hw-nasa-title">{device.title}</h2>
                    <p className="hw-nasa-desc">{device.text}</p>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </main>
  );
}
