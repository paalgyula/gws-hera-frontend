<%@ page contentType="text/html; charset=UTF-8" %><!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>GW-Systems Admin Panel</title>
	<link rel="stylesheet" href="resources/css/loading.css" />
</head>
<body>

<div id="loading-mask" style=""></div> 
<div id="loading"> 
	<div class="loading-indicator">
    	<img src="images/waitanim.gif" width="90" height="65" style="vertical-align:top;"/><br />
   	  	GW-Systems Admin Panel<br/>
    	<a href="http://www.gw-systems.com">www.gw-systems.com</a><br />
    	<span id="loading-msg">Loading styles and images...</span>
  </div> 
</div>
	<link rel="stylesheet" type="text/css" href="resources/css/ext-all.css"/>
    <link rel="stylesheet" type="text/css" href="resources/css/xtheme-gray.css"/>
	<link rel="stylesheet" type="text/css" href="resources/css/gw-gray-theme.css">
    <script type="text/javascript" src="js/modules/imagePreloader.js"></script>    
    <script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading Javascript Core API...';</script> 
    <script type="text/javascript" src="js/ext-base.js"></script> 
    <script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading UI Components...';</script> 
    <script type="text/javascript" src="js/ext-all.js"></script> 
    <script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading Languages...';</script>
    <script type="text/javascript" src="js/lang/hu.js"></script>
    <script type="text/javascript" src="js/lang/ext-lang-hu.js"></script>
    <script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Initializing...';</script> 
    <script type="text/javascript" src="js/modules/domainreg.js"></script>
    <script type="text/javascript" src="js/modules/mailboxes.js"></script>
    <script type="text/javascript" src="js/modules/chatbox.js"></script>
    <script type="text/javascript" src="js/modules/dnsmanager.js"></script>
    <script type="text/javascript" src="js/modules/smsmanager.js"></script>
    <script type="text/javascript" src="js/modules/loanbalance.js"></script>
    <script type="text/javascript" src="js/modules/console.js"></script>
    <script type="text/javascript" src="js/static/domains.js"></script>
    <script type="text/javascript" src="js/utils/gwutils.js"></script>
    
    <div id="head">
    	<div id="head_logo"></div>
    </div>
    <div id="content-bg"></div>    

    <div id="foot">
    	<!-- <div id="foot_info_container"></div> -->
    </div>
	<!-- removing loader mask -->
	<script type="text/javascript" src="js/init.js"></script>
</body>
</html>
