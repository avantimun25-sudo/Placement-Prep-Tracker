<%
    if (session.getAttribute("userId") == null) {
        response.sendRedirect("login.jsp");
        return;
    }
%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Dashboard - Placement Preparation Tracker</title>
</head>
<body>
    <h1>Welcome, <%= session.getAttribute("userName") %></h1>
    <p>This is your placement preparation dashboard.</p>
    <a href="index.jsp">Logout</a>
</body>
</html>
