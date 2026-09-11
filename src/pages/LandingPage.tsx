import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Baby,
  CalendarCheck,
  Clock3,
  FlaskConical,
  HeartPulse,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Video,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';

const services = [
  {
    icon: Stethoscope,
    number: '01',
    title: 'Primary care',
    text: 'Everyday care, preventive screenings, and a clinician who knows your health story.',
    color: 'sage',
  },
  {
    icon: HeartPulse,
    number: '02',
    title: 'Women’s health',
    text: 'Thoughtful, evidence-led support through every stage of life and wellbeing.',
    color: 'peach',
  },
  {
    icon: Baby,
    number: '03',
    title: 'Pediatric care',
    text: 'Warm, family-centered care from the newborn days through the teen years.',
    color: 'blue',
  },
  {
    icon: FlaskConical,
    number: '04',
    title: 'Lab & diagnostics',
    text: 'Convenient on-site testing with clear results and a plan you can understand.',
    color: 'sand',
  },
];

const clinicians = [
  { initials: 'MC', name: 'Dr. Maya Chen', role: 'Family Medicine', detail: 'MD · 12 years experience', color: 'green' },
  { initials: 'JW', name: 'Dr. James Wilson', role: 'Internal Medicine', detail: 'MD, FACP · 15 years experience', color: 'clay' },
  { initials: 'ER', name: 'Dr. Elena Ruiz', role: 'Pediatrics', detail: 'MD, FAAP · 10 years experience', color: 'blue' },
];

