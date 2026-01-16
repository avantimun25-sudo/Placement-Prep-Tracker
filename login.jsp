<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Login - Placement Preparation Tracker</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        .auth-container {
            max-width: 400px;
            margin: 100px auto;
            padding: 2rem;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .auth-form div { margin-bottom: 1rem; }
        .auth-form label { display: block; margin-bottom: .5rem; }
        .auth-form input { width: 100%; padding: .5rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
        .auth-form button { width: 100%; padding: .75rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .auth-form button:hover { background: #0056b3; }
        .auth-link { margin-top: 1rem; text-align: center; }
        .error-msg { color: red; margin-bottom: 1rem; }
    </style>
</head>
<body>
    <div class="auth-container">
        <h2>Login</h2>
        <% if (request.getAttribute("error") != null) { %>
            <div class="error-msg"><%= request.getAttribute("error") %></div>
        <% } %>
        <form class="auth-form" action="LoginServlet" method="POST">
            <div>
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div>
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit">Login</button>
        </form>
        <div class="auth-link">
            Don't have an account? <a href="register.jsp">Register here</a>
        </div>
    </div>
</body>
</html>
