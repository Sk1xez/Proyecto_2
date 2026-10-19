import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSesion } from '../context/useSesion'
import CampoFormulario from '../components/CampoFormulario'
import { requerido, correoValido, contrasenaValida } from '../utils/validaciones'

function destinoPorRol(rol) {
  return rol === 'Cliente' ? '/' : '/admin'
}

function Login() {
  const { sesion, iniciarSesion } = useSesion()
  const navigate = useNavigate()

  const [valores, setValores] = useState({ correo: '', contrasena: '' })
  const [errores, setErrores] = useState({ correo: '', contrasena: '' })
  const [errorGeneral, setErrorGeneral] = useState('')

  useEffect(() => {
    if (sesion) {
      navigate(destinoPorRol(sesion.rol), { replace: true })
    }
  }, [sesion, navigate])

  function cambiar(campo, valor) {
    setValores((previos) => ({ ...previos, [campo]: valor }))
    setErrores((previos) => ({ ...previos, [campo]: '' }))
    setErrorGeneral('')
  }

  function enviar(evento) {
    evento.preventDefault()

    const nuevosErrores = {
      correo: requerido(valores.correo) || correoValido(valores.correo),
      contrasena: requerido(valores.contrasena) || contrasenaValida(valores.contrasena)
    }

    setErrores(nuevosErrores)

    if (nuevosErrores.correo || nuevosErrores.contrasena) {
      setErrorGeneral('')
      return
    }

    const resultado = iniciarSesion(valores.correo.trim(), valores.contrasena)

    if (!resultado.ok) {
      setErrorGeneral('Correo o contraseña incorrectos.')
      return
    }

    setErrorGeneral('')
    navigate(destinoPorRol(resultado.usuario.rol), { replace: true })
  }

  return (
    <section className="seccion-pagina container py-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title h3 mb-4 text-center">Iniciar sesión</h1>

              {errorGeneral && (
                <div className="alert alert-danger" role="alert">
                  {errorGeneral}
                </div>
              )}

              <form onSubmit={enviar} noValidate>
                <CampoFormulario
                  etiqueta="Correo electrónico"
                  id="correo"
                  tipoEntrada="email"
                  valor={valores.correo}
                  onChange={(valor) => cambiar('correo', valor)}
                  error={errores.correo}
                />

                <CampoFormulario
                  etiqueta="Contraseña"
                  id="contrasena"
                  tipoEntrada="password"
                  valor={valores.contrasena}
                  onChange={(valor) => cambiar('contrasena', valor)}
                  error={errores.contrasena}
                />

                <button type="submit" className="btn btn-primary w-100">
                  Ingresar
                </button>
              </form>

              <p className="text-center mt-3 mb-0">
                ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
