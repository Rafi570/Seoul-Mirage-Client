/**
 * SEOUL MIRAGE - Admin Dashboard Logic
 * Version: 2.0 (Stable)
 */

// --- ১. গ্লোবাল ফাংশনস (HTML থেকে সরাসরি কল করার জন্য) ---

// ফিল্টার অনুযায়ী অর্ডার লোড করা
window.loadFilteredOrders = async function() {
    const emailSearch = document.getElementById('order-email-search');
    const statusFilter = document.getElementById('order-status-filter');
    
    const email = emailSearch ? emailSearch.value.trim() : "";
    const status = statusFilter ? statusFilter.value : "";
    
    const params = new URLSearchParams();
    if (email) params.append('email', email);
    if (status) params.append('status', status);

    const url = `http://localhost:5001/api/orders/all?${params.toString()}`;

    try {
        const response = await fetch(url);
        const orders = await response.json();
        renderOrderTable(orders);
        updateOrderStats(orders)
    } catch (err) { 
        console.error("Filter Error:", err); 
    }
};

// অর্ডারের স্ট্যাটাস আপডেট করা
window.updateOrderStatus = async function(orderId, newStatus) {
    try {
        const response = await fetch(`http://localhost:5001/api/orders/update-status/${orderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            alert("Order Status Updated! ✅");
            loadFilteredOrders(); // টেবিল রিফ্রেশ করবে
        } else {
            alert("Failed to update status");
        }
    } catch (err) {
        console.error("Update Error:", err);
    }
};

// --- ২. মেইন ইনিশিয়ালাইজেশন (DOMContentLoaded) ---

document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    
    // সিকিউরিটি চেক
    if (!user || user.role !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    // শুরুতে ড্যাশবোর্ড ওভারভিউ লোড হবে
    loadDashboardOrders();

    // নেভিগেশন লজিক
    const navLinks = document.querySelectorAll('#admin-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            if(!targetId) return;

            // সব সেকশন হাইড করা
            document.querySelectorAll('.admin-section').forEach(sec => {
                sec.style.display = 'none';
            });

            // টার্গেট সেকশন দেখানো
            const targetElement = document.getElementById(targetId);
            if(targetElement) targetElement.style.display = 'block';

            // একটিভ ক্লাস আপডেট
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // সেকশন অনুযায়ী ফাংশন কল
            if(targetId === 'products-section') loadProducts();
            else if (targetId === 'customers-section') loadAllUsers();
            else if (targetId === 'orders-section') loadFilteredOrders();
            else if (targetId === 'dashboard-overview') loadDashboardOrders();
        });
    });
});

// --- ৩. ডাটা ফেচিং এবং রেন্ডারিং ফাংশনস ---

// ওভারভিউ কার্ডের স্ট্যাটাস আপডেট
function updateOverviewStats(orders) {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const totalCustomers = new Set(orders.map(o => o.userEmail)).size;

    const cards = document.querySelectorAll('.stat-card h3');
    if(cards.length >= 3) {
        cards[0].innerText = `$${totalRevenue.toLocaleString()}`;
        cards[1].innerText = totalOrders;
        cards[2].innerText = totalCustomers;
    }
}

// ওভারভিউ পেজের ছোট অর্ডার লিস্ট
async function loadDashboardOrders() {
    try {
        const response = await fetch(`http://localhost:5001/api/orders/all`); 
        const allOrders = await response.json();
        
        const list = document.getElementById('order-list-admin');
        if(list) {
            list.innerHTML = allOrders.slice(0, 5).map(order => `
                <div class="admin-order-row" style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee;">
                    <div class="info">
                        <strong>ORD-${order._id.slice(-5).toUpperCase()}</strong>
                        <p style="font-size:12px; color:gray;">${order.userEmail || 'Guest'}</p>
                    </div>
                    <div class="amount">+$${(order.totalAmount || 0).toFixed(2)}</div>
                    <div class="status-pill">${order.status}</div>
                </div>
            `).join('');
        }
        updateOverviewStats(allOrders);
    } catch (err) { console.error("Order Load Error:", err); }
}

// মেইন অর্ডার টেবিল রেন্ডার
function updateOrderStats(orders) {
    const total = orders.length;
    const paid = orders.filter(o => o.status === 'Paid').length;
    const unpaid = orders.filter(o => o.status === 'Unpaid').length;

    // HTML এলিমেন্টে ডাটা বসানো
    const totalEl = document.getElementById('order-total-count');
    const paidEl = document.getElementById('order-paid-count');
    const unpaidEl = document.getElementById('order-unpaid-count');

    if(totalEl) totalEl.innerText = total;
    if(paidEl) paidEl.innerText = paid;
    if(unpaidEl) unpaidEl.innerText = unpaid;
}
function renderOrderTable(orders) {
    const tableBody = document.getElementById('all-orders-table-body');
    if(!tableBody) return;

    tableBody.innerHTML = orders.map(order => {
        // স্ট্যাটাস অনুযায়ী আলাদা CSS ক্লাস সেট করা
        const statusClass = order.status === 'Paid' ? 'status-paid' : 'status-unpaid';
        
        return `
        <tr style="border-bottom: 1px solid #f9f9f9;">
            <td style="padding: 15px; font-weight: 600;">#${order._id.slice(-5).toUpperCase()}</td>
            <td>${order.userEmail}</td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td style="font-weight: 500;">$${(order.totalAmount || 0).toFixed(2)}</td>
            <td>
                <span class="status-pill ${statusClass}" style="padding: 5px 12px; border-radius: 20px; font-size: 11px;">
                    ${order.status}
                </span>
            </td>
        </tr>
    `}).join('');
}
// প্রোডাক্ট লিস্ট লোড
async function loadProducts() {
    try {
        const res = await fetch('http://localhost:5001/api/products');
        const products = await res.json();
        
        const countEl = document.getElementById('total-prod-count');
        if(countEl) countEl.innerText = products.length;

        const tableBody = document.getElementById('product-table-body');
        if(!tableBody) return;

        tableBody.innerHTML = products.map(prod => `
            <tr style="border-bottom: 1px solid #f9f9f9;">
                <td style="padding: 15px; color: #666;">#${prod._id.slice(-5)}</td>
                <td><img src="${prod.mainImage}" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover;"></td>
                <td style="font-weight: 500;">${prod.name}</td>
                <td>${prod.category}</td>
                <td>$${prod.price}</td>
                <td>${prod.stock}</td>
                <td>
                    <button onclick="deleteProduct('${prod._id}')" style="border:none; background:none; color:red; cursor:pointer;">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (err) { console.error("Fetch Error:", err); }
}


async function loadAllUsers() {
    try {
        const response = await fetch('http://localhost:5001/api/auth/users');
        const data = await response.json();
        
        if (data.success) {
            const totalEl = document.getElementById('total-user-count');
            const adminEl = document.getElementById('admin-count');
            if(totalEl) totalEl.innerText = data.users.length;
            if(adminEl) adminEl.innerText = data.users.filter(u => u.role === 'admin').length;
            
            const tableBody = document.getElementById('user-table-body');
            if(!tableBody) return;

            tableBody.innerHTML = data.users.map(user => `
                <tr style="border-bottom: 1px solid #f9f9f9;">
                    <td style="padding: 15px; font-weight: 500;">${user.name}</td>
                    <td>${user.email}</td>
                    <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                    <td><span class="status-pill">${user.role.toUpperCase()}</span></td>
                    <td>
                        <select onchange="updateUserRole('${user._id}', this.value)" style="padding: 5px; border-radius: 4px; border: 1px solid #ddd;">
                            <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
                            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                        </select>
                    </td>
                </tr>
            `).join('');
        }
    } catch (err) { console.error("User Fetch Error:", err); }
}

// ইউজার রোল আপডেট
window.updateUserRole = async function(userId, newRole) {
    try {
        const response = await fetch(`http://localhost:5001/api/auth/update-role/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: newRole })
        });
        if (response.ok) {
            alert("User role updated! ✅");
            loadAllUsers();
        }
    } catch (err) { alert("Server error while updating role"); }
};

// প্রোডাক্ট ডিলিট
window.deleteProduct = async function(id) {
    if(confirm("Are you sure?")) {
        await fetch(`http://localhost:5001/api/products/${id}`, { method: 'DELETE' });
        loadProducts();
    }
};

// অন্যান্য মোডাল লজিক
window.openProductModal = () => document.getElementById('product-modal').style.display = 'flex';
window.closeProductModal = () => document.getElementById('product-modal').style.display = 'none';

window.handleLogout = function() {
    localStorage.clear();
    window.location.href = 'index.html';
};