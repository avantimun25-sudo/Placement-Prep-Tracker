import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Skills from "@/pages/Skills";
import Companies from "@/pages/Companies";
import Goals from "@/pages/Goals";
import Resume from "@/pages/Resume";
import Progress from "@/pages/Progress";
import Profile from "@/pages/Profile";
import CompanyNotes from "@/pages/CompanyNotes";
import { useEffect } from "react";
import { useLocation } from "wouter";

function ProtectedRoute({ component: Component, path }: { component: React.ComponentType, path: string }) {
  const [location, setLocation] = useLocation();
  const userStr = localStorage.getItem("currentUser");
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!user) {
      setLocation("/login");
    }
  }, [user, setLocation]);

  if (!user) return null;
  return <Component />;
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/dashboard">
          <ProtectedRoute component={Dashboard} path="/dashboard" />
        </Route>
        <Route path="/skills">
          <ProtectedRoute component={Skills} path="/skills" />
        </Route>
        <Route path="/companies">
          <ProtectedRoute component={Companies} path="/companies" />
        </Route>
        <Route path="/company-notes">
          <ProtectedRoute component={CompanyNotes} path="/company-notes" />
        </Route>
        <Route path="/goals">
          <ProtectedRoute component={Goals} path="/goals" />
        </Route>
        <Route path="/resume">
          <ProtectedRoute component={Resume} path="/resume" />
        </Route>
        <Route path="/tips">
          <Route component={() => {
            const [, setLocation] = useLocation();
            useEffect(() => setLocation("/dashboard"), []);
            return null;
          }} />
        </Route>
        <Route path="/progress">
          <ProtectedRoute component={Progress} path="/progress" />
        </Route>
        <Route path="/profile">
          <ProtectedRoute component={Profile} path="/profile" />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
