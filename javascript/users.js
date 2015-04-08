/**
 * displays a layer with fields for user data, and calls a function to fills that fields with
 * current data
 */
 function showProfile () {
 	var layer=document.getElementById('profileLayer');
 	var ajax=new XMLHttpRequest;
 	ajax.open("post","htmlResources/profile.html");
 	ajax.send();
 	ajax.onreadystatechange=function(){
 		if(ajax.readyState==4&&ajax.status==200){
 			document.getElementById('doNotTouchProfile').style.display="inherit";
 			document.getElementById('doNotTouchProfile').setAttribute("onclick","hideShowProfile()");
 			layer.innerHTML=ajax.responseText;
 			layer.style.display="inherit";
 			fillProfileFields();
 		}
 	}
 }

/**
 * hides the layer of user profile data
 */
 function hideShowProfile () {
 	document.getElementById('doNotTouchProfile').style.display="none";
 	document.getElementById('doNotTouchProfile').removeAttribute("onclick");
 	document.getElementById('profileLayer').style.display="none";
 }

/**
 * This function allows to update fields of profile: user name, and last names.
 */
 function allowEditProfile () {
 	document.getElementById("profilename").removeAttribute("readonly");
 	document.getElementById("profilename").style.background="white";
 	document.getElementById("profilelastNames").removeAttribute("readonly");
 	document.getElementById("profilelastNames").style.background="white";
 	document.getElementById("profilelastNames").style.cursor="pointer";
 	document.getElementById("profilename").style.cursor="pointer";
 	document.getElementById('sendProfile').style.display="inherit";
 }

/**
 * Fills up the fields of the layer of user data. Takes the info from server
 */
 function fillProfileFields () {
 	var ajax=new XMLHttpRequest;
 	ajax.open("post",SERVER);
 	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
 	ajax.send("function=getUserFields");
 	ajax.onreadystatechange=function(){
 		if(ajax.readyState==4&&ajax.status==200){
 			var request=JSON.parse(ajax.responseText);
 			if(request.warning=="done"){
 				document.getElementById("profileemail").value=request.email;
 				document.getElementById("profilename").value=request['name'];
 				document.getElementById("profilelastNames").value=request.lastNames;
 			}
 			else{
 				customTemporalWarning("Internal error loading data :(");
 			}
 		}
 	};
 }

/**
 * sends the new user profile data to server for updating those. shows an alert with
 * successfully updated data or failed
 * @return {boolean} false, form wont be sent (page wont reload)
 */
 function applyChangesProfile () {
 	var ajax=new XMLHttpRequest;
 	ajax.open("post",SERVER);
 	var pointer=document.getElementById('formChangesProfile');
 	var form=new FormData(pointer);
 	form.append("function","applyChangesProfile");
 	ajax.send(form);
 	ajax.onreadystatechange=function(){
 		if(ajax.readyState==4&&ajax.status==200){
 			var request=JSON.parse(ajax.responseText);
 			if(request.warning=="done"){
 				customTemporalWarning("Profile updated");
 				timeoutprofile=setTimeout("hideShowProfile()",2500);
 				fillUserName();
 			}
 			else{
 				customTemporalWarning("Internal error updating data :(");
 			}
 		}
 	};

	return false; //form wont be sent
}


/**
 * This function sends a command to server for checking if the user who is current 
 * connected is admin. If user is admin, prints the button for being able to access to
 * admin pannel.	
 * @return {Boolean} true if is admin, false if isn't.
 */
 function isAdmin(){
 	var ajax=new XMLHttpRequest;
 	var isAdmin;
 	ajax.open("post",SERVER);
 	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
 	ajax.send("function=isAdmin");
 	ajax.onreadystatechange=function(){
 		if(ajax.readyState==4&&ajax.status==200){
 			var request=JSON.parse(ajax.responseText);
 			if(request.warning=="yes"){
 				document.getElementById("pannelAdminButton").style.display="inherit";
 				return true;
 			}
 			else{
 				return false;
 			}
 		}
 	};
 }

/**
 * Load the page of admin pannel. The function gets all topics and displays them.
 * Then, calls a function to load all users.
 */
 function adminPannel () {
 	var ajax=new XMLHttpRequest;
 	var container="";
 	ajax.open("post",SERVER);
 	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
 	ajax.send("function=isAdmin");
 	ajax.onreadystatechange=function(){
 		if(ajax.readyState==4&&ajax.status==200){
 			var request=JSON.parse(ajax.responseText);
 			if(request.warning=="yes"){
 				var bodyAdmin=new XMLHttpRequest;
 				bodyAdmin.open("post",SERVER);
 				bodyAdmin.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
 				bodyAdmin.send("function=getTopics");
 				bodyAdmin.onreadystatechange=function(){
 					if(bodyAdmin.readyState==4&&bodyAdmin.status==200){
 						var requestAdmin=JSON.parse(bodyAdmin.responseText);
 						//console.log(requestAdmin);
 						container+="<table class='topics'>";
 						container+="<tr>";
 						container+="<th>Image</th>";
 						container+="<th>Title</th>";
 						container+="<th>Begin Date</th>";	
 						container+="<th>Active</th>";
 						container+="</tr>";

 						for (var i = 0; i < requestAdmin.numTopics; i++) {
 							container+="<tr>";
 							container+="<td><img src='img/"+requestAdmin['img'+i]+"' /></td>";
 							container+="<td>"+requestAdmin['title'+i]+"</td>";
 							container+="<td>"+requestAdmin['beginDate'+i]+"</td>";
 							if (requestAdmin['active'+i]==1) {
 								container+="<td class='actived'>Active</td>";
 							}
 							else{
 								container+="<td class='noActived' onclick='activeTopic("+'"'+requestAdmin['id'+i]+'"'+")'>Activate?</td>";
 							}
 							container+="</tr>";
 						};
 						container+="</table>";
 						document.getElementById('main').innerHTML=container;
 						loadUsersAdmin();
 					}
 				};
 			}
 		}
 	};

 	clearInterval(commentInterval);
 	clearInterval(messagesInterval);
 }

