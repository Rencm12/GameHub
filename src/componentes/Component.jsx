
import { useState } from "react";

const Header = () => {

  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const [nuevoUsuario, setNuevoUsuario] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");

  const iniciarSesion = () => {
    if (!usuario || !password) {
      alert("Falta completar campos");
      return;
    }

    alert("Bienvenido " + usuario + " 🎮");
    setMostrarLogin(false);
  };

  const registrarUsuario = () => {
    if (!nuevoUsuario || !nuevaPassword) {
      alert("Completa todos los campos");
      return;
    }

    alert("Usuario " + nuevoUsuario + " registrado con éxito 🎉");
    setMostrarRegistro(false);
  };

  return (
    <header>

      <div className="logo">GameHub</div>

      <div className="auth-buttons">
        <button 
          className="btn-register" 
          onClick={() => setMostrarRegistro(true)}
        >
          Registrarse
        </button>

        <button 
          className="btn-login" 
          onClick={() => setMostrarLogin(true)}
        >
          Iniciar sesión
        </button>
      </div>

      {/* MODAL LOGIN */}
      {mostrarLogin && (
        <div className="modal">
            <div className="modal-box">
          <h2>Login</h2>

          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn-primary" onClick={iniciarSesion}>Ingresar</button>
          <button className="btn-secondary" onClick={() => setMostrarLogin(false)}>Cerrar</button>
       </div>
        </div>
      )}

      {/* MODAL REGISTRO */}
      {mostrarRegistro && (
        <div className="modal">
            <div className="modal-box">
          <h2>Registro</h2>

          <input
            type="text"
            placeholder="Nuevo usuario"
            value={nuevoUsuario}
            onChange={(e) => setNuevoUsuario(e.target.value)}
          />

          <input
            type="password"
            placeholder="Nueva contraseña"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
          />

          <button className="btn-primary" onClick={registrarUsuario}>Registrar</button>
          <button className="btn-secondary"onClick={() => setMostrarRegistro(false)}>Cerrar</button>
       </div>
        </div>
      )}

      <nav>
        <ul>
          <li><a href="#">Inicio</a></li>
          <li><a href="#">Consolas</a></li>
          <li><a href="#">Juegos</a></li>
          <li><a href="#">Accesorios</a></li>
        </ul>
      </nav>

    </header>
  );
};

export default Header;

