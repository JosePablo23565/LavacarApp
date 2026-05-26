import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export function Home() {
  const navigate = useNavigate()
  const dropsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Water drops animation
    if (dropsRef.current) {
      for (let i = 0; i < 18; i++) {
        const d = document.createElement('div')
        const size = Math.random() * 4 + 2
        d.style.cssText = `
          position:absolute;border-radius:50%;
          background:rgba(14,184,208,0.5);
          width:${size}px;height:${size}px;
          left:${Math.random() * 100}%;
          top:-${size}px;
          animation:dropFall ${Math.random() * 4 + 3}s linear ${Math.random() * 8}s infinite;
          opacity:${Math.random() * 0.4 + 0.1};
        `
        dropsRef.current.appendChild(d)
      }
    }

    // Scroll reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('lc-visible')
            // Count-up for stats
            const el = e.target as HTMLElement
            if (el.dataset.target) {
              const target = parseInt(el.dataset.target)
              let curr = 0
              const step = target / 40
              const timer = setInterval(() => {
                curr += step
                if (curr >= target) { curr = target; clearInterval(timer) }
                el.textContent = Math.round(curr) + (target === 500 ? '+' : '')
              }, 30)
            }
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.lc-reveal, [data-target]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=DM+Sans:wght@300;400;500&display=swap');

        .lc-root { font-family:'DM Sans',sans-serif; background:#0a0e1a; color:#fff; overflow-x:hidden; }
        .lc-root h1,.lc-root h2,.lc-root h3 { font-family:'Sora',sans-serif; }

        /* NAV */
        .lc-nav { position:fixed;top:0;left:0;right:0;z-index:100;padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center;transition:all .3s; }
        .lc-nav.scrolled { background:rgba(10,14,26,.96);backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,.07); }
        .lc-logo { font-family:'Sora',sans-serif;font-size:1.25rem;font-weight:600;color:#fff;display:flex;align-items:center;gap:.5rem;cursor:pointer; }
        .lc-dot { width:9px;height:9px;border-radius:50%;background:#0eb8d0;animation:lcPulseDot 2s infinite; }
        .lc-nav-links { display:flex;gap:2rem;list-style:none; }
        .lc-nav-links a { color:rgba(255,255,255,.7);text-decoration:none;font-size:.88rem;letter-spacing:.02em;transition:color .2s; }
        .lc-nav-links a:hover { color:#fff; }
        .lc-nav-cta { background:#1a6fd4;color:#fff;padding:.5rem 1.2rem;border-radius:8px;font-size:.85rem;font-weight:500;cursor:pointer;border:none;transition:background .2s; }
        .lc-nav-cta:hover { background:#1558aa; }

        /* HERO */
        .lc-hero { min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden; }
        .lc-hero-bg { position:absolute;inset:0;background:linear-gradient(135deg,#0a0e1a 0%,#0f1e3a 50%,#0a1628 100%); }
        .lc-grid { position:absolute;inset:0;background-image:linear-gradient(rgba(26,111,212,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(26,111,212,.12) 1px,transparent 1px);background-size:60px 60px;animation:lcGridMove 20s linear infinite; }
        .lc-glow { position:absolute;top:20%;left:50%;transform:translateX(-50%);width:600px;height:600px;background:radial-gradient(circle,rgba(14,184,208,.15) 0%,transparent 70%);animation:lcGlowPulse 4s ease-in-out infinite; }
        .lc-car-bg { position:absolute;bottom:0;right:-2%;font-size:300px;line-height:1;opacity:.1;animation:lcFloatCar 6s ease-in-out infinite;pointer-events:none; }
        .lc-hero-content { position:relative;z-index:2;text-align:center;padding:2rem;max-width:780px; }
        .lc-badge { display:inline-flex;align-items:center;gap:.5rem;background:rgba(14,184,208,.12);border:1px solid rgba(14,184,208,.3);color:#0eb8d0;padding:.4rem 1rem;border-radius:999px;font-size:.8rem;margin-bottom:1.5rem;animation:lcFadeUp .8s ease both; }
        .lc-hero h1 { font-size:clamp(2.5rem,6vw,4.5rem);font-weight:600;line-height:1.1;margin-bottom:1.2rem;animation:lcFadeUp .8s .15s ease both; }
        .lc-hero h1 span { color:#0eb8d0; }
        .lc-hero p { font-size:1.05rem;color:rgba(255,255,255,.6);margin-bottom:2.5rem;line-height:1.75;animation:lcFadeUp .8s .3s ease both; }
        .lc-hero-btns { display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;animation:lcFadeUp .8s .45s ease both; }
        .lc-btn-primary { background:#1a6fd4;color:#fff;padding:.85rem 2rem;border-radius:10px;font-weight:500;transition:all .25s;font-size:.95rem;cursor:pointer;border:none; }
        .lc-btn-primary:hover { background:#1558aa;transform:translateY(-2px); }
        .lc-btn-outline { border:1.5px solid rgba(255,255,255,.25);color:#fff;padding:.85rem 2rem;border-radius:10px;font-weight:500;transition:all .25s;font-size:.95rem;cursor:pointer;background:transparent; }
        .lc-btn-outline:hover { border-color:rgba(255,255,255,.5);background:rgba(255,255,255,.05); }
        .lc-scroll-ind { position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:.5rem;animation:lcFadeUp 1s .8s ease both; }
        .lc-scroll-ind span { font-size:.7rem;color:rgba(255,255,255,.35);letter-spacing:.12em; }
        .lc-scroll-arrow { width:18px;height:18px;border-right:1.5px solid rgba(255,255,255,.3);border-bottom:1.5px solid rgba(255,255,255,.3);transform:rotate(45deg);animation:lcScrollBounce 2s ease-in-out infinite; }

        /* STATS */
        .lc-stats { background:rgba(255,255,255,.03);border-top:1px solid rgba(255,255,255,.07);border-bottom:1px solid rgba(255,255,255,.07);padding:2.5rem 4rem;display:flex;justify-content:center;gap:5rem;flex-wrap:wrap; }
        .lc-stat { text-align:center; }
        .lc-stat-num { font-family:'Sora',sans-serif;font-size:2rem;font-weight:600;color:#0eb8d0; }
        .lc-stat-label { font-size:.75rem;color:rgba(255,255,255,.4);margin-top:.25rem;letter-spacing:.06em; }

        /* SECTION COMMONS */
        .lc-section { padding:6rem 2rem;max-width:1100px;margin:0 auto; }
        .lc-tag { display:inline-block;background:rgba(14,184,208,.1);color:#0eb8d0;padding:.3rem .9rem;border-radius:6px;font-size:.75rem;margin-bottom:1rem;letter-spacing:.06em; }
        .lc-section-title { font-size:2.2rem;font-weight:600;margin-bottom:.8rem;line-height:1.2; }
        .lc-section-sub { color:rgba(255,255,255,.5);font-size:.95rem;line-height:1.75;max-width:520px; }

        /* SERVICES */
        .lc-services-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:1.25rem;margin-top:3rem; }
        .lc-service-card { background:#111827;border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:1.75rem;transition:all .35s;position:relative;overflow:hidden;cursor:pointer; }
        .lc-service-card::before { content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(26,111,212,.09),transparent);opacity:0;transition:opacity .3s; }
        .lc-service-card:hover { border-color:rgba(14,184,208,.35);transform:translateY(-4px); }
        .lc-service-card:hover::before { opacity:1; }
        .lc-svc-icon { font-size:2.2rem;margin-bottom:1rem; }
        .lc-svc-name { font-family:'Sora',sans-serif;font-size:1rem;font-weight:500;margin-bottom:.4rem; }
        .lc-svc-price { font-family:'Sora',sans-serif;font-size:1.5rem;font-weight:600;color:#0eb8d0;margin-bottom:.6rem; }
        .lc-svc-desc { font-size:.84rem;color:rgba(255,255,255,.5);line-height:1.6; }
        .lc-svc-time { display:inline-flex;align-items:center;gap:.3rem;margin-top:1rem;font-size:.74rem;color:rgba(255,255,255,.35);background:rgba(255,255,255,.05);padding:.3rem .75rem;border-radius:99px; }

        /* BOOKING */
        .lc-booking { background:linear-gradient(135deg,#0f1e3a,#111827);border:1px solid rgba(255,255,255,.07);border-radius:24px;padding:4rem;margin:4rem auto;max-width:1100px;position:relative;overflow:hidden; }
        .lc-booking-glow { position:absolute;top:-30%;right:-10%;width:400px;height:400px;background:radial-gradient(circle,rgba(14,184,208,.08) 0%,transparent 70%);pointer-events:none; }
        .lc-booking-grid { position:relative;z-index:1;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center; }
        .lc-steps { display:flex;flex-direction:column;gap:1.25rem;margin-top:2rem; }
        .lc-step { display:flex;align-items:flex-start;gap:1rem; }
        .lc-step-num { width:32px;height:32px;border-radius:50%;background:#1a6fd4;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:600;flex-shrink:0;font-family:'Sora',sans-serif; }
        .lc-step-title { font-size:.9rem;font-weight:500;margin-bottom:.2rem; }
        .lc-step-desc { font-size:.8rem;color:rgba(255,255,255,.45);line-height:1.5; }
        .lc-booking-visual { background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:2rem;text-align:center; }
        .lc-big-icon { font-size:5rem;display:block;margin-bottom:1rem;animation:lcFloatIcon 3s ease-in-out infinite; }
        .lc-check-item { display:flex;align-items:center;gap:.6rem;border-radius:10px;padding:.75rem 1rem;font-size:.82rem;margin-bottom:.6rem; }

        /* QUICK LINKS */
        .lc-ql-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.25rem;margin-top:3rem; }
        .lc-ql-card { background:#111827;border:1px solid rgba(255,255,255,.07);border-radius:18px;padding:2rem;color:#fff;transition:all .3s;display:flex;flex-direction:column;gap:.75rem;position:relative;overflow:hidden;cursor:pointer; }
        .lc-ql-card::after { content:'';position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#1a6fd4,#0eb8d0);opacity:0;transition:opacity .3s; }
        .lc-ql-card:hover { transform:translateY(-3px);border-color:rgba(14,184,208,.25); }
        .lc-ql-card:hover::after { opacity:1; }
        .lc-ql-icon { font-size:2rem; }
        .lc-ql-title { font-family:'Sora',sans-serif;font-size:1rem;font-weight:500; }
        .lc-ql-desc { font-size:.82rem;color:rgba(255,255,255,.45);line-height:1.5; }
        .lc-ql-arrow { margin-top:auto;color:#0eb8d0;font-size:.82rem; }

        /* FEATURES */
        .lc-feat-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-top:3rem; }
        .lc-feat-card { background:#111827;border:1px solid rgba(255,255,255,.06);border-radius:14px;padding:1.5rem;transition:border-color .3s; }
        .lc-feat-card:hover { border-color:rgba(26,111,212,.4); }
        .lc-feat-icon { font-size:1.6rem;margin-bottom:.75rem; }
        .lc-feat-title { font-family:'Sora',sans-serif;font-size:.9rem;font-weight:500;margin-bottom:.4rem; }
        .lc-feat-desc { font-size:.8rem;color:rgba(255,255,255,.45);line-height:1.5; }

        /* REVIEWS */
        .lc-reviews-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.25rem;margin-top:3rem; }
        .lc-review { background:#111827;border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:1.75rem;transition:border-color .3s; }
        .lc-review:hover { border-color:rgba(255,255,255,.15); }
        .lc-stars { color:#f59e0b;font-size:1rem;margin-bottom:1rem; }
        .lc-review-text { font-size:.88rem;color:rgba(255,255,255,.6);line-height:1.7;margin-bottom:1.25rem;font-style:italic; }
        .lc-reviewer { display:flex;align-items:center;gap:.75rem; }
        .lc-avatar { width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#1a6fd4,#0eb8d0);display:flex;align-items:center;justify-content:center;font-size:.82rem;font-weight:600; }
        .lc-rev-name { font-size:.88rem;font-weight:500; }
        .lc-rev-date { font-size:.74rem;color:rgba(255,255,255,.35); }

        /* CONTACT */
        .lc-contact-section { padding:5rem 2rem;background:#060a14;border-top:1px solid rgba(255,255,255,.07); }
        .lc-contact-inner { max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:start; }
        .lc-info-card { display:flex;align-items:center;gap:1rem;background:#111827;border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:1rem 1.25rem;margin-bottom:.75rem; }
        .lc-info-icon { font-size:1.4rem; }
        .lc-info-label { font-size:.75rem;color:rgba(255,255,255,.4);margin-bottom:.2rem;letter-spacing:.04em; }
        .lc-info-value { font-size:.9rem; }

        /* FOOTER */
        .lc-footer { background:#060a14;border-top:1px solid rgba(255,255,255,.06);padding:3rem 2rem;text-align:center; }
        .lc-footer-logo { font-family:'Sora',sans-serif;font-size:1.4rem;font-weight:600;margin-bottom:.4rem; }
        .lc-footer-sub { font-size:.82rem;color:rgba(255,255,255,.35);margin-bottom:2rem; }
        .lc-footer-links { display:flex;gap:2rem;justify-content:center;flex-wrap:wrap;margin-bottom:1.5rem; }
        .lc-footer-links button { background:none;border:none;color:rgba(255,255,255,.4);font-size:.84rem;cursor:pointer;transition:color .2s; }
        .lc-footer-links button:hover { color:#fff; }
        .lc-footer-copy { font-size:.75rem;color:rgba(255,255,255,.18); }

        /* MENU SECTION BG */
        .lc-menu-bg { background:rgba(255,255,255,.02);border-top:1px solid rgba(255,255,255,.06);padding:6rem 2rem; }

        /* REVEAL */
        .lc-reveal { opacity:0;transform:translateY(28px);transition:opacity .7s ease,transform .7s ease; }
        .lc-reveal.lc-visible { opacity:1;transform:translateY(0); }
        .lc-d1 { transition-delay:.1s; }
        .lc-d2 { transition-delay:.2s; }
        .lc-d3 { transition-delay:.3s; }

        /* KEYFRAMES */
        @keyframes lcPulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }
        @keyframes lcGlowPulse { 0%,100%{opacity:.6;transform:translateX(-50%) scale(1)} 50%{opacity:1;transform:translateX(-50%) scale(1.1)} }
        @keyframes lcGridMove { 0%{background-position:0 0} 100%{background-position:60px 60px} }
        @keyframes lcFloatCar { 0%,100%{transform:translateX(0) translateY(0)} 50%{transform:translateX(-10px) translateY(-15px)} }
        @keyframes dropFall { 0%{transform:translateY(-20px);opacity:1} 100%{transform:translateY(100vh);opacity:0} }
        @keyframes lcFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lcScrollBounce { 0%,100%{transform:rotate(45deg) translateY(0)} 50%{transform:rotate(45deg) translateY(5px)} }
        @keyframes lcFloatIcon { 0%,100%{transform:translateY(0) rotate(-4deg)} 50%{transform:translateY(-10px) rotate(4deg)} }

        @media(max-width:768px) {
          .lc-nav-links,.lc-nav-cta{display:none;}
          .lc-hero h1{font-size:2.2rem;}
          .lc-stats{gap:2.5rem;padding:2rem 1.5rem;}
          .lc-booking-grid,.lc-contact-inner{grid-template-columns:1fr;}
          .lc-booking{padding:2.5rem 1.5rem;}
          .lc-section{padding:4rem 1.25rem;}
        }
      `}</style>

      <div className="lc-root">
        {/* NAVBAR */}
        <nav
          className="lc-nav"
          id="lc-navbar"
          ref={(el) => {
            if (!el) return
            const onScroll = () => el.classList.toggle('scrolled', window.scrollY > 50)
            window.addEventListener('scroll', onScroll)
          }}
        >
          <div className="lc-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="lc-dot" />
            Lavacar Pro
          </div>
          <ul className="lc-nav-links">
            <li><a href="#servicios" onClick={(e) => { e.preventDefault(); document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' }) }}>Servicios</a></li>
            <li><a href="#nosotros" onClick={(e) => { e.preventDefault(); document.getElementById('nosotros')?.scrollIntoView({ behavior: 'smooth' }) }}>Nosotros</a></li>
            <li><a href="#opiniones" onClick={(e) => { e.preventDefault(); document.getElementById('opiniones')?.scrollIntoView({ behavior: 'smooth' }) }}>Opiniones</a></li>
            <li><a href="#contacto" onClick={(e) => { e.preventDefault(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }}>Contacto</a></li>
          </ul>
          <button className="lc-nav-cta" onClick={() => navigate('/')}>Agendar cita</button>
        </nav>

        {/* HERO */}
        <section className="lc-hero">
          <div className="lc-hero-bg" />
          <div className="lc-grid" />
          <div className="lc-glow" />
          <div ref={dropsRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
          <span className="lc-car-bg">🚗</span>

          <div className="lc-hero-content">
            <div className="lc-badge">
              <div className="lc-dot" style={{ width: 7, height: 7 }} />
              Bagaces, Guanacaste — Costa Rica
            </div>
            <h1>Tu auto <span>merece</span><br />el mejor cuidado</h1>
            <p>Lavado profesional, encerado y limpieza de tapizado.<br />Agendá tu cita en segundos y olvidate del resto.</p>
            <div className="lc-hero-btns">
              <button className="lc-btn-primary" onClick={() => navigate('/agendar')}>Agendar mi cita ahora</button>
              <button className="lc-btn-outline" onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}>Ver servicios</button>
            </div>
          </div>

          <div className="lc-scroll-ind">
            <span>DESLIZAR</span>
            <div className="lc-scroll-arrow" />
          </div>
        </section>

        {/* STATS */}
        <div className="lc-stats lc-reveal">
          {[
            { target: 500, label: 'CLIENTES FELICES', suffix: '+' },
            { target: 4, label: 'SERVICIOS DISPONIBLES', suffix: '' },
            { target: 3, label: 'AÑOS DE EXPERIENCIA', suffix: '' },
          ].map((s) => (
            <div className="lc-stat" key={s.label}>
              <div className="lc-stat-num" data-target={s.target}>0</div>
              <div className="lc-stat-label">{s.label}</div>
            </div>
          ))}
          <div className="lc-stat">
            <div className="lc-stat-num" style={{ color: '#f59e0b' }}>★★★★★</div>
            <div className="lc-stat-label">CALIFICACIÓN PROMEDIO</div>
          </div>
        </div>

        {/* SERVICIOS */}
        <section id="servicios">
          <div className="lc-section">
            <div className="lc-reveal">
              <span className="lc-tag">NUESTROS SERVICIOS</span>
              <h2 className="lc-section-title">Servicios diseñados<br />para tu vehículo</h2>
              <p className="lc-section-sub">Cada servicio está pensado para devolverle el brillo y la limpieza que tu auto merece.</p>
            </div>
            <div className="lc-services-grid">
              {[
                { icon: '🚿', name: 'Lavado Básico', price: '$10', desc: 'Lavado exterior con agua a presión, shampoo especial y secado manual.', time: '30 min', delay: 'lc-d1' },
                { icon: '✨', name: 'Lavado Completo', price: '$20', desc: 'Interior y exterior. Aspirado, tablero, vidrios y limpieza de llantas.', time: '45 min', delay: 'lc-d2' },
                { icon: '🌟', name: 'Encerado + Lavado', price: '$35', desc: 'Lavado completo más encerado profesional para proteger y dar brillo a la pintura.', time: '60 min', delay: 'lc-d3' },
                { icon: '🧼', name: 'Limpieza de Tapizado', price: '$25', desc: 'Limpieza profunda de asientos y alfombras con extractora profesional.', time: '40 min', delay: 'lc-d1' },
              ].map((s) => (
                <div key={s.name} className={`lc-service-card lc-reveal ${s.delay}`} onClick={() => navigate('/agendar')}>
                  <div className="lc-svc-icon">{s.icon}</div>
                  <div className="lc-svc-name">{s.name}</div>
                  <div className="lc-svc-price">{s.price}</div>
                  <div className="lc-svc-desc">{s.desc}</div>
                  <div className="lc-svc-time">⏱ {s.time}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BOOKING CTA */}
        <div className="lc-booking">
          <div className="lc-booking-glow" />
          <div className="lc-booking-grid">
            <div className="lc-reveal">
              <span className="lc-tag">RESERVA EN LÍNEA</span>
              <h2 className="lc-section-title" style={{ fontSize: '1.9rem' }}>Agendá tu cita en<br />menos de 2 minutos</h2>
              <div className="lc-steps">
                {[
                  { n: 1, title: 'Seleccioná tu servicio', desc: 'Elegí entre nuestros 4 servicios según lo que necesita tu vehículo.' },
                  { n: 2, title: 'Elegí fecha y hora', desc: 'Ve los horarios disponibles en tiempo real y reservá el que más te convenga.' },
                  { n: 3, title: 'Confirmación instantánea', desc: 'Recibís confirmación inmediata y podés ver tus citas con tu número de teléfono.' },
                ].map((step) => (
                  <div className="lc-step" key={step.n}>
                    <div className="lc-step-num">{step.n}</div>
                    <div>
                      <div className="lc-step-title">{step.title}</div>
                      <div className="lc-step-desc">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="lc-btn-primary" style={{ marginTop: '2rem' }} onClick={() => navigate('/agendar')}>
                Agendar mi cita ahora
              </button>
            </div>
            <div className="lc-booking-visual lc-reveal lc-d2">
              <span className="lc-big-icon">🚗</span>
              <div style={{ fontFamily: "'Sora',sans-serif", fontSize: '1.1rem', fontWeight: 500, marginBottom: '.5rem' }}>Rápido. Fácil. Confiable.</div>
              <div style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.4)', marginBottom: '1.5rem' }}>Sin filas, sin esperas. Reservá desde donde estés.</div>
              {[
                { bg: 'rgba(14,184,208,.1)', border: 'rgba(14,184,208,.2)', color: '#0eb8d0', text: 'Disponible 24/7 para reservas' },
                { bg: 'rgba(26,111,212,.1)', border: 'rgba(26,111,212,.2)', color: '#5a9cf0', text: 'Sin costo adicional por reservar' },
                { bg: 'rgba(16,185,129,.1)', border: 'rgba(16,185,129,.2)', color: '#34d399', text: 'Cancelación sin penalidad' },
              ].map((item) => (
                <div key={item.text} className="lc-check-item" style={{ background: item.bg, border: `1px solid ${item.border}`, color: item.color }}>
                  <span>✓</span> {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MENU RÁPIDO */}
        <section className="lc-menu-bg" id="nosotros">
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="lc-reveal">
              <span className="lc-tag">EXPLORA</span>
              <h2 className="lc-section-title">Todo lo que necesitás</h2>
              <p className="lc-section-sub">Accedé rápidamente a todas las secciones del sitio.</p>
            </div>
            <div className="lc-ql-grid">
              {[
                { icon: '📅', title: 'Agendar Cita', desc: 'Reservá tu espacio y elegí el servicio que necesitás.', arrow: 'Reservar ahora', action: () => navigate('/agendar'), delay: 'lc-d1' },
                { icon: '📋', title: 'Mis Citas', desc: 'Consultá tus citas agendadas con tu número de teléfono.', arrow: 'Consultar citas', action: () => navigate('/agendar'), delay: 'lc-d2' },
                { icon: '🛍️', title: 'Productos', desc: 'Catálogo de productos de limpieza para tu vehículo.', arrow: 'Ver catálogo', action: () => navigate('/productos'), delay: 'lc-d3' },
                { icon: '📍', title: 'Ubicación', desc: 'Bagaces, Guanacaste. Fácil de llegar y con estacionamiento.', arrow: 'Ver en mapa', action: () => navigate('/contacto'), delay: 'lc-d1' },
                { icon: '📱', title: 'Contacto', desc: 'WhatsApp, teléfono o correo. Respondemos rápido.', arrow: 'Contactar', action: () => navigate('/contacto'), delay: 'lc-d2' },
                { icon: '⭐', title: 'Opiniones', desc: 'Lo que dicen nuestros clientes sobre su experiencia.', arrow: 'Ver opiniones', action: () => navigate('/opiniones'), delay: 'lc-d3' },
              ].map((ql) => (
                <div key={ql.title} className={`lc-ql-card lc-reveal ${ql.delay}`} onClick={ql.action}>
                  <div className="lc-ql-icon">{ql.icon}</div>
                  <div className="lc-ql-title">{ql.title}</div>
                  <div className="lc-ql-desc">{ql.desc}</div>
                  <div className="lc-ql-arrow">→ {ql.arrow}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* POR QUÉ ELEGIRNOS */}
        <section id="features">
          <div className="lc-section">
            <div className="lc-reveal">
              <span className="lc-tag">POR QUÉ ELEGIRNOS</span>
              <h2 className="lc-section-title">La diferencia que sentís</h2>
              <p className="lc-section-sub">No solo lavamos autos. Cuidamos tu inversión con atención al detalle.</p>
            </div>
            <div className="lc-feat-grid">
              {[
                { icon: '⚡', title: 'Servicio rápido', desc: 'Respetamos tu tiempo. Cada servicio tiene duración estimada y lo cumplimos.', d: 'lc-d1' },
                { icon: '🏆', title: 'Productos premium', desc: 'Usamos productos especializados que protegen la pintura y el interior.', d: 'lc-d2' },
                { icon: '📲', title: 'Reserva en línea', desc: 'Agendá 24/7 desde tu teléfono. Sin llamadas, sin esperas.', d: 'lc-d3' },
                { icon: '💯', title: 'Garantía de calidad', desc: 'Si no quedás satisfecho, lo hacemos de nuevo. Tu confianza es lo más importante.', d: 'lc-d1' },
                { icon: '📍', title: 'Fácil de llegar', desc: 'Centro de Bagaces con estacionamiento amplio para tu comodidad.', d: 'lc-d2' },
                { icon: '💬', title: 'Atención personalizada', desc: 'Te contactamos por WhatsApp para confirmar y recordarte tu cita.', d: 'lc-d3' },
              ].map((f) => (
                <div key={f.title} className={`lc-feat-card lc-reveal ${f.d}`}>
                  <div className="lc-feat-icon">{f.icon}</div>
                  <div className="lc-feat-title">{f.title}</div>
                  <div className="lc-feat-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OPINIONES */}
        <section id="opiniones" style={{ padding: '6rem 2rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="lc-reveal">
              <span className="lc-tag">OPINIONES</span>
              <h2 className="lc-section-title">Lo que dicen nuestros clientes</h2>
              <p className="lc-section-sub">Más de 500 clientes satisfechos en Guanacaste confían en nosotros.</p>
            </div>
            <div className="lc-reviews-grid">
              {[
                { initials: 'MG', name: 'María González', date: 'Hace 2 semanas', text: 'Excelente servicio. Mi Toyota quedó como nuevo. El encerado duró más de lo esperado y el precio es muy justo.', d: 'lc-d1' },
                { initials: 'CR', name: 'Carlos Rodríguez', date: 'Hace 1 mes', text: 'Super fácil agendar. Llegué a mi hora y en 40 minutos mi camioneta estaba impecable. Vuelvo seguro.', d: 'lc-d2' },
                { initials: 'AL', name: 'Andrea López', date: 'Hace 3 semanas', text: 'Tienen el mejor tapizado de la zona. Lo limpian a fondo, huele increíble y los asientos quedan perfectos.', d: 'lc-d3' },
              ].map((r) => (
                <div key={r.name} className={`lc-review lc-reveal ${r.d}`}>
                  <div className="lc-stars">★★★★★</div>
                  <div className="lc-review-text">"{r.text}"</div>
                  <div className="lc-reviewer">
                    <div className="lc-avatar">{r.initials}</div>
                    <div>
                      <div className="lc-rev-name">{r.name}</div>
                      <div className="lc-rev-date">{r.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }} className="lc-reveal">
              <button className="lc-btn-outline" onClick={() => navigate('/opiniones')}>Ver todas las opiniones</button>
            </div>
          </div>
        </section>

        {/* CONTACTO */}
        <section className="lc-contact-section" id="contacto">
          <div className="lc-contact-inner lc-reveal">
            <div>
              <span className="lc-tag">CONTACTO</span>
              <h2 className="lc-section-title" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Hablemos</h2>
              {[
                { icon: '📍', label: 'DIRECCIÓN', value: 'Bagaces, Guanacaste, Costa Rica' },
                { icon: '📱', label: 'WHATSAPP', value: '+506 1234-5678', color: '#25d366' },
                { icon: '✉️', label: 'CORREO', value: 'lavacar@gmail.com' },
                { icon: '⏰', label: 'HORARIO', value: 'Lun–Sáb: 8am–6pm · Dom: 9am–2pm' },
              ].map((info) => (
                <div key={info.label} className="lc-info-card">
                  <span className="lc-info-icon">{info.icon}</span>
                  <div>
                    <div className="lc-info-label">{info.label}</div>
                    <div className="lc-info-value" style={info.color ? { color: info.color } : {}}>{info.value}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lc-reveal lc-d2">
              <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,.07)', borderRadius: 20, padding: '2.5rem', textAlign: 'center' }}>
                <span className="lc-big-icon">🚗</span>
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: '1.3rem', fontWeight: 500, marginBottom: '.5rem' }}>¿Listo para que tu auto brille?</h3>
                <p style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.4)', marginBottom: '1.5rem', lineHeight: 1.6 }}>Agendá tu cita ahora y disfrutá un vehículo impecable.</p>
                <button className="lc-btn-primary" style={{ width: '100%', padding: '1rem' }} onClick={() => navigate('/agendar')}>
                  Agendar mi cita ahora
                </button>
                <div style={{ marginTop: '.75rem', fontSize: '.74rem', color: 'rgba(255,255,255,.22)' }}>Sin tarjeta · Sin registro requerido</div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="lc-footer">
          <div className="lc-footer-logo">🚗 Lavacar Pro</div>
          <div className="lc-footer-sub">Bagaces, Guanacaste, Costa Rica</div>
          <div className="lc-footer-links">
            {[
              { label: 'Agendar', path: '/agendar' },
              { label: 'Servicios', anchor: 'servicios' },
              { label: 'Productos', path: '/productos' },
              { label: 'Contacto', path: '/contacto' },
              { label: 'Opiniones', path: '/opiniones' },
            ].map((l) => (
              <button key={l.label} onClick={() => l.path ? navigate(l.path) : document.getElementById(l.anchor || '')?.scrollIntoView({ behavior: 'smooth' })}>
                {l.label}
              </button>
            ))}
          </div>
          <div className="lc-footer-copy">© 2025 Lavacar Pro · Todos los derechos reservados</div>
        </footer>
      </div>
    </>
  )
}