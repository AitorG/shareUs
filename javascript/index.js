
const SERVER="php/connect.php";

/**
 * This function will check if session is started.
 * if session is started, page will load home
 * if session is not started, page will load the index
 */
function checkSession(){
	clearInterval(messagesInterval);
	clearInterval(commentInterval);
	var ajax=new XMLHttpRequest;
	ajax.open("post",SERVER);
	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	ajax.send("function=checkSession");
	ajax.onreadystatechange=function(){
		if(ajax.readyState==4&&ajax.status==200){
			var request=JSON.parse(ajax.responseText);
			if(request['warning']=='logged'){
				loadHome();
				
			}	
			else{
				loadIndex();
			
			}
		}
		
	}
}

/**
 * Show to user the form for sign in
 * 
 */
function showRegister(){
	var layer=document.getElementById('firstLayer');
	var ajax=new XMLHttpRequest();
	ajax.open("post","htmlResources/register.html");
	ajax.send();
	ajax.onreadystatechange=function() {
		if(ajax.readyState==4&&ajax.status==200){
			layer.innerHTML=ajax.responseText;
		}
	}
}

/**
 * This function will check data of log in, sending the form to server
 * If data equals to an user from database, it will show a message and, by clicking "ok", will load home
 * if data does not equal to an user from database, it will show a message, by clicking "ok",
 *  the user can try to log again
 * @return {boolean} it returns false, so the form wont be sent (page wont reload)
 */
function logIn(){
	var data=document.getElementById('formLogIn');
	var form=new FormData(data);
	form.append("function","login");
	var ajax=new XMLHttpRequest();
	ajax.open("post",SERVER);
	ajax.send(form);
	ajax.onreadystatechange=function() {
		if(ajax.readyState==4&&ajax.status==200){
			var request=JSON.parse(ajax.responseText);
			if(request['warning']=='found'){
				var fun="loadHome();";
				var text='Hello!! ShareUs was waiting you';
				customWarning(text,fun);
			}
			else{
				var text='Password or email incorrects';
				customWarning(text,"none");
				document.getElementById('passwd').value="";
			}
		}
	};
	return false; //form wont be sent (page wont reload)
}

/**
 * First, the function checks if fields of passwords equals, if both equals the
 * 	function send the form of signing in to server, for signing in a new user.
 *  The server will check if the field "email" is not already signed in database.
 *  If the email is already busy from other user, it will show an error message
 *  Else, if the server could sign it without problems, it will show a success message
 * If passwords does not equals, it will show an error message.
 * @return {boolean} it returns false, so the form wont be sent (and page wont reload)
 */
function signIn(){
	var data=document.getElementById('formSignIn');
	var userSign=document.getElementById('RegUser').value;
	var pass=document.getElementById('RegPasswd').value;
	var passRep=document.getElementById('RegPasswdRep').value
	var text="";
	if(pass==passRep){
		var form=new FormData(data);
		form.append("function","signIn");
		var ajax=new XMLHttpRequest();
		ajax.open("post",SERVER);
		ajax.send(form);
		ajax.onreadystatechange=function(){
			if(ajax.readyState==4&&ajax.status==200){
				var request=JSON.parse(ajax.responseText);
				if (request['warning']=='done') {
					var fun="loadHome();";
					text="Welcome "+userSign+" to ShareUs";
					customWarning(text,fun);
				}
				else if(request['warning']=='email'){
					text='The email is alreay registered, use another one.';
					customWarning(text,"none");
					document.getElementById('RegMail').value="";
				}
			}
		};
	}
	else{
		text="The fields passwords should match";
		customWarning(text,"none");
		document.getElementById('RegPasswd').value="";
		document.getElementById('RegPasswdRep').value="";
	}
	
	return false; // form wont be sent
}

/**
 * This function loads the home page. Takes the top Menu from external html file, and prints it.
 * This function calls to another function for loading the main of home.
 */
function loadHome(){
	
	var topBar=document.getElementById('topBar');
	var ajaxTopBar=new XMLHttpRequest();
	ajaxTopBar.open("post","htmlResources/topBar.html");
	ajaxTopBar.send();
	ajaxTopBar.onreadystatechange=function() {
		if(ajaxTopBar.readyState==4&&ajaxTopBar.status==200){
			topBar.innerHTML=ajaxTopBar.responseText;
			fillUserName();
		}
	}
	fillHome();
	clearInterval(messagesInterval);
	clearInterval(commentInterval);
	commentInterval=setInterval("loadComments()",10000);
	document.getElementById('main').style.width="980px";
}

/**
 * This function load the index top bar and index main content, getting the resources 
 * from an external file
 */
function loadIndex(){
	var main=document.getElementById('main');
	var ajaxMain=new XMLHttpRequest();
	ajaxMain.open("post","htmlResources/indexMain.html");
	ajaxMain.send();
	ajaxMain.onreadystatechange=function() {
		if(ajaxMain.readyState==4&&ajaxMain.status==200){
			main.innerHTML=ajaxMain.responseText;
		}
	}
	var topBar=document.getElementById('topBar');
	var ajaxTopBar=new XMLHttpRequest();
	ajaxTopBar.open("post","htmlResources/indexTopBar.html");
	ajaxTopBar.send();
	ajaxTopBar.onreadystatechange=function() {
		if(ajaxTopBar.readyState==4&&ajaxTopBar.status==200){
			topBar.innerHTML=ajaxTopBar.responseText;
		}
	}
	clearInterval(messagesInterval);
	clearInterval(commentInterval);
	document.getElementById('main').style.width="980px";
}

