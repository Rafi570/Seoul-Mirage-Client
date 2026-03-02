/**
 * Global Elements & State
 */
const mainContent = document.getElementById('main-content');
const homeSiteContent = document.getElementById('main-site-content');
const apiProductsContainer = document.getElementById('api-products-container');

/**
 * 1. Initial Load
 */
async function init() {
    if(homeSiteContent) homeSiteContent.style.display = 'block';
    if(mainContent) mainContent.innerHTML = ''; 
    window.scrollTo(0, 0);

    try {
        const response = await fetch('http://localhost:5001/api/products');
        const result = await response.json();
        let products = Array.isArray(result) ? result : result.data;

        if (products && products.length > 0) {
            renderHomeSections(products);
        }
    } catch (error) {
        console.error("API Error:", error);
    }
}

/**
 * 2. Render Home Sections
 * Figma-r 1728px container layout borabor alignment
 */
function renderHomeSections(products) {
    if(!apiProductsContainer) return;

    apiProductsContainer.innerHTML = `
        <section style="padding: 100px 0; background: #fff;">
            <div class="container">
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px; border-bottom: 1px solid #EEEEEE; padding-bottom: 20px;">
                    <h2 style="font-family: 'Playfair Display', serif; font-size: 48px; font-weight: 700; color: #000;">Bestsellers</h2>
                    <a href="#" style="text-decoration: none; color: #000; font-weight: 600; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                        View all products <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
                <div class="grid-container">
                    ${products.slice(0, 4).map(product => productCard(product)).join('')}
                </div>
            </div>
        </section>

        <section style="background-color: rgba(235, 202, 208, 0.3); padding: 120px 0;">
            <div class="container">
                <h2 style="font-family: 'Playfair Display', serif; font-size: 48px; font-weight: 700; margin-bottom: 48px; color: #000;">Shop by Category</h2>
                <div class="grid-container" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px;">
                    <div class="category-card" style="background-image: linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.15)), url('https://i.ibb.co/sdVKD4s8/Component-1-1.png'); height: 312px; border-radius: 4px; background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                        <span>Cleansers</span>
                    </div>
                    <div class="category-card" style="background-image: linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.15)), url('https://i.ibb.co/dw8fZBJ0/Component-1-2.png'); height: 312px; border-radius: 4px; background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                        <span>Serums</span>
                    </div>
                    <div class="category-card" style="background-image: linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.15)), url('https://i.ibb.co/RTsk9RpK/Component-1-3.png'); height: 312px; border-radius: 4px; background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                        <span>Moisturizers</span>
                    </div>
                    <div class="category-card" style="background-image: linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.15)), url('https://i.ibb.co/PZKC9Ljc/Component-1-4.png'); height: 312px; border-radius: 4px; background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                        <span>Masks</span>
                    </div>
                </div>
            </div>
        </section>

        <section style="padding: 100px 0; background: #fff;">
            <div class="container">
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px; border-bottom: 1px solid #EEEEEE; padding-bottom: 20px;">
                    <h2 style="font-family: 'Playfair Display', serif; font-size: 48px; font-weight: 700; color: #000;">New Arrive</h2>
                    <a href="#" style="text-decoration: none; color: #000; font-weight: 600; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                        View all products <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
                <div class="grid-container" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px;">
                    ${products.slice(4, 8).map(product => productCard(product)).join('')}
                </div>
            </div>
        </section>
    `;
}

/**
 * 3. Product Card Component (Exact 312x347px Image Box)
 */
