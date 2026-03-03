// order.js - Full Module
console.log("order.js loaded");

/**
 * 1. Main Function: API থেকে ডাটা ফেচ করা
 */
window.showOrderHistory = async function() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const mainContentArea = document.getElementById("main-content");
    const homeContentArea = document.getElementById("main-site-content");

    if (!user) {
        alert("Please login to see your orders!");
        return;
    }

    if (homeContentArea) homeContentArea.style.display = "none";
    window.scrollTo(0, 0);

    mainContentArea.innerHTML = `<div class="container" style="padding: 100px 0; text-align:center;"><h3>Loading your orders...</h3></div>`;

    try {
        const response = await fetch(`http://localhost:5001/api/orders/user/${user.email}`);
        const orders = await response.json();

        if (!orders || orders.length === 0) {
            mainContentArea.innerHTML = `<div class="container" style="padding: 100px 0; text-align:center;"><h2>No orders found!</h2><button onclick="location.reload()" class="continue-shopping">Start Shopping</button></div>`;
            return;
        }

        renderOrderPage(orders, mainContentArea);
    } catch (error) {
        console.error("Order Error:", error);
    }
};

/**
 * 2. Render UI: অর্ডারের লিস্ট এবং সামারি কার্ড
 */
function renderOrderPage(orders, container) {
    container.innerHTML = `
        <div class="order-container container">
            <div class="order-left">
                <h1 class="order-title">Shopping Cart</h1>
                <div class="order-list">
                    ${orders.map(order => `
                        <div class="order-group" data-id="${order._id}">
                            <div class="order-header">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    ${order.status === 'Unpaid' ? 
                                        `<input type="checkbox" class="order-select-check" data-amount="${order.totalAmount}" onchange="updateDynamicSummary()" checked>` : 
                                        `<i class="fa-solid fa-circle-check" style="color: #2ecc71;"></i>`
                                    }
                                    <span class="order-id">ORDER ID: #${order._id.slice(-6).toUpperCase()}</span>
                                </div>
                                <span class="order-status ${order.status === 'Unpaid' ? 'status-unpaid' : 'status-paid'}">${order.status}</span>
                            </div>
                            ${order.items.map(item => `
                                <div class="order-item">
                                    <div class="item-img"><img src="${item.image || 'https://i.ibb.co/sdVKD4s8/Component-1-1.png'}" alt="${item.name}"></div>
                                    <div class="item-details">
                                        <h3>${item.name}</h3>
                                        <p>Qty: ${item.qty || 1} • ${new Date(order.createdAt).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}</p>
                                    </div>
                                    <div class="item-price">$${item.price}</div>
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
                <button class="continue-shopping" onclick="location.reload()"><i class="fa-solid fa-arrow-left"></i> Continue Shopping</button>
            </div>
            <div class="order-right">
                <div class="order-summary-card">
                    <h2>Order Summary</h2>
                    <div class="summary-line"><span>Subtotal</span><span id="subtotal-val">$0.00</span></div>
                    <div class="summary-line"><span>Shipping</span><span id="shipping-val">$0.00</span></div>
                    <div class="summary-line total-line"><span>Total</span><span id="total-val">$0.00</span></div>
                    <button class="checkout-btn" id="checkout-btn" onclick="handleCheckout()">Proceed to Checkout</button>
                </div>
            </div>
        </div>
    `;
    updateDynamicSummary();
}

/**
 * 3. Calculation Logic
 */
window.updateDynamicSummary = function() {
    const checkboxes = document.querySelectorAll('.order-select-check:checked');
    let subtotal = 0;
    checkboxes.forEach(box => subtotal += parseFloat(box.getAttribute('data-amount')));
    const shipping = subtotal > 0 ? 5.99 : 0;
    document.getElementById('subtotal-val').innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping-val').innerText = `$${shipping.toFixed(2)}`;
    document.getElementById('total-val').innerText = `$${(subtotal + shipping).toFixed(2)}`;
};

/**
 * 4. Checkout Logic: All Figma Fields Added
 */
window.handleCheckout = function() {
    const selectedCheckboxes = document.querySelectorAll('.order-select-check:checked');
    const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.closest('.order-group').dataset.id);
    const mainContentArea = document.getElementById("main-content");

    mainContentArea.innerHTML = `
        <div class="checkout-page" style="background: #F2E8D9; padding: 60px 0; min-height: 100vh; font-family: 'Inter', sans-serif;">
            <div class="container" style="max-width: 850px; background: #fff; padding: 50px; border-radius: 4px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
                <h1 style="font-family: 'Playfair Display', serif; font-size: 48px; margin-bottom: 40px;">Checkout</h1>
                <h3 style="font-size: 22px; margin-bottom: 25px; font-weight: 600;">Shipping Information</h3>
                
                <form id="payment-form">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div class="input-grp">
                            <label style="display:block; font-size:14px; margin-bottom:5px;">Full name</label>
                            <input type="text" required style="width:100%; padding:15px; border:1px solid #ddd;">
                        </div>
                        <div class="input-grp">
                            <label style="display:block; font-size:14px; margin-bottom:5px;">Last name</label>
                            <input type="text" style="width:100%; padding:15px; border:1px solid #ddd;">
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div class="input-grp">
                            <label style="display:block; font-size:14px; margin-bottom:5px;">Email</label>
                            <input type="email" required style="width:100%; padding:15px; border:1px solid #ddd;">
                        </div>
                        <div class="input-grp">
                            <label style="display:block; font-size:14px; margin-bottom:5px;">Phone</label>
                            <input type="text" style="width:100%; padding:15px; border:1px solid #ddd;">
                        </div>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="display:block; font-size:14px; margin-bottom:5px;">Apartment, suite, etc. (optional)</label>
                        <input type="text" style="width:100%; padding:15px; border:1px solid #ddd;">
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                        <div class="input-grp">
                            <label style="display:block; font-size:14px; margin-bottom:5px;">City</label>
                            <input type="text" style="width:100%; padding:15px; border:1px solid #ddd;">
                        </div>
                        <div class="input-grp">
                            <label style="display:block; font-size:14px; margin-bottom:5px;">State/Province</label>
                            <select style="width:100%; padding:15px; border:1px solid #ddd;">
                                <option>Select</option>
                                <option>Dhaka</option>
                                <option>Barishal</option>
                            </select>
                        </div>
                        <div class="input-grp">
                            <label style="display:block; font-size:14px; margin-bottom:5px;">Postal Code</label>
                            <input type="text" style="width:100%; padding:15px; border:1px solid #ddd;">
                        </div>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <label style="display:block; font-size:14px; margin-bottom:5px;">Country</label>
                        <select style="width:100%; padding:15px; border:1px solid #ddd;">
                            <option>Country</option>
                            <option>Bangladesh</option>
                        </select>
                    </div>

                    <button type="submit" class="checkout-btn" style="width: 100%; padding: 20px; background: #000; color: #fff; border: none; font-size: 18px; font-weight: bold; cursor: pointer;">
                        Pay Now & Complete Order
                    </button>
                </form>
            </div>
        </div>
    `;

    document.getElementById('payment-form').onsubmit = async (e) => {
        e.preventDefault();
        await processBulkPayment(selectedIds);
    };
};

/**
 * 5. Payment API Call (PATCH /api/orders/pay-success/:orderId)
 */
async function processBulkPayment(orderIds) {
    try {
        for (const id of orderIds) {
            await fetch(`http://localhost:5001/api/orders/pay-success/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' }
            });
        }
        showSuccessScreen();
    } catch (err) {
        console.error("Payment API Error:", err);
    }
}

function showSuccessScreen() {
    document.getElementById("main-content").innerHTML = `
        <div style="background: #F2E8D9; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
            <div style="background: #6FCF97; width: 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 30px;">
                <i class="fa-solid fa-check" style="color: #fff; font-size: 50px;"></i>
            </div>
            <h1 style="font-size: 36px; margin-bottom: 10px;">Your payment has been <span style="color: #6FCF97;">received</span>!</h1>
            <p style="color: #555; font-size: 18px; margin-bottom: 40px;">Please check your email for a payment confirmation & invoice.</p>
            <button onclick="location.reload()" style="background: #000; color: #fff; padding: 18px 50px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
                Continue Shopping <i class="fa-solid fa-chevron-right" style="margin-left: 10px;"></i>
            </button>
        </div>
    `;
}