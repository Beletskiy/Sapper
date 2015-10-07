
/*--------------------------------------------------visualization-------------------------------------------*/
function HTMLDrawer (leftClickHandler, rightClickHandler) {
    // this.htmlField = null;
    this.leftClickHandler = leftClickHandler;
    this.rightClickHandler = rightClickHandler;
}

function CanvasDrawer () {

}

HTMLDrawer.prototype.drawHtmlField = function (modelArr) {
   var htmlField = modelArr,
       table = document.createElement('table'),
       tr = null, td = null,
       self = this;

    for (var i = 0; i < htmlField.length; i++) {
        tr = document.createElement('tr');
        table.appendChild(tr);
        for (var j = 0; j < htmlField.length; j++) {
            td = document.createElement('td');
            tr.appendChild(td);
            td.setAttribute('id', 'c_'+j+'_'+i);
            td.setAttribute('class', 'closed');

             var leftClickHandler = function(e){
                var el = e.currentTarget,
                    id = el.getAttribute('id'),
                    parts = id.split('_'),
                    x = parts[1],
                    y = parts[2];
                self.leftClickHandler(x, y, modelArr);
            };

             var rightClickHandler = function (e) {
                var el = e.currentTarget,
                    id = el.getAttribute('id'),
                    parts = id.split('_'),
                    x = parts[1],
                    y = parts[2];
                self.rightClickHandler(x, y, modelArr);
                e.preventDefault();
            };

            td.addEventListener('click', leftClickHandler);
            td.addEventListener('contextmenu', rightClickHandler);
        }
    }
    gameField.appendChild(table);
};

HTMLDrawer.prototype.showBomb = function (x,y,modelArr) {
    var htmlField = modelArr,
        cellId = 'c_'+x+'_'+y;

    document.getElementById(cellId).classList.remove('closed');
    document.getElementById(cellId).classList.add('red');
    document.getElementById(cellId).classList.add('bomb');
    for (var i = 0; i < htmlField.length; i++) {
        for (var j = 0; j < htmlField.length; j++) {
            cellId = 'c_'+j+'_'+i;
         //   if (Game.prototype.isBomb(j,i,modelArr)) {
            if (Game.prototype.isBomb.call(game,j,i)) {                     //  так можно???
                document.getElementById(cellId).classList.add('bomb');
            }
        }
    }
    alert ('You lose!');
};
HTMLDrawer.prototype.showNumber = function (x,y,modelArr) {
    var htmlField = modelArr,
        cellId = 'c_'+x+'_'+y;
    document.getElementById(cellId).classList.remove('closed');
    document.getElementById(cellId).innerHTML = htmlField[x][y][0];

};
HTMLDrawer.prototype.showBlank = function (x, y) {
    var cellId = 'c_'+x+'_'+y;
    document.getElementById(cellId).classList.remove('closed');
};
HTMLDrawer.prototype.showFlag = function (x, y) {
    var cellId = 'c_'+x+'_'+y;
    document.getElementById(cellId).classList.remove('closed');
    document.getElementById(cellId).classList.add('flag');

};
HTMLDrawer.prototype.disableFlag = function (x, y) {
    var cellId = 'c_'+x+'_'+y;
    document.getElementById(cellId).classList.remove('flag');
    document.getElementById(cellId).classList.add('closed');
};

/*----------------------------------------------end of visualization----------------------------------------*/

/*---------------------------------------------------logic--------------------------------------------------*/
function Game () {

    //var self = this;                           2-d variant
    //this.drawer = new HTMLDrawer(function () {
    //    self.onCellClick()
    //});

    this.drawer = new HTMLDrawer(this.onCellClick.bind(this), this.onCellRightClick.bind(this));

    //this.drawer = new CanvasDrawer();
    this.modelArr = null;
    this.size = 0;
}

