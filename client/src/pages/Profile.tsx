import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, BookOpen, GraduationCap, Calendar } from "lucide-react";

export default function Profile() {
  const userData = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const profileFields = [
    { label: "Full Name", value: userData.name || "John Student", icon: User },
    { label: "Email Address", value: userData.email, icon: Mail },
    { label: "Phone Number", value: userData.phone || "Not provided", icon: Phone },
    { label: "Department / Branch", value: userData.branch || "Computer Science", icon: BookOpen },
    { label: "Academic Status", value: userData.status || "Final Year", icon: GraduationCap },
    { label: "Graduation Year", value: userData.gradYear || "2025", icon: Calendar },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Your Profile</h1>
        <p className="text-slate-500 mt-2">View and manage your personal information</p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <CardTitle className="text-xl font-bold">Personal Information</CardTitle>
          <Button variant="outline" className="h-9">Edit Profile</Button>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            {profileFields.map((field, idx) => {
              const Icon = field.icon;
              return (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="p-2.5 bg-white rounded-lg shadow-sm border border-slate-200">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{field.label}</p>
                    <p className="text-slate-900 font-medium">{field.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
