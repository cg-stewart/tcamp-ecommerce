import { toast } from "@/components/ui/use-toast";

/**
 * Generic fetch function for SWR
 */
export async function fetcher<T>(url: string): Promise<T> {
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object
    (error as any).info = await response.json();
    (error as any).status = response.status;
    throw error;
  }
  
  return response.json();
}

/**
 * Custom fetcher that works with our API routes
 * that return { success, data, message } format
 */
export async function apiDataFetcher<T>(url: string): Promise<T> {
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object
    (error as any).info = await response.json();
    (error as any).status = response.status;
    throw error;
  }
  
  const result = await response.json();
  
  if (!result.success) {
    toast({
      title: "Error",
      description: result.message || "Something went wrong",
      variant: "destructive",
    });
    throw new Error(result.message || "Failed to fetch data");
  }
  
  return result.data;
}
