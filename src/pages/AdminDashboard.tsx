import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

type Appointment = {
  id: number
  customer_name: string
  customer_phone: string
  service_type: string
  vehicle_type: string
  vehicle_model: string
  appointment_date: string
  appointment_time: string
  created_at: string
}

type Testimonial = {
  id: number
  customer_name: string
  rating: number
  comment: string
  created_at: string
  is_approved: boolean
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'citas' | 'testimonios'>('citas')
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [stats, setStats] = useState({ total: 0, hoy: 0, proximas: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    checkUser()
    fetchAppointments()
    fetchTestimonials()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      navigate('/login')
    }
  }

  const fetchAppointments = async () => {
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true })
    
    const citas = data || []
    setAppointments(citas)
    
    const hoy = new Date().toISOString().split('T')[0]
    const ahora = new Date()
    const horaActual = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}:00`
    
    const proximas = citas.filter(c => {
      if (c.appointment_date > hoy) return true
      if (c.appointment_date === hoy && c.appointment_time >= horaActual) return true
      return false
    })
    
    setStats({
      total: citas.length,
      hoy: citas.filter(c => c.appointment_date === hoy).length,
      proximas: proximas.length
    })
    setLoading(false)
  }

  const fetchTestimonials = async () => {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
    
    setTestimonials(data || [])
  }

  const deleteAppointment = async (id: number) => {
    if (confirm('¿Eliminar esta cita?')) {
      await supabase.from('appointments').delete().eq('id', id)
      fetchAppointments()
    }
  }

  const approveTestimonial = async (id: number) => {
    await supabase
      .from('testimonials')
      .update({ is_approved: true })
      .eq('id', id)
    fetchTestimonials()
  }

  const deleteTestimonial = async (id: number) => {
    if (confirm('¿Eliminar esta opinión?')) {
      await supabase.from('testimonials').delete().eq('id', id)
      fetchTestimonials()
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const getServiceLabel = (type: string) => {
    const services: Record<string, string> = {
      basico: '🚗 Lavado Básico',
      completo: '✨ Lavado Completo',
      encerado: '🌟 Encerado',
      tapizado: '🧼 Tapizado'
    }
    return services[type] || type
  }

  const getVehicleLabel = (type: string) => {
    const vehicles: Record<string, string> = {
      carro: '🚗 Carro',
      moto: '🏍️ Moto',
      camioneta: '🚐 Camioneta'
    }
    return vehicles[type] || type || '—'
  }

  const convertTo12Hour = (time24h: string) => {
    if (!time24h) return '—'
    const [hours, minutes] = time24h.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  const formatDateDisplay = (date: string) => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('es-CR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatDateLong = (date: string) => {
    return new Date(date).toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const filteredAppointments = appointments.filter(a =>
    a.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    a.customer_phone.includes(search) ||
    a.vehicle_model?.toLowerCase().includes(search.toLowerCase())
  )

  const pendingTestimonials = testimonials.filter(t => !t.is_approved)
  const approvedTestimonials = testimonials.filter(t => t.is_approved)

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-xl text-gray-600">Cargando...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* CABECERA */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">📋 Panel de Administración</h1>
            <button 
              onClick={handleLogout} 
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            >
              🔒 Cerrar Sesión
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('citas')}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${activeTab === 'citas' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            📅 Citas ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab('testimonios')}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${activeTab === 'testimonios' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            ⭐ Opiniones {pendingTestimonials.length > 0 && `(${pendingTestimonials.length} pendientes)`}
          </button>
        </div>

        {/* CONTENIDO DE CITAS */}
        {activeTab === 'citas' && (
          <>
            {/* ESTADÍSTICAS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
                <p className="text-3xl font-bold">{stats.total}</p>
                <p className="text-sm opacity-90">📊 Total Citas</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
                <p className="text-3xl font-bold">{stats.hoy}</p>
                <p className="text-sm opacity-90">📅 Citas Hoy</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
                <p className="text-3xl font-bold">{stats.proximas}</p>
                <p className="text-sm opacity-90">⏳ Próximas Citas</p>
              </div>
            </div>

            {/* BUSCADOR */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">🔍</div>
                <input
                  type="text"
                  placeholder="Buscar por nombre, teléfono o vehículo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* TABLA DE CITAS */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                    <tr>
                      <th className="p-3 text-left">👤 Cliente</th>
                      <th className="p-3 text-left">📞 Teléfono</th>
                      <th className="p-3 text-left">🚗 Vehículo</th>
                      <th className="p-3 text-left">🔧 Modelo</th>
                      <th className="p-3 text-left">🛠️ Servicio</th>
                      <th className="p-3 text-left">📅 Fecha</th>
                      <th className="p-3 text-left">⏰ Hora</th>
                      <th className="p-3 text-center">⚙️ Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center p-8 text-gray-500">No hay citas registradas</td>
                      </tr>
                    ) : (
                      filteredAppointments.map((apt, index) => (
                        <tr key={apt.id} className={`border-b hover:bg-gray-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="p-3 font-medium">{apt.customer_name}</td>
                          <td className="p-3">{apt.customer_phone}</td>
                          <td className="p-3">{getVehicleLabel(apt.vehicle_type)}</td>
                          <td className="p-3">{apt.vehicle_model || '—'}</td>
                          <td className="p-3">{getServiceLabel(apt.service_type)}</td>
                          <td className="p-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                              {formatDateDisplay(apt.appointment_date)}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                              {convertTo12Hour(apt.appointment_time)}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => deleteAppointment(apt.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-sm"
                              >
                                Eliminar
                              </button>
                              <a
                                href={`https://wa.me/${apt.customer_phone}?text=Hola%20${apt.customer_name}%2C%20tu%20cita%20del%20${formatDateDisplay(apt.appointment_date)}%20a%20las%20${convertTo12Hour(apt.appointment_time)}%20está%20confirmada.%20🚗%20${getVehicleLabel(apt.vehicle_type)}%20${apt.vehicle_model || ''}`}
                                target="_blank"
                                className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 text-sm"
                              >
                                WhatsApp
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* CONTENIDO DE TESTIMONIOS */}
        {activeTab === 'testimonios' && (
          <div className="space-y-6">
            {/* Pendientes */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 text-orange-600">⏳ Opiniones Pendientes ({pendingTestimonials.length})</h2>
              {pendingTestimonials.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay opiniones pendientes de aprobación</p>
              ) : (
                <div className="space-y-4">
                  {pendingTestimonials.map((t) => (
                    <div key={t.id} className="border rounded-lg p-4 bg-orange-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{t.customer_name}</p>
                          <div className="flex text-yellow-500 text-sm my-1">
                            {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                          </div>
                          <p className="text-gray-600 italic">"{t.comment}"</p>
                          <p className="text-xs text-gray-400 mt-1">{formatDateLong(t.created_at)}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => approveTestimonial(t.id)}
                            className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 text-sm"
                          >
                            ✅ Aprobar
                          </button>
                          <button
                            onClick={() => deleteTestimonial(t.id)}
                            className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 text-sm"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Aprobados */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 text-green-600">✅ Opiniones Aprobadas ({approvedTestimonials.length})</h2>
              {approvedTestimonials.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay opiniones aprobadas aún</p>
              ) : (
                <div className="space-y-4">
                  {approvedTestimonials.map((t) => (
                    <div key={t.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{t.customer_name}</p>
                          <div className="flex text-yellow-500 text-sm my-1">
                            {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                          </div>
                          <p className="text-gray-600 italic">"{t.comment}"</p>
                          <p className="text-xs text-gray-400 mt-1">{formatDateLong(t.created_at)}</p>
                        </div>
                        <button
                          onClick={() => deleteTestimonial(t.id)}
                          className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 text-sm"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}