const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE = 32;
let mapData = [];
let blocks = [];

// プレイヤー
const player = {
  x: 32,
  y: 32,
  size: TILE,
  color: "blue"
};

// 会話関係
let isTalking = false;
let talkLines = [];
let talkIndex = 0;
const messageBox = document.getElementById("messageBox");

// 会話内容
const deskConversation = [
  "机の中を調べた。",
  "プリントが入っている。",
  "特に変わったものはない。"
];


// ==========================
// MAP 読み込み
// ==========================
fetch("map.json")
  .then(res => res.json())
  .then(data => {
    mapData = data;
    createMap();
    draw();
  });


// ==========================
// マップ生成
// ==========================
function createMap(){
  blocks = [];

  for(let row=0; row<mapData.length; row++){
    for(let col=0; col<mapData[row].length; col++){

      const tile = mapData[row][col];
      const x = col * TILE;
      const y = row * TILE;

      if(tile === "壁"){
        createBlock(x,y,"gray",true);
      }

      if(tile === "机"){
        createBlock(x,y,"brown",true);
      }

      if(tile === "黒板"){
        createBlock(x,y,"green",true);
      }

      if(tile === "教卓"){
        createBlock(x,y,"darkred",true);
      }

      if(tile === "扉"){
        createBlock(x,y,"orange",false);
      }
    }
  }
}


// ==========================
// ブロック作成
// ==========================
function createBlock(x,y,color,solid){
  blocks.push({
    x:x,
    y:y,
    size:TILE,
    color:color,
    solid:solid
  });
}


// ==========================
// 描画
// ==========================
function draw(){

  ctx.clearRect(0,0,canvas.width,canvas.height);

  // 床
  ctx.fillStyle = "#f5f5dc";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // マップ
  blocks.forEach(b=>{
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x,b.y,b.size,b.size);
  });

  // プレイヤー
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x,player.y,player.size,player.size);

  requestAnimationFrame(draw);
}


// ==========================
// 移動判定
// ==========================
function canMove(newX,newY){

  for(let b of blocks){
    if(b.solid){
      if(
        newX < b.x + b.size &&
        newX + player.size > b.x &&
        newY < b.y + b.size &&
        newY + player.size > b.y
      ){
        return false;
      }
    }
  }

  return true;
}


// ==========================
// タイル取得
// ==========================
function getTileAt(x,y){
  const col = x / TILE;
  const row = y / TILE;

  if(mapData[row] && mapData[row][col]){
    return mapData[row][col];
  }

  return null;
}


// ==========================
// 会話開始
// ==========================
function startTalk(lines){
  isTalking = true;
  talkLines = lines;
  talkIndex = 0;
  showMessage(talkLines[0]);
}


// ==========================
// メッセージ表示
// ==========================
function showMessage(text){
  messageBox.style.display = "flex";
  messageBox.innerText = text;
}


// ==========================
// 会話終了
// ==========================
function endTalk(){
  isTalking = false;
  messageBox.style.display = "none";
}


// ==========================
// キー操作
// ==========================
document.addEventListener("keydown", e=>{

  // 会話中はスペースのみ
  if(isTalking){

    if(e.code === "Space"){
      talkIndex++;

      if(talkIndex < talkLines.length){
        showMessage(talkLines[talkIndex]);
      }else{
        endTalk();
      }
    }

    return;
  }

  let newX = player.x;
  let newY = player.y;

  if(e.key === "ArrowUp") newY -= TILE;
  if(e.key === "ArrowDown") newY += TILE;
  if(e.key === "ArrowLeft") newX -= TILE;
  if(e.key === "ArrowRight") newX += TILE;

  // 移動できるなら移動
  if(canMove(newX,newY)){
    player.x = newX;
    player.y = newY;
  }
  else{
    // ぶつかった先が机なら会話
    const tile = getTileAt(newX,newY);

    if(tile === "机"){
      startTalk(deskConversation);
    }
  }

});
