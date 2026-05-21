function Card({
  imagen,
  titulo,
  consola,
}) {

  return (
    <div className="card">

      <img
        src={imagen}
        alt={titulo}
      />

      <div className="card-content">
        <h3>{titulo}</h3>
        <p>{consola}</p>
      </div>

    </div>
  );
}

export default Card;