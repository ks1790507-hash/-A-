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
