<?php
	ini_set( 'soap.wsdl_cache_enabled', '0' );
    error_reporting( 0 );
    
    session_start();
	include( "../../includes/config.php" );
	$SMSManagerWSDL = new SoapClient( $config['smsmanager_wsdl'] );
	
    $username = $_SESSION['username'];
    $password = $_SESSION['password']; 
    
    $session = $SMSManagerWSDL->login( $username, $password );
    
    $prefix = isset( $_POST['editprefixcombo'] ) ? $_POST['editprefixcombo'] : '';
    $answerurl = isset( $_POST['answerurl'] ) ? $_POST['answerurl'] : '';
    $answertext = isset( $_POST['answertext'] ) ? $_POST['answertext'] : '';
    
    try {
    	$Result = $SMSManagerWSDL->editPrefix( $session, $prefix, $answertext, $answerurl );
    	if ( $Result ) {
    		echo json_encode( array( "success" => true ) );
    	} else {
    		echo json_encode( array( "success" => false ) );
    	}
    } catch ( Exception $SoapFault ) {
    	echo json_encode( array( "success" => false, "errorString" => $SoapFault->faultstring ) );
    }
    
?>