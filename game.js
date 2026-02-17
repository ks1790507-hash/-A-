/* =========================
   設定
========================= */

const TILE = 40;

const map = [
"壁壁壁壁壁ここここ壁壁壁壁壁壁",
"壁　　　　　　　　　　　　　壁",
"壁　　　　　教教　　　　　　扉",
"壁　　　　　　　　　　　　　壁",
"壁　机机　机机　机机　　　　壁",
"壁　　　　　　　　　　　　　壁",
"壁　机机　机机　机机　机机　壁",
"壁　　　　　　　　　　　　　壁",
"壁　机机　机机　机机　机机　壁",
"壁　　　　　　　　　　　　　壁",
"壁　机机　机机　机机　机机　壁",
"壁　　　　　　　　　　　　　壁",
"壁　机机　机机　机机　机机　壁",
"壁　　　　　　　　　　　　　扉",
"壁壁壁壁壁壁壁壁壁壁壁壁壁壁壁"
];

let player = { x: TILE*2, y: TILE*2, size: TILE };
let obstacles = [];
let specialDesk = null;

/* =========================
   初期化
========================= */

window.onload = function(){
  createMap();
  renderPlayer();
};

/* =========================
   マップ生成
========================= */

function createMap(){

  const gameArea = document.getElementById("gameArea");

  for(let row=0; row<map.length; row++){

    const line = map[row];

    for(let col=0; col<line.length; col++){

      const tile = line[col];
      const x = col * TILE;
      const y = row * TILE;

      if(tile === "壁"){
        createBlock(x,y,"wall",true);
      }

      if(tile === "机"){

        createBlock(x,y,"desk",true);

        // 右端列・前から2番目の机
        if(row === 6 && col === 14){
          specialDesk = { x:x, y:y };
        }
      }

      if(tile === "教"){
        createBlock(x,y,"teacherDesk",true);
      }

      if(tile === "こ"){
        createBlock(x,y,"blackboard",true);
      }

      if(tile === "扉"){
        createBlock(x,y,"door",false); // 扉は通れる
      }

    }
  }
}

/* =========================
   ブロック生成
========================= */

function createBlock(x,y,className,isSolid){

  const block = document.createElement("div");
  block.className = className;
  block.style.position = "absolute";
  block.style.left = x + "px";
  block.style.top = y + "px";
  block.style.width = TILE + "px";
  block.style.height = TILE + "px";

  document.getElementById("gameArea").appendChild(block);

  if(isSolid){
    obstacles.push({ x,y,width:TILE,height:TILE });
  }
}

/* =========================
   移動
========================= */

document.addEventListener("keydown",(e)=>{

  let newX = player.x;
  let newY = player.y;

  if(e.code === "ArrowUp") newY -= TILE;
  if(e.code === "ArrowDown") newY += TILE;
  if(e.code === "ArrowLeft") newX -= TILE;
  if(e.code === "ArrowRight") newX += TILE;

  if(canMove(newX,newY)){
    player.x = newX;
    player.y = newY;
  } else {

    // 特定の机にぶつかったら
    if(specialDesk &&
       newX === specialDesk.x &&
       newY === specialDesk.y){
        showMessage("机の中に何か書いてある…");
    }

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

/* =========================
   プレイヤー描画
========================= */

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

/* =========================
   メッセージ表示
========================= */

function showMessage(text){
  const box = document.getElementById("messageBox");
  box.textContent = text;

  setTimeout(()=>{
    box.textContent = "";
  },3000);
}
