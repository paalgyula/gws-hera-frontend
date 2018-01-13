package com.gwsystems.servlets.sms;

import java.io.IOException;
import java.net.URLDecoder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.namespace.QName;
import javax.xml.rpc.ServiceException;

import org.apache.axis.client.Call;
import org.apache.axis.client.Service;
import org.json.XML;

import com.gwsystems.misc.ConfigReader;
import com.gwsystems.servlets.HeraUtils;

/**
 * Servlet implementation class SimpleSMSList
 */
public class SimpleSMSList extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String session_str = HeraUtils.login(request, response);
		
		int limit = 0;
		int from = 0;
		
		try {
			limit = Integer.parseInt( (String) request.getParameter( "limit" ) );
		} catch(Exception e) {
			limit = 200;
		}
		
		try {
			from = Integer.parseInt( (String) request.getParameter( "start" ) );
		} catch (Exception e) {
			from = 0;
		}
		
				
		if ( from < 0 )
			from = 0;
		if ( limit < 200 )
			limit = 25;
		if ( limit > 400 )
			limit = 400;
		
		Service service = new Service();
		Call call = null;
		try {
			call = (Call) service.createCall();
		} catch (ServiceException e) {
			throw new ServletException("ServiceException in CheckDomain servlet (1) - " + e.getMessage() );
		}
		call.setTargetEndpointAddress( ConfigReader.read("smsmanager_wsdl") );
		call.setOperationName(new QName( "http://api.gw-systems.com/SMSManager", "getSMSList") );
		String XMLString = (String) call.invoke( new Object[]{ session_str, from, limit } );
		
		try {
			response.getWriter().println( URLDecoder.decode( XML.toJSONObject( XMLString ).get( "results" ).toString(), "UTF-8" ) );
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
