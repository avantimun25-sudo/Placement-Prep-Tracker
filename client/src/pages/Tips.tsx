import { useTips } from "@/hooks/use-tips";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Lightbulb, MessageCircle, FileText } from "lucide-react";

export default function Tips() {
  const { data: tips = [] } = useTips();

  // Mock tips if database is empty for better DX on first load
  const displayTips = tips.length > 0 ? tips : [
    { id: 1, title: "STAR Method", category: "interview", content: "Situation, Task, Action, Result. Use this framework to answer behavioral questions effectively." },
    { id: 2, title: "Resume Action Verbs", category: "resume", content: "Start bullet points with strong action verbs like 'Architected', 'Deployed', 'Optimized' instead of 'Worked on'." },
    { id: 3, title: "Ask Questions", category: "interview", content: "Always have 2-3 prepared questions for the interviewer. It shows genuine interest and research." },
    { id: 4, title: "Online Assessment Prep", category: "general", content: "Practice on LeetCode/HackerRank in a timed environment. Simulate the pressure of real tests." },
  ];

  const categories = {
    interview: { icon: MessageCircle, color: "text-blue-500", label: "Interview Prep" },
    resume: { icon: FileText, color: "text-green-500", label: "Resume Building" },
    general: { icon: Lightbulb, color: "text-yellow-500", label: "General Tips" },
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Expert Tips</h2>
        <p className="text-slate-500 mt-2">Curated advice to help you ace your placements.</p>
      </div>

      <div className="grid gap-6">
        {displayTips.map((tip) => {
          const cat = categories[tip.category as keyof typeof categories] || categories.general;
          const Icon = cat.icon;

          return (
            <div key={tip.id} className="bg-white rounded-2xl p-1 border border-slate-100 shadow-sm overflow-hidden">
              <Accordion type="single" collapsible>
                <AccordionItem value={`item-${tip.id}`} className="border-none">
                  <AccordionTrigger className="px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4 text-left">
                      <div className={`p-2 rounded-lg bg-slate-50 ${cat.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{tip.title}</h4>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{cat.label}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 pt-2">
                    <div className="pl-[3.25rem]">
                      <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                        {tip.content}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          );
        })}
      </div>
    </div>
  );
}
