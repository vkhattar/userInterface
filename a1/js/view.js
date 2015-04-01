'use strict';

// Put your view code here (e.g., the graph renderering code)
 // Define our views
function createView(){
	
	var AbstractView = function () {
	};

	_.extend(AbstractView.prototype, {
	    _instantiateView: function (templateId, attachToElement) {
	        var template = document.getElementById(templateId);
	        this.hostElement = document.createElement('div');
	        this.hostElement.innerHTML = template.innerHTML;
	        attachToElement.appendChild(this.hostElement);
	    }
	});

	var LastSubmitTimeTextView = function (attachToElement, ActivityStoreModel) {
	    this._instantiateView('last_submit_time_template', attachToElement);

	    var span = this.hostElement.getElementsByClassName('last_submit_time_span')[0];
	    
	     ActivityStoreModel.addListener(function (eventType, eventTime, activityDataPoint) {
	         span.innerText = eventTime;
	     });
	};
	_.extend(LastSubmitTimeTextView.prototype, AbstractView.prototype);

	var TableSummaryView = function (attachToElement, ActivityStoreModel, GraphModel) {
	    this._instantiateView('table_summary_template', attachToElement);

	    
	    var activityList = {"writing code" : 0, "eating dinner": 0, "playing sports": 0,
	    	 					  "studying for exams" : 0, "attending lectures" : 0, 
	    	 					  "watching TV" : 0};

	      GraphModel.addListener(function (graphName) {
	         var graphName = graphName;
	     });	 					  

	     ActivityStoreModel.addListener(function (eventType, eventTime, activityDataPoint) {
	     					  
	     	var activityType = activityDataPoint.activityType;
	     	var timeSpent = activityDataPoint.activityDurationInMinutes;
	     	var table = document.getElementById('summaryTable');

	     	//Adding the Activity for the first Time
	     	//console.log(activityList[activityType]);
	     	if('0'==activityList[activityType]){
	     		
	     		activityList[activityType] = 1;
	     		console.log(activityList[activityType]);
	     		var row = table.insertRow(-1);
	     		//row.setAttribute("id", activityType);	
	     		var cell1 = row.insertCell(0);
		    	var cell2 = row.insertCell(1);
		    	cell2.setAttribute('id', activityType);
		        cell1.innerHTML = activityDataPoint.activityType;
		        cell2.innerHTML = activityDataPoint.activityDurationInMinutes;
		       

	     	}
	     	else{
	     		 //var items = document.getElementsByTagName('td');
	     		 var item = document.getElementById(activityType);
	     		 console.log(item);
	     		 var oldTime =  parseInt(item.innerHTML);
	     		 var newTime = oldTime + parseInt(timeSpent);
	     		 item.innerHTML = newTime;
	     	 }				  
	    	 
	     });
	};
	_.extend(TableSummaryView.prototype, AbstractView.prototype);

	var GraphView = function(attachToElement, ActivityStoreModel, GraphModel) {
		this._instantiateView('graph_canvas_template', attachToElement);
	     
	     /*
	      *Please see for making the canvas I 
	      *Followed the tutorial found in this book http://diveintohtml5.info/canvas.html
	     */
	    var canvas = document.getElementById('canvas_demo');
	    var context = canvas.getContext('2d');
	    var width = canvas.width;
	    var height = canvas.height;

	    context.fillStyle = 'white';
	    //fillRect(x,y,width,height)
	    context.fillRect(0, 0, width, height);
	    context.strokeRect(0,0,width,height);

	    //Making the vertical grid Lines
	    for(var x = 1.5; x<width; x+=((width)/7)){
	        context.moveTo(x,0);
	        context.lineTo(x, height);
	    }
	    //Making the Horizontal Lines
	    for(var y = 1.5; y<height; y+=((height)/7)){
	        context.moveTo(0,y);
	        context.lineTo(width, y);
	    }

	    context.strokeStyle = 'grey';
	    //context.moveTo(0, 0);
	    context.stroke();

	    //Make x and y axis
	    context.beginPath();
	    var startX = (1.5 + (width/7));
	    var startY = (height-((height/7)));
	    context.moveTo(startX,0);
	    context.lineTo(startX,height);
	    context.moveTo(0, startY);
	    context.lineTo(width, startY);

	    context.strokeStyle = "black";
	    context.stroke();
	    context.closePath();
	    
	    //lengend for legend
	    context.font = '20pt Comic Sans MS';
        context.fillStyle = 'pink';
        context.fillText('Legend-:', 200, 30);

        //lengend Happiness
	    context.font = '15pt Comic Sans MS';
        context.fillStyle = 'red';
        context.fillText(':Happiness', 330, 20);
        //Happiness
        context.beginPath();
		context.strokeStyle="red";
		context.lineWidth="4";
		context.arc(320, 15, 9, 0, 2*Math.PI);
		context.stroke();
		context.closePath();

		//lengend Energy
	    context.font = '15pt Comic Sans MS';
        context.fillStyle = 'green';
        context.fillText(':Energy', 335, 45);
		//EnergyRectangle
		context.beginPath();
		context.lineWidth="4";
		context.strokeStyle="green";
		context.rect(310,30,15,15);
		context.stroke();
		context.closePath();

		//lengend for stress
	    context.font = '15pt Comic Sans MS';
        context.fillStyle = 'blue';
        context.fillText(':Stress', 335, 65);
		//StressSemiCircle
		context.beginPath();
		context.lineWidth="2";
		context.arc(320,55,9,0,Math.PI);
		
		context.strokeStyle="black";
		context.fillStyle = 'blue';
  		context.fill();
		context.stroke();
		context.closePath();

	    //Label Axis Y
	    var axisLabel = "Y:Rating";
	    context.font = "16px Arial";
	    context.fillStyle = "Red";
	    context.textBaseline = "top";
	    context.fillText(axisLabel, 5, 50);
	    var axisLabel = "X:Activities";
	    //Label AxisX


	    context.font = "16px Arial";
	    context.fillStyle = "Red";
	    context.textBaseline = "top";
	    context.fillText(axisLabel, 3, height-50);

	    var activityList = ["Coding","Dinner","Sports",
	                        "Studying", "Lectures", 
	                        "WatchingTV"];                 

	     //Text Properties for axis labeling                   
	    context.font = "15px Arial";
	    context.fillStyle = "Black";
	    context.textBaseline = "top";

	    //Loop to Write Activities Name on the X Axis
	    var x = 0;
	    for(var i = 0; i<activityList.length; i+=1){
	        
	        x = x+(width)/7;
	        context.fillText(activityList[i],3+x,height-70);
	    } 
	    //Loop to Write Numbers on the Y Axis
	    var y = 0;
	    for(var i = 5; i>0; i-=1){ 
	        //y = y+(height)/6;
	        y = y+(height)/7;
	        context.fillText(i,70, 12+y);   
	    } 

	    GraphModel.addListener(function (graphName) {
	         var graphName = graphName;
	     });	

	    ActivityStoreModel.addListener(function (eventType, eventTime, activityDataPoint){
	    	
	    	var activityType = activityDataPoint.activityType;
	    	var data = activityDataPoint.activityDataDict;

	    	var stressLevel = parseInt(data.stressLevel);
	    	var energyLevel = parseInt(data.energyLevel);
	    	var happinessLevel = parseInt(data.happinessLevel);
	    	var ActivityNumber = 1;


	    	if(activityType == 'writing code'){
	    		ActivityNumber = 1;
	    	}	
	    	else if(activityType == 'eating dinner'){
	    		ActivityNumber = 2;
	    	}
	    	else if(activityType == 'playing sports'){
	    		ActivityNumber = 3;
	    	}
	    	else if(activityType == 'studying for exams'){
	    		ActivityNumber = 4;
	    	}
	    	else if(activityType == 'attending lectures'){
	    		ActivityNumber = 5;
	    	}
	    	else if(activityType == 'watching TV'){
	    		ActivityNumber = 6;
	    	}

	    	var StartingPointXAxis = 40 + ActivityNumber*((width)/7);
	    	var StartingPointYAxisStress = height-((stressLevel+1)*height-140)/7;
	    	var StartingPointYAxisEnergy = height-((energyLevel+1)*height-140)/7;
	    	var StartingPointYAxisHappiness = height-((happinessLevel+1)*height-140)/7;

	    	//Getting the canvas
			var canvas = document.getElementById("canvas_demo");
			var context = canvas.getContext("2d");

			//HappinessCircle
			context.beginPath();
			context.strokeStyle="red";
			context.lineWidth="4";
			context.arc(StartingPointXAxis, StartingPointYAxisHappiness, 9, 0, 2*Math.PI);
			context.stroke();
			context.closePath();

			//EnergyRectangle
			context.beginPath();
			context.lineWidth="4";
			context.strokeStyle="green";
			context.rect(StartingPointXAxis-8,StartingPointYAxisEnergy,15,15);
			context.stroke();
			context.closePath();

			//StressSemiCircle
			context.beginPath();
			context.lineWidth="2";
			context.arc(StartingPointXAxis,StartingPointYAxisStress,9,0,Math.PI);
			
			context.strokeStyle="black";
			context.fillStyle = 'blue';
      		context.fill();
			context.stroke();
			context.closePath();
		
	    });
	    

	}
	_.extend(GraphView.prototype, AbstractView.prototype);




	var CustomizeGraphView = function(attachToElement, EnergyLevelG, StressLevelG, HappinessLevelG, ActivityStoreModel) {
		this._instantiateView('graph_canvas_template', attachToElement);
		var canvas = document.getElementById('canvas_demo');
	    var context = canvas.getContext('2d');
	    var width = canvas.width;
	    var height = canvas.height;
	    context.clearRect(0,0,width, height);
	    canvas.width = canvas.width;

	    context.fillStyle = 'white';
	    //fillRect(x,y,width,height)
	    context.fillRect(0, 0, width, height);
	    context.strokeRect(0,0,width,height);

	    //Making the vertical grid Lines
	    for(var x = 1.5; x<width; x+=((width)/7)){
	        context.moveTo(x,0);
	        context.lineTo(x, height);
	    }
	    //Making the Horizontal Lines
	    for(var y = 1.5; y<height; y+=((height)/7)){
	        context.moveTo(0,y);
	        context.lineTo(width, y);
	    }

	    context.strokeStyle = 'grey';
	    //context.moveTo(0, 0);
	    context.stroke();

	    //Make x and y axis
	    context.beginPath();
	    var startX = (1.5 + (width/7));
	    var startY = (height-((height/7)));
	    context.moveTo(startX,0);
	    context.lineTo(startX,height);
	    context.moveTo(0, startY);
	    context.lineTo(width, startY);

	    context.strokeStyle = "black";
	    context.stroke();
	    context.closePath();
	    
	    //lengend for legend
	    context.font = '20pt Comic Sans MS';
        context.fillStyle = 'pink';
        context.fillText('Legend-:', 200, 30);

        //lengend Happiness
	    context.font = '15pt Comic Sans MS';
        context.fillStyle = 'red';
        context.fillText(':Happiness', 330, 20);
        //Happiness
        context.beginPath();
		context.strokeStyle="red";
		context.lineWidth="4";
		context.arc(320, 15, 9, 0, 2*Math.PI);
		context.stroke();
		context.closePath();

		//lengend Energy
	    context.font = '15pt Comic Sans MS';
        context.fillStyle = 'green';
        context.fillText(':Energy', 335, 45);
		//EnergyRectangle
		context.beginPath();
		context.lineWidth="4";
		context.strokeStyle="green";
		context.rect(310,30,15,15);
		context.stroke();
		context.closePath();

		//lengend for stress
	    context.font = '15pt Comic Sans MS';
        context.fillStyle = 'blue';
        context.fillText(':Stress', 335, 65);
		//StressSemiCircle
		context.beginPath();
		context.lineWidth="2";
		context.arc(320,55,9,0,Math.PI);
		
		context.strokeStyle="black";
		context.fillStyle = 'blue';
  		context.fill();
		context.stroke();
		context.closePath();

	    //Label Axis Y
	    var axisLabel = "Y:Rating";
	    context.font = "16px Arial";
	    context.fillStyle = "Red";
	    context.textBaseline = "top";
	    context.fillText(axisLabel, 5, 50);
	    var axisLabel = "X:Activities";
	    //Label AxisX


	    context.font = "16px Arial";
	    context.fillStyle = "Red";
	    context.textBaseline = "top";
	    context.fillText(axisLabel, 3, height-50);

	    var activityList = ["Coding","Dinner","Sports",
	                        "Studying", "Lectures", 
	                        "WatchingTV"];                 

	     //Text Properties for axis labeling                   
	    context.font = "15px Arial";
	    context.fillStyle = "Black";
	    context.textBaseline = "top";

	    //Loop to Write Activities Name on the X Axis
	    var x = 0;
	    for(var i = 0; i<activityList.length; i+=1){
	        
	        x = x+(width)/7;
	        context.fillText(activityList[i],3+x,height-70);
	    } 
	    //Loop to Write Numbers on the Y Axis
	    var y = 0;
	    for(var i = 5; i>0; i-=1){ 
	        //y = y+(height)/6;
	        y = y+(height)/7;
	        context.fillText(i,70, 12+y);   
	    } 

	    var allDataPoints =  ActivityStoreModel.getActivityDataPoints();
	    var size = allDataPoints.length;
	    //console.log(a);

	   
	   for(var i = 0; i<size; i++){
	    	var activityDataPoint = allDataPoints[i];
	    	var activityType = activityDataPoint.activityType;
	    	var data = activityDataPoint.activityDataDict;

	    	var stressLevel = parseInt(data.stressLevel);
	    	var energyLevel = parseInt(data.energyLevel);
	    	var happinessLevel = parseInt(data.happinessLevel);
	    	var ActivityNumber = 1;


	    	if(activityType == 'writing code'){
	    		ActivityNumber = 1;
	    	}	
	    	else if(activityType == 'eating dinner'){
	    		ActivityNumber = 2;
	    	}
	    	else if(activityType == 'playing sports'){
	    		ActivityNumber = 3;
	    	}
	    	else if(activityType == 'studying for exams'){
	    		ActivityNumber = 4;
	    	}
	    	else if(activityType == 'attending lectures'){
	    		ActivityNumber = 5;
	    	}
	    	else if(activityType == 'watching TV'){
	    		ActivityNumber = 6;
	    	}

	    	var StartingPointXAxis = 40 + ActivityNumber*((width)/7);
	    	var StartingPointYAxisStress = height-((stressLevel+1)*height-140)/7;
	    	var StartingPointYAxisEnergy = height-((energyLevel+1)*height-140)/7;
	    	var StartingPointYAxisHappiness = height-((happinessLevel+1)*height-140)/7;

	    	//Getting the canvas
			var canvas = document.getElementById("canvas_demo");
			var context = canvas.getContext("2d");

			if(HappinessLevelG>0){
				//HappinessCircle
				context.beginPath();
				context.strokeStyle="red";
				context.lineWidth="4";
				context.arc(StartingPointXAxis, StartingPointYAxisHappiness, 9, 0, 2*Math.PI);
				context.stroke();
				context.closePath();
			}
			if(EnergyLevelG>0){	
				//EnergyRectangle
				context.beginPath();
				context.lineWidth="4";
				context.strokeStyle="green";
				context.rect(StartingPointXAxis-8,StartingPointYAxisEnergy,15,15);
				context.stroke();
				context.closePath();
			}	

			if(StressLevelG>0){
				//StressSemiCircle
				context.beginPath();
				context.lineWidth="2";
				context.arc(StartingPointXAxis,StartingPointYAxisStress,9,0,Math.PI);
				context.closePath();
				context.strokeStyle="black";
				context.fillStyle = 'blue';
	      		context.fill();
				context.stroke();
			}	
		}
	
	}	
	_.extend(CustomizeGraphView.prototype, AbstractView.prototype);
	
	//for setting up the view
	return{
		LastSubmitTimeTextView : LastSubmitTimeTextView,
		TableSummaryView : TableSummaryView,
		GraphView: GraphView,
		CustomizeGraphView: CustomizeGraphView

	};

}