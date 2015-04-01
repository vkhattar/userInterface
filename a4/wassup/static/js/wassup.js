//global variables
var CURRENT = 0;
var MAX = 0;
var CONTEXT_ARRAY =[];
var SUP_ID_ARRAY = [];
var DELETE_SUP = 0;
//getting canvas mouse cordinates
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

    // Place your Wassup app code here
    console.log("Wassup?");
  	//get all the elements control
  	
  	var addButton=document.getElementById('add_friend_id');
    var select = document.getElementById('friend_list_id');
    var canvas = document.getElementById('canvas_id');
    var sendButton = document.getElementById('send_button');
    var previousButton = document.getElementById('previous_button');
    var nextButton = document.getElementById('next_button');
    var deleteButton = document.getElementById('delete_button_id');
    
    
    var context = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 400;
    var width = canvas.width;
    var height = canvas.height;
    canvas.style.border="1px solid black";
    //populate with exisiting Friend
    fillFriends(select);
    //updating global arrays initialising them
    updateSupArrays(context);
    //getting the sups 
    getSup(canvas,context,width,height,CURRENT);
    
    
	//---------event listener for <deleting a SUP on the canvas>--------------------------------
	canvas.addEventListener('mousedown', function(e) {

		var mouse = getPos(canvas);
		var canvasPos = getPos(canvas);
		mouseDown = getMouse(canvasPos, e);
		var x_start = width-120;
		var y_start = height/10;
		var x_fin = x_start+50;
		var y_fin = y_start+20;
		//context.rect(x,y,50,20);
		
		if(mouseDown.x>x_start && mouseDown.x<x_fin && mouseDown.y>y_start && mouseDown.y<y_fin){
			window.alert("inside the delete button");
			
			
			var supId = SUP_ID_ARRAY[CURRENT];
			//SUP_ID_ARRAY.splice(CURRENT, 1 )[0];
			
			//actually handle the deletion 
			var msg = {"protocol_version":"1.1","command":"remove_sup","message_id":generateUUID(),"command_data":{"sup_id":supId}};
			handleAjaxRequest(msg,function(){
				
				if(this.reply_data=='Removed sup'){
					//remove the sup FROM ARRAY
					var value = SUP_ID_ARRAY.splice(CURRENT, 1 )[0];
					//remove the associated context array
					CONTEXT_ARRAY.splice(CURRENT,1);
					
					context.clearRect(0,0,width,height);
					//checking if the deleted message was the last in sup id array
					if(SUP_ID_ARRAY.length==0){
						CURRENT = 0;
					}
					//when current is last on the canvas then move current one back
					else if(SUP_ID_ARRAY.length == CURRENT){
						CURRENT = CURRENT -1;
					}
					
					
					
					getSup(canvas,context,width,height,CURRENT);
					
					
				
					
//					if(CONTEXT_ARRAY.length>CURRENT){
//						//go to next messgae
//						CURRENT = CURRENT+1;
//						context.clearRect(0,0,width,height);
//						//getSup(canvas,context,width,height,CURRENT);
//						
//					}
//					else if(CONTEXT_ARRAY.length==0){
//						//go to previous
//						window.alert("no more messages to display");
//					}
//					else{
//						//go to previous message
//					}
					
				}
				else{
					window.alert("Sorry couldnt find  this ssup ");
				
				}
			});
			
		}
		
	});
	
	//**addFriend, FirstCheck if user exists if it does then call addFriend 
	//----------------------------event listener for <adding a friend>--------------------------------
	addButton.addEventListener('click', function() {
		var friendName = document.getElementById('friend_name_id').value;
		userExists(friendName);
	});

	//----------------------------event listener for <deleting a friend>--------------------------------
	deleteButton.addEventListener('click', function() {
		//deleting a friend 
		if(select.options[select.selectedIndex]){
			var removeFriend_id = select.options[select.selectedIndex].value;
			var deleteFriendMsg = {"protocol_version":"1.1","command":"remove_friend","message_id":generateUUID(),"command_data":{"user_id":removeFriend_id}};
			handleAjaxRequest(deleteFriendMsg,function(){
				
				if(this.reply_data == 'Removed friend'){
					window.alert("deleted friend " );
					//remove from the contact list:
					select.remove(select.selectedIndex);
				}
				else{
					window.alert("unable to delete");
				}
			});
		}
		else{
			window.alert("no friend is selected");
		}
		
	});
	//-------------------------------event listener for <sending messages>------------------------------
	sendButton.addEventListener('click', function() {
		var supFriend_id = select.options[select.selectedIndex].value;
		console.log("supFriend name: " + supFriend_id);
		var supTime = (function getDateTime() {
		                            var d = new Date();
		                            var months = [ "January","February", "March", "April", "May", "June",
		                            "July", "August", "September", "October", "November", "December"];
		                            var m = d.getMonth();
		                            var day = d.getDate();
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
		
		//send_sup
		//input: user_id, sup_id, date
		var supFriend_msg = {"protocol_version":"1.1","command":"send_sup","message_id":generateUUID(),"command_data":{"user_id":supFriend_id, "sup_id":generateUUID(), "date":supTime }};
		
		handleAjaxRequest(supFriend_msg,function(){
			console.log("send_sup object: "+ this.reply_data);
			
			if(this.reply_data == 'Sent sup'){
				window.alert("ssup sent to " + supFriend_id);
			}
			else{
				window.alert("unable to send message");
			}
		});
	});	
	//----------------------------event listener for <previous sup messages>--------------------------------
	previousButton.addEventListener('click', function() {
		if(CURRENT > 0){
			console.log("previous sup message will be fetched");
			CURRENT = CURRENT-1;
			context.clearRect(0,0,width,height);
			getSup(canvas,context,width,height,CURRENT);
			
			document.getElementById('current_span').innerText = CURRENT;
		}
		else{
			window.alert("no previous message to show");
		}
	});
	
	//----------------------------event listener for <next sup messages>--------------------------------
	nextButton.addEventListener('click', function() {
		
		CURRENT = CURRENT+1;
		//if(CURRENT<MAX){
		if(CURRENT<CONTEXT_ARRAY.length){
			
			console.log(" next sup message will be fetched + MAX IS: " + MAX);
			
			context.clearRect(0,0,width,height);
			getSup(canvas,context,width,height,CURRENT);
		}
		else{
			window.alert("Last Message");
			//CURRENT = MAX-1;
			CURRENT = CURRENT-1;
		}
		document.getElementById('current_span').innerText = CURRENT;
		
	});

});

