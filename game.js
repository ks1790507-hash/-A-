let mapData;
let currentRoom;
let gameMode = "explore";

let player = { x:50, y:50, size:24 };
let obstacles = [];

const dialogBox = document.getElementById("dialogBox");
const characterLayer = document.getElementById("characterLayer");

/* =========================
   初期化
========================= */

async function loadGame(){
  const response = await fetch("map.json");
  mapData = await response.json();
  currentRoom = mapData.startRoom;

  document.getElementById("roomName").textContent =
    mapData.rooms[currentRoom].name;

  createDesks();
  renderPlayer();
}

loadGame();

/* =========================
   机配置
========================= */

function createDesks(){
  const gameArea = document.getElementById("gameArea");
  obstacles = [];

  const deskWidth = 80;
  const deskHeight = 50;
  const gapX = 100;
  const gapY = 70;

  const startX = 100;
  const startY = 100;

  // 左側 5×2 が3ブロック
  for(let block=0; block<3; block++){
    for(let row=0; row<5; row++){
      for(let col=0; col<2; col++){
        const x = startX + block*250 + col*gapX;
        const y = startY + row*gapY;
        createDesk(x,y,deskWidth,deskHeight);
      }
    }
  }

  // 右側 4×2（前空席）
  const rightStartX = startX + 3*250 + 100;

  for(let row=1; row<=4; row++){
    for(let col=0; col<2; col++){
      const x = rightStartX + col*gapX;
      const y = startY + row*gapY;
      createDesk(x,y,deskWidth,deskHeight);
    }
  }
}

function createDesk(x,y,w,h){
  const desk = document.createElement("div");
  desk.className = "desk";
  desk.style.left = x + "px";
  desk.style.top = y + "px";

  document.getElementById("gameArea").appendChild(desk);

  obstacles.push({ x,y,width:w,height:h });
}

/* =========================
   移動
========================= */

function canMove(newX,newY){
  for(let obs of obstacles){
    if(
      newX < obs.x + obs.width &&
      newX + player.size > obs.x &&
      newY < obs.y + obs.height &&
      newY + player.size > obs.y
    ){
      return false;
    }
  }
  return true;
}

document.addEventListener("keydown",(e)=>{
  if(gameMode === "dialog"){
    if(e.code === "Space"){
      showNextLine();
    }
    return;
  }

  let newX = player.x;
  let newY = player.y;

  if(e.code === "ArrowUp") newY -= 5;
  if(e.code === "ArrowDown") newY += 5;
  if(e.code === "ArrowLeft") newX -= 5;
  if(e.code === "ArrowRight") newX += 5;

  if(canMove(newX,newY)){
    player.x = newX;
    player.y = newY;
  }

  renderPlayer();

  // デモ用：特定座標で会話発生
  if(player.x > 500 && player.y > 300){
    startDialog(
      ["……", "まだ、いるの？"],
      "特別国会.png"
    );
  }
});

function renderPlayer(){
  let p = document.getElementById("player");
  if(!p){
    p = document.createElement("div");
    p.id = "player";
    document.getElementById("gameArea").appendChild(p);
  }
  p.style.left = player.x + "px";
  p.style.top = player.y + "px";
}

/* =========================
   会話モード
========================= */

let dialogIndex = 0;
let currentDialog = [];

function startDialog(dialogArray, image){
  gameMode = "dialog";
  currentDialog = dialogArray;
  dialogIndex = 0;

  characterLayer.innerHTML = `<img src="${image}">`;
  characterLayer.style.display = "flex";
  dialogBox.style.display = "block";

  showNextLine();
}

function showNextLine(){
  if(dialogIndex >= currentDialog.length){
    endDialog();
    return;
  }

  typeText(currentDialog[dialogIndex]);
  dialogIndex++;
}

function typeText(text){
  dialogBox.textContent = "";
  let i = 0;

  const interval = setInterval(()=>{
    dialogBox.textContent += text[i];
    i++;
    if(i >= text.length){
      clearInterval(interval);
    }
  },40);
}

function endDialog(){
  gameMode = "explore";
  characterLayer.style.display = "none";
  dialogBox.style.display = "none";
}
