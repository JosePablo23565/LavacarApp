import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function ClienteLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError('❌ Correo o contraseña incorrectos')
    } else {
      navigate('/')
    }
    setLoading(false)
  }

  return (
    <div className="login-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .login-page {
          min-height: 100vh;
          width: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          overflow: hidden;
        }

        /* FONDO CON TU IMAGEN */
        .login-page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('/fondo-login.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 0;
        }

        /* CAPA OSCURA SUTIL */
        .login-page::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.35);
          z-index: 0;
        }

        /* TARJETA LIQUID GLASS - MÁS SUAVE Y TRANSPARENTE */
        .liquid-glass-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 340px;
          margin: 1.5rem;
          padding: 1.6rem 1.4rem;
          
          /* EFECTO LIQUID GLASS MÁS SUAVE */
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(10px);
          border-radius: 28px;
          
          /* BORDE SUTIL */
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 
            0 8px 32px 0 rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
          
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .liquid-glass-card:hover {
          transform: translateY(-3px);
          border-color: rgba(14, 184, 208, 0.3);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
        }

        /* Logo más pequeño */
        .login-logo {
          text-align: center;
          margin-bottom: 0.8rem;
        }

        .login-logo span {
          font-size: 2.5rem;
          display: inline-block;
        }

        .login-title {
          font-size: 1.4rem;
          font-weight: 600;
          text-align: center;
          color: #fff;
          margin-bottom: 0.2rem;
          letter-spacing: -0.3px;
        }

        .login-subtitle {
          text-align: center;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.7rem;
          margin-bottom: 1.2rem;
        }

        /* Inputs compactos */
        .input-group {
          margin-bottom: 0.9rem;
        }

        .input-group label {
          display: block;
          font-size: 0.7rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 0.3rem;
          letter-spacing: 0.3px;
        }

        .input-field {
          width: 100%;
          padding: 0.6rem 0.9rem;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 14px;
          color: #fff;
          font-size: 0.85rem;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s ease;
          outline: none;
        }

        .input-field:focus {
          border-color: #0eb8d0;
          background: rgba(14, 184, 208, 0.12);
          box-shadow: 0 0 0 2px rgba(14, 184, 208, 0.15);
        }

        .input-field::placeholder {
          color: rgba(255, 255, 255, 0.3);
          font-size: 0.8rem;
        }

        /* Enlace olvidaste contraseña */
        .forgot-link {
          display: block;
          text-align: right;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          margin-bottom: 1rem;
          transition: color 0.2s;
        }

        .forgot-link:hover {
          color: #0eb8d0;
        }

        /* Botón login compacto */
        .login-btn {
          width: 100%;
          padding: 0.7rem;
          background: linear-gradient(135deg, #1a6fd4, #0eb8d0);
          color: #fff;
          border: none;
          border-radius: 40px;
          font-size: 0.85rem;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 1rem;
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(14, 184, 208, 0.35);
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Separador */
        .divider {
          display: flex;
          align-items: center;
          margin: 0.8rem 0;
          color: rgba(255, 255, 255, 0.35);
          font-size: 0.7rem;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.12);
        }

        .divider span {
          padding: 0 0.8rem;
        }

        /* Botón Google */
        .google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 40px;
          padding: 0.6rem;
          cursor: pointer;
          transition: all 0.3s ease;
          color: rgba(255, 255, 255, 0.85);
          font-size: 0.8rem;
          font-weight: 500;
        }

        .google-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(14, 184, 208, 0.4);
        }

        /* Enlace registro */
        .register-link {
          text-align: center;
          margin-top: 1rem;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.55);
        }

        .register-link a {
          color: #0eb8d0;
          text-decoration: none;
          font-weight: 500;
        }

        .register-link a:hover {
          text-decoration: underline;
        }

        /* Error */
        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
          padding: 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          text-align: center;
          margin-bottom: 1rem;
        }

        /* Spinner */
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive móvil */
        @media (max-width: 480px) {
          .liquid-glass-card {
            max-width: 300px;
            padding: 1.4rem 1.2rem;
            margin: 1rem;
          }
          .login-title {
            font-size: 1.2rem;
          }
          .login-logo span {
            font-size: 2.2rem;
          }
          .input-field {
            padding: 0.55rem 0.8rem;
            font-size: 0.8rem;
          }
          .login-btn {
            padding: 0.6rem;
            font-size: 0.8rem;
          }
        }
      `}</style>

      <div className="liquid-glass-card">
        <h1 className="login-title">Bienvenido</h1>
        <p className="login-subtitle">Acceso para clientes registrados</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Correo electrónico</label>
            <input
              type="gmail"
              placeholder="cliente@gmail.com"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <a href="#" className="forgot-link">¿Olvidaste tu contraseña?</a>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <div className="spinner" /> : 'Iniciar Sesión'}
          </button>

          <div className="divider">
            <span>o</span>
          </div>

          <button type="button" className="google-btn" onClick={() => console.log('Google login')}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuar con Google
          </button>

          <div className="register-link">
            ¿No tienes una cuenta? <Link to="/registro">Registrarse</Link>
          </div>
        </form>
      </div>
    </div>
  )
}