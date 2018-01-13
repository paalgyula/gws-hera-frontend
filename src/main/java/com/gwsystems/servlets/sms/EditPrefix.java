package com.gwsystems.servlets.sms;

import java.io.IOException;
import java.rmi.RemoteException;

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
import com.gwsystems.servlets.HeraUtils;

/**
 * Servlet implementation class EditPrefix
 */
public class EditPrefix extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public EditPrefix() {
		super();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String session_str = HeraUtils.login(request, response);

		Service service = new Service();
		Call call = null;
		try {
			call = (Call) service.createCall();
		} catch (ServiceException e) {
			throw new ServletException(	"ServiceException in CheckDomain servlet (1) - " + e.getMessage());
		}
		
		call.setTargetEndpointAddress( ConfigReader.read("smsmanager_wsdl") );
		call.setOperationName(new QName( "http://api.gw-systems.com/SMSManager", "editPrefix") );
		try {
			boolean success = (Boolean) call.invoke(new Object[] { session_str,
					request.getParameter("editprefixcombo"),
					request.getParameter("answertext"),
					request.getParameter("answerurl") });
			try {
				response.getOutputStream().println( new JSONObject().put( "success" , success ).toString() );
			} catch (JSONException e) {
				e.printStackTrace();
			}
		} catch (RemoteException e) {
			try {
				response.getOutputStream().println( new JSONObject().put( "success" , false ).put( "errorString", e.getMessage() ).toString() );
			} catch (JSONException e2) {
				e2.printStackTrace();
			}
		}
	}

}
