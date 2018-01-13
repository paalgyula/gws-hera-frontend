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

import com.gwsystems.misc.ConfigReader;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;

/**
 * Servlet implementation class LoanHistory
 */
public class LoanHistory extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public LoanHistory() {
		super();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setCharacterEncoding( "utf-8" );
		String session_str = HeraUtils.login(request, response);

		Service service = new Service();
		Call call = null;
		try {
			call = (Call) service.createCall();
		} catch (ServiceException e) {
			throw new ServletException("ServiceException in PrefixList servlet (1) - " + e.getMessage());
		}
		
		call.setTargetEndpointAddress(ConfigReader.read("loanbalance_wsdl"));
		call.setOperationName(new QName("http://api.gw-systems.com/LoanBalance", "getHistory"));
		String XMLString = (String) call.invoke(new Object[] { session_str });

		try {
			response.getWriter().println( new JSONObject().put("success", true).put( "row", XML.toJSONObject(XMLString).getJSONObject("results").get("row") ) );
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}

}
