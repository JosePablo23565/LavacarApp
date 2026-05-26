import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

type Testimonial = {
  id: number
  customer_name: string
  rating: number
  comment: string
  created_at: string
  is_approved: boolean
}

export function Opiniones() {
  const [testimonios, setTestimonios] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ customer_name: '', rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => { fetchTestimonios() }, [])

  const fetchTestimonios = async () => {
    setLoading(true)
    const { data } = await supabase.from('testimonials').select('*').eq('is_approved', true).order('created_at', { ascending: false }).limit(10)
    setTestimonios(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')
    if (!formData.customer_name.trim()) { setError('Por favor ingresá tu nombre'); setSubmitting(false); return }
    if (!formData.comment.trim()) { setError('Por favor escribí tu opinión'); setSubmitting(false); return }
    const { error: err } = await supabase.from('testimonials').insert([{ ...formData, is_approved: false }])
    if (err) { setError('Error al enviar tu opinión. Intentá de nuevo.') }
    else {
      setSuccess('¡Gracias! Tu opinión se publicará después de ser revisada.')
      setFormData({ customer_name: '', rating: 5, comment: '' })
      setTimeout(() => setSuccess(''), 5000)
    }
    setSubmitting(false)
  }

  const Stars = ({ rating, interactive = false }: { rating: number; interactive?: boolean }) => (
    <div style={{ display: 'flex', gap: '.2rem' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} onClick={() => interactive && setFormData({ ...formData, rating: s })} style={{ fontSize: '1.4rem', color: s <= rating ? '#f59e0b' : 'rgba(255,255,255,.15)', cursor: interactive ? 'pointer' : 'default', transition: 'color .15s' }}>★</span>
      ))}
    </div>
  )

  const formatDate = (d: string) => new Date(d).toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric' })

  const initials = (name: string) => name.trim().split(' ').slice(0, 2).map((n) => n[0].toUpperCase()).join('')

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600&family=DM+Sans:wght@400;500&display=swap');
        .op-root{min-height:100vh;background:linear-gradient(135deg,#0a0e1a 0%,#0f1e3a 60%,#0a0e1a 100%);padding:3rem 1.5rem;font-family:'DM Sans',sans-serif;color:#fff;}
        .op-inner{max-width:900px;margin:0 auto;}
        .op-header{text-align:center;margin-bottom:3rem;}
        .op-title{font-family:'Sora',sans-serif;font-size:2rem;font-weight:600;margin-bottom:.5rem;}
        .op-sub{color:rgba(255,255,255,.45);font-size:.95rem;}
        .op-form-card{background:#111827;border:1px solid rgba(255,255,255,.08);border-radius:20px;overflow:hidden;margin-bottom:3rem;}
        .op-form-header{background:linear-gradient(135deg,#1a6fd4,#0eb8d0);padding:1.25rem 2rem;text-align:center;}
        .op-form-header h2{font-family:'Sora',sans-serif;font-size:1.2rem;font-weight:600;color:#fff;margin-bottom:.2rem;}
        .op-form-header p{font-size:.8rem;color:rgba(255,255,255,.75);}
        .op-form-body{padding:1.75rem 2rem;}
        .op-label{display:block;font-size:.8rem;font-weight:500;color:rgba(255,255,255,.5);margin-bottom:.5rem;letter-spacing:.04em;}
        .op-input{width:100%;padding:.75rem 1rem;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#fff;font-size:.92rem;font-family:inherit;outline:none;transition:border-color .2s;}
        .op-input:focus{border-color:#1a6fd4;background:rgba(26,111,212,.08);}
        .op-field{margin-bottom:1.25rem;}
        .op-alert{padding:.8rem 1rem;border-radius:10px;font-size:.85rem;margin-bottom:1rem;text-align:center;}
        .op-alert.success{background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.2);color:#34d399;}
        .op-alert.error{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);color:#f87171;}
        .op-submit{width:100%;padding:.9rem;background:linear-gradient(135deg,#1a6fd4,#0eb8d0);color:#fff;border:none;border-radius:12px;font-size:.95rem;font-weight:600;font-family:'Sora',sans-serif;cursor:pointer;transition:all .25s;margin-top:.5rem;}
        .op-submit:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 24px rgba(26,111,212,.35);}
        .op-submit:disabled{opacity:.5;cursor:not-allowed;}
        .op-section-title{font-family:'Sora',sans-serif;font-size:1.4rem;font-weight:600;text-align:center;margin-bottom:1.75rem;}
        .op-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.25rem;}
        .op-review{background:#111827;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:1.75rem;transition:border-color .3s;}
        .op-review:hover{border-color:rgba(14,184,208,.25);}
        .op-review-text{font-size:.88rem;color:rgba(255,255,255,.6);line-height:1.75;margin:1rem 0 1.25rem;font-style:italic;}
        .op-reviewer{display:flex;align-items:center;gap:.75rem;}
        .op-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#1a6fd4,#0eb8d0);display:flex;align-items:center;justify-content:center;font-size:.82rem;font-weight:600;flex-shrink:0;}
        .op-rev-name{font-size:.88rem;font-weight:500;}
        .op-rev-date{font-size:.75rem;color:rgba(255,255,255,.35);}
        .op-empty{text-align:center;padding:4rem 0;color:rgba(255,255,255,.4);}
        .op-empty span{font-size:3rem;display:block;margin-bottom:1rem;}
        @media(max-width:480px){.op-form-body{padding:1.25rem;}}
      `}</style>

      <div className="op-root">
        <div className="op-inner">
          <div className="op-header">
            <h1 className="op-title">⭐ Opiniones de Clientes</h1>
            <p className="op-sub">Lo que dicen quienes ya confiaron en nosotros</p>
          </div>

          {/* FORMULARIO */}
          <div className="op-form-card">
            <div className="op-form-header">
              <h2>📝 Dejá tu opinión</h2>
              <p>Tu experiencia ayuda a otros clientes</p>
            </div>
            <div className="op-form-body">
              {success && <div className="op-alert success">✅ {success}</div>}
              {error && <div className="op-alert error">⚠️ {error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="op-field">
                  <label className="op-label">TU NOMBRE *</label>
                  <input className="op-input" type="text" value={formData.customer_name} onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })} placeholder="Ej: María González" required />
                </div>
                <div className="op-field">
                  <label className="op-label">TU CALIFICACIÓN *</label>
                  <Stars rating={formData.rating} interactive />
                </div>
                <div className="op-field">
                  <label className="op-label">TU COMENTARIO *</label>
                  <textarea className="op-input" value={formData.comment} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} rows={4} placeholder="Contanos tu experiencia..." required style={{ resize: 'none' }} />
                </div>
                <button type="submit" className="op-submit" disabled={submitting}>
                  {submitting ? 'Enviando...' : '📝 Enviar Opinión'}
                </button>
              </form>
            </div>
          </div>

          {/* LISTA */}
          <h2 className="op-section-title">⭐ Lo que dicen nuestros clientes</h2>

          {loading ? (
            <div className="op-empty"><span>⏳</span>Cargando opiniones...</div>
          ) : testimonios.length === 0 ? (
            <div className="op-empty"><span>📭</span>Todavía no hay opiniones. ¡Sé el primero!</div>
          ) : (
            <div className="op-grid">
              {testimonios.map((t) => (
                <div key={t.id} className="op-review">
                  <Stars rating={t.rating} />
                  <p className="op-review-text">"{t.comment}"</p>
                  <div className="op-reviewer">
                    <div className="op-avatar">{initials(t.customer_name)}</div>
                    <div>
                      <div className="op-rev-name">{t.customer_name}</div>
                      <div className="op-rev-date">{formatDate(t.created_at)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}