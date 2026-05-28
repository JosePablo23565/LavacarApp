import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function AuthCallback() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🔄 AuthCallback: Iniciando...')
        
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          console.log('❌ No hay sesión, redirigiendo a /acceder')
          navigate('/acceder')
          return
        }

        const userId = session.user.id
        const userEmail = session.user.email || ''
        const userNombre = session.user.user_metadata?.nombre || 
                          session.user.user_metadata?.full_name || 
                          session.user.email?.split('@')[0] || ''

        console.log('✅ Usuario autenticado:', { userId, userEmail, userNombre })

        // Verificar si ya existe un perfil
        const { data: perfil, error } = await supabase
          .from('perfiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle()

        console.log('📝 Perfil encontrado:', perfil)

        // Si no existe perfil, crearlo
        if (!perfil) {
          console.log('🆕 Creando nuevo perfil...')
          const { error: insertError } = await supabase
            .from('perfiles')
            .insert([
              { 
                id: userId, 
                nombre: userNombre, 
                telefono: '', 
                email: userEmail 
              }
            ])
          
          if (insertError) {
            console.error('❌ Error al crear perfil:', insertError)
            navigate('/acceder')
            return
          }
          
          console.log('✅ Perfil creado, redirigiendo a /completar-perfil')
          navigate('/completar-perfil')
          return
        }

        // Si el perfil existe pero falta el teléfono, redirigir a completar
        if (!perfil.telefono || perfil.telefono === '') {
          console.log('📞 Teléfono faltante, redirigiendo a /completar-perfil')
          navigate('/completar-perfil')
          return
        }

        // Si todo está completo, ir al home
        console.log('🏠 Perfil completo, redirigiendo al home')
        navigate('/')
      } catch (err) {
        console.error('❌ Error en callback:', err)
        navigate('/acceder')
      } finally {
        setLoading(false)
      }
    }

    handleCallback()
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1e3a] to-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-[#0eb8d0]/30 border-t-[#0eb8d0] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Completando autenticación...</p>
        </div>
      </div>
    )
  }

  return null
}