import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

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

export function AppointmentForm() {
  const [step, setStep] = useState<'form' | 'history'>('form')
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    service_type: '',
    vehicle_type: '',
    vehicle_model: '',
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: '',
  })
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [customerHistory, setCustomerHistory] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [phoneToSearch, setPhoneToSearch] = useState('')
  const [successData, setSuccessData] = useState<{
    show: boolean
    name: string
    date: string
    time: string
    service: string
    vehicleType: string
    vehicleModel: string
  }>({ show: false, name: '', date: '', time: '', service: '', vehicleType: '', vehicleModel: '' })

  const services = [
    { value: 'basico', label: '🚗 Lavado Básico', price: '$10', duration: 30 },
    { value: 'completo', label: '✨ Lavado Completo', price: '$20', duration: 45 },
    { value: 'encerado', label: '🌟 Encerado + Lavado', price: '$35', duration: 60 },
    { value: 'tapizado', label: '🧼 Limpieza de Tapizado', price: '$25', duration: 40 },
  ]

  const vehicleTypes = [
    { value: 'carro', label: '🚗 Carro', icon: '🚗' },
    { value: 'moto', label: '🏍️ Moto', icon: '🏍️' },
    { value: 'camioneta', label: '🚐 Camioneta / SUV', icon: '🚐' },
  ]

  // Convertir hora 12h a 24h para guardar en BD
  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(' ')
    let [hours, minutes] = time.split(':')
    
    if (modifier === 'PM' && hours !== '12') {
      hours = String(parseInt(hours) + 12)
    }
    if (modifier === 'AM' && hours === '12') {
      hours = '00'
    }
    return `${hours}:${minutes}:00`
  }

  // Convertir hora 24h a 12h para mostrar
  const convertTo12Hour = (time24h: string) => {
    const [hours, minutes] = time24h.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`
  }

  // Horarios en formato 12 horas (AM/PM)
  const allTimes = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
  ]

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableTimes()
    }
  }, [selectedDate])

  const fetchAvailableTimes = async () => {
    const dateStr = selectedDate.toISOString().split('T')[0]
    
    const { data } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('appointment_date', dateStr)

    const bookedTimes24h = data?.map(a => a.appointment_time) || []
    const bookedTimes12h = bookedTimes24h.map(t => convertTo12Hour(t))
    
    const available = allTimes.filter(time => !bookedTimes12h.includes(time))
    setAvailableTimes(available)
  }

  const fetchCustomerHistory = async (phone: string) => {
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .eq('customer_phone', phone)
      .order('appointment_date', { ascending: false })
    
    setCustomerHistory(data || [])
  }

  const handleSearchHistory = () => {
    if (phoneToSearch) {
      fetchCustomerHistory(phoneToSearch)
      setShowHistory(true)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
    const formattedDate = date.toISOString().split('T')[0]
    setFormData({ ...formData, appointment_date: formattedDate, appointment_time: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!formData.appointment_date) {
      alert('Por favor selecciona una fecha')
      setLoading(false)
      return
    }

    if (!formData.appointment_time) {
      alert('Por favor selecciona una hora')
      setLoading(false)
      return
    }

    const time24h = convertTo24Hour(formData.appointment_time)
    
    const dataToSave = {
      ...formData,
      appointment_time: time24h
    }

    const { error } = await supabase.from('appointments').insert([dataToSave])

    if (error) {
      alert('Error: ' + error.message)
      setLoading(false)
    } else {
      const selectedService = services.find(s => s.value === formData.service_type)
      const selectedVehicle = vehicleTypes.find(v => v.value === formData.vehicle_type)
      
      setSuccessData({
        show: true,
        name: formData.customer_name,
        date: formData.appointment_date,
        time: formData.appointment_time,
        service: selectedService?.label || formData.service_type,
        vehicleType: selectedVehicle?.label || formData.vehicle_type,
        vehicleModel: formData.vehicle_model
      })
      
      setFormData({
        customer_name: '',
        customer_phone: '',
        service_type: '',
        vehicle_type: '',
        vehicle_model: '',
        appointment_date: new Date().toISOString().split('T')[0],
        appointment_time: '',
      })
      setSelectedDate(new Date())
      fetchAvailableTimes()
    }
    setLoading(false)
  }

  const selectedService = services.find(s => s.value === formData.service_type)

  const formatDateForDisplay = (date: string) => {
    return new Date(date).toLocaleDateString('es-CR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateSimple = (date: string) => {
    return new Date(date).toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getVehicleIcon = (type: string) => {
    const vehicle = vehicleTypes.find(v => v.value === type)
    return vehicle?.icon || '🚗'
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setStep('form')}
          className={`flex-1 py-2 rounded-lg font-semibold transition ${step === 'form' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          📅 Agendar Cita
        </button>
        <button
          onClick={() => setStep('history')}
          className={`flex-1 py-2 rounded-lg font-semibold transition ${step === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          📋 Mis Citas
        </button>
      </div>

      {/* Formulario de agendar */}
      {step === 'form' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-center mb-6">📅 Agendar Cita</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-base font-medium mb-1">Nombre completo:</label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-base font-medium mb-1">Teléfono:</label>
              <input
                type="tel"
                name="customer_phone"
                value={formData.customer_phone}
                onChange={handleChange}
                placeholder="Ej: 50612345678"
                required
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">Número para contacto del negocio</p>
            </div>

            <div>
              <label className="block text-base font-medium mb-1">Tipo de vehículo:</label>
              <select
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Selecciona el tipo</option>
                {vehicleTypes.map(v => (
                  <option key={v.value} value={v.value}>{v.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-base font-medium mb-1">Marca y modelo:</label>
              <input
                type="text"
                name="vehicle_model"
                value={formData.vehicle_model}
                onChange={handleChange}
                placeholder="Ej: Toyota Hilux, Honda CRF, Hyundai Tucson"
                required
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-base font-medium mb-1">Servicio:</label>
              <select
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Selecciona un servicio</option>
                {services.map(s => (
                  <option key={s.value} value={s.value}>{s.label} - {s.price}</option>
                ))}
              </select>
              {selectedService && (
                <p className="text-xs text-gray-500 mt-1">⏱️ Duración aproximada: {selectedService.duration} minutos</p>
              )}
            </div>

            <div>
              <label className="block text-base font-medium mb-1">Fecha:</label>
              <div className="flex justify-center">
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  minDate={new Date()}
                  className="border rounded-lg p-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-base font-medium mb-1">Hora:</label>
              <div className="grid grid-cols-3 gap-2">
                {availableTimes.map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setFormData({ ...formData, appointment_time: time })}
                    className={`p-2 rounded-lg border transition ${formData.appointment_time === time ? 'bg-blue-600 text-white' : 'bg-gray-50 hover:bg-gray-100'}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
              {availableTimes.length === 0 && (
                <p className="text-red-500 text-sm mt-2">No hay horarios disponibles para esta fecha</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !formData.appointment_time || availableTimes.length === 0}
              className="w-full bg-blue-600 text-white font-bold text-lg py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {loading ? 'Agendando...' : '📌 AGENDAR CITA'}
            </button>
          </form>
        </div>
      )}

      {/* Historial de citas */}
      {step === 'history' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-center mb-6">📋 Mis Citas</h2>
          
          <div className="flex gap-2 mb-6">
            <input
              type="tel"
              placeholder="Ingresa tu número de teléfono"
              value={phoneToSearch}
              onChange={(e) => setPhoneToSearch(e.target.value)}
              className="flex-1 p-2 border rounded-lg"
            />
            <button
              onClick={handleSearchHistory}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Buscar
            </button>
          </div>

          {showHistory && (
            <>
              {customerHistory.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No tienes citas agendadas</p>
              ) : (
                <div className="space-y-3">
                  {customerHistory.map((cita) => {
                    const service = services.find(s => s.value === cita.service_type)
                    const time12h = convertTo12Hour(cita.appointment_time)
                    return (
                      <div key={cita.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{service?.label || cita.service_type}</p>
                            <p className="text-sm text-gray-600">{getVehicleIcon(cita.vehicle_type)} {cita.vehicle_type} - {cita.vehicle_model}</p>
                            <p className="text-sm text-gray-600">📅 {formatDateForDisplay(cita.appointment_date)}</p>
                            <p className="text-sm text-gray-600">⏰ {time12h}</p>
                          </div>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Confirmada
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* MODAL DE ÉXITO */}
      {successData.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">¡Cita Agendada!</h2>
              <p className="text-gray-500 mb-6">Tu cita ha sido confirmada exitosamente</p>
            </div>
            
            <div className="border-t border-b border-gray-100 py-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">🚗 Vehículo:</span>
                <span className="font-semibold">{successData.vehicleType} {successData.vehicleModel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">📅 Fecha:</span>
                <span className="font-semibold">{formatDateSimple(successData.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">⏰ Hora:</span>
                <span className="font-semibold">{successData.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">🧼 Servicio:</span>
                <span className="font-semibold">{successData.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">📍 Ubicación:</span>
                <span className="font-semibold">Bagaces, Guanacaste</span>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400 mb-3">Guarda para recordar tu cita</p>
              <button
                onClick={() => setSuccessData({ show: false, name: '', date: '', time: '', service: '', vehicleType: '', vehicleModel: '' })}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}