function productCard(product) {
    return `
        <div class="product-item" onclick="showProductDetails('${product._id}')" style="width: 100%;  cursor: pointer;">
            <div class="product-img-container" style="width: 100%; height: 347px; background: #F6F6F6; border-radius: 4px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                <img src="${product.mainImage}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; transition: 0.5s ease;">
                <button class="add-to-cart-btn">
                    <i class="fa-solid fa-bag-shopping"></i> Add to Cart
                </button>
            </div>
            
            <div style="padding: 24px 0;">
                <p style="color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">${product.category || 'Skincare'}</p>
                <h4 style="font-family: 'Raleway', sans-serif; font-size: 20px; font-weight: 600; color: #111; margin-bottom: 14px; line-height: 1.3;">${product.name}</h4>
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                    <span style="font-size: 28px; font-weight: 800; color: #000;">$${product.price}</span>
                    ${product.oldPrice ? `<span style="font-size: 18px; color: #BBBBBB; text-decoration: line-through;">$${product.oldPrice}</span>` : ''}
                </div>
                <div style="color: #000; font-size: 14px; display: flex; align-items: center; gap: 4px;">
                    <span>★★★★★</span> 
                    <span style="color: #999; margin-left: 4px;">(${product.reviews_count || 120})</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * 4. Product Details Logic
 */
async function showProductDetails(id) {
    homeSiteContent.style.display = 'none';
    window.scrollTo(0, 0);

    try {
        const response = await fetch('http://localhost:5001/api/products');
        const result = await response.json();
        let products = Array.isArray(result) ? result : result.data;
        const product = products.find(p => p._id === id);

        if (!product) return;

        mainContent.innerHTML = `
            <div class="container" style="padding: 80px 0; display: flex; gap: 60px; align-items: flex-start; max-width: 1440px;">
                
                <div style="flex: 1.2; display: flex; gap: 20px;">
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        ${(product.images || [product.mainImage]).map((img, index) => `
                            <div style="width: 85px; height: 110px; border: ${index === 0 ? '1px solid #000' : '1px solid #EEE'}; border-radius: 4px; overflow: hidden; cursor: pointer;" 
                                 onclick="document.getElementById('zoomImg').src='${img}'; this.parentElement.querySelectorAll('div').forEach(d => d.style.borderColor='#EEE'); this.style.borderColor='#000';">
                                <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                        `).join('')}
                    </div>
                    <div style="flex: 1; position: relative; background: #F9F9F9; border-radius: 4px; overflow: hidden; height: 600px;">
                        <img id="zoomImg" src="${product.mainImage}" style="width: 100%; height: 100%; object-fit: cover;">
                        <div style="position: absolute; bottom: 20px; right: 20px; background: #fff; padding: 8px; border-radius: 50%; box-shadow: 0 2px 10px rgba(0,0,0,0.1); cursor: pointer;">
                            <i class="fa-solid fa-magnifying-glass-plus"></i>
                        </div>
                    </div>
                </div>

                <div style="flex: 1;">
                    <h1 style="font-size: 32px; font-family: 'Inter', sans-serif; font-weight: 600; margin-bottom: 8px; color: #111;">${product.name}</h1>
                    
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
                        <div style="color: #000; font-size: 12px;">★★★★★</div>
                        <span style="color: #666; font-size: 13px;">${product.reviews_count || 157} Reviews</span>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                        <span style="font-size: 40px; font-weight: 700; color: #000;">$${product.price}</span>
                        <span style="font-size: 18px; color: #999; text-decoration: line-through; margin-top: 8px;">$${product.oldPrice || '99'}</span>
                    </div>
                    <p style="color: #666; font-size: 14px; margin-bottom: 32px;">🏷️ Save 50% right now</p>

                    <div style="margin-bottom: 30px;">
                        <h4 style="font-size: 18px; font-weight: 700; margin-bottom: 15px;">Details</h4>
                        <p style="font-size: 15px; font-weight: 600; margin-bottom: 20px;">${product.description}</p>
                        
                        <div style="margin-bottom: 20px;">
                            <p style="font-weight: 800; font-size: 13px; text-transform: uppercase; margin-bottom: 8px;">STRAIGHT UP:</p>
                            <p style="font-size: 14px; color: #444; line-height: 1.6;">${product.details || 'Lorem ipsum dolor sit amet consectetur. Augue dui sed sit tristique elementum.'}</p>
                        </div>

                        <div style="margin-bottom: 20px;">
                            <p style="font-weight: 800; font-size: 13px; text-transform: uppercase; margin-bottom: 10px;">THE LOWDOWN:</p>
                            <ul style="font-size: 14px; color: #444; line-height: 1.8; padding-left: 18px;">
                                <li>Helps improve the look of pores in just 1 week.</li>
                                <li>Brightens and evens skin tone with every sleep.</li>
                                <li>Kalahari Melon and Baobab Oils infuse deep, all-night hydration.</li>
                                <li>Plumps skin and improves the look of wrinkles instantly.</li>
                            </ul>
                        </div>

                        <div>
                            <p style="font-weight: 800; font-size: 13px; text-transform: uppercase; margin-bottom: 8px;">What else?!</p>
                            <p style="font-size: 14px; color: #444;">Lorem ipsum dolor sit amet consectetur. In tempus vel amet etiam vehicula in.</p>
                        </div>
                    </div>

                    <div style="display: flex; gap: 15px; align-items: center; margin-top: 40px;">
                        <div style="display: flex; align-items: center; border: 1px solid #DDD; border-radius: 4px; height: 50px;">
                            <button style="padding: 0 15px; border:none; background:none; font-size:20px; cursor:pointer;">-</button>
                            <input type="text" value="1" style="width: 40px; text-align: center; border: none; font-weight: 700; font-size: 16px;">
                            <button style="padding: 0 15px; border:none; background:none; font-size:20px; cursor:pointer;">+</button>
                        </div>
                        <button style="flex: 1; height: 50px; background: #000; color: #fff; font-size: 16px; font-weight: 600; border: none; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;">
                            Add To Cart <i class="fa-solid fa-arrow-right"></i>
                        </button>
                        <button style="width: 50px; height: 50px; border: 1px solid #DDD; border-radius: 4px; background: #fff; cursor: pointer;">
                            <i class="fa-regular fa-heart"></i>
                        </button>
                    </div>

                    <button onclick="location.reload()" style="margin-top: 30px; background: none; border: none; color: #888; text-decoration: underline; cursor: pointer; font-size: 14px;">
                        ← Back to collection
                    </button>
                </div>
            </div>
        `;
    } catch (e) {
        console.error("Error loading product details:", e);
    }
}

// Global Nav Listeners
document.querySelector('.logo a').onclick = (e) => { e.preventDefault(); init(); };

// Run App
init();