var OLS = (function(data){
    var _scope = function(data){

        this._data = data || {};

        _scope.prototype = {
            setData : function(value){
            this._data = value;
            calculate.call(this, this._data);
        },
        getData : function(){
            return this._data;
        },
            getAlphaBeta:function(){
            return calculate.call(this, this._data);
            }
        }
//------
        var calculate = function(data){
            var xMean, yMean, n, alpha, beta, sXiSquared, sXiYi;
            n = data.length;
            xMean = 0;
            yMean = 0;
            sXiSquared=0;
            sXiYi = 0;
            for(var i=0; i<data.length; i++){
                xMean += data[i].x;
                sXiSquared += Math.pow(data[i].x,2);
                sXiYi += data[i].x*data[i].y;
                yMean += data[i].y;
            }
            xMean = xMean/n;
            yMean = yMean/n;

            beta = (sXiYi - n*xMean*yMean)/(sXiSquared-n*Math.pow(xMean,2));
            alpha = yMean - beta*xMean;

            return {alpha:alpha, beta:beta}
        }
        calculate.call(this, this._data);

    }

    return _scope;
})();


var s = function( sketch ) {
    sketch.frameRate(16);
    sketch._xp = 0;
    sketch._bg_r = 60;
    sketch._bg_g = 60;
    sketch._bg_b = 60;
    sketch._bg_a = 255;
    sketch._color = null;
    sketch.dotArray = [];
    sketch.data = {};
    sketch._width = 900;
    sketch._height = 300;
    sketch._leftOffset = 15;
    sketch._topOffset = 30;
    sketch._alphaBeta = null;

    sketch.setup = function() {
        sketch._canvas = sketch.createCanvas(sketch._width, sketch._height);
        sketch.background(0,0,0, 255);
        for(var i=0; i<4; i++){
            sketch.dotArray[i] = new ChartDot(Math.random()*200, Math.random()*200);
        }
        console.log(sketch.drawingContext)

    };
    sketch.drawGridLines = function(){
        sketch.stroke(255,255,255,80)
        sketch.strokeWeight(.25)
        for(var ii=0; ii<sketch.dotArray.length; ii++){
            sketch.line(sketch.dotArray[ii]._currentPosition.x, 0, sketch.dotArray[ii]._currentPosition.x, sketch._height );
        }
    }

    sketch.scale = function(){

    } // there is a scale function in the base class but, due to the way p5 works it doesn't inherit that easily.


    sketch.draw = function() {
        sketch.background(sketch._bg_r,sketch._bg_g,sketch._bg_b,sketch._bg_a);

        var _context = sketch.drawingContext
         var grd = _context.createLinearGradient(0, 0, 0, 200);
         // light blue
         grd.addColorStop(0, 'rgba(255,128,0,30)');
         // dark blue
         grd.addColorStop(0.15, 'rgba(255,0,255, 10)');
        grd.addColorStop(1, 'rgba(255,128,0,0)');
        _context.fillStyle = grd;
        _context.fill();

        //sketch.fill(99, 99, 99, 105);
        sketch.drawGridLines()
        sketch.stroke(200,255,200,100);
        sketch.beginShape();
        for(var ii=0; ii<sketch.dotArray.length; ii++){
            sketch.vertex(sketch.dotArray[ii]._currentPosition.x, sketch.dotArray[ii]._currentPosition.y);
        }
        sketch.vertex(sketch._width, sketch._height);
        sketch.vertex(0, sketch._height);
        sketch.endShape(sketch.CLOSE);

        for(var i=0; i<sketch.dotArray.length; i++){
            sketch.smooth();
            sketch.dotArray[i].render(sketch);
        }
        var _ols = new OLS(sketch.data);

        //this._alphaBeta = _ols.getAlphaBeta();
        try{
            this._alphaBeta = _ols.getAlphaBeta()
            sketch.fill('rgba(0, 255, 0, 255)');
            var startX, startY, endX, endY;
            startX  =   30
            startY  =   sketch._topOffset+ this._alphaBeta.alpha
            endX    =   sketch._width - 30
            endY    =   sketch._topOffset+ this._alphaBeta.beta

            sketch.ellipse(startX, startY ,  30,30)
            sketch.ellipse(endX, endY ,30,30)
            sketch.line(startX, startY, endX, endY)
        }catch(e){
            //
            console.log(e)
        }
    }
/////////////////////
    sketch.mousePressed = function() {
       // sketch.background(255,0,0);
    }
/////////////////////
    sketch.mouseDown = function() {
        //sketch.background(0,255,0);
    }
/////////////////////
    sketch.setData = function(value){
        sketch.data = value;
        sketch.onDataSet();
    }
///////////////////////
    sketch.onDataSet = function(){


        if (sketch.dotArray && sketch.dotArray.length == sketch.data.length){
            for(var i=0; i<sketch.data.length; i++){
                sketch.dotArray[i].setPosition( sketch.data[i].x, sketch._topOffset + sketch.data[i].y );
            }
        }else{
            console.log("New array made ");
            sketch.dotArray = [];
            for(var i=0; i<sketch.data.length; i++){
                sketch.dotArray[i]=new ChartDot( sketch.data[i].x, sketch.data[i].y );
                sketch.dotArray[i].setData( sketch.data[i] );
            }
        }
    }
    // API
    sketch.getr = function(){
        return sketch._color;
    }
    sketch.setColor = function(value){
        var _passed = true;
        if(value.length < 4 ) _passed = false;
        for(var num in value){
            if( isNaN(parseFloat( value[num]) ) ){
                _passed= false
            }
        }

        if(!_passed) throw new Error("setColor requites an array of four numbers, all between 0 and 255")

        sketch._color = value;
    }

    sketch.getColor = function(){
        return sketch._color;
    }

    sketch.setSuperClass = function(value){
        sketch._superClass = value;
    }

    return sketch;
};
//////////////////////////////

