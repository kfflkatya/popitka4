document.addEventListener("DOMContentLoaded", function() { //Проверяет полную загрузку страница чтобы после этого начать выполнять код

    const welcomeText = document.createElement("h1"); //Создаёт заголовок <h1>
    welcomeText.className = "rainbow-text"; //Добавляет ему класс
    welcomeText.textContent = "Black Pearl"; //Записывает в заголовок текст
    document.getElementById("welcome-banner").appendChild(welcomeText); //Вставляет то что находится в велкам текст в див с классов велкам банер

    //Анимация при прокрутке
    const elements = document.querySelectorAll("#home .content > *, #games > .game-cards > *, #about > *, #contacts > *"); //Ищет все элементы и записывает их в перменную элементс для анимирования

    const observer = new IntersectionObserver((entries) => { //Отслеживание того есть ли элемент на экране
        entries.forEach(entry => {
            if (entry.isIntersecting) { //Если элемент на экране то добавляет к нему класс шоу
                entry.target.classList.add("show");
            } else {
                entry.target.classList.remove("show"); //Если нет то убирает
            }
        });
    }, {
        threshold: 0.4 //Порог видимости 0.1 от полного элемента
    });

    elements.forEach(element => {
        element.classList.add("hidden"); //Добавляет всем элементам класс хиден чтобы они изначально были скрыты
        observer.observe(element); //Скрипт следит за элементами чтобы когда надо включить анимку
    });

    //Загрузка рецензий из XML
    fetch('xml.xml') //Загрузка таблицы
    .then(response => response.text()) //Преобразование ответа на запрос в текст
    .then(data => {
        const xml = new DOMParser().parseFromString(data, "application/xml"); //Создаем парсер и парсим текст в хмл.
        const reviewsMap = Array.from(xml.querySelectorAll("review")) //Ищет все теги ревью и делает из них массив
            .reduce((map, review) => {
                const title = review.querySelector("title").textContent; //Ищет теги тайтл и вытаскивает из них соответсвующие названия игр
                const content = review.querySelector("content").textContent; //Ищет текст рецензий для определенных игр
                map[title] = content; //Добавляет в тайтл содержимое таблицы
                return map; //После того как загрузил первую рецензию возвращается для поиска и добавления другой
            }, {}); //Очищает уже имеющееся значение, чтобы при поиске и добавлении другой рецензии она не была в переплет с предыдущей

        document.querySelectorAll(".card").forEach(card => { //Находит все элеметы с классом кард
            const title = card.getAttribute("data-title"); //Ищет название игры из атрибута дата тайтл
            const reviewElement = card.querySelector(".game-review"); //Находит элемент с классом гейм ревью чтобы туда вставить рецензию

            if (reviewsMap[title] && reviewElement.innerHTML.trim() === '') { //Если для этого объекта есть соотвествующая рецензия то...
                reviewElement.innerHTML = `<p>${reviewsMap[title]}</p>`; //...вставляет ее в этот элемент.
            }
        });
    })


    // Обработчики событий для кнопок
    document.querySelectorAll(".toggle-button").forEach(button => { //Поиск всех кнопки с классом "toggle-button"
        button.addEventListener("click", function(event) { //Делает возможным кликать на кнопку
            const card = this.closest(".card"); //После клика ищет ту карточку где тыкнутая кнопка находится
            const gameInfo = card.querySelector(".game-info"); //Поиск элемента с классом гейм инфо
            const gameReview = card.querySelector(".game-review"); //Поиск элемента с классом гейм ревью

            if (gameReview.classList.contains("hide")) { //Если рецензия с классом хайд то...
                event.preventDefault(); //после нажатия кнопки появится рецензия
                
                if (!gameInfo.classList.contains("hide")) { //Если инфа об игре не с классом хайд то...
                    gameInfo.classList.add("hide"); //После нажатия на кнопку класс станет хайд и произойдет скрытие
                }

                gameReview.classList.remove("hide"); //После с класса гейм ревью убирается класс хайд
                gameReview.classList.add("show"); //И добавляется шоу для показа

                this.textContent = "Перейти в Steam"; //После нажатия кнопки ее текст меняется на "Перейти в Steam".
            } else {
                window.open(this.href, "_blank"); //И после ее нажатия нас перекинет по ссылке стим в новом окне
            }
        });
    });

    // Анимация падающих сердечек внутри блока с приветственной надписью
    const heartContainer = document.getElementById('welcome-banner'); //Ищет блок с классом велкам банер
    function createHeart() {
    
        const heart = document.createElement('div'); //Создается новый див для сердец
        heart.classList.add('heart'); //сердца добавляется лкасс харт
        heart.style.left = Math.random() * 100 + '%'; //Размещение сердца в случайном месте по горизонтали
        heart.style.animationDuration = 3 + Math.random() * 2 + 's'; //Установка случайно продолжительности анимации от 3 до 5 секунд
    
        heartContainer.appendChild(heart); //Добавление сердчека в блок с радужной надписью
    
        setTimeout(() => {
            heart.remove(); //Проанимированное сердечко удаляется из кэша чтобы не нагружать память
        }, parseFloat(heart.style.animationDuration) * 1000 + 1000);
    }
    
    setInterval(createHeart, 500); //Каждое новое сердеко генерируется раз в 500мс
});
