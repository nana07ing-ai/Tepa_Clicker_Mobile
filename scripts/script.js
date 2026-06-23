// --- ЗАГРУЗКА ДАННЫХ ИЗ ПАМЯТИ ПРИ СТАРТЕ ---

// Загружаем общий баланс (если пусто, ставим 0)
let money = localStorage.getItem('tepa_total_money') ? parseInt(localStorage.getItem('tepa_total_money')) : 0;

// Загружаем текущие монеты для покупок (если пусто, ставим 0)
let money_show = localStorage.getItem('tepa_money_show') ? parseInt(localStorage.getItem('tepa_money_show')) : 0;
const level_btn = document.getElementById('level_up');
// Загружаем инвентарь. Если пусто, даем стартовый скин 'Tepa_Head'
let inventory = localStorage.getItem('tepa_inventory') ? JSON.parse(localStorage.getItem('tepa_inventory')) : ['Tepa_Head'];

// Загружаем картинку последнего выбранного кота (если пусто, ставим базового)
let saved_img = localStorage.getItem('tepa_current_img') ? localStorage.getItem('tepa_current_img') : './images/tepa.png';

const level_h4 = document.querySelector('.level');
const level_give_h4 = document.querySelector('.level_give');

let get_money = localStorage.getItem('level_up') ? parseInt(localStorage.getItem('level_up')) : 1;

let symma_level = localStorage.getItem('level_symma') ? parseInt(localStorage.getItem('level_symma')) : 100;

let level_status = localStorage.getItem('level_status') ? parseInt(localStorage.getItem('level_status')) : 1;

const message = document.querySelector('.message');
let tepa_muy = new Audio('./sounds/mc_cat-meow.mp3');
const Tepa_Click = document.getElementById('img_clicker');

const buy_sound = new Audio('./sounds/sound-buy.mp3');
buy_sound.volume = 1.0;

// Сразу отображаем сохраненные монеты и картинку кота на экране при запуске игры
document.querySelector('h2').textContent = money_show;
document.querySelector('h3').textContent = money;
Tepa_Click.src = saved_img;


// --- ФУНКЦИИ ИГРЫ ---

function money_message() {
    tepa_muy.volume = 1.0;
    tepa_muy.play();
    money += get_money;
    money_show += get_money;
    
    // Показываем на экране
    document.querySelector('h2').textContent = money_show;
    document.querySelector('h3').textContent = money;
    
    // СОХРАНЯЕМ монеты в память при каждом клике
    localStorage.setItem('tepa_total_money', money);
    localStorage.setItem('tepa_money_show', money_show);
    
    message.id = 'message_id';
}

function close_message() {
    message.id = '';
    money = 0;
    localStorage.setItem('tepa_total_money', money); // Сохраняем обнуление money
}

function volume_on() {
    tepa_muy.muted = true;
    buy_sound.muted = true;
    document.querySelector('.volume_button').textContent = '🔇';
    document.getElementById('volume').onclick = volume_off;
}

function volume_off() {
    tepa_muy.muted = false;
    buy_sound.muted = false;
    document.getElementById('volume').textContent = '🔊';
    document.getElementById('volume').onclick = volume_on;
}

const shopitems = [
    {name: 'Tepa_Head', price: 0, img: './images/tepa.png'},
    {name: 'Tepa_Pelmen', price: 100, img: './images/Tepa_N_Pelmeni.png'},
    {name: 'Tepa_Sok', price: 250, img: './images/Tepa_Sok.png'},
    {name: 'Tepa_Car', price: 500, img: './images/Tepa_Car.png'},
    {name: 'Tepa_Zloy', price: 750, img: './images/Tepa_zloy.png'},
    {name: 'tepa_comp', price: 1000, img: './images/tepa_comp.png'},
    {name: 'pachan', price: 2500, img: './images/pachan.jpg'},
    {name: 'tepa_vzrosli', price: 5000, img: './images/tepa_vzrosli.png'},
    {name: 'tepa_pachan', price: 7500, img: './images/tepa_pachan.png'},
    {name: 'docha', price: 10000, img: './images/docha.jpg'},
    {name: 'chapilg', price: 12500, img: './images/chapilg.jpg'},
    {name: 'tepa', price: 15000, img: './images/tepa.jpg'},
    {name: 'banda_ataka', price: 17500, img: './images/banda_ataka.png'},
    {name: 'banda_otdix', price: 20000, img: './images/banda_otdix.png'},
    {name: 'tepa_sleep', price: 22500, img: './images/tepa_sleep.png'},
    {name: 'tepa_house', price: 25000, img: './images/tepa_house.png'},
    {name: 'banda_konfeti', price: 27500, img: './images/banda_konfeti.png'}
];