function updateSupArrays(context){
//	var CONTEXT_ARRAY =[];
//	var SUP_ID_ARRAY = [];
	var supFriend_msg = {"protocol_version":"1.1","command":"get_sups","message_id":generateUUID(),"command_data":null};
	
	handleAjaxRequest(supFriend_msg,function(){
		var numSups = this.reply_data.length;
		if(numSups>0){
			for(var i=0;i<numSups;i++){
				context.save();
					//get this randomly 
					//Please note that this has been taken from stacoverflow: http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
					var fillStyle = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
					//font
					var fontArray = ["italic 3.3em sans-serrif", "bold 3.2em serrif","oblique 4em verdana","bold italic 3.7em Times New Roman"]; 
					var font = fontArray[Math.floor(Math.random()*4)];
					var angle_degrees =  Math.floor(Math.random() * 20) - 20;
					var rotate = angle_degrees*((Math.PI)/180);
					context.fillStyle = fillStyle;
					context.font = font;
					context.rotate(rotate);
//					context.fillText("Ssup ?",width/5,height/1.6);
					var context_properties = {context:context, fillStyle:fillStyle, font:font ,angle:rotate};
					CONTEXT_ARRAY.push(context_properties);
					SUP_ID_ARRAY.push(this.reply_data[i].sup_id);
				context.restore();
				
			}
		
		}

	});
	
	
}




//will print the following info on the canvas based on the CURRENT value--*DATE *FROM * SSUP?
function getSup(canvas,context,width,height,current){

	var supFriend_msg = {"protocol_version":"1.1","command":"get_sups","message_id":generateUUID(),"command_data":null};
	
	handleAjaxRequest(supFriend_msg,function(){
		console.log("getting sups"+ JSON.stringify(this.reply_data) + "number: "+this.reply_data.length);
		var numSups = this.reply_data.length;
		MAX = numSups;
		document.getElementById('sup_num_span').innerText = numSups;
		if(numSups>0){
			
			
			var senderFullName =  this.reply_data[current].sender_full_name;
			var sentDate = this.reply_data[current].date; 

			
			//Printing the senders full name
			context.fillStyle = "#660066";
			context.font ="italic bold 1em sans-serrif";
			context.textBaseline = "bottom";
			context.fillText("From "+senderFullName,width/1.5,height/1.2); 
			//Printing the date of the ssup 
			context.textBaseline = "top";
			context.fillStyle = "#696469";
			context.font ="italic 1em sans-serrif";
			context.fillText("At: "+sentDate,width/1.5,height/1.2);	
			//WRITE THE ACTUAL SSUP ! 
			
		
			
			if(!CONTEXT_ARRAY[current]){
				console.log("hmm make new context");
				context.save();
					//get this randomly 
					//Please note that this has been taken from stacoverflow: http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
					var fillStyle = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
					//font
					var fontArray = ["italic 3.3em sans-serrif", "bold 3.2em serrif","oblique 4em verdana","bold italic 3.7em Times New Roman"]; 
					var font = fontArray[Math.floor(Math.random()*4)];
					var angle_degrees =  Math.floor(Math.random() * 20) - 20;
					var rotate = angle_degrees*((Math.PI)/180);
					context.fillStyle = fillStyle;
					context.font = font;
					context.rotate(rotate);
					context.fillText("Ssup ?",width/5,height/1.6);
					var context_properties = {context:context, fillStyle:fillStyle, font:font ,angle:rotate};
					CONTEXT_ARRAY.push(context_properties);
				context.restore();
				//drawing the delete button on canvas
				context.save();
					var x = width-120;
					var y = height/10;
					context.rect(x,y,50,20);
					context.strokeStyle = fillStyle;
					context.stroke();
					context.fillStyle = "black";
					context.fillText("Delete", x+5,y+3);	
				context.restore();
			}
			else{
				//drawing ssup
				context.save();
					context = CONTEXT_ARRAY[current].context;
					context.fillStyle = CONTEXT_ARRAY[current].fillStyle;
					context.font =CONTEXT_ARRAY[current].font;
					context.rotate(CONTEXT_ARRAY[current].angle);
					context.fillText("Ssup ?",width/5,height/1.6);
				context.restore();
				//drawing the delete box
				context.save();
					var x = width-120;
					var y = height/10;
					context.rect(x,y,50,20);
					context.strokeStyle = CONTEXT_ARRAY[current].fillStyle;
					context.stroke();
					context.fillStyle = "black";
					context.fillText("Delete", x+5,y+3);	
				context.restore();
				
			}
		}
	});
}

