// Таймер в header 

function countdown(dateEnd) {
    var timer, days, hours, minutes, seconds;

    dateEnd = new Date(dateEnd);
    dateEnd = dateEnd.getTime();

    if (isNaN(dateEnd)) {
        return;
    }

    timer = setInterval(calculate, 1000);

    function calculate() {
        var dateStart = new Date();
        var dateStart = new Date(dateStart.getUTCFullYear(),
        dateStart.getUTCMonth(),
        dateStart.getUTCDate(),
        dateStart.getUTCHours(),
        dateStart.getUTCMinutes(),
        dateStart.getUTCSeconds());
        var timeRemaining = parseInt((dateEnd - dateStart.getTime()) / 1000)

        if (timeRemaining >= 0) {
        days = parseInt(timeRemaining / 86400);
        timeRemaining = (timeRemaining % 86400);
        hours = parseInt(timeRemaining / 3600);
        timeRemaining = (timeRemaining % 3600);
        minutes = parseInt(timeRemaining / 60);
        timeRemaining = (timeRemaining % 60);
        seconds = parseInt(timeRemaining);


        document.getElementById("days").innerHTML = parseInt(days, 10);
        document.getElementById("hours").innerHTML = ("0" + hours).slice(-2);
        document.getElementById("minutes").innerHTML = ("0" + minutes).slice(-2);
        document.getElementById("seconds").innerHTML = ("0" + seconds).slice(-2);
        } else {
        return;
        }
    }

    function display(days, hours, minutes, seconds) {}
}
countdown ('11/16/2021 01:00:00 AM');


// Счётчик чисел 

const counters_1 = document.querySelectorAll('.coun-1');
const counters_2 = document.querySelectorAll('.coun-2');
const counters_3 = document.querySelectorAll('.coun-3');

counters_1.forEach((counter) => {
    counter.innerHTML = '0';
    const updateCounter = () => {
        const target = +counter.getAttribute("data-target");
        const c = +counter.innerText;
        if( c < target ) {
        counter.innerText = c + 1;
        setTimeout(updateCounter, 5);
        } else {
        counter.innerText = target;
        }
    };
    updateCounter()
});
counters_2.forEach((counter) => {
    counter.innerHTML = '0';
    const updateCounter = () => {
        const target = +counter.getAttribute("data-target");
        const c = +counter.innerText;
        if( c < target ) {
        counter.innerText = c + 2;
        setTimeout(updateCounter, 1);
        } else {
        counter.innerText = target;
        }
    };
    updateCounter()
});
counters_3.forEach((counter) => {
    counter.innerHTML = '0';
    const updateCounter = () => {
        const target = +counter.getAttribute("data-target");
        const c = +counter.innerText;
        if( c < target ) {
        counter.innerText = c + 40;
        setTimeout(updateCounter, 1);
        } else {
        counter.innerText = target;
        }
    };
    updateCounter()
});


// Слайдер

var swiper = new Swiper(".mySwiper", {
    loop: true,
    observer: true,
    observeParents: true,
    slidesPerView: 4,
    spaceBetween: 30,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    breakpoints: {
        0: {
            slidesPerView: 2,
            spaceBetween: 5,
        },
        640: {
        slidesPerView: 2,
        spaceBetween: 5,
        },
        700: {
        slidesPerView: 3,
        spaceBetween: 15,
        },
        1050: {
        slidesPerView: 4,
        spaceBetween: 30,
        },
    }
});


// Выпадающий блок при нажатие 

$('.questions__block-hidden').slideUp()
$('.questions__block-btn-open').on('click', function() {
    $('.questions__block-hidden').removeClass('questions__block-none');
    $('.questions__block-hidden').slideDown();
    $('.questions__block-btn-open').addClass('questions__block-none');
    $('.questions__block-btn-close').removeClass('questions__block-none');
});
$('.questions__block-btn-close').on('click', function() {
    $('.questions__block-hidden').addClass('questions__block-none');
    $('.questions__block-hidden').slideUp();
    $('.questions__block-btn-open').removeClass('questions__block-none');
    $('.questions__block-btn-close').addClass('questions__block-none');
});

document.querySelectorAll('.skills__accordion-item__trigger').forEach((item) => 
    item.addEventListener('click', () => {
        const parent = item.parentNode;

        if (parent.classList.contains('skills__accordion-item--active')) {
            parent.classList.remove('skills__accordion-item--active');
        } else {
            document
                .querySelectorAll('.skills__accordion-item')
                .forEach((child) => child.classList.remove('skills__accordion-item--active'))
                parent.classList.toggle('skills__accordion-item--active');
        }
    })
);

// Анимация для аккордеона 

$(".skills__accordion-item__trigger").on('click', function () {
    $('.skills__accordion-item::before').css('display', 'none');
})