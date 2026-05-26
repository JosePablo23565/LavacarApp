export function Contact() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Título principal */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-3 mb-4 shadow-lg">
            <span className="text-4xl">📞</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Contacto</h2>
          <p className="text-gray-500">Estamos aquí para ayudarte</p>
        </div>

        {/* Tarjeta principal */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header decorativo */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-center">
            <p className="text-white text-sm uppercase tracking-wide">Información de contacto</p>
          </div>
          
          {/* Contenido */}
          <div className="p-6 space-y-4">
            {/* Dirección */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 transition hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-sm">
                  <span className="text-2xl">📍</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-lg">Dirección</p>
                  <p className="text-gray-600">
                    Bagaces, Guanacaste<br />
                    Costa Rica
                  </p>
                </div>
              </div>
            </div>

            {/* Teléfono / WhatsApp */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 transition hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-sm">
                  <span className="text-2xl">📱</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-lg">Teléfono / WhatsApp</p>
                  <a 
                    href="https://wa.me/50612345678" 
                    target="_blank"
                    className="text-green-600 hover:text-green-700 font-medium text-lg flex items-center gap-2"
                  >
                    +506 1234-5678
                    <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">WhatsApp</span>
                  </a>
                  <p className="text-xs text-gray-400 mt-1">Click para enviar mensaje directo</p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 transition hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-sm">
                  <span className="text-2xl">✉️</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-lg">Correo electrónico</p>
                  <a 
                    href="mailto:lavacar@gmail.com" 
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    lavacar@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Horario */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 transition hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-sm">
                  <span className="text-2xl">⏰</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-lg">Horario de atención</p>
                  <div className="space-y-1 mt-1">
                    <p className="text-gray-600">
                      Lunes a Sábado: <span className="font-medium text-green-600">8am - 6pm</span>
                    </p>
                    <p className="text-gray-600">
                      Domingos: <span className="font-medium text-green-600">9am - 2pm</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón de Google Maps dentro del cuadro */}
            <button
              onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=10.5218901,-85.2548091', '_blank')}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition flex items-center justify-center gap-2 font-semibold shadow-md mt-4"
            >
              🗺️ Ver ubicación en Google Maps
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}