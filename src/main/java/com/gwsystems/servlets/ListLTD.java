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
import org.json.XML;

import com.gwsystems.misc.ConfigReader;

/**
 * Servlet implementation class ListLTD
 */
public class ListLTD extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ListLTD() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String session_str = HeraUtils.login( request, response );
		Service service = new Service();
		Call call = null;
		String XMLstr = null;

		try {
			call = (Call) service.createCall();
			call.setTargetEndpointAddress( ConfigReader.read( "domainmanager_wsdl" ) );
			call.setOperationName( new QName( "http://api.gw-systems.com/DomainManager", "listLTD" ) );
			XMLstr = (String) call.invoke( new Object[]{ session_str } );
		} catch (ServiceException e1) {
			throw new ServletException( "ServiceException in ListLTD servlet (1)" );
		}
		
		try {
			response.getWriter().println( XML.toJSONObject( XMLstr ).get( "results" ) );
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}
}
