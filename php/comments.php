<?php 

	$conComments=mysqli_connect('localhost','root','','shareUs');

	function shareIt($textShare,$user,$idTopic)
	{
		global $conComments;
		$json=array();
		if(mysqli_query($conComments, "insert into comments values(default,'$user',$idTopic,now(),'$textShare','none');")){
			$json['warning']='ok';
		}
		else{
			$json['warning']='failed';
		}
		echo json_encode($json);
	}

	function getComments($idTopic,$user)
	{
		global $conComments;
		$result=mysqli_query($conComments, "select * from comments where idTopic='$idTopic' order by date DESC");
		$json=array();
		$cont=0;
		while ($data=mysqli_fetch_array($result)) {
			$json['id'.$cont]=$data['id'];
			$json['userMail'.$cont]=$data['userMail'];
			$result2=mysqli_query($conComments,"select * from users where email='".$data['userMail']."'");
			$nombreUser=mysqli_fetch_array($result2);
			$json['userName'.$cont]=$nombreUser['nombre']." ".$nombreUser['apellidos'];
			$json['date'.$cont]=$data['date'];
			$json['comment'.$cont]=$data['comment'];
			if($user == $data['userMail']){
				$json['isMine'.$cont]="yes";
			}
			else{
				$json['isMine'.$cont]="nope";
			}
			$cont++;
			$json['numComments']=$cont;
		}
		echo json_encode($json);
	}

	function deleteComment($id){
		global $conComments;
		$json=array();
		$result=mysqli_query($conComments, "select * from comments where id=$id");
		if(mysqli_num_rows($result)==1){
			$result2=mysqli_query($conComments, "delete from comments where id=$id");
			$json['warning']="done";
		}
		else{
			$json['warning']="failed";
		}
		echo json_encode($json);
	}



?>