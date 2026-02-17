/* =========================
   設定
========================= */

const TILE = 40; // 人1人サイズ

let player = { x: TILE*2, y: TILE*12, size: TILE };
let obstacles = [];
let gameMode = "explore";

/* =========================
   初期化
========================= */

window.onload = function(){
  createClassroom();
  renderPlayer();
};

/* =========================
   教室生成
========================= */

function createClassroom(){
  obstacles = [];
  createFrontArea();
  createDesks();
}

/* ===== 前方 ===== */

function createFrontArea(){

  const gameArea = document.getElementById("gameArea");
  const centerX = Math.floor(window.innerWidth / 2 / TILE) * TILE;

  createBlock(centerX - TILE*6, TILE*1, TILE*12, TILE*2, "blackboard");
  createBlock(centerX - TILE*2, TILE*3, TILE*4, TILE*1, "platform");
  createBlock(centerX - TILE*1.5, TILE*4, TILE*3, TILE*2, "teacherDesk");
}

/* ===== 机配置 ===== */

function createDesks(){

  const startX = TILE*3;
  const startY = TILE*6;

  // 左 5×2 ×3
  for(let block=0; block<3; block++){
    for(let row=0; row<5; row++){
      for(let col=0; col<2; col++){

        const x = startX + block*TILE*4 + col*TILE*2;
        const y = startY + row*TILE*2;

        createBlock(x,y,TILE*2,TILE*1,"desk");
      }
    }
  }

  // 右 4×2
  const rightStartX = startX + TILE*12;

  for(let row=0; row<4; row++){
    for(let col=0; col<2; col++){

      const x = rightStartX + col*TILE*2;
      const y = startY + row*TILE*2;

      createBlock(x,y,TILE*2,TILE*1,"desk");
    }
  }
}

/* =========================
   ブロック生成
========================= */

function createBlock(x,y,w,h,className){

  const block = document.createElement("div");
  block.className = className;
  block.style.position = "absolute";
  block.style.left = x + "px";
  block.style.top = y + "px";
  block.style.width = w + "px";
  block.style.height = h + "px";

  document.getElementById("gameArea").appendChild(block);

  obstacles.push({ x,y,width:w,height:h });
}

/* =========================
   移動（1マス単位）
========================= */

document.addEventListener("keydown",(e)=>{

  if(gameMode !== "explore") return;

  let newX = player.x;
  let newY = player.y;

  if(e.code === "ArrowUp") newY -= TILE;
  if(e.code === "ArrowDown") newY += TILE;
  if(e.code === "ArrowLeft") newX -= TILE;
  if(e.code === "ArrowRight") newX += TILE;

  if(canMove(newX,newY)){
    player.x = newX;
    player.y = newY;
  }

  renderPlayer();
});

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

function renderPlayer(){

  let p = document.getElementById("player");

  if(!p){
    p = document.createElement("div");
    p.id = "player";
    p.style.position = "absolute";
    p.style.width = TILE + "px";
    p.style.height = TILE + "px";
    p.style.background = "white";
    document.getElementById("gameArea").appendChild(p);
  }

  p.style.left = player.x + "px";
  p.style.top = player.y + "px";
}
