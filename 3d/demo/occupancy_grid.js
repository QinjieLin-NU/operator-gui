/**
 *  adapted from http://robotwebtools.org/jsdoc/ros2djs/current/OccupancyGrid.js.html
 */

function OccupancyGrid(message) {
    // set the size
    // console.log("here for map",message.data.length)
    this.width = message.info.width;
    this.height = message.info.height;
    scale = message.info.resolution;
    
    imageData = lpm_ctx.getImageData(0,0,this.width, this.height);
    for ( var j = 0; j < message.data.length; j++) {
        // determine the index into the map data
        var data = message.data[j];
        var val=100-data;

        // r
        imageData.data[j] = val;
        // g
        imageData.data[j+1] = val;
        // b
        imageData.data[j+2] = val;
        // a
        imageData.data[j+3] = 255;
    }
    
    lpm_ctx.putImageData(imageData, 0, 0);
    occupancy_grid_texture.needsUpdate = true;
    
};