import Card from "./Card";

function Consolas({ productos }) {

  return (
    <div className="consolas-div">

      {productos.map((producto) => (

        <Card
          key={producto.id}
          imagen={producto.imagen}
          titulo={producto.titulo}
          consola={producto.consola}
        />

      ))}

    </div>
  );
}

export default Consolas;