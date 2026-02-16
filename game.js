/* =========================
   データ（JSON埋め込み）
========================= */

const mapData = {
  startRoom: "classroom",
  rooms: {
    classroom: {
      name: "3年2組 教室"
    }
  }
};

let currentRoom = mapData.startRoom;
let gameMode = "explore";

let player = { x: 100, y: 500, size: 24 };
let obstacles = [];

const dialogBox = document.getElementById("dialogBox");
const characterLayer = document.getElementById("characterLayer");

/* =========================
   初期化
========================= */

function init(){
  document.getElementById("roomName").textContent =
    mapData.rooms[currentRoom].name;

  createClassroom();
  renderPlayer();
}

window.onload = init;

/* =========================
   教室生成
========================= */

function createClassroom(){
  const gameArea = document.getElementById("gameArea");
  obstacles = [];

  createFrontArea();
  createDesks();
}

/* ===== 前（黒板・教壇・教卓） ===== */

function createFrontArea(){

  const gameArea = document.getElementById("gameArea");

  const centerX = window.innerWidth / 2;

  // 黒板
  const board = document.createElement("div");
  board.className = "blackboard";
  board.style.left = (centerX - 250) + "px";
  board.style.top = "40px";
  gameArea.appendChild(board);

  obstacles.push({ x:centerX-250, y:40, width:500, height:80 });

  // 教壇
  const platform = document.createElement("div");
  platform.className = "platform";
  platform.style.left = (centerX - 100) + "px";
  platform.style.top = "140px";
  gameArea.appendChild(platform);

  obstacles.push({ x:centerX-100, y:140, width:200, height:20 });

  // 教卓
  const teacherDesk = document.createElement("div");
  teacherDesk.className = "teacherDesk";
  teacherDesk.style.left = (centerX - 70) + "px";
  teacherDesk.style.top = "165px";
  gameArea.appendChild(teacherDesk);

  obstacles.push({ x:centerX-70, y:165, width:140, height:60 });
}

/* ===== 机 ===== */

function createDesks(){

  const deskWidth = 70;
  const deskHeight = 45;

  const gapX = 130;
  const gapY = 90;

  const startX = 120;
  const startY = 240;

  // 左 5×2 ×3
  for(let block=0; block<3; block++){
    for(let row=0; row<5; row++){
      for(let col=0; col<2; col++){

        const x = startX + block*320 + col*gapX;
        const y = startY + row*gapY;

        createDesk(x,y,deskWidth,deskHeight);
      }
    }
  }

  // 右 4×2
  const rightStartX = startX + 3*320;

  for(let row=0; row<4; row++){
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

  if(gameMode !== "explore") return;

  let newX = player.x;
  let newY = player.y;

  if(e.code === "ArrowUp") newY -= 6;
  if(e.code === "ArrowDown") newY += 6;
  if(e.code === "ArrowLeft") newX -= 6;
  if(e.code === "ArrowRight") newX += 6;

  if(canMove(newX,newY)){
    player.x = newX;
    player.y = newY;
  }

  renderPlayer();
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
