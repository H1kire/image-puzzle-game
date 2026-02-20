import { enableDragMode } from "./drag_n_drop_mode.js";

export let mode = "tap";

let size = 4;
let tiles = [];
let selected = null;
let moves = 0;
let timer = 0;
let interval = null;
let imageSrc = "images/stock_image.jpg";
let currentLang = "ru";

// ===== DOM =====
const game = document.getElementById("game");
const shuffleBtn = document.getElementById("shuffleBtn");
const difficultySelect = document.getElementById("difficulty");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const imageUpload = document.getElementById("imageUpload");
const referenceImage = document.getElementById("referenceImage");
const modeBtn = document.getElementById("modeToggleBtn");
const randomBtn = document.getElementById("randomBtn");
const langSelect = document.getElementById("langSelect");

// ===== I18N =====
const i18n = {
    en:{
        shuffle:"Shuffle",
        difficulty:"Difficulty",
        moves:"Moves",
        time:"Time",
        original:"Original",
        win:"Puzzle Completed!",
        restart:"Play Again"
    },
    ru:{
        shuffle:"Перемешать",
        difficulty:"Сложность",
        moves:"Ходы",
        time:"Время",
        original:"Оригинал",
        win:"Вы собрали пазл!",
        restart:"Играть снова"
    },
    uk:{
        shuffle:"Перемішати",
        difficulty:"Складність",
        moves:"Рухи",
        time:"Час",
        original:"Оригінал",
        win:"Ви зібрали пазл!",
        restart:"Грати знову"
    }
};

function updateTexts(){
    const t=i18n[currentLang];

    shuffleBtn.textContent=t.shuffle;
    document.getElementById("difficultyLabel").textContent=t.difficulty+":";
    document.getElementById("movesLabel").childNodes[0].textContent=t.moves+": ";
    document.getElementById("timerLabel").childNodes[0].textContent=t.time+": ";
    document.querySelector("#reference h3").textContent=t.original;
    document.getElementById("winModalMessage").textContent=t.win;
    document.getElementById("restartBtn").textContent=t.restart;
}

// ===== MODE =====
modeBtn.addEventListener("click",()=>{
    mode=mode==="tap"?"drag":"tap";

    modeBtn.textContent=
        mode==="tap"
            ?"🖐 Drag mode"
            :"👆 Tap mode";

    draw();
});

// ===== INIT =====
function init(){
    size=parseInt(difficultySelect.value);
    tiles=[];
    moves=0;
    timer=0;

    movesDisplay.textContent=moves;
    timerDisplay.textContent=timer;
    clearInterval(interval);

    for(let i=0;i<size*size;i++) tiles.push(i);

    game.style.gridTemplateColumns=`repeat(${size},1fr)`;
    game.style.gridAutoRows="1fr";

    draw();
}

// ===== DRAW =====
function draw(){
    game.innerHTML="";

    tiles.forEach((pos,index)=>{
        const div=document.createElement("div");
        div.className="tile";

        div.style.backgroundImage=`url(${imageSrc})`;
        div.style.backgroundSize=`${size*100}% ${size*100}%`;

        const x=pos%size;
        const y=Math.floor(pos/size);
        div.style.backgroundPosition=`-${x*100}% -${y*100}%`;

        if(mode==="tap"){
            div.addEventListener("click",()=>clickTile(index));
        }

        if(mode==="drag"){
            enableDragMode(div,index,{
                onStart:(from)=>window.dragFrom=from,
                onDrop:(to)=>{
                    swapTiles(window.dragFrom,to);
                    draw();
                    checkWin();
                }
            });
        }

        game.appendChild(div);
    });
}

// ===== SWAP =====
function swapTiles(a,b){
    if(a==null||b==null||a===b) return;

    [tiles[a],tiles[b]]=[tiles[b],tiles[a]];
    moves++;
    movesDisplay.textContent=moves;
}

// ===== TAP =====
function clickTile(index){
    const tilesElements=document.querySelectorAll(".tile");

    if(selected===null){
        selected=index;
        tilesElements[index].classList.add("selected");
    }else{
        swapTiles(selected,index);
        selected=null;
        draw();
        checkWin();
    }
}

// ===== SHUFFLE =====
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
    interval=setInterval(()=>{
        timer++;
        timerDisplay.textContent=timer;
    },1000);

    draw();
}

// ===== RANDOM IMAGE (FIXED) =====
function useRandomImage(){
    imageSrc=`https://picsum.photos/800?random=${Date.now()}`;
    referenceImage.src=imageSrc;
    init();
}

// ===== WIN =====
function checkWin(){
    for(let i=0;i<tiles.length;i++){
        if(tiles[i]!==i) return;
    }
    clearInterval(interval);
    setTimeout(()=>showWinModal(),100);
}

function showWinModal(){
    document.getElementById("finalTime").textContent=timerDisplay.textContent;
    document.getElementById("finalMoves").textContent=moves;
    document.getElementById("finalSize").textContent=size+" x "+size;
    document.getElementById("winModal").style.display="flex";
}

window.closeModal=()=>document.getElementById("winModal").style.display="none";
window.restartGame=()=>{closeModal();init();};

// ===== EVENTS =====
difficultySelect.addEventListener("change",init);
shuffleBtn.addEventListener("click",shuffle);
randomBtn.addEventListener("click",useRandomImage);

imageUpload.addEventListener("change",(e)=>{
    const reader=new FileReader();
    reader.onload=(ev)=>{
        imageSrc=ev.target.result;
        referenceImage.src=imageSrc;
        init();
    };
    reader.readAsDataURL(e.target.files[0]);
});

langSelect.addEventListener("change",(e)=>{
    currentLang=e.target.value;
    updateTexts();
});

// ===== START =====
updateTexts();
init();