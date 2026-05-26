import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppointmentForm } from './components/AppointmentForm'
import { AdminLogin } from './pages/AdminLogin'
import { AdminDashboard } from './pages/AdminDashboard'
import { ProductCatalog } from './components/ProductCatalog'
import { Contact } from './components/Contact'
import { Opiniones } from './components/Opiniones'
import { useState } from 'react'

function NavBar() {
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-xl font-bold py-3">🚗 Lavacar</div>
          
          {/* Botón de menú hamburguesa (3 rayitas) */}
          <button 
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="p-2 rounded hover:bg-blue-700 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Menú desplegable (se abre cuando tocas las 3 rayitas) */}
        {menuAbierto && (
          <div className="flex flex-col pb-3 space-y-1 border-t border-blue-500 mt-1 pt-2">
            <a href="/" className="px-3 py-2 rounded hover:bg-blue-700 transition" onClick={() => setMenuAbierto(false)}>
              📅 Agendar
            </a>
            <a href="/productos" className="px-3 py-2 rounded hover:bg-blue-700 transition" onClick={() => setMenuAbierto(false)}>
              🛍️ Productos
            </a>
            <a href="/contacto" className="px-3 py-2 rounded hover:bg-blue-700 transition" onClick={() => setMenuAbierto(false)}>
              📞 Contacto
            </a>
            <a href="/opiniones" className="px-3 py-2 rounded hover:bg-blue-700 transition" onClick={() => setMenuAbierto(false)}>
              ⭐ Opiniones
            </a>
            <button 
              onClick={() => {
                setShowLocationModal(true)
                setMenuAbierto(false)
              }}
              className="px-3 py-2 rounded hover:bg-blue-700 transition text-left"
            >
              📍 Ubicación
            </button>
          </div>
        )}
      </div>

      {/* MODAL DE UBICACIÓN - VERSIÓN MEJORADA VISUALMENTE */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all">
            {/* Icono decorativo circular */}
            <div className="text-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <span className="text-4xl">📍</span>
              </div>
            </div>
            
            {/* Título principal */}
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Nuestra Ubicación
            </h3>
            <p className="text-center text-gray-500 text-sm mb-6">
              ¡Ven y conócenos! 🚗
            </p>
            
            {/* Tarjeta de dirección */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-sm">
                  📍
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Dirección exacta:</p>
                  <p className="text-gray-600">
                    Bagaces, Guanacaste<br />
                    Costa Rica
                  </p>
                </div>
              </div>
            </div>
            
            {/* Tarjeta de horario */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="text-2xl bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-sm">
                  ⏰
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Horario de atención:</p>
                  <p className="text-gray-600">
                    Lunes a Sábado: <span className="font-medium text-green-600">8am - 6pm</span><br />
                    Domingos: <span className="font-medium text-green-600">9am - 2pm</span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=10.5218901,-85.2548091', '_blank')}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition flex items-center justify-center gap-2 font-semibold shadow-md"
              >
                🗺️ Abrir en Google Maps
              </button>
              <button
                onClick={() => setShowLocationModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition font-semibold"
              >
                ✖️ Cerrar
              </button>
            </div>
            
            {/* Mensaje de cierre */}
            <p className="text-center text-xs text-gray-400 mt-4">
              ¡Te esperamos con los mejores precios y calidad!
            </p>
          </div>
        </div>
      )}
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={
            <>
              <NavBar />
              <AppointmentForm />
            </>
          } />
          <Route path="/productos" element={
            <>
              <NavBar />
              <ProductCatalog />
            </>
          } />
          <Route path="/contacto" element={
            <>
              <NavBar />
              <Contact />
            </>
          } />
          <Route path="/opiniones" element={
            <>
              <NavBar />
              <Opiniones />
            </>
          } />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App