import { ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../components/Logo';

const legalContent = {
  '/privacy': {
    eyebrow: 'Privacy notice',
    title: 'Your privacy matters.',
    updated: 'September 11, 2026',
    intro: 'This notice explains how Arden Clinic’s website and patient portal collect, use, and protect your information.',
    sections: [
      ['Information we collect', 'We collect information you provide when creating an account, requesting an appointment, updating your profile, or contacting the clinic. This may include your name, contact details, date of birth, appointment preferences, and account activity.'],
      ['How information is used', 'We use your information to provide requested services, coordinate appointments, maintain your account, communicate care-related updates, improve the portal, and meet applicable legal obligations. We do not sell personal information.'],
      ['How information is protected', 'Production accounts use encrypted connections, managed authentication, database access controls, and row-level security. Access is limited to the patient and appropriately authorized clinic personnel.'],
      ['Your choices', 'You may update most account details in the patient portal and change communication preferences at any time. Contact our privacy team to request access, correction, or deletion where applicable.'],
    ],
  },
  '/terms': {
    eyebrow: 'Terms of use',
    title: 'Clear terms, plainly stated.',
    updated: 'September 11, 2026',
    intro: 'These terms govern access to the Arden Clinic website and patient portal.',
    sections: [
      ['Using the portal', 'You agree to provide accurate information, protect your sign-in credentials, and notify us if you suspect unauthorized access. The portal is intended for your own non-commercial healthcare coordination.'],
      ['Not for emergencies', 'Online booking and portal messages are not monitored as emergency services. For a medical emergency, call 911 or go to the nearest emergency department.'],
      ['Medical information', 'Website content is general information and does not replace individualized medical advice, diagnosis, or treatment from a qualified clinician.'],
      ['Availability and changes', 'We work to keep the service reliable, but may update, suspend, or change features when needed for security, maintenance, legal, or clinical reasons.'],
    ],
  },
  '/accessibility': {
    eyebrow: 'Accessibility',
    title: 'Care should be accessible.',
    updated: 'September 11, 2026',
    intro: 'Arden Clinic is committed to a website and patient experience that works for as many people as possible.',
    sections: [
      ['Our approach', 'We aim to follow current accessibility practices, including keyboard navigation, visible focus states, semantic structure, text alternatives, readable contrast, and responsive layouts.'],
      ['Ongoing improvement', 'Accessibility is an ongoing effort. We regularly review our digital experience and prioritize fixes that remove barriers to care.'],
      ['Need assistance?', 'If you have trouble using this website or need information in another format, call (555) 014-2800 or email accessibility@ardenclinic.com.'],
    ],
  },
} as const;

export function LegalPage() {
  const { pathname } = useLocation();
  const page = legalContent[pathname as keyof typeof legalContent] ?? legalContent['/privacy'];

  return (
    <main className="legal-page">
      <header className="legal-header"><div className="shell"><Logo /><Link to="/"><ArrowLeft size={16} /> Back to clinic</Link></div></header>
      <article className="shell legal-content">
        <span className="eyebrow">{page.eyebrow}</span>
        <h1>{page.title}</h1>
        <p className="legal-content__updated">Last updated {page.updated}</p>
        <p className="legal-content__intro">{page.intro}</p>
        <div className="legal-sections">
          {page.sections.map(([title, copy]) => <section key={title}><h2>{title}</h2><p>{copy}</p></section>)}
        </div>
        <aside><strong>Questions?</strong><p>Contact <a href="mailto:privacy@ardenclinic.com">privacy@ardenclinic.com</a> or call <a href="tel:+15550142800">(555) 014-2800</a>.</p></aside>
      </article>
    </main>
  );
}
