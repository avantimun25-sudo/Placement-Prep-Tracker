import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertSkill, type Skill } from "@shared/schema";

export function useSkills() {
  const userStr = localStorage.getItem("currentUser");
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id;

  return useQuery({
    queryKey: [api.skills.list.path, userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await fetch(`${api.skills.list.path}?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch skills");
      return api.skills.list.responses[200].parse(await res.json());
    },
    enabled: !!userId,
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );

      const userId = currentUser.userId || currentUser.id;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      const res = await fetch("/api/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: userId,
          skillName: data.skillName,
          level: data.level,
          category: data.category
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create skill");
      }
      return await res.json();
    },
    onSuccess: () => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      const userId = currentUser.userId || currentUser.id;
      queryClient.invalidateQueries({ queryKey: [api.skills.list.path, userId] });
    },
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();
  const userStr = localStorage.getItem("currentUser");
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id;

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertSkill>) => {
      const url = buildUrl(api.skills.update.path, { id });
      const res = await fetch(url, {
        method: api.skills.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updates, userId }),
      });
      if (!res.ok) throw new Error("Failed to update skill");
      return api.skills.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.skills.list.path, userId] }),
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  const userStr = localStorage.getItem("currentUser");
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id;

  return useMutation({
    mutationFn: async (id: number) => {
      const url = `${buildUrl(api.skills.delete.path, { id })}?userId=${userId}`;
      const res = await fetch(url, { method: api.skills.delete.method });
      if (!res.ok) throw new Error("Failed to delete skill");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.skills.list.path, userId] }),
  });
}
