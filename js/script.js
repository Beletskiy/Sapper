function Game () {
    this.drawer = new HTMLDrawer();
    //this.drawer = new CanvasDrawer();
    // this.drawer.drawField (this.field);
    this.modelArr = null;
  //  this.modelObj = null;
    this.size = 0;

}
/*--------------------------------------------------visualization-------------------------------------------*/
function HTMLDrawer () {
  this.htmlField = null;
}

function CanvasDrawer () {

}

HTMLDrawer.prototype.drawHtmlField = function (modelArr) {
   var htmlField = modelArr,
       table = document.createElement('table'),
       self = this,
       tr = null, td = null;

    for (var i=0; i<htmlField.length; i++) {
        tr = document.createElement('tr');
        table.appendChild(tr);
        for (var j=0; j<htmlField.length; j++) {
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
                Game.prototype.onCellClick(x, y,modelArr);
            };
            var rightClickHandler = function (e) {
                var el = e.currentTarget,
                    id = el.getAttribute('id'),
                    parts = id.split('_'),
                    x = parts[1],
                    y = parts[2];
                Game.prototype.onCellRightClick(x, y,modelArr);
                e.preventDefault();
            }
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
            document.getElementById(cellId).
                removeEventListener("click", HTMLDrawer.prototype.drawHtmlField['leftClickHandler']); // не работает, объявить handler через prototype ?
            if (Game.prototype.isBomb(j,i)) {
                document.getElementById(cellId).classList.add('bomb');
            }
        }
    }
};
HTMLDrawer.prototype.showNumber = function (x,y,modelArr) {
    var htmlField = modelArr,
        cellId = 'c_'+x+'_'+y;

    document.getElementById(cellId).classList.remove('closed');
    document.getElementById(cellId).innerHTML = htmlField[x][y][0];

};
HTMLDrawer.prototype.showBlank = function (x, y, modelArr) {
    var htmlField = modelArr,
        cellId = 'c_'+x+'_'+y;
    document.getElementById(cellId).classList.remove('closed');
};
HTMLDrawer.prototype.showFlag = function (x, y, modelArr) {
    var cellId = 'c_'+x+'_'+y;
    document.getElementById(cellId).classList.remove('closed');
    document.getElementById(cellId).classList.add('flag');
};
HTMLDrawer.prototype.disableFlag = function (x, y, modelArr) {
    var cellId = 'c_'+x+'_'+y;
    document.getElementById(cellId).classList.remove('flag');
    document.getElementById(cellId).classList.add('closed');
};

/*----------------------------------------------end of visualization----------------------------------------*/

/*---------------------------------------------------logic--------------------------------------------------*/
Game.prototype.start = function(s) {  //create model of the square field , w - side of the square
    this.modelArr = [];
    this.size = s;
  //  this.modelObj = {};
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
    console.log(this.modelArr);
};

Game.prototype.getRand = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
Game.prototype.isBomb = function (x, y) {
   if  (this.modelArr[x][y][0] == 10) {
       return true;
   }
};
Game.prototype.isNumber = function (x, y) {
    if ((this.modelArr[x][y][0] >0 ) && (this.modelArr[x][y][0] < 9)) {
        return true;
    }
};
Game.prototype.onCellClick = function (x, y, modelArr) {
    var self = this;
    this.modelArr = modelArr;
    if (self.isBomb(x, y)) {
        HTMLDrawer.prototype.showBomb(x,y,this.modelArr); //!!! сделать динамически HTML или Canvas, проверять объект какого типа создан ?
    } else if (self.isNumber(x, y)) {
        HTMLDrawer.prototype.showNumber(x,y,this.modelArr);
    } else {
        HTMLDrawer.prototype.showBlank(x,y,this.modelArr);
    }

};
Game.prototype.onCellRightClick = function (x, y, modelArr) {
    var state = null;
    this.modelArr = modelArr;
        state = this.modelArr[x][y][1];
    if (state == 'closed') {
        this.modelArr[x][y][1] = 'flag';
        HTMLDrawer.prototype.showFlag(x,y,this.modelArr);
    } else if (state == 'flag') {
        this.modelArr[x][y][1] = 'closed';
        HTMLDrawer.prototype.disableFlag(x,y,this.modelArr);
    }


};


/*--------------------------------------end of logic------------------------------------------*/
var game = new Game();
game.start(3);
game.drawer.drawHtmlField(game.modelArr);

