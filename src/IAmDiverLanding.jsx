import { useState, useEffect, useRef, useMemo } from "react";
import {
  Menu,
  X,
  Phone,
  MapPin,
  Check,
  Star,
  Clock,
  Globe,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  MessageCircle,
  ExternalLink,
  CreditCard,
  CalendarCheck,
  ThumbsUp,
} from "lucide-react";
import { DICT, TESTIMONIALS } from "./constants";

const PHONE_E164 = "573108649516";
const PHONE_DISPLAY = "+57 310 864 9516";
const WHATSAPP_BASE = `https://wa.me/${PHONE_E164}`;
const waLink = (msg) => `${WHATSAPP_BASE}?text=${encodeURIComponent(msg)}`;
const REVIEWS_LINK = "https://share.google/OJ2SkCewNrHLy2fxU";
const REVIEWS_COUNT = "+300"; // client-reported count, not scraped

const SERVICE_IMAGES = {
  "discover-scuba": "/images/services/discover-scuba.png",
  "discover-snorkel": "/images/services/discover-snorkel.png",
  "open-water": "/images/services/open-water.png",
  advanced: "/images/services/advanced.png",
  "fun-dive": "/images/services/fun-dive.png",
  efr: "/images/services/efr.png",
  rescue: "/images/services/rescue.png",
  divemaster: "/images/services/divemaster.png",
};

const formatCOP = (n) => `${new Intl.NumberFormat("es-CO").format(n)} COP`;

/* ---------------------------------------------------------------
   i18n -- Spanish / English / German
   Every course carries a stable `id` (shared across languages) so
   the cart survives a language switch.
--------------------------------------------------------------- */

const LANGS = [
  { code: "es", label: "ESPAÑOL" },
  { code: "en", label: "ENGLISH" },
  { code: "de", label: "DEUTSCH" },
];

function useRevealOnScroll() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
  style = {},
}) {
  const [ref, visible] = useRevealOnScroll();
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
      style={{ ...style, transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}

function BrandMark({ size = 40 }) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      role="img"
      aria-label="I Am Diver logo"
    >
      <circle
        cx="100"
        cy="100"
        r="96"
        fill="#222831"
        stroke="#EEEEEE"
        strokeWidth="4"
      />
      <text
        x="52"
        y="72"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontStyle="italic"
        fontSize="26"
        fill="#EEEEEE"
      >
        I am
      </text>
      <text
        x="42"
        y="128"
        fontFamily="'Big Shoulders Display', Arial, sans-serif"
        fontWeight="800"
        fontSize="46"
        fill="#EEEEEE"
        letterSpacing="-1"
      >
        D
      </text>
      <text
        x="118"
        y="128"
        fontFamily="'Big Shoulders Display', Arial, sans-serif"
        fontWeight="800"
        fontSize="46"
        fill="#EEEEEE"
        letterSpacing="-1"
      >
        VER
      </text>
      <g transform="translate(93,84)">
        <circle cx="8" cy="0" r="6" fill="#00ADB5" />
        <path
          d="M8 7 C-2 14 -4 28 2 40 C5 46 10 50 8 58"
          stroke="#00ADB5"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M4 16 C-6 14 -12 8 -13 0"
          stroke="#00ADB5"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M12 16 C20 20 22 30 19 38"
          stroke="#00ADB5"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </g>
      <text
        x="100"
        y="158"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="600"
        fontSize="11"
        letterSpacing="1.5"
        fill="#EEEEEE"
      >
        CENTRO DE BUCEO
      </text>
      <text
        x="100"
        y="172"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="600"
        fontSize="11"
        letterSpacing="1.5"
        fill="#00ADB5"
      >
        TAGANGA
      </text>
    </svg>
  );
}

