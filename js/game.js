var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

cvs.width = window.innerWidth;
cvs.height = window.innerHeight;

document.body.style = "color: white; background-color: #111111";
ctx.font = "20px Arial";
ctx.fillStyle = "#0095DD";

var music_background = new Audio();
music_background.src = "audio/music1.mp3";
var mute = 0;
music_background.play();

var contoll_variant = 0;

//------------------------------классы------------------------------------------
class Player{
  constructor(sprite, health, x, y){
    this.sprite = new Image(); this.sprite.src = "images/x-wing.png";
    this.health = 3;
    this.x = 400; this.y = 400;
  }
}
//------------------------------------------------------------------------------

ast_sprite = new Image();
ast_sprite.src = "images/asteroid1.png";
var asteroid = [];
asteroid[0] = {
  x : randomInteger(0,1000),
  y : 0
}



laser_sound = new Audio(); laser_sound.src = "audio/laser1.mp3";

enemy_sprite = new Image();
enemy_sprite.src = "images/empire_ship.png";
destroyer_sprite = new Image();
destroyer_sprite.src = "images/destroyer.png";


enemy_1 = {
  x : 0,
  y : 0
}
enemy_2 = {
  x : cvs.width - 200,
  y : 0
}
destroyer = {
  health : 1000,
  x : cvs.width/2,
  y : -300
}




btn1_sprite = new Image();
btn1_sprite.src = "images/btn1.png";
btn2_sprite = new Image();
btn2_sprite.src = "images/btn2.png";


enemy_laser_sprite = new Image();
enemy_laser_sprite.src = "images/green-laser.png";
var enemy_laser = [];


coin_sprite = new Image();
coin_sprite.src = "images/coin.png";
var coin = [];
coin[0] = {
  x : randomInteger(0,1100),
  y : 0
}



laser_sprite = new Image();
laser_sprite.src = "images/red-laser.png";
var laser = [];



var pl = new Player();
var bg = new Image();



var coin_pickup = new Audio();
coin_pickup.src = "audio/coin.mp3";
var coins = 0;

var r2d2_1 = new Audio();
r2d2_1.src = "audio/r2d2_1.mp3";
var r2d2_2 = new Audio();
r2d2_2.src = "audio/r2d2_2.mp3";





var time_for_spawn = 0;
var game_over = 0;
var game_win = 0;
var start_game = 0;
var immortality = 0;


//-------------------------------события----------------------------------------
document.addEventListener('keydown', function (event) {
  if ((event.key == 'm' || event.key == 'M' || event.key == 'ь' || event.key == 'Ь') && mute == 1) {
  mute = 0;
  music_background.play();
  }
  else if ((event.key == 'm' || event.key == 'M' || event.key == 'ь' || event.key == 'Ь') && mute == 0) {
  mute = 1;
  music_background.pause();
  }

  if ((event.key == 'k' || event.key == 'л' || event.key == 'K' || event.key == 'Л') && contoll_variant == 1) {
  contoll_variant = 0;
  }
  else if ((event.key == 'k' || event.key == 'л' || event.key == 'K' || event.key == 'Л') && contoll_variant == 0) {
  contoll_variant = 1;
  }
});





document.body.addEventListener("keydown", function (event) {
    keys[event.keyCode] = true;
});

document.body.addEventListener("keyup", function (event) {
    keys[event.keyCode] = false;
});


function keys(){
    if (keys[87]) {//W
         pl.y -= 11;
    }

    if (keys[83]) {//S
        pl.y += 11;
    }
    if (keys[68]) {//D
        pl.x += 11;
    }
    if (keys[65]) {//A
        pl.x -= 11;
    }

}

document.addEventListener('click', function (event) {
  if(contoll_variant == 0){
  player_shoot();
  }
});

var canvasPos = getPosition(canvas);

canvas.addEventListener("mousemove", setMousePosition, false);


function setMousePosition(e) {
  if(contoll_variant == 1){
  pl.x = e.clientX - canvasPos.x;
  pl.y = e.clientY - canvasPos.y;
  }
}





var s_1 = 1; var s_2 = -1;
var enemy_laser_spawn = 0;var player_laser_spawn = 0;
var laser_dest_spawn = 0; var time_for_spawnDestr = 0; var dest_time = 0;










