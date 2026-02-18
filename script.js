let size = 4;
let tiles = [];
let selected = null;
let moves = 0;
let timer = 0;
let interval = null;
let imageSrc = "images/stock_image.jpg";

const game = document.getElementById("game");
const shuffleBtn = document.getElementById("shuffleBtn");
const difficultySelect = document.getElementById("difficulty");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const imageUpload = document.getElementById("imageUpload");
const referenceImage = document.getElementById("referenceImage");

// Инициализация
function init() {
    size = parseInt(difficultySelect.value);
    tiles = [];
    moves = 0;
    timer = 0;
    movesDisplay.textContent = moves;
    timerDisplay.textContent = timer;

    clearInterval(interval);

    for (let i = 0; i < size * size; i++) {
        tiles.push(i);
    }

    game.style.gridTemplateColumns = `repeat(${size}, 80px)`;
    game.style.gridTemplateRows = `repeat(${size}, 80px)`;

    draw();
}

// Отрисовка
function draw() {
    game.innerHTML = "";

    const tileSize = 400 / size;

    tiles.forEach((pos, index) => {
        const div = document.createElement("div");
        div.className = "tile";
        div.style.width = "80px";
        div.style.height = "80px";
        div.style.backgroundImage = `url(${imageSrc})`;
        div.style.backgroundSize = `${size * 80}px ${size * 80}px`;

        const x = pos % size;
        const y = Math.floor(pos / size);

        div.style.backgroundPosition = `-${x * 80}px -${y * 80}px`;

        div.addEventListener("click", () => clickTile(index));

        game.appendChild(div);
    });
}

// Клик
function clickTile(index) {
    const tilesElements = document.querySelectorAll(".tile");

    if (selected === null) {
        selected = index;
        tilesElements[index].classList.add("selected");
    } else {
        [tiles[selected], tiles[index]] =
            [tiles[index], tiles[selected]];

        selected = null;
        moves++;
        movesDisplay.textContent = moves;

        draw();
        checkWin();
    }
}


// Перемешивание
function shuffle() {
    for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }

    moves = 0;
    timer = 0;
    movesDisplay.textContent = moves;
    timerDisplay.textContent = timer;

    clearInterval(interval);
    interval = setInterval(() => {
        timer++;
        timerDisplay.textContent = timer;
    }, 1000);

    draw();
}

// Проверка победы
function checkWin() {
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i] !== i) return;
    }

    clearInterval(interval);
    setTimeout(() => {
        showWinModal(); // <-- вызываем модальное окно вместо alert
    }, 100);
}
function showWinModal() {
    document.getElementById("finalTime").textContent = timerDisplay.textContent;
    document.getElementById("finalMoves").textContent = moves;
    document.getElementById("finalSize").textContent = size + " x " + size;

    document.getElementById("winModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("winModal").style.display = "none";
}


// Смена сложности
difficultySelect.addEventListener("change", init);

// Загрузка изображения
imageUpload.addEventListener("change", function (e) {
    const reader = new FileReader();
    reader.onload = function (event) {
        imageSrc = event.target.result;
        referenceImage.src = imageSrc;
        init();
    };
    reader.readAsDataURL(e.target.files[0]);
});
// Загрузка случайного изображения

function useRandomImage() {
    imageSrc = "https://picsum.photos/400?random=" + Date.now();
    referenceImage.src = imageSrc;

    init();

}

// Кнопка перемешивания
shuffleBtn.addEventListener("click", shuffle);
// Кнопка рестрарта после победы
function restartGame() {
    closeModal();   // скрываем модальное окно
    init();         // заново инициализируем поле
}


init();
