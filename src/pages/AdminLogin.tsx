import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('❌ Credenciales incorrectas')
    } else {
      navigate('/admin')
    }
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap');
        
        .login-root {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0e1a 0%, #0f1e3a 60%, #0a0e1a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }
        
        /* Burbujas decorativas */
        .login-root::before {
          content: '';
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(14,184,208,0.1) 0%, transparent 70%);
          border-radius: 50%;
          top: -150px;
          right: -150px;
        }
        
        .login-root::after {
          content: '';
          position: absolute;
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, rgba(26,111,212,0.08) 0%, transparent 70%);
          border-radius: 50%;
          bottom: -100px;
          left: -100px;
        }
        
        .login-card {
          background: rgba(17, 24, 39, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 28px;
          padding: 2.5rem;
          width: 100%;
          max-width: 420px;
          position: relative;
          z-index: 10;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          transition: transform 0.3s ease;
        }
        
        .login-card:hover {
          transform: translateY(-5px);
        }
        
        /* Botón de regreso */
        .back-btn {
          position: fixed;
          top: 2rem;
          left: 2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(17, 24, 39, 0.8);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 40px;
          padding: 0.6rem 1.2rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 20;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
        }
        
        .back-btn:hover {
          background: rgba(26, 111, 212, 0.3);
          border-color: rgba(14, 184, 208, 0.4);
          color: #fff;
          transform: translateX(-3px);
        }
        
        .login-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #1a6fd4, #0eb8d0);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          box-shadow: 0 8px 20px rgba(14, 184, 208, 0.3);
        }
        
        .login-title {
          font-family: 'Sora', sans-serif;
          font-size: 1.8rem;
          font-weight: 700;
          text-align: center;
          color: #fff;
          margin-bottom: 0.5rem;
        }
        
        .login-sub {
          text-align: center;
          color: rgba(255, 255, 255, 0.45);
          font-size: 0.85rem;
          margin-bottom: 2rem;
        }
        
        .input-group {
          margin-bottom: 1.25rem;
        }
        
        .input-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 0.5rem;
          letter-spacing: 0.05em;
        }
        
        .input-field {
          width: 100%;
          padding: 0.85rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          color: #fff;
          font-size: 0.9rem;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s ease;
          outline: none;
        }
        
        .input-field:focus {
          border-color: #0eb8d0;
          background: rgba(14, 184, 208, 0.08);
          box-shadow: 0 0 0 3px rgba(14, 184, 208, 0.15);
        }
        
        .input-field::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
        
        .login-btn {
          width: 100%;
          padding: 0.9rem;
          background: linear-gradient(135deg, #1a6fd4, #0eb8d0);
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 0.95rem;
          font-weight: 600;
          font-family: 'Sora', sans-serif;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 0.5rem;
          box-shadow: 0 4px 15px rgba(14, 184, 208, 0.3);
        }
        
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(14, 184, 208, 0.4);
        }
        
        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          padding: 0.75rem;
          border-radius: 12px;
          font-size: 0.85rem;
          text-align: center;
          margin-bottom: 1rem;
        }
        
        /* Carro decorativo flotante */
        .login-car {
          position: absolute;
          bottom: 20px;
          right: 20px;
          font-size: 80px;
          opacity: 0.06;
          pointer-events: none;
          animation: floatCar 6s ease-in-out infinite;
        }
        
        @keyframes floatCar {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        
        @media (max-width: 480px) {
          .login-card {
            padding: 1.8rem;
          }
          .back-btn {
            top: 1rem;
            left: 1rem;
            padding: 0.5rem 1rem;
            font-size: 0.75rem;
          }
          .login-title {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="login-root">
        {/* Botón de regresar */}
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Volver al inicio
        </button>
        
        {/* Carro decorativo */}
        <div className="login-car">🚗</div>

        <div className="login-card">
          <div className="login-icon">
            <span style={{ fontSize: '2rem' }}>🔐</span>
          </div>
          
          <h1 className="login-title">Panel Admin</h1>
          <p className="login-sub">Acceso exclusivo para administradores</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label className="input-label">CORREO ELECTRÓNICO</label>
              <input
                type="email"
                placeholder="admin@lavacar.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">CONTRASEÑA</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="login-btn"
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Ingresando...
                </span>
              ) : '🔐 Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}