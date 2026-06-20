/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import {
  Boxes,
  CheckCircle,
  ClipboardList,
  Download,
  Gamepad2,
  PackagePlus,
  RefreshCw,
  Search,
  Truck,
  Users,
} from "lucide-react";
import { supabase } from "../../supabase/client";
import {
  iniciarSimulacionSeguimiento,
  registrarPuntoEstado,
} from "../../utils/trackingSimulation";

const ESTADOS = ["pendiente", "pagado", "enviado", "entregado"];

const PRODUCTOS = {
  juegos: {
    label: "Juegos",
    tabla: "juegos",
    nombreCampo: "nombre",
    campos: [
      "nombre",
      "plataforma",
      "categoria",
      "anio",
      "estrellas",
      "precio",
      "stock",
      "imagen",
      "descripcion",
    ],
  },
  consolas: {
    label: "Consolas",
    tabla: "consolas",
    nombreCampo: "titulo",
    campos: [
      "titulo",
      "consola",
      "precio",
      "stock",
      "imagen",
      "descripcion",
      "exclusivo",
      "limitada",
      "activo",
    ],
  },
  accesorios: {
    label: "Accesorios",
    tabla: "accesorios",
    nombreCampo: "titulo",
    campos: [
      "titulo",
      "consola",
      "precio",
      "stock",
      "imagen",
      "descripcion",
      "exclusivo",
      "limitada",
    ],
  },
};

const estadoColor = {
  pendiente: "bg-yellow-500/10 text-yellow-300 border-yellow-500/40",
  pagado: "bg-blue-500/10 text-blue-300 border-blue-500/40",
  enviado: "bg-purple-500/10 text-purple-300 border-purple-500/40",
  entregado: "bg-green-500/10 text-green-300 border-green-500/40",
};

function crearFormularioInicial(tipo) {
  return PRODUCTOS[tipo].campos.reduce((acc, campo) => {
    if (["precio", "stock", "anio"].includes(campo)) acc[campo] = "";
    else if (["exclusivo", "limitada"].includes(campo)) acc[campo] = false;
    else if (campo === "activo") acc[campo] = true;
    else acc[campo] = "";
    return acc;
  }, {});
}

function normalizarProducto(formulario) {
  return Object.fromEntries(
    Object.entries(formulario).map(([key, value]) => {
      if (["precio"].includes(key)) return [key, Number(value || 0)];
      if (["stock", "anio"].includes(key)) return [key, Number(value || 0)];
      return [key, value];
    }),
  );
}