export default function IAmDiverLanding() {
  const [lang, setLang] = useState("es");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [openCourse, setOpenCourse] = useState(2);
  const [scrolled, setScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [cart, setCart] = useState({}); // { [courseId]: qty }
  const [cartOpen, setCartOpen] = useState(false);
  const [waWidgetOpen, setWaWidgetOpen] = useState(false);
  const t = DICT[lang];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cartCount = useMemo(
    () => Object.values(cart).reduce((a, b) => a + b, 0),
    [cart],
  );

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => ({
          ...t.courses.list.find((c) => c.id === id),
          qty,
        }))
        .filter((c) => c.id),
    [cart, t],
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, c) => sum + c.priceCOP * c.qty, 0),
    [cartItems],
  );

  const addToCart = (id) =>
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const decCart = (id) =>
    setCart((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) - 1) }));
  const removeFromCart = (id) =>
    setCart((prev) => {
      const n = { ...prev };
      delete n[id];
      return n;
    });

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const startCheckout = () => {
    if (cartItems.length === 0) return;
    setCartOpen(false);
    setCheckoutOpen(true);
    setPaymentSuccess(false);
  };

  const simulatePayment = () => {
    // SIMULACIÓN TEMPORAL DEL GATEWAY.
    // Cuando conectes Wompi/ePayco/Stripe, reemplaza esta función.
    setPaymentSuccess(true);
  };

  const closeCheckout = () => {
    setCheckoutOpen(false);
    setPaymentSuccess(false);
  };

  const handleCtaClick = () => {
    if (cartItems.length > 0) {
      startCheckout();
    } else {
      document
        .getElementById("courses")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="iad-root" lang={lang}>
      {/* ---------------- NAV ---------------- */}
      <header className={`iad-nav ${scrolled || menuOpen ? "scrolled" : ""}`}>
        <div className="iad-nav-inner">
          <a href="#top" className="iad-logo">
            <BrandMark size={38} />I Am Diver
          </a>
          <nav className="iad-nav-links">
            <a href="#courses">{t.nav.courses}</a>
            <a href="#about">{t.nav.about}</a>
            <a href="#why">{t.nav.why}</a>
            <a href="#reviews">{t.nav.reviews}</a>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="lang-switch">
              <button
                className="lang-btn"
                onClick={() => setLangMenuOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={langMenuOpen}
              >
                <Globe size={14} />
                {lang.toUpperCase()}
              </button>
              {langMenuOpen && (
                <div className="lang-menu">
                  {LANGS.map((l) => (
                    <button
                      key={l.code}
                      className={lang === l.code ? "active" : ""}
                      onClick={() => {
                        setLang(l.code);
                        setLangMenuOpen(false);
                      }}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              className="iad-cart-btn"
              onClick={() => setCartOpen(true)}
              aria-label={`${t.cart.viewCart} (${cartCount})`}
            >
              <ShoppingBag size={17} />
              {cartCount > 0 && (
                <span className="iad-cart-badge">{cartCount}</span>
              )}
            </button>
            <button
              className="iad-nav-cta iad-nav-cta-desktop"
              onClick={handleCtaClick}
            >
              {t.hero.ctaPrimary}
            </button>
            <button
              className="iad-menu-btn"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="iad-mobile-menu">
            <a href="#courses" onClick={() => setMenuOpen(false)}>
              {t.nav.courses}
            </a>
            <a href="#about" onClick={() => setMenuOpen(false)}>
              {t.nav.about}
            </a>
            <a href="#why" onClick={() => setMenuOpen(false)}>
              {t.nav.why}
            </a>
            <a href="#reviews" onClick={() => setMenuOpen(false)}>
              {t.nav.reviews}
            </a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>
              {t.nav.faq}
            </a>
            <button
              className="iad-mobile-menu-cta"
              onClick={() => {
                setMenuOpen(false);
                handleCtaClick();
              }}
            >
              {t.hero.ctaPrimary}
            </button>
          </div>
        )}
      </header>

      {/* ---------------- HERO ---------------- */}
      <section id="top" className="iad-hero">
        <div className="iad-container iad-hero-grid">
          <div>
            <span className="iad-eyebrow">
              <span className="dot" />
              {t.hero.eyebrow}
            </span>
            <h1 className="iad-h1">{t.hero.h1}</h1>
            <p className="iad-hero-sub">{t.hero.sub}</p>
            <div className="iad-cta-row">
              <button
                className="btn-primary"
                onClick={() => {
                  document
                    .getElementById("courses")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <CalendarCheck size={17} />
                {t.hero.ctaPrimary}
              </button>
              <a className="btn-secondary" href="#courses">
                {t.hero.ctaSecondary}
              </a>
            </div>
            <div className="iad-trust-bar">
              <div className="iad-trust-item">
                <Check size={16} />
                {t.hero.trust1}
              </div>
              <div className="iad-trust-item">
                <Check size={16} />
                {t.hero.trust2}
              </div>
              <div className="iad-trust-item">
                <Check size={16} />
                {t.hero.trust3}
              </div>
            </div>
          </div>
          <Reveal className="hero-photo-wrap" delay={80}>
            <img
              src="/images/hero/hero.jpg"
              alt="Scuba diver over a Caribbean coral reef"
              loading="lazy"
            />
          </Reveal>
        </div>
      </section>

      {/* ---------------- TRUST STRIP ---------------- */}
      <div className="trust-strip">
        <div className="trust-strip-inner">
          <div className="trust-item">
            <div className="trust-badge">PADI</div>
            <div className="trust-text">
              <span className="num">{t.trust.padi}</span>
            </div>
          </div>
          <a
            className="trust-item"
            href={REVIEWS_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="trust-badge">
              <Star size={16} fill="currentColor" strokeWidth={0} />
            </div>
            <div className="trust-text">
              <span className="num">{t.trust.rating}</span>
              <span className="lbl">{t.trust.ratingLbl}</span>
            </div>
          </a>
          <div className="trust-item">
            <div className="trust-badge">
              <ThumbsUp size={16} fill="currentColor" strokeWidth={0} />
            </div>
            <div className="trust-text">
              <span className="num">{t.trust.instructor}</span>
              <span className="lbl">{t.trust.instructorLbl}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- WHY ---------------- */}
      <section id="why">
        <div className="iad-container">
          <Reveal>
            <p className="iad-kicker">{t.why.kicker}</p>
            <h2 className="iad-h2">{t.why.h2}</h2>
            <p className="iad-h2-sub">{t.why.sub}</p>
          </Reveal>

          <div className="why-layout">
            {/* IMAGE */}
            <Reveal className="why-image-wrap">
              <div className="why-image">
                <img
                  src="/images/why/why.jpg"
                  alt="Diver underwater in Taganga"
                />
              </div>
            </Reveal>

            {/* REASONS */}
            <div className="gauge-scale">
              {t.why.cards.map((c, i) => (
                <Reveal key={c.title} delay={i * 60} className="gauge-row">
                  <div className="gauge-tick">
                    <span className="gauge-tick-mark" />
                    <span className="gauge-tick-num iad-mono">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div>
                    <h3>{c.title}</h3>
                    <p>{c.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={100}>
            <p className="iad-kicker" style={{ marginTop: 44 }}>
              {t.why.marineKicker}
            </p>

            <div className="iad-chip-row">
              {t.why.marine.map((m) => (
                <span key={m} className="iad-chip">
                  {m}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- COURSES ---------------- */}
      <section id="courses" className="iad-courses-bg">
        <div className="iad-container">
          <Reveal>
            <p className="iad-kicker">{t.courses.kicker}</p>
            <h2 className="iad-h2">{t.courses.h2}</h2>
            <p className="iad-h2-sub">{t.courses.sub}</p>
          </Reveal>
          <div className="manifest-list">
            {t.courses.list.map((c, i) => {
              const inCart = (cart[c.id] || 0) > 0;
              return (
                <Reveal
                  key={c.id}
                  delay={i * 30}
                  as="div"
                  className={`manifest-row ${openCourse === i ? "open" : ""}`}
                >
                  <button
                    className="manifest-head"
                    onClick={() => setOpenCourse(openCourse === i ? -1 : i)}
                    aria-expanded={openCourse === i}
                  >
                    <span className="manifest-idx">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="manifest-name-wrap">
                      <h3 className="manifest-name">{c.name}</h3>
                      <span className="manifest-tag">{c.tag}</span>
                    </span>
                    <span className="manifest-duration">
                      <Clock size={13} />
                      {c.duration}
                    </span>
                    <span className="manifest-price">
                      {formatCOP(c.priceCOP)}
                    </span>
                  </button>
                  <div className="manifest-body-content">
                    <div className="service-detail-grid">
                      <div className="service-image-wrap">
                        <img
                          src={SERVICE_IMAGES[c.id]}
                          alt={c.name}
                          className="service-image"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentElement.classList.add(
                              "placeholder",
                            );
                          }}
                        />
                        <div className="service-image-placeholder">
                          <span>IMAGE</span>
                          <small>{c.name}</small>
                        </div>
                      </div>

                      <div>
                        <p className="manifest-blurb">{c.blurb}</p>

                        <ul className="manifest-bullets">
                          {c.bullets.map((b) => (
                            <li key={b}>
                              <Check size={14} />
                              {b}
                            </li>
                          ))}
                        </ul>

                        <div className="service-action-row">
  <button
    className={`manifest-add ${inCart ? "added" : ""}`}
    onClick={() => addToCart(c.id)}
  >
    <ShoppingBag size={15} />
    {inCart
      ? `${t.courses.addedBtn} (${cart[c.id]})`
      : t.courses.addBtn}
  </button>

  {inCart && (
    <button
      className="btn-primary btn-pay-now"
      onClick={() => {
        setCheckoutOpen(true);
        setPaymentSuccess(false);
      }}
    >
      <CreditCard size={15} />
      {t.courses.payNow}
    </button>
  )}
</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <p className="iad-price-note">{t.courses.priceNote}</p>
        </div>
      </section>

      {/* ---------------- REVIEWS ---------------- */}
      <section id="reviews">
        <div className="iad-container">
          <Reveal style={{ textAlign: "center" }}>
            <p className="iad-kicker" style={{ textAlign: "center" }}>
              {t.reviews.kicker}
            </p>
            <h2
              className="iad-h2"
              style={{
                maxWidth: "none",
                textAlign: "center",
                margin: "0 auto 14px",
              }}
            >
              {t.reviews.h2}
            </h2>
          </Reveal>
          <div className="testimonial-grid">
            {TESTIMONIALS.map((review, i) => (
              <Reveal
                key={review.name}
                className="testimonial-card"
                delay={i * 40}
              >
                <div className="testimonial-stars">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      size={15}
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  ))}
                </div>

                <p className="testimonial-text">“{review.text}”</p>

                <div className="testimonial-author">
                  <div className="testimonial-avatar">
                    {review.photo ? (
                      <img src={review.photo} alt={review.name} />
                    ) : (
                      <span className="testimonial-avatar-initial">
                        {review.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div>
                    <strong>{review.name}</strong>
                    <a
                      className="testimonial-google-link"
                      href={review.googleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Google <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="reviews-google-cta">
            <p>{REVIEWS_COUNT} reseñas de clientes en Google</p>

            <a
              className="reviews-link-btn"
              href={REVIEWS_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.reviews.ctaBtn}
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- ABOUT ---------------- */}
      <section id="about">
        <div className="iad-container about-grid">
          <Reveal>
            <p className="iad-kicker">{t.about.kicker}</p>
            <h2 className="iad-h2" style={{ maxWidth: "none" }}>
              {t.about.h2}
            </h2>
            <p className="about-body">{t.about.body}</p>
            <div className="about-included">{t.about.included}</div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- CONTACT ---------------- */}
      <section id="contact" className="iad-contact-bg">
        <div className="iad-container iad-contact-grid">
          <div>
            <p className="iad-kicker on-dark">{t.contact.kicker}</p>
            <h2 className="iad-h2">{t.contact.h2}</h2>
            <p className="iad-h2-sub on-dark">{t.contact.sub}</p>
            <div className="iad-contact-list">
              <div className="iad-contact-row">
                <MapPin size={18} />
                <div>
                  <div className="label">{t.contact.addressLabel}</div>
                  <div className="value">
                    Cra 1 Calle 17-1, Local 5, Taganga, Santa Marta, Magdalena,
                    Colombia
                  </div>
                </div>
              </div>
              <div className="iad-contact-row">
                <Phone size={18} />
                <div>
                  <div className="label">{t.contact.phoneLabel}</div>
                  <div className="value">{PHONE_DISPLAY}</div>
                </div>
              </div>
            </div>
            <a
              className="btn-primary"
              style={{ marginTop: 28 }}
              href={waLink(t.contact.ctaBtn)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.contact.ctaBtn}
            </a>
          </div>
          <div className="iad-map-wrap">
            <iframe
              title="I Am Diver location in Taganga"
              loading="lazy"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-74.196%2C11.263%2C-74.186%2C11.271&layer=mapnik&marker=11.267%2C-74.191"
            />
          </div>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="iad-footer">
        <span>
          © {new Date().getFullYear()} I Am Diver, Taganga. {t.footer.rights}
        </span>
        <span>{t.footer.tag}</span>
      </footer>

      {/* ---------------- FLOATING WHATSAPP WIDGET ---------------- */}
      <div className="wa-widget">
        {waWidgetOpen && (
          <div className="wa-panel">
            <p>{t.whatsappWidget.greeting}</p>
            <a
              href={waLink(t.whatsappWidget.greeting)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={16} />
              {t.whatsappWidget.cta}
            </a>
          </div>
        )}
        <button
          className="wa-bubble"
          onClick={() => setWaWidgetOpen((v) => !v)}
          aria-label={t.whatsappWidget.cta}
        >
          {waWidgetOpen ? (
            <X size={26} />
          ) : (
            <MessageCircle size={26} fill="currentColor" strokeWidth={0} />
          )}
        </button>
      </div>

      {/* ---------------- CART DRAWER ---------------- */}
      {cartOpen && (
        <>
          <div className="cart-overlay" onClick={() => setCartOpen(false)} />
          <div className="cart-drawer">
            <div className="cart-head">
              <h3>{t.cart.title}</h3>
              <button
                className="cart-close"
                onClick={() => setCartOpen(false)}
                aria-label={t.cart.close}
              >
                <X size={22} />
              </button>
            </div>
            <div className="cart-body">
              {cartItems.length === 0 ? (
                <p className="cart-empty">{t.cart.empty}</p>
              ) : (
                cartItems.map((c) => (
                  <div className="cart-line" key={c.id}>
                    <div style={{ flex: 1 }}>
                      <p className="cart-line-name">{c.name}</p>
                      <span className="cart-line-price">
                        {formatCOP(c.priceCOP)}
                      </span>
                      <div className="cart-qty">
                        <button onClick={() => decCart(c.id)} aria-label="-">
                          <Minus size={13} />
                        </button>
                        <span>{c.qty}</span>
                        <button onClick={() => addToCart(c.id)} aria-label="+">
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                    <button
                      className="cart-line-remove"
                      onClick={() => removeFromCart(c.id)}
                      aria-label={t.cart.remove}
                    >
                      <Trash2 size={16} />
                    </button>
                    <span className="cart-line-sub">
                      {formatCOP(c.priceCOP * c.qty)}
                    </span>
                  </div>
                ))
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="cart-foot">
                <div className="cart-total-row">
                  <span className="lbl">{t.cart.total}</span>
                  <span className="val">{formatCOP(cartTotal)}</span>
                </div>
                <button
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={startCheckout}
                >
                  <CreditCard size={17} />
                  {t.cart.checkout}
                </button>

                <p className="cart-note">{t.cart.note}</p>
                <p className="cart-note">{t.cart.note}</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ---------------- SIMULATED PAYMENT GATEWAY ---------------- */}
      {checkoutOpen && (
        <>
          <div className="checkout-overlay" onClick={closeCheckout} />

          <div className="checkout-modal">
            <div className="checkout-head">
              <div>
                <p className="iad-kicker">SECURE CHECKOUT</p>
                <h3>
                  {paymentSuccess
                    ? "Reserva confirmada"
                    : "Completa tu reserva"}
                </h3>
              </div>

              <button
                className="cart-close"
                onClick={closeCheckout}
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>

            {paymentSuccess ? (
              <div className="payment-success">
                <div className="payment-success-icon">
                  <Check size={32} />
                </div>

                <h4>¡Pago realizado correctamente!</h4>

                <p>
                  Tu reserva ha sido confirmada. Recibirás los detalles de tu
                  reserva con la información correspondiente.
                </p>

                <div className="payment-summary">
                  {cartItems.map((c) => (
                    <div key={c.id} className="payment-summary-row">
                      <span>
                        {c.name} × {c.qty}
                      </span>
                      <strong>{formatCOP(c.priceCOP * c.qty)}</strong>
                    </div>
                  ))}

                  <div className="payment-summary-total">
                    <span>{t.cart.total}</span>
                    <strong>{formatCOP(cartTotal)}</strong>
                  </div>
                </div>

                <button
                  className="btn-primary"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    marginTop: 20,
                  }}
                  onClick={closeCheckout}
                >
                  <CalendarCheck size={17} />
                  Ver mis servicios
                </button>
              </div>
            ) : (
              <div className="checkout-body">
                <div className="checkout-summary">
                  <p className="checkout-label">Tu reserva</p>

                  {cartItems.map((c) => (
                    <div key={c.id} className="checkout-summary-row">
                      <div>
                        <strong>{c.name}</strong>
                        <span>× {c.qty}</span>
                      </div>

                      <strong>{formatCOP(c.priceCOP * c.qty)}</strong>
                    </div>
                  ))}

                  <div className="checkout-total">
                    <span>{t.cart.total}</span>
                    <strong>{formatCOP(cartTotal)}</strong>
                  </div>
                </div>

                <div className="checkout-form">
                  <label>
                    Nombre completo
                    <input type="text" placeholder="Tu nombre" />
                  </label>

                  <label>
                    Email
                    <input type="email" placeholder="tu@email.com" />
                  </label>

                  <label>
                    Fecha preferida
                    <input type="date" />
                  </label>

                  <label>
                    Número de participantes
                    <input type="number" min="1" defaultValue={cartCount} />
                  </label>

                  <div className="fake-card">
                    <div className="fake-card-header">
                      <span>Pago seguro</span>
                      <CreditCard size={18} />
                    </div>

                    <label>
                      Número de tarjeta
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                      />
                    </label>

                    <div className="fake-card-row">
                      <label>
                        Vencimiento
                        <input type="text" placeholder="MM/YY" />
                      </label>

                      <label>
                        CVV
                        <input type="text" placeholder="123" maxLength={3} />
                      </label>
                    </div>
                  </div>

                  <button
                    className="btn-primary"
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      marginTop: 8,
                    }}
                    onClick={simulatePayment}
                  >
                    <CreditCard size={17} />
                    Pagar {formatCOP(cartTotal)}
                  </button>

                  <p className="checkout-disclaimer">
                    Pago simulado para la versión actual. Conecta Wompi, ePayco
                    o Stripe aquí cuando la pasarela real esté disponible.
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
