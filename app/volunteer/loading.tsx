import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function VolunteerLoading() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">
              <Skeleton className="h-8 w-64" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-full" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-32 w-full" />
              </div>
              
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Skeleton className="h-4 w-3/4" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
