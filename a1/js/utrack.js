'use strict';

/*
Put any interaction code here
*/
//For switching between input data and analysis view 
function switchtabs(obj) {
    var object = document.getElementById(obj);
    if(obj =='input_div'){
        var hide = document.getElementById("analysis_div");
        hide.style.display = 'none';
    }else{
        var hide = document.getElementById("input_div");   
        hide.style.display = 'none';          
    }
    object.style.display = 'inline';
}   

function switchViews(obj){
    var object = document.getElementById(obj);
    if(obj =='table_summary_div'){
        var hide = document.getElementById("graph_view_div");
        hide.style.display = 'none';
    }else{
        var hide = document.getElementById("table_summary_div");   
        hide.style.display = 'none';          
    }
    object.style.display = 'inline';
}


            
window.addEventListener('load', function() {
    // You should wire up all of your event handling code here, as well as any
    // code that initiates calls to manipulate the DOM (as opposed to responding
    // to events)
    console.log("Hello world!");

    // // Canvas Demo Code. Can be removed, later
    // var canvasButton = document.getElementById('run_canvas_demo_button');
    // canvasButton.addEventListener('click', function() {
    //     runCanvasDemo();
    // });

    //Get the Activity Model 
    var activityModel = new ActivityStoreModel();
    //Get the Graph Model
    var graphModel = new GraphModel();
    //getting the various view classes
    var viewClasses = createView(); 
    var inputDiv = document.getElementById('input_div');
    var analysisDiv = document.getElementById('analysis_div');
    //setting the submit text view here
    var LastSubmitTimeTextView = new viewClasses.LastSubmitTimeTextView(inputDiv, activityModel);
    //Table Summary View 
    var TableSummaryView = new viewClasses.TableSummaryView(analysisDiv, activityModel, graphModel);
    //Graph View
    var GraphView = new viewClasses.GraphView(analysisDiv, activityModel, graphModel);

    //Getting the submit button 
    var submitButton = document.getElementById('submit_button');
    //Submit Button Event Listener
    submitButton.addEventListener('click', function(){
         var minutes = document.getElementById("minutes").value;
         if(isNaN(minutes) == true || minutes<=0 ){
           alert("Please enter a valid number greater than 0 and cannot leave it blank");
           return;
        }       
        var activity = document.getElementById('activities');
        var activityName = activity.options[activity.selectedIndex].text;
        var energy = document.getElementById('energy');
        var energyRating = energy.options[energy.selectedIndex].text;
        var stress = document.getElementById('stress');
        var stressRating = stress.options[stress.selectedIndex].text;
        var happiness = document.getElementById('happiness');
        var happinessRating = happiness.options[happiness.selectedIndex].text;
        

        var dataPoint = new ActivityData(
            activityName, 
            {
                energyLevel: energyRating,
                stressLevel: stressRating,
                happinessLevel: happinessRating
            },
            minutes
        );       
        activityModel.addActivityDataPoint(dataPoint);    
    });

    //VIEWS__> GRAPH MODEL
    var selectViewButton = document.getElementById('radio_button');
    
    //This will be called only when the button is changed 
    selectViewButton.addEventListener('change', function(){
        console.log("helllo radio buttons");
        var currentView = graphModel.getNameOfCurrentlySelectedGraph();
        console.log(currentView);
        if(currentView == 'table_summary'){
            //["table_summary", "graph_canvas"];
            switchViews("graph_view_div");
            graphModel.selectGraph("graph_canvas");
        }
        else{
            switchViews("table_summary_div");
            graphModel.selectGraph("table_summary");
        }
    });

    //Getting the customize button 
    var customizeButton = document.getElementById('customize_button');

     //This will be called only when the button is changed 
    customizeButton.addEventListener('click', function(){
        console.log("customize button clicked");
        var inputElements = document.getElementsByClassName('cbox');
        var energylevelg =0;
        var stresslevelg = 0
        var happinesslevelg = 0;
        if(inputElements[0].checked){
            console.log("energy");
             energylevelg = 1;
        }
        if(inputElements[1].checked){
            console.log("stress");
             stresslevelg = 1;
        }
        if(inputElements[2].checked){
            console.log("happniess");
            happinesslevelg = 1;
        }
        
        var CustomizeGraphView = new viewClasses.CustomizeGraphView(analysisDiv,energylevelg, stresslevelg, happinesslevelg, activityModel);

    });


});