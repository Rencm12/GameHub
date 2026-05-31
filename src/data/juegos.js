const juegos = [
  {
    id: 1,
    nombre: "Elden Ring",
    precio: 289.9,
    plataforma: "PS5",
    categoria: "Aventura",
    anio: 2022,
    imagen:
      "https://yadimania.com/wp-content/uploads/2024/09/Elden-Ring-PS5.jpg",
    estrellas: "⭐⭐⭐⭐⭐",
    descripcion:
      "Explora un mundo oscuro lleno de criaturas épicas y combates intensos.",
  },
  {
    id: 2,
    nombre: "EA Sports FC 24",
    precio: 249.9,
    plataforma: "PS5",
    categoria: "Deportes",
    anio: 2023,
    imagen: "https://media.falabella.com/falabellaPE/124582209_01/fit=pad",
    estrellas: "⭐⭐⭐⭐☆",
    descripcion:
      "Disfruta del fútbol más realista con gráficos impresionantes y jugabilidad mejorada.",
  },
  {
    id: 3,
    nombre: "Zelda TOTK",
    precio: 299.9,
    plataforma: "Nintendo",
    categoria: "Aventura",
    anio: 2023,
    imagen:
      "https://promart.vteximg.com.br/arquivos/ids/6999058-1000-1000/image-beddd29763f04bdcad024285c7129db4.jpg?v=638194335732670000",
    estrellas: "⭐⭐⭐⭐⭐",
    descripcion:
      "Embárcate en una nueva aventura en el reino de Hyrule con gráficos mejorados y una historia épica.",
  },
  {
    id: 4,
    nombre: "Spider-Man 2",
    precio: 279.9,
    plataforma: "PS5",
    categoria: "Acción",
    anio: 2023,
    imagen:
      "https://media.falabella.com/falabellaPE/125259841_02/w=1500,h=1500,fit=cover",
    estrellas: "⭐⭐⭐⭐⭐",
    descripcion:
      "Balanceate por Nueva York con Peter Parker y Miles Morales en una aventura llena de acción.",
  },
  {
    id: 5,
    nombre: "God of War Ragnarok",
    precio: 259.9,
    plataforma: "PS5",
    categoria: "Acción",
    anio: 2022,
    imagen:
      "https://estilospe.vtexassets.com/arquivos/ids/3592284-800-800?v=638909581764800000&width=800&height=800&aspect=true",
    estrellas: "⭐⭐⭐⭐⭐",
    descripcion:
      "Kratos y Atreus enfrentan nuevos peligros en una historia inspirada en la mitología nórdica.",
  },
  {
    id: 6,
    nombre: "Halo Infinite",
    precio: 199.9,
    plataforma: "Xbox",
    categoria: "Acción",
    anio: 2021,
    imagen:
      "https://http2.mlstatic.com/D_Q_NP_714840-MLA99454348852_112025-O.webp",
    estrellas: "⭐⭐⭐⭐☆",
    descripcion:
      "Acompaña al Jefe Maestro en una batalla intensa para proteger a la humanidad.",
  },
  {
    id: 7,
    nombre: "Forza Horizon 5",
    precio: 229.9,
    plataforma: "Xbox",
    categoria: "Deportes",
    anio: 2021,
    imagen:
      "https://i5.walmartimages.com.mx/samsmx/images/product-images/img_large/980032381l.jpg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
    estrellas: "⭐⭐⭐⭐⭐",
    descripcion:
      "Conduce autos increíbles en un mundo abierto inspirado en paisajes de México.",
  },
  {
    id: 8,
    nombre: "Mario Kart 8 Deluxe",
    precio: 239.9,
    plataforma: "Nintendo",
    categoria: "Deportes",
    anio: 2017,
    imagen:
      "https://media.falabella.com/falabellaPE/120426206_01/w=1500,h=1500,fit=cover",
    estrellas: "⭐⭐⭐⭐⭐",
    descripcion:
      "Compite en carreras llenas de diversión con personajes clásicos de Nintendo.",
  },
  {
    id: 9,
    nombre: "Super Mario Odyssey",
    precio: 229.9,
    plataforma: "Nintendo",
    categoria: "Aventura",
    anio: 2017,
    imagen:
      "https://media.falabella.com/falabellaPE/114083513_01/w=1500,h=1500,fit=cover",
    estrellas: "⭐⭐⭐⭐⭐",
    descripcion:
      "Acompaña a Mario en una aventura por mundos coloridos llenos de secretos.",
  },
  {
    id: 10,
    nombre: "Resident Evil 4 Remake",
    precio: 219.9,
    plataforma: "PS5",
    categoria: "Acción",
    anio: 2023,
    imagen:
      "https://media.falabella.com/falabellaPE/119286335_01/w=1500,h=1500,fit=cover",
    estrellas: "⭐⭐⭐⭐⭐",
    descripcion:
      "Sobrevive a una peligrosa misión de rescate con terror, acción y suspenso.",
  },
  {
    id: 11,
    nombre: "FIFA 23",
    precio: 179.9,
    anio: 2022,
    plataforma: "Xbox",
    categoria: "Deportes",
    imagen:
      "https://i5.walmartimages.com/seo/FIFA-23-Xbox-Series-X_462f8364-9770-46e1-97ab-c86abd6fe1bb.a996fbace217321a59ed731694bd0440.jpeg",
    estrellas: "⭐⭐⭐⭐☆",
    descripcion:
      "Vive partidos emocionantes con equipos, estadios y modos de juego populares.",
  },
  {
    id: 12,
    nombre: "Pokemon Scarlet",
    precio: 249.9,
    plataforma: "Nintendo",
    categoria: "Aventura",
    anio: 2022,
    imagen: "https://i.ebayimg.com/images/g/r5gAAOSwx7loN50p/s-l1600.webp",
    estrellas: "⭐⭐⭐⭐☆",
    descripcion:
      "Explora una región abierta, captura Pokémon y vive una nueva aventura como entrenador.",
  },
  {
    id: 13,
    nombre: "The Last of Us Part I",
    precio: 249.9,
    plataforma: "PS5",
    categoria: "Aventura",
    anio: 2022,
    imagen:
      "https://promart.vteximg.com.br/arquivos/ids/6508906-1000-1000/imageUrl_1.jpg?v=637977057329530000",
    estrellas: "⭐⭐⭐⭐⭐",
    descripcion:
      "Acompaña a Joel y Ellie en una historia intensa de supervivencia y emoción.",
  },
  {
    id: 14,
    nombre: "Mortal Kombat 1",
    precio: 239.9,
    plataforma: "PS5",
    categoria: "Acción",
    anio: 2023,
    imagen:
      "https://simple.ripley.com.pe/product/_next/image?url=https%3A%2F%2Frimage.ripley.com.pe%2Fhome.ripley%2FAttachment%2FMKP%2F2239%2FPMP20000100390%2Ffull_image-1.jpeg&w=3840&q=100",
    estrellas: "⭐⭐⭐⭐☆",
    descripcion:
      "Peleas brutales, nuevos personajes y combates espectaculares.",
  },
  {
    id: 15,
    nombre: "Gran Turismo 7",
    precio: 229.9,
    plataforma: "PS5",
    categoria: "Deportes",
    anio: 2022,
    imagen:
      "https://media.falabella.com/falabellaPE/124801368_01/w=1200,h=1200,fit=pad",
    estrellas: "⭐⭐⭐⭐⭐",
    descripcion:
      "Vive carreras realistas con autos detallados y circuitos desafiantes.",
  },
  {
    id: 16,
    nombre: "Starfield",
    precio: 259.9,
    plataforma: "Xbox",
    categoria: "Aventura",
    anio: 2023,
    imagen:
      "https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MP_150680397?x=536&y=402&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=536&ey=402&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=536&cdy=402",
    estrellas: "⭐⭐⭐⭐☆",
    descripcion:
      "Explora planetas, completa misiones y descubre secretos en el espacio.",
  },
  {
    id: 17,
    nombre: "Gears 5",
    precio: 159.9,
    plataforma: "Xbox",
    categoria: "Acción",
    anio: 2019,
    imagen:
      "https://media.gamestop.com/i/gamestop/11094778/Gears-5---Xbox-One?w=768&h=768&fmt=auto",
    estrellas: "⭐⭐⭐⭐☆",
    descripcion:
      "Combate enemigos en una campaña llena de acción y escenarios intensos.",
  },
  {
    id: 18,
    nombre: "NBA 2K24",
    precio: 219.9,
    plataforma: "Xbox",
    categoria: "Deportes",
    anio: 2023,
    imagen:
      "https://www.shopto.net/userdata/dcshop/images/normal/88/XBXNB02_xbxnba.jpg",
    estrellas: "⭐⭐⭐⭐☆",
    descripcion:
      "Disfruta partidos de básquet con gráficos realistas y modos competitivos.",
  },
  {
    id: 19,
    nombre: "Super Smash Bros Ultimate",
    precio: 249.9,
    plataforma: "Nintendo",
    categoria: "Acción",
    anio: 2018,
    imagen:
      "https://oechsle.vteximg.com.br/arquivos/ids/2648140-1000-1000/image-a5134f9b349841e38a1272eeb7ce6570.jpg?v=637494176786100000",
    estrellas: "⭐⭐⭐⭐⭐",
    descripcion:
      "Lucha con personajes icónicos de Nintendo en combates rápidos y divertidos.",
  },
  {
    id: 20,
    nombre: "Animal Crossing New Horizons",
    precio: 229.9,
    plataforma: "Nintendo",
    categoria: "Aventura",
    anio: 2020,
    imagen:
      "https://oechsle.vteximg.com.br/arquivos/ids/2648034-1000-1000/image-9eeec00e54a045c58e6ad14217f68b00.jpg?v=637494174871030000",
    estrellas: "⭐⭐⭐⭐⭐",
    descripcion:
      "Crea tu isla, decora tu hogar y disfruta una experiencia tranquila y creativa.",
  },
  {
    id: 21,
    nombre: "Metroid Prime Remastered",
    precio: 199.9,
    plataforma: "Nintendo",
    categoria: "Acción",
    anio: 2023,
    imagen:
      "https://promart.vteximg.com.br/arquivos/ids/6905651-1000-1000/image-46303a7ba58b4579b7e78a57fbab8ecc.jpg?v=638169959276270000",
    estrellas: "⭐⭐⭐⭐⭐",
    descripcion:
      "Explora un planeta alienígena con combates, secretos y una atmósfera de ciencia ficción.",
  },
  {
    id: 22,
    nombre: "Cyberpunk 2077",
    precio: 199.9,
    plataforma: "PS5",
    categoria: "Acción",
    anio: 2020,
    imagen:
      "https://oechsle.vteximg.com.br/arquivos/ids/18290717-1000-1000/imageUrl_1.jpg?v=638554197944730000",
    estrellas: "⭐⭐⭐⭐☆",
    descripcion:
      "Explora Night City en una aventura futurista llena de acción y decisiones.",
  },
  {
    id: 23,
    nombre: "Assassin's Creed Mirage",
    precio: 229.9,
    plataforma: "Xbox",
    categoria: "Aventura",
    anio: 2023,
    imagen: "https://image.coolblue.nl/480x360/products/1836637",
    estrellas: "⭐⭐⭐⭐☆",
    descripcion:
      "Vive una historia de sigilo, exploración y combates en una ciudad histórica.",
  },
  {
    id: 24,
    nombre: "Luigi's Mansion 3",
    precio: 219.9,
    plataforma: "Nintendo",
    categoria: "Aventura",
    anio: 2019,
    imagen:
      "https://media.falabella.com/falabellaPE/124592517_01/w=1200,h=1200,fit=pad",
    estrellas: "⭐⭐⭐⭐⭐",
    descripcion:
      "Acompaña a Luigi en una mansión encantada llena de puzzles y fantasmas.",
  },
];

export default juegos;
