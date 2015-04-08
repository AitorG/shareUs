<?php  
session_start();

include("login.php");
include("topic.php");
include("comments.php");
include("messages.php");


$function=$_REQUEST['function'];

switch($function){
	case 'login': 	$user=$_REQUEST['mail'];
					$pass=$_REQUEST['passwd'];
					checkLogin($user,$pass);
	break;
	
	case 'signIn': 	$user=$_REQUEST['RegUser'];
					$lastName=htmlentities($_REQUEST['RegLastNames'],ENT_QUOTES);
					$pass=$_REQUEST['RegPasswd'];
					$mail=$_REQUEST['RegMail'];
					signIn($user,$lastName,$mail,$pass);
	break;

	case 'checkSession': checkSession();
	break;

	case 'selectTopic': selectTopic();
	break;

	case 'getUserName': getUserName();
	break;

	case 'shareIt': $textShare=htmlentities($_REQUEST['textShare'],ENT_QUOTES);
					$textShare=nl2br($textShare);
					$user=$_SESSION['user'];
					$idTopic=selectIdTopic();
					shareIt($textShare,$user,$idTopic);
	break;

	case 'loadComments': $idTopic=selectIdTopic();
						 $user=$_SESSION['user'];
	 					 getComments($idTopic,$user);
	break;
	
	case 'leaveShareUs': leaveShareUs();
	break;

	case 'deleteComment': $id=$_REQUEST['id'];
						  deleteComment($id);
	break;

	case 'sendMessage': $userTo=$_REQUEST['mail'];
						$userFrom=$_SESSION['user'];
						$body=htmlentities($_REQUEST['body'],ENT_QUOTES);
						$body=nl2br($body);
						insertMessage($userFrom,$userTo,$body);
	break;

	case 'getMessages': $user=$_SESSION['user'];
						$order=$_REQUEST['order'];
						$req=$_REQUEST['load'];
						getMessages($user,$order,$req);
	break;

	case 'deleteMessage': $id=$_REQUEST['id'];
						  deleteMessage($id);
	break;

	case 'getUserFields': $user=$_SESSION['user'];
						  getUserFields($user);
	break;

	case 'applyChangesProfile': $user=$_SESSION['user'];
							    $name=htmlentities($_REQUEST['profilename'],ENT_QUOTES);
							    $lastNames=htmlentities($_REQUEST['profilelastNames'],ENT_QUOTES);
							    updateProfile($user,$name,$lastNames);
	break;

	case 'isAdmin': $user=$_SESSION['user'];
					isAdmin($user);
	break;

	case 'getTopics': getTopics();
	break;

	case 'activeTopic': $id=$_REQUEST['id'];
						activeTopic($id);
	break;

	case 'loadUsersAdmin': loadUsersAdmin();
	break;

	case 'giveAdmin': $email=$_REQUEST['email'];
					  giveAdmin($email);
	break;

	case 'removeAdmin': $email=$_REQUEST['email'];
					 	removeAdmin($email);
	break;

	case 'deleteUserPannel': $email=$_REQUEST['email'];
					  		 deleteUserPannel($email);
	break;

}





?>