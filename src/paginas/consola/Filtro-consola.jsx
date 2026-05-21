import { useState } from "react";

function FiltroConsolas({
    productos,
    setProductosFiltrados,
}) {
    const [busqueda, setBusqueda] =
        useState("");

    const [seleccionadas, setSeleccionadas] =
        useState([]);

    const [tipoFiltro, setTipoFiltro] =
        useState("default");

    const consolas = [
        ...new Set(
            productos.map(
                (p) => p.consola
            )
        ),
    ];

    const filtrarProductos = (
        texto,
        consolasSeleccionadas,
        tipo = tipoFiltro
    ) => {

        let filtrados =
            productos.filter(
                (producto) => {

                    const coincideConsola =
                        consolasSeleccionadas.length ===
                        0 ||
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

                    if (
                        tipo === "exclusivos"
                    ) {
                        visible =
                            visible &&
                            producto.exclusivo;
                    }

                    if (
                        tipo === "limitados"
                    ) {
                        visible =
                            visible &&
                            producto.limitada;
                    }

                    return visible;
                }
            );

        if (
            tipo === "recientes"
        ) {
            filtrados =
                [...filtrados].reverse();
        }

        setProductosFiltrados(
            filtrados
        );
    };

    const handleCheckbox = (
        consola
    ) => {

        const nuevas =
            seleccionadas.includes(
                consola
            )
                ? seleccionadas.filter(
                    (c) =>
                        c !== consola
                )
                : [
                    ...seleccionadas,
                    consola,
                ];

        setSeleccionadas(
            nuevas
        );

        filtrarProductos(
            busqueda,
            nuevas
        );
    };

    const handleBusqueda =
        (e) => {

            const texto =
                e.target.value;

            setBusqueda(
                texto
            );

            filtrarProductos(
                texto,
                seleccionadas
            );
        };

    const limpiarFiltros =
        () => {

            setBusqueda("");

            setSeleccionadas(
                []
            );

            setTipoFiltro(
                "default"
            );

            setProductosFiltrados(
                productos
            );
        };

    return (


        <aside
            className="
w-[260px]
min-w-[260px]
sticky
top-5
bg-zinc-900
text-white
p-6
rounded-2xl
"
        >

            <h2
                className="
text-center
mb-5
text-xl
font-bold
"
            >
                🎮 Filtrar Consolas
            </h2>

            <input
                type="text"
                placeholder="Buscar consola..."
                value={busqueda}
                onChange={handleBusqueda}
                className="
w-full
bg-zinc-800
rounded-lg
p-3
mb-5
outline-none
border
border-zinc-700
focus:border-cyan-400
"
            />

            <div className="space-y-2">

                {consolas.map((consola) => (

                    <label
                        key={consola}
                        className="
flex
items-center
p-2
rounded-lg
cursor-pointer
hover:bg-black
duration-200
"
                    >

                        <input
                            type="checkbox"
                            checked={seleccionadas.includes(
                                consola
                            )}
                            onChange={() =>
                                handleCheckbox(
                                    consola
                                )
                            }
                            className="
mr-3
accent-cyan-400
w-4
h-4
"
                        />

                        <span>
                            {consola}
                        </span>

                    </label>

                ))}

            </div>

            <div
                className="
mt-5
bg-zinc-950
p-3
rounded-xl
"
            >

                <div
                    className="
flex
flex-col
text-xs
"
                >

                    <label
                        className="mb-2"
                    >
                        Ordenar por
                    </label>

                    <select
                        value={tipoFiltro}
                        onChange={(e) => {

                            setTipoFiltro(
                                e.target.value
                            );

                            filtrarProductos(
                                busqueda,
                                seleccionadas,
                                e.target.value
                            );

                        }}
                        className="
bg-zinc-900
border
border-zinc-700
rounded-md
p-2
text-white
"
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

            <div
                className="
mt-5
bg-zinc-950
p-3
rounded-xl
"
            >

                <span>

                    Mostrando{" "}

                    {
                        productos.filter(
                            (p) =>

                                (
                                    seleccionadas.length === 0 ||

                                    seleccionadas.includes(
                                        p.consola
                                    )

                                )

                                &&

                                p.titulo
                                    .toLowerCase()
                                    .includes(
                                        busqueda.toLowerCase()
                                    )

                        ).length

                    }

                    productos

                </span>

            </div>

            <button
                onClick={
                    limpiarFiltros
                }
                className="
mt-5
w-full
py-3
bg-cyan-400
text-black
rounded-xl
font-bold
hover:bg-cyan-500
duration-300
"
            >

                Limpiar Filtros

            </button>

        </aside>


    );
}

export default FiltroConsolas;