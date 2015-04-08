<?php  

$con=mysqli_connect('localhost','root','','shareUs');

function checkLogin($user, $pass){
	global $con;
	$result=mysqli_query($con,"select * from users where email='$user' and password='$pass'");
	$json=array();
	if (mysqli_num_rows($result)>0) {
		$json['warning']='found';
		$_SESSION['user']=$user;
	}
	else{
		$json['warning']='not found';
	}
	echo json_encode($json);

}

function signIn($user, $lastName, $email, $passwd){
	global $con;
	$json=array();
	$result=mysqli_query($con, "select * from users where email='$email'");
	if(mysqli_num_rows($result)>0){
		$json['warning']='email';
	}
	else{
		mysqli_query($con, "insert into users values ('$email','$user','$lastName','$passwd',default)");
		$json['warning']='done';
		$_SESSION['user']=$email;
	}

	echo json_encode($json);
}

function checkSession(){
	$logged=array();
	if(isset($_SESSION['user'])){
		$logged['warning']="logged";
	}
	else{
		$logged['warning']="notLogged";
	}
	echo json_encode($logged);
}

function getUserName(){
	$userJson=array();
	global $con;
	if(isset($_SESSION['user'])){
		$result=mysqli_query($con, "select * from users where email='".$_SESSION['user']."'");
		$datos=mysqli_fetch_row($result);
		$userJson['userName']=$datos[1]." ".$datos[2];
		
	}
	else{
		$userJson['userName']="notFound";
	}
	echo json_encode($userJson);
}

function getUserFields($user)
{
	global $con;
	$json=array();
	$result=mysqli_query($con, "select * from users where email='$user'");
	if(mysqli_num_rows($result)>0){
		$datos=mysqli_fetch_array($result);
		$json['email']=$datos['email'];
		$json['name']=$datos['nombre'];
		$json['lastNames']=$datos['apellidos'];
		$json['warning']="done";
	}
	else{
		$json['warning']="failed";
	}
	echo json_encode($json);

}

function updateProfile($user,$name,$lastNames)
{	
	global $con;
	$json=array();
	$result=mysqli_query($con, "select * from users where email='$user'");
	if(mysqli_num_rows($result)>0){
		mysqli_query($con, "update users set nombre='$name', apellidos='$lastNames' where email='$user'");
		$json['warning']="done";
	}
	else{
		$json['warning']="failed";
	}
	echo json_encode($json);
}

function loadUsersAdmin()
{
	global $con;
	$json=array();
	$result=mysqli_query($con, "select * from users");
	$cont=0;
	while($data=mysqli_fetch_array($result)){
		$json['email'.$cont]=$data['email'];
		$json['nombre'.$cont]=$data['nombre'];
		$json['apellidos'.$cont]=$data['apellidos'];
		$json['isAdmin'.$cont]=$data['isAdmin'];
		$cont++;
	}
	$json['numUsers']=$cont;
	echo json_encode($json);
}

function isAdmin($user){
	global $con;
	$json=array();
	$result=mysqli_query($con, "select * from users where email='$user' and isAdmin=1");
	if (mysqli_num_rows($result)>0) {
		$json['warning']="yes";
	}
	else{
		$json['warning']="no";
	}
	echo json_encode($json);
}

function giveAdmin($email)
{
	global $con;
	$json=array();
	$result=mysqli_query($con, "select * from users where email='$email' and isAdmin=0");
	if (mysqli_num_rows($result)>0) {
		mysqli_query($con, "update users set isAdmin=1 where email='$email'");
		$json['warning']="done";
	}
	else{
		$json['warning']="error";
	}
	echo json_encode($json);
}

function removeAdmin($email)
{
	global $con;
	$json=array();
	$result=mysqli_query($con, "select * from users where email='$email' and isAdmin=1");
	if (mysqli_num_rows($result)>0) {
		mysqli_query($con, "update users set isAdmin=0 where email='$email'");
		$json['warning']="done";
	}
	else{
		$json['warning']="error";
	}
	echo json_encode($json);
}

function deleteUserPannel($email)
{
	global $con;
	$json=array();
	$result=mysqli_query($con, "select * from users where email='$email'");
	if (mysqli_num_rows($result)>0) {
		mysqli_query($con, "delete from users where email='$email'");
		$json['warning']="done";
	}
	else{
		$json['warning']="error";
	}
	echo json_encode($json);
}

function leaveShareUs()
{
	session_destroy();
}

?>

