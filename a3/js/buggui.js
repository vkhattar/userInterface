'use strict';
//	context.fillStyle = "green";
//	context.fillRect(0,0,6,40)

// This should be your main point of entry for your app
function getPos(el,position) {
      if (!position) {
          position = {
              x: 0,
              y: 0
          };
      }
    
      position.x += el.offsetLeft;
      position.y += el.offsetTop;
      if (el.offsetParent) {
          return getPos(el.offsetParent, position);
      } else {
          return position;
      }
  }
  
  function getMouse(position, e){
  	var canvasx = ((e.pageX)-position.x);
  	var canvasy = ((e.pageY)-position.y);
  	
  	return{
  	
  		x:canvasx,
  		y:canvasy
  	}
  }


window.addEventListener('load', function() {
    //Global variable to determine where the user cliced
    var PartLocation;
 
    //Global Variables for canvas mouse cordinates
    var mouseUp;
    var mouseDown;
    var mouseChange;
    
    //constructing and saving references to the canvas
    //var canvasLabel = document.getElementById('canvas-label');
    var sceneGraphModule = createSceneGraphModule();
    var appContainer = document.getElementById('app-container');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    var width = canvas.width;
    var height = canvas.height;
    canvas.style.border = "1px solid black";
    
	//-------Creating the sceneGraph on the canvas
	var RootNode = new sceneGraphModule.RootNode();
	var CarNode = new sceneGraphModule.CarNode();
	var PART = new sceneGraphModule.PART();
	//BUMPERS
	var FrontBumper = new sceneGraphModule.Bumper(sceneGraphModule.FRONT_BUMPER);
	var LeftBumper = new sceneGraphModule.Bumper(sceneGraphModule.LEFT_BUMPER);
	var RightBumper = new sceneGraphModule.Bumper(sceneGraphModule.RIGHT_BUMPER);
	var BackBumper = new sceneGraphModule.Bumper(sceneGraphModule.BACK_BUMPER);
	//Axles
	var FrontRightAxle = new sceneGraphModule.AxleNode(sceneGraphModule.FRONT_RIGHT_AXLE_PART);
	var FrontLeftAxle = new sceneGraphModule.AxleNode(sceneGraphModule.FRONT_LEFT_AXLE_PART);
	var BackRightAxle = new sceneGraphModule.AxleNode(sceneGraphModule.BACK_RIGHT_AXLE_PART);
	var BackLeftAxle = new sceneGraphModule.AxleNode(sceneGraphModule.BACK_LEFT_AXLE_PART);
	//TIRES
	var FrontRightTire = new sceneGraphModule.TireNode(sceneGraphModule.FRONT_RIGHT_TIRE_PART);
	var FrontLeftTire = new sceneGraphModule.TireNode(sceneGraphModule.FRONT_LEFT_TIRE_PART);
	var BackRightTire = new sceneGraphModule.TireNode(sceneGraphModule.BACK_RIGHT_TIRE_PART);
	var BackLeftTire = new sceneGraphModule.TireNode(sceneGraphModule.BACK_LEFT_TIRE_PART);
	//Front and Back Part 
	var FrontPart = new sceneGraphModule.CarPartNode(sceneGraphModule.FRONT_PART);
	var BackPart = new sceneGraphModule.CarPartNode(sceneGraphModule.BACK_PART);
	
	//adding car to the root node
	RootNode.addChild(CarNode);
	//adding the bumpers to the car 
	CarNode.addChild(FrontBumper);
	CarNode.addChild(LeftBumper);
	CarNode.addChild(RightBumper);
	CarNode.addChild(BackBumper);
	//Adding the axles to the car
	CarNode.addChild(FrontRightAxle);
	CarNode.addChild(FrontLeftAxle);
	CarNode.addChild(BackRightAxle);
	CarNode.addChild(BackLeftAxle);
	//Adding the front and back parts to the car
	CarNode.addChild(FrontPart);
	CarNode.addChild(BackPart);
	//--adding the TIRES to the RESPECTIVE axles
	FrontRightAxle.addChild(FrontRightTire);
	FrontLeftAxle.addChild(FrontLeftTire);
	BackRightAxle.addChild(BackRightTire);
	BackLeftAxle.addChild(BackLeftTire);
		
	//---------Setting the startingPosition for the car and getting all the member variables---------------
//	var tx = new AffineTransform();
//	tx.translate(carX,carY);
//	CarNode.startPositionTransform = tx;

	var tx = new AffineTransform();
	var ty = new AffineTransform();
	ty.translate(carX,carY);
	CarNode.startPositionTransform = tx;
	CarNode.objectTransform = ty;
	
	//-----BUMPERS POSITIONING-------------
	function BumperPosition(CARWidth, CARLength){
		var t_start = new AffineTransform();
		//Setting the startingPosition for the FRONT_BUMPER and LEFT_BUMPER
		//front
		var t_front = new AffineTransform();
		t_front.translate(0,-((CARLength/2)+(BUMPER_WIDTH/2)));
		FrontBumper.startObjectTransform = t_start;
		FrontBumper.objectTransform = t_front;
		
		//left
		var t_left = new AffineTransform();
		t_left.translate(-(CARWidth/2), -(CARLength/2));
		//FrontBumper.startObjectTransform = t_start;
		LeftBumper.startObjectTransform = t_start;
		//FrontBumper.objectTransform = t_front_left;
		LeftBumper.objectTransform = t_left;	
		//Setting the startingPosition for the RIGHT_BUMPER
		var t_right = new AffineTransform();
		t_right.translate((CARWidth/2), -(CARLength/2));
		RightBumper.startPositionTransform = t_start;
		RightBumper.objectTransform = t_right;
		//Setting the startingPosition for the BACK_BUMPER
		var t_back = new AffineTransform();
		t_back.translate(-(CARWidth/2), (CARLength/2));
		BackBumper.startPositionTransform = t_start;
		BackBumper.objectTransform = t_back;
	}
	
	//----AXLES POSITIONING---------------------
	function AxlePosition(CARWidth, CARLength){	
		var t_start = new AffineTransform();
		//FRONT_RIGHT - position
		var axle_front_right = new AffineTransform();
		axle_front_right.translate((CARWidth/2),(-(CARLength/2)+AXLE_TOP_OFFSET));
		FrontRightAxle.startPositionTransform = t_start;
		FrontRightAxle.objectTransform = axle_front_right;
		//FRONT_LEFT - position
		var axle_front_left = new AffineTransform();
		axle_front_left.translate(-((CARWidth/2)),(-(CARLength/2)+AXLE_TOP_OFFSET));
		FrontLeftAxle.startPositionTransform = t_start;
		FrontLeftAxle.objectTransform = axle_front_left;
		//BACK_RIGHT - position
		var axle_back_right = new AffineTransform();
		axle_back_right.translate((CARWidth/2),(CARLength/2-AXLE_TOP_OFFSET));
		BackRightAxle.startPositionTransform = t_start;
		BackRightAxle.objectTransform = axle_back_right;
		//BACK_LEFT - position
		var axle_back_left = new AffineTransform();
		axle_back_left.translate(-((CARWidth/2)),(CARLength/2-AXLE_TOP_OFFSET));
		BackLeftAxle.startPositionTransform = t_start;
		BackLeftAxle.objectTransform = axle_back_left;
	}
	
	//-----BUMPERS POSITIONING-------------
	function CarPartPosition(CARWidth, CARLength){
		var t_start = new AffineTransform();
		//Setting the startingPosition for the RIGHT_BUMPER
		var t_front = new AffineTransform();
		t_front.translate(0, -(CARLength/4));
		FrontPart.startPositionTransform = t_start;
		FrontPart.objectTransform = t_front;
		//Setting the startingPosition for the BACK_BUMPER
		var t_back = new AffineTransform();
		t_back.translate(0, (CARLength/4));
		BackPart.startPositionTransform = t_start;
		BackPart.objectTransform = t_back;
	}
	
	
	//----TIRES POSITIONING---------------------
	function TirePosition(AXLE_WIDTH){
		var t_start = new AffineTransform();
		//FRONT_RIGHT - position
		
		var tire_front_right = new AffineTransform();
		tire_front_right.translate(AXLE_WIDTH,AXLE_LENGTH/2);
		FrontRightTire.startPositionTransform = t_start;
		FrontRightTire.objectTransform = tire_front_right;

//		var tz = FrontRightTire.objectTransform;
//		var MOVE = new AffineTransform();
//		MOVE.translate(AXLE_WIDTH,AXLE_LENGTH/2);
//		tz.preConcatenate(MOVE);
//		
//		FrontRightTire.startPositionTransform = t_start;
		
		
		//FRONT_LEFT - position
		var tire_front_left = new AffineTransform();
		tire_front_left.translate(-AXLE_WIDTH,AXLE_LENGTH/2);
		FrontLeftTire.startPositionTransform = t_start;
		FrontLeftTire.objectTransform = tire_front_left;
		//BACK_RIGHT - position
		var tire_back_right = new AffineTransform();
		tire_back_right.translate(AXLE_WIDTH,AXLE_LENGTH/2);
		BackRightTire.startPositionTransform = t_start;
		BackRightTire.objectTransform = tire_back_right;
		//BACK_LEFT - position
		var tire_back_left = new AffineTransform();
		tire_back_left.translate(-AXLE_WIDTH,AXLE_LENGTH/2);
		BackLeftTire.startPositionTransform = t_start;
		BackLeftTire.objectTransform = tire_back_left;
	}	
	
	//setting the bumber
	BumperPosition(CARWidth,CARLength);	
	//setting the axles
	AxlePosition(CARWidth,CARLength);
	//setting the part
	CarPartPosition(CARWidth,CARLength);
	//setting the tires
	TirePosition(AXLE_WIDTH);
	
	//------------------------------------------END OF POSITIONING---------------------------------------------

	//Global Variables required for scaling
	var scaledLength = CarNode.carLength;
	var scalingFactorY;
	var scaleY;
	var angle = 0;
	//var sangle =0;
	
	//saving the context before sending to the root and now drawing all the scenegraph
	context.save();
	RootNode.render(context);
	context.restore();

	var vedant = document.getElementById('vedant');
	vedant.addEventListener('click', function() {
		
		var tx = CarNode.objectTransform;
		tx.rotate(0.7853981634,0,0);
		angle = 0.7853981634;
		//sangle = 0.7853981634;
		//console.log(Math.cos(0.7853981634));
		CarNode.objectTransform = tx; 
		
		context.save();
		context.clearRect(0,0,width,height);
		
		RootNode.render(context);
		context.restore(); 
		
	});
	canvas.addEventListener('mousedown', function(e) {

		var mouse = getPos(canvas);
		var canvasPos = getPos(canvas);
		mouseDown = getMouse(canvasPos, e);
		//getting the location of the car part 
		PartLocation = RootNode.pointInObject(mouseDown);
		console.log("PART IS" + PartLocation);
		
	});
	
	
			
	canvas.addEventListener('mousemove', function(e) {
		console.log("MOUSEMOVE");
		var mouse = getPos(canvas);
		var mx = mouse.x;
		var my = mouse.y;
		var canvasPos = getPos(canvas);
		var mouseP = getMouse(canvasPos, e);	
		//canvasLabel.innerText = "canvas left/top: " + canvasPos.x + '/' + canvasPos.y + ' x/y: ' + mouseP.x + '/' + mouseP.y;
		
		var location = RootNode.pointInObject(mouseP);
		switch(location){
			case "CAR_PART": 
				canvas.style.cursor="move";
				break;
			case "FRONT_BUMPER":
				canvas.style.cursor="n-resize";
				break;	
			case "BACK_BUMPER":
				canvas.style.cursor="s-resize";
				break;
			case "RIGHT_BUMPER":
				canvas.style.cursor="e-resize";
				break;
			case "LEFT_BUMPER":
				canvas.style.cursor="w-resize";	
				break;	
			case "FRONT_RIGHT_TIRE_PART":
				canvas.style.cursor="e-resize";	
				break;	
			case "FRONT_LEFT_TIRE_PART":
				canvas.style.cursor="w-resize";	
				break;	
			case "BACK_RIGHT_TIRE_PART":
				canvas.style.cursor="e-resize";	
				break;	
			case "BACK_LEFT_TIRE_PART":
				canvas.style.cursor="w-resize";	
				break;
			case "FRONT_PART":
				canvas.style.cursor="crosshair";
				break;
			case "BACK_PART":
				canvas.style.cursor="crosshair";
				break;
			case "FRONT_RIGHT_TIRE_PART_ROTATION":
				canvas.style.cursor="crosshair";
				break;
			case "FRONT_LEFT_TIRE_PART_ROTATION":
				canvas.style.cursor="crosshair";
				break;		
									
				
			default:
				canvas.style.cursor = "default";
		}
		
		});
	
	canvas.addEventListener('mouseup', function(e) {

			var mouse = getPos(canvas);
			var canvasPos = getPos(canvas);
			mouseUp = getMouse(canvasPos, e);
			mouseChange = {x:mouseUp.x-mouseDown.x, y:mouseUp.y-mouseDown.y};
			//------------------------------------------------------------CAR PART DETECTION---------------------------------------------------------------			
			if(PartLocation == 'CAR_PART'){
				console.log("Inside the CAR_PART TO TRANSLATE");
				//translating the coordinates
				var tz = CarNode.objectTransform;
				var MOVE = new AffineTransform();
				//in order for rotation to work order is : TRANSLATION MATRIX * ROTATION MATRIX
				MOVE.translate(mouseChange.x,mouseChange.y);
				tz.preConcatenate(MOVE);
				
				context.save();
				context.clearRect(0,0,width,height);
				RootNode.render(context);
				context.restore();
			}	
			//----------------------------------------------------------CAR PART ROTATION DETECTION-------------------------------------------------------
			
			if(PartLocation == 'FRONT_PART'){
				console.log("INSIDE THE FRONT PART TO ROTATE");
				var angleRotate = Math.atan2(mouseDown.y, mouseDown.x)-Math.atan2(mouseUp.y, mouseUp.x) ;
				//if (angleRotate < 0) angleRotate += 2 * Math.PI;
				console.log("ANGLE ROTATE: "+angleRotate);
				
				var tx = CarNode.objectTransform;
				tx.rotate(angleRotate,0,0);
			
				CarNode.objectTransform = tx; 
				
				context.save();
				context.clearRect(0,0,width,height);
				
				RootNode.render(context);
				context.restore(); 	
			}
			
			if(PartLocation == 'BACK_PART'){
				console.log("INSIDE THE BACK PART TO ROTATE");
				var angleRotate = Math.atan2(mouseDown.y, mouseDown.x)-Math.atan2(mouseUp.y, mouseUp.x) ;
				//if (angleRotate < 0) angleRotate += 2 * Math.PI;
				console.log("ANGLE ROTATE: "+angleRotate);
				
				var tx = CarNode.objectTransform;
				tx.rotate(angleRotate,0,0);
			
				CarNode.objectTransform = tx; 
				
				context.save();
				context.clearRect(0,0,width,height);
				
				RootNode.render(context);
				context.restore(); 
				
			}
			
			//------------------------------------------------------------BUMPER DETECTION---------------------------------------------------------------

			if(PartLocation == 'FRONT_BUMPER'){
				console.log("Inside the FRONT_BUMPER TO SCALE");

				var scaleY = mouseChange.y;
				var scaledCarLength;
				//increase in the length of the car
				if(scaleY<0){
					scaledCarLength = CARLength+(-2*scaleY);
				}
				//decreasing the length of the car	
				else{
					scaledCarLength = CARLength-(2*scaleY);
				}
				//checking the limits of the max and min car length 
				if(scaledCarLength > 200){
					scaledCarLength = 200;
				}
				if(scaledCarLength <50){
					scaledCarLength = 50;
				}
				//updating CARLength
				CARLength = scaledCarLength;
				//updating bumpers and axles
				BumperPosition(CARWidth,CARLength);	
				AxlePosition(CARWidth,CARLength);
				//scaling carPART
				CarPartPosition(CARWidth, CARLength);
				CAR_PART_WIDTH = CARWidth - 20;
				CAR_PART_LENGTH = CARLength/6;
				
				context.save();
				context.clearRect(0,0,800,600);
				
				RootNode.render(context);
				context.restore();
			}
			
			if(PartLocation == 'BACK_BUMPER'){
				console.log("Inside the BACK_BUMPER TO SCALE");
				
				var scaleY = mouseChange.y;
				console.log("BACK BUMPER cordinates scaleY: "+ scaleY);
				var scaledCarLength;
				//increase in the length of the car
				if(scaleY>0){
					scaledCarLength = CARLength+(2*scaleY);
				}
				//decreasing the length of the car	
				else{
					scaledCarLength = CARLength+(2*scaleY);
				}
				//checking the limits of the max and min car length 
				if(scaledCarLength > 200){
					scaledCarLength = 200;
				}
				if(scaledCarLength <50){
					scaledCarLength = 50;
				}
				CARLength = scaledCarLength;
				CAR_PART_WIDTH = CARWidth - 20;
				CAR_PART_LENGTH = CARLength/6;
				//updating bumpers and axles
				BumperPosition(CARWidth,CARLength);	
				AxlePosition(CARWidth,CARLength);
				//scaling carPART
				CarPartPosition(CARWidth, CARLength);
				context.save();
				context.clearRect(0,0,800,600);	
				RootNode.render(context);
				context.restore();
			}
						
			if(PartLocation == 'LEFT_BUMPER'){
				console.log("Inside the LEFT_BUMPER TO SCALE");

				var scaleX = mouseChange.x;
				console.log("BACK BUMPER cordinates scaleX: "+ scaleX);
				var scaledCarWidth;
				//increasing the width of the car
				if(scaleX<0){
					scaledCarWidth = CARWidth+(-2*scaleX);
				}
				//decreasing the width of the car	
				else{
					scaledCarWidth = CARWidth-(2*scaleX);
				}
				//checking the limits of the max and min car width
				if(scaledCarWidth > 150){
					scaledCarWidth = 150;
				}
				if(scaledCarWidth <25){
					scaledCarWidth = 25;
				}
				CARWidth = scaledCarWidth;
				CAR_PART_WIDTH = CARWidth - 20;
				CAR_PART_LENGTH = CARLength/6;
				//updating bumpers and axles
				BumperPosition(CARWidth,CARLength);	
				AxlePosition(CARWidth,CARLength);
				//scaling carPART
				CarPartPosition(CARWidth, CARLength);
			
				context.save();
				context.clearRect(0,0,800,600);	
				RootNode.render(context);
				context.restore();
			}
			
			if(PartLocation == 'RIGHT_BUMPER'){
				console.log("Inside the RIGHT_BUMPER TO SCALE");
			
				var scaleX = mouseChange.x;
				console.log("BACK BUMPER cordinates scaleX: "+ scaleX);
				var scaledCarWidth;
				//increase in the length of the car
				if(scaleX>0){
					scaledCarWidth = CARWidth+(2*scaleX);
				}
				//decreasing the length of the car	
				else{
					scaledCarWidth = CARWidth+(2*scaleX);
				}
				//checking the limits of the max and min car width
				if(scaledCarWidth > 150){
					scaledCarWidth = 150;
				}
				if(scaledCarWidth <25){
					scaledCarWidth = 25;
				}
				CARWidth = scaledCarWidth;
				CAR_PART_WIDTH = CARWidth - 20;
				CAR_PART_LENGTH = CARLength/6;
				//updating bumpers and axles 
				BumperPosition(CARWidth,CARLength);	
				AxlePosition(CARWidth,CARLength);
				//scaling carPART
				CarPartPosition(CARWidth, CARLength);
			
				context.save();
				context.clearRect(0,0,800,600);	
				RootNode.render(context);
				context.restore();
			}
			
			//---------------------------------------------------TIRE DETECTION--------------------------------------------------
			if(PartLocation == 'FRONT_RIGHT_TIRE_PART'){
				console.log("Inside the front right tire part");
				var scaleX = mouseChange.x;
				var scaledAxleWidth;
				//increasing or decreasing the length
				scaledAxleWidth = AXLE_WIDTH+scaleX;
				
				//checking the limits 
				if(scaledAxleWidth>75){
					scaledAxleWidth = 75;
				}
				//20-tireWidth/2
				if(scaledAxleWidth < 14){
					scaledAxleWidth = 14;
				}
				AXLE_WIDTH = scaledAxleWidth;
				TirePosition(AXLE_WIDTH);
				
				context.save();
				context.clearRect(0,0,800,600);
				RootNode.render(context);
				context.restore();
			}
			
			if(PartLocation == 'FRONT_LEFT_TIRE_PART'){
				console.log("Inside the front left tire part");
				var scaleX = mouseChange.x;
				var scaledAxleWidth;
				//increasing or decreasing the length
				scaledAxleWidth = AXLE_WIDTH-scaleX;
				
				//checking the limits 
				if(scaledAxleWidth>75){
					scaledAxleWidth = 75;
				}
				//20-tireWidth/2
				if(scaledAxleWidth < 14){
					scaledAxleWidth = 14;
				}
				AXLE_WIDTH = scaledAxleWidth;
				TirePosition(AXLE_WIDTH);
				
				context.save();
				context.clearRect(0,0,800,600);
				RootNode.render(context);
				context.restore();
			}
			
			if(PartLocation == 'BACK_RIGHT_TIRE_PART'){
				console.log("Inside the back right tire part");
				var scaleX = mouseChange.x;
				var scaledAxleWidth;
				//increasing or decreasing the length
				scaledAxleWidth = AXLE_WIDTH+scaleX;
				
				//checking the limits 
				if(scaledAxleWidth>75){
					scaledAxleWidth = 75;
				}
				//20-tireWidth/2
				if(scaledAxleWidth < 14){
					scaledAxleWidth = 14;
				}
				AXLE_WIDTH = scaledAxleWidth;
				TirePosition(AXLE_WIDTH);
				
				context.save();
				context.clearRect(0,0,800,600);
				RootNode.render(context);
				context.restore();
			}
			
			if(PartLocation == 'BACK_LEFT_TIRE_PART'){
				console.log("Inside the back left tire part");
				var scaleX = mouseChange.x;
				var scaledAxleWidth;
				//increasing or decreasing the length
				scaledAxleWidth = AXLE_WIDTH-scaleX;
				
				//checking the limits 
				if(scaledAxleWidth>75){
					scaledAxleWidth = 75;
				}
				//20-tireWidth/2
				if(scaledAxleWidth < 14){
					scaledAxleWidth = 14;
				}
				AXLE_WIDTH = scaledAxleWidth;
				TirePosition(AXLE_WIDTH);
				
				context.save();
				context.clearRect(0,0,800,600);
				RootNode.render(context);
				context.restore();
			}
			//---------------------------------------------------TIRE DETECTION ANGLESSSS--------------------------------------------------//
				
			if(PartLocation == 'FRONT_RIGHT_TIRE_PART_ROTATION'){	
				console.log("INSIDE THE FRONT PART TO ROTATE");
				var angleRotate = Math.atan2(mouseDown.y, mouseDown.x)-Math.atan2(mouseUp.y, mouseUp.x) ;
				//if (angleRotate < 0) angleRotate += 2 * Math.PI;
				console.log("ANGLE ROTATE: "+angleRotate);
				
				//rotating front right tire
				var tR = FrontRightTire.objectTransform;
				tR.rotate(angleRotate,0,0);
				FrontRightTire.objectTransform = tR; 
				
				//rotating front left tire 
				var tL = FrontLeftTire.objectTransform;
				tL.rotate(angleRotate,0,0);
				FrontLeftTire.objectTransform = tL; 
				
				context.save();
				context.clearRect(0,0,width,height);
				
				RootNode.render(context);
				context.restore(); 
			}		
			
			if(PartLocation == 'FRONT_LEFT_TIRE_PART_ROTATION'){	
				console.log("INSIDE THE FRONT PART TO ROTATE");
				var angleRotate = Math.atan2(mouseDown.y, mouseDown.x)-Math.atan2(mouseUp.y, mouseUp.x) ;
				//if (angleRotate < 0) angleRotate += 2 * Math.PI;
				console.log("ANGLE ROTATE: "+angleRotate);
				
				//rotating the left tire 
				var tL = FrontLeftTire.objectTransform;
				tL.rotate(angleRotate,0,0);
				FrontLeftTire.objectTransform = tL; 
				
				//rotating front right tire
				var tR = FrontRightTire.objectTransform;
				tR.rotate(angleRotate,0,0);
				FrontRightTire.objectTransform = tR; 
				
				context.save();
				context.clearRect(0,0,width,height);
				
				RootNode.render(context);
				context.restore(); 
			}		
			
			
		});
	
});
