
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    // Listen for language changes to update product list dynamically
    if (typeof i18next !== 'undefined') {
        i18next.on('languageChanged', (lng) => {
            renderSidebar();
            updateHeaderDropdown();
            
            // Re-render current view
            const path = window.location.pathname;
            if (path.includes('/detail')) {
                renderDetailPage();
            } else {
                // If we are showing a category, re-render it
                if (currentCategory) {
                    filterCategory(currentCategory, currentSubcategory);
                } else {
                    // Default view (Glass Products)
                    showGlass();
                }
            }
        });
    }
});

let allProducts = [];
let categories = {};
let currentCategory = null;
let currentSubcategory = null;

// Helper to get localized name
function getLocalizedName(product) {
    if (!product) return '';
    const lang = i18next.language || 'zh';
    if (lang.startsWith('en') && product.name_en) return product.name_en;
    if (lang.startsWith('ja') && product.name_ja) return product.name_ja;
    return product.name;
}

// Helper to get localized category/subcategory
function t_cat(key) {
    return i18next.t(`category.${key}`) || key;
}
function t_sub(key) {
    return i18next.t(`subcategory.${key}`) || key;
}

// Fetch products.json
async function loadProducts() {
    try {
        const response = await fetch(window.location.origin + '/assets/products.json');
        if (!response.ok) throw new Error("Failed to load products");
        allProducts = await response.json();
        
        // Organize products by category/subcategory
        organizeCategories();
        renderSidebar();
        updateHeaderDropdown(); 
        
        // Check if we are on index or detail page
        const path = window.location.pathname;
        if (path.includes('/detail')) {
            renderDetailPage();
        } else {
            // Index page
            // Check URL param for category filter
            const urlParams = new URLSearchParams(window.location.search);
            const cat = urlParams.get('category');
            if (cat) {
                if (cat === 'Glass Products') {
                    showGlass();
                } else {
                    const sub = urlParams.get('subcategory');
                    filterCategory(cat, sub);
                }
            } else {
                // Default view
                showGlass();
            }
        }
        
    } catch (e) {
        console.error(e);
    }
}

function organizeCategories() {
    categories = {};
    allProducts.forEach(p => {
        if (!categories[p.category]) {
            categories[p.category] = new Set();
        }
        if (p.subcategory) {
            categories[p.category].add(p.subcategory);
        }
    });
}

function renderSidebar() {
    const menu = document.getElementById('category-menu');
    if (!menu) return;
    
    menu.innerHTML = '';
    
    // Dynamic Categories
    for (const [catName, subcats] of Object.entries(categories)) {
        const li = document.createElement('li');
        li.className = 'sidebar-item';
        
        // Determine if this category is active
        const isActiveCat = (catName === currentCategory);
        
        let subHtml = '';
        if (subcats.size > 0) {
            // Keep submenu open if active
            const submenuClass = isActiveCat ? 'sidebar-submenu open' : 'sidebar-submenu';
            
            subHtml = `<ul class="${submenuClass}">`;
            subcats.forEach(sub => {
                const isActiveSub = (isActiveCat && sub === currentSubcategory);
                const activeClass = isActiveSub ? 'active' : '';
                
                subHtml += `<li class="sidebar-subitem">
                    <a href="javascript:void(0)" 
                       class="${activeClass}"
                       onclick="filterCategory('${catName}', '${sub}', event)">
                       ${t_sub(sub)}
                    </a>
                </li>`;
            });
            subHtml += `</ul>`;
        }
        
        const hasSub = subcats.size > 0;
        const headerClass = isActiveCat ? 'sidebar-header active' : 'sidebar-header';
        const toggleIcon = (isActiveCat && hasSub) ? '-' : '+';
        
        li.innerHTML = `
            <div class="${headerClass}" onclick="toggleSubmenu(this, '${catName}')">
                <span>${t_cat(catName)}</span>
                ${hasSub ? `<span class="sidebar-toggle">${toggleIcon}</span>` : ''}
            </div>
            ${subHtml}
        `;
        menu.appendChild(li);
    }
}

