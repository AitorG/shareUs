
var commentInterval=setInterval("loadComments()",10000); //comments will load each 10 seconds
var messagesInterval=setInterval("giveMeMessages()",5000); //messages will load each 5 seconds

/**
 * open the textarea for allowing to write a new comment
 */
 function openArea () {
 	document.getElementById('shareComment').style.height="275px";
 	document.getElementById('textShare').style.height="200px";
 	document.getElementById('textShare').style.paddingBottom="46px";
 	document.getElementById('send').style.display='inherit';
 	setTimeout("document.getElementById('send').style.opacity=1",300);
 }

/**
 * Closes the textarea where you write a new comment
 */
 function closeArea () {
 	document.getElementById('shareComment').style.height="60px";
 	document.getElementById('textShare').style.height="20px";
 	document.getElementById('textShare').style.paddingBottom="10px";
 	document.getElementById('send').style.display='none';
 	document.getElementById('send').style.opacity=0;
 }

/**
 * Share the wrote comment sendint it to server for being stored on database,
 * Shows an alert that says it was stored successfully. Besides, reload comments.
 * @return {boolean} false: form wont be sent
 */
 function shareIt () {

 	var data=document.getElementById('formShareIt');
 	var ajax=new XMLHttpRequest();
 	var form=new FormData(data);
 	form.append("function","shareIt");
 	ajax.open("post",SERVER);
 	ajax.send(form);

 	ajax.onreadystatechange=function() {
 		if(ajax.readyState==4&&ajax.status==200){
 			var request=JSON.parse(ajax.responseText);
 			var text="Comment Shared";
 			customTemporalWarning(text);
 			timeout=setTimeout("loadComments()",1000);
 		}
 	};

 	closeArea();
 	document.getElementById('textShare').value="";
	return false; //form wont be sent
}

/**
 * both of functions prevents the hiding of Share text when it loses the focus by
 * clicking "Share it"
 * @return {[type]} [description]
 */
 function prepair () {
 	document.getElementById('textShare').removeAttribute("onblur");
 }
/**
 * both of functions prevents the hiding of Share text when it loses the focus by
 * clicking "Share it"
 * @return {[type]} [description]
 */
 function disPrepair () {
 	document.getElementById('textShare').setAttribute("onblur","closeArea();");
 }

/**
 * This function sends a request to server for getting all comments, and allows to user remove
 * a comment that belongs to him
 * Next, shows the comments sent by server.
 */
 function loadComments () {
 	var ajax=new XMLHttpRequest();
 	ajax.open("post",SERVER);
 	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
 	ajax.send("function=loadComments");
 	var container="";
 	ajax.onreadystatechange=function() {
 		if(ajax.readyState==4&&ajax.status==200){
 			var request=JSON.parse(ajax.responseText);
 			if(request.numComments>0){
 				for (var i = 0; i < request.numComments ; i++) {
 					container+="<div class='commentShared'>";
 					var date=request['date'+i];
 					date=date.split(' ');
 					date=""+date[1]+" &nbsp;|| &nbsp;"+date[0];
 					if(request['isMine'+i]=="nope"){
 						container+="<div class='mailName'>"+request['userName'+i]+" <span class='userName' onclick='showSendMessage("+'"'+request['userMail'+i]+'"'+")'>"+request['userMail'+i]+"<img src='img/mail.png' /></span><span class='commentdate'>"+date+"</span></div>";
 					}
 					else{
 						container+="<div class='mailName'>"+request['userName'+i]+" <span class='userName'>"+request['userMail'+i]+"</span><span class='commentdate'>"+date+"</span></div>";
 					}
 					container+="<p class='commentBody'>"+request['comment'+i]+"</p>";

 					if(request['isMine'+i]=="yes"){
 						container+="<p class='delete' onclick='confirmDeleteComment("+request['id'+i]+")'>Delete<img src='img/delete.png' title='Delete comment'/></p>";
 					}
 					container+="</div>";
 				};
 			}
 			else{
 				container+="<div class='commentShared'>";
 				container+="<p class='commentBody' style='text-align:center;font-size:18px;'><b>No comments for this topic, be the first!</b></p>";
 				container+="</div>"
 			}
 			
 			container+="<div id='whiteHole'></div>";
 			document.getElementById('commentsLayer').innerHTML=container;

 		}
 	};
 }

/**
 * Show the user tools pannel
 */
 function showUserOptions () {
 	document.getElementById('userSpan').style.background="rgb(37,100,170)";
 	document.getElementById('userTools').style.display="inherit";
 	document.getElementById('user').style.background="rgb(47,120,190)";

 }

