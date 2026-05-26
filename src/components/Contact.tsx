export function Contact() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600&family=DM+Sans:wght@400;500&display=swap');
        .ct-root{min-height:100vh;background:linear-gradient(135deg,#0a0e1a 0%,#0f1e3a 60%,#0a0e1a 100%);padding:3rem 1.5rem;font-family:'DM Sans',sans-serif;color:#fff;}
        .ct-inner{max-width:680px;margin:0 auto;}
        .ct-header{text-align:center;margin-bottom:2.5rem;}
        .ct-icon-circle{width:72px;height:72px;background:linear-gradient(135deg,#1a6fd4,#0eb8d0);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2rem;margin:0 auto 1.2rem;}
        .ct-title{font-family:'Sora',sans-serif;font-size:2rem;font-weight:600;margin-bottom:.4rem;}
        .ct-sub{color:rgba(255,255,255,.45);font-size:.95rem;}
        .ct-card{background:#111827;border:1px solid rgba(255,255,255,.08);border-radius:20px;overflow:hidden;margin-bottom:1rem;}
        .ct-card-header{background:linear-gradient(135deg,#1a6fd4,#0eb8d0);padding:1rem 1.5rem;text-align:center;}
        .ct-card-header p{font-size:.8rem;color:rgba(255,255,255,.85);letter-spacing:.06em;}
        .ct-items{padding:1.25rem;}
        .ct-item{display:flex;align-items:flex-start;gap:1rem;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:1rem 1.25rem;margin-bottom:.75rem;transition:border-color .2s;}
        .ct-item:hover{border-color:rgba(14,184,208,.3);}
        .ct-item-icon{width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;}
        .ct-item-title{font-weight:500;font-size:.95rem;margin-bottom:.3rem;}
        .ct-item-value{font-size:.88rem;color:rgba(255,255,255,.6);line-height:1.5;}
        .ct-item-value a{color:#0eb8d0;text-decoration:none;transition:color .2s;}
        .ct-item-value a:hover{color:#5cd6e8;}
        .ct-maps-btn{width:100%;background:linear-gradient(135deg,#16a34a,#15803d);color:#fff;border:none;padding:1rem;border-radius:12px;font-size:.95rem;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.5rem;transition:opacity .2s;font-family:'DM Sans',sans-serif;margin-top:.5rem;}
        .ct-maps-btn:hover{opacity:.88;}
        .ct-schedule-row{display:flex;justify-content:space-between;padding:.4rem 0;font-size:.88rem;border-bottom:1px solid rgba(255,255,255,.05);}
        .ct-schedule-row:last-child{border-bottom:none;}
        .ct-schedule-day{color:rgba(255,255,255,.5);}
        .ct-schedule-hours{color:#34d399;font-weight:500;}
        .ct-wa-btn{display:flex;align-items:center;gap:.5rem;color:#25d366;text-decoration:none;font-size:1rem;font-weight:500;transition:opacity .2s;}
        .ct-wa-btn:hover{opacity:.8;}
        .ct-badge{display:inline-block;background:rgba(37,211,102,.12);color:#25d366;border:1px solid rgba(37,211,102,.2);padding:.2rem .6rem;border-radius:6px;font-size:.74rem;margin-left:.5rem;}
      `}</style>

      <div className="ct-root">
        <div className="ct-inner">
          <div className="ct-header">
            <div className="ct-icon-circle">📞</div>
            <h1 className="ct-title">Contacto</h1>
            <p className="ct-sub">Estamos aquí para ayudarte</p>
          </div>

          <div className="ct-card">
            <div className="ct-card-header">
              <p>INFORMACIÓN DE CONTACTO</p>
            </div>
            <div className="ct-items">
              {/* Dirección */}
              <div className="ct-item">
                <div className="ct-item-icon">📍</div>
                <div>
                  <div className="ct-item-title">Dirección</div>
                  <div className="ct-item-value">Bagaces, Guanacaste<br />Costa Rica</div>
                </div>
              </div>

              {/* Teléfono / WhatsApp */}
              <div className="ct-item">
                <div className="ct-item-icon">📱</div>
                <div>
                  <div className="ct-item-title">Teléfono / WhatsApp</div>
                  <div className="ct-item-value">
                    <a href="https://wa.me/50612345678" target="_blank" rel="noreferrer" className="ct-wa-btn">
                      +506 1234-5678
                      <span className="ct-badge">WhatsApp</span>
                    </a>
                    <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.3)', marginTop: '.3rem' }}>Toca para enviar mensaje directo</div>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="ct-item">
                <div className="ct-item-icon">✉️</div>
                <div>
                  <div className="ct-item-title">Correo electrónico</div>
                  <div className="ct-item-value">
                    <a href="mailto:lavacar@gmail.com">lavacar@gmail.com</a>
                  </div>
                </div>
              </div>

              {/* Horario */}
              <div className="ct-item">
                <div className="ct-item-icon">⏰</div>
                <div style={{ flex: 1 }}>
                  <div className="ct-item-title">Horario de atención</div>
                  <div className="ct-item-value" style={{ width: '100%' }}>
                    <div className="ct-schedule-row">
                      <span className="ct-schedule-day">Lunes a Sábado</span>
                      <span className="ct-schedule-hours">8:00am – 6:00pm</span>
                    </div>
                    <div className="ct-schedule-row">
                      <span className="ct-schedule-day">Domingos</span>
                      <span className="ct-schedule-hours">9:00am – 2:00pm</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón Maps */}
              <button
                className="ct-maps-btn"
                onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=10.5218901,-85.2548091', '_blank')}
              >
                🗺️ Ver ubicación en Google Maps
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}