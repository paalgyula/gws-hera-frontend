<?php
	ini_set( 'soap.wsdl_cache_enabled', '0' );
    error_reporting( 0 );
    
    session_start();
	include( "../../includes/config.php" );
	$SMSManagerWSDL = new SoapClient( $config['smsmanager_wsdl'] );
	
    $username = $_SESSION['username'];
    $password = $_SESSION['password']; 
    
    $session = $SMSManagerWSDL->login( $username, $password );
    
    $prefix = isset( $_POST['prefix'] ) ? $_POST['prefix'] : '';
    
    try {
    	$Result = $SMSManagerWSDL->dropPrefix( $session, $prefix );
    	if ( $Result ) {
    		echo json_encode( array( "success" => true ) );
    	} else {
    		echo json_encode( array( "success" => false ) );
    	}
    } catch ( Exception $SoapFault ) {
    	header('HTTP/1.1 500 Internal Server Error');
    	echo json_encode( array( "success" => false, "errorString" => $SoapFault->faultstring ) );
    }
    
?>