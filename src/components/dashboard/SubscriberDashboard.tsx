import { Card, CardContent } from "@/components/ui/card";
import { ContentCarousel } from "./ContentCarousel";
import type { Profile } from "./types";

interface SubscriberDashboardProps {
  profile: Profile;
}

export const SubscriberDashboard = ({ profile }: SubscriberDashboardProps) => {
  return (
    <div className="space-y-6">
      <ContentCarousel content={[]} />
    </div>
  );
};