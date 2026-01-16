import { useState, useEffect } from "react";
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
import { User, Mail, Phone, BookOpen, GraduationCap, Calendar, X, Check, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Profile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const userId = user.userId || user.id;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    academicStatus: "",
    graduationYear: 2025,
    profileImageUrl: "",
  });

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/profile", userId],
    queryFn: async () => {
      const res = await fetch(`/api/profile?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        email: profile.email || user.email || "",
        phone: profile.phone || "",
        department: profile.department || "",
        academicStatus: profile.academicStatus || "",
        graduationYear: profile.graduationYear || 2025,
        profileImageUrl: profile.profileImageUrl || "",
      });
      setPreviewUrl(profile.profileImageUrl || "");
    }
  }, [profile, user.email]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const body = new FormData();
      body.append("userId", userId.toString());
      body.append("fullName", data.fullName);
      body.append("email", data.email);
      body.append("phone", data.phone);
      body.append("department", data.department);
      body.append("academicStatus", data.academicStatus);
      body.append("graduationYear", data.graduationYear.toString());

      if (profileImageFile) {
        body.append("profile_image", profileImageFile);
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        body,
      });
      if (!res.ok) throw new Error("Failed to update profile");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile", userId] });
      setIsEditing(false);
      setProfileImageFile(null);
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading profile...</div>;

  const profileFields = [
    { label: "Full Name", value: profile?.fullName || "Not provided", icon: User },
    { label: "Email Address", value: profile?.email || user.email || "Not provided", icon: Mail },
    { label: "Phone Number", value: profile?.phone || "Not provided", icon: Phone },
    { label: "Department / Branch", value: profile?.department || "Not provided", icon: BookOpen },
    { label: "Academic Status", value: profile?.academicStatus || "Not provided", icon: GraduationCap },
    { label: "Graduation Year", value: profile?.graduationYear || "Not provided", icon: Calendar },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        toast({
          title: "Error",
          description: "Please upload only PNG or JPEG images",
          variant: "destructive",
        });
        return;
      }
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Your Profile</h1>
        <p className="text-slate-500 mt-2">View and manage your personal information</p>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 to-accent/20 border-b border-slate-100" />
        <CardContent className="relative pt-0">
          <div className="flex flex-col md:flex-row gap-6 items-end -mt-16 mb-8 px-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl bg-white p-1 shadow-lg overflow-hidden border border-slate-200">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      e.currentTarget.src = "/default-avatar.png";
                      e.currentTarget.onerror = null;
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-50 flex items-center justify-center rounded-xl">
                    <User className="w-12 h-12 text-slate-300" />
                  </div>
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-2 right-2 p-2 bg-primary text-white rounded-lg shadow-md cursor-pointer hover:bg-primary/90 transition-colors">
                  <Camera className="w-4 h-4" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              )}
            </div>
            <div className="flex-1 pb-2">
              <h2 className="text-2xl font-bold text-slate-900">{profile?.fullName || "Anonymous User"}</h2>
              <p className="text-slate-500 font-medium">{profile?.academicStatus || "Profile Incomplete"}</p>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline" className="h-10 gap-2 mb-2">
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2 mb-2">
                <Button onClick={() => setIsEditing(false)} variant="outline" className="h-10 gap-2 text-slate-500">
                  <X className="w-4 h-4" /> Cancel
                </Button>
                <Button 
                  onClick={() => updateProfileMutation.mutate(formData)} 
                  className="h-10 gap-2 bg-slate-900"
                  disabled={updateProfileMutation.isPending}
                  data-testid="button-save-profile"
                >
                  <Check className="w-4 h-4" /> Save Changes
                </Button>
              </div>
            )}
          </div>

          {!isEditing ? (
            <div className="grid md:grid-cols-2 gap-6">
              {profileFields.map((field, idx) => {
                const Icon = field.icon;
                return (
                  <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-100/50">
                    <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{field.label}</p>
                      <p className="text-slate-900 font-semibold">{field.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <form className="grid md:grid-cols-2 gap-8 py-4">
              <div className="space-y-3">
                <Label htmlFor="fullName" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Full Name</Label>
                <Input 
                  id="fullName" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter your full name"
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="email" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Email Address</Label>
                <Input 
                  id="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Phone Number</Label>
                <Input 
                  id="phone" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="department" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Department / Branch</Label>
                <Input 
                  id="department" 
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Computer Science"
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="status" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Academic Status</Label>
                <Select 
                  value={formData.academicStatus}
                  onValueChange={(value) => setFormData({ ...formData, academicStatus: value })}
                >
                  <SelectTrigger id="status" className="h-11 rounded-xl">
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
              <div className="space-y-3">
                <Label htmlFor="gradYear" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Graduation Year</Label>
                <Input 
                  id="gradYear" 
                  type="number" 
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) || 0 })}
                  className="h-11 rounded-xl"
                />
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
