import { QueryClient } from "@tanstack/react-query";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const invalidateQueriesWithString = (
  queryClient: QueryClient,
  searchString: string
) => {
  queryClient.invalidateQueries({
    predicate: (query) => {
      const queryKey = query.queryKey;
      return queryKey.some(
        (key) => typeof key === "string" && key.includes(searchString)
      );
    },
  });
};
