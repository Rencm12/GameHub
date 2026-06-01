import { useState } from "react";
import Footer from "../../components/Footer";

function Nosotros() {
  const [faqAbierto, setFaqAbierto] = useState(false);
  const [terminosAbierto, setTerminosAbierto] = useState(false);
  const [misionVisionAbierto, setMisionVisionAbierto] = useState(false);
  const [valoresAbierto, setValoresAbierto] = useState(false);
  const integrantes = [
    {
      nombre: "Renato Alejandro Osorio Cama",
      rol: "Líder de Proyecto",
      descripcion:
        "Supervisa el desarrollo general, coordina las actividades del equipo y participa en el diseño de la base de datos y el desarrollo de funcionalidades principales.",
      imagen:
        "https://i.pinimg.com/originals/db/f6/5c/dbf65c4f91e8024db041a3cc06aa3177.jpg",
    },
    {
      nombre: "Carlos Ernesto Gonzales Solórzano",
      rol: "Desarrollador Full Stack",
      descripcion:
        "Responsable de la configuración de Supabase, implementación de autenticación, registro e inicio de sesión, además del desarrollo de interfaces y funcionalidades del sistema.",
      imagen:
        "https://f.rpp-noticias.io/2023/10/11/512551_1485909.jpg?width=1020&quality=80",
    },
    {
      nombre: "Caleb Isaac Alvarez Ysmodés",
      rol: "Desarrollador Front-End",
      descripcion:
        "Encargado del diseño e implementación de la interfaz de usuario, la configuración inicial del proyecto en React y la adaptación visual del sistema.",
      imagen:
        "https://i.pinimg.com/736x/18/0d/55/180d557d107e4f544c21d0559b1eb095.jpg",
    },
    {
      nombre: "Karol Nieves Huamani Espinoza",
      rol: "Desarrolladora Back-End",
      descripcion:
        "Responsable del desarrollo de la base de datos, integración de funcionalidades como carrito y favoritos, además de participar en las pruebas del sistema.",
      imagen:
        "https://i.pinimg.com/736x/6e/4a/55/6e4a55341fcb256f59908ba1223fbf14.jpg",
    },
    {
      nombre: "Hilmer Kharoll Jauregui Canchanya",
      rol: "Analista de Requerimientos y Desarrollador Front-End",
      descripcion:
        "Encargado de identificar los requerimientos del sistema, definir funcionalidades y participar en el desarrollo de interfaces y navegación de la aplicación.",
      imagen:
        "https://i.pinimg.com/736x/14/37/4f/14374f6454e77e82c48051a3bb61dd9c.jpg",
    },
  ];

  return (
    <div className="text-white p-10 max-w-7xl mx-auto">

      <h1 className="text-5xl font-bold text-[#00ffc3] text-center mb-10">
        Sobre GameHub
      </h1>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-[#00ffc3] mb-4">
          ¿Quiénes somos?
        </h2>

        <p className="leading-8 text-lg">
          GameHub es una plataforma web orientada a brindar una experiencia
          interactiva en el mundo de los videojuegos, que cuenta con apartados
          como inicio, juegos, consolas, accesorios y login, permitiendo a los
          usuarios explorar contenido variado y relevante en un solo lugar.
          Nuestro objetivo es facilitar la navegación y búsqueda de información,
          organizar preferencias personales y ofrecer una experiencia moderna
          para la comunidad gamer.
        </p>
      </section>

      <section className="mb-6">

        <button
          onClick={() => setMisionVisionAbierto(!misionVisionAbierto)}
          className="
      w-full
      text-left
      bg-slate-900
      border
      border-[#00ffc3]
      p-4
      rounded-xl
      font-bold
      text-[#00ffc3]
    "
        >
          {misionVisionAbierto
            ? "▼ Misión y Visión"
            : "► Misión y Visión"}
        </button>

        {misionVisionAbierto && (
          <div className="bg-slate-950 border border-[#00ffc3] p-6 rounded-xl mt-3">

            <h3 className="font-bold text-xl text-[#00ffc3] mb-2">
              Misión
            </h3>

            <p className="mb-6">
              Brindar a los usuarios una plataforma moderna e intuitiva donde
              puedan explorar videojuegos, consolas y accesorios, ofreciendo una
              experiencia organizada, accesible y atractiva.
            </p>

            <h3 className="font-bold text-xl text-[#00ffc3] mb-2">
              Visión
            </h3>

            <p>
              Convertirnos en una plataforma de referencia para la comunidad gamer,
              incorporando nuevas tecnologías y funcionalidades innovadoras que
              permitan una experiencia cada vez más completa y personalizada.
            </p>

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
      border-[#00ffc3]
      p-4
      rounded-xl
      font-bold
      text-[#00ffc3]
    "
        >
          {valoresAbierto
            ? "▼ Valores Organizacionales"
            : "► Valores Organizacionales"}
        </button>

        {valoresAbierto && (
          <div className="bg-slate-950 border border-[#00ffc3] p-6 rounded-xl mt-3">

            <ul className="list-disc pl-6 space-y-3 text-lg">

              <li>
                <strong>Innovación tecnológica:</strong> buscamos mejorar continuamente
                nuestras soluciones mediante nuevas tecnologías.
              </li>

              <li>
                <strong>Trabajo en equipo:</strong> fomentamos la colaboración y la
                comunicación entre los integrantes.
              </li>

              <li>
                <strong>Compromiso con la calidad:</strong> desarrollamos funcionalidades
                eficientes y fáciles de utilizar.
              </li>

              <li>
                <strong>Responsabilidad:</strong> cumplimos con los objetivos y tareas
                asignadas durante el proyecto.
              </li>

              <li>
                <strong>Mejora continua:</strong> analizamos constantemente oportunidades
                para optimizar la plataforma.
              </li>

            </ul>

          </div>
        )}

      </section>


      <section>
        <h2 className="text-3xl font-bold text-[#00ffc3] mb-8">
          Equipo de Desarrollo
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {integrantes.map((integrante) => (
            <div
              key={integrante.nombre}
              className="
                bg-slate-900
                border
                border-[#00ffc3]
                rounded-2xl
                overflow-hidden
                shadow-lg
              "
            >
              <img
                src={integrante.imagen}
                alt={integrante.nombre}
                className="w-full h-64 object-cover"
              />

              <div className="p-5">
                <h3 className="text-xl font-bold text-[#00ffc3]">
                  {integrante.nombre}
                </h3>

                <p className="font-semibold mt-2">
                  {integrante.rol}
                </p>

                <p className="text-sm mt-3 text-gray-300">
                  {integrante.descripcion}
                </p>
              </div>
            </div>
          ))}

        </div>
      </section>

      <section className="mt-16">

        <h2 className="text-3xl font-bold text-[#00ffc3] mb-6">
          Información Adicional
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
        border-[#00ffc3]
        p-4
        rounded-xl
        font-bold
        text-[#00ffc3]
      "
          >
            {faqAbierto
              ? "▼ Preguntas Frecuentes"
              : "► Preguntas Frecuentes"}
          </button>

          {faqAbierto && (

            <div className="bg-slate-950 border border-[#00ffc3] p-6 rounded-xl mt-3">

              <h3 className="font-bold text-xl mb-2">
                ¿Qué es GameHub?
              </h3>

              <p className="mb-4">
                GameHub es una plataforma web orientada al mundo gamer donde los usuarios pueden explorar videojuegos, consolas y accesorios.
              </p>

              <h3 className="font-bold text-xl mb-2">
                ¿Necesito registrarme?
              </h3>

              <p className="mb-4">
                No necesariamente. Sin embargo, algunas funcionalidades requieren autenticación para una experiencia más personalizada.
              </p>

              <h3 className="font-bold text-xl mb-2">
                ¿Qué productos ofrece GameHub?
              </h3>

              <p className="mb-4">
                Videojuegos, consolas y accesorios relacionados con el entretenimiento gamer.
              </p>

              <h3 className="font-bold text-xl mb-2">
                ¿Qué tecnologías utiliza GameHub?
              </h3>

              <p>
                React, JavaScript, Tailwind CSS, Supabase y PostgreSQL.
              </p>

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
        border-[#00ffc3]
        p-4
        rounded-xl
        font-bold
        text-[#00ffc3]
      "
          >
            {terminosAbierto
              ? "▼ Términos y Condiciones"
              : "► Términos y Condiciones"}
          </button>

          {terminosAbierto && (

            <div className="bg-slate-950 border border-[#00ffc3] p-6 rounded-xl mt-3">

              <h3 className="font-bold text-xl mb-2">
                Uso de la plataforma
              </h3>

              <p className="mb-4">
                GameHub tiene fines informativos y demostrativos dentro del proyecto académico desarrollado por el equipo.
              </p>

              <h3 className="font-bold text-xl mb-2">
                Responsabilidad de la información
              </h3>

              <p className="mb-4">
                Se procura mantener información actualizada sobre videojuegos, consolas y accesorios mostrados en la plataforma.
              </p>

              <h3 className="font-bold text-xl mb-2">
                Derechos de autor
              </h3>

              <p className="mb-4">
                Las imágenes, marcas y nombres comerciales pertenecen a sus respectivos propietarios.
              </p>

              <h3 className="font-bold text-xl mb-2">
                Modificaciones
              </h3>

              <p>
                El equipo de desarrollo podrá actualizar funcionalidades, diseño y contenido en futuras versiones del sistema.
              </p>

            </div>

          )}

        </div>

      </section>

      <Footer />

    </div>
  );
}

export default Nosotros;
