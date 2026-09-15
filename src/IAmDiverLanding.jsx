import { useState, useEffect, useRef, useCallback } from 'react';
import './main.css';

/* ────────────────────────────────────────────────────────────────────────
   DATA — swap freely, nothing below depends on external services.
   ──────────────────────────────────────────────────────────────────────── */

const PHONE_DISPLAY = '+57 311 348 2238';
const PHONE_TEL = '+573113482238';
const WHATSAPP_NUMBER = '573113482238';
const WHATSAPP_TEXT = encodeURIComponent(
  'Hola Turistas 👋 Quiero información sobre hospedaje y tours en Jardín.'
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`;
const MAPS_URL = 'https://maps.app.goo.gl/qf5y6rKn37keWuMVA';
const ADDRESS = 'Calle 11 # 5 - 73, Jardín, Antioquia, Colombia';

const NAV_LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#galeria', label: 'Galería' },
  { href: '#opiniones', label: 'Opiniones' },
  { href: '#contacto', label: 'Contacto' },
];

// PLACEHOLDER PHOTOGRAPHY — each seed renders a stable stock photo so the
// layout previews correctly. Swap every `src` for real photos of Jardín
// before shipping; the `alt` text already describes the intended subject.
const GALLERY = [
  {
    id: 'paisaje',
    src: '/images/hero/hero.png',
    alt: 'Montañas y niebla al atardecer en Jardín, Antioquia',
    caption: 'Niebla sobre la cordillera',
    tall: true,
  },
  {
    id: 'pueblo',
    src: '/images/gallery/pueblo.png',
    alt: 'Calles y balcones coloridos del pueblo de Jardín',
    caption: 'Calles y balcones del pueblo',
  },
  {
    id: 'colibri',
    src: '/images/gallery/colibri.png',
    alt: 'Colibrí en el santuario de aves de Jardín',
    caption: 'El santuario de los colibríes',
  },
  {
    id: 'hospedaje',
    src: '/images/gallery/hospedaje.png',
    alt: 'Habitación cómoda y luminosa del hospedaje',
    caption: 'Habitaciones cuidadas al detalle',
  },
  {
    id: 'cascada',
    src: "/images/gallery/cascada.png",
    alt: 'Cascada entre la vegetación cerca de Jardín',
    caption: 'Cascadas a minutos del parque',
  },
];

const SERVICES = [
  {
    icon: 'house',
    title: 'Hospedaje',
    text: 'Habitaciones limpias, cómodas y bien ubicadas, a pocos pasos del parque principal.',
  },
  {
    icon: 'compass',
    title: 'Tours y alrededores',
    text: 'Cascadas, miradores y senderos que hacen famoso a Jardín — con precios claros desde el primer momento.',
  },
  {
    icon: 'heart',
    title: 'Atención cercana',
    text: 'Te acompañamos desde que llegas hasta que te vas, como en casa.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Martí Valerio',
    tag: 'Reseña en Google',
    lang: 'ES',
    text: 'Lugar perfecto para pasar unos días en el hermoso pueblo de Jardín. Tiene todo lo necesario y el precio es muy asequible. Todo está muy limpio y la cocina es perfecta. La atención también nos pareció muy amigable, así que lo recomendamos al 100%.',
  },
  {
    name: 'Maria Jose',
    tag: 'Reseña en Google',
    lang: 'EN',
    text: 'Super good place, very close to the park where you can eat and have coffee. The owner is kind and helpful, the environment is comfortable, and it has a kitchen — everything clean and organized. I totally recommend it.',
  },
  {
    name: 'Jorge Alberto Díaz Alzate',
    tag: 'Reseña en Google',
    lang: 'ES',
    text: 'La habitación es muy confortable y organizada, y la ubicación está muy cerca del parque. Nuestra única observación es sobre el tour turístico: el precio no fue del todo claro frente a lo habitual en el pueblo. Es algo que vale la pena seguir mejorando.',
  },
];

/* ────────────────────────────────────────────────────────────────────────
   HOOKS
   ──────────────────────────────────────────────────────────────────────── */

function useScrolled(offset = 12) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [offset]);
  return scrolled;
}

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin: '0px 0px -64px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ────────────────────────────────────────────────────────────────────────
   SMALL PRIMITIVES
   ──────────────────────────────────────────────────────────────────────── */

function Reveal({ as: Tag = 'div', className = '', delay = 0, children }) {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      className={`reveal${inView ? ' reveal--visible' : ''}${className ? ` ${className}` : ''}`}
      style={inView ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

function Stars({ value = 5 }) {
  return (
    <span className="stars" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={i < value ? 'star star--on' : 'star'}>
          <path d="M10 1.6l2.47 5.24 5.72.6-4.3 3.93 1.2 5.7L10 14.9l-5.09 2.17 1.2-5.7-4.3-3.93 5.72-.6L10 1.6z" />
        </svg>
      ))}
    </span>
  );
}

/* Minimal hand-drawn line icons — no icon library required. */
const ICONS = {
  house: 'M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5M9.5 20v-6h5v6',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z|M14.5 9.5 13 13l-3.5 1.5L11 11l3.5-1.5Z',
  heart: 'M12 20.2s-7.6-4.4-7.6-10A4.4 4.4 0 0 1 12 7.1a4.4 4.4 0 0 1 7.6 3.1c0 5.6-7.6 10-7.6 10Z',
  pin: 'M12 21s7-6.1 7-11.6A7 7 0 0 0 5 9.4C5 14.9 12 21 12 21Z|M12 12.2a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z',
  phone: 'M6.6 3.5 9.2 8l-1.9 2A13 13 0 0 0 13.9 16l2-1.9 4.5 2.6-.8 3.3a2 2 0 0 1-2.2 1.5A17.3 17.3 0 0 1 3.5 6.3a2 2 0 0 1 1.5-2.2l1.6-.6Z',
  // In main.jsx — replace the existing `whatsapp` entry inside the ICONS object with this:

whatsapp:
  'M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.9 11.89L4 20l4.24-1.11a7.93 7.93 0 0 0 3.8.97h0a7.94 7.94 0 0 0 5.56-13.54ZM12.05 18.53h0a6.58 6.58 0 0 1-3.36-.92l-.24-.14-2.5.66.67-2.44-.16-.25a6.6 6.6 0 1 1 12.24-3.49 6.56 6.56 0 0 1-6.65 6.58Z|M15.16 13.3c-.19-.1-1.13-.56-1.3-.62-.17-.06-.3-.1-.43.1-.13.19-.5.62-.61.75-.11.13-.22.14-.42.05a5.4 5.4 0 0 1-1.58-.98 5.9 5.9 0 0 1-1.09-1.36c-.11-.19 0-.3.09-.4.09-.09.19-.22.29-.34.1-.12.13-.19.19-.32.06-.13.03-.24-.01-.34-.05-.1-.43-1.04-.59-1.42-.16-.38-.31-.32-.43-.33h-.37a.7.7 0 0 0-.51.24 2.15 2.15 0 0 0-.67 1.6c0 .94.68 1.85.78 1.98.1.13 1.34 2.05 3.25 2.87a11.1 11.1 0 0 0 1.08.4c.45.14.87.12 1.19.07.36-.06 1.13-.46 1.29-.9.16-.44.16-.82.11-.9-.05-.08-.17-.13-.36-.22Z',
  copy: 'M8 8h11v11H8z|M5 5h11v3h-8v8H5z',
  check: 'M4 12.5 9 17l11-11',
  close: 'M5 5l14 14M19 5 5 19',
  menu: 'M4 7h16M4 12h16M4 17h16',
  chevronLeft: 'M14.5 5 8 12l6.5 7',
  chevronRight: 'M9.5 5 16 12l-6.5 7',
  bird: 'M2 9.5c2-2 4-1.4 5.4.2C9 8 11 7.6 12.6 8.9c1.6-1.6 3.6-1.2 5 .4-2 .1-3.4 1-4.5 2.3-1.6-.7-3.3-.6-4.7.2C7.2 10.3 5 9.4 2 9.5Z',
};

function Icon({ name, className = '' }) {
  const d = ICONS[name] || '';
  const paths = d.split('|');
  const filled = name === 'heart' || name === 'pin' || name === 'whatsapp' || name === 'bird';
  return (
    <svg
      viewBox="0 0 24 24"
      className={`icon icon--${name}${className ? ` ${className}` : ''}`}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths.map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   HEADER
   ──────────────────────────────────────────────────────────────────────── */

function Header() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleNavClick = useCallback(() => setOpen(false), []);

  return (
    <header className={`site-header${scrolled ? ' site-header--solid' : ''}`}>
      <div className="site-header__bar">
        <a href="#inicio" className="wordmark" onClick={handleNavClick}>
          <span className="wordmark__t1">T</span>
          <span className="wordmark__t2">u</span>
          <span className="wordmark__t3">r</span>
          <span className="wordmark__t4">i</span>
          <span className="wordmark__t5">s</span>
          <span className="wordmark__t1">t</span>
          <span className="wordmark__t2">a</span>
          <span className="wordmark__t3">s</span>
          <span className="wordmark__sub">Jardín · Antioquia</span>
        </a>

        <nav className="site-nav" aria-label="Navegación principal">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <a className="btn btn--ghost" href={`tel:${PHONE_TEL}`}>
            <Icon name="phone" /> Llamar
          </a>
          <a className="btn btn--primary" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            <Icon name="whatsapp" /> WhatsApp
          </a>
        </div>

        <button
          className="menu-toggle"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </div>

      <div className={`mobile-nav${open ? ' mobile-nav--open' : ''}`}>
        <nav aria-label="Navegación móvil">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={handleNavClick}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="btn btn--primary btn--block" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
          <Icon name="whatsapp" /> Escríbenos por WhatsApp
        </a>
      </div>
    </header>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   HERO
   ──────────────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero__media" aria-hidden="true">
        <img src={GALLERY[0].src} alt="" />
        <div className="hero__sun" />
        <Icon name="bird" className="hero__bird hero__bird--1" />
        <Icon name="bird" className="hero__bird hero__bird--2" />
        <Icon name="bird" className="hero__bird hero__bird--3" />
        <div className="hero__scrim" />
      </div>

      <div className="hero__content">
        <p className="eyebrow eyebrow--light">Jardín · Antioquia · Colombia</p>
        <h1 className="hero__title">
          Tu refugio entre montañas,
          <br />
          en el pueblo más colorido de Colombia.
        </h1>
        <p className="hero__subtitle">
          Hospedaje cómodo y tours locales en Jardín, pensados para que solo te preocupes
          por disfrutar.
        </p>
        <div className="hero__actions">
          <a className="btn btn--primary btn--lg" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            <Icon name="whatsapp" /> Escríbenos por WhatsApp
          </a>
          <a className="btn btn--outline btn--lg" href="#galeria">
            Ver la galería
          </a>
        </div>
      </div>

      <a className="scroll-cue" href="#nosotros" aria-label="Ir a la siguiente sección">
        <span />
      </a>
    </section>
  );
}



/* ────────────────────────────────────────────────────────────────────────
   TRUST STRIP
   ──────────────────────────────────────────────────────────────────────── */

function TrustStrip() {
  return (
    <section className="trust-strip">
      <Reveal className="trust-strip__inner">
        <a
          className="trust-rating"
          href={MAPS_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Ver reseñas en Google Maps"
        >
          <span className="trust-rating__score">4.8</span>
          <span className="trust-rating__meta">
            <Stars value={5} />
            <span>10 reseñas en Google</span>
          </span>
        </a>

        <div className="trust-strip__divider" aria-hidden="true" />

        <div className="trust-badges">
          <span className="badge">RNT 86908</span>
          <span className="badge">RNT 87117</span>
        </div>

        <div className="trust-strip__divider" aria-hidden="true" />

        <span className="trust-strip__address">
          <Icon name="pin" /> {ADDRESS}
        </span>
      </Reveal>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   ABOUT
   ──────────────────────────────────────────────────────────────────────── */

function About() {
  return (
    <section id="nosotros" className="about">
      <div className="about__grid">
        <Reveal className="about__text">
          <p className="eyebrow">Sobre Turistas</p>
          <h2>Hospitalidad de pueblo, organización de agencia.</h2>
          <p>
            Turistas es una agencia de turismo y hospedaje en el corazón de Jardín, Antioquia.
            Ayudamos a quienes nos visitan a encontrar un lugar cómodo y limpio para quedarse,
            y los conectamos con los mejores rincones del pueblo y sus alrededores — con
            precios claros, antes de reservar.
          </p>
          <ul className="about__list">
            <li>
              <Icon name="check" /> A pocos minutos del parque principal
            </li>
            <li>
              <Icon name="check" /> Habitaciones limpias y bien equipadas
            </li>
            <li>
              <Icon name="check" /> Tours con precios definidos de antemano
            </li>
          </ul>
        </Reveal>

        <Reveal className="about__media" delay={120}>
          <img src={GALLERY[3].src} alt={GALLERY[3].alt} loading="lazy" />
        </Reveal>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   GALLERY + LIGHTBOX
   ──────────────────────────────────────────────────────────────────────── */

function Lightbox({ index, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext]);

  const item = GALLERY[index];

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.caption}>
      <button className="lightbox__backdrop" onClick={onClose} aria-label="Cerrar" />
      <div className="lightbox__body">
        <img src={item.src} alt={item.alt} />
        <p className="lightbox__caption">{item.caption}</p>
        <button className="lightbox__close" onClick={onClose} aria-label="Cerrar">
          <Icon name="close" />
        </button>
        <button className="lightbox__nav lightbox__nav--prev" onClick={onPrev} aria-label="Anterior">
          <Icon name="chevronLeft" />
        </button>
        <button className="lightbox__nav lightbox__nav--next" onClick={onNext} aria-label="Siguiente">
          <Icon name="chevronRight" />
        </button>
      </div>
    </div>
  );
}

function Gallery() {
  const [active, setActive] = useState(null);

  const prev = useCallback(
    () => setActive((i) => (i === null ? null : (i + GALLERY.length - 1) % GALLERY.length)),
    []
  );
  const next = useCallback(() => setActive((i) => (i === null ? null : (i + 1) % GALLERY.length)), []);

  return (
    <section id="galeria" className="gallery">
      <Reveal className="section-head">
        <p className="eyebrow">Galería</p>
        <h2>Así se ve Jardín</h2>
      </Reveal>

      <div className="gallery__grid">
        {GALLERY.map((item, i) => (
          <Reveal
            key={item.id}
            as="button"
            delay={i * 60}
            className={`gallery__tile${item.tall ? ' gallery__tile--wide' : ''}`}
          >
            <span className="gallery__btn" onClick={() => setActive(i)}>
              <img src={item.src} alt={item.alt} loading="lazy" />
              <span className="gallery__caption">{item.caption}</span>
            </span>
          </Reveal>
        ))}
      </div>

      {active !== null && (
        <Lightbox index={active} onClose={() => setActive(null)} onPrev={prev} onNext={next} />
      )}
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   SERVICES
   ──────────────────────────────────────────────────────────────────────── */

function Services() {
  return (
    <section className="services">
      <div className="services__grid">
        {SERVICES.map((s, i) => (
          <Reveal key={s.title} className="service-card" delay={i * 80}>
            <span className="service-card__icon">
              <Icon name={s.icon} />
            </span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   TESTIMONIALS
   ──────────────────────────────────────────────────────────────────────── */

function Testimonials() {
  return (
    <section id="opiniones" className="testimonials">
      <Reveal className="section-head section-head--center">
        <p className="eyebrow">Opiniones</p>
        <h2>Lo que dicen quienes nos visitan</h2>
        <a className="testimonials__aggregate" href={MAPS_URL} target="_blank" rel="noreferrer">
          <Stars value={5} />
          <span>4.8 sobre 10 reseñas en Google</span>
        </a>
      </Reveal>

      <div className="testimonials__grid">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} className="testimonial-card" delay={i * 90}>
            <p className="testimonial-card__text">“{t.text}”</p>
            <div className="testimonial-card__footer">
              <span className="testimonial-card__name">{t.name}</span>
              <span className="testimonial-card__tag">
                {t.tag} · {t.lang}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   CONTACT
   ──────────────────────────────────────────────────────────────────────── */

function Contact() {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ADDRESS);
      setCopied(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      /* Clipboard API unavailable — silently ignore. */
    }
  };

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return (
    <section id="contacto" className="contact">
      <div className="contact__grid">
        <Reveal className="contact__card">
          <p className="eyebrow">Contacto</p>
          <h2>Planeemos tu visita</h2>
          <p className="contact__lead">
            Escríbenos y te ayudamos a organizar el hospedaje y los tours para tu estadía en
            Jardín.
          </p>

          <dl className="contact__details">
            <div>
              <dt>
                <Icon name="pin" /> Dirección
              </dt>
              <dd>
                {ADDRESS}
                <button className="link-btn" onClick={handleCopy}>
                  {copied ? 'Copiado ✓' : 'Copiar'}
                </button>
              </dd>
            </div>
            <div>
              <dt>
                <Icon name="phone" /> Teléfono
              </dt>
              <dd>
                <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
              </dd>
            </div>
          </dl>

          <div className="contact__actions">
            <a className="btn btn--primary btn--lg" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              <Icon name="whatsapp" /> Escríbenos por WhatsApp
            </a>
            <a className="btn btn--outline btn--lg" href={MAPS_URL} target="_blank" rel="noreferrer">
              <Icon name="pin" /> Ver en Google Maps
            </a>
          </div>
        </Reveal>

        <Reveal className="contact__media" delay={120}>
          <img src={GALLERY[4].src} alt={GALLERY[4].alt} loading="lazy" />
        </Reveal>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   FOOTER
   ──────────────────────────────────────────────────────────────────────── */

function WhatsAppWidget() {
  return (
    <a
      className="wa-widget"
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Escríbenos por WhatsApp"
    >
      <Icon name="whatsapp" />
      <span className="wa-widget__ping" aria-hidden="true" />
    </a>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div>
          <span className="wordmark wordmark--footer">
            <span className="wordmark__t1">T</span>
            <span className="wordmark__t2">u</span>
            <span className="wordmark__t3">r</span>
            <span className="wordmark__t4">i</span>
            <span className="wordmark__t5">s</span>
            <span className="wordmark__t1">t</span>
            <span className="wordmark__t2">a</span>
            <span className="wordmark__t3">s</span>
          </span>
          <p className="site-footer__tagline">
            Agencia de turismo y hospedaje en Jardín, Antioquia.
          </p>
        </div>

        <nav aria-label="Enlaces del pie de página">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="site-footer__contact">
          <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
          <span>{ADDRESS}</span>
          <div className="trust-badges">
            <span className="badge badge--dark">RNT 86908</span>
            <span className="badge badge--dark">RNT 87117</span>
          </div>
        </div>
      </div>

      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} Turistas — Jardín, Antioquia, Colombia</span>
        <span>Hecho para quienes eligen conocer Jardín despacio.</span>
      </div>
    </footer>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   APP
   ──────────────────────────────────────────────────────────────────────── */

export default function IAmDiverLanding() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <TrustStrip />
        <About />
        <Gallery />
        <Services />
        <Testimonials />
        <Contact />
        <WhatsAppWidget />
      </main>
      <Footer />
    </div>
  );
}