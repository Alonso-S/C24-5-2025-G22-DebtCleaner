const WelcomeCard = () => {
  return (
    <div className="relative overflow-hidden py-6 px-8 rounded-2xl backdrop-blur-md bg-white/40 border border-white/30 shadow-lg">
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-[rgba(0,178,227,0.15)] rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-[rgba(255,82,170,0.1)] rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-[rgb(18,24,38)] text-shadow-sm">
          Bienvenido, Profesor
        </h1>
        <p className="mt-3 text-base text-gray-700 max-w-7xl text-balance">
          Gestiona tus cursos y estudiantes desde este panel.
        </p>
      </div>
    </div>
  )
}

export default WelcomeCard
