import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateContentForm } from "@/components/CreateContentForm";
import { ContentCarousel } from "./ContentCarousel";
import type { Content, Profile } from "./types";

interface CreatorDashboardProps {
  profile: Profile;
  content: Content[];
  showCreateForm: boolean;
  setShowCreateForm: (show: boolean) => void;
}

export const CreatorDashboard = ({
  profile,
  content,
  showCreateForm,
  setShowCreateForm,
}: CreatorDashboardProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-primary hover:bg-primary-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Content
        </Button>
      </div>

      {showCreateForm && (
        <Card className="bg-[#1A1A1A] border-gray-800">
          <CardContent className="p-6">
            <CreateContentForm />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        <ContentCarousel content={content} profile={content[0]?.profile} />
      </div>
    </div>
  );
};