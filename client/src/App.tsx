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
import Tips from "@/pages/Tips";
import Progress from "@/pages/Progress";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/skills" component={Skills} />
        <Route path="/companies" component={Companies} />
        <Route path="/goals" component={Goals} />
        <Route path="/resume" component={Resume} />
        <Route path="/tips" component={Tips} />
        <Route path="/progress" component={Progress} />
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