function toggleSubmenu(header, catName) {
    const submenu = header.nextElementSibling;
    if (submenu && submenu.classList.contains('sidebar-submenu')) {
        submenu.classList.toggle('open');
        const toggle = header.querySelector('.sidebar-toggle');
        if (toggle) toggle.textContent = submenu.classList.contains('open') ? '-' : '+';
    } else {
        filterCategory(catName);
    }
}

function showGlass() {
    currentCategory = 'Glass Products';
    currentSubcategory = null;
    
    const grid = document.getElementById('product-grid');
    const glassContent = document.getElementById('static-glass-products');
    const heading = document.getElementById('category-heading');
    const bcCurrent = document.getElementById('current-category');
    
    if (grid && glassContent) {
        grid.innerHTML = glassContent.innerHTML;
    }
    
    const title = i18next.t('category.glass_products') || 'Glass Products';
    if (heading) heading.textContent = title;
    if (bcCurrent) bcCurrent.textContent = title;
    
    // Update sidebar UI (Glass Products might not be in the dynamic list, handle carefully)
    updateSidebarActive('Glass Products');
}

function filterCategory(category, subcategory = null, event = null) {
    if (event) event.stopPropagation();
    
    // Check if we are on detail page
    if (window.location.pathname.includes('/detail')) {
        let url = `/products/?category=${encodeURIComponent(category)}`;
        if (subcategory) {
            url += `&subcategory=${encodeURIComponent(subcategory)}`;
        }
        window.location.href = url;
        return;
    }
    
    // Redirect Glass Products to showGlass handler
    if (category === 'Glass Products') {
        showGlass();
        return;
    }

    currentCategory = category;
    currentSubcategory = subcategory;
    
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    let filtered = allProducts.filter(p => p.category === category);
    if (subcategory) {
        filtered = filtered.filter(p => p.subcategory === subcategory);
    }
    
    filtered.forEach(p => {
        const article = document.createElement('article');
        article.className = 'card';
        const imgPath = p.images && p.images.length > 0 ? p.images[0] : '';
        const encodedImgPath = imgPath ? (window.location.origin + encodeURI(imgPath)) : '';
        
        const localizedName = getLocalizedName(p);
        
        article.innerHTML = `
            <a href="/products/detail.html?id=${p.id}">
                <div class="image-wrapper">
                    <img src="${encodedImgPath}" alt="${localizedName}">
                </div>
                <h3>${localizedName}</h3>
            </a>
        `;
        grid.appendChild(article);
    });
    
    const heading = document.getElementById('category-heading');
    const bcCurrent = document.getElementById('current-category');
    
    const catTitle = t_cat(category);
    const subTitle = subcategory ? t_sub(subcategory) : '';
    const title = subcategory ? `${catTitle} - ${subTitle}` : catTitle;
    
    if (heading) heading.textContent = title;
    if (bcCurrent) bcCurrent.textContent = title;
    
    // Re-render sidebar to update active states
    renderSidebar();
}

function updateSidebarActive(category, subcategory) {
    // This function is now largely redundant because renderSidebar handles active state based on currentCategory/currentSubcategory
    // But we keep it for showGlass or external calls if needed, or just let renderSidebar do the job.
    // Actually, showGlass calls this.
    
    if (category === 'Glass Products') {
         document.querySelectorAll('.sidebar-header').forEach(el => el.classList.remove('active'));
         document.querySelectorAll('.sidebar-subitem a').forEach(el => el.classList.remove('active'));
         return;
    }
    renderSidebar();
}

function renderDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const product = allProducts.find(p => p.id === id);
    
    if (!product) return;
    
    // Highlight sidebar
    currentCategory = product.category;
    currentSubcategory = product.subcategory;
    renderSidebar();

    const localizedName = getLocalizedName(product);
    const localizedCategory = t_cat(product.category);
    
    document.getElementById('detail-title').textContent = localizedName;
    // document.getElementById('detail-folder-name').textContent = localizedName; // Removed
    
    const bcCategory = document.getElementById('bc-category');
    const bcProduct = document.getElementById('bc-product');
    if (bcCategory) {
        // bcCategory.textContent = localizedCategory; 
        // We want a link
        bcCategory.innerHTML = `<a href="/products/?category=${encodeURIComponent(product.category)}">${localizedCategory}</a>`;
    }
    if (bcProduct) bcProduct.textContent = localizedName;
    
    const mainImg = document.getElementById('detail-main-img');
    const thumbList = document.getElementById('detail-thumbnails');
    
    if (product.images && product.images.length > 0) {
        mainImg.src = encodeURI(product.images[0]);
        
        // Clear existing thumbs if re-rendering
        thumbList.innerHTML = '';
        
        product.images.forEach((img, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'thumbnail ' + (index === 0 ? 'active' : '');
            thumb.onclick = () => {
                mainImg.src = encodeURI(img);
                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            };
            thumb.innerHTML = `<img src="${encodeURI(img)}" style="width:100%; display:block;">`;
            thumbList.appendChild(thumb);
        });
    }
    
    // Render Specs Table if available
    const productInfo = document.querySelector('.product-info');
    // Remove existing specs table if any
    const existingTable = document.getElementById('specs-table');
    if (existingTable) existingTable.remove();
    
    if (product.specs) {
        const lang = i18next.language || 'zh';
        // Get correct lang key, handle regional codes like zh-CN
        let langKey = 'zh';
        if (lang.startsWith('en')) langKey = 'en';
        else if (lang.startsWith('ja')) langKey = 'ja';
        
        const specs = product.specs[langKey];
        if (specs) {
            const table = document.createElement('table');
            table.id = 'specs-table';
            table.className = 'specs-table';
            table.style.width = '100%';
            table.style.marginTop = '20px';
            table.style.borderCollapse = 'collapse';
            
            // Add a title for specs
            const titleRow = document.createElement('tr');
            titleRow.innerHTML = `<th colspan="2" style="text-align:left; padding: 10px; background:#f9f9f9; border:1px solid #ddd;">${i18next.t('product.specs') || (langKey==='zh'?'商品属性':(langKey==='ja'?'商品属性':'Product Specs'))}</th>`;
            // table.appendChild(titleRow); // Optional, maybe just rows
            
            // Determine rows
            const entries = Object.entries(specs);
            // We want 2 columns layout like the screenshot? Or just key-value rows?
            // The screenshot shows a grid: Key | Value | Key | Value
            // That's a 4-column table (Key1, Val1, Key2, Val2).
            // Let's try to replicate that if possible, or fallback to 2 columns.
            // A 4-column layout is denser.
            
            let html = '';
            for (let i = 0; i < entries.length; i += 2) {
                const [k1, v1] = entries[i];
                const [k2, v2] = entries[i+1] || ['', ''];
                
                html += `<tr>
                    <td style="padding:8px; border:1px solid #eee; background:#fafafa; font-weight:bold;">${k1}</td>
                    <td style="padding:8px; border:1px solid #eee;">${v1}</td>
                    ${k2 ? `<td style="padding:8px; border:1px solid #eee; background:#fafafa; font-weight:bold;">${k2}</td>
                    <td style="padding:8px; border:1px solid #eee;">${v2}</td>` : '<td colspan="2" style="border:1px solid #eee;"></td>'}
                </tr>`;
            }
            table.innerHTML = html;
            
            // Insert after description
            const desc = document.querySelector('.product-desc');
            if (desc) {
                desc.parentNode.insertBefore(table, desc.nextSibling);
            }
        }
    }
}

function updateHeaderDropdown() {
    const dropdown = document.getElementById('nav-product-dropdown');
    if (!dropdown) return;
    
    dropdown.innerHTML = '';
    
    const glassLi = document.createElement('li');
    glassLi.innerHTML = `<a href="/products/?category=Glass Products">${i18next.t('category.glass_products') || 'Glass Products'}</a>`;
    dropdown.appendChild(glassLi);
    
    for (const catName of Object.keys(categories)) {
        const li = document.createElement('li');
        const catText = i18next.t(`category.${catName}`) || catName;
        li.innerHTML = `<a href="/products/?category=${encodeURIComponent(catName)}">${catText}</a>`;
        dropdown.appendChild(li);
    }
}
