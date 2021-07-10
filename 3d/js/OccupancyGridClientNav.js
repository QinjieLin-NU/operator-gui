/**
 * @author Russell Toris - rctoris@wpi.edu
 */

/**
 * A OccupancyGridClientNav uses an OccupancyGridClient to create a map for use with a Navigator.
 *
 * @constructor
 * @param options - object with following keys:
 *   * ros - the ROSLIB.Ros connection handle
 *   * topic (optional) - the map topic to listen to
 *   * rootObject (optional) - the root object to add this marker to
 *   * continuous (optional) - if the map should be continuously loaded (e.g., for SLAM)
 *   * serverName (optional) - the action server name to use for navigation, like '/move_base'
 *   * actionName (optional) - the navigation action name, like 'move_base_msgs/MoveBaseAction'
 *   * rootObject (optional) - the root object to add the click listeners to and render robot markers to
 *   * withOrientation (optional) - if the Navigator should consider the robot orientation (default: false)
 *   * viewer - the main viewer to render to
 */
 var NAV2D = NAV2D || {
  REVISION : '0.3.0'
  };

 NAV2D.OccupancyGridClientNav = function(options) {
    var that = this;
    options = options || {};
    this.ros = options.ros;
    var topic = options.topic || '/map';
    var continuous = options.continuous;
    this.serverName = options.serverName || '/move_base';
    this.actionName = options.actionName || 'move_base_msgs/MoveBaseAction';
    this.rootObject = options.rootObject || new createjs.Container();
    this.viewer = options.viewer ;
    this.zoomScale = options.zoomScale || 0.25; //ptions.zoomScale ;
    this.withOrientation = options.withOrientation || false;
  
    this.navigator = null;
  
    // Add planned path
    // var plannedPath = new ROS2D.NavPath({
		// 	ros : this.ros,
		// 	rootObject : this.viewer.scene,
		// 	pathTopic : '/move_base/GlobalPlanner/plan'
		// });


    // setup a client to get the map
    var client = new ROS2D.OccupancyGridClient({
      ros : this.ros,
      rootObject : this.rootObject,
      continuous : continuous,
      topic : topic
    });
    client.on('change', function() {
      that.navigator = new NAV2D.Navigator({
        ros : that.ros,
        serverName : that.serverName,
        actionName : that.actionName,
        rootObject : that.rootObject,
        withOrientation : that.withOrientation
      });
      
      // scale the viewer to fit the map
      that.viewer.scaleToDimensions(client.currentGrid.width*that.zoomScale, client.currentGrid.height*that.zoomScale);
      that.viewer.shift(client.currentGrid.pose.position.x*that.zoomScale, client.currentGrid.pose.position.y*that.zoomScale);
    });
  };