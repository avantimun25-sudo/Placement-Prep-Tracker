import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Target, 
  Briefcase, 
  Trophy, 
  CheckSquare, 
  FileText, 
  Lightbulb,
  GraduationCap
} from "lucide-react";
import { clsx } from "clsx";

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
  const [location] = useLocation();

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

      <div className="mt-auto px-4 py-4 bg-slate-50 rounded-2xl border border-slate-100">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Profile</p>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white text-xs font-bold shadow-md">
            JS
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">John Student</p>
            <p className="text-xs text-slate-500">CS Final Year</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
