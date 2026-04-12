import Link from "next/link";
import { MoveLeft, CheckCircle2 } from "lucide-react";
import "../../page.css";
import { useTranslations } from 'next-intl';

export default function DemoPage({ params: { locale } }: { params: { locale: string } }) {
  const tDemo = useTranslations('Demo');
  const tNav = useTranslations('Navigation');
  const tFooter = useTranslations('Footer');

  return (
    <main className="main-wrapper demo-main">
      <header className="navbar">
        <div className="container nav-content">
          <div className="logo-container">
            <Link href={`/${locale}`}>
              <img src="/media/software/logo.png" alt="Spero Systems" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
            </Link>
          </div>
          <nav className="nav-links">
             <Link href={`/${locale}`} className="btn btn-outline center-btn" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                <MoveLeft size={16} style={{marginRight: '0.5rem'}}/> {tNav('software')}
             </Link>
          </nav>
        </div>
      </header>

      <section className="demo-hero-section">
         <div className="demo-bg-overlay"></div>
         <div className="container demo-container">
            <div className="demo-grid">
               
               {/* Lado Esquerdo - Copywriting e Autoridade */}
               <div className="demo-copy-side">
                  <h1 className="demo-title">{tDemo('title')}</h1>
                  <p className="demo-subtitle">{tDemo('subtitle')}</p>
                  
                  <div className="demo-benefits">
                     <h3 className="demo-why-title">{tDemo('whyTitle')}</h3>
                     <ul className="demo-check-list">
                        <li><CheckCircle2 className="demo-icon" size={24}/> <span>{tDemo('why1')}</span></li>
                        <li><CheckCircle2 className="demo-icon" size={24}/> <span>{tDemo('why2')}</span></li>
                        <li><CheckCircle2 className="demo-icon" size={24}/> <span>{tDemo('why3')}</span></li>
                     </ul>
                  </div>
               </div>

               {/* Lado Direito - O Glass Form */}
               <div className="demo-form-side">
                  <div className="glass-form-card">
                     <h2>{tDemo('formTitle')}</h2>
                     {/* 
                     Importante: Formspree usa a propriedade Name dos inputs para identificar a coluna no email.
                     Vou usar uma tag action universal. Depois o utilizador cadastra no Formspree o site contacto@sperosystems.pt 
                     */}
                     <form action="https://formspree.io/f/myzyvkpj" method="POST" className="demo-form">
                        
                        <div className="form-group">
                           <label htmlFor="name">{tDemo('fname')} *</label>
                           <input type="text" id="name" name="name" required className="form-input" />
                        </div>
                        
                        <div className="form-group">
                           <label htmlFor="email">{tDemo('femail')} *</label>
                           <input type="email" id="email" name="email" required className="form-input" />
                        </div>
                        
                        <div className="form-group-row">
                           <div className="form-group">
                              <label htmlFor="phone">{tDemo('fphone')} *</label>
                              <input type="tel" id="phone" name="phone" required className="form-input" />
                           </div>
                           <div className="form-group">
                              <label htmlFor="company">{tDemo('fcompany')} *</label>
                              <input type="text" id="company" name="company" required className="form-input" />
                           </div>
                        </div>

                        <div className="form-group">
                           <label htmlFor="role">{tDemo('frole')} *</label>
                           <input type="text" id="role" name="role" required className="form-input" />
                        </div>
                        
                        <div className="form-group">
                           <label htmlFor="message">{tDemo('fmessage')}</label>
                           <textarea id="message" name="message" rows={4} className="form-input"></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary submit-btn">
                           {tDemo('btn')}
                        </button>
                     </form>
                  </div>
               </div>
               
            </div>
         </div>
      </section>

      <footer className="footer">
         <div className="container footer-grid">
            <div className="footer-brand">
               <h3>SPERO Systems</h3>
               <p style={{marginTop: '0.5rem', color: '#94a3b8'}}>{tFooter('slogan')}</p>
            </div>
            <div className="footer-contact">
               <h4>{tFooter('contact')}</h4>
               <p style={{ margin: '0.2rem 0' }}>{tFooter('address')}</p>
               <p style={{ margin: '0.2rem 0' }}>{tFooter('phone')}</p>
               <p style={{ margin: '0.2rem 0' }}>{tFooter('email')}</p>
            </div>
         </div>
         <div className="footer-bottom center" style={{ textAlign: 'center', marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', color: '#64748b' }}>
            <p>&copy; {new Date().getFullYear()} SPERO Systems. {tFooter('rights')}</p>
         </div>
      </footer>
    </main>
  );
}
