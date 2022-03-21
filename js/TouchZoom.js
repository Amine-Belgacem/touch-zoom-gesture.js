/**
 * ZoomGesture: Touch supporting canvas built for social media quotes
 * @copyright Ameen Belkacem 2015
 * @version 0.2
 * @license Apache-2.0
 */

function ZoomGesture (element) {
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

ZoomGesture.prototype = {

    // Set scale factore
    scaleFactor : function (factor) {
        this.scale = factor;
    },

    // Calculate scaling starting point coordinates
    calculateScalePoint : function (origin) {
        return {
            x : origin.x - this.element.offsetLeft - this.translation.x,
            y : origin.y - this.element.offsetTop - this.translation.y,
        };
    },

    // Calculate element's dimensions
    calculateDimensions : function () {
        return {
            width: this.element.width * this.scale,
            height: this.element.height * this.scale
        };
    },

    // Sets element's dimension and position to initial value
    resetScale : function () {
        this.scale = 1;
        this.tapScale = 2;
        this.lastScale = this.scale;
        this.lastDimensions.width = this.element.width;
        this.lastDimensions.height = this.element.height;
        this.translation = { x: 0, y: 0 };
        this.transform(this.translation, this.scale);
    },

    // Return event object
    getEvent : function (type, status) {
        return {
            "type" : type,
            "status" : status,
            "scale" : this.scale,
            "translation" : this.translation
        };
    },

    // Translate and scale element
    transform : function (position, scale) {
        var transformation = "translate3d(" + position.x + "px," + position.y + "px, 0)";
        transformation += "scale3d(" + scale + "," + scale + ", 1)";
        this.element.style.webkitTransform = transformation;
    },

    // Pan element and execute callback
    pan : function (callback) {
        var pan = new Hammer.Pan();
        this.manager.add(pan);
        this.manager.on("pan panend", jQuery.proxy(function (ev) {
            var position = {
                x : this.translation.x + ev.deltaX,
                y : this.translation.y + ev.deltaY
            };          
            this.transform(position, this.scale);
            if (jQuery.isFunction(callback)) {
                var event = this.getEvent("pan", 1);
                callback(event);
            }

            if (ev.type == "panend") {
                this.translation = position;
                if (typeof event !== 'undefined') {
                    event.status = 0;
                    callback(event);
                }
            }
        }, this));
    },

    // Pinch element and execute callback
    pinch : function (callback) {
        var pinch = new Hammer.Pinch();
        this.manager.add(pinch);
        this.manager.on("pinch pinchend", jQuery.proxy(function (ev) {
            console.log("pinched");
            this.scale = this.lastScale * ev.scale;
            var scalePoint = this.calculateScalePoint(ev.center);
            var dimensions = this.calculateDimensions();
            var dimensionsDiff = {
                width : dimensions.width - this.lastDimensions.width,
                height : dimensions.height - this.lastDimensions.height
            };        
            this.translation.x += ((-scalePoint.x * dimensionsDiff.width) / dimensions.width);
            this.translation.y += ((-scalePoint.y * dimensionsDiff.height) / dimensions.height);
            this.transform(this.translation, this.scale);

            this.lastDimensions = dimensions;
            if (jQuery.isFunction(callback)) {
                var event = this.getEvent("pinch", 1);
                callback(event);
            }

            if (ev.type == "pinchend") {
                this.lastScale = this.scale;
                if (typeof event !== 'undefined') {
                    event.status = 0;
                    callback(event);
                }
            }
        }, this));
    },

    // Zoom element and execute callback
    doubleTap : function (callback) {
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
                var scalePoint = this.calculateScalePoint(ev.center);
                this.translation.x = -scalePoint.x * (this.scale - 1);
                this.translation.y = -scalePoint.y * (this.scale - 1);
                this.transform(this.translation, this.scale);
                this.lastDimensions = this.calculateDimensions();
                this.lastScale = this.scale;
                if (jQuery.isFunction(callback)) {
                    var event = this.getEvent("doubleTap", 0);
                    callback(event);
                }
            }
            else this.resetScale();
        }, this));
    },

    // Add event handlers to element
    add : function (functions, callback) {
        if (!jQuery.isFunction(callback)) var callback;

        if (jQuery.isArray(functions)) {
            var panIndex = jQuery.inArray("pan", functions);
            var pinchIndex = jQuery.inArray("pinch", functions);
            var doubleTapIndex = jQuery.inArray("doubleTap", functions);
            if (panIndex >= 0) this.pan(callback);
            if (pinchIndex >= 0) this.pinch(callback);
            if (doubleTapIndex >= 0) this.doubleTap(callback);
        }
        else {
            switch (functions) {
                case "pan" :
                    this.pan(callback);
                    break;
                case "pinch" :
                    this.pinch(callback);
                    break;
                case "doubleTap" :
                    this.doubleTap(callback);
            }
        }  
    },
};