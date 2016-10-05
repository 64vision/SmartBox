<?php
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "issp";
$dbtable = "off_media_logs";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
$res = array();
$res['status'] = 0;
$res['remark'] = "OPS";
if(isset($_POST['media_id'])) {
	$media_id =$_POST['media_id'];
	$campaign_id =$_POST['campaign_id']; 
	$publisher_id =$_POST['publisher_id']; 
	$screen_id =$_POST['screen_id'];

	$sql = "INSERT INTO off_media_logs (media_id, campaign_id, publisher_id, screen_id)
	VALUES ('$media_id', '$campaign_id', '$publisher_id', '$screen_id')";

	if ($conn->query($sql) === TRUE) {
	   $res['status'] = 1;
	    $res['remark'] = "Success!";
	} else {
	    //echo "Error: " . $sql . "<br>" . $conn->error;
	     $res['remark'] =  $conn->error;
	}
}

echo json_encode($res);
$conn->close();
?>
