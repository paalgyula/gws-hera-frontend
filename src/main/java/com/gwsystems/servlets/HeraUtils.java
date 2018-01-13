package com.gwsystems.servlets;

import java.io.IOException;
import java.rmi.RemoteException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.xml.namespace.QName;
import javax.xml.rpc.ServiceException;

import org.apache.axis.client.Call;
import org.apache.axis.client.Service;
import org.apache.log4j.Logger;

import com.gwsystems.misc.ConfigReader;

public class HeraUtils {

    public static String login(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        String username = null;
        String password = null;

        try {
            username = (String) session.getAttribute("username");
            password = (String) session.getAttribute("password");
            if ((username == null) || (password == null)) {
                throw new ServletException("Nem sikerult kinyerni a session parametereket. Valoszinu torott session okozta (UserDetails servlet)");
            }
        } catch (Exception e) {
            throw new ServletException("Nem sikerult kinyerni a session parametereket. Valoszinu torott session okozta (UserDetails servlet)");
        }

        Service service = new Service();
        Call call = null;
        try {
            call = (Call) service.createCall();
            call.setTargetEndpointAddress(ConfigReader.read("mailbox_wsdl"));
            call.setOperationName(new QName("http://api.gw-systems.com/MailBox", "login"));
            String ret = (String) call.invoke(new Object[]{username, password});
            return ret;
        } catch (ServiceException e) {
            throw new ServletException("ServiceException in HeraServlet (1): " + e.getMessage());
        } catch (RemoteException e) {
            throw new ServletException("RemoteException in HeraServlet (2): " + e.getMessage());
        }
    }

}
