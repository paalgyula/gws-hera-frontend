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
    	$XML = $SMSManagerWSDL->getSMSListFromPrefix( $session, $prefix );
    	$XML = simplexml_load_string( $XML );
    	
    	//$XML = simplexml_load_string( $LTDXML );

		$rows = array();
		
		foreach( $XML as $row ) {
			$params = array();
			$row = get_object_vars( $row );
			foreach( $row as $module => $value ) {
				$params[$module] = $value;
			}
			array_push( $rows, $params );
		}
    	
		echo json_encode( array( "success" => true, "row" => $rows ) );
    	//echo json_encode( $XML );
    } catch ( Exception $SoapFault ) {
    	echo json_encode( array( "success" => false, "errorString" => $SoapFault->faultstring ) );
    }
    
?>