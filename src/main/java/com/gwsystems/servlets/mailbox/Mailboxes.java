package com.gwsystems.servlets.mailbox;

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
import com.gwsystems.servlets.HeraUtils;

/**
 * Servlet implementation class Mailboxes
 */
public class Mailboxes extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Mailboxes() {
        super();
    }

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String session_str = HeraUtils.login(request, response);
		
		Service service = new Service();
		Call call = null;
		try {
			call = (Call) service.createCall();
		} catch (ServiceException e) {
			throw new ServletException("ServiceException in CheckDomain servlet (1) - " + e.getMessage() );
		}
		call.setTargetEndpointAddress( ConfigReader.read("mailbox_wsdl") );
		call.setOperationName(new QName( "http://api.gw-systems.com/MailBox", "listMailboxes") );
		String XMLstr = (String) call.invoke( new Object[]{ session_str } );
		
		try {
			response.getWriter().println( XML.toJSONObject( XMLstr ).getJSONObject( "results" ) );
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}

}
