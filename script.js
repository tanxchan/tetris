//game vars
var gb = []//game board, full of html elements for each square
var gbs = []//full game board, excluding selected piece
var gbscolors = [];
var displayQueue = [];
var minBoxes = [];

var dashTime = 67;//should be mutable
const pieceDim = 4;
const totalRows = 23;
const totalCols = 10;
const defaultGravity = 1000;
const totalLockoutMoves = 10;
const lockoutTime = 500;
var sdf = 5;//time between soft drops
var softDropTime = gravityTime/sdf;
var gravityForce = 2;
var gravityTime = defaultGravity/gravityForce;

//piece vars
var curx = 0;
// var gx = 0;
// var gy = 0;
var ghostSquares = [];
var cury = 0;
var curPiece = 0;
var curRot = 0;
var tspin = false;
var lockMoves = 0;
var startLockout = false;

//current game vars
var holdPiece = -1;
var moving = false;
var fallID = "";
var placeID = "";
var bag = [0,1,2,3,4,5,6];//7-bag
var queue = [];

//movement var
var leftHeld = false;
var rightHeld = false;
var downHeld = false;
var rightHold = Date.now();
var leftHold = Date.now();
var rightID = '';
var leftID = '';
var dropID = '';

//todo:
// x- show queue
// - make queue efficient (dequeue first element and append to end)
// x- hold piece
// x- spin table
// x- fix soft drop
// x- make clearlines more efficient
// x- make a ghost piece
// - two tspins are broken
// x- mutable parameters(need to make website input)
// - pieces can float bc of lockout
// - add timer/stopwatch -- 40 lines mode
// - add cheese race
// - add score
// x- increase gravity scaling
// x- fix all the piece glitching too
// - mutable controls

for (let i = 0; i<totalRows; i++){
    let g = [];
    let gs = [];
    let gcolors=[];
    for (let j = 0; j<totalCols; j++){
        let l = document.createElement("div");
        l.setAttribute('class', 'background-tile');
        l.style.gridRow = String(i+1) + '/ span 1';
        l.style.gridColumn = String(j+1) + '/ span 1';
        document.getElementById('board').appendChild(l);
        g.push(l);
        gs.push(0);
        gcolors.push('black')
    }
    gb.push(g);
    gbs.push(gs);
    gbscolors.push(gcolors);
}

let pieces = [
    [[//I
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ],[//1
        [0,0,1,0],
        [0,0,1,0],
        [0,0,1,0],
        [0,0,1,0]
    ],[//2
        [0,0,0,0],
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0]
    ],[//3
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0]
    ]],
    
    [[//O
        [0,0,0,0],
        [0,1,1,0],
        [0,1,1,0],
        [0,0,0,0]
    ],[//1
        [0,0,0,0],
        [0,1,1,0],
        [0,1,1,0],
        [0,0,0,0]
    ],[//2
        [0,0,0,0],
        [0,1,1,0],
        [0,1,1,0],
        [0,0,0,0]
    ],[//3
        [0,0,0,0],
        [0,1,1,0],
        [0,1,1,0],
        [0,0,0,0]
    ]],

    [[//J
        [1,0,0,0],
        [1,1,1,0],
        [0,0,0,0],
        [0,0,0,0]
    ],[//1
        [0,1,1,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,0,0,0]
    ],[//2
        [0,0,0,0],
        [1,1,1,0],
        [0,0,1,0],
        [0,0,0,0]
    ],[//3
        [0,1,0,0],
        [0,1,0,0],
        [1,1,0,0],
        [0,0,0,0]
    ]],

    [[//L
        [0,0,1,0],
        [1,1,1,0],
        [0,0,0,0],
        [0,0,0,0]
    ],[//1
        [0,1,0,0],
        [0,1,0,0],
        [0,1,1,0],
        [0,0,0,0]
    ],[//2
        [0,0,0,0],
        [1,1,1,0],
        [1,0,0,0],
        [0,0,0,0]
    ],[//3
        [1,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,0,0,0]
    ]],
    
    [[//S
        [0,1,1,0],
        [1,1,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ],[//1
        [0,1,0,0],
        [0,1,1,0],
        [0,0,1,0],
        [0,0,0,0]
    ],[//2
        [0,0,0,0],
        [0,1,1,0],
        [1,1,0,0],
        [0,0,0,0]
    ],[//3
        [1,0,0,0],
        [1,1,0,0],
        [0,1,0,0],
        [0,0,0,0]
    ]],

    [[//Z
        [1,1,0,0],
        [0,1,1,0],
        [0,0,0,0],
        [0,0,0,0]
    ],[//1
        [0,0,1,0],
        [0,1,1,0],
        [0,1,0,0],
        [0,0,0,0]
    ],[//2
        [0,0,0,0],
        [1,1,0,0],
        [0,1,1,0],
        [0,0,0,0]
    ],[//3
        [0,1,0,0],
        [1,1,0,0],
        [1,0,0,0],
        [0,0,0,0]
    ]],
    
    [[//J
        [0,1,0,0],
        [1,1,1,0],
        [0,0,0,0],
        [0,0,0,0]
    ],[//1
        [0,1,0,0],
        [0,1,1,0],
        [0,1,0,0],
        [0,0,0,0]
    ],[//2
        [0,0,0,0],
        [1,1,1,0],
        [0,1,0,0],
        [0,0,0,0]
    ],[//3
        [0,1,0,0],
        [1,1,0,0],
        [0,1,0,0],
        [0,0,0,0]
    ]]
]

