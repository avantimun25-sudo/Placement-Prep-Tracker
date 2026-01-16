import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertGoal } from "@shared/schema";

export function useGoals() {
  const userStr = localStorage.getItem("currentUser");
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id;

  return useQuery({
    queryKey: [api.goals.list.path, userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await fetch(`${api.goals.list.path}?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch goals");
      return api.goals.list.responses[200].parse(await res.json());
    },
    enabled: !!userId,
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  const userStr = localStorage.getItem("currentUser");
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id;

  return useMutation({
    mutationFn: async (data: InsertGoal) => {
      const res = await fetch(api.goals.create.path, {
        method: api.goals.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId }),
      });
      if (!res.ok) throw new Error("Failed to create goal");
      return api.goals.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.goals.list.path, userId] }),
  });
}

export function useToggleGoal() {
  const queryClient = useQueryClient();
  const userStr = localStorage.getItem("currentUser");
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id;

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.goals.toggle.path, { id });
      const res = await fetch(url, { 
        method: api.goals.toggle.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error("Failed to toggle goal");
      return api.goals.toggle.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.goals.list.path, userId] }),
  });
}
