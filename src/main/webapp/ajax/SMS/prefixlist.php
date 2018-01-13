<?php
	ini_set("soap.wsdl_cache_enabled", "0");
	ini_set( "display_errors", 0 );
    error_reporting( 0 );
    
    session_start();
	include( "../../includes/config.php" );
	$SMSManagerWSDL = new SoapClient( $config['smsmanager_wsdl'] );
	
    $username = $_SESSION['username'];
    $password = $_SESSION['password'];

    try {
    	$session = $SMSManagerWSDL->login( $username, $password );
    	$LTDXML = $SMSManagerWSDL->getPrefixList( $session );
    	
    	$XML = simplexml_load_string( $LTDXML );
    	echo json_encode( $XML );
    } catch ( Exception $SoapFault ) {
		echo json_encode( array( "success" => false, "errorString" => $SoapFault->faultstring ) );
	}
?>