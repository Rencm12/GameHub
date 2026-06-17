import { Link } from "react-router-dom";
import { BookOpenCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

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
          md:grid-cols-4
          gap-10
        "
      >
        {/* Logo */}
        <div>
          <h3 className="text-[#00ffc3] text-2xl font-bold mb-4">GameHub</h3>
          <p className="text-gray-400">{t("footer.tagline")}</p>
        </div>

        <div>
          <h3 className="text-[#00ffc3] text-xl font-bold mb-4">
            {t("footer.contact")}
          </h3>
          <p className="text-gray-400">{t("footer.email")}</p>
          <p className="text-gray-400">{t("footer.phone")}</p>
        </div>

        <div>
          <h3 className="text-[#00ffc3] text-xl font-bold mb-4">
            {t("footer.knowUs")}
          </h3>
          <p className="text-gray-400 mb-4">{t("footer.description")}</p>

          <Link to="/nosotros">
            <button className="bg-[#00ffc3] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#00d9a8] transition">
              {t("footer.goToAbout")}
            </button>
          </Link>
        </div>

        {/* Libro de Reclamaciones */}
        <div>
          <h3 className="text-[#00ffc3] text-xl font-bold mb-4">
            {t("footer.customerService")}
          </h3>

          <p className="text-gray-400 mb-4">
            {t("footer.claimsDescription")}
          </p>

          <Link
            to="/libro-reclamaciones"
            className="
              inline-flex
              items-center
              gap-2
              bg-transparent
              border
              border-[#00ffc3]
              text-[#00ffc3]
              px-5
              py-3
              rounded-xl
              font-bold
              hover:bg-[#00ffc3]
              hover:text-black
              transition
            "
          >
            <BookOpenCheck size={20} />
            {t("footer.claimsBook")}
          </Link>
        </div>
      </div>

      <p className="text-center text-gray-500 mt-10">{t("footer.copyright")}</p>
    </footer>
  );
};

export default Footer;
