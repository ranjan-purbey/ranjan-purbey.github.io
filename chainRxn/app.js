"use strict";
var G = {
    canvas: null,
    context: null,
    cellSize: null,
    scale: 1,
    rows: 6,
    cols: 4,
    fgColor: ['#f33', '#3f3'],
    bgColor: '#222',
    board: null,
    count: null,
    gameOver: false,
}
G.cell = function(){
    this.value = 0;
    this.color = null;
}
G.init = function(){
    document.title = "ChainRxn";
    G.canvas = document.querySelector("#main");
    G.context = G.canvas.getContext("2d");
    G.board = new Array(G.rows).fill().map(()=>new Array(G.cols).fill().map(() => new G.cell()));
    G.turn = true;
    G.count = [0, 0];
    G.resize();
    G.canvas.addEventListener('click', G.input);
    window.addEventListener('resize', G.resize);
    G.loop();
}
G.resize = function(){
    if(window.innerHeight > window.innerWidth)G.cellSize = ~~(window.innerWidth/G.cols - 10);
    else G.cellSize = ~~(window.innerHeight/G.rows - 10);
    G.canvas.width = G.cellSize * G.cols;
    G.canvas.height = G.cellSize * G.rows;
    window.scroll(G.canvas.offsetLeft-10, G.canvas.offsetTop-10); 
}
G.loop = function(){
    //~ G.update();
    G.render();
    if(!G.gameOver)window.requestAnimationFrame(G.loop);
    else G.canvas.removeEventListener('click', G.input);
}
G.input = function(e){
    var row = ~~((e.clientY-G.canvas.offsetTop)/G.cellSize);
    var col = ~~((e.clientX-G.canvas.offsetLeft)/G.cellSize);
    if(G.board[row][col].color == null || G.board[row][col].color == G.turn){
        G.cellUpdate(row, col);
        if(!G.gameOver)G.turn = !G.turn;
    }
}
G.cellUpdate = function(row, col){
    G.board[row][col].value += 1;
    if(G.board[row][col].color != null){
        G.count[~~G.board[row][col].color] -= 1;
    }
    G.count[~~G.turn] += 1;
    G.board[row][col].color = G.turn;
    if(G.board[row][col].value > G.cellLimit(row,col)){
        G.board[row][col].value = 0;
        G.count[~~G.turn] -= 1;
        G.board[row][col].color = null;
        if(row-1 >= 0)G.cellUpdate(row-1, col);
        if(row+1 < G.rows)G.cellUpdate(row+1, col);
        if(col-1 >= 0)G.cellUpdate(row, col-1);
        if(col+1 < G.cols)G.cellUpdate(row, col+1);
    }
    G.gameOver = G.count.some((count) => count <=0) && G.count.some((count) => count >= 2);
}
G.render = function(){
    G.context.fillStyle = G.bgColor;
    G.context.strokeStyle = G.fgColor[~~G.turn];
    G.Draw.grid();
    for(var i = 0; i < G.rows; i++){
        for(var j = 0; j < G.cols; j++){
            G.context.strokeStyle = G.fgColor[~~G.board[i][j].color];
            G.Draw.circle(G.cellSize*(j+.5), G.cellSize*(i+.5), G.board[i][j].value);
        }
    }
    
    if(G.gameOver) G.Draw.gameOver();
}
G.cellLimit = function(row, col){
    if((row == 0 || row == G.rows-1) && (col == 0 || col == G.cols-1))return 1;
    if(row == 0 || row == G.rows-1 || col == 0 || col == G.cols-1)return 2;
    return 3;
}
G.Draw = {}
G.Draw.grid = function(){
    G.context.fillRect(0, 0, G.cellSize*G.cols, G.cellSize*G.rows);
    for(var i = 1; i < G.rows; i++){
        G.context.beginPath();
        G.context.moveTo(0, i*G.cellSize);
        G.context.lineTo(G.cols*G.cellSize, i*G.cellSize);
        G.context.stroke();
        G.context.closePath();
    }
    for(var i = 1; i < G.cols; i++){
        G.context.beginPath();
        G.context.moveTo(i*G.cellSize, 0);
        G.context.lineTo(i*G.cellSize, G.rows*G.cellSize);
        G.context.stroke();
        G.context.closePath();
    }
}
G.Draw.circle = function(x, y, n){
    if(n > 0){
        G.context.beginPath();
        G.context.arc(x, y, G.cellSize*.125, 0, Math.PI*2);
        G.context.stroke();
        G.context.closePath();
    }
    if(n > 1){
        G.context.beginPath();
        G.context.arc(x, y, G.cellSize*.25, 0, Math.PI*2);
        G.context.stroke();
        G.context.closePath();
    }
    if(n > 2){
        G.context.beginPath();
        G.context.arc(x, y, G.cellSize*.375, 0, Math.PI*2);
        G.context.stroke();
        G.context.closePath();
    }
}
G.Draw.gameOver = function(){
    //~ G.context.fillStyle = G.fgColor[~~G.turn];
    //~ G.context.fillRect(0, 0, G.cellSize*G.cols, G.cellSize*G.rows);
    //~ G.context.strokeStyle = G.bgColor;
    G.context.strokeStyle = G.fgColor[~~G.turn];
    G.context.font = "20px serif";
    G.context.translate(G.cellSize, G.cellSize*G.rows*0.5);
    G.context.rotate(-Math.PI*.17);
    G.context.strokeText("Player "+(1+~~!G.turn)+" Won!", 0, 0);
    G.context.rotate(Math.PI*.17);
    G.context.translate(-G.cellSize, -G.cellSize*G.rows*0.5);
    
}

G.init();
