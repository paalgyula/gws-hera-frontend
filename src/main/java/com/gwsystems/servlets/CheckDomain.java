package com.gwsystems.servlets;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.namespace.QName;
import javax.xml.rpc.ServiceException;

import org.apache.axis.client.Call;
import org.apache.axis.client.Service;
import org.json.JSONException;
import org.json.JSONObject;

import com.gwsystems.misc.ConfigReader;

/**
 * Servlet implementation class CheckDomain
 */
public class CheckDomain extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String session_str = HeraUtils.login(request, response);
		
		Service service = new Service();
		Call call = null;
		try {
			call = (Call) service.createCall();
		} catch (ServiceException e) {
			throw new ServletException("ServiceException in CheckDomain servlet (1) - " + e.getMessage() );
		}
		call.setTargetEndpointAddress( ConfigReader.read("domainmanager_wsdl") );
		call.setOperationName(new QName( "http://api.gw-systems.com/DomainManager", "checkDomain") );
		boolean used = (Boolean) call.invoke( new Object[]{ session_str, request.getParameter( "domain" ), request.getParameter( "ltd" ).replace( ".", "") } );
		
		try {
			if ( used ) {
				response.getWriter().println( new JSONObject().put( "success", true ) );
			} else {
				response.getWriter().println( new JSONObject().put( "success", false ) );
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}

	}
}