/**
 * Load every users from database to display them, with options like delete, give admin
 */
 function loadUsersAdmin(){
 	var container="";
 	var ajax=new XMLHttpRequest;
 	ajax.open("post",SERVER);
 	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
 	ajax.send("function=loadUsersAdmin");
 	ajax.onreadystatechange=function(){
 		if(ajax.readyState==4&&ajax.status==200){
 			var request=JSON.parse(ajax.responseText);
 			container+="<table class='topics'>";
 			container+="<tr>";
 			container+="<th>Email</th>";
 			container+="<th>Name</th>";
 			container+="<th>Last Names</th>";	
 			container+="<th>Give Admin</th>";
 			container+="<th>Delete</th>";
 			container+="</tr>";
 			for (var i = 0; i < request.numUsers; i++) {
 				container+="<tr>";
 				container+="<td>"+request['email'+i]+"</td>";
 				container+="<td>"+request['nombre'+i]+"</td>";
 				container+="<td>"+request['apellidos'+i]+"</td>";
 				if (request['isAdmin'+i]==1) {
 					container+="<td class='activedad' onclick='removeAdmin("+'"'+request['email'+i]+'"'+")'>Admin</td>";
 				}
 				else{
 					container+="<td class='noActived' onclick='giveAdmin("+'"'+request['email'+i]+'"'+")'>Give admin</td>";
 				}
 				if (request['email'+i]=="admin@admin.com") {
 					container+="<td class='actived'>Admin</td>";
 				}
 				else{
 					container+="<td class='noActived' onclick='deleteUserPannelConfirm("+'"'+request['email'+i]+'"'+")'>Delete</td>";
 				}
 				container+="</tr>";
 			};
 			container+="</table>";
 			container+="<div id='whiteHole'></div>";
 			document.getElementById('main').innerHTML+=container;
 		}
 	};
 }

/**
 * Show a custom confirm alert. By clicking "do it", this function calls to another function
 * for deleting the user selected.
 * @param  {string} email the user to be deleted
 */
 function deleteUserPannelConfirm (email) {
 	var text="Delete "+email+"?";
 	customConfirm (text,"deleteUserPannel('"+email+"')");
 }

/**
 * the function connects to server and command it to delete the user selected from database
 * @param  {string} email the user who is gonna be deleted
 */
 function deleteUserPannel (email) {
 	var ajax=new XMLHttpRequest;
 	ajax.open("post",SERVER);
 	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
 	ajax.send("function=deleteUserPannel&email="+email+"");
 	ajax.onreadystatechange=function(){
 		if(ajax.readyState==4&&ajax.status==200){
 			var request=JSON.parse(ajax.responseText);
 			if (request.warning=="done") {
 				customTemporalWarning("User deleted");
 				timeoutgiveadmin=setTimeout("adminPannel()",2500);
 			}
 			else{
 				customTemporalWarning("Internal error! :(");
 			}
 		}
 	}
 }

/**
 * This function assigns admin privileges to the user selected
 * @param  {string} email user to assign admin privileges
 */
 function giveAdmin (email) {
 	var ajax=new XMLHttpRequest;
 	ajax.open("post",SERVER);
 	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
 	ajax.send("function=giveAdmin&email="+email+"");
 	ajax.onreadystatechange=function(){
 		if(ajax.readyState==4&&ajax.status==200){
 			var request=JSON.parse(ajax.responseText);
 			if (request.warning=="done") {
 				customTemporalWarning("Admin privileges assigned");
 				timeoutgiveadmin=setTimeout("adminPannel()",2500);
 			}
 			else{
 				customTemporalWarning("Internal error! :(");
 			}
 		}
 	}
 }

/**
 * Remove admin privileges to the sent user.
 * @param  {string} email the user who is going to be admin
 */
 function removeAdmin (email) {
 	var ajax=new XMLHttpRequest;
 	ajax.open("post",SERVER);
 	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
 	ajax.send("function=removeAdmin&email="+email+"");
 	ajax.onreadystatechange=function(){
 		if(ajax.readyState==4&&ajax.status==200){
 			var request=JSON.parse(ajax.responseText);
 			if (request.warning=="done") {
 				customTemporalWarning("Admin privileges removed");
 				timeoutgiveadmin=setTimeout("adminPannel()",2500);
 			}
 			else{
 				customTemporalWarning("Internal error! :(");
 			}
 		}
 	}
 }

/**
 * function to activate a topic which is not currently active. 
 * @param  {int} id the id of topic to active
 */
 function activeTopic (id) {
 	var ajax=new XMLHttpRequest;
 	ajax.open("post",SERVER);
 	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
 	ajax.send("function=activeTopic&id="+id+"");
 	ajax.onreadystatechange=function(){
 		if(ajax.readyState==4&&ajax.status==200){
 			var request=JSON.parse(ajax.responseText);
 			if (request.warning=="done") {
 				customTemporalWarning("Topic activated");
 				timeoutgiveadmin=setTimeout("adminPannel()",2500);
 			}
 			else{
 				customTemporalWarning("Internal error! :(");
 			}
 		}
 	}

 }

/**
 * Function to show an alert that says Friend's methods are coming to Share Us.
 */
function loadFriendsPage(){
	customTemporalWarning("Coming soon!");
}



