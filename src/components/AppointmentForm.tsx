import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
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
  const location = useLocation()
  const [step, setStep] = useState<'form' | 'history'>('form')
  const [animating, setAnimating] = useState(false)
  const [menuAbiertoGlobal, setMenuAbiertoGlobal] = useState(false)
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
    show: boolean; name: string; date: string; time: string; service: string; vehicleType: string; vehicleModel: string
  }>({ show: false, name: '', date: '', time: '', service: '', vehicleType: '', vehicleModel: '' })

  const services = [
    { value: 'basico', label: '🚿 Lavado Básico', price: '$10', duration: 30 },
    { value: 'completo', label: '✨ Lavado Completo', price: '$20', duration: 45 },
    { value: 'encerado', label: '🌟 Encerado + Lavado', price: '$35', duration: 60 },
    { value: 'tapizado', label: '🧼 Limpieza de Tapizado', price: '$25', duration: 40 },
  ]

  const vehicleTypes = [
    { value: 'carro', label: '🚗 Carro', icon: '🚗' },
    { value: 'moto', label: '🏍️ Moto', icon: '🏍️' },
    { value: 'camioneta', label: '🚐 Camioneta / SUV', icon: '🚐' },
  ]

  const allTimes = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM',
  ]

  // Leer el parámetro 'servicio' de la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const servicio = params.get('servicio')
    if (servicio && ['basico', 'completo', 'encerado', 'tapizado'].includes(servicio)) {
      setFormData(prev => ({ ...prev, service_type: servicio }))
    }
  }, [location])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tab = params.get('tab')
    if (tab === 'history') {
      setStep('history')
    }
  }, [location])

  // Escuchar si el menú hamburguesa está abierto
  useEffect(() => {
    const handleMenuChange = () => {
      const overlay = document.querySelector('.menu-overlay')
      setMenuAbiertoGlobal(!!overlay && window.getComputedStyle(overlay).opacity !== '0')
    }
    
    const observer = new MutationObserver(handleMenuChange)
    observer.observe(document.body, { attributes: true, childList: true, subtree: true })
    
    const interval = setInterval(handleMenuChange, 500)
    
    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [])

  const handleStepChange = (newStep: 'form' | 'history') => {
    if (newStep === step) return
    setAnimating(true)
    setTimeout(() => { setStep(newStep); setTimeout(() => setAnimating(false), 100) }, 200)
  }

  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(' ')
    let [hours, minutes] = time.split(':')
    if (modifier === 'PM' && hours !== '12') hours = String(parseInt(hours) + 12)
    if (modifier === 'AM' && hours === '12') hours = '00'
    return `${hours}:${minutes}:00`
  }

  const convertTo12Hour = (time24h: string) => {
    const [hours, minutes] = time24h.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`
  }

  useEffect(() => { if (selectedDate) fetchAvailableTimes() }, [selectedDate])

  const fetchAvailableTimes = async () => {
    const dateStr = selectedDate.toISOString().split('T')[0]
    const { data } = await supabase.from('appointments').select('appointment_time').eq('appointment_date', dateStr)
    const bookedTimes12h = (data?.map((a) => a.appointment_time) || []).map((t) => convertTo12Hour(t))
    setAvailableTimes(allTimes.filter((time) => !bookedTimes12h.includes(time)))
  }

  const fetchCustomerHistory = async (phone: string) => {
    const { data } = await supabase.from('appointments').select('*').eq('customer_phone', phone).order('appointment_date', { ascending: false })
    setCustomerHistory(data || [])
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
    setFormData({ ...formData, appointment_date: date.toISOString().split('T')[0], appointment_time: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.appointment_time) { alert('Por favor seleccioná una hora'); return }
    setLoading(true)
    const { error } = await supabase.from('appointments').insert([{ ...formData, appointment_time: convertTo24Hour(formData.appointment_time) }])
    if (error) {
      alert('Error: ' + error.message)
    } else {
      const svc = services.find((s) => s.value === formData.service_type)
      const veh = vehicleTypes.find((v) => v.value === formData.vehicle_type)
      setSuccessData({ show: true, name: formData.customer_name, date: formData.appointment_date, time: formData.appointment_time, service: svc?.label || formData.service_type, vehicleType: veh?.label || formData.vehicle_type, vehicleModel: formData.vehicle_model })
      setFormData({ customer_name: '', customer_phone: '', service_type: '', vehicle_type: '', vehicle_model: '', appointment_date: new Date().toISOString().split('T')[0], appointment_time: '' })
      setSelectedDate(new Date())
      fetchAvailableTimes()
      setTimeout(() => setSuccessData({ show: false, name: '', date: '', time: '', service: '', vehicleType: '', vehicleModel: '' }), 6000)
    }
    setLoading(false)
  }

  const selectedService = services.find((s) => s.value === formData.service_type)

  const formatDateDisplay = (date: string) => new Date(date).toLocaleDateString('es-CR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const formatDateSimple = (date: string) => new Date(date).toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric' })
  const getVehicleIcon = (type: string) => vehicleTypes.find((v) => v.value === type)?.icon || '🚗'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600&family=DM+Sans:wght@400;500&display=swap');
        .af-root{min-height:100vh;background:linear-gradient(135deg,#0a0e1a 0%,#0f1e3a 60%,#0a0e1a 100%);padding:2rem 1rem 4rem;font-family:'DM Sans',sans-serif;}
        
        /* TABS STICKY - SE QUEDAN FIJOS AL HACER SCROLL */
        .af-tabs{
          display:flex;
          gap:.75rem;
          margin-bottom:2rem;
          background:rgba(255,255,255,.04);
          backdrop-filter:blur(12px);
          border-radius:16px;
          padding:.5rem;
          border:1px solid rgba(255,255,255,.07);
          position:sticky;
          top:70px;
          transition:all 0.3s ease;
          z-index:30;
        }
        
        /* Cuando el menú está abierto, los tabs se ocultan */
        .af-tabs.menu-abierto {
          z-index: 1;
          opacity: 0.3;
          pointer-events: none;
        }
        
        /* Sombra cuando está pegado */
        .af-tabs.sticky-shadow {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          background: rgba(10, 14, 26, 0.95);
        }
        
        .af-tab{flex:1;padding:.75rem;border-radius:12px;font-weight:500;font-size:.95rem;cursor:pointer;border:none;transition:all .3s;font-family:inherit;}
        .af-tab.active{background:linear-gradient(135deg,#1a6fd4,#0eb8d0);color:#fff;transform:scale(1.02);}
        .af-tab:not(.active){background:transparent;color:rgba(255,255,255,.6);}
        .af-tab:not(.active):hover{background:rgba(255,255,255,.06);color:#fff;}
        .af-card{background:#111827;border:1px solid rgba(255,255,255,.08);border-radius:24px;overflow:hidden;max-width:680px;margin:0 auto;position:relative;z-index:10;}
        .af-card-header{background:linear-gradient(135deg,#1a6fd4,#0eb8d0);padding:1.75rem 2rem;text-align:center;}
        .af-card-header h2{font-family:'Sora',sans-serif;font-size:1.4rem;font-weight:600;color:#fff;margin-bottom:.3rem;}
        .af-card-header p{font-size:.85rem;color:rgba(255,255,255,.75);}
        .af-body{padding:1.75rem 2rem;}
        .af-label{display:block;font-size:.82rem;font-weight:500;color:rgba(255,255,255,.6);margin-bottom:.5rem;letter-spacing:.03em;}
        .af-input{width:100%;padding:.75rem 1rem;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#fff;font-size:.92rem;font-family:inherit;transition:all .2s ease;outline:none;}
        .af-input:focus{border-color:#1a6fd4;background:rgba(26,111,212,.08);transform:scale(1.01);}
        .af-input option{background:#1a2035;color:#fff;}
        .af-field{margin-bottom:1.25rem;}
        .af-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;}
        .af-hint{font-size:.75rem;color:rgba(255,255,255,.3);margin-top:.4rem;}
        .af-time-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.6rem;}
        .af-time-btn{padding:.6rem;border-radius:10px;font-size:.82rem;font-weight:500;cursor:pointer;border:1px solid rgba(255,255,255,.1);transition:all .2s;font-family:inherit;background:rgba(255,255,255,.04);color:rgba(255,255,255,.7);}
        .af-time-btn.sel{background:linear-gradient(135deg,#1a6fd4,#0eb8d0);border-color:transparent;color:#fff;transform:scale(1.04);}
        .af-time-btn:not(.sel):hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.2);color:#fff;}
        .af-submit{width:100%;padding:1rem;background:linear-gradient(135deg,#1a6fd4,#0eb8d0);color:#fff;border:none;border-radius:12px;font-size:1rem;font-weight:600;font-family:'Sora',sans-serif;cursor:pointer;transition:all .25s;margin-top:1.5rem;}
        .af-submit:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 24px rgba(26,111,212,.4);}
        .af-submit:disabled{opacity:.5;cursor:not-allowed;}
        .af-section-label{font-family:'Sora',sans-serif;font-size:.82rem;font-weight:600;color:rgba(255,255,255,.5);letter-spacing:.08em;margin-bottom:.75rem;margin-top:1.5rem;display:block;}

        /* Efecto burbuja para selects */
        select.af-input {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%230eb8d0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 14px;
        }

        select.af-input:active {
          animation: bounceSelect 0.3s ease;
        }

        @keyframes bounceSelect {
          0% { transform: scale(1); }
          40% { transform: scale(1.02); }
          60% { transform: scale(0.99); }
          100% { transform: scale(1); }
        }

        /* Efecto hover para el botón Buscar */
        .af-buscar-btn {
          background: linear-gradient(135deg, #1a6fd4, #0eb8d0) !important;
          color: #fff !important;
          border: none !important;
          padding: 0.75rem 1.25rem !important;
          border-radius: 10px !important;
          cursor: pointer !important;
          font-weight: 500 !important;
          font-family: 'DM Sans', sans-serif !important;
          white-space: nowrap !important;
          transition: all 0.25s ease !important;
          box-shadow: 0 0 0 rgba(26, 111, 212, 0) !important;
        }

        .af-buscar-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 24px rgba(26, 111, 212, 0.5) !important;
        }

        .af-buscar-btn:active {
          transform: translateY(0) !important;
        }

        /* Custom Calendar - Dark & Modern */
        .custom-calendar {
          background: linear-gradient(135deg, #0f1628 0%, #0a0e1a 100%) !important;
          border: 1px solid rgba(26, 111, 212, 0.3) !important;
          border-radius: 20px !important;
          padding: 1rem !important;
          width: 100% !important;
          max-width: 380px !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
          font-family: 'DM Sans', sans-serif !important;
        }

        .custom-calendar .react-calendar__navigation {
          margin-bottom: 1.5rem !important;
        }

        .custom-calendar .react-calendar__navigation button {
          color: #0eb8d0 !important;
          font-weight: 600 !important;
          font-size: 0.9rem !important;
          background: transparent !important;
          border-radius: 12px !important;
          padding: 0.5rem !important;
          transition: all 0.2s !important;
        }

        .custom-calendar .react-calendar__navigation button:hover {
          background: rgba(14, 184, 208, 0.15) !important;
        }

        .custom-calendar .react-calendar__month-view__weekdays {
          color: rgba(255, 255, 255, 0.4) !important;
          font-weight: 500 !important;
          font-size: 0.75rem !important;
          text-transform: uppercase !important;
          margin-bottom: 0.5rem !important;
        }

        .custom-calendar .react-calendar__month-view__weekdays abbr {
          text-decoration: none !important;
        }

        .custom-calendar .react-calendar__tile {
          color: rgba(255, 255, 255, 0.8) !important;
          border-radius: 12px !important;
          padding: 0.7rem 0.5rem !important;
          font-size: 0.85rem !important;
          font-weight: 500 !important;
          transition: all 0.2s !important;
          background: transparent !important;
        }

        .custom-calendar .react-calendar__tile:enabled:hover {
          background: rgba(26, 111, 212, 0.25) !important;
          transform: scale(1.05) !important;
        }

        .custom-calendar .react-calendar__tile--active {
          background: linear-gradient(135deg, #1a6fd4, #0eb8d0) !important;
          color: white !important;
          box-shadow: 0 4px 12px rgba(14, 184, 208, 0.3) !important;
        }

        .custom-calendar .react-calendar__tile--now {
          background: rgba(14, 184, 208, 0.15) !important;
          border: 1px solid rgba(14, 184, 208, 0.4) !important;
          color: #0eb8d0 !important;
        }

        .custom-calendar .react-calendar__tile--now.react-calendar__tile--active {
          background: linear-gradient(135deg, #1a6fd4, #0eb8d0) !important;
          color: white !important;
        }

        .custom-calendar .react-calendar__tile:disabled {
          opacity: 0.3 !important;
          background: transparent !important;
        }

        /* History cards */
        .af-history-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:1.25rem;margin-bottom:.75rem;transition:border-color .2s;}
        .af-history-card:hover{border-color:rgba(14,184,208,.3);}
        .af-confirmed{display:inline-flex;align-items:center;gap:.3rem;background:rgba(16,185,129,.1);color:#34d399;border:1px solid rgba(16,185,129,.2);padding:.3rem .75rem;border-radius:999px;font-size:.74rem;font-weight:500;}

        /* Success modal */
        .af-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;z-index:200;padding:1.5rem;animation:afFadeIn .25s ease;}
        .af-modal{background:#111827;border:1px solid rgba(255,255,255,.1);border-radius:24px;padding:2.5rem;max-width:440px;width:100%;animation:afScaleIn .2s ease;}
        .af-modal-icon{width:72px;height:72px;background:linear-gradient(135deg,#1a6fd4,#0eb8d0);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1.25rem;}
        .af-modal-row{display:flex;justify-content:space-between;align-items:center;padding:.6rem 0;border-bottom:1px solid rgba(255,255,255,.06);font-size:.88rem;}
        .af-modal-row:last-of-type{border-bottom:none;}
        .af-modal-key{color:rgba(255,255,255,.45);}
        .af-modal-val{font-weight:500;color:#fff;}
        @keyframes afFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes afScaleIn{from{transform:scale(.92);opacity:0}to{transform:scale(1);opacity:1}}

        @media(max-width:480px){.af-grid-2{grid-template-columns:1fr;}.af-body{padding:1.25rem;}
      `}</style>

      <div className="af-root">
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          {/* TABS STICKY */}
          <div className={`af-tabs ${menuAbiertoGlobal ? 'menu-abierto' : ''}`} id="sticky-tabs">
            <button className={`af-tab${step === 'form' ? ' active' : ''}`} onClick={() => handleStepChange('form')}>
              📅 Agendar Cita
            </button>
            <button className={`af-tab${step === 'history' ? ' active' : ''}`} onClick={() => handleStepChange('history')}>
              📋 Mis Citas
            </button>
          </div>

          {/* ANIMATED CONTAINER */}
          <div style={{ transition: 'all .3s', opacity: animating ? 0 : 1, transform: animating ? 'scale(.97)' : 'scale(1)' }}>

            {/* ── FORMULARIO ── */}
            {step === 'form' && (
              <div className="af-card">
                <div className="af-card-header">
                  <h2>📅 Agendar Cita</h2>
                  <p>Completá los datos para reservar tu espacio</p>
                </div>
                <div className="af-body">
                  <form onSubmit={handleSubmit}>
                    <div className="af-field">
                      <label className="af-label">👤 NOMBRE COMPLETO</label>
                      <input className="af-input" type="text" name="customer_name" value={formData.customer_name} onChange={handleChange} required placeholder="Tu nombre completo" />
                    </div>

                    <div className="af-field">
                      <label className="af-label">📞 TELÉFONO</label>
                      <input className="af-input" type="tel" name="customer_phone" value={formData.customer_phone} onChange={handleChange} required placeholder="Ej: 50612345678" />
                      <p className="af-hint">Número para contacto y consultar tus citas</p>
                    </div>

                    <div className="af-grid-2">
                      <div>
                        <label className="af-label">🚗 TIPO DE VEHÍCULO</label>
                        <select className="af-input" name="vehicle_type" value={formData.vehicle_type} onChange={handleChange} required>
                          <option value="">Seleccioná</option>
                          {vehicleTypes.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="af-label">🔧 MARCA Y MODELO</label>
                        <input className="af-input" type="text" name="vehicle_model" value={formData.vehicle_model} onChange={handleChange} required placeholder="Ej: Toyota Hilux" />
                      </div>
                    </div>

                    <div className="af-field">
                      <label className="af-label">🛠️ SERVICIO</label>
                      <select className="af-input" name="service_type" value={formData.service_type} onChange={handleChange} required>
                        <option value="">Seleccioná un servicio</option>
                        {services.map((s) => <option key={s.value} value={s.value}>{s.label} — {s.price}</option>)}
                      </select>
                      {selectedService && <p className="af-hint">⏱ Duración estimada: {selectedService.duration} minutos</p>}
                    </div>

                    <span className="af-section-label">📅 SELECCIONÁ LA FECHA</span>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Calendar 
                        onChange={(date) => handleDateChange(date as Date)} 
                        value={selectedDate} 
                        minDate={new Date()} 
                        className="custom-calendar"
                      />
                    </div>

                    <span className="af-section-label">⏰ HORARIOS DISPONIBLES</span>
                    {availableTimes.length === 0 ? (
                      <p style={{ color: '#f87171', fontSize: '.88rem', textAlign: 'center', padding: '1rem 0' }}>No hay horarios disponibles para este día</p>
                    ) : (
                      <div className="af-time-grid">
                        {availableTimes.map((time) => (
                          <button key={time} type="button" className={`af-time-btn${formData.appointment_time === time ? ' sel' : ''}`} onClick={() => setFormData({ ...formData, appointment_time: time })}>
                            {time}
                          </button>
                        ))}
                      </div>
                    )}

                    <button type="submit" className="af-submit" disabled={loading || !formData.appointment_time || availableTimes.length === 0}>
                      {loading ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem' }}>
                          <svg style={{ animation: 'spin 1s linear infinite', width: 18, height: 18 }} viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" fill="none" strokeDasharray="31" strokeDashoffset="10" />
                          </svg>
                          Agendando...
                        </span>
                      ) : '📌 AGENDAR CITA'}
                    </button>
                    <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                  </form>
                </div>
              </div>
            )}

            {/* ── HISTORIAL ── */}
            {step === 'history' && (
              <div className="af-card">
                <div className="af-card-header">
                  <h2>📋 Mis Citas</h2>
                  <p>Consultá tus citas agendadas</p>
                </div>
                <div className="af-body">
                  <div style={{ display: 'flex', gap: '.75rem', marginBottom: '1.5rem' }}>
                    <input className="af-input" type="tel" placeholder="Ingresá tu número de teléfono" value={phoneToSearch} onChange={(e) => setPhoneToSearch(e.target.value)} style={{ flex: 1 }} />
                    <button onClick={() => { if (phoneToSearch) { fetchCustomerHistory(phoneToSearch); setShowHistory(true) } }} className="af-buscar-btn">
                      Buscar
                    </button>
                  </div>

                  {showHistory && (
                    customerHistory.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem 0', color: 'rgba(255,255,255,.4)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                        <p>No hay citas registradas para ese número</p>
                      </div>
                    ) : (
                      <div>
                        {customerHistory.map((cita) => {
                          const svc = services.find((s) => s.value === cita.service_type)
                          return (
                            <div key={cita.id} className="af-history-card">
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.5rem' }}>
                                    <span style={{ fontSize: '1.3rem' }}>{svc?.label.split(' ')[0]}</span>
                                    <span style={{ fontWeight: 500, fontSize: '.95rem' }}>{svc?.label || cita.service_type}</span>
                                  </div>
                                  <p style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.5)', marginBottom: '.3rem' }}>
                                    {getVehicleIcon(cita.vehicle_type)} {cita.vehicle_type} — {cita.vehicle_model}
                                  </p>
                                  <p style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.5)', marginBottom: '.2rem' }}>📅 {formatDateDisplay(cita.appointment_date)}</p>
                                  <p style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.5)' }}>⏰ {convertTo12Hour(cita.appointment_time)}</p>
                                </div>
                                <span className="af-confirmed">✓ Confirmada</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── MODAL ÉXITO ── */}
        {successData.show && (
          <div className="af-modal-overlay">
            <div className="af-modal">
              <div className="af-modal-icon">
                <svg width="32" height="32" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 style={{ fontFamily: "'Sora',sans-serif", textAlign: 'center', fontSize: '1.3rem', marginBottom: '.4rem', color: '#fff' }}>¡Cita Agendada!</h2>
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,.45)', fontSize: '.85rem', marginBottom: '1.5rem' }}>Tu cita fue confirmada exitosamente</p>

              <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                {[
                  { k: '🚗 Vehículo', v: `${successData.vehicleType} ${successData.vehicleModel}` },
                  { k: '📅 Fecha', v: formatDateSimple(successData.date) },
                  { k: '⏰ Hora', v: successData.time },
                  { k: '🧼 Servicio', v: successData.service },
                ].map((row) => (
                  <div key={row.k} className="af-modal-row">
                    <span className="af-modal-key">{row.k}</span>
                    <span className="af-modal-val">{row.v}</span>
                  </div>
                ))}
              </div>

              <p style={{ textAlign: 'center', fontSize: '.75rem', color: 'rgba(255,255,255,.25)', marginBottom: '1rem' }}>📸 Tomá una captura para recordar tu cita</p>
              <button onClick={() => setSuccessData({ show: false, name: '', date: '', time: '', service: '', vehicleType: '', vehicleModel: '' })} style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg,#1a6fd4,#0eb8d0)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 600, fontSize: '.95rem', cursor: 'pointer', fontFamily: "'Sora',sans-serif" }}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

