
// Constantes
// Contenedor donde se van a inyectar las tarjetas de productos.
const container = document.getElementById('products');
// Input de texto para buscar por nombre o categoria.
const searchInput = document.getElementById('searchInput');
// Select para filtrar por categoria exacta.
const categorySelect = document.getElementById('categorySelect');
// Endpoint de la API que expone el JSON de productos.
const dataPath = '/api/productos';

// Variables
// Cache local de productos para filtrar sin volver a pedir al servidor.
let PRODUCTS = [];

// Formatea un numero a moneda chilena (CLP).
const currencyCLP = (value) => {
    try {
        // Intl puede fallar en navegadores antiguos o entornos restringidos.
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
    } catch (e) {
        // Fallback simple para evitar romper la UI.
        return String(value);
    }
};

// Crea el nodo HTML de una tarjeta a partir de un producto.
const createCard = (product) => {
    // Estructura base de la tarjeta.
    const card = document.createElement('article');
    // Clase para estilos.
    card.className = 'card';
    // Atributo util para futuros filtros o tests.
    card.setAttribute('data-category', product.categoria || '');
    // Etiqueta accesible con nombre del producto.
    card.setAttribute('aria-label', product.nombre || 'producto');

    // SVG inline como placeholder para evitar requests externos.
    const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250'><rect width='100%' height='100%' fill='%23eef2ff'/><text x='50%' y='50%' font-size='20' fill='%236b7280' dominant-baseline='middle' text-anchor='middle'>Sin imagen</text></svg>";
    // data URI del placeholder.
    const placeholder = `data:image/svg+xml;utf8,${svg}`;
    // Determina si la imagen es URL absoluta.
    const isUrl = product.imagen && (product.imagen.startsWith('http') || product.imagen.startsWith('//'));
    // Ruta final de la imagen, usando placeholder si no hay.
    const imageSrc = product.imagen ? (isUrl ? product.imagen : `/imgs/${product.imagen}`) : placeholder;
    // Texto alternativo para accesibilidad.
    const imageAlt = product.nombre ? `${product.nombre} imagen` : 'Sin imagen';

    // Plantilla HTML interna de la tarjeta.
    card.innerHTML = `
        <img class="card-media" src="${imageSrc}" alt="${imageAlt}">
        <div class="card-body">
            <h3 class="card-title">${product.nombre || ''}</h3>
            <div class="card-desc">${product.categoria || ''}</div>
            <p class="card-desc">${product.descripcion || ''}</p>
            <div class="card-row">
                <div class="price">${currencyCLP(product.precio || 0)}</div>
                <div class="badge ${product.disponible ? '' : 'not-available'}">${product.disponible ? 'Disponible' : 'No disponible'}</div>
            </div>
            <button type="button" class="btn-detail">Ver detalle</button>
        </div>
    `;

    // Boton para ver detalle; se agrega listener solo si existe.
    const btn = card.querySelector('.btn-detail');
    if (btn) {
        // Muestra un alert con informacion resumida del producto.
        btn.addEventListener('click', () => {
            alert(`${product.nombre}\n\n${product.descripcion}\n\nPrecio: ${currencyCLP(product.precio)}`);
        });
    }

    // Retorna la tarjeta ya construida.
    return card;
};


// Renderiza una lista de productos en el contenedor.
const render = (list) => {
    // Limpia el contenido previo.
    container.innerHTML = '';
    // Si no hay elementos, muestra un mensaje informativo.
    if (!Array.isArray(list) || list.length === 0) {
        container.innerHTML = `<p class="card-desc">No hay productos para mostrar.</p>`;
        return;
    }
    // Agrega cada tarjeta al contenedor.
    list.forEach(p => container.appendChild(createCard(p)));
};

// Aplica filtros de texto y categoria sobre PRODUCTS.
const applyFilters = () => {
    // Texto a buscar, normalizado en minusculas.
    const q = (searchInput.value || '').trim().toLowerCase();
    // Categoria seleccionada (puede ser vacia).
    const cat = categorySelect.value;
    // Filtra en memoria para respuesta rapida.
    const filtered = PRODUCTS.filter(p => {
        // Coincide si el texto esta vacio o se encuentra en nombre/categoria.
        const matchesQ = q === '' || (p.nombre && p.nombre.toLowerCase().includes(q)) || (p.categoria && p.categoria.toLowerCase().includes(q));
        // Coincide si la categoria esta vacia o es exacta.
        const matchesCat = cat === '' || (p.categoria === cat);
        return matchesQ && matchesCat;
    });
    // Render final de la lista filtrada.
    render(filtered);
};

// Llena el select de categorias con valores unicos.
const populateCategories = (items) => {
    // Extrae categorias, elimina falsy y deduplica con Set.
    const cats = Array.from(new Set(items.map(i => i.categoria).filter(Boolean)));
    // Ordena alfabeticamente.
    cats.sort();
    // Crea options y los agrega al select.
    cats.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        categorySelect.appendChild(opt);
    });
};

// Carga productos desde la API y actualiza la UI.
const loadProducts = async () => {
    try {
        // Solicita datos evitando cache para reflejar cambios recientes.
        const resp = await fetch(dataPath, { cache: 'no-store' });
        // Maneja respuestas HTTP no exitosas.
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        // Convierte a JSON.
        const products = await resp.json();
        // Valida estructura basica.
        if (!Array.isArray(products)) throw new Error('JSON inválido: no es un arreglo');
        // Log informativo si no hay data.
        if (products.length === 0) console.warn('JSON vacío');
        // Guarda en cache local.
        PRODUCTS = products;
        // Prepara el select de categorias.
        populateCategories(products);
        // Render inicial de todos los productos.
        render(products);
    } catch (err) {
        // Muestra error en la UI.
        container.innerHTML = `<p class="card-desc">Error cargando productos: ${err.message}</p>`;
        // Loggea el error para debug.
        console.error(err);
    }
};


// Event Listener
document.addEventListener('DOMContentLoaded', () => {
    // events
    // Filtra en cada tecla presionada en el input.
    searchInput.addEventListener('keyup', () => applyFilters());
    // Filtra cuando cambia la categoria.
    categorySelect.addEventListener('change', () => applyFilters());

    // Load Products
    // Carga inicial de productos al iniciar la pagina.
    loadProducts();
});
