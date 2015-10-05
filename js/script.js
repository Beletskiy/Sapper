function Game () {
    this.drawer = new HTMLDrawer();
    //this.drawer = new CanvasDrawer();
    // this.drawer.drawField (this.field);
    this.modelArr = null;
    this.modelObj = null;
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
          //  td.setAttribute('value', htmlField[j][i]);
            td.addEventListener("click", function(e){
                var el = e.currentTarget,
                    id = el.getAttribute('id'),
                    parts = id.split('_'),
               //   val = el.getAttribute('value'),
                    x = parts[1],
                    y = parts[2];
                    self.onCellClick(x, y);
            } );
        }
    }
    gameField.appendChild(table);
};
HTMLDrawer.prototype.onCellClick = function (x,y) {
    var self = this,
    cellName = "c_"+x+"_"+y; // create cell name
    if (self.htmlField[x][y] !== 'b') {
        document.getElementById(cellName).innerHTML = val;
    }

};
/*----------------------------------------------end of visualization----------------------------------------*/

/*---------------------------------------------------logic--------------------------------------------------*/
Game.prototype.start = function(s) {  //create model of the square field , w - side of the square
    this.modelArr = [];
    this.size = s;
    this.modelObj = {};
    var self = this;
    for (var i=0; i<this.size; i++) {
        var t = [];
        for (var j=0; j<this.size; j++){
            t.push(0);
        }
        this.modelArr.push(t);
    }
  /*  for (var i = 0; i < this.size; i++) {
        for (var j = 0; j < this.size; j++ ){


        }
        }
    } */
    this.modelObj = {
        arr : this.modelArr,
    };
    console.log(this.modelObj);
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
            this.modelArr[y][x] = 10;
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
        this.modelArr[y + obj.y][x + obj.x]++;
    }
}
  //  console.log(this.modelArr);
};

Game.prototype.getRand = function (min,max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
Game.prototype.isBomb = function (x,y) {
   // console.log(this.modelArr[x][y]);
   if  (this.modelArr[x][y] == 10) {
       return true;
   }
};
Game.prototype.onCellClick = function (x,y) {
    var self = this,
        cellName = "c_"+x+"_"+y; // create cell name
    if (self.modelArr[x][y] == '10') {

    }

};

/*--------------------------------------end of logic------------------------------------------*/
var game = new Game();
game.start(5);
game.drawer.drawHtmlField(game.modelArr);
