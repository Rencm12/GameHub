import { useState } from "react";
import Card from "./Card-consola";
import FiltroConsolas from "./Filtro-consola";
import consola from "../../data/consola";

function Consolas() {
  const [productosFiltrados, setProductosFiltrados] = useState(consola);

  return (
    <div className="flex gap-8 p-8">
      <FiltroConsolas
        productos={consola}
        setProductosFiltrados={setProductosFiltrados}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
        {productosFiltrados.map((producto) => (
          <Card key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  );
}

export default Consolas;