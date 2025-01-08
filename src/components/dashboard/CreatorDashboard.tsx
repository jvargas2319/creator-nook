import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
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
    <div className="grid gap-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <img
            src={profile?.avatar_url || "/placeholder.svg"}
            alt="Profile"
            className="w-12 h-12 rounded-full border-2 border-primary"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome, {profile?.full_name || profile?.username}
            </h1>
            <p className="text-gray-400">Creator Dashboard</p>
          </div>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-primary hover:bg-primary-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Content
        </Button>
      </div>

      {showCreateForm && (
        <Card className="bg-[#222222] border-gray-700">
          <CardContent className="p-6">
            <CreateContentForm />
          </CardContent>
        </Card>
      )}

      <Card className="bg-[#222222] border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-700">
          <CardTitle className="text-xl text-white">Your Content</CardTitle>
          <Button variant="ghost" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <ContentCarousel content={content} />
        </CardContent>
      </Card>
    </div>
  );
};