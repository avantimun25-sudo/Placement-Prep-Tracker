<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Placement Preparation Tracker</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        .hero {
            text-align: center;
            padding: 100px 20px;
            max-width: 800px;
            margin: 0 auto;
        }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
        .hero p { font-size: 1.2rem; color: #666; margin-bottom: 2rem; }
        .btn-group { display: flex; gap: 1rem; justify-content: center; }
        .btn { padding: .75rem 2rem; border-radius: 4px; text-decoration: none; font-weight: bold; }
        .btn-primary { background: #007bff; color: white; }
        .btn-secondary { background: #6c757d; color: white; }
    </style>
</head>
<body>
    <div class="hero">
        <h1>Placement Preparation Tracker</h1>
        <p>Your all-in-one companion for tracking skills, daily goals, and company preparation to land your dream job.</p>
        <div class="btn-group">
            <a href="login.jsp" class="btn btn-primary" data-testid="link-login">Login</a>
            <a href="register.jsp" class="btn btn-secondary" data-testid="link-register">Register</a>
        </div>
    </div>
</body>
</html>
