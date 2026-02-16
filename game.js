function createDesks(){
  const gameArea = document.getElementById("gameArea");
  obstacles = [];

  const deskWidth = 70;   // 少し小さく
  const deskHeight = 45;

  const gapX = 130;       // 横間隔広く
  const gapY = 90;        // 縦間隔広く

  const startX = 120;
  const startY = 220;     // 全体を下げた

  // ===== 左側 5×2 ×3 =====
  for(let block=0; block<3; block++){
    for(let row=0; row<5; row++){
      for(let col=0; col<2; col++){

        const x = startX + block*320 + col*gapX;
        const y = startY + row*gapY;

        createDesk(x,y,deskWidth,deskHeight);
      }
    }
  }

  // ===== 右側 4×2（前空席なし・詰める） =====
  const rightStartX = startX + 3*320;

  for(let row=0; row<4; row++){
    for(let col=0; col<2; col++){

      const x = rightStartX + col*gapX;
      const y = startY + row*gapY;

      createDesk(x,y,deskWidth,deskHeight);
    }
  }

  createFrontArea();
}
function createFrontArea(){

  const gameArea = document.getElementById("gameArea");

  // 黒板
  const board = document.createElement("div");
  board.className = "blackboard";
  board.style.left = "50%";
  board.style.top = "40px";
  board.style.transform = "translateX(-50%)";
  gameArea.appendChild(board);

  obstacles.push({
    x:window.innerWidth/2 - 250,
    y:40,
    width:500,
    height:80
  });

  // 教壇
  const platform = document.createElement("div");
  platform.className = "platform";
  platform.style.left = "50%";
  platform.style.top = "140px";
  platform.style.transform = "translateX(-50%)";
  gameArea.appendChild(platform);

  obstacles.push({
    x:window.innerWidth/2 - 100,
    y:140,
    width:200,
    height:20
  });

  // 教卓
  const teacherDesk = document.createElement("div");
  teacherDesk.className = "teacherDesk";
  teacherDesk.style.left = "50%";
  teacherDesk.style.top = "165px";
  teacherDesk.style.transform = "translateX(-50%)";
  gameArea.appendChild(teacherDesk);

  obstacles.push({
    x:window.innerWidth/2 - 70,
    y:165,
    width:140,
    height:60
  });
}
