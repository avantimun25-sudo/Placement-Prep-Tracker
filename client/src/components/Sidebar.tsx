import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Target, 
  Briefcase, 
  Trophy, 
  CheckSquare, 
  FileText, 
  Lightbulb,
  GraduationCap,
  LogOut,
  User as UserIcon
} from "lucide-react";
import { clsx } from "clsx";
import { useQuery } from "@tanstack/react-query";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/skills", label: "Skills", icon: Trophy },
  { href: "/goals", label: "Goals", icon: CheckSquare },
  { href: "/companies", label: "Companies", icon: Briefcase },
  { href: "/progress", label: "Progress", icon: Target },
  { href: "/resume", label: "Resume", icon: FileText },
  { href: "/tips", label: "Tips", icon: Lightbulb },
];

export function Sidebar() {
  const [location, setLocation] = useLocation();
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const userId = user.userId || user.id;

  const { data: profile } = useQuery({
    queryKey: ["/api/profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const res = await fetch(`/api/profile?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
    enabled: !!userId,
  });
  
  const initials = profile?.fullName
    ? profile.fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "";

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setLocation("/login");
  };

  const isProfileIncomplete = !profile?.fullName;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-100 p-6 hidden md:flex flex-col z-50 shadow-xl shadow-slate-200/50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="p-2 bg-primary/10 rounded-xl">
          <GraduationCap className="w-8 h-8 text-primary" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-slate-800 leading-none">PrepTracker</h1>
          <span className="text-xs text-slate-500 font-medium mt-1">Placement Ready</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href} className={clsx(
              "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group font-medium text-sm",
              isActive 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 translate-x-1" 
                : "text-slate-600 hover:bg-slate-50 hover:text-primary hover:translate-x-1"
            )}>
              <Icon className={clsx("w-5 h-5", isActive ? "text-primary-foreground" : "text-slate-400 group-hover:text-primary")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <button 
          onClick={() => setLocation("/profile")}
          className="w-full text-left px-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all duration-200 cursor-pointer group"
        >
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Profile</p>
          <div className="flex items-center gap-3">
            {profile?.profileImageUrl ? (
              <img 
                src={profile.profileImageUrl} 
                alt="Profile" 
                className="w-8 h-8 rounded-full shadow-md object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white text-xs font-bold shadow-md">
                {initials || <UserIcon className="w-4 h-4" />}
              </div>
            )}
            <div>
              {isProfileIncomplete ? (
                <p className="text-sm font-bold text-primary animate-pulse">Complete your profile</p>
              ) : (
                <>
                  <p className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors line-clamp-1">{profile.fullName}</p>
                  <p className="text-xs text-slate-500 line-clamp-1">{profile.academicStatus || "Student"}</p>
                </>
              )}
            </div>
          </div>
        </button>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-medium text-sm group"
        >
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-600" />
          Logout
        </button>
      </div>
    </aside>
  );
}
