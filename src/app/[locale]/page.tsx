import Link from "next/link";
import { MoveRight, Cpu, Users, Layers, Zap, Activity, Settings, Network, Target, CheckSquare, ShieldAlert, MonitorSmartphone, Wrench, Ship, Factory, Car, Scissors } from "lucide-react";
import "../page.css";
import { useTranslations } from 'next-intl';

export default function Home({ params: { locale } }: { params: { locale: string } }) {
  const tNav = useTranslations('Navigation');
  const tHero = useTranslations('Hero');
  const tMES = useTranslations('MES');
  const tIoT = useTranslations('IoT');
  const tBen = useTranslations('Benefits');
  const tFooter = useTranslations('Footer');
  const tImp = useTranslations('Impact');

  return (
    <main className="main-wrapper">
      <header className="navbar">
        <div className="container nav-content">
          <div className="logo-container">
            <img src="/media/software/logo.png" alt="Spero Systems" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
          </div>
          <nav className="nav-links">
            <Link href="#mes">{tNav('software')}</Link>
            <Link href="#iot">{tNav('iot')}</Link>
            <Link href="#beneficios">{tNav('benefits')}</Link>
            <Link href={`/${locale}/hardware`}>{tNav('hardware')}</Link>
          </nav>
          <div className="language-switcher">
            <Link href="/pt" className={locale === 'pt' ? 'active' : ''}>PT</Link> | 
            <Link href="/en" className={locale === 'en' ? 'active' : ''}>EN</Link> | 
            <Link href="/es" className={locale === 'es' ? 'active' : ''}>ES</Link>
          </div>
        </div>
      </header>

      <section className="hero-section">
        <video 
          autoPlay loop muted playsInline 
          style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', top: 0, left: 0, zIndex: 0, opacity: 0.8 }}
        >
          <source src="/media/software/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="hero-bg-overlay"></div>
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              {tHero('title1')} <br />
              <span className="text-gradient">{tHero('title2')}</span>
            </h1>
            <p className="hero-subtitle">
              {tHero('subtitle')}
            </p>
            <div className="hero-actions">
              <Link href={`/${locale}/demo`} className="btn btn-primary">
                {tHero('ctaPrimary')} <MoveRight className="icon-right" size={18} />
              </Link>
              <Link href="#mes" className="btn btn-outline">
                {tHero('ctaSecondary')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="mes" className="section mes-section">
        <div className="container">
          <div className="section-header">
            <h2>{tMES('sectionTitle')}</h2>
            <p>{tMES('sectionSubtitle')}</p>
          </div>
          
          <div className="mes-grid">
            <div className="clean-card iot-card" style={{ padding: 0 }}>
              <img src="/media/software/mes-c1.jpeg" alt="OEE" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '1.5rem' }}>
                <div className="iot-icon-wrapper" style={{ marginTop: '-40px', position: 'relative', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}><Settings size={28} /></div>
                <div className="iot-content">
                  <h3>{tMES('card1Title')}</h3>
                  <p>{tMES('card1Text')}</p>
                </div>
              </div>
            </div>
            <div className="clean-card iot-card" style={{ padding: 0 }}>
              <img src="/media/software/qualidade.jpeg" alt="Audits" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '1.5rem' }}>
                <div className="iot-icon-wrapper" style={{ marginTop: '-40px', position: 'relative', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}><Activity size={28} /></div>
                <div className="iot-content">
                  <h3>{tMES('card2Title')}</h3>
                  <p>{tMES('card2Text')}</p>
                </div>
              </div>
            </div>
            <div className="clean-card iot-card" style={{ padding: 0 }}>
              <img src="/media/software/andon.jpeg" alt="Andon" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '1.5rem' }}>
                <div className="iot-icon-wrapper" style={{ marginTop: '-40px', position: 'relative', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}><Network size={28} /></div>
                <div className="iot-content">
                  <h3>{tMES('card3Title')}</h3>
                  <p>{tMES('card3Text')}</p>
                </div>
              </div>
            </div>
            <div className="clean-card iot-card" style={{ padding: 0 }}>
              <img src="/media/software/mes-c3.png" alt="HR/9-Box" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '1.5rem' }}>
                <div className="iot-icon-wrapper" style={{ marginTop: '-40px', position: 'relative', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}><Layers size={28} /></div>
                <div className="iot-content">
                  <h3>{tMES('card4Title')}</h3>
                  <p>{tMES('card4Text')}</p>
                </div>
              </div>
            </div>
            <div className="clean-card iot-card" style={{ padding: 0 }}>
              <img src="/media/software/kaizen.jpeg" alt="Kaizen" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '1.5rem' }}>
                <div className="iot-icon-wrapper" style={{ marginTop: '-40px', position: 'relative', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}><Target size={28} /></div>
                <div className="iot-content">
                  <h3>{tMES('card5Title')}</h3>
                  <p>{tMES('card5Text')}</p>
                </div>
              </div>
            </div>
            <div className="clean-card iot-card" style={{ padding: 0 }}>
              <img src="/media/software/gemba.jpeg" alt="Gemba" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '1.5rem' }}>
                <div className="iot-icon-wrapper" style={{ marginTop: '-40px', position: 'relative', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}><CheckSquare size={28} /></div>
                <div className="iot-content">
                  <h3>{tMES('card6Title')}</h3>
                  <p>{tMES('card6Text')}</p>
                </div>
              </div>
            </div>
            <div className="clean-card iot-card" style={{ padding: 0 }}>
              <img src="/media/software/hst.jpeg" alt="HST" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '1.5rem' }}>
                <div className="iot-icon-wrapper" style={{ marginTop: '-40px', position: 'relative', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}><ShieldAlert size={28} /></div>
                <div className="iot-content">
                  <h3>{tMES('card7Title')}</h3>
                  <p>{tMES('card7Text')}</p>
                </div>
              </div>
            </div>
            <div className="clean-card iot-card" style={{ padding: 0 }}>
              <img src="/media/software/Quiosque.jpeg" alt="Quiosque" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '1.5rem' }}>
                <div className="iot-icon-wrapper" style={{ marginTop: '-40px', position: 'relative', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}><MonitorSmartphone size={28} /></div>
                <div className="iot-content">
                  <h3>{tMES('card8Title')}</h3>
                  <p>{tMES('card8Text')}</p>
                </div>
              </div>
            </div>
            <div className="clean-card iot-card" style={{ padding: 0 }}>
              <img src="/media/software/ferramentaria.jpeg" alt="Ferramentaria" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '1.5rem' }}>
                <div className="iot-icon-wrapper" style={{ marginTop: '-40px', position: 'relative', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}><Wrench size={28} /></div>
                <div className="iot-content">
                  <h3>{tMES('card9Title')}</h3>
                  <p>{tMES('card9Text')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="impacto" className="impact-section">
         <div className="impact-bg"></div>
         <div className="impact-bg-gradient"></div>
         
         <div className="container impact-content">
            <div className="power-stats-grid">
               <div className="power-stat-item">
                  <div className="power-stat-value">{tImp('stat1')}</div>
                  <div className="power-stat-desc">{tImp('stat1Desc')}</div>
               </div>
               <div className="power-stat-item">
                  <div className="power-stat-value">{tImp('stat2')}</div>
                  <div className="power-stat-desc">{tImp('stat2Desc')}</div>
               </div>
               <div className="power-stat-item">
                  <div className="power-stat-value">{tImp('stat3')}</div>
                  <div className="power-stat-desc">{tImp('stat3Desc')}</div>
               </div>
               <div className="power-stat-item">
                  <div className="power-stat-value">{tImp('stat4')}</div>
                  <div className="power-stat-desc">{tImp('stat4Desc')}</div>
               </div>
            </div>
         </div>
         
         <div className="trust-marquee-wrapper">
            <div className="trust-marquee">
               <span>
                  {tImp('marquee')}
               </span>
               <span>
                  <Ship className="lucide" size={20} /> {tImp('ind1')}
               </span>
               <span>
                  <Wrench className="lucide" size={20} /> {tImp('ind2')}
               </span>
               <span>
                  <Factory className="lucide" size={20} /> {tImp('ind3')}
               </span>
               <span>
                  <Car className="lucide" size={20} /> {tImp('ind4')}
               </span>
               <span>
                  <Scissors className="lucide" size={20} /> {tImp('ind5')}
               </span>
               
               {/* DUPLICATE TO CREATE THE INFINITE LOOP RUNNING SMOOTHLY */}
               <span style={{ marginLeft: '4rem' }}>
                  {tImp('marquee')}
               </span>
               <span>
                  <Ship className="lucide" size={20} /> {tImp('ind1')}
               </span>
               <span>
                  <Wrench className="lucide" size={20} /> {tImp('ind2')}
               </span>
               <span>
                  <Factory className="lucide" size={20} /> {tImp('ind3')}
               </span>
               <span>
                  <Car className="lucide" size={20} /> {tImp('ind4')}
               </span>
               <span>
                  <Scissors className="lucide" size={20} /> {tImp('ind5')}
               </span>
            </div>
         </div>
      </section>

      <section id="iot" className="section iot-section">
        <div className="container">
          <div className="section-header text-center">
            <h2>{tIoT('sectionTitle')}</h2>
            <p>{tIoT('sectionSubtitle')}</p>
          </div>

          <div className="iot-grid">
            <div className="clean-card iot-card" style={{ padding: 0 }}>
              <img src="/media/iot/iot-1.jpeg" alt="Sensors" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '1.5rem' }}>
                <div className="iot-icon-wrapper" style={{ marginTop: '-40px', position: 'relative', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}><Cpu size={28} /></div>
                <div className="iot-content">
                  <h3>{tIoT('card1Title')}</h3>
                  <p>{tIoT('card1Text')}</p>
                </div>
              </div>
            </div>

            <div className="clean-card iot-card" style={{ padding: 0 }}>
              <img src="/media/iot/iot-2.jpeg" alt="Attendance" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '1.5rem' }}>
                <div className="iot-icon-wrapper" style={{ marginTop: '-40px', position: 'relative', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}><Users size={28} /></div>
                <div className="iot-content">
                  <h3>{tIoT('card2Title')}</h3>
                  <p>{tIoT('card2Text')}</p>
                </div>
              </div>
            </div>

            <div className="clean-card iot-card" style={{ padding: 0 }}>
              <img src="/media/iot/iot-3.jpeg" alt="Assets" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '1.5rem' }}>
                <div className="iot-icon-wrapper" style={{ marginTop: '-40px', position: 'relative', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}><Layers size={28} /></div>
                <div className="iot-content">
                  <h3>{tIoT('card3Title')}</h3>
                  <p>{tIoT('card3Text')}</p>
                </div>
              </div>
            </div>

            <div className="clean-card iot-card" style={{ padding: 0 }}>
              <img src="/media/iot/iot-4.jpeg" alt="Automation" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '1.5rem' }}>
                <div className="iot-icon-wrapper" style={{ marginTop: '-40px', position: 'relative', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}><Zap size={28} /></div>
                <div className="iot-content">
                  <h3>{tIoT('card4Title')}</h3>
                  <p>{tIoT('card4Text')}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="iot-cta-wrapper">
             <Link href={`/${locale}/hardware`} className="btn btn-outline center-btn">
                {tIoT('cta')}
             </Link>
          </div>
        </div>
      </section>

      <section id="beneficios" className="section beneficios-section">
         <div className="container">
            <div className="section-header">
               <h2>{tBen('title')}</h2>
            </div>
            <div className="benefits-grid">
               {[1, 2, 3, 4, 5, 6].map(num => (
                 <div key={num} className="benefit-item">
                    <div className="b-number">0{num}</div>
                    <h4>{tBen(`b${num}Title`)}</h4>
                    <p>{tBen(`b${num}Text`)}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      <footer id="contacto" className="footer">
         <div className="container footer-grid">
            <div className="footer-brand">
               <h3>SPERO Systems</h3>
               <p>{tFooter('slogan')}</p>
            </div>
            <div className="footer-contact">
               <h4>{tFooter('contact')}</h4>
               <p style={{ margin: '0.2rem 0' }}>{tFooter('address')}</p>
               <p style={{ margin: '0.2rem 0' }}>{tFooter('phone')}</p>
               <p style={{ margin: '0.2rem 0' }}>{tFooter('email')}</p>
               <a href="mailto:contacto@sperosystems.pt" className="btn btn-primary btn-small" style={{marginTop: '1.5rem'}}>
                  {tFooter('btn')}
               </a>
            </div>
         </div>
         <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Spero Systems. {tFooter('rights')}</p>
         </div>
      </footer>
    </main>
  );
}
