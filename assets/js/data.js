const DISHES = [
    { name: 'كسرة', desc: 'خبز سوداني تقليدي يُصنع من دقيق الذرة، يُقدَّم مع الملاح واللحوم.', price: 1500, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', tag: 'الأكثر طلباً' },
    { name: 'عصيدة', desc: 'طبق سوداني أصيل من دقيق الذرة، يُقدَّم مع ملاح الروب أو الويكة.', price: 1800, img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80', tag: 'تقليدي' },
    { name: 'ملاح التقلية', desc: 'يخنة سودانية غنية باللحم المفروم والبامية والتوابل الشعبية.', price: 2500, img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80', tag: 'مميز' },
    { name: 'ملاح الروب', desc: 'يخنة من الزبادي الطازج مع اللحم، من أشهر الأطباق السودانية.', price: 2600, img: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80', tag: 'مميز' },
    { name: 'ملاح الويكة', desc: 'طبق نباتي من الويكة المجففة مع اللحم أو بدونه.', price: 2400, img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80', tag: 'نباتي' },
    { name: 'قراصة', desc: 'خبز رقيق تقليدي يُصنع من دقيق القمح، يُقدَّم ساخناً مع الملاح.', price: 1200, img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80', tag: 'الأكثر طلباً' },
    { name: 'فول', desc: 'فول مدمس سوداني يُقدَّم مع الزيت والجبن والخبز الطازج.', price: 1000, img: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=600&q=80', tag: 'إفطار' },
    { name: 'طعمية', desc: 'أقراص من الفول المفروم بالتوابل، تُقلى وتُقدَّم ساخنة.', price: 800, img: 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&w=600&q=80', tag: 'إفطار' },
    { name: 'شية', desc: 'لحم مشوي على الفحم بالتوابل السودانية.', price: 4500, img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', tag: 'الأكثر طلباً' },
    { name: 'كمونية', desc: 'يخنة سودانية من الكرشة واللحم بالكمون والتوابل.', price: 2800, img: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&q=80', tag: 'تقليدي' }
];

function formatSDG(num) { return new Intl.NumberFormat('en-US').format(num) + ' ج.س'; }
function escapeHTML(str) { let div = document.createElement('div'); div.textContent = str; return div.innerHTML; }

// نظام تسجيل الدخول والتخزين
const auth = {
    getUsers: () => JSON.parse(localStorage.getItem('7booba_users')) || [],
    current: () => JSON.parse(localStorage.getItem('7booba_session')) || null,
    register: (name, email, pass) => {
        let users = auth.getUsers();
        if(users.find(u => u.email === email)) return { ok: false, msg: 'البريد مسجل مسبقاً' };
        users.push({ name, email, pass });
        localStorage.setItem('7booba_users', JSON.stringify(users));
        return { ok: true };
    },
    login: (email, pass) => {
        let user = auth.getUsers().find(u => u.email === email && u.pass === pass);
        if(!user) return { ok: false, msg: 'بيانات الدخول غير صحيحة' };
        localStorage.setItem('7booba_session', JSON.stringify(user));
        return { ok: true, user };
    },
    logout: () => localStorage.removeItem('7booba_session')
};

const flash = {
    set: (type, msg) => sessionStorage.setItem('7booba_flash', JSON.stringify({ type, msg })),
    pop: () => {
        let f = sessionStorage.getItem('7booba_flash');
        if(!f) return null;
        sessionStorage.removeItem('7booba_flash');
        return JSON.parse(f);
    }
};