function AdminPanel() {
  const [tab, setTab] = useState("pedidos");
  const [ordenes, setOrdenes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [comprobantes, setComprobantes] = useState([]);
  const [itemsOrden, setItemsOrden] = useState({});
  const [productoTipo, setProductoTipo] = useState("juegos");
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [formulario, setFormulario] = useState(crearFormularioInicial("juegos"));

  const cargarPanel = async () => {
    setCargando(true);
    setMensaje("");

    const [ordenesRes, usuariosRes, comprobantesRes] = await Promise.all([
      supabase
        .from("ordenes")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("profiles").select("*"),
      supabase.from("comprobantes").select("*"),
    ]);

    setOrdenes(ordenesRes.data || []);
    setUsuarios(usuariosRes.data || []);
    setComprobantes(comprobantesRes.data || []);

    const ids = (ordenesRes.data || []).map((orden) => orden.id);
    if (ids.length > 0) {
      const { data: items } = await supabase
        .from("orden_items")
        .select("*")
        .in("orden_id", ids);

      setItemsOrden(
        (items || []).reduce((acc, item) => {
          acc[item.orden_id] = [...(acc[item.orden_id] || []), item];
          return acc;
        }, {}),
      );
    } else {
      setItemsOrden({});
    }

    setCargando(false);
  };

  const cargarProductos = async (tipo = productoTipo) => {
    const config = PRODUCTOS[tipo];
    const { data, error } = await supabase
      .from(config.tabla)
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      setMensaje(`No se pudo cargar ${config.label.toLowerCase()}`);
      setProductos([]);
      return;
    }

    setProductos(data || []);
  };

  useEffect(() => {
    cargarPanel();
  }, []);

  useEffect(() => {
    cargarProductos(productoTipo);
    setFormulario(crearFormularioInicial(productoTipo));
  }, [productoTipo]);

  const resumen = useMemo(
    () => ({
      pendientes: ordenes.filter((orden) => orden.estado === "pendiente")
        .length,
      enviados: ordenes.filter((orden) => orden.estado === "enviado").length,
      usuarios: usuarios.length,
      stockBajo: productos.filter((producto) => Number(producto.stock) <= 5)
        .length,
    }),
    [ordenes, usuarios.length, productos],
  );

  const productosFiltrados = productos.filter((producto) => {
    const config = PRODUCTOS[productoTipo];
    const nombre = String(producto[config.nombreCampo] || "").toLowerCase();
    return nombre.includes(busqueda.toLowerCase());
  });

  const obtenerComprobante = (ordenId) =>
    comprobantes.find((comprobante) => comprobante.orden_id === ordenId);

  const descargarComprobante = (comprobante) => {
    if (!comprobante?.archivo_url) return;
    const { data } = supabase.storage
      .from("comprobantes")
      .getPublicUrl(comprobante.archivo_url);

    if (data?.publicUrl) window.open(data.publicUrl, "_blank");
  };

  const actualizarEstadoOrden = async (orden, nuevoEstado) => {
    setGuardando(true);
    setMensaje("");

    const { data, error } = await supabase
      .from("ordenes")
      .update({ estado: nuevoEstado })
      .eq("id", orden.id)
      .select()
      .single();

    if (error) {
      setMensaje("No se pudo actualizar el estado del pedido");
      setGuardando(false);
      return;
    }

    if (nuevoEstado === "enviado") {
      const simulacion = await iniciarSimulacionSeguimiento(data);
      setMensaje(simulacion.message);
    } else {
      await registrarPuntoEstado(data, nuevoEstado);
      setMensaje("Estado actualizado");
    }

    setOrdenes((actuales) =>
      actuales.map((item) => (item.id === data.id ? data : item)),
    );
    setGuardando(false);
  };

  const guardarProducto = async (event) => {
    event.preventDefault();
    setGuardando(true);
    setMensaje("");

    const config = PRODUCTOS[productoTipo];
    const payload = normalizarProducto(formulario);

    const { error } = await supabase.from(config.tabla).insert(payload);

    if (error) {
      setMensaje("No se pudo insertar el producto. Revisa los campos.");
      setGuardando(false);
      return;
    }

    setMensaje(`${config.label.slice(0, -1)} insertado correctamente`);
    setFormulario(crearFormularioInicial(productoTipo));
    await cargarProductos(productoTipo);
    window.dispatchEvent(new Event("stockActualizado"));
    setGuardando(false);
  };

  const actualizarStock = async (producto, stock) => {
    const config = PRODUCTOS[productoTipo];
    const nuevoStock = Math.max(0, Number(stock || 0));

    const { error } = await supabase
      .from(config.tabla)
      .update({ stock: nuevoStock })
      .eq("id", producto.id);

    if (error) {
      setMensaje("No se pudo actualizar el stock");
      return;
    }

    setProductos((actuales) =>
      actuales.map((item) =>
        item.id === producto.id ? { ...item, stock: nuevoStock } : item,
      ),
    );
    window.dispatchEvent(new Event("stockActualizado"));
  };

  const tabs = [
    { id: "pedidos", label: "Pedidos", icon: ClipboardList },
    { id: "usuarios", label: "Usuarios", icon: Users },
    { id: "catalogo", label: "Catalogo", icon: Gamepad2 },
  ];

  return (
    <main className="min-h-screen bg-[#0f172a] text-white px-4 py-8 md:px-8">
      <div className="max-w-[1500px] mx-auto space-y-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[#86E1FF] font-bold">GameHub Admin</p>
            <h1 className="text-3xl md:text-4xl font-bold">
              Panel de administracion
            </h1>
          </div>

          <button
            onClick={cargarPanel}
            className="inline-flex items-center justify-center gap-2 bg-[#86E1FF] text-black px-4 py-3 rounded-lg font-bold hover:bg-[#5C7CFA] hover:text-white transition"
          >
            <RefreshCw size={18} />
            Actualizar datos
          </button>
        </header>

        {mensaje && (
          <div className="rounded-lg border border-[#86E1FF]/40 bg-[#86E1FF]/10 px-4 py-3 text-[#86E1FF]">
            {mensaje}
          </div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <ResumenCard icon={ClipboardList} label="Pendientes" value={resumen.pendientes} />
          <ResumenCard icon={Truck} label="En envio" value={resumen.enviados} />
          <ResumenCard icon={Users} label="Usuarios" value={resumen.usuarios} />
          <ResumenCard icon={Boxes} label="Stock bajo" value={resumen.stockBajo} />
        </section>

        <nav className="flex flex-wrap gap-3 border-b border-white/10 pb-4">
          {tabs.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-3 font-bold transition ${
                  tab === item.id
                    ? "bg-[#86E1FF] text-black"
                    : "bg-[#1e293b] text-gray-300 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {cargando ? (
          <p className="text-gray-400">Cargando panel...</p>
        ) : (
          <>
            {tab === "pedidos" && (
              <PedidosTab
                ordenes={ordenes}
                itemsOrden={itemsOrden}
                obtenerComprobante={obtenerComprobante}
                descargarComprobante={descargarComprobante}
                actualizarEstadoOrden={actualizarEstadoOrden}
                guardando={guardando}
              />
            )}

            {tab === "usuarios" && <UsuariosTab usuarios={usuarios} />}

            {tab === "catalogo" && (
              <CatalogoTab
                productoTipo={productoTipo}
                setProductoTipo={setProductoTipo}
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                formulario={formulario}
                setFormulario={setFormulario}
                guardarProducto={guardarProducto}
                productosFiltrados={productosFiltrados}
                actualizarStock={actualizarStock}
                guardando={guardando}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}

function ResumenCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-[#1e293b] border border-white/10 rounded-lg p-5">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">{label}</p>
        <Icon size={20} className="text-[#86E1FF]" />
      </div>
      <p className="text-3xl font-bold mt-3">{value}</p>
    </div>
  );
}

function PedidosTab({
  ordenes,
  itemsOrden,
  obtenerComprobante,
  descargarComprobante,
  actualizarEstadoOrden,
  guardando,
}) {
  return (
    <section className="space-y-4">
      {ordenes.map((orden) => {
        const comprobante = obtenerComprobante(orden.id);
        const items = itemsOrden[orden.id] || [];

        return (
          <article
            key={orden.id}
            className="bg-[#1e293b] border border-white/10 rounded-lg p-5"
          >
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold">
                    Pedido #{String(orden.id).slice(0, 8).toUpperCase()}
                  </h2>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${
                      estadoColor[orden.estado] || estadoColor.pendiente
                    }`}
                  >
                    {orden.estado}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <Info label="Cliente" value={orden.nombre || "Sin nombre"} />
                  <Info label="Correo" value={orden.correo || "Sin correo"} />
                  <Info label="Total" value={`S/ ${Number(orden.total || 0).toFixed(2)}`} />
                  <Info label="Metodo" value={orden.metodo_pago || "N/A"} />
                  <Info label="Telefono" value={orden.telefono || "N/A"} />
                  <Info label="Direccion" value={orden.direccion || "N/A"} />
                </div>

                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span
                      key={item.id}
                      className="rounded-lg bg-black/25 px-3 py-2 text-xs text-gray-300"
                    >
                      {item.cantidad} x {item.nombre}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 min-w-[250px]">
                <label className="text-sm text-gray-400">Estado del pedido</label>
                <select
                  value={orden.estado}
                  disabled={guardando}
                  onChange={(event) =>
                    actualizarEstadoOrden(orden, event.target.value)
                  }
                  className="bg-[#0f172a] border border-white/10 rounded-lg px-3 py-3 text-white"
                >
                  {ESTADOS.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>

                <button
                  disabled={!comprobante}
                  onClick={() => descargarComprobante(comprobante)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#86E1FF] px-4 py-3 font-bold text-[#86E1FF] transition hover:bg-[#86E1FF] hover:text-black disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Download size={18} />
                  {comprobante ? "Ver comprobante" : "Sin comprobante"}
                </button>

                {orden.estado === "enviado" && (
                  <p className="flex items-center gap-2 text-xs text-purple-300">
                    <CheckCircle size={16} />
                    Simulacion GPS automatica activa
                  </p>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function UsuariosTab({ usuarios }) {
  return (
    <section className="bg-[#1e293b] border border-white/10 rounded-lg overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 border-b border-white/10 p-4 text-sm font-bold text-[#86E1FF]">
        <span>Usuario</span>
        <span>Telefono</span>
        <span>Direccion</span>
        <span>Rol</span>
        <span>ID</span>
      </div>
      {usuarios.map((usuario) => (
        <div
          key={usuario.id}
          className="grid grid-cols-1 md:grid-cols-5 gap-3 border-b border-white/5 p-4 text-sm text-gray-300 last:border-b-0"
        >
          <span>{usuario.nombre || usuario.email || "Sin nombre"}</span>
          <span>{usuario.telefono || "N/A"}</span>
          <span>{usuario.direccion || "N/A"}</span>
          <span>{usuario.Roles || "usuario"}</span>
          <span className="truncate">{usuario.id}</span>
        </div>
      ))}
    </section>
  );
}

function CatalogoTab({
  productoTipo,
  setProductoTipo,
  busqueda,
  setBusqueda,
  formulario,
  setFormulario,
  guardarProducto,
  productosFiltrados,
  actualizarStock,
  guardando,
}) {
  const config = PRODUCTOS[productoTipo];

  return (
    <section className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
      <form
        onSubmit={guardarProducto}
        className="bg-[#1e293b] border border-white/10 rounded-lg p-5 space-y-4"
      >
        <div className="flex items-center gap-2 text-[#86E1FF] font-bold">
          <PackagePlus size={20} />
          Insertar producto
        </div>

        <select
          value={productoTipo}
          onChange={(event) => setProductoTipo(event.target.value)}
          className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-3 py-3 text-white"
        >
          {Object.entries(PRODUCTOS).map(([key, value]) => (
            <option key={key} value={key}>
              {value.label}
            </option>
          ))}
        </select>

        {config.campos.map((campo) => {
          if (["exclusivo", "limitada", "activo"].includes(campo)) {
            return (
              <label
                key={campo}
                className="flex items-center gap-3 rounded-lg bg-[#0f172a] px-3 py-3 text-sm text-gray-300"
              >
                <input
                  type="checkbox"
                  checked={Boolean(formulario[campo])}
                  onChange={(event) =>
                    setFormulario((actual) => ({
                      ...actual,
                      [campo]: event.target.checked,
                    }))
                  }
                />
                {campo}
              </label>
            );
          }

          return (
            <input
              key={campo}
              type={["precio", "stock", "anio"].includes(campo) ? "number" : "text"}
              step={campo === "precio" ? "0.01" : undefined}
              min={["precio", "stock", "anio"].includes(campo) ? "0" : undefined}
              placeholder={campo}
              value={formulario[campo]}
              onChange={(event) =>
                setFormulario((actual) => ({
                  ...actual,
                  [campo]: event.target.value,
                }))
              }
              className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-3 py-3 text-white placeholder:text-gray-500"
            />
          );
        })}

        <button
          disabled={guardando}
          className="w-full bg-[#86E1FF] text-black px-4 py-3 rounded-lg font-bold hover:bg-[#5C7CFA] hover:text-white transition disabled:opacity-50"
        >
          Guardar en {config.label}
        </button>
      </form>

      <div className="bg-[#1e293b] border border-white/10 rounded-lg p-5 space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-bold">Stock de {config.label}</h2>
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Buscar producto"
              className="w-full md:w-[300px] bg-[#0f172a] border border-white/10 rounded-lg pl-10 pr-3 py-3 text-white"
            />
          </div>
        </div>

        <div className="space-y-3">
          {productosFiltrados.map((producto) => (
            <div
              key={producto.id}
              className="grid grid-cols-1 md:grid-cols-[1fr_120px_160px] gap-3 rounded-lg bg-[#0f172a] p-4"
            >
              <div>
                <p className="font-bold">
                  {producto[config.nombreCampo] || `Producto ${producto.id}`}
                </p>
                <p className="text-sm text-gray-400">
                  S/ {Number(producto.precio || 0).toFixed(2)}
                </p>
              </div>
              <span
                className={`inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-bold ${
                  Number(producto.stock) <= 5
                    ? "border-yellow-500/40 text-yellow-300"
                    : "border-green-500/40 text-green-300"
                }`}
              >
                Stock {producto.stock ?? 0}
              </span>
              <input
                type="number"
                min="0"
                value={producto.stock ?? 0}
                onChange={(event) => actualizarStock(producto, event.target.value)}
                className="bg-[#1e293b] border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-semibold text-gray-200 break-words">{value}</p>
    </div>
  );
}

export default AdminPanel;