Game.prototype.start = function(s) {  //create model of the square field , s - side of the square
    this.modelArr = [];
    this.size = s;
    var self = this;
    for (var i=0; i<this.size; i++) {
        var t = [];
        for (var j=0; j<this.size; j++){
            t.push([0, 'closed']);
        }
        this.modelArr.push(t);
    }
    self.arrangeMines();
};

Game.prototype.arrangeMines = function () {
    var z = 0,
        x = 0,
        y = 0,
        self = this;
    while (z < this.size) {  // Suppose, the number of bombs = size
        x = self.getRand(0, this.size - 1);
        y = self.getRand(0, this.size - 1);
        if (!self.isBomb(y,x))  {
            this.modelArr[y][x][0] = 10;
            self.arrangeNumbers(y,x);
            z++;
        }
    }
};
Game.prototype.arrangeNumbers = function (y,x) {
    var siblings = [
        {
            x : 0,
            y : -1
        },
        {
            x : 1,
            y : -1
        },
        {
            x : 1,
            y : 0
        },
        {
            x : 1,
            y : 1
        },
        {
            x : 0,
            y : 1
        },
        {
            x : -1,
            y : 1
        },
        {
            x : -1,
            y : 0
        },
        {
            x : -1,
            y : -1
        }
    ];
    var self = this;
    for (var i = 0; i < siblings.length; i++) {
        var obj = siblings[i];
        if ( (y + obj.y) < this.modelArr.length &&
        (x + obj.x) < this.modelArr.length &&
        (y + obj.y > -1) &&
        (x + obj.x > -1) &&
        (!self.isBomb(y + obj.y, x + obj.x)) )
    {
        this.modelArr[y + obj.y][x + obj.x][0]++;
    }
}
   // console.log(this.modelArr);
};

Game.prototype.getRand = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
Game.prototype.isBomb = function (x, y) {
    //console.log(x,' ',y,' ',this.modelArr);
   if  (this.modelArr[x][y][0] == 10) {
       return true;
   }
};
Game.prototype.isNumber = function (x, y) {
    if ((this.modelArr[x][y][0] > 0 ) && (this.modelArr[x][y][0] < 9)) {
        return true;
    }
};
Game.prototype.isFlag = function (x,y) {
    if (this.modelArr[x][y][1] == 'flag') {
        return true;
    }
};
Game.prototype.onCellClick = function (x, y, modelArr) {
    var self = this;
    this.modelArr = modelArr;
    //console.log(this.drawer);
    if ((self.isBomb(x, y)) && (!self.isFlag(x, y))) {
      //  HTMLDrawer.prototype.showBomb(x,y,this.modelArr);   ----???----
        this.drawer.showBomb(x,y,this.modelArr);
    } else if ((self.isNumber(x, y)) && (!self.isFlag(x, y))) {
        this.drawer.showNumber(x,y,this.modelArr);
        this.modelArr[x][y][1] = 'open';
    } else if (!self.isFlag(x, y)) {
        this.drawer.showBlank(x,y,this.modelArr);
        this.modelArr[x][y][1] = 'open';
    }
    if (self.isWin(this.modelArr)) {
        alert('You Win!!!');
    }
};
Game.prototype.onCellRightClick = function (x, y, modelArr) {
    var state;
    this.modelArr = modelArr;
        state = this.modelArr[x][y][1];
    if (state == 'closed') {
        this.modelArr[x][y][1] = 'flag';
        this.drawer.showFlag(x,y);
    } else if (state == 'flag') {
        this.modelArr[x][y][1] = 'closed';
        this.drawer.disableFlag(x,y);
    }

};
Game.prototype.isWin = function (modelArr) {
    this.modelArr = modelArr;
    var numberOpenCells = 0,
        size = this.modelArr.length;

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (this.modelArr[j][i][1] == 'open'){
                numberOpenCells++;
                if (numberOpenCells == size*size - size) {
                    return true;
                }
            }
        }
    }
};

/*--------------------------------------end of logic------------------------------------------*/
var game = new Game();
game.start(3);
game.drawer.drawHtmlField(game.modelArr);

