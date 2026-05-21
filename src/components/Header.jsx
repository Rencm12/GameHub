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

    alert(`Bienvenido ${usuario} 🎮`);
    setMostrarLogin(false);
  };

  const registrarUsuario = () => {
    if (!nuevoUsuario || !nuevaPassword) {
      alert("Completa todos los campos");
      return;
    }

    alert(`Usuario ${nuevoUsuario} registrado con éxito 🎉`);
    setMostrarRegistro(false);
  };

  return (
    <>
      <header className="bg-black px-10 py-4 flex items-center justify-between border-b-2 border-[#00ffc3]">

        {/* Logo */}
        <div className="text-[24px] text-[#00ffc3] font-bold">
          GameHub
        </div>

        {/* Navegación */}
        <nav>
          <ul className="flex gap-8 text-white">

            {["Inicio", "Consolas", "Juegos", "Accesorios"].map((item) => (
              <li
                key={item}
                className="
                  relative
                  cursor-pointer
                  after:absolute
                  after:left-0
                  after:-bottom-1
                  after:h-[2px]
                  after:w-0
                  after:bg-[#00ffc3]
                  after:transition-all
                  hover:after:w-full
                "
              >
                <a href="#">
                  {item}
                </a>
              </li>
            ))}

          </ul>
        </nav>

        {/* Botones */}
        <div className="flex gap-3">

          <button
            className="btn-primary"
            onClick={() => setMostrarRegistro(true)}
          >
            Registrarse
          </button>

          <button
            className="btn-primary"
            onClick={() => setMostrarLogin(true)}
          >
            Iniciar sesión
          </button>

        </div>

      </header>

      {/* LOGIN */}
      {mostrarLogin && (
        <div className="modal-overlay">

          <div className="modal-box">

            <h2 className="modal-title">
              Login
            </h2>

            <input
              className="modal-input"
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />

            <input
              className="modal-input"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="btn-primary w-full mt-3"
              onClick={iniciarSesion}
            >
              Ingresar
            </button>

            <button
              className="btn-secondary"
              onClick={() => setMostrarLogin(false)}
            >
              Cerrar
            </button>

          </div>

        </div>
      )}

      {/* REGISTRO */}
      {mostrarRegistro && (
        <div className="modal-overlay">

          <div className="modal-box">

            <h2 className="modal-title">
              Registro
            </h2>

            <input
              className="modal-input"
              type="text"
              placeholder="Nuevo usuario"
              value={nuevoUsuario}
              onChange={(e) => setNuevoUsuario(e.target.value)}
            />

            <input
              className="modal-input"
              type="password"
              placeholder="Nueva contraseña"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
            />

            <button
              className="btn-primary w-full mt-3"
              onClick={registrarUsuario}
            >
              Registrar
            </button>

            <button
              className="btn-secondary"
              onClick={() => setMostrarRegistro(false)}
            >
              Cerrar
            </button>

          </div>

        </div>
      )}
    </>
  );
};

export default Header;