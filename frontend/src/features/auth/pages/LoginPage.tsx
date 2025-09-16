const LoginPage = () => {
  return (
    <div>
      <h1>Accede con tu correo institucional</h1>
      <form>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" placeholder="Ingresa tu correo institucional" />
      </form>

      <span>o continúa con</span>

      <a href="#">
        <img src="/google-logo.svg" alt="Google" />
        Continuar con Google
      </a>
    </div>
  )
}

export default LoginPage
