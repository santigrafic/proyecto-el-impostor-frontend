const LoginForm = () => {
  return (
    <div className="login-form">
      <form action="/action_page.php">
        <div className="mb-3 mt-3">
          <label htmlFor="email" className="form-label">Email:</label>
          <input type="email" className="form-control" id="email" placeholder="Introduce email" name="email" />
        </div>
        <div className="mb-3">
          <label htmlFor="pwd" className="form-label">Password:</label>
          <input type="password" className="form-control" id="pwd" placeholder="Introduce password" name="pswd" />
        </div>
        <div className="form-check mb-3">
          <label className="form-check-label">
            <input className="form-check-input" type="checkbox" name="remember" /> Recuérdame
          </label>
        </div>
        <button type="submit" className="btn btn-primary">Enviar</button>
      </form>
    </div>
  )
}

export default LoginForm