let spawnLocations = [//x, y
    //so column, row
    [1,4],
    [0,4],
    [1,4],
    [1,4],
    [1,4],
    [1,4],
    [1,4],
]
let pieceColors = [
    'lightblue', 
    'yellow', 
    'blue', 
    'orange', 
    'green',
    'red',  
    'purple', 
]

let SRSWallKick = [
    [[0,0]],
    [[0,0]],
    [[0,0]],
    [[0,0]],
    [[0,0]],
    [[0,0]],
    [[0,0]],
]//add in later
//I can't be fucked rn

let SRSWallKickNormal = [//flipped bc lazy
    [[0,0],[-1,0], [-1,1], [0,-2], [-1,-2]],
    [[0,0],[1,0], [1,-1], [0,2], [1,2]],
    [[0,0],[1,0], [1,1], [0,-2], [1,-2]],
    [[0,0],[-1,0], [-1,-1], [0,2], [-1,2]],
]
let SRSWallKickI = [
    [[0,0],[-2,0],[1,0],[-2,-1],[1,2]],
    [[0,0],[-1,0],[2,0],[-1,2],[2,-1]],
    [[0,0],[2,0],[-1,0],[2,1],[-1,-2]],
    [[0,0],[1,0],[-2,0],[1,-2],[-2,1]],
]

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function findMinBox(p){//returns the first row with anything in it, and the last row + 1, and same for cols
    //lin search, could be O(nlog(n)) with binsearch but can't be fucked
    let firstRow = pieceDim;//besides n=4
    let found = false;
    for (let i = 0; i<pieceDim; i++){
        for (let j = 0; j<pieceDim; j++){
            if (p[i][j]==1){
                firstRow = i;
                found = true;
                break;
            }
        }
        if (found){
            break;
        }
    }
    let firstCol = pieceDim;
    found = false;
    for (let i = 0; i<pieceDim; i++){
        for (let j = 0; j<pieceDim; j++){
            if (p[j][i]==1){
                firstCol = i;
                found = true;
                break;
            }
        }
        if (found){
            break;
        }
    }
    let lastRow = 0;
    found = false;
    for (let i = pieceDim-1; i>=0; i--){
        for (let j = 0; j<pieceDim; j++){
            if (p[i][j]==1){
                //console.log(i,j)
                lastRow = i;
                found = true;
                break;
            }
        }
        if (found){
            break;
        }
    }
    let lastCol = 0;
    found = false;
    for (let i = pieceDim-1; i>=0; i--){
        for (let j = 0; j<pieceDim; j++){
            if (p[j][i]==1){
                //console.log(i,j)
                lastCol = i;
                found = true;
                break;
            }
        }
        if (found){
            break;
        }
    }
    return [[firstRow, lastRow+1], [firstCol, lastCol+1]]
}
function drawPiece(n){
    let p = pieces[n][0];
    let x1, x2, y1, y2;
    [[x1,x2],[y1,y2]] =  minBoxes[n];//starting x and y
    let dimx = x2-x1;
    let dimy = y2-y1;
    let c = document.createElement("div");
    c.setAttribute('class', 'display-piece');
    c.style.gridTemplateRows = "repeat(" + String(dimx) + ', var(--draw-piece))';
    c.style.gridTemplateColumns = "repeat(" + String(dimy) + ', var(--draw-piece))';
    for (let i = x1; i<x2; i++){
        for (let j = y1; j<y2; j++){
            let d = document.createElement('div');
            d.setAttribute('class', 'display-grid-item');
            if (p[i][j] == 1){
                d.style.backgroundColor = pieceColors[n];
                //d.style.borderColor = 'black';
            }else{
                d.style.backgroundColor = 'none';
                d.style.borderStyle = 'none';
            }
            d.style.gridRow = String(i+1-x1) + '/ span 1';
            d.style.gridColumn = String(j+1-y1) + '/ span 1';
            c.appendChild(d);
        }
    }
    return c;
}
function makeQueue(){
    let qb = document.getElementsByClassName('queue')[0];
    for (let i = 0; i<displayQueue.length; i++){
        qb.removeChild(displayQueue[i]);
    }
    displayQueue = [];
    for (let i = 0; i<queue.length; i++){
        let q = drawPiece(queue[i]);
        displayQueue.push(q);
        q.style.gridRow = String(i+1) + '/ span 1';
        q.style.gridColumn = '1 / span 1';
        qb.appendChild(q);
    }
}
function makeHold(n){
    let hb = document.getElementsByClassName('hold')[0];
    let hc = hb.children;
    for (let i = 0; i<hc.length; i++){
        hb.removeChild(hc[i]);
    }
    //hb.removeChild(hb.children[0]);
    let h = drawPiece(n);
    h.style.gridRow = '1 / span 1';
    h.style.gridColumn = '1 / span 1';
    hb.appendChild(h);
}
function randPiece(){
    let index = Math.floor(Math.random()*bag.length);
    if (bag.length>1){
        return bag.splice(index,1)[0];
    }
    let r = bag[index];
    bag = [0,1,2,3,4,5,6];
    return r;
}
function nextPiece(){
    queue.push(randPiece());
    return queue.splice(0,1)[0];
}

