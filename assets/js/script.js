document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navbar & Mobile Menu
    const header = document.getElementById('siteHeader');
    if (header) {
        window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 20));
    }

    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            navToggle.classList.toggle('open');
        });
    }

    // 2. Flash Message
    const flashData = flash.pop();
    const flashSlot = document.getElementById('flashSlot');
    if (flashData && flashSlot) {
        flashSlot.innerHTML = `
            <div class="flash-wrap">
                <div class="flash flash-${flashData.type}" id="flashMsg">
                    <i class="fa-solid ${flashData.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
                    <span>${flashData.msg}</span>
                    <button class="flash-close" onclick="this.parentElement.remove()">&times;</button>
                </div>
            </div>`;
        setTimeout(() => document.getElementById('flashMsg')?.remove(), 5000);
    }

    // 3. Nav Auth State (Login vs Logout)
    const authSlot = document.querySelector('[data-nav-auth]');
    if (authSlot) {
        const user = auth.current();
        if (user) {
            authSlot.innerHTML = `<a href="#" class="btn btn-outline" id="logoutBtn"><i class="fa-solid fa-right-from-bracket"></i> خروج (${escapeHTML(user.name)})</a>`;
            document.getElementById('logoutBtn').addEventListener('click', (e) => {
                e.preventDefault(); auth.logout(); flash.set('success', 'تم تسجيل الخروج'); window.location.href='index.html';
            });
        } else {
            authSlot.innerHTML = `<a href="login.html" class="btn btn-outline"><i class="fa-solid fa-user"></i> دخول</a>`;
        }
    }

    // 4. Password Toggle
    document.querySelectorAll('.toggle-pass').forEach(btn => {
        btn.addEventListener('click', () => {
            let input = document.getElementById(btn.dataset.target);
            if(input.type === 'password') { input.type = 'text'; btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>'; }
            else { input.type = 'password'; btn.innerHTML = '<i class="fa-solid fa-eye"></i>'; }
        });
    });

    // 5. Render Foods
    const createCard = (dish) => `
        <article class="food-card">
            <div class="food-img"><img src="${dish.img}" alt="${escapeHTML(dish.name)}"><span class="food-tag">${escapeHTML(dish.tag)}</span></div>
            <div class="food-body">
                <div class="food-head"><h3 class="food-name">${escapeHTML(dish.name)}</h3><span class="food-price">${formatSDG(dish.price)}</span></div>
                <p class="food-desc">${escapeHTML(dish.desc)}</p>
                <a href="order.html?food=${encodeURIComponent(dish.name)}" class="btn btn-primary btn-block"><i class="fa-solid fa-cart-plus"></i> اطلب الآن</a>
            </div>
        </article>`;

    const featuredGrid = document.getElementById('featuredGrid');
    if (featuredGrid) featuredGrid.innerHTML = DISHES.slice(0, 6).map(createCard).join('');
    
    const menuGrid = document.getElementById('menuGrid');
    if (menuGrid) menuGrid.innerHTML = DISHES.map(createCard).join('');

    // 6. Forms Handling
    const handleForm = (formId, callback) => {
        const form = document.getElementById(formId);
        if (!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (callback(form)) form.reset();
        });
    };

    handleForm('loginForm', (form) => {
        const res = auth.login(form.email.value, form.password.value);
        if (!res.ok) return alert(res.msg);
        flash.set('success', 'مرحباً بك! تم تسجيل الدخول'); window.location.href = 'index.html';
    });

    handleForm('registerForm', (form) => {
        if (form.password.value !== form.confirm_password.value) return alert('كلمتا المرور غير متطابقتين');
        const res = auth.register(form.full_name.value, form.email.value, form.password.value);
        if (!res.ok) return alert(res.msg);
        flash.set('success', 'تم إنشاء الحساب بنجاح'); window.location.href = 'login.html';
    });

    handleForm('contactForm', () => {
        flash.set('success', 'تم إرسال رسالتك بنجاح'); window.location.reload();
    });

    handleForm('orderForm', () => {
        flash.set('success', 'تم استلام طلبك بنجاح'); window.location.reload();
    });

    // 7. Order Page Logic
    const orderFoodSelect = document.getElementById('food_name');
    if (orderFoodSelect) {
        const urlParams = new URLSearchParams(window.location.search);
        const selectedFood = urlParams.get('food');
        
        orderFoodSelect.innerHTML = '<option value="">— اختر طبقاً —</option>' + 
            DISHES.map(d => `<option value="${d.name}" ${d.name === selectedFood ? 'selected' : ''}>${d.name} - ${formatSDG(d.price)}</option>`).join('');

        const qtyInput = document.getElementById('quantity');
        const updateSummary = () => {
            const dish = DISHES.find(d => d.name === orderFoodSelect.value);
            const qty = parseInt(qtyInput.value) || 1;
            document.getElementById('sumFood').textContent = dish ? dish.name : '—';
            document.getElementById('sumQty').textContent = qty;
            document.getElementById('sumUnit').textContent = dish ? formatSDG(dish.price) : '—';
            document.getElementById('sumTotal').textContent = dish ? formatSDG(dish.price * qty) : '—';
        };
        orderFoodSelect.addEventListener('change', updateSummary);
        qtyInput.addEventListener('input', updateSummary);
        updateSummary();
    }
});