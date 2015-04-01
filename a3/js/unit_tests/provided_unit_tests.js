'use strict';

var expect = chai.expect;

describe('Provided unit tests', function() {

	//UNIT TEST 1-: 
	it('TEST 1 : Creating the rootnode and adding the carnode as its child', function() {
        var sceneGraphModule = createSceneGraphModule();
		//creating the root node
		var RootNode = new sceneGraphModule.RootNode();
		//creating the car node
		var CarNode = new sceneGraphModule.CarNode();
		//adding the car node to the root node
		RootNode.addChild(CarNode);
		//checking if the root node containts the child node
	    expect(RootNode.children.CAR_PART.nodeName, 'RootNode has car part as its child').to.equal("CAR_PART");
	 });
	 
	//UNIT TEST 2:-    
	it('TEST 2: Creating the rootnode and car node and checking their start and object transforms', function() {
		var sceneGraphModule = createSceneGraphModule();
		//creating the root node
		var RootNode = new sceneGraphModule.RootNode();
		//creating the car node
		var CarNode = new sceneGraphModule.CarNode();
		//adding the car node to the root node
		RootNode.addChild(CarNode);
		//checking the start transformation that should be identitiy for Root
		expect(RootNode.startPositionTransform.isIdentity(), "No changes to the start position of the rootNode").to.equal.true;
		//placing the carNode
		var tx = new AffineTransform();
		CarNode.startPositionTransform = tx;
		//checking the start transformation that should be identitiy for Car
		expect(CarNode.startPositionTransform.isIdentity(), "No changes to the start position of the carNode").to.be.true;
		//changing the object transformations for the car
		var ty = new AffineTransform();
		ty.translate(200,300);
		CarNode.objectTransform = ty;
		//checking if the objectTransform is not identity for carnode
		expect(CarNode.objectTransform.isIdentity(), "changes to the object position of the carNode").to.be.false;
		expect(CarNode.objectTransform.equals(ty), "checking if objectTransform was set to the right transform").to.be.true;
	 });
	 
	 //UNIT TEST 3:-    
	 it('TEST 3: Checking pointInObject for CarNode', function() {
	 	var sceneGraphModule = createSceneGraphModule();
	 	//creating the root node
	 	var RootNode = new sceneGraphModule.RootNode();
	 	//creating the car node
	 	var CarNode = new sceneGraphModule.CarNode();
	 	//adding the car node to the root node and setting its start and object tranforms
	 	RootNode.addChild(CarNode);
	 	var tx = new AffineTransform();
	 	CarNode.startPositionTransform = tx;
	 	var ty = new AffineTransform();
	 	ty.translate(200,300);
	 	CarNode.objectTransform = ty;
	 	var coordinates = {x:205,y:320};
	 	var partLocation = RootNode.pointInObject(coordinates);
	 	expect(partLocation=="CAR_PART", 'part location should be car part').to.be.true;
	  });
	  
   //UNIT TEST 4:-    
  	 it('TEST 4: Creating 2 children for the CarNode and checking if it exists', function() {
  	 	var sceneGraphModule = createSceneGraphModule();
  	 	//creating the root node
  	 	var RootNode = new sceneGraphModule.RootNode();
  	 	//creating the car node
  	 	var CarNode = new sceneGraphModule.CarNode();
  	 	//Creating first child
  	 	var FrontBumper = new sceneGraphModule.Bumper(sceneGraphModule.FRONT_BUMPER);
  	 	//adding the car node to the root node and setting its start and object tranforms
  	 	RootNode.addChild(CarNode);
  	 	//Adding the front bumper to the car child
  	 	CarNode.addChild(FrontBumper);
  	 	//creating second child
  	 	var BackBumper = new sceneGraphModule.Bumper(sceneGraphModule.BACK_BUMPER);
 		//adding the car node to the root node and setting its start and object tranforms
 		RootNode.addChild(CarNode);
 		//Adding the Back bumper to the car child
 		CarNode.addChild(BackBumper);
 		
 		var child1 = CarNode.children.FRONT_BUMPER;
 		console.log(child1);
 		expect(child1.nodeName=="FRONT_BUMPER", 'front bumer should be the first child as it was added first').to.be.true;
 		
 		var child2 = CarNode.children.BACK_BUMPER;
 			console.log(child2);
 			expect(child2.nodeName=="BACK_BUMPER", 'back bumper should be the second child as it was added second').to.be.true;
  	 
  	  });
  	  
  	  //UNIT TEST 5:-    
  	 it('TEST 5: Checking starting  transform and object transform for the front_bumper', function() {
  	 	var sceneGraphModule = createSceneGraphModule();
  	 	//creating the root node
  	 	var RootNode = new sceneGraphModule.RootNode();
  	 	//creating the car node
  	 	var CarNode = new sceneGraphModule.CarNode();
  	 	//Creating first child
  	 	var FrontBumper = new sceneGraphModule.Bumper(sceneGraphModule.FRONT_BUMPER);
  	 	//adding the car node to the root node and setting its start and object tranforms
  	 	RootNode.addChild(CarNode);
  	 	//Adding the front bumper to the car child
  	 	CarNode.addChild(FrontBumper);
  	 	var tx = new AffineTransform();
 		CarNode.startPositionTransform = tx;
 		var ty = new AffineTransform();
 		ty.translate(200,300);
 		CarNode.objectTransform = ty;
 		
 		FrontBumper.objectTransform = ty;
 		expect(FrontBumper.objectTransform.equals(ty), "checking if object transform is set for front bumper").to.be.true;
 		
		expect(FrontBumper.startPositionTransform.isIdentity(), "checking if start position of front bumper is identity").to.be.true;
 		
  	 
  	  });
	 
});
