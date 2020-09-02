'use strict';


function opensCards() {

    // Получаем элимент секции с карточками
    var section = document.querySelector('section');
    // Заполняем надписи Win и Lose при помощи span-элиментов
    var word = Array.from('WinLose');
    word.forEach(function (item, index) {
        var elemSpan = document.createElement('span');
        elemSpan.innerText = item;
        // Объединяем сообщение победы и поражения в разные группы и добавляем задержку анимации
        if (index < 3)
        {
            elemSpan.classList.add('winInfo');
            elemSpan.style.animationDelay = (index * 0.1) + 's';
        }
        else {
            elemSpan.classList.add('loseInfo');
            elemSpan.style.animationDelay = ((index-3) * 0.1) + 's';
        }
        // Добавляем span-элемент с буквой, в элемент сообщения
        document.querySelector('.message').appendChild(elemSpan);
    });

    // создаем счетчик времени
    var secondsCounter;
    // создаем массив открытых карточек
    var openCards;
    // Получаем объект таймера
    var timerForm = document.querySelector('.timer');
    // создаем флаг-определитель открытия первой карточки
    var firsOpenCard;
    // запускаем задание стартовых параметров
    start();
    // запускаем "перемешивание" карточек
    reSort();

    // функция задания стартовых параметров
    function start() {
        // Обнуляем тайме
        timerForm.innerText = '01:00';
        // Заводим счетчик секунд таймера
        secondsCounter = 60;
        // Задаем массив для открытых карт
        openCards =[];
        // Устанавливаем флаг открытой первой карточки
        firsOpenCard = false;
    }

    function reSort(){
        // Задаем массив и используемыми emoji
        var emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🐻', '🐶', '🐱', '🐭', '🐹', '🐰', '🐻'];
        // Получаем массив "белых" сторон карточек
        var backSides = Array.from(section.querySelectorAll('div.backCard'));
        // Заполняем карточки случайными emoji из их набора
        backSides.forEach(function (item) {
            var emojiPosition = getRandom(0, emojis.length);
            item.innerText = emojis[emojiPosition];
            emojis.splice(emojiPosition, 1);
        });
    }


    // Добавляем событие на клик по краточке
    section.addEventListener('click', clickOnCard);

    // Добавляем на кнопку обработку клика
    document.querySelector('.restart').addEventListener('click', reStart);

    // Функция-обработчик клика по карточке
    function clickOnCard(event){
        // Смотрим, при помощи делегирования, что родитель элемента, на котором произошел клик (одна из сторон карточки) - это div
        if (event.target.parentElement.tagName === 'DIV') {
            var divParentElement = event.target.parentElement;
            // Смотрим, открыта ли уже карточка
            if (divParentElement.classList.contains('show')){
                // Проверяем, доступна ли эта карточка для взаимодействия
                if (!divParentElement.querySelector('div.backCard').classList.contains('correctCard')
                && !divParentElement.querySelector('div.backCard').classList.contains('incorrectCard'))
                {
                    // Закрываем карточку и удаляем ее из набора открытых карточек
                    openCards.splice(openCards.length - 1, 1);
                    divParentElement.classList.remove('show');
                    divParentElement.classList.add('unShow');
                }
            }
            // Если карточка закрыта
            else {
                // Смотрим, енадо ли сравнивать нарточку с последней открытой
                if ((openCards.length > 0) && (openCards.length % 2 === 0)) {
                    //Если не надо, то проверяем, являлись ли последние открытые карточки - одинаковыми
                    if (openCards[openCards.length - 1].querySelector('div.backCard').classList.contains('correctCard')
                    && openCards[openCards.length - 2].querySelector('div.backCard').classList.contains('correctCard'))
                    {
                        // Если да - протсо открываем карточку
                        showCard(divParentElement);
                    }
                    // Если последние открытые карточки - разные
                    else {
                        // Убираем у них класс - ошибку сравнения и закрываем
                        for (var i = 1; i < 3; i++) {
                            openCards[openCards.length - i].querySelector('.backCard').classList.remove('incorrectCard');
                            openCards[openCards.length - i].classList.remove('show');
                            openCards[openCards.length - i].classList.add('unShow');
                        }
                        // Кдаляем некорректные карточки из набора открытых карт
                        openCards.splice(openCards.length - 2, 2);
                        // Открываем карточку, клик по которой был произведен
                        showCard(divParentElement);
                    }
                }
                // Если надо сравнивать карточку с предыдущей открытой
                else if (openCards.length % 2 !== 0){
                    // Открываем карточку
                    showCard(divParentElement);
                    // Проверяем, одинаковые ли это карточки
                    if (openCards[openCards.length - 1].querySelector('.backCard').innerText
                        === openCards[openCards.length - 2].querySelector('.backCard').innerText){
                        // Если да - добавляем класс - корректное сравнение
                        addClassCompare('correctCard');
                    }
                    else {
                        // Если карточки разные, то добавляе класс - ошибку сравнения
                        addClassCompare('incorrectCard');
                    }
                }
                // Если еще нету открытых карточек
                else {
                    // Проверяем, первая ли это открытая карточка
                    if (!firsOpenCard){
                        // Если да, то запускаем таймер
                        firsOpenCard = true;
                        timerStart();
                    }
                    // Просто открываем карточку
                    showCard(divParentElement);
                }
            }
        }
    }

    // Задаем функцию перезапуска по кнопке
    function reStart(event) {
        // Отменяем стандартный обработчик по нажатию кнопки
        event.preventDefault();
        // Получаем массив карточек
        var cardsCollection = Array.from(document.querySelectorAll('.card'));
        // Пробегаемся по всем открытым карточкам
        cardsCollection.forEach(function (item) {
            // Переворачиваем открытые карточки
            if (item.classList.contains('show')){
                item.classList.remove('show');
                item.classList.add('unShow');
            }
            // Убираем у всех карточек, если есть, классы - сравнения
            if (item.querySelector('div.backCard').classList.contains('correctCard'))
                item.querySelector('div.backCard').classList.remove('correctCard');
            if (item.querySelector('div.backCard').classList.contains('incorrectCard'))
                item.querySelector('div.backCard').classList.remove('incorrectCard');
        });
        // Убираем отображение всех букв сообщения победы или проигрыша
        Array.from(document.querySelectorAll('span')).forEach(function (item) {
            item.style.display = 'none';
        });
        // Устанавливаем таймер на перемешивание карточек
        setTimeout(reSort, 350);
        // Устанавливаем стартовые значения
        start();
        // Скрываем окно-блокировщик с сообщением победы или проигрыша
        document.querySelector('.blockWindow').style.display = 'none';
    }



    // Функция, открывающая карточку
    function showCard(card){
        if (card.classList.contains('unShow'))
            card.classList.remove('unShow');
        card.classList.add('show');
        openCards.push(card);
    }

    // Функция добавления класса сравнения карточек
    function addClassCompare(nameOfClass){
        for (var j = 1; j < 3; j++)
            openCards[openCards.length - j].querySelector('.backCard').classList.add(nameOfClass);
    }

    // Функция получения целого, псевдослучайного числа
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // Функция запуска таймера
    function timerStart() {
        var timerId = setInterval(function () {
            secondsCounter--;
            if (secondsCounter >= 10)
                timerForm.innerText = '00:' + secondsCounter;
            else
                timerForm.innerText = '00:0' +secondsCounter;
            if ((secondsCounter <= 0) && (openCards.length !== 12)) {
                clearInterval(timerId);
                document.querySelector('.blockWindow').style.display = 'flex';
                var loseColectionLetters = Array.from(document.querySelectorAll('.loseInfo'));
                loseColectionLetters.forEach(function (item) {
                    item.style.display = 'inline-block';
                });
                document.querySelector('.restart').innerText = 'Try again';
            }
            if (openCards.length === 12)
            {
                clearInterval(timerId);
                document.querySelector('.blockWindow').style.display = 'flex';
                var winColectionLetters = Array.from(document.querySelectorAll('.winInfo'));
                winColectionLetters.forEach(function (item) {
                    item.style.display = 'inline-block';
                });
                document.querySelector('.restart').innerText = 'Play again';
            }
        }, 1000);
    }

}