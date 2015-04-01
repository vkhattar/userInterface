'use strict';

/**
 * A function that creates and returns the scene graph classes and constants.
 */
 //global car variables
 var CARLength = 100;
 var CARWidth = 50;
 var carY = 300;
 var carX = 100;
 
 var AXLE_WIDTH = 20;
 var AXLE_LENGTH = 9;
 var AXLE_TOP_OFFSET = 15;
 var AXLE_BOTTOM_OFFSET = 15;
 
 var TIRE_WIDTH = 12;
 var TIRE_LENGTH = 25;
 
 var CAR_PART_WIDTH = CARWidth - 20;
 var CAR_PART_LENGTH = CARLength/6;
 
 var BUMPER_WIDTH = 6;
 
 
 
 
function createSceneGraphModule() {

    // Part names. Use these to name your different nodes
    var ROOT = 'ROOT';
    var CAR_PART = 'CAR_PART';
    //axles
    var FRONT_RIGHT_AXLE_PART = 'FRONT_RIGHT_AXLE_PART';
    var FRONT_LEFT_AXLE_PART  = 'FRONT_LEFT_AXLE_PART';
    var BACK_RIGHT_AXLE_PART  = 'BACK_RIGHT_AXLE_PART';
    var BACK_LEFT_AXLE_PART   = 'BACK_LEFT_AXLE_PART';
    //tires
    var FRONT_LEFT_TIRE_PART = 'FRONT_LEFT_TIRE_PART';
    var FRONT_RIGHT_TIRE_PART = 'FRONT_RIGHT_TIRE_PART';
    var BACK_LEFT_TIRE_PART = 'BACK_LEFT_TIRE_PART';
    var BACK_RIGHT_TIRE_PART = 'BACK_RIGHT_TIRE_PART';
    //tires rotation
    var FRONT_LEFT_TIRE_PART_ROTATION = 'FRONT_LEFT_TIRE_PART_ROTATION';
    var FRONT_RIGHT_TIRE_PART_ROTATION = 'FRONT_RIGHT_TIRE_PART_ROTATION';
    //testing part
    var PART = 'PART';
    //bumpers
    var FRONT_BUMPER = 'FRONT_BUMPER';
    var BACK_BUMPER = 'BACK_BUMPER';
    var LEFT_BUMPER = 'LEFT_BUMPER';
    var RIGHT_BUMPER = 'RIGHT_BUMPER';
    //FRONT and BACK WHITE BOX
    var FRONT_PART = 'FRONT_PART';
    var BACK_PART = 'BACK_PART';

    var GraphNode = function() {
    };

    _.extend(GraphNode.prototype, {

        /**
         * Subclasses should call this function to initialize the object.
         *
         * @param startPositionTransform The transform that should be applied prior
         * to performing any rendering, so that the component can render in its own,
         * local, object-centric coordinate system.
         * @param nodeName The name of the node. Useful for debugging, but also used to uniquely identify each node
         */
        initGraphNode: function(startPositionTransform, nodeName) {

            this.nodeName = nodeName;

            // The transform that will position this object, relative
            // to its parent
            this.startPositionTransform = startPositionTransform;

            // Any additional transforms of this object after the previous transform
            // has been applied
            this.objectTransform = new AffineTransform();

            // Any child nodes of this node
            this.children = {};

            // Add any other properties you need, here
        },

        addChild: function(graphNode) {
            this.children[graphNode.nodeName] = graphNode;
        },

        /**
         * Swaps a graph node with a new graph node.
         * @param nodeName The name of the graph node
         * @param newNode The new graph node
         */
        replaceGraphNode: function(nodeName, newNode) {
            if (nodeName in this.children) {
                this.children[nodeName] = newNode;
            } else {
                _.each(
                    _.values(this.children),
                    function(child) {
                        child.replaceGraphNode(nodeName, newNode);
                    }
                );
            }
        },

        /**
         * Render this node using the graphics context provided.
         * Prior to doing any painting, the start_position_transform must be
         * applied, so the component can render itself in its local, object-centric
         * coordinate system. See the assignment specs for more details.
         *
         * This method should also call each child's render method.
         * @param context
         */
        render: function(context) {
            // TODO: Should be overridden by subclass
           // _.each(this.children, render(context));
         
        },

        /**
         * Determines whether a point lies within this object. Be sure the point is
         * transformed correctly prior to performing the hit test.
         */
        pointInObject: function(point) {
            // TODO: There are ways to handle this query here, but you may find it easier to handle in subclasses
        }

    });
    
    var RootNode = function() {
        this.initGraphNode(new AffineTransform(), ROOT)
    };

    _.extend(RootNode.prototype, GraphNode.prototype, {
        // Overrides parent method
        render: function(context) {
            // TODO
            //call render method children of the root nodes 
            _.each(
                _.values(this.children),
                function(child) {
                    child.render(context);
                }
            );
        },

        // Overrides parent method
        pointInObject: function(point) {
            // TODO
            var x ;
           _.each(
           	
               _.values(this.children),
               function(child) {
                   	var pointArray = [point.x, point.y];
                   	var destPointArray = [];
                   
                   	var t1 = child.objectTransform;
                   	var i1 = t1.createInverse();
                   	console.log("INVERSE TRANSFORM:"+ i1); 
                   	i1.transform(pointArray, 0, destPointArray, 0, 1);
                    var mousep = {x:destPointArray[0], y:destPointArray[1]};
                    x =  child.pointInObject(mousep);
                    //return x;
               }
           );
           
           return x;             
        }
    });

    var CarNode = function() {
        this.initGraphNode(new AffineTransform(), CAR_PART)
        this.localPoint;
    };

    _.extend(CarNode.prototype, GraphNode.prototype, {
        // Overrides parent method
        render: function(context) {
            // TODO

            var tx = this.startPositionTransform;
            context.transform(tx.m00_, tx.m10_, tx.m01_, tx.m11_, tx.m02_, tx.m12_);
            
            var tz = this.objectTransform;
            context.transform(tz.m00_, tz.m10_, tz.m01_, tz.m11_, tz.m02_, tz.m12_); 
            
            context.fillStyle = "red";
	    	context.fillRect(-(CARWidth/2),-(CARLength/2),CARWidth,CARLength);
	    	
	    	//drawing the headlights
	    	//Left HEADLight
	    	context.fillStyle = "black";
	    	var HEADLIGHT_Y = CARLength/2.27;
	    	var radius = (CARLength+CARWidth)/38;
	    	context.arc(-CARWidth/4, -HEADLIGHT_Y, radius, 0, Math.PI*2, true); 
	    	context.closePath();
	    	context.fill();
	    	//Right HEADLIGHT
	    	context.fillStyle = "black";
	    	context.arc(CARWidth/4, -HEADLIGHT_Y, radius, 0, Math.PI*2, true); 
	    	context.closePath();
	    	context.fill();
	    	
	    	
			//calling the children of the carNodes
			_.each(
			    _.values(this.children),
			    function(child) {
			    	context.save();
			        child.render(context);
			        context.restore();
			    }
			);
        },

        // Overrides parent method
        pointInObject: function(point) {
            // TODO
            
            this.localPoint = point;	
            console.log("POINT CAR GETS:"+ point.x + " " + point.y);
        	var halfWidth = CARWidth/2;
        	var halfLength = CARLength/2;
        	//TRYING
//        	if(point.x>=(-halfWidth)&& point.x<halfWidth
//        		&& point.y>=(-halfLength) && point.y<halfLength){
//        		//console.log("CAR: "+ point.x+" "+ point.y); 
//        		alert("I am in the car body!");
//        			return CAR_PART;
//        	}
            var pos=0;
           _.each(
               _.values(this.children),
               function(child) {
                   	var pointArray = [point.x, point.y];
                   	var destPointArray = [];
                   
                   	var t1 = child.objectTransform;
                   	var i1 = t1.createInverse();
                   	i1.transform(pointArray, 0, destPointArray, 0, 1);
                    var mousep = {x:destPointArray[0], y:destPointArray[1]};
                    var x = child.pointInObject(mousep);
                    if (typeof x != 'undefined' && x!=false){
                    	pos = x;
                    }
                    
               }
           );
            if(pos!=0){
           
        		return pos; 
        	}
        	
        	if(point.x>=(-halfWidth)&& point.x<halfWidth
        			&& point.y>=(-halfLength) && point.y<halfLength){
        			//console.log("CAR: "+ point.x+" "+ point.y); 
        			//alert("I am in the car body!");
        				return CAR_PART;
        		}	   	    
        }
    });
        
    var Bumper= function(BumperPartName) {
            this.initGraphNode(new AffineTransform(), BumperPartName);
            this.width = 6;
    };
    
    _.extend(Bumper.prototype, GraphNode.prototype, {
        // Overrides parent method
        render: function(context) {
            // TODO
            
            switch(this.nodeName){
            	case "FRONT_BUMPER":
		            var tx = this.startPositionTransform;
		            context.transform(tx.m00_, tx.m10_, tx.m01_, tx.m11_, tx.m02_, tx.m12_); 
		            
		            var tz = this.objectTransform;
		            context.transform(tz.m00_, tz.m10_, tz.m01_, tz.m11_, tz.m02_, tz.m12_); 
		            
		            context.fillStyle = "black";
		            context.fillRect(-(CARWidth/2),-(BUMPER_WIDTH/2),CARWidth,BUMPER_WIDTH);
		            break;
		            
		        case "BACK_BUMPER":
		            var tx = this.startPositionTransform;
		            context.transform(tx.m00_, tx.m10_, tx.m01_, tx.m11_, tx.m02_, tx.m12_); 
		            
		            var tz = this.objectTransform;
		            context.transform(tz.m00_, tz.m10_, tz.m01_, tz.m11_, tz.m02_, tz.m12_); 
		            
		            context.fillStyle = "black";
		            context.fillRect(0,0,CARWidth,this.width);
		            break;
		        
		        case "LEFT_BUMPER":
		        	var tx = this.startPositionTransform;
		        	context.transform(tx.m00_, tx.m10_, tx.m01_, tx.m11_, tx.m02_, tx.m12_); 
		        	
		        	var tz = this.objectTransform;
		        	context.transform(tz.m00_, tz.m10_, tz.m01_, tz.m11_, tz.m02_, tz.m12_); 
		        	
		        	context.fillStyle = "black";
		        	context.fillRect(-this.width,0,this.width,CARLength);
		        	break;
		        	
		       case "RIGHT_BUMPER":
		       		var tx = this.startPositionTransform;
		       		context.transform(tx.m00_, tx.m10_, tx.m01_, tx.m11_, tx.m02_, tx.m12_); 
		       		
		       		var tz = this.objectTransform;
		       		context.transform(tz.m00_, tz.m10_, tz.m01_, tz.m11_, tz.m02_, tz.m12_); 
		       		
		       		context.fillStyle = "black";
		       		context.fillRect(0,0,this.width,CARLength);
		       		break;
		   }    		

        },

        // Overrides parent method
        pointInObject: function(point) {
        	console.log("POINT BUMPER IS GETTING: " + point.x+" " + point.y);
            switch(this.nodeName){
            	case "FRONT_BUMPER":
	            		if(point.x>=(-(CARWidth/2)) && point.x<((CARWidth/2)) && 
	            		point.y >=(-(BUMPER_WIDTH/2)) && point.y <((BUMPER_WIDTH/2)) ){
	            			//alert("I am in the FRONT_BUMPER!");
	            			return FRONT_BUMPER;
	            		}
	            		break;
            	case "BACK_BUMPER":
	            		if(point.x>=0 && point.x<(CARWidth) && 
	            		point.y >=0 && point.y <BUMPER_WIDTH){
	            			//alert("I am in the BACK_BUMPER!");
	            			return BACK_BUMPER;
	            		}
	            		break;	
            	case "LEFT_BUMPER":
            			if(point.x>=-(BUMPER_WIDTH) && point.x<0 && 
            			point.y >=0 && point.y <CARLength ){
            				//alert("I am in the LEFT_BUMPER!");
            				return LEFT_BUMPER;
            			}
            			break;	
            	case "RIGHT_BUMPER":
	            		if(point.x>=0 && point.x<BUMPER_WIDTH && 
	            		point.y >=0 && point.y < CARLength){
	            			//alert("I am in the RIGHT_BUMPER!");
	            			return RIGHT_BUMPER;
	            		}
	            		break;				
           } 
            
        }
    });
      
    var CarPartNode = function(CarPartName) {
            this.initGraphNode(new AffineTransform(), CarPartName);
         
        };
    
        _.extend(CarPartNode.prototype, GraphNode.prototype, {
            // Overrides parent method
            render: function(context) {
                // TODO            
                switch(this.nodeName){
                
                	case "FRONT_PART":
		                var tx = this.startPositionTransform;
		                context.transform(tx.m00_, tx.m10_, tx.m01_, tx.m11_, tx.m02_, tx.m12_); 
		                
		                var tz = this.objectTransform;
		                context.transform(tz.m00_, tz.m10_, tz.m01_, tz.m11_, tz.m02_, tz.m12_); 
		                
		                context.fillStyle = "white";
		                context.beginPath();
		                context.lineWidth = 7;
		                context.strokeRect(-(CAR_PART_WIDTH/2),-(CAR_PART_LENGTH/2),CAR_PART_WIDTH,CAR_PART_LENGTH);
		                context.fillRect(-(CAR_PART_WIDTH/2),-(CAR_PART_LENGTH/2),CAR_PART_WIDTH,CAR_PART_LENGTH);
		                break;
		                
		            case "BACK_PART":
		            	var tx = this.startPositionTransform;
		            	context.transform(tx.m00_, tx.m10_, tx.m01_, tx.m11_, tx.m02_, tx.m12_); 
		            	
		            	var tz = this.objectTransform;
		            	context.transform(tz.m00_, tz.m10_, tz.m01_, tz.m11_, tz.m02_, tz.m12_); 
		            	
						context.fillStyle = "white";
						context.beginPath();
						context.lineWidth = 4;
						context.strokeRect(-(CAR_PART_WIDTH/2),-(CAR_PART_LENGTH/2),CAR_PART_WIDTH,CAR_PART_LENGTH);
						context.fillRect(-(CAR_PART_WIDTH/2),-(CAR_PART_LENGTH/2),CAR_PART_WIDTH,CAR_PART_LENGTH);
						break;
					}
		                     
            },
    
            // Overrides parent method
            pointInObject: function(point) {
                switch(this.nodeName){
                 	case "FRONT_PART":
                     		if(point.x>=-(CAR_PART_WIDTH/2) && point.x< (CAR_PART_WIDTH/2) && 
                     		point.y >=-(CAR_PART_LENGTH/2) && point.y <(CAR_PART_LENGTH/2)){
                     			//alert("I am in the FRONT_PART!");
                     			return FRONT_PART;
                     		}
                     		break;
                 	case "BACK_PART":
                     		if(point.x>=-(CAR_PART_WIDTH/2) && point.x< (CAR_PART_WIDTH/2) && 
                     			point.y >=-(CAR_PART_LENGTH/2) && point.y <(CAR_PART_LENGTH/2)){
                     				//alert("I am in the BACK_PART!");
                     				return BACK_PART;
                     		}
                     		break;				
                }                 
            }
        });

    /**
     * @param axlePartName Which axle this node represents
     * @constructor
     */
    var AxleNode = function(axlePartName) {
        this.initGraphNode(new AffineTransform(), axlePartName);
        
        // TODO
    };

    _.extend(AxleNode.prototype, GraphNode.prototype, {
        // Overrides parent method
        render: function(context) {
            // TODO
            
            switch(this.nodeName){
             	case "FRONT_RIGHT_AXLE_PART":
                     var tx = this.startPositionTransform;
                     context.transform(tx.m00_, tx.m10_, tx.m01_, tx.m11_, tx.m02_, tx.m12_); 
                     
                     var tz = this.objectTransform;
                     context.transform(tz.m00_, tz.m10_, tz.m01_, tz.m11_, tz.m02_, tz.m12_); 
                     
                     context.fillStyle = "black";
                     context.fillRect(0,0,AXLE_WIDTH,AXLE_LENGTH);
                     break;
                     
                     
                 case "FRONT_LEFT_AXLE_PART":
                     var tx = this.startPositionTransform;
                     context.transform(tx.m00_, tx.m10_, tx.m01_, tx.m11_, tx.m02_, tx.m12_); 
                     
                     var tz = this.objectTransform;
                     context.transform(tz.m00_, tz.m10_, tz.m01_, tz.m11_, tz.m02_, tz.m12_); 
                     
                     context.fillStyle = "black";
                     context.fillRect(-AXLE_WIDTH,0,AXLE_WIDTH,AXLE_LENGTH);
                     break;
                 
                 case "BACK_RIGHT_AXLE_PART":
                 	var tx = this.startPositionTransform;
                 	context.transform(tx.m00_, tx.m10_, tx.m01_, tx.m11_, tx.m02_, tx.m12_); 
                 	
                 	var tz = this.objectTransform;
                 	context.transform(tz.m00_, tz.m10_, tz.m01_, tz.m11_, tz.m02_, tz.m12_); 
                 	
                 	context.fillStyle = "black";
                 	context.fillRect(0,0,AXLE_WIDTH,AXLE_LENGTH);
                 	break;
                 	
                case "BACK_LEFT_AXLE_PART":
            		var tx = this.startPositionTransform;
            		context.transform(tx.m00_, tx.m10_, tx.m01_, tx.m11_, tx.m02_, tx.m12_); 
            		
            		var tz = this.objectTransform;
            		context.transform(tz.m00_, tz.m10_, tz.m01_, tz.m11_, tz.m02_, tz.m12_); 
            		
            		context.fillStyle = "black";
            		context.fillRect(-AXLE_WIDTH,0,AXLE_WIDTH,AXLE_LENGTH);
            		break;
            } 
            
            //calling the children of the axleNodes
            _.each(
                _.values(this.children),
                function(child) {
                	context.save();
                    child.render(context);
                    context.restore();
                }
            );   
        },

        // Overrides parent method
        pointInObject: function(point) {
            // User can't select axles
            var pointArray = [point.x, point.y];
	        var pos;
	          _.each(
	              _.values(this.children),
			            function(child) {
			              	var pointArray = [point.x, point.y];
			              	var destPointArray = [];
			              
			              	var t1 = child.objectTransform;
			              	var i1 = t1.createInverse();
			              	i1.transform(pointArray, 0, destPointArray, 0, 1);
			                var mousep = {x:destPointArray[0], y:destPointArray[1]};
			                var x = child.pointInObject(mousep);
			                if (typeof x != 'undefined' && x!=false){
			               		pos = x;
			                }
			          } 
	          );
	          
	        return pos;  
	        } 	
    });

    /**
     * @param tirePartName Which tire this node represents
     * @constructor
     */
    var TireNode = function(tirePartName) {
        this.initGraphNode(new AffineTransform(), tirePartName);

        // TODO
    };

    _.extend(TireNode.prototype, GraphNode.prototype, {
        // Overrides parent method
        render: function(context) {
            // TODO
            switch(this.nodeName){
             	case "FRONT_RIGHT_TIRE_PART":
                     var tx = this.startPositionTransform;
                     context.transform(tx.m00_, tx.m10_, tx.m01_, tx.m11_, tx.m02_, tx.m12_); 
                     
                     var tz = this.objectTransform;
                     context.transform(tz.m00_, tz.m10_, tz.m01_, tz.m11_, tz.m02_, tz.m12_); 
                     
                     context.fillStyle = "green";
                     context.fillRect(-(TIRE_WIDTH/2),-(TIRE_LENGTH/2),TIRE_WIDTH,TIRE_LENGTH);
                     break;
                     
                 case "FRONT_LEFT_TIRE_PART":
                     var tx = this.startPositionTransform;
                     context.transform(tx.m00_, tx.m10_, tx.m01_, tx.m11_, tx.m02_, tx.m12_); 
                     
                     var tz = this.objectTransform;
                     context.transform(tz.m00_, tz.m10_, tz.m01_, tz.m11_, tz.m02_, tz.m12_); 
                     
                     context.fillStyle = "green";
                     context.fillRect(-(TIRE_WIDTH/2),-(TIRE_LENGTH/2),TIRE_WIDTH,TIRE_LENGTH);
                     break;
                 
                 case "BACK_RIGHT_TIRE_PART":
                 	var tx = this.startPositionTransform;
                 	context.transform(tx.m00_, tx.m10_, tx.m01_, tx.m11_, tx.m02_, tx.m12_); 
                 	
                 	var tz = this.objectTransform;
                 	context.transform(tz.m00_, tz.m10_, tz.m01_, tz.m11_, tz.m02_, tz.m12_); 
                 	
                 	context.fillStyle = "green";
                 	context.fillRect(-(TIRE_WIDTH/2),-(TIRE_LENGTH/2),TIRE_WIDTH,TIRE_LENGTH);
                 	break;
                 	
                case "BACK_LEFT_TIRE_PART":
            		var tx = this.startPositionTransform;
            		context.transform(tx.m00_, tx.m10_, tx.m01_, tx.m11_, tx.m02_, tx.m12_); 
            		
            		var tz = this.objectTransform;
            		context.transform(tz.m00_, tz.m10_, tz.m01_, tz.m11_, tz.m02_, tz.m12_); 
            		
            		context.fillStyle = "green";
            		context.fillRect(-(TIRE_WIDTH/2),-(TIRE_LENGTH/2),TIRE_WIDTH,TIRE_LENGTH);
            		break;
            }  
            
        },

        // Overrides parent method
        pointInObject: function(point) {
            // TODO
            switch(this.nodeName){
            	
             	case "FRONT_RIGHT_TIRE_PART":
             		console.log("FRONT RIGHT POINT: "+ point.x + " " + point.y);
			          if(point.x>= 0 && point.x<(TIRE_WIDTH/2)&& 
			          point.y >= -(TIRE_LENGTH/2) && point.y <(TIRE_LENGTH/2)){			          	
				          	//alert("I am in the front right tire part!");
				          	return FRONT_RIGHT_TIRE_PART;
			          }
			          
			          if(point.x>=-(TIRE_WIDTH/2)&& point.x<0 && 
			          point.y >= -(TIRE_LENGTH/2) && point.y <(TIRE_LENGTH/2)){			          	
				          	//alert("I am in the front right tire part rotation!");
				          	return FRONT_RIGHT_TIRE_PART_ROTATION;
			          }
			          
			          break;
                     
                 case "FRONT_LEFT_TIRE_PART":
                 		console.log("FRONT LEFT POINT: "+ point.x + " " + point.y);
					    if(point.x>=-(TIRE_WIDTH/2)&& point.x<0 && 
					    point.y >= -(TIRE_LENGTH/2) && point.y <(TIRE_LENGTH/2)){
						   		//alert("I am in the front left tire part");
						     	return FRONT_LEFT_TIRE_PART;
					     }
					     
					     if(point.x>= 0 && point.x<(TIRE_WIDTH/2)&& 
					     point.y >= -(TIRE_LENGTH/2) && point.y <(TIRE_LENGTH/2)){
					     		//alert("I am in the front left tire part");
					      		return FRONT_LEFT_TIRE_PART_ROTATION;
					      }
					     
					     break;
				;	     
			                
                 case "BACK_RIGHT_TIRE_PART":
				     if(point.x>=0&& point.x<(TIRE_WIDTH/2)&& 
				     point.y >= -(TIRE_LENGTH/2) && point.y <(TIRE_LENGTH/2)){				      	
				     	//alert("I am in the back right tire part");
				       	return BACK_RIGHT_TIRE_PART;
				       }
				       break;                 	
                case "BACK_LEFT_TIRE_PART":
				       if(point.x>=-(TIRE_WIDTH/2)&& point.x<0&& 
				       point.y >= -(TIRE_LENGTH/2) && point.y <(TIRE_LENGTH/2)){				       		
				       		//alert("I am in the back left tire part");
				        	return BACK_LEFT_TIRE_PART;
				        }
				        break;
			}  
            
        }
    });
    
    
    var PART= function(PART) {
            this.initGraphNode(new AffineTransform(), PART);
            this.partwidth = 20;
            this.partlength = 30;
            // TODO
        };
    
        _.extend(PART.prototype, GraphNode.prototype, {
            // Overrides parent method
            render: function(context) {
                // TODO
                var tx = this.startPositionTransform;
                context.transform(tx.m00_, tx.m10_, tx.m01_, tx.m11_, tx.m02_, tx.m12_); 
                
                var tz = this.objectTransform;
                context.transform(tz.m00_, tz.m10_, tz.m01_, tz.m11_, tz.m02_, tz.m12_); 
                
                context.fillStyle = "black";
                context.fillRect(0,0,this.partwidth,this.partlength);
            },
    
            // Overrides parent method
            pointInObject: function(point) {
                // User can't select axles
                if(point.x>=(125)&& point.x<this.partwidth+125
                	&& point.y>=300 && point.y<this.partlength+300){
                	//alert("I am in the black part!");
                	return PART;
                	}
                
            }
        });

    // Return an object containing all of our classes and constants
    return {
        GraphNode: GraphNode,
        RootNode: RootNode, 
        CarNode: CarNode,
        AxleNode: AxleNode,
        TireNode: TireNode,
        CAR_PART: CAR_PART,
        Bumper:Bumper,
        CarPartNode: CarPartNode,
        PART:PART,
        
        FRONT_RIGHT_AXLE_PART : FRONT_RIGHT_AXLE_PART,
        FRONT_LEFT_AXLE_PART  : FRONT_LEFT_AXLE_PART,
        BACK_RIGHT_AXLE_PART  : BACK_RIGHT_AXLE_PART,
        BACK_LEFT_AXLE_PART   : BACK_LEFT_AXLE_PART,
        
        FRONT_LEFT_TIRE_PART:  FRONT_LEFT_TIRE_PART,
        FRONT_RIGHT_TIRE_PART: FRONT_RIGHT_TIRE_PART,
        BACK_LEFT_TIRE_PART:   BACK_LEFT_TIRE_PART,
        BACK_RIGHT_TIRE_PART:  BACK_RIGHT_TIRE_PART,
        
        FRONT_LEFT_TIRE_PART_ROTATION: FRONT_LEFT_TIRE_PART_ROTATION,
        FRONT_RIGHT_TIRE_PART_ROTATION: FRONT_RIGHT_TIRE_PART_ROTATION,
        
        FRONT_BUMPER: FRONT_BUMPER,
        BACK_BUMPER: BACK_BUMPER,
        LEFT_BUMPER: LEFT_BUMPER,
        RIGHT_BUMPER: RIGHT_BUMPER,
        
        FRONT_PART: FRONT_PART,
        BACK_PART: BACK_PART
    };
}