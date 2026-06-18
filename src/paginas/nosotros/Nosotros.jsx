import { useState } from "react";
import { useTranslation } from "react-i18next";
import Footer from "../../components/Footer";

function Nosotros() {
  const { t } = useTranslation();

  const [faqAbierto, setFaqAbierto] = useState(false);
  const [terminosAbierto, setTerminosAbierto] = useState(false);
  const [misionVisionAbierto, setMisionVisionAbierto] = useState(false);
  const [valoresAbierto, setValoresAbierto] = useState(false);

  // Datos que no cambian según el idioma (imágenes). El nombre, rol y
  // descripción de cada integrante vienen de las traducciones, indexados
  // por posición dentro de este mismo arreglo.
  const integrantesData = [
    {
      imagen:
        "https://i.pinimg.com/originals/db/f6/5c/dbf65c4f91e8024db041a3cc06aa3177.jpg",
    },
    {
      imagen:
        "https://f.rpp-noticias.io/2023/10/11/512551_1485909.jpg?width=1020&quality=80",
    },
    {
      imagen:
        "https://i.pinimg.com/736x/18/0d/55/180d557d107e4f544c21d0559b1eb095.jpg",
    },
    {
      imagen:
        "https://i.pinimg.com/736x/6e/4a/55/6e4a55341fcb256f59908ba1223fbf14.jpg",
    },
    {
      imagen:
        "https://i.pinimg.com/736x/14/37/4f/14374f6454e77e82c48051a3bb61dd9c.jpg",
    },
  ];

  const miembros = t("about.team.members", { returnObjects: true });
  const valores = t("about.values.items", { returnObjects: true });
  const faqs = t("about.faq.items", { returnObjects: true });
  const terminos = t("about.terms.items", { returnObjects: true });

  return (
    <div className="text-white p-10 max-w-7xl mx-auto">
      <h1 className="text-5xl font-bold text-[#86E1FF] text-center mb-10">
        {t("about.title")}
      </h1>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-[#86E1FF] mb-4">
          {t("about.whoWeAre.heading")}
        </h2>

        <p className="leading-8 text-lg">{t("about.whoWeAre.text")}</p>
      </section>

      <section className="mb-6">
        <button
          onClick={() => setMisionVisionAbierto(!misionVisionAbierto)}
          className="
      w-full
      text-left
      bg-slate-900
      border
      border-[#5C7CFA]
      p-4
      rounded-xl
      font-bold
      text-[#86E1FF]
      shadow-[0_0_10px_#86E1FF]
    "
        >
          {misionVisionAbierto ? "▼ " : "► "}
          {t("about.missionVision.toggle")}
        </button>

        {misionVisionAbierto && (
          <div className="bg-slate-950 border border-[#5C7CFA] p-6 rounded-xl mt-3">
            <h3 className="font-bold text-xl text-[#86E1FF] mb-2">
              {t("about.missionVision.missionTitle")}
            </h3>

            <p className="mb-6">{t("about.missionVision.missionText")}</p>

            <h3 className="font-bold text-xl text-[#86E1FF] mb-2">
              {t("about.missionVision.visionTitle")}
            </h3>

            <p>{t("about.missionVision.visionText")}</p>
          </div>
        )}
      </section>

      <section className="mb-12">
        <button
          onClick={() => setValoresAbierto(!valoresAbierto)}
          className="
      w-full
      text-left
      bg-slate-900
      border
      border-[#5C7CFA]
      p-4
      rounded-xl
      font-bold
      text-[#86E1FF]
      shadow-[0_0_10px_#86E1FF]
    "
        >
          {valoresAbierto ? "▼ " : "► "}
          {t("about.values.toggle")}
        </button>

        {valoresAbierto && (
          <div className="bg-slate-950 border border-[#5C7CFA] p-6 rounded-xl mt-3 shadow-[0_0_15px_rgba(134,225,255,0.4),0_0_30px_rgba(134,225,255,0.2)]">
            <ul className="list-disc pl-6 space-y-3 text-lg">
              {valores.map((valor, index) => (
                <li key={index}>
                  <strong>{valor.title}</strong> {valor.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-3xl font-bold text-[#86E1FF] mb-8">
          {t("about.team.heading")}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {integrantesData.map((integrante, index) => {
            const miembro = miembros[index];

            return (
              <div
                key={miembro.name}
                className="
                bg-slate-900
                border
                border-[#5C7CFA]
                rounded-2xl
                overflow-hidden
                hover:shadow-[0_0_15px_rgba(134,225,255,0.4),0_0_30px_rgba(134,225,255,0.2)]
                transition
              "
              >
                <img
                  src={integrante.imagen}
                  alt={miembro.name}
                  className="w-full h-64 object-cover"
                />

                <div className="p-5">
                  <h3 className="text-xl font-bold text-[#86E1FF]">
                    {miembro.name}
                  </h3>

                  <p className="font-semibold mt-2">{miembro.role}</p>

                  <p className="text-sm mt-3 text-gray-300">
                    {miembro.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-3xl font-bold text-[#86E1FF] mb-6">
          {t("about.additionalInfo.heading")}
        </h2>

        {/* FAQ */}
        <div className="mb-6">
          <button
            onClick={() => setFaqAbierto(!faqAbierto)}
            className="
        w-full
        text-left
        bg-slate-900
        border
        border-[#5C7CFA]
        p-4
        rounded-xl
        font-bold
        text-[#86E1FF]
        shadow-[0_0_10px_#86E1FF]
      "
          >
            {faqAbierto ? "▼ " : "► "}
            {t("about.faq.toggle")}
          </button>

          {faqAbierto && (
            <div className="bg-slate-950 border border-[#5C7CFA] p-6 rounded-xl mt-3">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <h3 className="font-bold text-xl mb-2">{faq.question}</h3>
                  <p className={index === faqs.length - 1 ? "" : "mb-4"}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TERMINOS */}
        <div>
          <button
            onClick={() => setTerminosAbierto(!terminosAbierto)}
            className="
        w-full
        text-left
        bg-slate-900
        border
        border-[#5C7CFA]
        p-4
        rounded-xl
        font-bold
        text-[#86E1FF]
        shadow-[0_0_10px_#86E1FF]
      "
          >
            {terminosAbierto ? "▼ " : "► "}
            {t("about.terms.toggle")}
          </button>

          {terminosAbierto && (
            <div className="bg-slate-950 border border-[#5C7CFA] p-6 rounded-xl mt-3">
              {terminos.map((termino, index) => (
                <div key={index}>
                  <h3 className="font-bold text-xl mb-2">{termino.title}</h3>
                  <p className={index === terminos.length - 1 ? "" : "mb-4"}>
                    {termino.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Nosotros;
