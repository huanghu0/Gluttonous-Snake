// 点击开始游戏--->startpage消失---->游戏开始
// 随机出现食物，出现三节蛇开始运动
// 上下左右--->改变方向
// 判断是否吃到食物--->食物消失，蛇节加一
// 判断游戏结束--->弹出框
var content = document.getElementById('content');
var startpage = document.getElementById('startpage');
var startbtn = document.getElementById('startbtn');
var startP = document.getElementById('startP');
var snakeMove;//蛇运动的计时器
var speed = 200;
var scoreBox = document.getElementById('score');
var lose = document.getElementById('lose');
var loserScore = document.getElementById('loserScore');
var close = document.getElementById('close');
var startGameBool = true;//判断是否开始了游戏
var startPauseBool = true;//判断是否暂停了游戏
init();
function init() {
    //地图属性（游戏可以玩的区域）
    //getComputedStyle方法返回一个对象，该对象在应用活动样式表并解析这些值可能包含的任何基本计算后报告元素的所有CSS属性的值。
    this.MapW = parseInt(getComputedStyle(content).width);// 地图的宽
    this.MapH = parseInt(getComputedStyle(content).height);//地图的高
    this.MapDiv = content;
    // 食物属性
    this.foodW = 20;//食物的宽
    this.foodH = 20;//食物的高
    this.foodX = 0;//食物的初始x坐标都为0,0
    this.foodY = 0;
    // 蛇的属性
    this.snakeW = 20;//每一节蛇宽
    this.snakeH = 20;//每一节蛇高
    this.snakeBody = [[3,1,'head'],[2,1,'body'],[1,1,'body']];//蛇身最初三节，每节也用一个数组表示（数组里存储x,y,name），一个蛇头，两个身体，且开始的时候蛇的位置一样，用数组表示目的是为了后面每吃一个食物直接push进去。
    // 游戏属性
    this.direct = 'right';//默认向右
    this.right = false;//默认向右，则左右不能改变蛇的运动方向
    this.left = false;
    this.up = true;
    this.down = true;
    //初始化分数
    this.score = 0;
    bindEvent();
}
// 点击开始游戏，startpage消失
// 随机生成食物
// 出现一条三节蛇，且位置固定
function startGame() {
    startpage.style.display = 'none';
    startP.style.display = 'block';
    food();
    snake();
}
// 随机生成食物函数
function food() {
    var food = document.createElement('div');
    food.style.width = this.foodW + 'px';
    food.style.height = this.foodH + 'px';
    food.style.position = 'absolute';
    this.foodX = Math.floor(Math.random()*(this.MapW/20));//给食物随机生成坐标，注意向下取整防止下面的left top超出content区域
    this.foodY = Math.floor(Math.random()*(this.MapH/20));
    food.style.left = this.foodX*20 + 'px';
    food.style.top = this.foodY*20 + 'px';
    this.MapDiv.appendChild(food).setAttribute('class','food');//将food插入到地图中（content），并取class名为food
}
// 出现一条蛇，出现蛇的位置固定
function snake() {
    // 吃一个食物向蛇的数组里push一个，故而应该根据数组的长度来创建div
    for(var i = 0;i < this.snakeBody.length;i ++){
        var snake = document.createElement('div');
        snake.style.width = this.snakeW + 'px';
        snake.style.height = this.snakeH + 'px';
        snake.style.position = 'absolute';
        snake.style.left = this.snakeBody[i][0]*20 +'px';//这里的坐标是直接在snakeBody里给出且已经是整数
        snake.style.top = this.snakeBody[i][1]*20 + 'px';
        snake.classList.add(this.snakeBody[i][2]);
        this.MapDiv.appendChild(snake).classList.add('snake');
        switch(this.direct){//判断蛇头的方向用来改变蛇头方向
            case 'right':
                break; 
            case 'up':
                snake.style.transform = 'rotate(270deg)';//css3中的属性,顺时针旋转270度            
                break; 
            case 'left':
                snake.style.transform = 'rotate(180deg)';
                break;             
            case 'down':
                snake.style.transform = 'rotate(90deg)';
                break;
            default:
                break;             
        }
    }
}
// 蛇的运动，关键在于对snakeBody改变
function move() {
    // 关键点：蛇的运动在运动过程中删除原来的蛇，生成一条新的蛇
    for(var i = this.snakeBody.length-1;i > 0 ;i --){
        this.snakeBody[i][0] = this.snakeBody[i-1][0];//注意数组里蛇头是第一位，下一位是蛇身，蛇头带着蛇身走所以是每一位等于其前一位
        this.snakeBody[i][1] = this.snakeBody[i-1][1];
    }
    switch(this.direct){
        case 'right':
            this.snakeBody[0][0] += 1;
            break; 
        case 'up':
            this.snakeBody[0][1] -= 1;
            break; 
        case 'left':
            this.snakeBody[0][0] -= 1;
            break;             
        case 'down':
            this.snakeBody[0][1] += 1;
            break;
        default:
            break;             
    }
    removeClass('snake');//删除原来的蛇
    snake();//重新渲染一条新的蛇
    // 用蛇头和食物的坐标是否相等来判断是否吃食物
    if(this.snakeBody[0][0] == this.foodX && this.snakeBody[0][1] == this.foodY){
        // 当吃掉食物的时候向蛇的数组里push一个数组,push的数组([x,y,'body'])一定是'body',而坐标需要未吃掉食物前的尾巴坐标以及方向来确定
        var snakeEndX = this.snakeBody[this.snakeBody.length-1][0],snakeEndY = this.snakeBody[this.snakeBody.length-1][1]; 
         switch(this.direct){
            case 'right':
                this.snakeBody.push([snakeEndX + 1,snakeEndY,'body']);
                break; 
            case 'up':
                this.snakeBody.push([snakeEndX,snakeEndY - 1,'body']);
                break; 
            case 'left':
                this.snakeBody.push([snakeEndX - 1,snakeEndY,'body']);
                break;             
            case 'down':
                this.snakeBody.push([snakeEndX,snakeEndY + 1,'body']);
                break;
            default:
                break;             
        }
        this.score += 1;
        scoreBox.innerHTML = this.score;
        removeClass('food');
        food();
    }
    // 通过蛇头的坐标是否超过content区域的坐标范围,以及蛇头的坐标与身体的坐标是否重合。判断游戏是否结束。
    if(this.snakeBody[0][0] < 0 || this.snakeBody[0][0] >= this.MapW/20){
        // 每次函数加载失败就重新加载游戏
        reloadGame();
    }
    if(this.snakeBody[0][1] < 0 || this.snakeBody[0][1] >= this.MapH/20){
        reloadGame();
    }
    var snakeHX = this.snakeBody[0][0];
    var snakeHY = this.snakeBody[0][1];
    for(var i = 1;i < this.snakeBody.length;i ++){
        if(snakeHX == this.snakeBody[i][0] && snakeHY == this.snakeBody[i][1]){
            reloadGame();
        }
    }
}
// 用于移除以前的蛇或者食物
function removeClass(className) {
  var ele = document.getElementsByClassName(className);
  while(ele.length > 0){
    // 找到它的父级再将他扔掉
    ele[0].parentNode.removeChild(ele[0]);//注意这里删除原来整条蛇，而不是蛇的一个节点，因为只有蛇的class名为snake故ele[0]就代表整条蛇
  } 
}
// 重新加载初始化游戏
function reloadGame() {
    removeClass('snake');
    removeClass('food');
    clearInterval(snakeMove);//清除时钟
    // 重新初始化
    this.snakeBody = [[3,1,'head'],[2,1,'body'],[1,1,'body']];
    this.direct = 'right';
    this.right = false;
    this.left = false;
    this.up = true;
    this.down = true;
    loserScore.innerHTML = this.score;
    lose.style.display = 'block';
    this.score = 0;
    scoreBox.innerHTML = this.score;
    startPauseBool = true;
    startGameBool = true;
    startP.setAttribute('src','./img/start.png');
}
// 得到this.direct
function setDirect(code) {
    switch(code) {
        case 37:
            if(this.left){
                // 由于有默认方向,且与默认方向同一直线的方向键改变不了蛇的方向，故而这里需要判断是否可以改变方向
                this.direct = 'left';
                this.left = false;
                this.right = false;
                this.up = true;
                this.down = true;
            };
            break;
        case 38:
           if(this.up){
                this.direct = 'up';
                this.left = true;
                this.right = true;
                this.up = false;
                this.down = false;
            };
            break;
        case 39:
            if(this.right){
                this.direct = 'right';
                this.left = false;
                this.right = false;
                this.up = true;
                this.down = true;
            };
            break;
        case 40:
            if(this.down){
                this.direct = 'down';
                this.left = true;
                this.right = true;
                this.up = false;
                this.down = false;
            };
            break;     
        default:
            break;
    }
}
// 事件绑定，键盘和鼠标
function bindEvent() {
    close.onclick = function(){
        lose.style.display = 'none';
    }
    startbtn.onclick = function(){
        startAndpause();
    }
    startP.onclick = function(){
        startAndpause();
    }
}
function startAndpause(){
    if(startPauseBool){
        if(startGameBool){
            startGame();
            startGameBool = false;
        }
        startP.setAttribute('src','./img/pause.png');
        document.onkeydown = function(e) {
            var code = e.keyCode;
            setDirect(code);
        }
        snakeMove = setInterval(function(){
            move();
        },speed);
        startPauseBool = false;
    }else{
        startP.setAttribute('src','./img/start.png');
        clearInterval(snakeMove);
        document.onkeydown = function(e){
            e.returnValue = false;
            return false;
        } 
        startPauseBool = true;
    }   
}
