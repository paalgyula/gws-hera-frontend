<?php
	error_reporting( 0 );
	$text = $_POST['text'];
	$category = (int)$_POST['category'];
	$cat = array( '0691334140', '0690336140', '0690338140', '0690619940' );
	$text = str_replace( " ", "%20", $text );
	$text = str_replace( "&", "%26", $text );
	$responseText = file_get_contents( sprintf('http://api.gw-systems.com/sreceiver.jsp?data=%s&DestAddr=%s&SrcAddr=%s&ServiceID=test1234', $text, $cat[$category], "06301234567" ) );
	echo json_encode( array( "success" => true, "responseText" => $responseText ) );
?>