/**
 * This function hide the user tools pannel.
 */
 function hideUserOptions () {
 	document.getElementById('user').style.background="rgb(47,120,190)";
 	document.getElementById('userSpan').style.background="rgb(47,120,190)";
 	document.getElementById('userTools').style.display="none";

 }

/**
 * Leaves the current session. Sends to server the instruction to destroy the session
 * Then, check if session is alreay destroyed, if done, load index, if not, load home
 */
 function leaveShareUs(){

 	var ajax=new XMLHttpRequest;
 	ajax.open("post",SERVER);
 	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
 	ajax.send("function=leaveShareUs");
 	ajax.onreadystatechange=function(){
 		if(ajax.readyState==4&&ajax.status==200){
 			var text="See you soon!";
 			customTemporalWarning(text);
 			leaving=setTimeout("checkSession()",2500);
 		}

 	}

 }

/**
 * shows a confirm to remove or not the comment selected
 * @param  {int} id the comment selected to be removed
 */
 function confirmDeleteComment (id) {
 	var text="Your comment will dissapear";
 	customConfirm(text,"deleteComment("+id+");");
 }

/**
 * Removes an existing comment which belongs to current connected user.
 * @param  {int} id the message to remove
 */
 function deleteComment (id) {
 	var ajax=new XMLHttpRequest;
 	ajax.open("post",SERVER);
 	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
 	ajax.send("function=deleteComment&id="+id+"");
 	ajax.onreadystatechange=function(){
 		if(ajax.readyState==4&&ajax.status==200){
 			var request=JSON.parse(ajax.responseText);
 			var text="";
 			if(request['warning']=="done"){
 				text="Comment deleted!";
 			}
 			else{
 				text="Internal error, apologies =(";
 			}
 			customTemporalWarning(text);
 			loadAgain=setTimeout("loadComments()",2500);
 		}

 	}
 }

/**
 * Prints a layer for sending a message to the user clicked (if function was called from
 * home's comment), or to another user.
 * @param  {string} email user to send the message
 */
 function showSendMessage (email) {
 	var ajax=new XMLHttpRequest;
 	ajax.open("post","htmlResources/sendMessage.html");
 	ajax.send();
 	ajax.onreadystatechange=function(){
 		if(ajax.readyState==4&&ajax.status==200){
 			document.getElementById('doNotTouchMessage').style.display="inherit";
 			document.getElementById('doNotTouchMessage').setAttribute("onclick","hideSendMessage()");
 			document.getElementById('messages').innerHTML=ajax.responseText;
 			document.getElementById('messages').style.display="inherit";
 			if(email!="no"){
 				document.getElementById('messageUserMail').value=email;
 			}
 			document.getElementById('messageBody').focus();

 		}

 	}
 }

/**
 * This function sends the message to server for being stored in database, and shows an 
 * alert which says if message was sucessfully stored or not.
 * @return {boolean} false, form wont be sent (page wont reload)
 */
 function throwMessage () {
 	var mail=document.getElementById('messageUserMail').value;
 	var body=document.getElementById('messageBody').value;
 	var ajax=new XMLHttpRequest;
 	ajax.open("post",SERVER);
 	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
 	ajax.send("function=sendMessage&mail="+mail+"&body="+body+"");
 	ajax.onreadystatechange=function(){
 		if(ajax.readyState==4&&ajax.status==200){
 			var request=JSON.parse(ajax.responseText);
 			if(request.warning=="done"){
 				customTemporalWarning("Message sent");
 				hideSendMessage();
 			}
 			else{
 				customTemporalWarning(request.warning);
 				document.getElementById('messageUserMail').value="";
 			}
 		}
 	}
	return false; //form wont be sent

}

/**
 * Hides the layer of sending a message, and reset all the message fields
 */
 function hideSendMessage () {
 	document.getElementById('doNotTouchMessage').style.display="none";
 	document.getElementById('doNotTouchMessage').removeAttribute("onclick");
 	document.getElementById('messages').style.display="none";
 	document.getElementById('messageUserMail').value="";
 	document.getElementById('messageBody').value="";
 }

/**
 * Takes the page of messaged stored in external html file. Then the function print it
 */
 function loadMessagesPage(){
 	var main=document.getElementById('main');
 	var ajax=new XMLHttpRequest;
 	ajax.open("post","htmlResources/messages.html");
 	ajax.send();
 	ajax.onreadystatechange=function(){
 		if(ajax.readyState==4&&ajax.status==200){
 			var request=ajax.responseText;
 			main.innerHTML=request;
 			main.style.width="735px";
 			giveMeMessages();
 			clearInterval(commentInterval);
 			clearInterval(messagesInterval);
 			messagesInterval=setInterval("giveMeMessages()",5000);
 			
 		
 		}
 	}
 }

