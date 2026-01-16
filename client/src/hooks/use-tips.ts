import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useTips() {
  return useQuery({
    queryKey: [api.tips.list.path],
    queryFn: async () => {
      const res = await fetch(api.tips.list.path);
      if (!res.ok) throw new Error("Failed to fetch tips");
      return api.tips.list.responses[200].parse(await res.json());
    },
  });
}
