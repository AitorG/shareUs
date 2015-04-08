<?php  

$conMessages=mysqli_connect('localhost','root','','shareUs');

function insertMessage($userFrom,$userTo,$body)
{
	global $conMessages;
	$json=array();
	$searchUser=mysqli_query($conMessages, "select email from users where email='$userTo'");
	if(mysqli_num_rows($searchUser)==1){
		if($userFrom==$userTo){
			$json['warning']="Do not send messages to yourself!";
		}
		else{
			mysqli_query($conMessages, "insert into messages values(default,'$userFrom','$userTo',now(),'$body')");
			$json['warning']="done";
		}

	}
	else{
		$json['warning']="Oups! user not found in ShareUs";
	}
	echo json_encode($json);
}

function getMessages($user,$order="date",$req="inbox")
{
	global $conMessages;
	$json=array();
	if ($req=="sent") {
		if($order=="Email"){
			$messages=mysqli_query($conMessages, "select * from messages where userFrom='$user' order by userFrom ASC,date DESC");
		}
		else{
			$messages=mysqli_query($conMessages, "select * from messages where userFrom='$user' order by date DESC");
		}
		$cont=0;
		while($data=mysqli_fetch_array($messages)){
			$result2=mysqli_query($conMessages,"select * from users where email='".$data['userTo']."'");
			$nombreUser=mysqli_fetch_array($result2);
			$json['fromName'.$cont]=$nombreUser['nombre']." ".$nombreUser['apellidos'];
			$json['from'.$cont]=$data['userTo'];
			$json['date'.$cont]=$data['date'];
			$json['body'.$cont]=$data['body'];
			$json['id'.$cont]=$data['id'];
			$cont++;
		}
		$json['numMessages']=$cont;
	}
	else{
		if($order=="Email"){
			$messages=mysqli_query($conMessages, "select * from messages where userTo='$user' order by userFrom ASC,date DESC");
		}
		else{
			$messages=mysqli_query($conMessages, "select * from messages where userTo='$user' order by date DESC");
		}
		$cont=0;
		while($data=mysqli_fetch_array($messages)){
			$result2=mysqli_query($conMessages,"select * from users where email='".$data['userFrom']."'");
			$nombreUser=mysqli_fetch_array($result2);
			$json['fromName'.$cont]=$nombreUser['nombre']." ".$nombreUser['apellidos'];
			$json['from'.$cont]=$data['userFrom'];
			$json['date'.$cont]=$data['date'];
			$json['body'.$cont]=$data['body'];
			$json['id'.$cont]=$data['id'];
			$cont++;
		}
		$json['numMessages']=$cont;
	}
	echo json_encode($json);

}

function deleteMessage($id)
{
	global $conMessages;
	$json=array();
	$result=mysqli_query($conMessages, "select * from messages where id=$id");
	if(mysqli_num_rows($result)==1){
		$result2=mysqli_query($conMessages, "delete from messages where id=$id");
		$json['warning']="done";
	}
	else{
		$json['warning']="failed";
	}
	echo json_encode($json);
}




?>