function TouchZoom (element) {
    this.element = element;
    this.scale = 1;
    this.tapScale = 2;
    this.lastScale = this.scale;
    this.lastDimensions = {
        width : this.element.width,
        height : this.element.height
    };
    this.translation = { x : 0, y : 0 };
    this.manager = new Hammer.Manager(this.element);
    jQuery(this.element).css("-webkit-transform-origin", "0 0");
}
var transformation = "translate3d(" + position.x + "px," + position.y + "px, 0)";
    transformation += "scale3d(" + scale + "," + scale + ", 1)";
    this.element.style.webkitTransform = transformation;
},
    
calcScalePoint : function (origin) {
    return {
        x : origin.x - this.element.offsetLeft - this.translation.x,
        y : origin.y - this.element.offsetTop - this.translation.y,
    };
},

calcDimensions : function () {
    return {
        width : this.element.width * this.scale,
        height : this.element.height * this.scale
    };
},

reset : function () {
    this.scale = 1;
    this.tapScale = 2;
    this.lastScale = this.scale;
    this.lastDimensions.width = this.element.width;
    this.lastDimensions.height = this.element.height;
    this.translation = { x : 0, y : 0 };
    this.transform(this.translation, this.scale);
},

getEvent : function (type, status) {
    return {
        "type" : type,
        "status" : status,
        "scale" : this.scale,
        "translation" : this.translation
    };
},

pan : function (cb) {
    var pan = new Hammer.Pan({ threshold : this.panThreshold });
    this.manager.add(pan);

    this.manager.on("pan panend", jQuery.proxy(function (ev) {
        var position = {
            x : this.translation.x + ev.deltaX,
            y : this.translation.y + ev.deltaY
        };          
        this.transform(position, this.scale);      
        if (jQuery.isFunction(cb)) {
            var event = this.getEvent("pan", 1);
            cb(event);
        }

        if (ev.type == "panend") {
            this.translation = position;
            if (typeof event !== 'undefined') {
                event.status = 0;
                cb(event);
            }
        }
    }, this));
},

pinchzoom : function (cb) {
    var pinch = new Hammer.Pinch();
    this.manager.add(pinch);

    this.manager.on("pinch pinchend", jQuery.proxy(function (ev) {
        this.scale = this.lastScale * ev.scale;
        var scalePoint = this.calcScalePoint(ev.center);
        var dimensions = this.calcDimensions();
        var dimensionsDiff = {
            width : dimensions.width - this.lastDimensions.width,
            height : dimensions.height - this.lastDimensions.height
        };        
        this.translation.x += ((-scalePoint.x * dimensionsDiff.width) / dimensions.width);
        this.translation.y += ((-scalePoint.y * dimensionsDiff.height) / dimensions.height);

        this.transform(this.translation, this.scale);

        this.lastDimensions = dimensions;
        if (jQuery.isFunction(cb)) {
            var event = this.getEvent("pinchzoom", 1);
            cb(event);
        }

        if (ev.type == "pinchend") {
            this.lastScale = this.scale;
            if (typeof event !== 'undefined') {
                event.status = 0;
                cb(event);
            }
        }
    }, this));
},

doubletapzoom : function (cb) {
    var doubleTap = new Hammer.Tap({
        taps :2,
        interval: 300,
        time : 500,
        threshold : 50,
        posThreshold : 30
    });
    this.manager.add(doubleTap);

    this.manager.on("tap", jQuery.proxy(function (ev) {
        if (this.tapScale > this.scale) {         
            this.scale = this.tapScale;
            var scalePoint = this.calcScalePoint(ev.center);
            this.translation.x = -scalePoint.x * (this.scale - 1);
            this.translation.y = -scalePoint.y * (this.scale - 1);

            this.transform(this.translation, this.scale);

            this.lastDimensions = this.calcDimensions();
            this.lastScale = this.scale;
            if (jQuery.isFunction(cb)) {
                var event = this.getEvent("doubletapzoom", 0);
                cb(event);
            }
        }
        else this.reset();
    }, this));
},

add : function (functions, cb) {
    var callback;
    if (jQuery.isFunction(cb)) callback = cb;

    if (jQuery.isArray(functions)) {
        var panIndex = jQuery.inArray("pan", functions);
        var pinchIndex = jQuery.inArray("pinchzoom", functions);
        var doubleTapIndex = jQuery.inArray("doubletapzoom", functions);
        if (panIndex >= 0) this.pan(callback);
        if (pinchIndex >= 0) this.pinchzoom(callback);
        if (doubleTapIndex >= 0) this.doubletapzoom(callback);
    }
    else {
        switch (functions) {
            case "pan" :
                this.pan(callback);
                break;
            case "pinchzoom" :
                this.pinchZoom(callback);
                break;
            case "doubletapzoom" :
                this.doubleTapZoom(callback);
        }
    }  
},
};

