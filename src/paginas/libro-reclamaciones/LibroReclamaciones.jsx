import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BookOpenCheck, Send, ShieldCheck } from "lucide-react";
import Footer from "../../components/Footer";
import { crearReclamacion } from "../../service/ReclamacionesService";

const datosIniciales = {
  nombre: "",
  documento: "",
  telefono: "",
  correo: "",
  direccion: "",
  tipo: "Reclamo",
  producto: "",
  pedido: "",
  detalle: "",
  solicitud: "",
};

const validarFormulario = (datos, t) => {
  if (!/^[A-Za-z\s]+$/.test(datos.nombre.trim())) {
    return t("claims.validation.name");
  }

  if (!/^\d{8}$/.test(datos.documento)) {
    return t("claims.validation.document");
  }

  if (!/^9\d{8}$/.test(datos.telefono)) {
    return t("claims.validation.phone");
  }

  return "";
};

function LibroReclamaciones() {
  const { t } = useTranslation();
  const [formulario, setFormulario] = useState(datosIniciales);
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [registro, setRegistro] = useState(null);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    let nuevoValor = value;

    if (name === "nombre") {
      nuevoValor = value.replace(/[^a-zA-Z\s]/g, "");
    }

    if (name === "documento") {
      nuevoValor = value.replace(/\D/g, "").slice(0, 8);
    }

    if (name === "telefono") {
      nuevoValor = value.replace(/\D/g, "").slice(0, 9);

      if (nuevoValor && !nuevoValor.startsWith("9")) {
        nuevoValor = "";
      }
    }

    setFormulario((prev) => ({
      ...prev,
      [name]: nuevoValor,
    }));
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setEnviado(false);
    setError("");
    setRegistro(null);

    const errorValidacion = validarFormulario(formulario, t);

    if (errorValidacion) {
      setError(errorValidacion);
      setEnviando(false);
      return;
    }

    const { error: supabaseError } = await crearReclamacion(formulario);

    if (supabaseError) {
      console.error("Error al registrar reclamacion:", supabaseError);
      setError(
        `${t("claims.messages.error")} ${supabaseError.message}`,
      );
      setEnviando(false);
      return;
    }

    setRegistro(null);
    setEnviado(true);
    setFormulario(datosIniciales);
    setEnviando(false);
  };

  return (
    <div className="bg-[#0f172a] min-h-screen text-white">
      <main className="max-w-7xl mx-auto px-5 md:px-10 py-12">
        <section className="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 items-start">
          <div className="bg-[#020617] border border-[#00ffc3] rounded-2xl p-6 md:p-8 shadow-[0_0_25px_rgba(0,255,195,0.12)]">
            <div className="flex items-center gap-3 text-[#00ffc3] mb-5">
              <BookOpenCheck size={36} />
              <h1 className="text-4xl md:text-5xl font-bold">
                {t("claims.title")}
              </h1>
            </div>

            <p className="text-gray-300 leading-7 mb-6">
              {t("claims.intro")}
            </p>

            <div className="space-y-4 text-gray-300">
              <div className="flex gap-3">
                <ShieldCheck className="text-[#00ffc3] shrink-0 mt-1" />
                <p>
                  {t("claims.privacy")}
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                <h2 className="text-[#00ffc3] font-bold mb-2">
                  {t("claims.differenceTitle")}
                </h2>
                <p className="text-sm leading-6">
                  {t("claims.differenceText")}
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={manejarEnvio}
            className="bg-[#020617] border border-slate-700 rounded-2xl p-6 md:p-8"
          >
            {enviado && (
              <div className="mb-6 rounded-xl border border-[#00ffc3] bg-[#00ffc3]/10 px-4 py-3 text-[#00ffc3] font-semibold">
                {t("claims.messages.success")}
                {registro?.id ? ` ${t("claims.messages.withNumber")} ${registro.id}.` : "."}
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-xl border border-red-500 bg-red-500/10 px-4 py-3 text-red-300 font-semibold">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-5">
              <label className="space-y-2">
                <span className="text-sm text-gray-300">
                  {t("claims.fields.fullName")}
                </span>
                <input
                  required
                  name="nombre"
                  value={formulario.nombre}
                  onChange={manejarCambio}
                  pattern="[A-Za-z\s]+"
                  className="modal-input"
                  placeholder={t("claims.placeholders.fullName")}
                  title={t("claims.validation.name")}
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm text-gray-300">
                  {t("claims.fields.document")}
                </span>
                <input
                  required
                  name="documento"
                  value={formulario.documento}
                  onChange={manejarCambio}
                  inputMode="numeric"
                  maxLength={8}
                  pattern="\d{8}"
                  className="modal-input"
                  placeholder={t("claims.placeholders.document")}
                  title={t("claims.validation.document")}
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm text-gray-300">
                  {t("claims.fields.phone")}
                </span>
                <input
                  required
                  name="telefono"
                  value={formulario.telefono}
                  onChange={manejarCambio}
                  inputMode="numeric"
                  maxLength={9}
                  pattern="9\d{8}"
                  className="modal-input"
                  placeholder="999999999"
                  title={t("claims.validation.phone")}
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm text-gray-300">
                  {t("claims.fields.email")}
                </span>
                <input
                  required
                  type="email"
                  name="correo"
                  value={formulario.correo}
                  onChange={manejarCambio}
                  className="modal-input"
                  placeholder={t("claims.placeholders.email")}
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm text-gray-300">
                  {t("claims.fields.address")}
                </span>
                <input
                  required
                  name="direccion"
                  value={formulario.direccion}
                  onChange={manejarCambio}
                  className="modal-input"
                  placeholder={t("claims.placeholders.address")}
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm text-gray-300">
                  {t("claims.fields.type")}
                </span>
                <select
                  name="tipo"
                  value={formulario.tipo}
                  onChange={manejarCambio}
                  className="modal-input"
                >
                  <option value="Reclamo">{t("claims.types.claim")}</option>
                  <option value="Queja">{t("claims.types.complaint")}</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm text-gray-300">
                  {t("claims.fields.product")}
                </span>
                <input
                  required
                  name="producto"
                  value={formulario.producto}
                  onChange={manejarCambio}
                  className="modal-input"
                  placeholder={t("claims.placeholders.product")}
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm text-gray-300">
                  {t("claims.fields.order")}
                </span>
                <input
                  name="pedido"
                  value={formulario.pedido}
                  onChange={manejarCambio}
                  className="modal-input"
                  placeholder={t("claims.placeholders.order")}
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm text-gray-300">
                  {t("claims.fields.detail")}
                </span>
                <textarea
                  required
                  name="detalle"
                  value={formulario.detalle}
                  onChange={manejarCambio}
                  className="modal-input min-h-32 resize-y"
                  placeholder={t("claims.placeholders.detail")}
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm text-gray-300">
                  {t("claims.fields.request")}
                </span>
                <textarea
                  required
                  name="solicitud"
                  value={formulario.solicitud}
                  onChange={manejarCambio}
                  className="modal-input min-h-28 resize-y"
                  placeholder={t("claims.placeholders.request")}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="mt-6 w-full md:w-auto bg-[#00ffc3] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#00d9a8] disabled:opacity-60 disabled:cursor-not-allowed transition inline-flex items-center justify-center gap-2"
            >
              <Send size={20} />
              {enviando ? t("claims.actions.sending") : t("claims.actions.submit")}
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default LibroReclamaciones;