//--- sub classes for the sketch
var ChartDot = (function(x,y){
    var _scope = function(x,y){
        this._p5Canvas = null,
        this._data = {}
        this._width = 10;
        this._x = x;
        this._y = y;
        this._currentPosition = null;
        this._desired_position = new p5.Vector(this._x, this._y);
        this._maxSpeed = 5;
        this._velocity = new p5.Vector(0,0);
        this._r = 100;
        this._g = 100;
        this._b = 100;
        this._alpha = 255;
        this._strokWeight = 1;
        this._radius = 22;
        int.call(this);
    }

    var int = function(){
        if(!this._currentPosition &&  this._desired_position){
            this._currentPosition = new p5.Vector(this._desired_position.x, this._desired_position.y)
        }else{
            this._currentPosition = new p5.Vector(0,0)
        }
    }

    _scope.prototype = {
        addLabel:function(){
            var leftPad = 10;
            var topPad = -10;
           this._p5Canvas.fill(0, 0, 0, 190);
           this._p5Canvas.rect(100, 300, 100,100);
            this._p5Canvas.rect(leftPad+this.getCurrentPosition().x,topPad+this.getCurrentPosition().y, 60, 20);
            this._p5Canvas.fill(255);
            this._p5Canvas.noStroke();
            this._p5Canvas.text(this.getData().x, leftPad+5+this.getCurrentPosition().x,topPad+15+this.getCurrentPosition().y);

        },
        removeLabel:function(){
            // may not be needed
        },
        setData:function(value){
            this._data = value;
        },
        getData:function(){
            return this._data;
        },
        setPosition:function(x,y){
            this._x = x;
            this._y = y;
            this._desired_position = new p5.Vector(this._x, this._y);
        },
        getColor:function(){
            return {
                r:this._r,
                g:this._g,
                b:this._b,
                a:this._alpha
            }
        },
        setRadius:function(value){
            this._radius = value;
        },
        getRadius:function(){
            return this._radius;
        },
        getCurrentPosition:function(){
            return this._currentPosition;
        },
        onMouseOver:function(){
            this._r = 255;
            this.addLabel();
        },
        onMouseOut:function(){
            this._r = 100;
        },
        hitTest:function(p5canvas, hitTarget){
            var left, right,  top, bottom, hit;

            left =  hitTarget.getCurrentPosition().x - ( hitTarget.getRadius()/2 );
            right =  hitTarget.getCurrentPosition().x + ( hitTarget.getRadius()/2 );
            top =  hitTarget.getCurrentPosition().y - ( hitTarget.getRadius()/2 );
            bottom =  hitTarget.getCurrentPosition().y + ( hitTarget.getRadius()/2 );

            p5canvas.mouseY > top && p5canvas.mouseY < bottom && p5canvas.mouseX > left && p5canvas.mouseX < right ? hit = true : hit =false;

            return hit;
        },

        render:function(targ){
            this._p5Canvas = targ;

            targ.stroke( 0 );
            targ.strokeWeight( this._strokWeight );
            targ.fill(
                this._r,
                this._g,
                this._b,
                this._alpha);
            this._velocity = new p5.Vector(this._desired_position.x, this._desired_position.y);
            this._velocity.sub(this._currentPosition);
            this._velocity.div(this._maxSpeed);

            if(isNaN( this._velocity.x ))  this._velocity.x = 0;
            if(isNaN( this._velocity.y ))  this._velocity.y = 0;
            if(isNaN(this._velocity.y)) console.log("VEL Y norm"+this._velocity.y)

            this._currentPosition.add(this._velocity);

            targ.ellipse(this._currentPosition.x, this._currentPosition.y, this._radius, this._radius);
            targ.line(this._currentPosition.x, this._currentPosition.y, this._desired_position.x, this._desired_position.y)
            targ.fill(255,0,0,255);
            targ.ellipse(this._desired_position.x, this._desired_position.y, this._radius/3, this._radius/3);

            this.hitTest(targ, this) ? this.onMouseOver() : this.onMouseOut();
        }
    }
    return _scope;
})();



function ProcessingRenderer(target, opt_data, opt_config) {
    opt_config ? opt_config.createCanvas = false : opt_config = {createCanvas:false};
    BaseChart.call(this, target, opt_data, opt_config); // call super constructor.
}

ProcessingRenderer.prototype = Object.create(BaseChart.prototype);
ProcessingRenderer.prototype.constructor = ProcessingRenderer;


ProcessingRenderer.prototype.postInit = function() {
    this.setPlaying(false);
    this._p5 = new p5(s, this.getTarget());
    this._p5.background(0,0,0);
}


ProcessingRenderer.prototype.render = function(){
    //console.log("Rendering...", this.getData())
    this._p5.setData( this.getData() );
}