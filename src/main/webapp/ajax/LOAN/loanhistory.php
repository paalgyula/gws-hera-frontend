<?php

	session_start();
	include( "../../includes/config.php" );
	$LoanBalanceWSDL = new SoapClient( $config['loanbalance_wsdl'] );
	
	$username = $_SESSION['username'];
	$password = $_SESSION['password'];
	
	try {
		$session = $LoanBalanceWSDL->login( $username, $password );
		$LTDXML = $LoanBalanceWSDL->getHistory( $session );
		 
		$XML = simplexml_load_string( $LTDXML );

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
	} catch ( Exception $SoapFault ) {
		echo json_encode( array( "success" => false, "errorString" => $SoapFault->faultstring ) );
	}
?>