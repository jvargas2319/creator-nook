import { Card, CardContent } from "@/components/ui/card";
import { ContentCarousel } from "./ContentCarousel";
import type { Content, Profile } from "./types";

interface SubscriberDashboardProps {
  profile: Profile;
  content?: Content[];
}

export const SubscriberDashboard = ({ profile, content = [] }: SubscriberDashboardProps) => {
  return (
    <div className="space-y-6">
      <ContentCarousel content={content} />
    </div>
  );
};