function getMousePos(cvs, event) {
    var rect = cvs.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function isInside(pos, rect){
    return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
}



var rect1 = {
    x:670,
    y:300,
    width:160,
    height:70
};

cvs.addEventListener('click', function(evt) {
    var mousePos = getMousePos(cvs, evt);

 if(!start_game){
    if (isInside(mousePos,rect1)) {
        start_game = 1;
    }
  }
  else if (game_over) {
    if (isInside(mousePos,rect1)) {
        start_game = 0;
        game_over = 0;
        restart_game();
    }
  }
}, false);






//---------------------------метод отрисовки------------------------------------
function update()
{
  if(start_game){
    if(contoll_variant == 0){
      keys();
    }
  if(contoll_variant == 1){
    player_laser_spawn++;
    if(player_laser_spawn == 50)
    {
      player_shoot();
      player_laser_spawn = 0;
    }
  }
 if(!game_over && !game_win)
 {
   ctx.clearRect(0, 0, cvs.width, cvs.height);

   ctx.beginPath();
   time_for_spawn++;

   if(destroyer.health <= 0){
     game_win = 1;
   }
   if(time_for_spawnDestr <= 300)
   {
     time_for_spawnDestr++;
   }
   if(time_for_spawnDestr >= 300)
   {
    ctx.fillText("boss health: " + destroyer.health, 8, 100);
    for(var j = 0; j < laser.length; j++)
    {
      if(laser[j].x > destroyer.x + 15 && laser[j].x < destroyer.x + 134 && laser[j].y > destroyer.y - 170 && laser[j].y < destroyer.y +  250)
      {
          destroyer.health -= 1;
          laser.splice(j, 1);
      }
    }
    laser_dest_spawn++;
    if(destroyer.y <= 40 && dest_time <= 10)
    {
       destroyer.y+=1;
    }
    else if (destroyer.y >= 40 && dest_time <= 10 && laser_dest_spawn >= 150)
    {
        enemy_shoot(destroyer.x, destroyer.y);
        laser_dest_spawn = 0;
        dest_time++;
        ctx.fillText("boss health: " + destroyer.health, 8, 100);
    }
    else if (dest_time >= 10 && destroyer.y >= -300)
    {
      destroyer.y -= 1;
      if(destroyer.y == -298)
      {
        dest_time = 0;
        time_for_spawnDestr = 0;
      }
    }
  }


  if(time_for_spawn >= 120){
    time_for_spawn = 0;
    coin.push({
      x : randomInteger(0,1000),
      y : -200
    })
    asteroid.push({
      x : randomInteger(0,1000),
      y : -200
    })
  }
  for(var i = 0; i < enemy_laser.length; i++){
    enemy_laser[i].y+=3;
    ctx.drawImage(enemy_laser_sprite, enemy_laser[i].x + 80, enemy_laser[i].y, 20, 80);
    if(enemy_laser[i].x > pl.x - 130 && enemy_laser[i].x < pl.x + 40 && enemy_laser[i].y > pl.y - 100 && enemy_laser[i].y < pl.y + 100){
      if(pl.health > 1){
        enemy_laser.splice(i, 1);

        if(immortality == 0){
        pl.health --;
        r2d2_1.play();
        immortality = 1;
        setTimeout(immortality_off, 5000);
        }
      }
      else {
        pl.health = 0;
        r2d2_2.play();
        game_over = 1;
      }
    }
  }
  enemy_laser_spawn++;

//------------------------------------------отрисовка врагов--------------------
  ctx.drawImage(enemy_sprite, enemy_1.x, enemy_1.y, 128, 128);

  if(enemy_laser_spawn == 85)
  {
    enemy_shoot(enemy_1.x,enemy_1.y);
    enemy_laser_spawn = 0;
  }

  if(enemy_1.x == cvs.width/3){
    s_1 = -s_1;
  }
  if(enemy_1.x == -1){
    s_1 = Math.abs(s_1);
  }
  enemy_1.x+=s_1;
  for(var j = 0; j < laser.length; j++){
      if(laser[j].x > enemy_1.x && laser[j].x < enemy_1.x+80 && laser[j].y > enemy_1.y && laser[j].y < enemy_1.y+90){
          enemy_1.x =0;
          enemy_1.y =0;
          laser.splice(j, 1);
          coins+=5;
      }
  }



  ctx.drawImage(enemy_sprite, enemy_2.x, enemy_2.y, 128, 128);

  if(enemy_laser_spawn == 80)
  {
     enemy_shoot(enemy_2.x, enemy_2.y);
  }

  if(enemy_2.x == cvs.width/3 + 300){
    s_2 = Math.abs(s_2);
  }
  if(enemy_2.x == cvs.width - 199){
    s_2 = -s_2;
  }
  enemy_2.x+=s_2;
  for(var j = 0; j < laser.length; j++){
      if(laser[j].x > enemy_2.x && laser[j].x < enemy_2.x+80 && laser[j].y > enemy_2.y && laser[j].y < enemy_2.y+90){
          enemy_2.x = cvs.width - 200;
          enemy_2.y = 0;
          laser.splice(j, 1);
      }
  }
//------------------------------------------------------------------------------
  for(var i = 0; i < asteroid.length; i++)
  {
    ctx.drawImage(ast_sprite, asteroid[i].x, asteroid[i].y,128,128);

    asteroid[i].y++;
    if(pl.x > asteroid[i].x && pl.x < asteroid[i].x + 135 && pl.y  > asteroid[i].y && pl.y < asteroid[i].y + 135)
    {
      if(pl.health > 1){
        asteroid.splice(i, 1);

        if(immortality == 0){
        pl.health --;
        r2d2_1.play();
        immortality = 1;
        setTimeout(immortality_off, 5000);
        }
      }
      else {
        pl.health = 0;
        r2d2_2.play();
        game_over = 1;
      }
    }
    for(var j = 0; j < laser.length; j++)
    {
        if(laser[j].x > asteroid[i].x && laser[j].x < asteroid[i].x + 80 && laser[j].y > asteroid[i].y && laser[j].y < asteroid[i].y + 90)
        {
            asteroid.splice(i,1);
            laser.splice(j,1);
        }
    }
}
for(var i = 0; i < laser.length; i++){
  ctx.drawImage(laser_sprite, laser[i].x, laser[i].y, 20, 80);
  laser[i].y-=5;
}

for(var i = 0; i < coin.length; i++){
  ctx.drawImage(coin_sprite, coin[i].x, coin[i].y, 30, 30);

  coin[i].y++;

  if(pl.x > coin[i].x && pl.x < coin[i].x + 133 && pl.y > coin[i].y && pl.y < coin[i].y+128)
  {
    coin_pickup.play();
    coins++;
    coin.splice(i,1);
  }
}
  ctx.drawImage(pl.sprite, pl.x - 50, pl.y - 50, 128, 128);
  ctx.drawImage(destroyer_sprite, destroyer.x + 10, destroyer.y, 150, 300);

//------------------------------------------HUD---------------------------------
  ctx.fillText("Coins: "+ coins, 8, 20);
  ctx.fillText("HP. "+ pl.health, 8, 40);
  ctx.fillText("press k to switch control", 8, 80);

  if(immortality){
      ctx.fillText("immortality", 8, 60);
  }
//------------------------------------------------------------------------------
}
else if (game_over) {
  music_background.pause();
  ctx.clearRect(0, 0, cvs.width, cvs.height);

  ctx.beginPath();

  ctx.fillText("Game Over!", 690, 200);

  ctx.drawImage(btn2_sprite, 670, 300, 160, 70);
}
else if (game_win){
  music_background.pause();
  ctx.clearRect(0, 0, cvs.width, cvs.height);

  ctx.beginPath();

  ctx.fillText("WIN!", 670, 200);

  ctx.drawImage(btn2_sprite, 670, 300, 160, 70);
}
}
else if (!start_game) {
  music_background.pause();
  ctx.clearRect(0, 0, cvs.width, cvs.height);

  ctx.beginPath();

  ctx.drawImage(btn1_sprite, 670, 300, 160, 70);

  ctx.fillText("Coins: "+ coins, 8, 20);
  var cntrl = "";
  if(contoll_variant == 0){
    cntrl = "keyboard + mouse";
  }
  else if(contoll_variant == 1){
    cntrl = "auto";
  }
  ctx.fillText("press k to switch control / " + cntrl, 635, 500);
}
  requestAnimationFrame(update);
}  update();
//------------------------------------------------------------------------------


function enemy_shoot(x, y){
  laser_sound.play();
  enemy_laser.push({
    x : x,
    y : y
  })
}
function player_shoot(){
  laser_sound.play();
  laser.push({
    x : pl.x,
    y : pl.y - 50
  })
}
function immortality_off(){
  immortality = 0;
}

function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}
function restart_game(){
  pl.x = 400;
  pl.y = 400;
  pl.health = 3;

  destroyer.health = 1000;
  destroyer.x = cvs.width/2;
  destroyer.y = -300;

  asteroid.splice(0,asteroid.length);
  enemy_laser.splice(0,enemy_laser.length);

  coin.splice(0,coin.length);
  coin[0] = {
    x : randomInteger(0,1100),
    y : 0
  }
  asteroid[0] = {
    x : randomInteger(0,1100),
    y : 0
  }


  s_1 = 1; s_2 = -1;
  enemy_laser_spawn = 0; player_laser_spawn = 0;
  laser_dest_spawn = 0; time_for_spawnDestr = 0; var dest_time = 0;
  time_for_spawn = 0;
  immortality = 0;

}
function getPosition(el) {
  var xPosition = 0;
  var yPosition = 0;

  while (el) {
    xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
    yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
    el = el.offsetParent;
  }
  return {
    x: xPosition,
    y: yPosition
  };
}
