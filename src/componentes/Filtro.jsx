import { useState } from "react";

function FiltroConsolas({
  productos,
  setProductosFiltrados,
}) {

  const [busqueda, setBusqueda] = useState("");
  const [seleccionadas, setSeleccionadas] =
    useState([]);
  const [tipoFiltro, setTipoFiltro] =
  useState("default");
  /* ===== CONSOLAS AUTOMÁTICAS ===== */
  const consolas = [
    ...new Set(
      productos.map(
        (producto) => producto.consola
      )
    ),
  ];

  /* ===== FILTRAR PRODUCTOS ===== */
  const filtrarProductos = (
  texto,
  consolasSeleccionadas,
  tipo = tipoFiltro
) => {

  let filtrados = productos.filter(
    (producto) => {

      const coincideConsola =
        consolasSeleccionadas.length === 0 ||
        consolasSeleccionadas.includes(
          producto.consola
        );

      const coincideTexto =
        producto.titulo
          .toLowerCase()
          .includes(
            texto.toLowerCase()
          );

      let visible =
        coincideConsola &&
        coincideTexto;

      /* ===== EXCLUSIVOS ===== */
      if (
        tipo === "exclusivos" &&
        !producto.exclusivo
      ) {
        visible = false;
      }

      /* ===== LIMITADOS ===== */
      if (
        tipo === "limitados" &&
        !producto.limitada
      ) {
        visible = false;
      }

      return visible;
    }
  );

  /* ===== RECIENTES ===== */
  if (tipo === "recientes") {
    filtrados = [...filtrados].reverse();
  }

  setProductosFiltrados(
    filtrados
  );
};
  /* ===== CHECKBOX ===== */
  const handleCheckbox = (
    consoleName
  ) => {

    let nuevasSeleccionadas;

    if (
      seleccionadas.includes(
        consoleName
      )
    ) {

      nuevasSeleccionadas =
        seleccionadas.filter(
          (item) =>
            item !== consoleName
        );

    } else {

      nuevasSeleccionadas = [
        ...seleccionadas,
        consoleName,
      ];
    }

    setSeleccionadas(
      nuevasSeleccionadas
    );

    filtrarProductos(
      busqueda,
      nuevasSeleccionadas
    );
  };
  

  /* ===== BUSCADOR ===== */
  const handleBusqueda = (e) => {

    const texto =
      e.target.value;

    setBusqueda(texto);

    filtrarProductos(
      texto,
      seleccionadas
    );
  };
  const limpiarFiltros = () => {

  setBusqueda("");

  setSeleccionadas([]);

  setTipoFiltro("default");

  setProductosFiltrados(productos);
};

  return (
    <aside className="filter-container">

      {/* TITULO */}
      <div className="filter-title">
        🎮 Filtrar Consolas
      </div>

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar consola..."
        value={busqueda}
        onChange={
          handleBusqueda
        }
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "10px",
        }}
      />

      {/* CHECKBOXES AUTOMÁTICOS */}
      {consolas.map(
        (consolea) => (

          <label
            className="filter-option"
            key={consolea}
          >

            <input
              type="checkbox"
              checked={seleccionadas.includes(
                consolea
              )}
              onChange={() =>
                handleCheckbox(
                  consolea
                )
              }
            />

            <span className="console-name">
              {consolea}
            </span>

          </label>
        )
      )
      }
      {/* FILTRO POR TIPO */}
<div className="top-bar">

  <div className="control">

    <label>
      Ordenar por
    </label>

    <select
      value={tipoFiltro}
      onChange={(e) => {

        const valor =
          e.target.value;

        setTipoFiltro(valor);

        filtrarProductos(
          busqueda,
          seleccionadas,
          valor
        );
      }}
    >

      <option value="default">
        Recomendados
      </option>

      <option value="recientes">
        Más recientes
      </option>

      <option value="exclusivos">
        Solo exclusivos
      </option>

      <option value="limitados">
        Solo limitados
      </option>

    </select>

  </div>

</div>

      {/* CONTADOR */}
      <div className="top-bar">

        <div className="top-left">

          <span>
            Mostrando{" "}
            {
              productos.filter(
                (producto) => {

                  const coincideConsola =
                    seleccionadas.length ===
                    0 ||
                    seleccionadas.includes(
                      producto.consola
                    );

                  const coincideTexto =
                    producto.titulo
                      .toLowerCase()
                      .includes(
                        busqueda.toLowerCase()
                      );

                  return (
                    coincideConsola &&
                    coincideTexto
                  );
                }
              ).length
            }{" "}
            productos
          </span>

        </div>
      </div>

      {/* BOTON */}
     <button
  className="apply-btn"
  onClick={limpiarFiltros}
>
  Limpiar Filtros
</button>

    </aside>
  );
}

export default FiltroConsolas;