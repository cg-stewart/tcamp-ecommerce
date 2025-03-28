import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const billingHistory = [
  { id: "1", date: "2024-03-01", amount: "$125.00", description: "Monthly Subscription" },
  { id: "2", date: "2024-02-01", amount: "$125.00", description: "Monthly Subscription" },
]

export default function BillingPage() {
  return (
    <div className="w-full space-y-6">
      <h1 className="text-3xl font-bold">Billing</h1>
      <div className="flex flex-col gap-6 w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You are currently on the Pro plan.</p>
            <p className="font-bold mt-2">$125.00 / month</p>
            <Button className="mt-4 w-full md:w-auto">Upgrade Plan</Button>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Visa ending in 1234</p>
            <p>Expires 12/2025</p>
            <Button variant="outline" className="mt-4 w-full md:w-auto">
              Update Payment Method
            </Button>
          </CardContent>
        </Card>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>{item.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

