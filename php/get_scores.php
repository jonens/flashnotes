<?php
	include('../../../../*/*.php');
	$con = mysql_connect("localhost", $___, $___);
	@mysql_select_db($___) or die( "Unable to select database");
	$score_pattern = '/\d+/';
	$time_pattern = '/\d+/';
	$date_string_pattern = '/(\d+-){2}\d{4}/';
	$time_string_pattern = '/(\d+:){2}\d{2}/';
	$score = htmlspecialchars(stripslashes($_POST['score']));	
	$time = htmlspecialchars(stripslashes($_POST['time']));
	$date_string = htmlspecialchars(stripslashes($_POST['date_string']));
	$time_string = htmlspecialchars(stripslashes($_POST['time_string']));
	preg_match($score_pattern, $score, $score_match);
	preg_match($time_pattern, $time, $time_match);
	preg_match($date_string_pattern, $date_string, $date_string_match);
	preg_match($time_string_pattern, $time_string, $time_string_match);
	$score = (int)$score_match[0];
	$time = $time_match[0];
	$date_string = $date_string_match[0];
	$time_string = $time_string_match[0];
	$query = "INSERT INTO ___ VALUES('','$score','$time','$date_string','$time_string')";
	$result = mysql_query($query, $con);
	$query = "SELECT score,time,date_string,time_string FROM ___ ORDER BY score DESC";
	$result = mysql_query($query, $con);
	$num_rows = mysql_num_rows($result);
	$length = ($num_rows >= 10) ? 10 : $num_rows;
	$max_scores = 10;
	header("Content-type: text/xml");
	echo "<?xml version='1.0' encoding='ISO-8859-1'?>";
	echo "<scores>";
	for ($i = 0; $i < $length; $i++){
		$score = mysql_result($result, $i, 'score');
		$time = mysql_result($result, $i, 'time');		
		$date_string = mysql_result($result, $i, 'date_string');
		$time_string = mysql_result($result, $i, 'time_string');
		echo "<score>".$score."</score>";
		echo "<time>".$time."</time>";
		echo "<date_string>".$date_string."</date_string>";
		echo "<time_string>".$time_string."</time_string>";
	}
	while (($max_scores - $length) > 0){
		echo "<score>0</score>";
		echo "<time>0</time>";
		echo "<date_string>0</date_string>";
		echo "<time_string>0</time_string>";
		$length += 1;
	}
	echo "</scores>";
	mysql_close($con);
?>