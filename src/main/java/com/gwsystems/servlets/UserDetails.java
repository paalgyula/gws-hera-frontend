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
import org.json.XML;

import com.gwsystems.misc.ConfigReader;

/**
 * Servlet implementation class UserDetails
 */
public class UserDetails extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public UserDetails() {
		super();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		String session_str = HeraUtils.login(request, response);;
		String XMLstr = null;
		
		Service service = new Service();
		Call call = null;
		try {
			call = (Call) service.createCall();
		} catch (ServiceException e) {
			throw new ServletException("ServiceException in UserDetails servlet (1) - " + e.getMessage() );
		}
		call.setTargetEndpointAddress( ConfigReader.read("loanbalance_wsdl") );
		call.setOperationName(new QName( "http://api.gw-systems.com/LoanBalance", "getLoan") );
		int loan = (Integer) call.invoke( new Object[]{ session_str } );
		
		try {
			call = (Call) service.createCall();
			call.setTargetEndpointAddress( ConfigReader.read( "permissionhandler_wsdl" ) );
			call.setOperationName( new QName( "http://api.gw-systems.com/PermissionHandler", "getModules" ) );
			XMLstr = (String) call.invoke( new Object[]{ session_str } );
		} catch (ServiceException e1) {
			throw new ServletException( "ServiceException in UserDetails servlet (2)" );
		}
		
		try {
			JSONObject obj = new JSONObject();
			obj.put( "username", (String)request.getSession().getAttribute( "username" ) );
			obj.put( "loan", loan );
			obj.put( "permissions", XML.toJSONObject( XMLstr ).get( "results" ) );
			response.getWriter().println( obj.toString() );
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
	}
}