/**
 * This function sends a request to server for getting all messages of the user who is
 * current connected. 
 * Next, shows the messages sent by server.
 */
 function giveMeMessages () {
 	var ajax=new XMLHttpRequest;
 	var container="";
 	ajax.open("post",SERVER);
 	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
 	var order=document.getElementById('orderBy').value;
 	var req=document.getElementById('req').value;
 	ajax.send("function=getMessages&order="+order+"&load="+req+"");
 	ajax.onreadystatechange=function(){
 		if(ajax.readyState==4&&ajax.status==200){
 			var request=JSON.parse(ajax.responseText);
 			if(request.numMessages>0){
 				for(var i=0; i < request.numMessages; i++){
 					container+="<div class='messageShown'>";
 					var date=request['date'+i];
 					date=date.split(' ');
 					date=""+date[1]+" &nbsp;|| &nbsp;"+date[0];

 					container+="<div class='mailName'><b>";
 					if(req=="inbox"){
 						container+="From: &nbsp";
 					}
 					else{
 						container+="To: &nbsp";
 					}
 					container+=request['fromName'+i]+"</b> <span class='userName'>"+request['from'+i]+"</span> <span class='commentdate'>"+date+"</span></div>";
 					container+="<p class='commentMessage'>"+request['body'+i]+"</p>";


 					container+="<p class='delete' onclick='confirmDeleteMessage("+request['id'+i]+")'>Delete<img src='img/delete.png' title='Delete message'/></p>";
 					if (req=="inbox") {
 						container+="<p class='delete reply' onclick='showSendMessage("+'"'+request['from'+i]+'"'+")'>Reply<img src='img/reply.png' title='Reply to "+request['fromName'+i]+"'/></p>";
 					};
 					

 					container+="</div>";
 				}
 			}
 			else{
 				container+="<div class='messageShown'>";
 				container+="<p class='commentMessage' style='text-align:center;font-size:18px;'><b>You have not messages, try to send one!</b></p>";
 				container+="</div>"
 			}

 			container+="<div id='whiteHole'></div>";
 		}
 		document.getElementById('loadMessagesHere').innerHTML=container;

 	}

 }
/**
 * Shows a confirm dialog. Choose if delete or not the message
 * @param  {id} id the id of message to be remove.
 */
 function confirmDeleteMessage (id) {
 	var text="The message will dissapear";
 	customConfirm(text,"deleteMessage("+id+");");
 }

/**
 * Sends a request for removing a message to server.
 * @param  {int} id the id of message to be removed
 * This function shows a suscessfull alert if message was deleted, and shows
 * an error if message couldnt be deleted.
 */
 function deleteMessage (id) {
 	var ajax=new XMLHttpRequest;
 	ajax.open("post",SERVER);
 	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
 	ajax.send("function=deleteMessage&id="+id+"");
 	ajax.onreadystatechange=function(){
 		if(ajax.readyState==4&&ajax.status==200){
 			var request=JSON.parse(ajax.responseText);
 			var text="";
 			if(request['warning']=="done"){
 				text="Message deleted!";
 			}
 			else{
 				text="Internal error, apologies =(";
 			}
 			customTemporalWarning(text);
 			loadAgain=setTimeout("giveMeMessages()",2500);
 		}

 	}
 }

/**
 * Change the order of messages in Messages page
 * Messages can be ordered by email or date.
 */
 function changeOrder(){
 	var order=document.getElementById('orderBy').value;
 	var text=document.getElementById('valueOrder');
 	if(order=="Email"){
 		document.getElementById('orderBy').value="date";
 		text.innerHTML="Sorted by Date";
 		giveMeMessages();
 	}
 	else{
 		document.getElementById('orderBy').value="Email";
 		text.innerHTML="Sorted by Email";
 		giveMeMessages();
 	}
 }

/**
 * changes the styles of the top menu pannel from messages.
 * @param  {num} num the focus
 */
function messageFocus (num) {
	var inbox=document.getElementById("sa");
	var sent=document.getElementById("se");
	sa.style.background="rgb(16,140,185)";
	sa.style.fontWeight="normal";
	sa.style.color="#f0f0f0";
	sa.style.zIndex=20;
	se.style.background="rgb(16,140,185)";
	se.style.fontWeight="normal";
	se.style.color="#f0f0f0";
	se.style.zIndex=20;
	switch(num){
		case 1: sa.style.background="rgb(36,160,205)";
				sa.style.fontWeight="bold";
				sa.style.color="white";
				sa.style.zIndex=40;
				document.getElementById('req').value="inbox";
				giveMeMessages();
		break;
		case 2: se.style.background="rgb(36,160,205)";
				se.style.fontWeight="bold";
				se.style.color="white";
				se.style.zIndex=40;
				document.getElementById('req').value="sent";
				giveMeMessages();
		break;
	}
}








