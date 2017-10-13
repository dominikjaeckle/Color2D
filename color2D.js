/*
 * Copyright 2017 Dominik Jäckle
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * 2D Colormap mapping interface
 *
 * Inspired by "Explorative Analysis of 2D Color Maps" (Steiger et al., 2015)
 *
 * Usage:
 * 1. Color2D.setColormap(Color2D.colormaps.BREMM, function() { DO STUFF });
 * 2. Color2D.getColor(x, y);
 *
 * Options BEFORE calling getColor():
 * - add a new colormap in Color2D.colormaps and set the image dimensions in
 *   Color2D.dimensions
 * - set the data range: e.g. Color2D.ranges.x = [20, 450];
 */
var Color2D = {};

Color2D.imgFolder = "data/";

/*
 * dimensions of the colormap image
 */
Color2D.dimensions = {
    width: 512,
    height: 512
};

/*
 * Available 2D colormaps - reference the png file
 */
Color2D.colormaps = {
    BREMM:      Color2D.imgFolder + "bremm.png",
    SCHUMANN:  Color2D.imgFolder + "schumann.png",
    STEIGER:    Color2D.imgFolder + "steiger.png",
    TEULING2:   Color2D.imgFolder + "teulingfig2.png",
    ZIEGLER:    Color2D.imgFolder + "ziegler.png"
};

/*
 * Active colormap - if you want to set another one, call Color2D.setColormap(c)
 */
Color2D.colormap = Color2D.colormaps.BREMM; // standard colormap

Color2D.context = null;

/*
 * initializes the 2D colormap
 */
Color2D.init = function(callback) {
    // create invisible canvas element in dom tree
    var canvas = document.createElement("canvas");
    canvas.id = "colormap";
    canvas.width = String(Color2D.dimensions.width);
    canvas.height = String(Color2D.dimensions.height);
    canvas.style = "display:none";
    document.body.appendChild(canvas);

    // create canvas context for later color reading
    Color2D.context = canvas.getContext("2d");

    // draw colormap image
    var imgObj = new Image();
    imgObj.onload = function() {
        Color2D.context.drawImage(imgObj, 0, 0);
        callback();
    };
    imgObj.src = Color2D.colormap;
};

/*
 * data ranges = min and max values of x and y dimensions
 */
Color2D.ranges = {
    x: [0, 1],
    y: [0, 1]
}

/*
 * computes the scaled X value
 */
Color2D.getScaledX = function(x) {
    var val = ((x+1) - (Color2D.ranges.x[0]+1)) / ((Color2D.ranges.x[1]+1) - (Color2D.ranges.x[0]+1));
    return (val * (Color2D.dimensions.width-1));
};

/*
 * computes the scaled Y value
 */
Color2D.getScaledY = function(y) {
    var val = ((y+1) - (Color2D.ranges.y[0]+1)) / ((Color2D.ranges.y[1]+1) - (Color2D.ranges.y[0]+1));
    return (val * (Color2D.dimensions.height-1));
};

/*
 * set a new 2D colormap
 */
Color2D.setColormap = function(colormap, callback) {
    Color2D.colormap = colormap;
    // reset canvas
    var element = document.getElementById("colormap");
    if (element !== null) {
        element.outerHTML = "";
        delete element;
    }
    // init new canvas
    Color2D.init(callback);
};

/*
 * get the color for a x and y position in space
 */
Color2D.getColor = function(x, y) {
    //var color = Color2D.context.getImageData(x, y, 1, 1); // rgba [0, 255] // not scaled
    var color = Color2D.context.getImageData(Color2D.getScaledX(x), Color2D.getScaledY(y), 1, 1); // rgba [0, 255]
    var r = color.data[0];
    var g = color.data[1];
    var b = color.data[2];
    return [r, g, b];
};
