import { FaExternalLinkAlt, FaFilePdf, FaChevronDown, FaDownload } from 'react-icons/fa';
import { useState } from 'react';
import { useLanguage } from './LanguageContext';

export default function Resources() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') }
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>{t('resources.title')}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        
        {/* Official Links */}
        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {t('resources.officialPortals')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <a href="https://voters.eci.gov.in/" target="_blank" rel="noreferrer" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: 500 }}>
              {t('resources.nvsp')} <FaExternalLinkAlt color="var(--primary)" />
            </a>
            <a href="https://eci.gov.in/" target="_blank" rel="noreferrer" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: 500 }}>
              {t('resources.eci')} <FaExternalLinkAlt color="var(--primary)" />
            </a>
          </div>
        </div>

        {/* Downloadable Guides */}
        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {t('resources.downloadGuides')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--card-blue-bg)', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--card-blue-text)', fontWeight: 500 }}>
                <FaFilePdf size={20} /> {t('resources.guide1')}
              </div>
              <button style={{ color: 'var(--card-blue-text)', background: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <FaDownload />
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--card-green-bg)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--card-green-text)', fontWeight: 500 }}>
                <FaFilePdf size={20} /> {t('resources.guide2')}
              </div>
              <button style={{ color: 'var(--card-green-text)', background: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <FaDownload />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Video Tutorials */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{t('resources.tutorials')}</h3>
          <a href="https://youtube.com/@ecivotereducation?si=w79RRpOeZEywDu6U" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
            <FaExternalLinkAlt size={14} /> {t('resources.visitChannel')}
          </a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src="https://www.youtube.com/embed/51tHcgBfiJ0?rel=0&modestbranding=1" 
                title={t('resources.video1')}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              ></iframe>
            </div>
            <div style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t('resources.video1')}</div>
          </div>
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src="https://www.youtube.com/embed/hP4wUVhVW-I?rel=0&modestbranding=1" 
                title={t('resources.video2')}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              ></iframe>
            </div>
            <div style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t('resources.video2')}</div>
          </div>
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <small>Videos are embedded from the Official Election Commission of India YouTube Channel. No copyright infringement intended.</small>
        </p>
      </div>

      {/* FAQs */}
      <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{t('resources.faqTitle')}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {faqs.map((faq, index) => (
          <div key={index} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <button 
              onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
              style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', textAlign: 'left', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.05rem' }}
            >
              {faq.q}
              <FaChevronDown style={{ transform: openFaq === index ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }} />
            </button>
            {openFaq === index && (
              <div style={{ padding: '0 1.5rem 1.25rem 1.5rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
