export function Contact() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600&family=DM+Sans:wght@400;500&display=swap');
        .ct-root{min-height:100vh;background:linear-gradient(135deg,#0a0e1a 0%,#0f1e3a 60%,#0a0e1a 100%);padding:3rem 1.5rem;font-family:'DM Sans',sans-serif;color:#fff;}
        .ct-inner{max-width:900px;margin:0 auto;}
        .ct-header{text-align:center;margin-bottom:2rem;}
        .ct-icon-circle{width:72px;height:72px;background:linear-gradient(135deg,#1a6fd4,#0eb8d0);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2rem;margin:0 auto 1rem;}
        .ct-title{font-family:'Sora',sans-serif;font-size:2rem;font-weight:600;margin-bottom:.4rem;}
        .ct-sub{color:rgba(255,255,255,.45);font-size:.9rem;}
        .ct-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;}
        .ct-card{background:#111827;border:1px solid rgba(255,255,255,.08);border-radius:20px;overflow:hidden;}
        .ct-card-header{background:linear-gradient(135deg,#1a6fd4,#0eb8d0);padding:1rem 1.5rem;text-align:center;}
        .ct-card-header p{font-size:.8rem;color:rgba(255,255,255,.85);letter-spacing:.06em;}
        .ct-items{padding:1.25rem;}
        .ct-item{display:flex;align-items:center;gap:1rem;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:1rem;margin-bottom:.75rem;}
        .ct-item-icon{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;}
        .ct-item-label{font-size:.7rem;color:rgba(255,255,255,.4);margin-bottom:.1rem;}
        .ct-item-value{font-size:.85rem;font-weight:500;}
        .ct-wa-btn{color:#25d366;text-decoration:none;}
        .ct-badge{background:rgba(37,211,102,.12);color:#25d366;border:1px solid rgba(37,211,102,.2);padding:.2rem .6rem;border-radius:6px;font-size:.65rem;margin-left:.5rem;}
        .ct-maps-btn{width:100%;background:linear-gradient(135deg,#16a34a,#15803d);color:#fff;border:none;padding:.85rem;border-radius:12px;font-size:.85rem;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.5rem;transition:opacity .2s;margin-top:.5rem;}
        .ct-maps-btn:hover{opacity:.88;}
        .ct-iframe{border-radius:12px;overflow:hidden;margin-top:.5rem;}
        .ct-cta-card{background:linear-gradient(135deg,#1a6fd4,#0eb8d0);border-radius:20px;padding:2rem;text-align:center;}
        @media(max-width:768px){.ct-grid{grid-template-columns:1fr;}}
      `}</style>

      <div className="ct-root">
        <div className="ct-inner">
          <div className="ct-header">
            <div className="ct-icon-circle">📞</div>
            <h1 className="ct-title">Contacto</h1>
            <p className="ct-sub">Estamos aquí para ayudarte</p>
          </div>

          <div className="ct-grid">
            {/* Columna izquierda - Información */}
            <div className="ct-card">
              <div className="ct-card-header">
                <p>INFORMACIÓN DE CONTACTO</p>
              </div>
              <div className="ct-items">
                <div className="ct-item">
                  <div className="ct-item-icon">📍</div>
                  <div>
                    <div className="ct-item-label">DIRECCIÓN</div>
                    <div className="ct-item-value">Bagaces, Guanacaste, Costa Rica</div>
                  </div>
                </div>
                <div className="ct-item">
                  <div className="ct-item-icon">📱</div>
                  <div>
                    <div className="ct-item-label">WHATSAPP</div>
                    <div className="ct-item-value">
                      <a href="https://wa.me/50612345678" target="_blank" className="ct-wa-btn">+506 1234-5678</a>
                      <span className="ct-badge">WhatsApp</span>
                    </div>
                  </div>
                </div>
                <div className="ct-item">
                  <div className="ct-item-icon">✉️</div>
                  <div>
                    <div className="ct-item-label">CORREO</div>
                    <div className="ct-item-value">lavacar@gmail.com</div>
                  </div>
                </div>
                <div className="ct-item">
                  <div className="ct-item-icon">⏰</div>
                  <div>
                    <div className="ct-item-label">HORARIO</div>
                    <div className="ct-item-value">Lunes a Sábado: 8am - 6pm</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha - Mapa y CTA */}
            <div className="ct-card">
              <div className="ct-card-header">
                <p>UBICACIÓN</p>
              </div>
              <div className="ct-items">
                <div className="ct-iframe">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15716.123456789!2d-85.2548091!3d10.5218901!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDMxJzE4LjgiTiA4NcKwMTUnMTcuMyJX!5e0!3m2!1ses!2scr!4v1234567890"
                    width="100%"
                    height="180"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Google Maps"
                  />
                </div>
                <button
                  className="ct-maps-btn"
                  onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=10.5218901,-85.2548091', '_blank')}
                >
                  🗺️ Abrir en Google Maps
                </button>
              </div>
            </div>
          </div>

          {/* CTA final */}
          <div className="ct-cta-card" style={{ marginTop: '1.5rem' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '.5rem' }}>🚗</span>
            <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: '1.2rem', marginBottom: '.5rem' }}>¿Listo para que tu auto brille?</h3>
            <p style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.7)', marginBottom: '1rem' }}>Agendá tu cita ahora y disfrutá un vehículo impecable.</p>
            <button 
              className="ct-maps-btn" 
              style={{ background: 'linear-gradient(135deg,#0eb8d0,#1a6fd4)', marginTop: 0, width: 'auto', display: 'inline-flex', padding: '.75rem 2rem' }}
              onClick={() => window.location.href = '/agendar'}
            >
              📅 Agendar mi cita ahora
            </button>
            <div style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.4)', marginTop: '.75rem' }}>Sin tarjeta · Sin registro requerido</div>
          </div>
        </div>
      </div>
    </>
  )
}