function userExists(userId){
	var msg = {"protocol_version":"1.1","command":"user_exists","message_id":generateUUID(),"command_data":{"user_id":userId}};
	handleAjaxRequest(msg,function(){
		console.log("user Exists value: " + this.reply_data.exists);
		if(this.reply_data.exists){
			//you can add a firned
			addCheckFriend(userId);
		}
		else{
			window.alert("Sorry no such user in ssup");
		}
	});
}

//function addFriend(friendName){
//	
//	console.log("name is: "+friendName);
//	var msg = {"protocol_version":"1.1","command":"add_friend","message_id":generateUUID(),"command_data":{"user_id":friendName}};
//	handleAjaxRequest(msg,function(){
//		console.log(this);
//		if(this.reply_data=='Added friend'){
//			//checking if the list needs to be updated for that we need getFriends()
//			getFriends(friendName);
//		}
//	    
//		 
//	});
//}


function addCheckFriend(friendName){
	var NEW_FRIEND = 1;
	var msg = {"protocol_version":"1.1","command":"get_friends","message_id":generateUUID(),"command_data":null};
	handleAjaxRequest(msg,function(){
		//checking the existing friends list
		for(i = 0;i<this.reply_data.length;i++){
			console.log("userID i: " + this.reply_data[i].user_id);
			//NEW FRIEND
			if(friendName == this.reply_data[i].user_id){
					NEW_FRIEND = 0;
			}
		}
		//this means it should be a new friend
		if(NEW_FRIEND==1){
			console.log("NEW FUCKING FRIEND");
			var msg = {"protocol_version":"1.1","command":"add_friend","message_id":generateUUID(),"command_data":{"user_id":friendName}};
			handleAjaxRequest(msg,function(){
				console.log(this);
				if(this.reply_data=='Added friend'){
					var select = document.getElementById('friend_list_id');
					var opt = document.createElement('option');
					opt.text = friendName;
					select.add(opt);
					window.alert("yayyyyy");
				}   
			});
		}
		else{
			window.alert("already your friend");
		}
	});
}

function fillFriends(select){
	console.log("getting the friend list");
	
	var msg = {"protocol_version":"1.1","command":"get_friends","message_id":generateUUID(),"command_data":null};
	handleAjaxRequest(msg,function(){
		console.log(this.reply_data);
		
		for(i = 0;i<this.reply_data.length;i++){
			console.log("userID i: "+ this.reply_data[i].user_id);
			var opt = document.createElement('option');
			opt.text = this.reply_data[i].user_id;
			select.add(opt);
		}
	});
}

function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

// Example derived from: https://developer.mozilla.org/en-US/docs/AJAX/Getting_Started
function handleAjaxRequest(message,callback) {

    // Create the request object
    var httpRequest = new XMLHttpRequest();

    // Set the function to call when the state changes
    httpRequest.addEventListener('readystatechange', function() {

        // These readyState 4 means the call is complete, and status
        // 200 means we got an OK response from the server
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            // Parse the response text as a JSON object
            var responseObj = JSON.parse(httpRequest.responseText);
            
			callback.call(responseObj);
//            // TODO: Actually do something with the data returned
        }
    });

    // This opens a POST connection with the server at the given URL
    httpRequest.open('POST', 'http://localhost:8080/post');

    // Set the data type being sent as JSON
    httpRequest.setRequestHeader('Content-Type', 'application/json');

    // Send the JSON object, serialized as a string
//    // TODO: You will need to actually send something and respond to it
    var objectToSend = message;
    httpRequest.send(JSON.stringify(objectToSend));
}
