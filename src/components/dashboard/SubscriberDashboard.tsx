import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Profile } from "./types";

interface SubscriberDashboardProps {
  profile: Profile;
}

export const SubscriberDashboard = ({ profile }: SubscriberDashboardProps) => {
  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4 mb-8">
        <img
          src={profile?.avatar_url || "/placeholder.svg"}
          alt="Profile"
          className="w-12 h-12 rounded-full border-2 border-primary"
        />
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome, {profile?.full_name || profile?.username}
          </h1>
          <p className="text-gray-400">Subscriber Dashboard</p>
        </div>
      </div>

      <Card className="bg-[#222222] border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-white">Your Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">No active subscriptions</p>
        </CardContent>
      </Card>
    </div>
  );
};