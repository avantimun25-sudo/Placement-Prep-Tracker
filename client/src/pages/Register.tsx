import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Registration successful! Please login.",
        });
        setLocation("/login");
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Registration failed",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Server connection failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="flex items-center gap-2 mb-8">
        <div className="p-2 bg-primary/10 rounded-xl">
          <GraduationCap className="w-6 h-6 text-primary" />
        </div>
        <span className="font-bold text-2xl text-slate-900">PrepTracker</span>
      </div>

      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Register</CardTitle>
          <p className="text-sm text-slate-500">
            Create an account to start tracking your placement journey
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full h-11 bg-slate-900 hover:bg-slate-800">
              Register
            </Button>
            <div className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
