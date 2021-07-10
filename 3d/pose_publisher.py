#!/usr/bin/env python  
import roslib
import rospy
import math
import tf
import geometry_msgs.msg

if __name__ == '__main__':
    rospy.init_node('pose_tf_listener')

    listener = tf.TransformListener()
    pub = rospy.Publisher('/robot_pose', geometry_msgs.msg.Pose, queue_size=10)
    pub_pose =  geometry_msgs.msg.Pose()
    rate = rospy.Rate(10.0)
    while not rospy.is_shutdown():
        try:
            (trans,rot) = listener.lookupTransform('/map', '/base_footprint', rospy.Time(0))
        except (tf.LookupException, tf.ConnectivityException, tf.ExtrapolationException):
            continue
        pub_pose.position.x,pub_pose.position.y,pub_pose.position.z = trans[0],trans[1],trans[2]
        pub_pose.orientation.x,pub_pose.orientation.y,pub_pose.orientation.z,pub_pose.orientation.w =  rot[0],rot[1],rot[2],rot[3]
        pub.publish(pub_pose)
        rate.sleep()