'use strict';

var ACTIVITY_DATA_ADDED_EVENT = 'ACTIVITY_DATA_ADDED_EVENT';
var ACTIVITY_DATA_REMOVED_EVENT = 'ACTIVITY_DATA_REMOVED_EVENT';

var GRAPH_SELECTED_EVENT = 'GRAPH_SELECTED_EVENT';

/**
 * Represents a single activity data point.
 * @param activityType The type of activity. A string
 * @param healthMetricsDict A dictionary of different health metrics. The key is the
 * health data type (e.g., energy level, stress level, etc.), while the value is
 * the value the user gave to that activity.
 * @param activityDurationInMinutes A number
 * @constructor
 */
var ActivityData = function(activityType, healthMetricsDict, activityDurationInMinutes) {
    this.activityType = activityType;
    this.activityDataDict = healthMetricsDict;
    this.activityDurationInMinutes = activityDurationInMinutes
};

/**
 * An object which tracks all of the data
 * @constructor
 */
var ActivityStoreModel = function() {
    this.listeners = [];
    this.datapointsArray = [];
};

// _ is the Underscore library
// This extends the JavaScript prototype with additional methods
// This is a common idiom for defining JavaScript classes
_.extend(ActivityStoreModel.prototype, {

    /**
     * Add a listener to the listeners we track
     * @param listener The listener is a callback function with the following signature:
     * (eventType, eventTime, activityData) where eventType is a string indicating
     * the event type (one of ACTIVITY_DATA_ADDED_EVENT or ACTIVITY_DATA_REMOVED_EVENT), and
     * activityData the ActivityData added or removed.
     */

     //listener(eventType, eventTime, activityData)
    addListener: function(listener) {
        // TODO
        this.listeners.push(listener);
    },

    /**
     * Should remove the given listener.
     * @param listener
     */
    removeListener: function(listener) {
        // TODO
        //not sure shoudl confirm
        _.without(this.listeners, listener);
    },

    /**
     * Should add the given data point, and alert listeners that a new data point has
     * been added.
     * @param activityDataPoint
     */
    addActivityDataPoint: function(activityDataPoint) {
        // TODO
        this.datapointsArray.push(activityDataPoint);
        var eventType = ACTIVITY_DATA_ADDED_EVENT;
        var eventTime = (function getDateTime() {
                            var d = new Date();
                            var months = [ "January","February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"];
                            var m = d.getMonth();
                            var day = d.getDay();
                            var year = d.getFullYear();
                            var hours = d.getHours();
                            var dayNight = "AM"; 
                            if(hours >= 12) {
                              var hours = hours - 12;
                              var dayNight = "PM";
                            }
                            if(hours == 0){
                                var hours = 12;
                            }
                            var minutes = d.getMinutes();
                            if(minutes<10){
                                minutes = "0" + minutes;
                            }
                            var monthName = months[m];

                            return monthName + " " + day + ", " + year + " " + hours + ":" + minutes + " " + dayNight;
                        })();

        //Registering the listeners
        _.each(this.listeners,
            function(listener){
                listener(eventType, eventTime, activityDataPoint);
            })
    },

    /**
     * Should remove the given data point (if it exists), and alert listeners that
     * it was removed. It should not alert listeners if that data point did not
     * exist in the data store
     * @param activityDataPoint
     */
    removeActivityDataPoint: function(activityDataPoint) {
        // TODO
        //Not Sure
        _.without(this.datapointsArray, activityDataPoint);
    },

    /**
     * Should return an array of all activity data points
     */
    getActivityDataPoints: function() {
        // TODO
        //Not Sure
        return this.datapointsArray;
    }
});

/**
 * The GraphModel tracks what the currently selected graph is.
 * You should structure your architecture so that when the user chooses
 * a new graph, the event handling code for choosing that graph merely
 * sets the new graph here, in the GraphModel. The graph handling code
 * should then update to show the selected graph, along with any components
 * necessary to configure that graph.
 * @constructor
 */
var GraphModel = function() {
    this.currentgraphName = "table_summary";
    this.graphNames = ["table_summary", "graph_canvas"];
    this.listeners=[];
};

_.extend(GraphModel.prototype, {

    /**
     * Add a listener to the listeners we track
     * @param listener The listener is a callback function with the following signature:
     * (eventType, eventTime, eventData) where eventType is a string indicating
     * the event type (specifically, GRAPH_SELECTED_EVENT),
     * and eventData indicates the name of the new graph.
     */
    addListener: function(listener) {
        // TODO
        this.listeners.push(listener);

    },

    /**
     * Should remove the given listener.
     * @param listener
     */
    removeListener: function(listener) {
        // TODO
        //not sure shoudl confirm
        _.without(this.listeners, listener);
    },

    /**
     * Returns a list of graphs (strings) that can be selected by the user
     */
    getAvailableGraphNames: function() {
        // TODO
        return this.graphNames;

    },

    /**
     * Should return the name of the currently selected graph. There should
     * *always* be one graph that is currently available.
     */
    getNameOfCurrentlySelectedGraph: function() {
        // TODO
        return this.currentgraphName;
    },

    /**
     * Changes the currently selected graph to the graph name given. Should
     * broadcast an event to all listeners that the graph changed.
     * @param graphName
     */
    selectGraph: function(graphName) {
        // TODO
        var eventType = GRAPH_SELECTED_EVENT;
        this.currentgraphName = graphName;

         //Registering the listeners
        _.each(this.listeners,
            function(listener){
                listener(graphName);
            })
    }

});

/**
 * Will generate a number of random data points and add them to the model provided.
 * If numDataPointsToGenerate is not provided, will generate and add 100 data points.
 * @param activityModel The model to add data to
 * @param numDataPointsToGenerate The number of points to generate.
 *
 * Example:
 *
 * generateFakeData(new ActivityStoreModel(), 10);
 */
function generateFakeData(activityModel, numDataPointsToGenerate) {
    var fakeActivities = [];
    _.times(
        5,
        function() {
            fakeActivities.push("Activity " + (fakeActivities.length+1));
        }
    );
    numDataPointsToGenerate = (!_.isNumber(numDataPointsToGenerate) || numDataPointsToGenerate < 0) ? 100 : numDataPointsToGenerate;
    _.times(
        numDataPointsToGenerate,
        function() {
            var activityDataPoint = new ActivityData(
                fakeActivities[_.random(fakeActivities.length-1)],
                {
                    energyLevel: _.random(10),
                    stressLevel: _.random(10),
                    happinessLevel: _.random(10)
                },
                _.random(60)
            );
            activityModel.addActivityDataPoint(activityDataPoint);
        }
    );
}
