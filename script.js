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

const i18n = {
    en: {shuffle:"Shuffle",randomImage:"Random Image",moves:"Moves",timer:"Time",difficulty:"Difficulty",winMessage:"You solved the puzzle!",restart:"Restart",finalTime:"Time",finalMoves:"Moves",finalSize:"Size",sizeOptions:["Easy 3x3","Medium 4x4","Hard 5x5"]},
    ru: {shuffle:"Перемешать",randomImage:"Случайное изображение",moves:"Ходы",timer:"Время",difficulty:"Сложность",winMessage:"Вы собрали пазл!",restart:"Рестарт",finalTime:"Время",finalMoves:"Ходы",finalSize:"Размер",sizeOptions:["Лёгко 3x3","Средне 4x4","Сложно 5x5"]},
    uk: {shuffle:"Перемішати",randomImage:"Випадкове зображення",moves:"Рухи",timer:"Час",difficulty:"Складність",winMessage:"Ви зібрали пазл!",restart:"Перезапуск",finalTime:"Час",finalMoves:"Рухи",finalSize:"Розмір",sizeOptions:["Легко 3x3","Середньо 4x4","Важко 5x5"]}
};

let currentLang = "en";

function updateTexts(){
    document.getElementById("shuffleBtn").textContent = i18n[currentLang].shuffle;
    document.getElementById("randomBtn").textContent = i18n[currentLang].randomImage;
    document.getElementById("movesLabel").textContent = i18n[currentLang].moves+":";
    document.getElementById("timerLabel").textContent = i18n[currentLang].timer+":";
    document.getElementById("difficultyLabel").textContent = i18n[currentLang].difficulty+":";

    const difficultySelect = document.getElementById("difficulty");
    i18n[currentLang].sizeOptions.forEach((text, idx)=>{
        if(difficultySelect.options[idx]) difficultySelect.options[idx].text = text;
    });

    document.getElementById("winModalMessage").textContent = i18n[currentLang].winMessage;
    document.getElementById("restartBtn").textContent = i18n[currentLang].restart;
    document.getElementById("finalTimeLabel").textContent = i18n[currentLang].finalTime+":";
    document.getElementById("finalMovesLabel").textContent = i18n[currentLang].finalMoves+":";
    document.getElementById("finalSizeLabel").textContent = i18n[currentLang].finalSize+":";
}

// ===== Инициализация =====
function init(){
    size = parseInt(difficultySelect.value);
    tiles = [];
    moves = 0;
    timer = 0;
    movesDisplay.textContent = moves;
    timerDisplay.textContent = timer;
    clearInterval(interval);

    for(let i=0;i<size*size;i++) tiles.push(i);

    game.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    game.style.gridAutoRows = "1fr";

    draw();
}

// ===== Отрисовка =====
function draw(){
    game.innerHTML = "";
    tiles.forEach((pos,index)=>{
        const div = document.createElement("div");
        div.className="tile";
        div.style.backgroundImage = `url(${imageSrc})`;
        div.style.backgroundSize = `${size*100}% ${size*100}%`;
        const x=pos%size, y=Math.floor(pos/size);
        div.style.backgroundPosition = `-${x*100}% -${y*100}%`;
        div.addEventListener("click",()=>clickTile(index));
        game.appendChild(div);
    });
}

// ===== Клик по плитке =====
function clickTile(index){
    const tilesElements = document.querySelectorAll(".tile");
    if(selected===null){
        selected=index;
        tilesElements[index].classList.add("selected");
    } else {
        [tiles[selected],tiles[index]]=[tiles[index],tiles[selected]];
        selected=null;
        moves++;
        movesDisplay.textContent=moves;
        draw();
        checkWin();
    }
}

// ===== Перемешивание =====
function shuffle(){
    for(let i=tiles.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [tiles[i],tiles[j]]=[tiles[j],tiles[i]];
    }
    moves=0;
    timer=0;
    movesDisplay.textContent=moves;
    timerDisplay.textContent=timer;
    clearInterval(interval);
    interval=setInterval(()=>{timer++;timerDisplay.textContent=timer},1000);
    draw();
}

// ===== Проверка победы =====
function checkWin(){
    for(let i=0;i<tiles.length;i++) if(tiles[i]!==i) return;
    clearInterval(interval);
    setTimeout(()=>showWinModal(),100);
}

function showWinModal(){
    document.getElementById("finalTime").textContent=timerDisplay.textContent;
    document.getElementById("finalMoves").textContent=moves;
    document.getElementById("finalSize").textContent=size+" x "+size;
    document.getElementById("winModal").style.display="flex";
}

function closeModal(){document.getElementById("winModal").style.display="none";}
function restartGame(){closeModal();init();}

// ===== События =====
difficultySelect.addEventListener("change",init);
imageUpload.addEventListener("change",function(e){
    const reader=new FileReader();
    reader.onload=function(event){imageSrc=event.target.result;referenceImage.src=imageSrc;init();}
    reader.readAsDataURL(e.target.files[0]);
});
document.getElementById("langSelect").addEventListener("change",(e)=>{currentLang=e.target.value;updateTexts();});
shuffleBtn.addEventListener("click",shuffle);

function useRandomImage(){imageSrc="https://picsum.photos/400?random="+Date.now();referenceImage.src=imageSrc;init();}

updateTexts();
init();
