/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  Boxes,
  CheckCircle,
  ClipboardList,
  Download,
  Gamepad2,
  PackagePlus,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
  Truck,
  Users,
  TrendingUp,
  FileDown,
} from "lucide-react";
import { supabase } from "../../supabase/client";
import {
  iniciarSimulacionSeguimiento,
  iniciarSimulacionGPS,
} from "../../utils/trackingSimulation";

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

function leerBorrador(clave, valorInicial) {
  try {
    const guardado = sessionStorage.getItem(clave);
    return guardado ? JSON.parse(guardado) : valorInicial;
  } catch {
    return valorInicial;
  }
}

function guardarBorrador(clave, valor) {
  sessionStorage.setItem(clave, JSON.stringify(valor));
}

function AdminPanel() {
  const [tab, setTab] = useState(() =>
    leerBorrador("gamehub-admin-tab", "pedidos"),
  );
  const [ordenes, setOrdenes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [repartidores, setRepartidores] = useState([]);
  const [comprobantes, setComprobantes] = useState([]);
  const [itemsOrden, setItemsOrden] = useState({});
  const [productoTipo, setProductoTipo] = useState(() =>
    leerBorrador("gamehub-admin-producto-tipo", "juegos"),
  );
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState(""); // Filtro pedidos
  const [filtroRepartidor, setFiltroRepartidor] = useState(""); // Filtro pedidos
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [repartidorEditando, setRepartidorEditando] = useState(null);
  const [formulario, setFormulario] = useState(() =>
    leerBorrador(
      "gamehub-admin-formulario-producto",
      crearFormularioInicial(productoTipo),
    ),
  );
  const [formRepartidor, setFormRepartidor] = useState(() =>
    leerBorrador("gamehub-admin-formulario-repartidor", {
      nombre: "",
      telefono: "",
      foto_url: "",
      rating: 5,
    }),
  );

  const cargarPanel = async () => {
    setCargando(true);
    setMensaje("");

    const [ordenesRes, usuariosRes, comprobantesRes, repartidoresRes] =
      await Promise.all([
        supabase
          .from("ordenes")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("profiles").select("*"),
        supabase.from("comprobantes").select("*"),
        supabase.from("repartidores").select("*"),
      ]);

    setOrdenes(ordenesRes.data || []);
    setUsuarios(usuariosRes.data || []);
    setComprobantes(comprobantesRes.data || []);
    setRepartidores(repartidoresRes.data || []);

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
  }, [productoTipo]);

  useEffect(() => {
    guardarBorrador("gamehub-admin-tab", tab);
  }, [tab]);

  useEffect(() => {
    guardarBorrador("gamehub-admin-producto-tipo", productoTipo);
  }, [productoTipo]);

  useEffect(() => {
    guardarBorrador("gamehub-admin-formulario-producto", formulario);
  }, [formulario]);

  useEffect(() => {
    guardarBorrador("gamehub-admin-formulario-repartidor", formRepartidor);
  }, [formRepartidor]);

  // Estadísticas mejoradas
  const resumen = useMemo(() => {
    const hoy = new Date().toISOString().split("T")[0];
    const ordenesHoy = ordenes.filter((o) => o.created_at.startsWith(hoy));
    const ventasHoy = ordenesHoy.reduce(
      (sum, o) => sum + (Number(o.total) || 0),
      0,
    );
    const ratingPromedio =
      repartidores.length > 0
        ? (
            repartidores.reduce((sum, r) => sum + (r.rating || 0), 0) /
            repartidores.length
          ).toFixed(1)
        : 0;

    return {
      pendientes: ordenes.filter((orden) => orden.estado === "pendiente")
        .length,
      enviados: ordenes.filter((orden) => orden.estado === "enviado").length,
      usuarios: usuarios.length,
      stockBajo: productos.filter((producto) => Number(producto.stock) <= 5)
        .length,
      ventasHoy: ventasHoy.toFixed(2),
      ratingPromedio,
    };
  }, [ordenes, usuarios.length, productos, repartidores]);

  const productosFiltrados = productos.filter((producto) => {
    const config = PRODUCTOS[productoTipo];
    const nombre = String(producto[config.nombreCampo] || "").toLowerCase();
    return nombre.includes(busqueda.toLowerCase());
  });

  // Filtrar pedidos
  const pedidosFiltrados = ordenes.filter((orden) => {
    const cumpleFiltroEstado = !filtroEstado || orden.estado === filtroEstado;
    const cumpleFiltroRepartidor =
      !filtroRepartidor || orden.repartidor_id === filtroRepartidor;
    const cumpleBusqueda =
      !busqueda ||
      orden.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      orden.id.toLowerCase().includes(busqueda.toLowerCase());

    return cumpleFiltroEstado && cumpleFiltroRepartidor && cumpleBusqueda;
  });

  const obtenerComprobante = (ordenId) =>
    comprobantes.find((comprobante) => comprobante.orden_id === ordenId);

  const cambiarProductoTipo = (tipo) => {
    setProductoTipo(tipo);
    setFormulario(crearFormularioInicial(tipo));
    setProductoEditando(null);
  };

  const descargarComprobante = (comprobante) => {
    if (!comprobante?.archivo_url) return;
    const { data } = supabase.storage
      .from("comprobantes")
      .getPublicUrl(comprobante.archivo_url);

    if (data?.publicUrl) window.open(data.publicUrl, "_blank");
  };

  const asignarRepartidor = async (ordenId, repartidorId) => {
    await supabase
      .from("ordenes")
      .update({ repartidor_id: repartidorId })
      .eq("id", ordenId);

    setOrdenes((actuales) =>
      actuales.map((item) =>
        item.id === ordenId ? { ...item, repartidor_id: repartidorId } : item,
      ),
    );
  };

  const actualizarRolUsuario = async (usuarioId, nuevoRol) => {
    setGuardando(true);
    setMensaje("");

    const { data, error } = await supabase
      .from("profiles")
      .update({ Roles: nuevoRol })
      .eq("id", usuarioId)
      .select("*")
      .maybeSingle();

    if (error) {
      setMensaje(`No se pudo actualizar el rol: ${error.message}`);
      setGuardando(false);
      return;
    }

    if (!data) {
      setMensaje(
        "No se pudo actualizar el rol. Revisa los permisos de Supabase para la tabla profiles.",
      );
      setGuardando(false);
      return;
    }

    setUsuarios((actuales) =>
      actuales.map((usuario) =>
        usuario.id === usuarioId ? { ...usuario, ...data } : usuario,
      ),
    );
    window.dispatchEvent(new Event("gamehub-profile-updated"));
    setMensaje("Rol de usuario actualizado");
    setGuardando(false);
  };

  const actualizarEstadoOrden = async (orden, nuevoEstado) => {
    const estadoNormalizado = nuevoEstado.toLowerCase();
    setGuardando(true);
    setMensaje("");

    try {
      const { error } = await supabase
        .from("ordenes")
        .update({ estado: estadoNormalizado })
        .eq("id", orden.id)
        .select();

      if (error) {
        setMensaje(`Error: ${error.message}`);
        setGuardando(false);
        return;
      }

      if (estadoNormalizado === "entregado" && orden.repartidor_id) {
        const repartidor = repartidores.find(
          (r) => r.id === orden.repartidor_id,
        );

        if (repartidor) {
          await supabase
            .from("repartidores")
            .update({
              ordenes_entregadas: (repartidor.ordenes_entregadas || 0) + 1,
            })
            .eq("id", orden.repartidor_id)
            .select();

          setRepartidores((actuales) =>
            actuales.map((rep) =>
              rep.id === orden.repartidor_id
                ? {
                    ...rep,
                    ordenes_entregadas: (rep.ordenes_entregadas || 0) + 1,
                  }
                : rep,
            ),
          );
        }
      }

      const { data: ordenActualizada } = await supabase
        .from("ordenes")
        .select("*")
        .eq("id", orden.id)
        .single();

      if (estadoNormalizado === "enviado" && ordenActualizada) {
        const resultado = await iniciarSimulacionSeguimiento(ordenActualizada);

        if (resultado.ok) {
          await iniciarSimulacionGPS(ordenActualizada);
        }
      }

      setOrdenes((actuales) =>
        actuales.map((item) =>
          item.id === orden.id ? { ...item, estado: estadoNormalizado } : item,
        ),
      );
      setMensaje("Estado actualizado");
      setGuardando(false);

      setTimeout(() => cargarPanel(), 500);
    } catch (err) {
      console.error("Error:", err);
      setMensaje("Error al actualizar");
      setGuardando(false);
    }
  };

  const guardarProducto = async (event) => {
    event.preventDefault();
    setGuardando(true);
    setMensaje("");

    const config = PRODUCTOS[productoTipo];
    const payload = normalizarProducto(formulario);

    const consulta = productoEditando
      ? supabase
          .from(config.tabla)
          .update(payload)
          .eq("id", productoEditando.id)
          .select()
      : supabase.from(config.tabla).insert(payload);

    const { error } = await consulta;

    if (error) {
      setMensaje(`No se pudo guardar el producto: ${error.message}`);
      setGuardando(false);
      return;
    }

    setMensaje(
      productoEditando
        ? `${config.label.slice(0, -1)} actualizado correctamente`
        : `${config.label.slice(0, -1)} insertado correctamente`,
    );
    setFormulario(crearFormularioInicial(productoTipo));
    setProductoEditando(null);
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

  const editarProducto = (producto) => {
    const config = PRODUCTOS[productoTipo];
    const formularioInicial = crearFormularioInicial(productoTipo);
    const formularioEditado = config.campos.reduce((acc, campo) => {
      acc[campo] = producto[campo] ?? formularioInicial[campo];
      return acc;
    }, {});

    setProductoEditando(producto);
    setFormulario(formularioEditado);
    setMensaje(`${config.label.slice(0, -1)} cargado para editar`);
  };

  const eliminarProducto = async (producto) => {
    const config = PRODUCTOS[productoTipo];
    setGuardando(true);
    setMensaje("");

    const { data, error } = await supabase
      .from(config.tabla)
      .delete()
      .eq("id", producto.id)
      .select("id")
      .maybeSingle();

    if (error) {
      setMensaje(`No se pudo eliminar el producto: ${error.message}`);
      setGuardando(false);
      return;
    }

    if (!data) {
      setMensaje(
        `No se pudo eliminar el producto. Revisa los permisos de Supabase para la tabla ${config.tabla}.`,
      );
      setGuardando(false);
      return;
    }

    setProductos((actuales) =>
      actuales.filter((item) => item.id !== producto.id),
    );

    if (productoEditando?.id === producto.id) {
      setProductoEditando(null);
      setFormulario(crearFormularioInicial(productoTipo));
    }

    setMensaje(`${config.label.slice(0, -1)} eliminado correctamente`);
    window.dispatchEvent(new Event("stockActualizado"));
    setGuardando(false);
  };

  const guardarRepartidor = async (event) => {
    event.preventDefault();
    setGuardando(true);
    setMensaje("");

    if (!formRepartidor.nombre || !formRepartidor.telefono) {
      setMensaje("Nombre y teléfono son obligatorios");
      setGuardando(false);
      return;
    }

    if (!/^9\d{8}$/.test(formRepartidor.telefono)) {
      setMensaje(
        "El teléfono del repartidor debe tener 9 dígitos y empezar con 9",
      );
      setGuardando(false);
      return;
    }

    if (repartidorEditando) {
      // Editar
      const { error } = await supabase
        .from("repartidores")
        .update({
          nombre: formRepartidor.nombre,
          telefono: formRepartidor.telefono,
          foto_url: formRepartidor.foto_url,
          rating: Number(formRepartidor.rating),
        })
        .eq("id", repartidorEditando.id)
        .select();

      if (error) {
        setMensaje("No se pudo actualizar el repartidor");
        setGuardando(false);
        return;
      }

      setMensaje("Repartidor actualizado correctamente");
      setRepartidorEditando(null);
    } else {
      // Crear
      const { error } = await supabase.from("repartidores").insert({
        nombre: formRepartidor.nombre,
        telefono: formRepartidor.telefono,
        foto_url:
          formRepartidor.foto_url ||
          `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 100)}`,
        rating: Number(formRepartidor.rating),
      });

      if (error) {
        setMensaje("No se pudo agregar el repartidor");
        setGuardando(false);
        return;
      }

      setMensaje("Repartidor agregado correctamente");
    }

    setFormRepartidor({ nombre: "", telefono: "", foto_url: "", rating: 5 });
    await cargarPanel();
    setGuardando(false);
  };

  const editarRepartidor = (repartidor) => {
    setRepartidorEditando(repartidor);
    setFormRepartidor({
      nombre: repartidor.nombre,
      telefono: repartidor.telefono,
      foto_url: repartidor.foto_url,
      rating: repartidor.rating,
    });
  };

  const eliminarRepartidor = async (repartidor) => {
    setGuardando(true);
    setMensaje("");

    const { error } = await supabase
      .from("repartidores")
      .delete()
      .eq("id", repartidor.id);

    if (error) {
      setMensaje("No se pudo eliminar el repartidor");
      setGuardando(false);
      return;
    }

    setRepartidores((actuales) =>
      actuales.filter((item) => item.id !== repartidor.id),
    );
    setMensaje("Repartidor eliminado correctamente");
    setGuardando(false);
  };

  const generarReportePDF = async () => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.onload = () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const hoy = new Date().toLocaleDateString("es-PE");

      // Encabezado
      doc.setFillColor(134, 225, 255);
      doc.rect(0, 0, 210, 25, "F");
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(20);
      doc.text("REPORTE DE VENTAS", 105, 15, { align: "center" });

      // Fecha
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(10);
      doc.text(`Generado: ${hoy}`, 15, 35);
      doc.text(`Total de órdenes: ${ordenes.length}`, 15, 42);

      // Tabla
      let y = 55;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont(undefined, "bold");
      doc.text("Pedido", 15, y);
      doc.text("Cliente", 45, y);
      doc.text("Total", 120, y);
      doc.text("Estado", 160, y);

      // Línea separadora
      doc.setDrawColor(134, 225, 255);
      doc.line(15, y + 3, 195, y + 3);

      y += 10;
      doc.setFont(undefined, "normal");
      doc.setFontSize(9);

      let totalVentas = 0;
      ordenes.forEach((orden) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.setTextColor(50, 50, 50);
        doc.text(String(orden.id).slice(0, 8), 15, y);
        doc.text(orden.nombre || "Sin nombre", 45, y);
        doc.text(`S/ ${Number(orden.total || 0).toFixed(2)}`, 120, y);
        doc.text(orden.estado, 160, y);
        totalVentas += Number(orden.total || 0);
        y += 7;
      });

      // Total
      doc.setDrawColor(134, 225, 255);
      doc.line(15, y, 195, y);
      y += 8;
      doc.setFont(undefined, "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(`TOTAL VENTAS: S/ ${totalVentas.toFixed(2)}`, 15, y);

      doc.save("reporte-ventas.pdf");
      setMensaje("PDF descargado");
    };
    document.head.appendChild(script);
  };

  const generarReporteExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Ventas");

      // Título
      worksheet.mergeCells("A1:H1");
      const titulo = worksheet.getCell("A1");
      titulo.value = "REPORTE DE VENTAS - GameHub";
      titulo.font = {
        size: 18,
        bold: true,
        color: { argb: "FFFFFFFF" },
      };
      titulo.alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      titulo.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0F172A" },
      };

      // Fecha
      worksheet.mergeCells("A2:H2");
      worksheet.getCell("A2").value =
        `Generado: ${new Date().toLocaleDateString("es-PE")}`;

      // Encabezados
      const headers = [
        "Pedido",
        "Cliente",
        "Correo",
        "Total (S/)",
        "Estado",
        "Método",
        "Teléfono",
        "Fecha",
      ];

      const headerRow = worksheet.addRow(headers);

      headerRow.eachCell((cell) => {
        cell.font = {
          bold: true,
          color: { argb: "FFFFFFFF" },
        };

        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF38BDF8" },
        };

        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
        };

        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Datos
      ordenes.forEach((orden, index) => {
        const row = worksheet.addRow([
          String(orden.id).slice(0, 8),
          orden.nombre || "Sin nombre",
          orden.correo || "",
          Number(orden.total || 0),
          orden.estado || "",
          orden.metodo_pago || "",
          orden.telefono || "",
          new Date(orden.created_at).toLocaleDateString("es-PE"),
        ]);

        // Formato moneda
        row.getCell(4).numFmt = '"S/" #,##0.00';

        // Filas alternadas
        if (index % 2 === 0) {
          row.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFF0F9FF" },
            };
          });
        }

        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      // Total
      const total = ordenes.reduce(
        (sum, orden) => sum + Number(orden.total || 0),
        0,
      );

      const totalRow = worksheet.addRow([
        "",
        "",
        "TOTAL GENERAL",
        total,
        "",
        "",
        "",
        "",
      ]);

      totalRow.font = { bold: true };

      totalRow.getCell(4).numFmt = '"S/" #,##0.00';

      totalRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFBAE6FD" },
        };
      });

      // Ancho de columnas
      worksheet.columns = [
        { width: 15 },
        { width: 25 },
        { width: 35 },
        { width: 15 },
        { width: 18 },
        { width: 18 },
        { width: 18 },
        { width: 15 },
      ];

      // Filtros
      worksheet.autoFilter = {
        from: "A3",
        to: "H3",
      };

      // Congelar encabezado
      worksheet.views = [
        {
          state: "frozen",
          ySplit: 3,
        },
      ];

      // Descargar
      const buffer = await workbook.xlsx.writeBuffer();

      saveAs(
        new Blob([buffer]),
        `reporte-ventas-${new Date().toISOString().split("T")[0]}.xlsx`,
      );

      setMensaje("Excel descargado ✓");
    } catch (error) {
      console.error(error);
      setMensaje("Error al generar Excel");
    }
  };

  const tabs = [
    { id: "pedidos", label: "Pedidos", icon: ClipboardList },
    { id: "usuarios", label: "Usuarios", icon: Users },
    { id: "repartidores", label: "Repartidores", icon: Truck },
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

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          <ResumenCard
            icon={ClipboardList}
            label="Pendientes"
            value={resumen.pendientes}
          />
          <ResumenCard icon={Truck} label="En envio" value={resumen.enviados} />
          <ResumenCard icon={Users} label="Usuarios" value={resumen.usuarios} />
          <ResumenCard
            icon={Boxes}
            label="Stock bajo"
            value={resumen.stockBajo}
          />
          <ResumenCard
            icon={TrendingUp}
            label="Ventas hoy"
            value={`S/ ${resumen.ventasHoy}`}
            highlight
          />
        </section>

        <section className="flex flex-col md:flex-row gap-3">
          <button
            onClick={generarReportePDF}
            className="bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/40 px-3 py-2 rounded-lg font-semibold text-sm transition inline-flex items-center justify-center gap-2"
          >
            <FileDown size={18} />
            PDF
          </button>
          <button
            onClick={generarReporteExcel}
            className="bg-green-600/20 hover:bg-green-600/40 text-green-300 border border-green-500/40 px-3 py-2 rounded-lg font-semibold text-sm transition inline-flex items-center justify-center gap-2"
          >
            <FileDown size={18} />
            Excel
          </button>
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
                pedidos={pedidosFiltrados}
                ordenes={ordenes}
                itemsOrden={itemsOrden}
                repartidores={repartidores}
                obtenerComprobante={obtenerComprobante}
                descargarComprobante={descargarComprobante}
                asignarRepartidor={asignarRepartidor}
                actualizarEstadoOrden={actualizarEstadoOrden}
                guardando={guardando}
                filtroEstado={filtroEstado}
                setFiltroEstado={setFiltroEstado}
                filtroRepartidor={filtroRepartidor}
                setFiltroRepartidor={setFiltroRepartidor}
                busqueda={busqueda}
                setBusqueda={setBusqueda}
              />
            )}

            {tab === "usuarios" && (
              <UsuariosTab
                usuarios={usuarios}
                actualizarRolUsuario={actualizarRolUsuario}
                guardando={guardando}
              />
            )}
            {tab === "repartidores" && (
              <RepartidoresTab
                repartidores={repartidores}
                formRepartidor={formRepartidor}
                setFormRepartidor={setFormRepartidor}
                guardarRepartidor={guardarRepartidor}
                editarRepartidor={editarRepartidor}
                eliminarRepartidor={eliminarRepartidor}
                repartidorEditando={repartidorEditando}
                setRepartidorEditando={setRepartidorEditando}
                guardando={guardando}
              />
            )}

            {tab === "catalogo" && (
              <CatalogoTab
                productoTipo={productoTipo}
                setProductoTipo={cambiarProductoTipo}
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                formulario={formulario}
                setFormulario={setFormulario}
                guardarProducto={guardarProducto}
                productoEditando={productoEditando}
                productosFiltrados={productosFiltrados}
                actualizarStock={actualizarStock}
                editarProducto={editarProducto}
                eliminarProducto={eliminarProducto}
                guardando={guardando}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}

function ResumenCard({ icon: Icon, label, value, highlight }) {
  return (
    <div
      className={`rounded-lg border p-5 ${
        highlight
          ? "bg-[#86E1FF]/10 border-[#86E1FF]/40"
          : "bg-[#1e293b] border-white/10"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">{label}</p>
        <Icon
          size={20}
          className={highlight ? "text-[#86E1FF]" : "text-[#86E1FF]"}
        />
      </div>
      <p className="text-3xl font-bold mt-3">{value}</p>
    </div>
  );
}

function PedidosTab({
  pedidos,
  ordenes,
  itemsOrden,
  repartidores,
  obtenerComprobante,
  descargarComprobante,
  asignarRepartidor,
  actualizarEstadoOrden,
  guardando,
  filtroEstado,
  setFiltroEstado,
  filtroRepartidor,
  setFiltroRepartidor,
  busqueda,
  setBusqueda,
}) {
  return (
    <section className="space-y-4">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#1e293b] border border-white/10 rounded-lg p-4">
        <div>
          <label className="text-sm text-gray-400">Buscar (cliente o ID)</label>
          <input
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-3 py-2 text-white mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-gray-400">Filtrar por estado</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-3 py-2 text-white mt-1"
          >
            <option value="">Todos los estados</option>
            {["pendiente", "pagado", "enviado", "entregado"].map((estado) => (
              <option key={estado} value={estado}>
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-400">
            Filtrar por repartidor
          </label>
          <select
            value={filtroRepartidor}
            onChange={(e) => setFiltroRepartidor(e.target.value)}
            className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-3 py-2 text-white mt-1"
          >
            <option value="">Todos los repartidores</option>
            {repartidores.map((rep) => (
              <option key={rep.id} value={rep.id}>
                {rep.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button
            onClick={() => {
              setBusqueda("");
              setFiltroEstado("");
              setFiltroRepartidor("");
            }}
            className="bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/40 px-3 py-2 rounded-lg font-semibold text-sm transition"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Pedidos */}
      <div className="space-y-4">
        {pedidos.length === 0 ? (
          <div className="bg-[#1e293b] border border-white/10 rounded-lg p-8 text-center text-gray-400">
            No hay pedidos que coincidan con los filtros
          </div>
        ) : (
          pedidos.map((orden) => {
            const comprobante = obtenerComprobante(orden.id);
            const items = itemsOrden[orden.id] || [];
            const repartidorActual = repartidores.find(
              (r) => r.id === orden.repartidor_id,
            );
            const ordenActualizada =
              ordenes.find((o) => o.id === orden.id) || orden;

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
                          {
                            pendiente:
                              "bg-yellow-500/10 text-yellow-300 border-yellow-500/40",
                            pagado:
                              "bg-blue-500/10 text-blue-300 border-blue-500/40",
                            enviado:
                              "bg-purple-500/10 text-purple-300 border-purple-500/40",
                            entregado:
                              "bg-green-500/10 text-green-300 border-green-500/40",
                          }[orden.estado] || "bg-gray-500/10"
                        }`}
                      >
                        {orden.estado.charAt(0).toUpperCase() +
                          orden.estado.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <Info
                        label="Cliente"
                        value={orden.nombre || "Sin nombre"}
                      />
                      <Info
                        label="Correo"
                        value={orden.correo || "Sin correo"}
                      />
                      <Info
                        label="Total"
                        value={`S/ ${Number(orden.total || 0).toFixed(2)}`}
                      />
                      <Info label="Metodo" value={orden.metodo_pago || "N/A"} />
                      <Info label="Telefono" value={orden.telefono || "N/A"} />
                      <Info
                        label="Direccion"
                        value={orden.direccion || "N/A"}
                      />
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
                    <label className="text-sm text-gray-400">Repartidor</label>
                    <select
                      value={orden.repartidor_id || ""}
                      onChange={(event) =>
                        asignarRepartidor(orden.id, event.target.value)
                      }
                      className="bg-[#0f172a] border border-white/10 rounded-lg px-3 py-3 text-white"
                    >
                      <option value="">Seleccionar repartidor</option>
                      {repartidores.map((rep) => (
                        <option key={rep.id} value={rep.id}>
                          {rep.nombre} ({rep.rating}⭐)
                        </option>
                      ))}
                    </select>

                    {repartidorActual && (
                      <p className="text-xs text-gray-400">
                        Asignado: {repartidorActual.nombre}
                      </p>
                    )}

                    <label className="text-sm text-gray-400">
                      Estado del pedido
                    </label>
                    <select
                      value={ordenActualizada.estado || orden.estado}
                      disabled={guardando || !orden.repartidor_id}
                      onChange={(event) =>
                        actualizarEstadoOrden(orden, event.target.value)
                      }
                      className="bg-[#0f172a] border border-white/10 rounded-lg px-3 py-3 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {["pendiente", "pagado", "enviado", "entregado"].map(
                        (estado) => (
                          <option key={estado} value={estado}>
                            {estado.charAt(0).toUpperCase() + estado.slice(1)}
                          </option>
                        ),
                      )}
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
                        Simulacion GPS activa
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

function UsuariosTab({ usuarios, actualizarRolUsuario, guardando }) {
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
          <select
            value={usuario.Roles || "usuario"}
            disabled={guardando}
            onChange={(event) =>
              actualizarRolUsuario(usuario.id, event.target.value)
            }
            className="bg-[#0f172a] border border-white/10 rounded-lg px-3 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {["usuario", "administrador"].map((rol) => (
              <option key={rol} value={rol}>
                {rol}
              </option>
            ))}
          </select>
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
  productoEditando,
  productosFiltrados,
  actualizarStock,
  editarProducto,
  eliminarProducto,
  guardando,
}) {
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

  const config = PRODUCTOS[productoTipo];

  return (
    <section className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
      <form
        onSubmit={guardarProducto}
        className="bg-[#1e293b] border border-white/10 rounded-lg p-5 space-y-4"
      >
        <div className="flex items-center gap-2 text-[#86E1FF] font-bold">
          <PackagePlus size={20} />
          {productoEditando ? "Editar producto" : "Insertar producto"}
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
              type={
                ["precio", "stock", "anio"].includes(campo) ? "number" : "text"
              }
              step={campo === "precio" ? "0.01" : undefined}
              min={
                ["precio", "stock", "anio"].includes(campo) ? "0" : undefined
              }
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
          {productoEditando ? "Actualizar" : "Guardar"} en {config.label}
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
              className="grid grid-cols-1 md:grid-cols-[1fr_190px_160px] gap-3 rounded-lg bg-[#0f172a] p-4"
            >
              <div>
                <p className="font-bold">
                  {producto[config.nombreCampo] || `Producto ${producto.id}`}
                </p>
                <p className="text-sm text-gray-400">
                  S/ {Number(producto.precio || 0).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex flex-1 items-center justify-center rounded-lg border px-3 py-2 text-sm font-bold ${
                    Number(producto.stock) <= 5
                      ? "border-yellow-500/40 text-yellow-300"
                      : "border-green-500/40 text-green-300"
                  }`}
                >
                  Stock {producto.stock ?? 0}
                </span>
                <button
                  type="button"
                  disabled={guardando}
                  onClick={() => editarProducto(producto)}
                  title="Editar producto"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#86E1FF]/50 text-[#86E1FF] transition hover:bg-[#86E1FF] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Pencil size={18} />
                </button>
                <button
                  type="button"
                  disabled={guardando}
                  onClick={() => eliminarProducto(producto)}
                  title="Eliminar producto"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-red-400/50 text-red-300 transition hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <input
                type="number"
                min="0"
                value={producto.stock ?? 0}
                onChange={(event) =>
                  actualizarStock(producto, event.target.value)
                }
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

function RepartidoresTab({
  repartidores,
  formRepartidor,
  setFormRepartidor,
  guardarRepartidor,
  editarRepartidor,
  eliminarRepartidor,
  repartidorEditando,
  setRepartidorEditando,
  guardando,
}) {
  return (
    <section className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
      {/* FORMULARIO */}
      <form
        onSubmit={guardarRepartidor}
        className="bg-[#1e293b] border border-white/10 rounded-lg p-5 space-y-4"
      >
        <div className="flex items-center gap-2 text-[#86E1FF] font-bold">
          <Truck size={20} />
          {repartidorEditando ? "Editar Repartidor" : "Agregar Repartidor"}
        </div>

        <input
          type="text"
          placeholder="Nombre completo"
          value={formRepartidor.nombre}
          onChange={(e) =>
            setFormRepartidor({ ...formRepartidor, nombre: e.target.value })
          }
          className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-3 py-3 text-white placeholder:text-gray-500"
        />

        <input
          type="tel"
          placeholder="Teléfono"
          value={formRepartidor.telefono}
          onChange={(e) =>
            setFormRepartidor({
              ...formRepartidor,
              telefono: e.target.value.replace(/\D/g, "").slice(0, 9),
            })
          }
          inputMode="numeric"
          pattern="9[0-9]{8}"
          maxLength={9}
          className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-3 py-3 text-white placeholder:text-gray-500"
        />

        <input
          type="url"
          placeholder="URL de foto (opcional)"
          value={formRepartidor.foto_url}
          onChange={(e) =>
            setFormRepartidor({ ...formRepartidor, foto_url: e.target.value })
          }
          className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-3 py-3 text-white placeholder:text-gray-500"
        />

        <div>
          <label className="text-sm text-gray-400 block mb-2">
            Rating: {formRepartidor.rating} ⭐
          </label>
          <input
            type="range"
            min="1"
            max="5"
            step="0.1"
            value={formRepartidor.rating}
            onChange={(e) =>
              setFormRepartidor({
                ...formRepartidor,
                rating: parseFloat(e.target.value),
              })
            }
            className="w-full"
          />
        </div>

        <div className="flex gap-2">
          <button
            disabled={guardando}
            className="flex-1 bg-[#86E1FF] text-black px-4 py-3 rounded-lg font-bold hover:bg-[#5C7CFA] hover:text-white transition disabled:opacity-50"
          >
            {repartidorEditando ? "Actualizar" : "Agregar"}
          </button>
          {repartidorEditando && (
            <button
              type="button"
              onClick={() => {
                setRepartidorEditando(null);
                setFormRepartidor({
                  nombre: "",
                  telefono: "",
                  foto_url: "",
                  rating: 5,
                });
              }}
              className="flex-1 bg-gray-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-gray-700 transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* LISTA */}
      <div className="bg-[#1e293b] border border-white/10 rounded-lg p-5 space-y-4">
        <h2 className="text-xl font-bold text-[#86E1FF]">
          Repartidores ({repartidores.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repartidores.map((rep) => (
            <div
              key={rep.id}
              className="bg-[#0f172a] rounded-lg p-4 border border-gray-700"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={rep.foto_url}
                  alt={rep.nombre}
                  className="w-12 h-12 rounded-full border-2 border-[#86E1FF]"
                />
                <div>
                  <p className="font-bold text-white">{rep.nombre}</p>
                  <p className="text-sm text-gray-400">{rep.telefono}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Rating:</span>
                  <span className="text-[#86E1FF] font-bold">
                    {rep.rating} ⭐
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Entregas:</span>
                  <span className="text-white font-bold">
                    {rep.ordenes_entregadas || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Estado:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      rep.activo
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {rep.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => editarRepartidor(rep)}
                  disabled={guardando}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-[#86E1FF]/50 text-[#86E1FF] px-3 py-2 font-bold transition hover:bg-[#86E1FF] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Pencil size={16} />
                  Editar
                </button>
                <button
                  onClick={() => eliminarRepartidor(rep)}
                  disabled={guardando}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-red-400/50 text-red-300 px-3 py-2 font-bold transition hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {repartidores.length === 0 && (
          <p className="text-center text-gray-400">
            No hay repartidores agregados
          </p>
        )}
      </div>
    </section>
  );
}

export default AdminPanel;
