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

  return useMutation({
    mutationFn: async (data: { title: string }) => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      const userId = currentUser.id; // The UI uses .id based on login response

      if (!userId) {
        throw new Error("User not authenticated");
      }

      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          title: data.title,
          completed: false
        }),
      });

      if (!res.ok) throw new Error("Failed to create goal");
      return res.json();
    },
    onSuccess: () => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      queryClient.invalidateQueries({ queryKey: [api.goals.list.path, currentUser.id] });
    },
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