function checkCollision(nb){
    for (let i = 0; i<totalRows; i++){
        for (let j =  0 ; j<totalCols; j++){
            if (nb[i][j]==1 && gb[i][j] == 1){
                return false;
            }
        }
    }return true;
}
function checkPieceCollision(p,x,y){//x = row y = col 
    for (let i = x; i<x+pieceDim; i++){
        for (let j = y; j<y+pieceDim; j++){
            if (p[i-x][j-y]==1){
                if (i>=totalRows || j>=totalCols || j<0 || i<0){
                    //console.log(i,j)
                    return false;
                }
                if (gbs[i][j] == 1){
                    return false;
                }
            }
        }
    }
    return true;
}
function spawn(n){
    let p = pieces[n][0];
    let x, y;
    [x,y] = spawnLocations[n];
    
    if (!checkPieceCollision(p,x-1,y-1)){
        //console.log('collision')
        return false;
    }
    for (let i = 0; i<pieceDim; i++){
        for (let j = 0; j<pieceDim; j++){
            if (p[i][j] == 1){
                let sx, sy;
                sx = x-1+i;
                sy = y-1+j;
                // console.log(sx, sy)
                // console.log(gb[sx][sy])
                gb[sx][sy].style.backgroundColor = pieceColors[n];
            }
        }
    }
    return true;
}
function rspawn(){
    let n = nextPiece();//Math.floor(Math.random()*7);
    if (spawn(n)){
        [curx, cury] = spawnLocations[n];
        curPiece = n;
        curRot = 0;
        return true;
    }else{
        return false;
    }
}
function placePiece(n, x, y, r){
    let p = pieces[n][r];
    for (let i = 0; i<pieceDim; i++){
        for (let j = 0; j<pieceDim; j++){
            if (p[i][j] == 1){
                let sx, sy;
                sx = x-1+i;
                sy = y-1+j;
                gbs[sx][sy] = 1;
                gbscolors[sx][sy] = pieceColors[n];
            }
        }
    }
    //run();
    clearTimeout(placeID);
    clearTimeout(fallID);
    if (tspin){
        console.log("t spun");
    }
    removeGhost();
    fullLines();
}
function clearLines(lines){//clear an array full of lines
    for (let i = lines.length-1; i>-1; i--){
        gbs.splice(lines[i]-1,1);
        gbscolors.splice(lines[i]-1,1);
    }
    //gbs.splice(x1-1,l);
    //gbscolors.splice(x1-1,l);
    l = lines.length;
    for (let i = 0; i<l; i++){
        let g = [];
        let gcolors = [];
        for (let i = 0; i<totalCols; i++){
            g.push(0);
            gcolors.push('black')
        }
        let g2 = g;
        let g3 = gcolors;
        gbs.unshift(g2);
        gbscolors.unshift(g3);
    }
    for (let i = 0; i<totalRows; i++){
        for (let j = 0; j<totalCols; j++){
            gb[i][j].style.backgroundColor = gbscolors[i][j];
        }
    }
}
function fullLines(){
    let toClear = [];
    for (let i = 0; i<totalRows; i++){
        let full = true;
        for (let j = 0; j<totalCols; j++){
            if (gbs[i][j] == 0){
                full = false;
            }
        }
        if (full){
            toClear.push(i+1);
            //clearLines(i+1, 1);
        }
    }
    clearLines(toClear);
    run();
}
function rotate(n){
    if (lockMoves>totalLockoutMoves){
        return false;
    }
    let newRot = (n+curRot)%4;
    let p = pieces[curPiece][curRot];
    let np = pieces[curPiece][newRot];
    //for srs implement all the different moves
    let spinable = false;
    let newx, newy;
    if (n==2){
        if (checkPieceCollision(np,curx-1,cury-1)){
            spinable = true;
            newx = curx;
            newy = cury;
        }
    }else if (curPiece>1){
        for (let i = 0; i < SRSWallKickNormal[curRot].length; i++){
            let dx, dy;
            if (n==3){
                [dy, dx] = SRSWallKickNormal[newRot][i];//flipped bc data is hard to copy
                dy = -dy;
            }else{
                [dy, dx] = SRSWallKickNormal[curRot][i];//flipped bc data is hard to copy
                dx = -dx;//because decreasing upwards
            }
            if (checkPieceCollision(np,curx+dx-1,cury+dy-1)){
                spinable = true;
                newx = curx+dx;
                newy = cury+dy;
                break;
            }
        }
    }else if(curPiece == 1){//can't be fucked to try with o spin
        if (checkPieceCollision(np,curx-1,cury-1)){
            spinable = true;
            newx = curx;
            newy = cury;
        }
    }else if(curPiece == 0){//use I spin table
        for (let i = 0; i < SRSWallKickI[curRot].length; i++){
            let dx, dy;
            if (n==3){
                [dy, dx] = SRSWallKickI[newRot][i];//flipped bc data is hard to copy
                dy = -dy;
            }else{
                [dy, dx] = SRSWallKickI[curRot][i];//flipped bc data is hard to copy
                dx = -dx;

            }
            if (checkPieceCollision(np,curx+dx-1,cury+dy-1)){
                spinable = true;
                newx = curx+dx;
                newy = cury+dy;
                break;
            }
        }
    }

    if (!spinable){
        return false;
    }
    //check t-spin logic:
    if (curPiece == 6){
        let filledCorners = 0;
        let tCorners = [[0,0],[2,0],[0,2],[2,2]]
        for (let i = 0; i<4; i++){
            let dx, dy;
            [dx, dy] = tCorners[i];
            if (newx+dx-1>totalRows || newy+dy-1 > totalCols){
                filledCorners++;
                continue;
            }
            if (gbs[newx+dx-1][newy+dy-1] == 1){
                filledCorners++;
            }
        }
        if (filledCorners >= 3){
            tspin = true;
            console.log('t-spinning');
        }else{
            tspin = false;
        }
        //console.log(filledCorners);
    }
    // for (let i = 0; i<pieceDim; i++){
    //     for (let j = 0; j<pieceDim; j++){
    //         if (p[i][j] == 1){
    //             let sx, sy;
    //             sx = curx-1+i;
    //             sy = cury-1+j;
    //             gb[sx][sy].style.backgroundColor = "black";
    //         }
    //     }
    // }
    pieceMove(curPiece, curx, cury, curRot, newx, newy, false, newRot);
    // for (let i = 0; i<pieceDim; i++){
    //     for (let j = 0; j<pieceDim; j++){
    //         if (np[i][j] == 1){
    //             let sx, sy;
    //             sx = newx-1+i;
    //             sy = newy-1+j;
    //             gb[sx][sy].style.backgroundColor = pieceColors[curPiece];
    //         }
    //     }
    // }
    curx = newx;
    cury = newy;
    curRot = newRot;

    // if (startLockout){
    //     lockMoves++;
    //     clearTimeout(placeID);
    //     clearTimeout(fallID);
    //     if (lockMoves>totalLockoutMoves && checkPieceCollision(np, curx, cury-1)){
    //         placeID = setTimeout(()=>{placePiece(curPiece,curx,cury,curRot)},lockoutTime);
    //     }else{
    //         fallID = setTimeout(()=>{fall()},gravityTime);
    //     }
    // }
    drawGhost();
    return true;
}
function pieceMove(n, x, y, r, newx, newy, fallMove = false, newr = curRot){
    if (lockMoves>totalLockoutMoves&&!fallMove){
        return false;
    }
    let p = pieces[n][r];
    let np = pieces[n][newr];
    if (!checkPieceCollision(p,newx-1,newy-1)){
        //console.log('collided')
        return false;
    }
    for (let i = 0; i<pieceDim; i++){
        for (let j = 0; j<pieceDim; j++){
            if (p[i][j] == 1){
                let sx, sy;
                sx = x-1+i;
                sy = y-1+j;
                gb[sx][sy].style.backgroundColor = "black";
            }
        }
    }
    
    for (let i = 0; i<pieceDim; i++){
        for (let j = 0; j<pieceDim; j++){
            if (np[i][j] == 1){
                let sx, sy;
                sx = newx-1+i;
                sy = newy-1+j;
                gb[sx][sy].style.backgroundColor = pieceColors[n];
            }
        }
    }
    if (startLockout&&!fallMove){
        clearTimeout(placeID);
        clearTimeout(fallID);
        if (checkPieceCollision(np, curx, cury-1)){
            if (lockMoves>totalLockoutMoves){
                placeID = setTimeout(()=>{placePiece(curPiece,curx,cury,curRot)},lockoutTime);
            }else{
                lockMoves++;
                fallID = setTimeout(()=>{fall()},gravityTime);
            }
        }else{
            fallID = setTimeout(()=>{fall()},gravityTime);
        }
    }
    return true;
}
function downLoop(){
    pieceDown();
    dropID = setTimeout(()=>{
        downLoop();
    }, softDropTime);
}
function softDrop(){
    if (sdf == -1){
        dashDown();
        return true;
    }
    if (downHeld){
        return false;
    }
    downHeld = true;
    downLoop();
}
function pieceDown(fallMove = false){
    if (pieceMove(curPiece, curx, cury, curRot, curx+1, cury, fallMove, curRot)){
        curx++;
        drawGhost();
        return true;
    }return false;
}
function pieceUp(){
    if (pieceMove(curPiece, curx, cury, curRot, curx-1, cury)){
        curx--;
        drawGhost();
        return true;
    }return false;
}
function pieceRight(){
    if (rightHeld){
        // if (Math.floor(Date.now()-rightHold) > dashTime){
        //     dashRight();
        //     return true;
        // }
    }else{
        // rightHold = Date.now();
        rightHeld = true;
        rightID = setTimeout(()=>{dashRight()}, dashTime);
    }
    if (pieceMove(curPiece, curx, cury, curRot, curx, cury+1)){
        cury++;
        drawGhost();
        return true;
    }return false;
}
function pieceLeft(){
    if (leftHeld){
        // if (Math.floor(Date.now()-leftHold) > dashTime){
        //     dashLeft();
        //     return true;
        // }
    }else{
        // leftHold = Date.now();
        leftHeld = true;
        leftID = setTimeout(()=>{dashLeft()}, dashTime);
    }
    if (pieceMove(curPiece, curx, cury, curRot, curx, cury-1)){
        cury--;
        drawGhost();
        return true;
    }return false;
}
function rotateLeft(){
    rotate(3);
}
function rotateRight(){
    rotate(1);
}
function rotate180(){
    rotate(2);
}
function dashRight(){
    let ny = cury;
    let p = pieces[curPiece][curRot];
    while (checkPieceCollision(p, curx-1, ny-1)){
        ny++;
    }
    if (pieceMove(curPiece, curx, cury, curRot, curx, ny-1)){
        cury = ny-1;
    }
    drawGhost();
}
function dashLeft(){
    let ny = cury;
    let p = pieces[curPiece][curRot];
    while (checkPieceCollision(p, curx-1, ny-1)){
        ny--;
    }
    if (pieceMove(curPiece, curx, cury, curRot, curx, ny+1)){
        cury = ny+1;
    }
    drawGhost();
}
function removeGhost(){
    //return false;
    // console.log(curx,cury, gx, gy)
    // let p = pieces[curPiece][curRot];
    
    // console.log(p)
    // for (let i = 0; i<pieceDim; i++){
    //     for (let j = 0; j<pieceDim; j++){
    //         if (p[i][j] == 1){
    //             console.log(i,j);
    //             let sx, sy;
    //             sx = gx-1+i;
    //             sy = gy-1+j;
    //             //console.log(sx, sy)
    //             gb[sx][sy].style.borderColor = "transparent";
    //         }
    //     }
    // }
    for (let i = 0; i<ghostSquares.length; i++){
        let gs = ghostSquares[i]
        gb[gs[0]][gs[1]].style.borderColor = "transparent";
    }
}
function drawGhost(){
    removeGhost();
    let nx = curx;
    let p = pieces[curPiece][curRot];
    while (checkPieceCollision(p, nx-1, cury-1)){
        nx++;
    }
    let fx = nx-1;
    if (fx == curx){
        return false;
    }
    ghostSquares = [];
    for (let i = 0; i<pieceDim; i++){
        for (let j = 0; j<pieceDim; j++){
            if (p[i][j] == 1){
                let sx, sy;
                sx = fx-1+i;
                sy = cury-1+j;
                gb[sx][sy].style.borderColor = pieceColors[curPiece];
                ghostSquares.push([sx,sy]);
            }
        }
    }

    // gx = fx;
    // gy = cury;
    // console.log(gx,fx,gy,cury)
    return fx;
}
function dashDown(){
    let nx = curx;
    let p = pieces[curPiece][curRot];
    while (checkPieceCollision(p, nx-1, cury-1)){
        nx++;
    }
    if(pieceMove(curPiece, curx, cury, curRot, nx-1, cury)){
        curx = nx-1;
    }
}
function hardDrop(){
    //moving = true;
    let nx = curx;
    let p = pieces[curPiece][curRot];
    while (checkPieceCollision(p, nx-1, cury-1)){
        nx++;
    }
    lockMoves = 0;
    pieceMove(curPiece, curx, cury, curRot, nx-1, cury);
    curx = nx-1;
    //setTimeout(()=>{
    //moving = false;
    //},500)
    clearTimeout(fallID);
    clearTimeout(placeID);
    //setTimeout(()=>{placePiece(curPiece, curx, cury, curRot)},10);
    placePiece(curPiece, curx, cury, curRot);
}
function hold(){
    removeGhost();
    clearTimeout(fallID);
    clearTimeout(placeID);
    makeHold(curPiece);
    let p = pieces[curPiece][curRot];
    let newPieceID = curPiece;
    tspin = false;
    for (let i = 0; i<pieceDim; i++){
        for (let j = 0; j<pieceDim; j++){
            if (p[i][j] == 1){
                let sx, sy;
                sx = curx-1+i;
                sy = cury-1+j;
                gb[sx][sy].style.backgroundColor = "black";
            }
        }
    }
    if (holdPiece == -1){
        run();
        holdPiece = newPieceID;
    }else{//special version of run
        if (spawn(holdPiece)){
            
            [curx, cury] = spawnLocations[holdPiece];
            curPiece = holdPiece;
            curRot = 0;
            makeQueue();
            holdPiece = newPieceID;
            lockMoves = 0;
            startLockout = false;
            drawGhost();
            fallID = setTimeout(()=>{
                fall();
            },gravityTime)
        }else{
            console.log('u lost the game')
        }
    }
}
function resetBoard(){
    removeGhost();
    curx = 0;
    cury = 0;
    curPiece = 0;
    curRot = 0;
    tspin = false;
    lockMoves = 0;
    startLockout = false;
    clearTimeout(fallID);
    clearTimeout(placeID);
    fallID = "";
    placeID = "";
    bag = [0,1,2,3,4,5,6];
    queue = [];
    leftHeld = false;
    rightHeld = false;
    rightHold = Date.now();
    leftHold = Date.now();
    rightID = '';
    leftID = '';
    holdPiece = -1;
    let hb = document.getElementsByClassName('hold')[0];
    if (hb.children.length>0){
        hb.removeChild(hb.children[0]);
    }
    for (let i = 0; i<5; i++){
        queue.push(randPiece());
    }
    let allRows = [];
    for (let i = 0; i<totalRows; i++){
        allRows.push(i+1);
    }
    clearLines(allRows);
    run();
}
function fall(){
    //console.log('falling')
    if (pieceDown(true) && !moving){
        fallID = setTimeout(()=>{
            fall();
        }, gravityTime)
    }else{
        //console.log('fell');
        placeID = setTimeout(()=>{
            placePiece(curPiece, curx, cury, curRot);
        },lockoutTime)
        startLockout = true;
    }
}
function run(){
    clearTimeout(fallID)
    clearTimeout(placeID)
    resetDown();
    tspin = false;
    if (rspawn()){
        makeQueue();
        lockMoves = 0;
        startLockout = false;
        drawGhost();
        fallID = setTimeout(()=>{
            fall();
        },gravityTime)
    }else{
        console.log('u lost the game')
    }
}
function resetRight(){
    rightHeld = false;
    clearTimeout(rightID);
}
function resetLeft(){
    leftHeld = false;
    clearTimeout(leftID);
}
function resetDown(){
    downHeld = false;
    clearTimeout(dropID);
    dropID = '';
}