function buyItems(name, price, img) {
    const btn_live = document.getElementById('btn_' + name);

    // Если товар уже куплен
    if (inventory.includes(name)) {
        Tepa_Click.src = img;
        localStorage.setItem('tepa_current_img', img); // СОХРАНЯЕМ выбор кота
        
        document.querySelector('.select_tepa').id = 'select_tepa_id';
        setTimeout(() => {
            document.querySelector('.select_tepa').id = '';
        }, 5000);
        return;
    }

    // Логика покупки
    if (money_show >= price) {
        money_show -= price;
        document.querySelector("h2").textContent = money_show;
        
        inventory.push(name); // Добавляем в инвентарь
        Tepa_Click.src = img;
        
        // СОХРАНЯЕМ обновленные данные в память браузера
        localStorage.setItem('tepa_money_show', money_show);
        localStorage.setItem('tepa_inventory', JSON.stringify(inventory)); // Массив превращаем в строку
        localStorage.setItem('tepa_current_img', img); // Сохраняем картинку надетого скина
        
        if (btn_live) btn_live.textContent = 'Выбрать'; // Проверка, чтобы код не падал, если кнопки нет
        buy_sound.play();
        document.querySelector('.buy_mess').id = 'buy_mess_id';
        setTimeout(() => {
            document.querySelector('.buy_mess').id = '';
        }, 5000);
    }
    else {
        document.querySelector('.buy_fail').id = 'buy_fail_id';
        setTimeout(() => {
            document.querySelector('.buy_fail').id = '';
        }, 5000);
    }
}

function close_buy_mess() {
    document.querySelector('.buy_mess').id = '';
}
function close_fail_mess() {
    document.querySelector('.buy_fail').id = '';
}
function close_select_tepa() {
    document.querySelector('.select_tepa').id = '';
}

function resetGame() {
    const vibor = confirm('Вы Уверены? Это Сбросит Весь Прогресс!');
    if(vibor === true) {
        // Стираем всё, что сохраняли
        localStorage.removeItem('tepa_total_money');
        localStorage.removeItem('tepa_money_show');
        localStorage.removeItem('tepa_inventory');
        localStorage.removeItem('tepa_current_img');
        localStorage.removeItem('level_up');
        localStorage.removeItem('level_symma');
        localStorage.removeItem('level_status');
        // Перезагружаем страницу сайта, чтобы игра началась с нуля
        location.reload(); 
    }
}

window.addEventListener('offline', function() {
    alert('Тёпа видит что у вас отключён интернет, пожалуйста включите его');
});

level_btn.addEventListener('click', function() {
    if (money_show >= symma_level) {
        buy_sound.play();
        get_money += 2;
        level_give_h4.textContent = '1 Клик = ' + get_money + ' Монет';
        level_status += 1;
        level_h4.textContent = 'Уровень: ' + level_status;
        money_show -= symma_level;
        document.querySelector('h2').textContent = money_show;
        symma_level += 750;
        localStorage.setItem('level_up', get_money);
        localStorage.setItem('level_status', level_status);
        localStorage.setItem('level_symma', symma_level);
        level_btn.innerHTML = `Улучшить За ` + symma_level + `<img src="./images/d_cash_currency_money_business_coin_finance_ruble_icon_250919.ico" alt="Монета">`;
    }
    else {
        alert('Нехватает Денег');
    }
});
function checkstatus() {
    level_give_h4.textContent = '1 Клик = ' + get_money + ' Монет';
    level_h4.textContent = 'Уровень: ' + level_status;
    level_btn.innerHTML = `Улучшить За ` + symma_level + `<img src="./images/d_cash_currency_money_business_coin_finance_ruble_icon_250919.ico" alt="Монета">`;
    shopitems.forEach(item => {
        const betoon = document.getElementById('btn_' + item.name);

        if (betoon) {
            if(inventory.includes(item.name)) {
                betoon.textContent = 'Выбрать';
            }
        }
    })
}   
checkstatus();

document.getElementById('razrabi').addEventListener('click', function() {
    alert('Разработчики: AdaM Taulu, Abdullah_Windows7. Спонсоры: Аминов Абдурахман, Алимзода Мухаммад.');
});