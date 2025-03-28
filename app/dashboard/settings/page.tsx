import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  return (
    <div className="w-full space-y-6">
      <h1 className="text-3xl font-bold">Account Settings</h1>
      <div className="grid gap-6 md:grid-cols-2 w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input type="text" id="name" placeholder="Your Name" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" placeholder="your@email.com" />
            </div>
            <Button className="w-full md:w-auto">Update Information</Button>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="current-password">Current Password</Label>
              <Input type="password" id="current-password" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="new-password">New Password</Label>
              <Input type="password" id="new-password" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input type="password" id="confirm-password" />
            </div>
            <Button className="w-full md:w-auto">Change Password</Button>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2 w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="email-notifications" />
              <Label htmlFor="email-notifications">Receive email notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="sms-notifications" />
              <Label htmlFor="sms-notifications">Receive SMS notifications</Label>
            </div>
            <Button className="w-full md:w-auto">Save Preferences</Button>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Delete Account</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Once you delete your account, there is no going back. Please be certain.</p>
            <Button variant="destructive" className="w-full md:w-auto">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