function save(){
    dashTime = parseInt(document.getElementById('das').value);
    sdf = parseInt(document.getElementById('sdf').value);
    gravityForce = parseFloat(document.getElementById('gf').value);
    gravityTime = defaultGravity/gravityForce;
    softDropTime = gravityTime/sdf;
    if (sdf>30){
        softDropTime = softDropTime-10;
    }
    if (sdf>45){
        sdf = -1;
        document.getElementById('sdf').value = -1;
    }
    toggleMenu();
}
function showMenu(){
    document.getElementsByClassName('menu')[0].style.display = 'flex';
}
function hideMenu(){
    document.getElementsByClassName('menu')[0].style.display = 'none';
}
function toggleMenu(){
    if (document.getElementsByClassName('menu')[0].style.display=='none'){
        showMenu();
    }else{
        hideMenu();
    }
}
function toggleGuide(){
    if (document.getElementsByClassName('menu')[1].style.display=='none'){
        document.getElementsByClassName('menu')[1].style.display = 'flex';
    }else{
        document.getElementsByClassName('menu')[1].style.display = 'none';
    }
}

document.getElementsByClassName('settings-button')[0].addEventListener('click', toggleMenu);
document.getElementsByClassName('guide-button')[0].addEventListener('click', toggleGuide);
document.getElementsByClassName('save-button')[0].addEventListener('click', save);

