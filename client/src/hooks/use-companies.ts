import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertCompany } from "@shared/schema";

export function useCompanies() {
  const userStr = localStorage.getItem("currentUser");
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id;

  return useQuery({
    queryKey: [api.companies.list.path, userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await fetch(`${api.companies.list.path}?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch companies");
      return api.companies.list.responses[200].parse(await res.json());
    },
    enabled: !!userId,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  const userStr = localStorage.getItem("currentUser");
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id;

  return useMutation({
    mutationFn: async (data: InsertCompany) => {
      const res = await fetch(api.companies.create.path, {
        method: api.companies.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId }),
      });
      if (!res.ok) throw new Error("Failed to create company");
      return api.companies.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.companies.list.path, userId] }),
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  const userStr = localStorage.getItem("currentUser");
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id;

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertCompany>) => {
      const url = buildUrl(api.companies.update.path, { id });
      const res = await fetch(url, {
        method: api.companies.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updates, userId }),
      });
      if (!res.ok) throw new Error("Failed to update company");
      return api.companies.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.companies.list.path, userId] }),
  });
}
