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

let isTalking = false;
let talkIndex = 0;
let talkLines = [];

const deskConversation = [
  "机の中に何か書いてある…",
  "『もうすぐ終わる』",
  "誰が書いたんだろう…"
];

window.onload = function(){
  createMap();
  renderPlayer();
};

function createMap(){

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
        createBlock(x,y,"door",false);
      }
    }
  }
}

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

document.addEventListener("keydown",(e)=>{

  // 会話中
  if(isTalking){

    if(e.code === "Space"){
      talkIndex++;

      if(talkIndex >= talkLines.length){
        endTalk();
      } else {
        showMessage(talkLines[talkIndex]);
      }
    }

    return; // 会話中は移動不可
  }

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

    if(specialDesk &&
       newX === specialDesk.x &&
       newY === specialDesk.y){
        startTalk(deskConversation);
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

function startTalk(lines){
  isTalking = true;
  talkLines = lines;
  talkIndex = 0;
  showMessage(talkLines[0]);
}

function endTalk(){
  isTalking = false;
  document.getElementById("messageBox").textContent = "";
}

function showMessage(text){
  document.getElementById("messageBox").textContent = text;
}
