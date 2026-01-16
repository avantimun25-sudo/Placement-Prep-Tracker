import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type CompanyNote, type InsertCompanyNote } from "@shared/schema";

export function useCompanyNotes(companyId?: number) {
  const userStr = localStorage.getItem("currentUser");
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id;

  return useQuery({
    queryKey: ["/api/company-notes", userId, companyId],
    queryFn: async () => {
      if (!userId) return [];
      const url = companyId 
        ? `/api/company-notes?userId=${userId}&companyId=${companyId}`
        : `/api/company-notes?userId=${userId}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch notes");
      return await res.json() as CompanyNote[];
    },
    enabled: !!userId,
  });
}

export function useCreateCompanyNote() {
  const queryClient = useQueryClient();
  const userStr = localStorage.getItem("currentUser");
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id;

  return useMutation({
    mutationFn: async (data: InsertCompanyNote) => {
      const res = await fetch("/api/company-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId }),
      });
      if (!res.ok) throw new Error("Failed to create note");
      return await res.json() as CompanyNote;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/company-notes", userId, variables.companyId] });
      queryClient.invalidateQueries({ queryKey: ["/api/company-notes", userId] });
    },
  });
}

export function useUpdateCompanyNote() {
  const queryClient = useQueryClient();
  const userStr = localStorage.getItem("currentUser");
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id;

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<InsertCompanyNote> & { id: number }) => {
      const res = await fetch(`/api/company-notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId }),
      });
      if (!res.ok) throw new Error("Failed to update note");
      return await res.json() as CompanyNote;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/company-notes", userId, data.companyId] });
      queryClient.invalidateQueries({ queryKey: ["/api/company-notes", userId] });
    },
  });
}

export function useDeleteCompanyNote() {
  const queryClient = useQueryClient();
  const userStr = localStorage.getItem("currentUser");
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id;

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/company-notes/${id}?userId=${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete note");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/company-notes", userId] });
    },
  });
}
