<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Register - Placement Preparation Tracker</title>
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
        .auth-form button { width: 100%; padding: .75rem; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .auth-form button:hover { background: #218838; }
        .auth-link { margin-top: 1rem; text-align: center; }
    </style>
</head>
<body>
    <div class="auth-container">
        <h2>Create Account</h2>
        <form class="auth-form" action="RegisterServlet" method="POST">
            <div>
                <label for="name">Full Name</label>
                <input type="text" id="name" name="name" required>
            </div>
            <div>
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div>
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit">Register</button>
        </form>
        <div class="auth-link">
            Already have an account? <a href="login.jsp">Login here</a>
        </div>
    </div>
</body>
</html>
