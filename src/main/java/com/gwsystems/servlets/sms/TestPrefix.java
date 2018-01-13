package com.gwsystems.servlets.sms;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.gwsystems.servlets.HeraUtils;

/**
 * Servlet implementation class TestPrefix
 */
public class TestPrefix extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public TestPrefix() {
        super();
    }
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HeraUtils.login( request, response );
		
		String DestAddr = "";
		
		String cat = request.getParameter("SMSTesztCategory");
		String SrcAddr = "06304215231";
		String ServiceID = "GWTestSystem";
		String data = request.getParameter( "SMSTesztPrefix" ) + " " + request.getParameter("text");
		
		if ( "0".equals( cat ) ) {
			DestAddr = "0691334140";
		} else if ( "1".equals(cat) ) {
			DestAddr = "0690336140";
		} else if ( "2".equals( cat ) ) {
			DestAddr = "0690338140";
		} else {
			DestAddr = "0690619940";
		}
		
		String connectURL = String.format( "http://api.gw-systems.com/sreceive.jsp?SrcAddr=%s&DestAddr=%s&ServiceID=%s&data=%s", SrcAddr, DestAddr, ServiceID, data );
		
		URLConnection connection = new URL( connectURL ).openConnection();
		connection.connect();
		
		BufferedReader in = new BufferedReader( new InputStreamReader( connection.getInputStream() ) );
		String returnString = in.readLine();
		if ( returnString.length() > 160 ) {
			returnString = returnString.substring( 0, 160 );
		}
		
		response.getOutputStream().println( returnString );
	}

}
