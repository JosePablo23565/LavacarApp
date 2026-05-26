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
  const [formData, setFormData] = useState({
    customer_name: '',
    rating: 5,
    comment: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Cargar testimonios aprobados
  useEffect(() => {
    fetchTestimonios()
  }, [])

  const fetchTestimonios = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(10)
    
    setTestimonios(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    if (!formData.customer_name.trim()) {
      setError('Por favor ingresa tu nombre')
      setSubmitting(false)
      return
    }

    if (!formData.comment.trim()) {
      setError('Por favor escribe tu opinión')
      setSubmitting(false)
      return
    }

    const { error: supabaseError } = await supabase
      .from('testimonials')
      .insert([{
        customer_name: formData.customer_name,
        rating: formData.rating,
        comment: formData.comment,
        is_approved: false
      }])

    if (supabaseError) {
      setError('Error al enviar tu opinión. Intenta de nuevo.')
    } else {
      setSuccess('✅ ¡Gracias por tu opinión! Se publicará después de ser revisada.')
      setFormData({ customer_name: '', rating: 5, comment: '' })
      setTimeout(() => setSuccess(''), 4000)
    }
    setSubmitting(false)
  }

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : 'button'}
            onClick={() => interactive && setFormData({ ...formData, rating: star })}
            className={`text-2xl ${interactive ? 'cursor-pointer' : 'cursor-default'} ${
              star <= rating ? 'text-yellow-500' : 'text-gray-300'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    )
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Título */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">⭐ Opiniones de Clientes</h1>
        <p className="text-gray-500 mt-2">Lo que dicen quienes ya confiaron en nosotros</p>
      </div>

      {/* Formulario para dejar opinión */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-center mb-4">📝 Deja tu opinión</h2>
        
        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-center">
            {success}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tu nombre *</label>
            <input
              type="text"
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: María González"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tu calificación *</label>
            {renderStars(formData.rating, true)}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tu comentario *</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Cuéntanos tu experiencia..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 font-semibold"
          >
            {submitting ? 'Enviando...' : '📝 Enviar Opinión'}
          </button>
        </form>
      </div>

      {/* Lista de testimonios aprobados */}
      <div>
        <h2 className="text-xl font-bold text-center mb-6">⭐ Lo que dicen nuestros clientes</h2>
        
        {loading ? (
          <div className="text-center py-8 text-gray-500">Cargando opiniones...</div>
        ) : testimonios.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-2xl mb-2">📭</p>
            <p>Todavía no hay opiniones. ¡Sé el primero en dejar la tuya!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonios.map((testimonio) => (
              <div key={testimonio.id} className="bg-white rounded-xl shadow-md p-5 border-l-4 border-yellow-500">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-lg">{testimonio.customer_name}</p>
                    <p className="text-xs text-gray-400">{formatDate(testimonio.created_at)}</p>
                  </div>
                  <div>{renderStars(testimonio.rating, false)}</div>
                </div>
                <p className="text-gray-600 mt-2 italic">"{testimonio.comment}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}