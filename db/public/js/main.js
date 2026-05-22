
// Constantes
const container = document.getElementById('products');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const dataPath = '/api/productos';

const currencyCLP = (value) => {
    try {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
    } catch (e) {
        return String(value);
    }
};

const createCard = (product) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('data-category', product.categoria || '');
    card.setAttribute('aria-label', product.nombre || 'producto');

    // inline SVG placeholder (data URI) to avoid external network requests
    const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250'><rect width='100%' height='100%' fill='%23eef2ff'/><text x='50%' y='50%' font-size='20' fill='%236b7280' dominant-baseline='middle' text-anchor='middle'>Sin imagen</text></svg>";
    const placeholder = `data:image/svg+xml;utf8,${svg}`;
    const isUrl = product.imagen && (product.imagen.startsWith('http') || product.imagen.startsWith('//'));
    const imageSrc = product.imagen ? (isUrl ? product.imagen : `/imgs/${product.imagen}`) : placeholder;
    const imageAlt = product.nombre ? `${product.nombre} imagen` : 'Sin imagen';

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

    const btn = card.querySelector('.btn-detail');
    if (btn) {
        btn.addEventListener('click', () => {
            alert(`${product.nombre}\n\n${product.descripcion}\n\nPrecio: ${currencyCLP(product.precio)}`);
        });
    }

    return card;
};

let PRODUCTS = [];

const render = (list) => {
    container.innerHTML = '';
    if (!Array.isArray(list) || list.length === 0) {
        container.innerHTML = `<p class="card-desc">No hay productos para mostrar.</p>`;
        return;
    }
    list.forEach(p => container.appendChild(createCard(p)));
};

const applyFilters = () => {
    const q = (searchInput.value || '').trim().toLowerCase();
    const cat = categorySelect.value;
    const filtered = PRODUCTS.filter(p => {
        const matchesQ = q === '' || (p.nombre && p.nombre.toLowerCase().includes(q)) || (p.categoria && p.categoria.toLowerCase().includes(q));
        const matchesCat = cat === '' || (p.categoria === cat);
        return matchesQ && matchesCat;
    });
    render(filtered);
};

const populateCategories = (items) => {
    const cats = Array.from(new Set(items.map(i => i.categoria).filter(Boolean)));
    cats.sort();
    cats.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        categorySelect.appendChild(opt);
    });
};

const loadProducts = async () => {
    try {
        const resp = await fetch(dataPath, { cache: 'no-store' });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const products = await resp.json();
        if (!Array.isArray(products)) throw new Error('JSON inválido: no es un arreglo');
        if (products.length === 0) console.warn('JSON vacío');
        PRODUCTS = products;
        populateCategories(products);
        render(products);
    } catch (err) {
        container.innerHTML = `<p class="card-desc">Error cargando productos: ${err.message}</p>`;
        console.error(err);
    }
};


// Event Listener
document.addEventListener('DOMContentLoaded', () => {
    // events
    searchInput.addEventListener('keyup', () => applyFilters());
    categorySelect.addEventListener('change', () => applyFilters());

    // Load Products
    loadProducts();
});
