import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, DollarSign, Package, Users } from "lucide-react";
import { checkRole } from "@/lib/roles";

export default async function AdminDashboardPage() {
  const isAdmin = await checkRole("admin");

  if (!isAdmin) {
    redirect("/");
  }
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Workshop Registrations
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,453</div>
            <p className="text-xs text-muted-foreground">
              +10.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="workshops">Workshop Status</TabsTrigger>
          <TabsTrigger value="users">New Users</TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest transactions across the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 text-sm text-muted-foreground">
                  <div>Order</div>
                  <div>Customer</div>
                  <div>Status</div>
                  <div className="text-right">Amount</div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="grid grid-cols-4 items-center">
                      <div>
                        <p className="font-medium">ORD-{1234 + i}</p>
                        <p className="text-sm text-muted-foreground">
                          May {20 - i}, 2024
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">User {i}</p>
                        <p className="text-sm text-muted-foreground">
                          user{i}@example.com
                        </p>
                      </div>
                      <div>
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                          {i % 3 === 0
                            ? "Processing"
                            : i % 2 === 0
                              ? "Shipped"
                              : "Delivered"}
                        </div>
                      </div>
                      <div className="text-right font-medium">
                        ${(Math.random() * 100 + 20).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="workshops" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workshop Status</CardTitle>
              <CardDescription>
                Current registration status for upcoming workshops.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 text-sm text-muted-foreground">
                  <div>Workshop</div>
                  <div>Date</div>
                  <div>Registrations</div>
                  <div className="text-right">Capacity</div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 items-center">
                    <div>
                      <p className="font-medium">Summer Art Camp</p>
                    </div>
                    <div>
                      <p className="text-sm">June 15-30, 2024</p>
                    </div>
                    <div>
                      <p className="font-medium">15</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">20</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center">
                    <div>
                      <p className="font-medium">Coding for Kids</p>
                    </div>
                    <div>
                      <p className="text-sm">July 10-25, 2024</p>
                    </div>
                    <div>
                      <p className="font-medium">17</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">20</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center">
                    <div>
                      <p className="font-medium">Music Production</p>
                    </div>
                    <div>
                      <p className="text-sm">August 5-20, 2024</p>
                    </div>
                    <div>
                      <p className="font-medium">13</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">20</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>New Users</CardTitle>
              <CardDescription>
                Recently registered users on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 text-sm text-muted-foreground">
                  <div>User</div>
                  <div>Joined</div>
                  <div>Status</div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="grid grid-cols-3 items-center">
                      <div>
                        <p className="font-medium">User Name {i}</p>
                        <p className="text-sm text-muted-foreground">
                          user{i}@example.com
                        </p>
                      </div>
                      <div>
                        <p className="text-sm">May {20 - i}, 2024</p>
                      </div>
                      <div>
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                          Active
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
