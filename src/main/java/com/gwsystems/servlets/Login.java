package com.gwsystems.servlets;

import java.io.IOException;
import java.io.Writer;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.xml.namespace.QName;
import javax.xml.rpc.ServiceException;

import nl.captcha.Captcha;

import org.apache.axis.client.Call;
import org.apache.axis.client.Service;
import org.apache.log4j.Logger;

import com.gwsystems.misc.ConfigReader;
import org.json.JSONObject;

/**
 * Servlet implementation class Login
 */
@WebServlet(urlPatterns = "/ajax/login.do")
public class Login extends HttpServlet {
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		Captcha cap = null;
	    Writer out = response.getWriter();
		
		HttpSession session = request.getSession();
		
	  	try {
			cap = (Captcha) session.getAttribute( "gwscapsess" );
	  	} catch (NullPointerException e) {
	  		Map<String, Object> result = new HashMap<String, Object>();
	        result.put( "success", false );
	        result.put( "message", "Captcha hiba!" );
	        
	        JSONObject jsonObj = new JSONObject( result );
	        out.write( jsonObj.toString() );
	        Logger.getLogger( this.getClass() ).error( "Capthca hiba: " + e.getMessage() );
	        return;
	  	}
	    
	    if( cap.isCorrect( request.getParameter( "captcha" ) ) ) {
	    	
	    	String endpoint = ConfigReader.read( "mailbox_wsdl" );
	    	Service service = new Service();
	    	Call call = null;
			try {
				call = (Call) service.createCall();
			} catch (ServiceException e) {
				e.printStackTrace();
				return;
			}
	    	
			call.setTargetEndpointAddress( new java.net.URL(endpoint) );
	    	call.setOperationName(new QName("http://api.gw-systems.com/MailBox", "login") );
	    	Logger.getLogger( this.getClass() ).info( "User login try: " + request.getParameter( "user" ) );
	    	
	    	String session_str = (String)call.invoke( new Object[]{ request.getParameter( "user" ), request.getParameter( "pass" ) } );
	    	
	    	if( "".equals( session_str ) ) {
	    		try {
	    			Logger.getLogger( this.getClass() ).error( String.format( "Felhasznaloi azonositas sikertelen! Parameterek: user: %s pass: %s IP: %s", (String)request.getParameter( "user" ), (String)request.getParameter( "pass" ), request.getRemoteAddr() ) );
	    			out.write( new JSONObject().put("success", false ).put("message", "Felhasznalonev vagy jelszo ervenytelen" ).toString() );
	    		} catch (Exception e) {
	    			e.printStackTrace();
	    		}
	    		return;
	    	}
	    	
	    	session.setAttribute( "username", request.getParameter( "user" ) );
	    	session.setAttribute( "password", request.getParameter( "pass" ) );
	    	
	    	try {
    			out.write( new JSONObject().put("success", true ).toString() );
    		} catch (Exception e) {
    			e.printStackTrace();
    		}
	    } else {
	    	try {
	    		Logger.getLogger( this.getClass() ).debug( "A megerosito kod ervenytelen volt: " + request.getParameter( "captcha" ) + " Answer: " + cap.getAnswer() );
    			out.write( new JSONObject().put("success", false ).put("message", "Megerosito kod ervenytelen volt" ).toString() );
    		} catch (Exception e) {
    			e.printStackTrace();
    		}
	    }
	}

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.getOutputStream().write( new JSONObject().put("success", true ).toString().getBytes() );
        //super.service(req, resp);
    }
}
