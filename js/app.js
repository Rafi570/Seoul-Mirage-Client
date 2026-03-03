/**
 * Global Elements & State
 */
const mainContent = document.getElementById("main-content");
const homeSiteContent = document.getElementById("main-site-content");
const apiProductsContainer = document.getElementById("api-products-container");

/**
 * 1. Initial Load
 */
async function init() {
  if (homeSiteContent) homeSiteContent.style.display = "block";
  if (mainContent) mainContent.innerHTML = "";
  window.scrollTo(0, 0);

  // পেজ লোড হওয়ার সাথে সাথে ড্রপডাউন আপডেট হবে
  updateNavbar();

  try {
    const response = await fetch("http://localhost:5001/api/products");
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
 * 2. Navbar & Dropdown Logic
 */
function updateNavbar() {
  const userDropdown = document.getElementById("user-dropdown");
  if (!userDropdown) return;

  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (user) {
    userDropdown.innerHTML = `
      <a href="#" style="padding: 12px 20px; font-weight: bold; border-bottom: 1px solid #eee;">Hi, ${user.name}</a>
      <a href="#" onclick="alert('Profile Coming Soon!')">My Account</a>
      <a href="#" onclick="alert('Order History Coming Soon!')">Order History</a>
      <a href="#" id="logout-btn" style="color: red; border-top: 1px solid #eee;">Logout</a>
    `;
    
    document.getElementById("logout-btn").onclick = (e) => {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");
      location.reload();
    };
  } else {
    userDropdown.innerHTML = `
      <a href="#" onclick="event.preventDefault(); showAuthPage('register')">Sign-up</a>
      <a href="#" onclick="event.preventDefault(); showAuthPage('login')">Sign in</a>
    `;
  }
}

// User Icon Click Trigger
document.getElementById("user-menu-trigger").onclick = (e) => {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById("user-dropdown").classList.toggle("show-dropdown");
};

// Close dropdown on outside click
window.addEventListener('click', (e) => {
  const dropdown = document.getElementById("user-dropdown");
  if (dropdown && !e.target.closest('.user-dropdown-container')) {
    dropdown.classList.remove("show-dropdown");
  }
});

/**
 * 3. Render Home Sections
 */
function renderHomeSections(products) {
  if (!apiProductsContainer) return;

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
                    ${products.slice(0, 4).map((product) => productCard(product)).join("")}
                </div>
            </div>
        </section>

        <section style="background-color: rgba(235, 202, 208, 0.3); padding: 120px 0;">
            <div class="container">
                <h2 style="font-family: 'Playfair Display', serif; font-size: 48px; font-weight: 700; margin-bottom: 48px; color: #000;">Shop by Category</h2>
                <div class="grid-container" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px;">
                    <div class="category-card" onclick="alert('Filtering Cleansers...')" style="background-image: linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.15)), url('https://i.ibb.co/sdVKD4s8/Component-1-1.png'); height: 312px; border-radius: 4px; background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                        <span style="color: white; font-weight: bold; font-size: 20px;">Cleansers</span>
                    </div>
                    <div class="category-card" onclick="alert('Filtering Serums...')" style="background-image: linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.15)), url('https://i.ibb.co/dw8fZBJ0/Component-1-2.png'); height: 312px; border-radius: 4px; background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                        <span style="color: white; font-weight: bold; font-size: 20px;">Serums</span>
                    </div>
                    <div class="category-card" onclick="alert('Filtering Moisturizers...')" style="background-image: linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.15)), url('https://i.ibb.co/RTsk9RpK/Component-1-3.png'); height: 312px; border-radius: 4px; background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                        <span style="color: white; font-weight: bold; font-size: 20px;">Moisturizers</span>
                    </div>
                    <div class="category-card" onclick="alert('Filtering Masks...')" style="background-image: linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.15)), url('https://i.ibb.co/PZKC9Ljc/Component-1-4.png'); height: 312px; border-radius: 4px; background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                        <span style="color: white; font-weight: bold; font-size: 20px;">Masks</span>
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
                <div class="grid-container">
                    ${products.slice(4, 8).map((product) => productCard(product)).join("")}
                </div>
            </div>
        </section>
    `;
}

/**
 * 4. Product Card Component
 */
function productCard(product) {
  return `
        <div class="product-item" onclick="showProductDetails('${product._id}')" style="width: 100%;  cursor: pointer;">
            <div class="product-img-container" style="width: 100%; height: 347px; background: #F6F6F6; border-radius: 4px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                <img src="${product.mainImage}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; transition: 0.5s ease;">
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); alert('Added to cart!')">
                    <i class="fa-solid fa-bag-shopping"></i> Add to Cart
                </button>
            </div>
            
            <div style="padding: 24px 0;">
                <p style="color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">${product.category || "Skincare"}</p>
                <h4 style="font-family: 'Raleway', sans-serif; font-size: 20px; font-weight: 600; color: #111; margin-bottom: 14px; line-height: 1.3;">${product.name}</h4>
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                    <span style="font-size: 28px; font-weight: 800; color: #000;">$${product.price}</span>
                    ${product.oldPrice ? `<span style="font-size: 18px; color: #BBBBBB; text-decoration: line-through;">$${product.oldPrice}</span>` : ""}
                </div>
            </div>
        </div>
    `;
}

/**
 * 5. Product Details Logic (Original Design Restored)
 */
async function showProductDetails(id) {
  homeSiteContent.style.display = "none";
  window.scrollTo(0, 0);

  try {
    const response = await fetch("http://localhost:5001/api/products");
    const result = await response.json();
    let products = Array.isArray(result) ? result : result.data;
    const product = products.find((p) => p._id === id);

    if (!product) return;

    mainContent.innerHTML = `
            <div class="container" style="padding: 80px 0; display: flex; gap: 60px; align-items: flex-start; max-width: 1440px;">
                
                <div style="flex: 1.2; display: flex; gap: 20px;">
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        ${(product.images || [product.mainImage])
                          .map(
                            (img, index) => `
                            <div style="width: 85px; height: 110px; border: ${index === 0 ? "1px solid #000" : "1px solid #EEE"}; border-radius: 4px; overflow: hidden; cursor: pointer;" 
                                 onclick="document.getElementById('zoomImg').src='${img}'; this.parentElement.querySelectorAll('div').forEach(d => d.style.borderColor='#EEE'); this.style.borderColor='#000';">
                                <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                        `,
                          )
                          .join("")}
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
                        ${product.oldPrice ? `<span style="font-size: 18px; color: #999; text-decoration: line-through; margin-top: 8px;">$${product.oldPrice}</span>` : ""}
                    </div>
                    <p style="color: #666; font-size: 14px; margin-bottom: 32px;">🏷️ Save 50% right now</p>

                    <div style="margin-bottom: 30px;">
                        <h4 style="font-size: 18px; font-weight: 700; margin-bottom: 15px;">Details</h4>
                        <p style="font-size: 15px; font-weight: 600; margin-bottom: 20px;">${product.description}</p>
                        
                        <div style="margin-bottom: 20px;">
                            <p style="font-weight: 800; font-size: 13px; text-transform: uppercase; margin-bottom: 8px;">STRAIGHT UP:</p>
                            <p style="font-size: 14px; color: #444; line-height: 1.6;">${product.details || "Lorem ipsum dolor sit amet consectetur. Augue dui sed sit tristique elementum."}</p>
                        </div>

                        <div style="margin-bottom: 20px;">
                            <p style="font-weight: 800; font-size: 13px; text-transform: uppercase; margin-bottom: 10px;">THE LOWDOWN:</p>
                            <ul style="font-size: 14px; color: #444; line-height: 1.8; padding-left: 18px;">
                                <li>Helps improve the look of pores in just 1 week.</li>
                                <li>Brightens and evens skin tone with every sleep.</li>
                                <li>Kalahari Melon and Baobab Oils infuse deep, all-night hydration.</li>
                            </ul>
                        </div>
                    </div>

                    <div style="display: flex; gap: 15px; align-items: center; margin-top: 40px;">
                        <div style="display: flex; align-items: center; border: 1px solid #DDD; border-radius: 4px; height: 50px;">
                            <button style="padding: 0 15px; border:none; background:none; font-size:20px; cursor:pointer;">-</button>
                            <input type="text" value="1" style="width: 40px; text-align: center; border: none; font-weight: 700; font-size: 16px;">
                            <button style="padding: 0 15px; border:none; background:none; font-size:20px; cursor:pointer;">+</button>
                        </div>
                        <button onclick="alert('Added to Cart!')" style="flex: 1; height: 50px; background: #000; color: #fff; font-size: 16px; font-weight: 600; border: none; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;">
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

/**
 * 6. Auth Page
 */
function showAuthPage(mode = "login") {
  homeSiteContent.style.display = "none";
  window.scrollTo(0, 0);

  const isLogin = mode === "login";

  mainContent.innerHTML = `
        <section style="background-color: #F3E9D9; min-height: 80vh; display: flex; flex-direction: column; align-items: center; padding: 100px 20px;">
            <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="font-size: 48px;">${isLogin ? "Sign in" : "Create Account"}</h1>
                <p>Or <a href="#" id="auth-toggle" style="text-decoration: underline; font-weight: 600;">${isLogin ? "create a new account" : "sign in"}</a></p>
            </div>
            <div style="background: #fff; width: 100%; max-width: 500px; padding: 40px; border-radius: 4px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
                <form id="auth-form" style="display: flex; flex-direction: column; gap: 20px;">
                    ${!isLogin ? `<div><label style="display: block; font-size: 13px; color: #666; margin-bottom: 8px;">Full name</label><input type="text" id="reg-name" required style="width: 100%; height: 45px; border: 1px solid #DDD; padding: 0 15px; border-radius: 4px;"></div>` : ""}
                    <div><label style="display: block; font-size: 13px; color: #666; margin-bottom: 8px;">Email address</label><input type="email" id="auth-email" required style="width: 100%; height: 45px; border: 1px solid #DDD; padding: 0 15px; border-radius: 4px;"></div>
                    <div><label style="display: block; font-size: 13px; color: #666; margin-bottom: 8px;">Password</label><div style="position: relative;"><input type="password" id="auth-pass" required style="width: 100%; height: 45px; border: 1px solid #DDD; padding: 0 15px; border-radius: 4px;"><i class="fa-regular fa-eye eye-toggle" style="position: absolute; right: 15px; top: 15px; color: #999; cursor: pointer;"></i></div></div>
                    <button type="submit" id="submit-btn" style="width: 100%; height: 50px; background: #000; color: #fff; border: none; border-radius: 4px; font-weight: 600; cursor: pointer;">${isLogin ? "Sign In" : "Create Account"}</button>
                </form>
            </div>
        </section>
    `;

  document.getElementById("auth-toggle").onclick = (e) => {
    e.preventDefault();
    showAuthPage(isLogin ? "register" : "login");
  };

  document.getElementById("auth-form").onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById("auth-email").value;
    const password = document.getElementById("auth-pass").value;
    const endpoint = isLogin ? "login" : "register";
    const payload = isLogin ? { email, password } : { name: document.getElementById("reg-name").value, email, password };

    try {
      const response = await fetch(`http://localhost:5001/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok) {
        if (!isLogin) {
          alert("Registration successful! Please sign in.");
          showAuthPage("login");
        } else {
          localStorage.setItem("token", result.token);
          localStorage.setItem("currentUser", JSON.stringify(result.user));
          location.reload();
        }
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Server error!");
    }
  };

  document.querySelector(".eye-toggle").onclick = function () {
    const passInput = document.getElementById("auth-pass");
    passInput.type = passInput.type === "password" ? "text" : "password";
  };
}

/**
 * 7. Global Listeners
 */
document.querySelector(".logo a").onclick = (e) => {
  e.preventDefault();
  init();
};

init();