/**
 * Loads the main of home, taking it from external file. When main is loaded, fill the home
 * with the comments of users.
 */
function fillHome(){
	var topicContent=new XMLHttpRequest();
	topicContent.open("post",SERVER);
	topicContent.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	topicContent.send("function=selectTopic");
	topicContent.onreadystatechange=function() {
		if(topicContent.readyState==4&&topicContent.status==200){
			var topic=JSON.parse(topicContent.responseText);
			var container="<h1 class='titleLayer'>Current topic: ";
			container+=topic['title']+"</h1>";
			container+='<div id="beginDate">';
			container+=topic['beginDate'];
			container+='</div></div>';
			container+='<div class="body" id="body">';
			container+=topic['body'];
			container+='</div>';
			container+="<form action='' method='post' onsubmit='return shareIt()' id='formShareIt'>";
			container+="<div class='comment' id='shareComment'><p class='shareComment'>Share: </p><textarea type='text' placeholder='Share your minds' name='textShare' id='textShare' onclick='openArea();' onblur='closeArea(event)'></textarea><input type='submit' id='send' onmouseover='prepair();' onmouseleave='disPrepair();' value='Share It'></div>";
			container+='</form><br/><br/>';
			container+="<div id='commentsLayer'></div>";
			document.getElementById('main').innerHTML=container;
			document.getElementById('imgTopic').src="img/"+topic['img'];
			loadComments();
		}
	}
}

/**
 * prints the user name in top menu, with the tools layer.
 */
function fillUserName(){
	var ajax=new XMLHttpRequest();
	ajax.open("post",SERVER);
	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	ajax.send("function=getUserName");
	ajax.onreadystatechange=function() {
		if(ajax.readyState==4&&ajax.status==200){
			var request=JSON.parse(ajax.responseText);
			var user=request['userName'];
			document.getElementById('user').innerHTML="<span id='userSpan' onmouseleave='hideUserOptions();' onclick='showUserOptions();'>"+user+"<img src='img/userTools.png' class='userTool' title='"+user+" tools' alt='userTools' /></span>";
			isAdmin();
		}
	};
}

/**
 * prints a custom alert.
 * @param  {string} text The body of alert
 * @param  {string} fun  The optional funtion to be called by clicking "ok", if you dont 
 * wanna use a function, send "none" in this param 
 */
function customWarning (text,fun) {
	document.getElementById('doNotTouch').style.display="inherit";
	document.getElementById('warning').style.display="inherit";
	var ok=document.getElementById('warningOk');
	if(fun=="none"){
		ok.setAttribute("onclick","hideWarning();");
	}
	else{
		ok.setAttribute("onclick","hideWarning();"+fun);
	}
	document.getElementById('warningText').innerHTML=text;
	document.getElementById('warning').style.top='200px';
	ok.focus();
}
	
/**
 * Hides the warning current printed, restoring the default values to warning
 */
function hideWarning(){
	document.getElementById('warning').style.display="none";
	document.getElementById('warning').style.top="-200px";
	document.getElementById('warning').style.height="100px";
	document.getElementById('doNotTouch').style.display="none";
	document.getElementById('doNotTouch').removeAttribute("onclick");
	document.getElementById('warningText').style.fontSize="16px";
	document.getElementById('warningText').style.top="5px";
	var ok=document.getElementById('warningOk');
	ok.style.display="inherit";
	ok.style.left="38%";
	ok.value="Okey";
	document.getElementById('warningCancel').style.display="none";
	document.getElementById('warning').style.transition="all ease 1s";
	
}

/**
 * Prints a temporaly custom warning, which will be visible for 2.5 seconds.
 * @param  {string} text The body of alert
 */
function customTemporalWarning (text) {
	document.getElementById('warning').style.top="-200px";
	document.getElementById('warning').style.height="80px";
	document.getElementById('warning').style.boxShadow="8px 8px 10px";
	document.getElementById('warningText').style.fontSize="20px";
	document.getElementById('warningText').style.top="8px";
	document.getElementById('warning').style.display="inherit";
	var ok=document.getElementById('warningOk');
	ok.style.display="none";
	document.getElementById('warningText').innerHTML="<b>"+text+"</b>";
	setTimeout("document.getElementById('warning').style.top='200px'",10);
	setTimeout("document.getElementById('warning').style.top='-200px'",1500);
	setTimeout("hideWarning();",2500);
}

/**
 * prints a custom confirm dialog.
 * @param  {string} text the body of confirm
 * @param  {string} fun  the function to be called if clicked "do it", if you dont want to
 * call any function, write "none" instead.
 */
function customConfirm (text,fun) {
	document.getElementById('doNotTouch').style.display="inherit";
	document.getElementById('doNotTouch').setAttribute("onclick","hideWarning()");
	document.getElementById('warning').style.display="inherit";
	var ok=document.getElementById('warningOk');
	if(fun=="none"){
		ok.setAttribute("onclick","hideWarning();");
	}
	else{
		ok.setAttribute("onclick","hideWarning();"+fun);
	}
	ok.value="Do it";
	ok.style.left="287px";
	document.getElementById('warningCancel').style.display="inherit";
	document.getElementById('warningText').innerHTML=text;
	document.getElementById('warning').style.top='200px';
}



