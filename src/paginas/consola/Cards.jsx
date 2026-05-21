import { useState } from "react";
import Card from "./Card-consola";
import FiltroConsolas from "./Filtro-consola";
export const Cardsconsola= [

{
 id: 1,
titulo: "PlayStation 5",
consola: "PlayStation 5",
imagen:
"https://http2.mlstatic.com/D_NQ_NP_2X_837630-MLA81896943071_012025-F.webp",
exclusivo: false,
limitada: false,

},

{
id: 2,
titulo: "Xbox Series X",
consola: "Xbox Series X/S",
imagen:
"https://upload.wikimedia.org/wikipedia/commons/4/43/Xbox-console.jpg",
descripcion: "",
exclusivo: false,
limitada: false,
},

{
id: 3,
titulo: "Nintendo Switch",
consola: "Nintendo Switch",
imagen:
"https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Nintendo-Switch-wJoyCons-BlRd-Standing-FL.jpg/500px-Nintendo-Switch-wJoyCons-BlRd-Standing-FL.jpg",
descripcion: "",
exclusivo: false,
limitada: false,
},

{
id: 4,
titulo: "PlayStation 4",
consola: "PlayStation 4",
imagen:
"https://i.blogs.es/466006/screenshot_8094/1366_2000.jpeg",
descripcion: "",
exclusivo: false,
limitada: false,
},

{
id: 5,
titulo: "Xbox One",
consola: "Xbox One",
imagen:
"https://http2.mlstatic.com/D_NQ_NP_834546-MLA50832788403_072022-O.webp",
descripcion: "",
exclusivo: false,
limitada: false,
},

{
id: 6,
titulo: "PS5 Spider-Man Edition",
consola: "PlayStation 5",
imagen:
"https://http2.mlstatic.com/D_NQ_NP_680369-MLU72637288425_112023-O.webp",
descripcion: "Diseño edición especial",
exclusivo: true,
limitada: false,
},

{
id: 7,
titulo: "PS5 God of War Ragnarok Edition",
consola: "PlayStation 5",
imagen:
"https://dasmitec.pe/wp-content/uploads/2025/06/PLAYSTATION-5.1.jpg",
descripcion: "Edición coleccionista",
exclusivo: false,
limitada: true,
},

{
id: 8,
titulo: "PS5 Final Fantasy XVI Edition",
consola: "PlayStation 5",
imagen:
"https://bexo.com.pe/cdn/shop/files/GUEST_44d67cb9-995c-48b0-ad9b-5ba5561ead49.webp?v=1703180116",
descripcion: "Diseño inspirado en el juego",
exclusivo: true,
limitada: false,
},

{
id: 9,
titulo: "PS5 Horizon Forbidden West Edition",
consola: "PlayStation 5",
imagen:
"https://hiraoka.com.pe/media/catalog/product/1/2/128125_1_1.jpg",
descripcion: "Edición coleccionista",
exclusivo: false,
limitada: true,
},

{
id: 10,
titulo: "PS4 The Last of Us II Edition",
consola: "PlayStation 4",
imagen:
"https://m.media-amazon.com/images/I/61omLRwmFdL._SL1127_.jpg",
descripcion: "Diseño post-apocalíptico",
exclusivo: true,
limitada: false,
},

{
id: 11,
titulo: "Xbox Starfield Edition",
consola: "Xbox Series X/S",
imagen:
"https://pbs.twimg.com/media/FyyBpQZWcAApzHB.jpg",
descripcion: "Edición espacial exclusiva",
exclusivo: false,
limitada: true,
},

{
id: 12,
titulo: "Xbox Forza Motorsport Edition",
consola: "Xbox One",
imagen:
"https://consolaytablero.com/wp-content/uploads/2015/06/xbox-one-forza-6.jpg",
descripcion: "Diseño racing",
exclusivo: true,
limitada: false,
},

{
id: 13,
titulo: "Xbox One Gears of War Edition",
consola: "Xbox One",
imagen:
"https://http2.mlstatic.com/D_NQ_NP_868146-MPE31253732081_062019-O.webp",
descripcion: "Edición clásica fan",
exclusivo: false,
limitada: true,
},

{
id: 14,
titulo: "Switch Mario Edition",
consola: "Nintendo Switch",
imagen:
"https://platform.theverge.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/22298929/SM3DW_Lead.jpg",
descripcion: "Diseño rojo clásico",
exclusivo: true,
limitada: false,
},

{
id: 15,
titulo: "Switch Animal Crossing Edition",
consola: "Nintendo Switch",
imagen:
"https://i5.walmartimages.com/seo/Nintendo-Switch-Console-Animal-Crossing-New-Horizons-Special-Edition-Nintendo-Switch-System_55affe7a-3049-4c8d-a7f2-a28ef81904e0.592bc23ed8edb88c52600fabf869e44e.jpeg",
descripcion: "Diseño pastel exclusivo",
exclusivo: false,
limitada: true,
},

{
id: 16,
titulo: "Switch Pokémon Edition",
consola: "Nintendo Switch",
imagen:
"https://static.gamesmen.com.au/media/catalog/product/cache/57ddbad6affa8d28869fa47188b75842/n/i/nintendo_switch_pokemon_let_s_go_limited_edition_console_2_.jpg",
descripcion: "Edición Pikachu & Eevee",
exclusivo: true,
limitada: false,
},

];

function Consolas() {
const [
productosFiltrados,
setProductosFiltrados,
] = useState(Cardsconsola);
return (

<div
className="
flex
gap-8
p-8
"
>

<FiltroConsolas
productos={Cardsconsola}
setProductosFiltrados={
setProductosFiltrados
}
/>

<div
className="
grid
grid-cols-1
md:grid-cols-2
lg:grid-cols-4
gap-6
flex-1
"
>

{productosFiltrados.map(
(producto) => (

<Card
key={producto.id}
imagen={producto.imagen}
titulo={producto.titulo}
consola={producto.consola}
descripcion={
producto.descripcion
}
exclusivo={
producto.exclusivo
}
limitada={
producto.limitada
}
onClick={() =>
alert(
producto.titulo
)
}
/>

)
)}

</div>

</div>

);

}

export default Consolas;