export function LandingPage() {
  const heroImage = `${import.meta.env.BASE_URL}clinic-consultation.jpg`;

  return (
    <div className="marketing-page">
      <SiteHeader />

      <main>
        <section className="hero-section">
          <div className="hero-orb hero-orb--one" />
          <div className="hero-orb hero-orb--two" />
          <div className="shell hero-grid">
            <div className="hero-copy">
              <div className="availability-badge"><i /> Accepting new patients <span>September availability</span></div>
              <h1>Medicine, made<br /><em>personal.</em></h1>
              <p className="hero-copy__lead">Unhurried appointments. Familiar faces. Modern care built around the way you actually live.</p>
              <div className="hero-copy__actions">
                <Link className="button button--primary button--large" to="/signup?intent=book">Book your first visit <ArrowRight size={18} /></Link>
                <a className="text-link" href="tel:+15550142800"><span>Or call</span> (555) 014-2800</a>
              </div>
              <div className="hero-proof">
                <div className="avatar-stack" aria-hidden="true"><i>AK</i><i>LM</i><i>RS</i></div>
                <div><span className="stars">★★★★★</span><p><strong>4.9</strong> from 600+ local patients</p></div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-visual__frame">
                <img src={heroImage} alt="A clinician speaking with a patient in Arden Clinic" />
                <div className="hero-visual__wash" />
              </div>
              <div className="hero-appointment-card">
                <div className="mini-calendar"><span>SEP</span><strong>18</strong></div>
                <div><span>Next available</span><strong>Today at 2:30 pm</strong><small>In-person · Brookfield</small></div>
                <CalendarCheck size={21} />
              </div>
              <div className="hero-care-card"><span><ShieldCheck size={17} /></span><div><strong>Whole-person care</strong><small>Longer, 30–45 min visits</small></div></div>
              <div className="hero-dots" aria-hidden="true" />
            </div>
          </div>
          <div className="shell insurance-strip">
            <p>In-network with most major plans</p>
            <div><strong>BlueCross</strong><strong>AETNA</strong><strong>Cigna</strong><strong>UnitedHealthcare</strong><span>+ more</span></div>
          </div>
        </section>

        <section className="services-section section" id="services">
          <div className="shell">
            <div className="section-heading section-heading--split">
              <div><span className="eyebrow">How we care</span><h2>One clinic.<br /><em>Care for your whole life.</em></h2></div>
              <div><p>From routine checkups to the moments that need more attention, our team brings your care together in one calm, connected place.</p><Link to="/signup?intent=book">Explore patient care <ArrowUpRight size={17} /></Link></div>
            </div>
            <div className="service-grid">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <article className={`service-card service-card--${service.color}`} key={service.title}>
                    <div className="service-card__top"><span><Icon size={22} /></span><small>{service.number}</small></div>
                    <h3>{service.title}</h3>
                    <p>{service.text}</p>
                    <Link to="/signup?intent=book" aria-label={`Book ${service.title}`}><ArrowUpRight size={18} /></Link>
                  </article>
                );
              })}
            </div>
            <div className="same-day-banner">
              <div className="same-day-banner__icon"><Activity size={23} /></div>
              <div><strong>Not feeling well today?</strong><span>Same-day and next-day sick visits are reserved every weekday.</span></div>
              <Link to="/signup?intent=book">See availability <ArrowRight size={17} /></Link>
            </div>
          </div>
        </section>

        <section className="difference-section section" id="about">
          <div className="shell difference-grid">
            <div className="difference-visual">
              <div className="difference-visual__main">
                <div className="room-illustration" aria-hidden="true">
                  <div className="room-window"><i /><i /><i /></div>
                  <div className="room-art"><i /><i /></div>
                  <div className="room-chair"><i /></div>
                  <div className="room-plant"><i /><i /><i /><b /></div>
                  <div className="room-table" />
                </div>
              </div>
              <div className="difference-stat"><strong>96<sup>%</sup></strong><span>of patients feel heard<br />during their visit</span></div>
              <div className="difference-caption"><Clock3 size={17} /> Appointments that start on time</div>
            </div>
            <div className="difference-copy">
              <span className="eyebrow">The Arden difference</span>
              <h2>Care should feel<br /><em>like someone cares.</em></h2>
              <p>We designed Arden around a simple idea: better care begins with better listening. That means time to talk, easy access to your team, and no mystery around what comes next.</p>
              <ul>
                <li><span><Clock3 size={18} /></span><div><strong>Time that belongs to you</strong><p>Visits are 30–45 minutes, so you never feel rushed out the door.</p></div></li>
                <li><span><MessageCircle size={18} /></span><div><strong>Your team stays in touch</strong><p>Questions after a visit? Send a secure message and hear back promptly.</p></div></li>
                <li><span><Sparkles size={18} /></span><div><strong>A calmer kind of clinic</strong><p>A warm, considered space designed to make care feel less clinical.</p></div></li>
              </ul>
              <Link className="button button--outline" to="/signup">Become a patient <ArrowRight size={17} /></Link>
            </div>
          </div>
        </section>

        <section className="team-section section" id="team">
          <div className="shell">
            <div className="section-heading section-heading--center">
              <span className="eyebrow">Meet your care team</span>
              <h2>Expertise, with a <em>human side.</em></h2>
              <p>Experienced clinicians who remember your name—and the things that matter to you.</p>
            </div>
            <div className="clinician-grid">
              {clinicians.map((clinician, index) => (
                <article className="clinician-card" key={clinician.name}>
                  <div className={`clinician-portrait clinician-portrait--${clinician.color}`}>
                    <div className="portrait-pattern" /><span>{clinician.initials}</span>
                    {index === 0 && <small><i /> Accepting patients</small>}
                  </div>
                  <div className="clinician-card__copy"><span>{clinician.role}</span><h3>{clinician.name}</h3><p>{clinician.detail}</p></div>
                  <Link to="/signup?intent=book" aria-label={`Book with ${clinician.name}`}><ArrowUpRight size={18} /></Link>
                </article>
              ))}
            </div>
            <div className="team-values">
              <div><strong>Board-certified</strong><span>Experienced, trusted clinicians</span></div>
              <i />
              <div><strong>Evidence-led</strong><span>Care grounded in best practice</span></div>
              <i />
              <div><strong>People-first</strong><span>Every decision begins with you</span></div>
            </div>
          </div>
        </section>

        <section className="testimonial-section section">
          <div className="shell testimonial-card">
            <div className="testimonial-mark">“</div>
            <blockquote>
              I’ve never had a doctor take that much time to understand the full picture. I left with a clear plan—and for the first time in a long time, I felt genuinely looked after.
            </blockquote>
            <div className="testimonial-person"><span>NP</span><div><strong>Nina P.</strong><small>Arden patient since 2023</small></div></div>
            <div className="testimonial-aside">
              <span className="stars">★★★★★</span>
              <strong>Care patients recommend</strong>
              <p>4.9 average from 600+ verified reviews</p>
            </div>
          </div>
        </section>

        <section className="access-section section">
          <div className="shell">
            <div className="section-heading section-heading--center">
              <span className="eyebrow">Care that meets you there</span>
              <h2>Simple to access.<br /><em>Easy to keep up with.</em></h2>
            </div>
            <div className="access-grid">
              <article><span><CalendarCheck size={24} /></span><h3>Book online, anytime</h3><p>Choose your visit, clinician, and time in just a few minutes.</p><Link to="/signup?intent=book">Find an appointment <ArrowRight size={16} /></Link></article>
              <article><span><Video size={24} /></span><h3>Virtual visits</h3><p>Connect with your care team from home when an in-person visit isn’t needed.</p><Link to="/signup">Learn about virtual care <ArrowRight size={16} /></Link></article>
              <article><span><MessageCircle size={24} /></span><h3>Care between visits</h3><p>Use your patient portal for follow-ups, records, and appointment updates.</p><Link to="/login">Open patient portal <ArrowRight size={16} /></Link></article>
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div className="final-cta__pattern" />
          <div className="shell final-cta__inner">
            <div><span className="eyebrow eyebrow--light">Now accepting new patients</span><h2>Feel better about<br /><em>going to the doctor.</em></h2></div>
            <div><p>Start with a visit that gives you the time, answers, and support you deserve.</p><Link className="button button--cream button--large" to="/signup?intent=book">Book your first visit <ArrowRight size={18} /></Link><small>Most major insurance plans accepted</small></div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
