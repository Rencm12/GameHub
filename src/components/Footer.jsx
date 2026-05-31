import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="
        bg-black
        border-t
        border-[#00ffc3]
        py-10
        px-8
        mt-10
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          grid
          grid-cols-1
          md:grid-cols-3
          gap-10
        "
      >
        {/* Logo */}
        <div>
          <h3 className="text-[#00ffc3] text-2xl font-bold mb-4">
            GameHub
          </h3>

          <p className="text-gray-400">
            Tu universo gamer definitivo.
          </p>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="text-[#00ffc3] text-xl font-bold mb-4">
            Contacto
          </h3>

          <p className="text-gray-400">
            soporte@gamehub.com
          </p>

          <p className="text-gray-400">
            +51 999 999 999
          </p>
        </div>

        {/* Nosotros */}
        <div>
          <h3 className="text-[#00ffc3] text-xl font-bold mb-4">
            Conócenos
          </h3>

          <p className="text-gray-400 mb-4">
            Descubre quiénes somos y la pasión gamer que impulsa GameHub.
          </p>

          <Link to="/nosotros">
            <button
              className="
                bg-[#00ffc3]
                text-black
                px-6
                py-3
                rounded-xl
                font-bold
                hover:bg-[#00d9a8]
                transition
              "
            >
              Ir a Nosotros
            </button>
          </Link>
        </div>
      </div>

      <p className="text-center text-gray-500 mt-10">
        © 2026 GameHub
      </p>
    </footer>
  );
};

export default Footer;