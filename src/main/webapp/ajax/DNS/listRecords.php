<?php
	
	ini_set("soap.wsdl_cache_enabled", "0");
    error_reporting( E_ALL );
    
    session_start();
	include( "../../includes/config.php" );
	$DNSManager = new SoapClient( $config['dnsmanager_wsdl'] );
	
    $username = $_SESSION['username'];
    $password = $_SESSION['password'];

    $session = $DNSManager->login( $username, $password );
    $LTDXML = $DNSManager->listRecords( $session, $_POST['domain'] );
    
    $XML = simplexml_load_string( $LTDXML );
    echo json_encode( $XML );
    
?>