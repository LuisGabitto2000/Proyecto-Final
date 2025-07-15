//armas
const listaDeArmas = ["Bloodhound's Fang","Uchigatana","Mohgwyn's Sacred Spear","Blasphemous Blade","Dark Moon Greatsword","Bolt of Gransax","Rivers of Blood"];

async function buscarArma(nombre) {
  try {
    const res = await fetch(`https://eldenring.fanapis.com/api/weapons?name=${encodeURIComponent(nombre)}`);
    const json = await res.json();
    return json.data[0] || null;
  } catch (error) {
    console.error("Error al buscar arma:", error);
    return null;
  }
}

async function cargarArmas(lista) {
  const contenedor = document.getElementById("contenedor-melee");

  for (const nombre of lista) {
    const arma = await buscarArma(nombre);

    if (!arma) {
      console.warn(`No se encontró el arma: ${nombre}`);
      continue; }
      const cadena = encodeURIComponent(JSON.stringify(arma));

     const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>${arma.name}</h2>
      <img src="${arma.image}" alt="${arma.name}">
      <p>${arma.description}</p>
      <button class="btn-add-fav" data-arma="${cadena}">Agregar a Favoritos</button>
    `;
    
    contenedor.appendChild(card);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarArmas(listaDeArmas);
});


//magia
const MagiasYEncantamientos = ["night comet","terra magicus","stars of ruin", "rotten breath","Ancient Dragons' Lightning Strike","Frenzied Burst","Golden Vow"];

async function buscarMagias(nombre) {
  const res = await fetch(`https://eldenring.fanapis.com/api/sorceries?name=${encodeURIComponent(nombre)}`);
  const json = await res.json();
  return json.data[0] || null;
}

async function buscarEncantamiento(nombre) {
  const res = await fetch(`https://eldenring.fanapis.com/api/incantations?name=${encodeURIComponent(nombre)}`);
  const json = await res.json();
  return json.data[0] || null;
}

async function cargarTodo(lista) {
  const contenedor = document.getElementById("contenedor-magias");

  for (const nombre of lista) {
    let resultado = await buscarMagias(nombre);
    
    

    if (!resultado) {
      resultado = await buscarEncantamiento(nombre);
      }

    if (!resultado) {
      console.warn(`No se encontró: ${nombre}`);
      continue; 
     }

    const cadena = encodeURIComponent(JSON.stringify(resultado));

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>${resultado.name}</h2>
      <img src="${resultado.image}" alt="${resultado.name}">
      <p>${resultado.description}</p>
      <button class="btn-add-fav" data-arma="${cadena}">Agregar a Favoritos</button>
    `;

    contenedor.appendChild(card);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarTodo(MagiasYEncantamientos);
});


//fav
function addWishListFromString(encoded) {
  const data = JSON.parse(decodeURIComponent(encoded));
  addWishList(data);
}

function addWishList(data) {
  console.log("Agregado a Favoritos:");
  console.log(data);

  const prodToAdd = {
    id: data.id,
    favId: Date.now(), 
    title: data.name,
    image: data.image,
    description: data.description,
  };

  if (typeof(Storage) !== "undefined") {
    localStorage.setItem(prodToAdd.favId, JSON.stringify(prodToAdd));
    alert(`${prodToAdd.title} fue agregado a Favoritos`);
    loadFavourites();
  } else {
    console.error("LocalStorage no está disponible.");
  }
}

const contenedorFavoritos = document.getElementById('contenedor-favoritos');
const seccionFavs = document.getElementById("seccion_favs");
const totalFavoritos = document.getElementById('item_cantidad');

function loadFavourites() {
  try {
    contenedorFavoritos.innerHTML = "";
    let favCount = 0;

    if (localStorage.length > 0) {
      seccionFavs.style.display = "block";

      Object.keys(localStorage).forEach(function(key) {
        try {
          const item = JSON.parse(localStorage.getItem(key));
          if (!item || !item.title) return;

          favCount++;

          contenedorFavoritos.innerHTML += `
            <div class="card-fav">
              <img src="${item.image}" alt="${item.title}">
              <h5>${item.title}</h5>
              <h5>ID: ${item.id}</h5>
              <div>
                <button onclick="eliminar(${item.favId})" class="btn-del">Eliminar ❌</button>
              </div>
            </div>
          `;
        } catch (e) {
          
        }
      });

      totalFavoritos.innerText = favCount;
    } else {
      seccionFavs.style.display = "none";
      totalFavoritos.innerText = 0;
    }
  } catch (error) {
    console.error("Error al cargar favoritos:", error);
  }
}

function eliminar(id) {
  const idx = id.toString();
  localStorage.removeItem(idx);
  loadFavourites(); 
}

function eliminarDeseados() {
  localStorage.clear();
  loadFavourites();
}

function actualizarPagina() {
  location.reload();
}

document.addEventListener("DOMContentLoaded", loadFavourites);


const btnDeleteAll = document.getElementById('delete_all');
if (btnDeleteAll) {
  btnDeleteAll.addEventListener('click', eliminarDeseados);
}


document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-add-fav")) {
    const encoded = e.target.getAttribute("data-arma");
    addWishListFromString(encoded);
  }
});