document.addEventListener('keydown', function(event) {
    const callback = {
    //"ArrowLeft"  : pieceLeft,
    //"ArrowRight" : pieceRight,
    "ArrowUp"    : rotateRight,
    "z"          : rotateLeft,
    "x"          : rotateRight,
    "Shift"      : rotate180,
    "a"          : rotate180,
    "ArrowDown"  : softDrop,
    " "          : hardDrop,
    "r"          : resetBoard,
    "c"          : hold,
}[event.key]
callback?.() // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
});

document.addEventListener('keydown',(event)=>{
    if (event.key == 'ArrowLeft'){
        pieceLeft();
        resetRight();
    }else{
        if (leftHeld){
            leftHeld = false;
            pieceLeft();
        }
    }
})
document.addEventListener('keydown',(event)=>{
    if (event.key == 'ArrowRight'){
        pieceRight();
        resetLeft();
    }else{
        if (rightHeld){
            rightHeld = false;
            pieceRight();
        }
    }
})

document.addEventListener('keyup', function(event) {
    const callback = {
    "ArrowLeft"  : resetLeft,
    "ArrowRight" : resetRight,
    "ArrowDown"  : resetDown,
}[event.key]

callback?.() // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
});

for (let i = 0; i<5; i++){
    queue.push(randPiece())
}

for (let i = 0; i<7; i++){
    minBoxes.push(findMinBox(pieces[i][0]));
}
save();
run();