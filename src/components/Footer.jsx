import { Link } from "react-router-dom";
import { textByLanguage, useLanguage } from "../i18n/useLanguage";

const FOOTER_TEXT = {
  es: {
    tagline: "Tu universo gamer definitivo.",
    contact: "Contacto",
    knowUs: "Conocenos",
    description:
      "Descubre quienes somos y la pasion gamer que impulsa GameHub.",
    goToAbout: "Ir a Nosotros",
  },
  en: {
    tagline: "Your ultimate gaming universe.",
    contact: "Contact",
    knowUs: "Get to know us",
    description: "Discover who we are and the gaming passion behind GameHub.",
    goToAbout: "Go to About us",
  },
  pt: {
    tagline: "Seu universo gamer definitivo.",
    contact: "Contato",
    knowUs: "Conheca-nos",
    description: "Descubra quem somos e a paixao gamer que impulsiona GameHub.",
    goToAbout: "Ir para Sobre nos",
  },
};

const Footer = () => {
  const idioma = useLanguage();
  const textos = textByLanguage(FOOTER_TEXT, idioma);

  return (
    <footer className="bg-black border-t border-[#00ffc3] py-10 px-8 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-[#00ffc3] text-2xl font-bold mb-4">GameHub</h3>
          <p className="text-gray-400">{textos.tagline}</p>
        </div>

        <div>
          <h3 className="text-[#00ffc3] text-xl font-bold mb-4">
            {textos.contact}
          </h3>
          <p className="text-gray-400">soporte@gamehub.com</p>
          <p className="text-gray-400">+51 999 999 999</p>
        </div>

        <div>
          <h3 className="text-[#00ffc3] text-xl font-bold mb-4">
            {textos.knowUs}
          </h3>
          <p className="text-gray-400 mb-4">{textos.description}</p>

          <Link to="/nosotros">
            <button className="bg-[#00ffc3] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#00d9a8] transition">
              {textos.goToAbout}
            </button>
          </Link>
        </div>
      </div>

      <p className="text-center text-gray-500 mt-10">© 2026 GameHub</p>
    </footer>
  );
};

export default Footer;
