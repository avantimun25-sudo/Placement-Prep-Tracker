import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Trophy, Briefcase, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative background */}
      <motion.div 
        animate={{ 
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{ 
          duration: 40, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" 
      />
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-accent/5 rounded-full blur-3xl" />

      <header className="relative max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-xl">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <span className="font-bold text-xl text-slate-900">PrepTracker</span>
        </div>
        <Link href="/login" className="btn-primary !py-2 !px-4 !rounded-xl text-sm">
          Log In <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      <main className="relative max-w-7xl mx-auto px-6 pt-20 pb-32 text-center lg:text-left">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Placement Season 2026 is here
            </div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6"
            >
              Master Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent font-extrabold">
                Placement Journey
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="text-lg text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Track your skills, manage job applications, and achieve your daily goals. 
              The ultimate companion for students aiming for their dream job.
            </motion.p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link href="/register" className="btn-primary">
                Start Preparing
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-8 justify-center lg:justify-start text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Skill Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Goal Setting</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Interview Prep</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -10, 0]
            }}
            transition={{ 
              opacity: { duration: 0.8, delay: 0.2 },
              scale: { duration: 0.8, delay: 0.2 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative hidden lg:block"
          >
            {/* Abstract UI representation */}
            <div className="relative z-10 bg-white rounded-3xl shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 p-6 rotate-2 hover:rotate-0 transition-all duration-700 ease-in-out">
               {/* Decorative UI Mockup */}
               <div className="flex gap-4 mb-6">
                 <div className="w-1/2 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                    <Trophy className="w-8 h-8 text-primary mb-2" />
                    <div className="h-2 w-24 bg-primary/20 rounded mb-2" />
                    <div className="h-2 w-16 bg-primary/10 rounded" />
                 </div>
                 <div className="w-1/2 p-4 rounded-2xl bg-accent/5 border border-accent/10">
                    <Briefcase className="w-8 h-8 text-accent mb-2" />
                    <div className="h-2 w-24 bg-accent/20 rounded mb-2" />
                    <div className="h-2 w-16 bg-accent/10 rounded" />
                 </div>
               </div>
               <div className="space-y-3">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50">
                     <div className="w-10 h-10 rounded-full bg-slate-200" />
                     <div className="flex-1">
                       <div className="h-2 w-32 bg-slate-200 rounded mb-2" />
                       <div className="h-2 w-20 bg-slate-100 rounded" />
                     </div>
                     <div className="w-8 h-8 rounded-full border-2 border-slate-200" />
                   </div>
                 ))}
               </div>
            </div>
            
            {/* Background blobs behind image */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
