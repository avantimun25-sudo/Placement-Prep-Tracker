import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Mail, Phone, BookOpen, GraduationCap, Calendar, X, Check } from "lucide-react";

export default function Profile() {
  const userData = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: userData.name || "John Student",
    phone: userData.phone || "",
    branch: userData.branch || "Computer Science",
    status: userData.status || "Final Year",
    gradYear: userData.gradYear || 2025,
  });

  const profileFields = [
    { label: "Full Name", value: formData.name, icon: User },
    { label: "Email Address", value: userData.email, icon: Mail },
    { label: "Phone Number", value: formData.phone || "Not provided", icon: Phone },
    { label: "Department / Branch", value: formData.branch, icon: BookOpen },
    { label: "Academic Status", value: formData.status, icon: GraduationCap },
    { label: "Graduation Year", value: formData.gradYear, icon: Calendar },
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
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline" className="h-9 gap-2">
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={() => setIsEditing(false)} variant="outline" className="h-9 gap-2 text-slate-500">
                <X className="w-4 h-4" /> Cancel
              </Button>
              <Button className="h-9 gap-2 bg-slate-900">
                <Check className="w-4 h-4" /> Save Changes
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {!isEditing ? (
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
          ) : (
            <form className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" value={userData.email} disabled className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Department / Branch</Label>
                <Input 
                  id="branch" 
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Academic Status</Label>
                <Select 
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="First Year">First Year</SelectItem>
                    <SelectItem value="Second Year">Second Year</SelectItem>
                    <SelectItem value="Third Year">Third Year</SelectItem>
                    <SelectItem value="Final Year">Final Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gradYear">Graduation Year</Label>
                <Input 
                  id="gradYear" 
                  type="number" 
                  value={formData.gradYear}
                  onChange={(e) => setFormData({ ...formData, gradYear: parseInt(e.target.value) || 0 })}
                />
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
