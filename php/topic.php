<?php  
	
	$conTopics=mysqli_connect('localhost','root','','shareUs');

	function selectTopic(){
		global $conTopics;
		$json=array();
		$result=mysqli_query($conTopics, "select * from topics where active=1");
		$data=mysqli_fetch_array($result);
			$json['title']=$data['title'];
			$json['body']=$data['body'];
			$json['img']=$data['img'];
			$json['active']=$data['active'];
			$json['beginDate']=$data['beginDate'];
		
		
		echo json_encode($json);
	}

	function selectIdTopic()
	{
		global $conTopics;
		$result=mysqli_query($conTopics, "select * from topics where active=1");
		$data=mysqli_fetch_array($result);
		return $data['id'];
	}

	function getTopics()
	{
		global $conTopics;
		$json=array();
		$result=mysqli_query($conTopics, "select * from topics order by beginDate DESC");
		$cont=0;
		while($data=mysqli_fetch_array($result)){
			$json['id'.$cont]=$data['id'];
			$json['title'.$cont]=$data['title'];
			$json['img'.$cont]=$data['img'];
			$json['beginDate'.$cont]=$data['beginDate'];
			$json['active'.$cont]=$data['active'];
			$cont++;
		}
		$json['numTopics']=$cont;
		echo json_encode($json);
	}

	function activeTopic($id)
	{
		global $conTopics;
		$json=array();
		$result=mysqli_query($conTopics, "select id from topics where id=$id");
		$old=mysqli_query($conTopics, "select id from topics where active=1");
		$date=mysqli_fetch_array($old);
		$old=$date['id'];
		if (mysqli_num_rows($result)>0) {
			mysqli_query($conTopics, "update topics set active=1 where id=$id");
			mysqli_query($conTopics, "update topics set active=0 where id=$old");
			$json['warning']="done";
		}
		else{
			$json['warning']="failed";
		}
		echo json_encode($json);
	}

?>