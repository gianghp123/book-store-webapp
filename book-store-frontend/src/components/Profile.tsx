"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import LogoutButton from "./LogoutButton";
import { Authenticated } from "@refinedev/core";

const recentActivities = [
  {
    action: "Purchased e-book",
    title: "The Great Gatsby",
    time: "2 hours ago",
  },
  { action: "Completed reading", title: "1984", time: "5 hours ago" },
  {
    action: "Added review for",
    title: "To Kill a Mockingbird",
    time: "1 day ago",
  },
];

export default function Profile() {
  return (
    <Authenticated key="profile">
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Profile</h1>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Profile Card */}
          <div className="col-span-12 lg:col-span-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
                    JD
                  </div>
                  <h2 className="text-xl font-semibold">John Doe</h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    Product Designer
                  </p>
                  <span className="text-xs bg-secondary px-3 py-1 rounded-full">
                    Pro Member
                  </span>

                  <Button className="w-full mt-4 bg-black text-white hover:bg-gray-800">
                    Message
                  </Button>

                  <Separator className="my-4" />

                  <div className="w-full space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Member since
                      </span>
                      <span className="font-medium">Jan 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last active</span>
                      <span className="font-medium">2 hours ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role</span>
                      <span className="font-medium">Admin</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content Area */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold">128</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Books Purchased
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold">8.5k</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Reading Hours
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold">99%</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Satisfaction Rate
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          {activity.action}{" "}
                          <span className="font-semibold">
                            "{activity.title}"
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Full Name
                    </label>
                    <Input placeholder="John Doe" defaultValue={"John Doe"} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Email Address
                    </label>
                    <Input
                      placeholder="john.doe@example.com"
                      type="email"
                      defaultValue={"john.doe@example.com"}
                      disabled
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button className="flex-1">Save Changes</Button>
                    <LogoutButton />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
