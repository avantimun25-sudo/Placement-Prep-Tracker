package com.placement.servlets;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        // Mock authentication for hackathon demo
        if ("test@example.com".equals(email) && "password123".equals(password)) {
            HttpSession session = request.getSession();
            session.setAttribute("userId", "12345");
            session.setAttribute("userName", "Demo User");
            response.sendRedirect("dashboard.jsp");
        } else {
            request.setAttribute("error", "Invalid email or password. Use test@example.com / password123");
            request.getRequestDispatcher("login.jsp").forward(request, response);
        }
    }
}
