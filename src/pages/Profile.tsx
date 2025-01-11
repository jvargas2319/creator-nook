import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Navigation } from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Profile, Content } from "@/components/dashboard/types";
import { ContentCarousel } from "@/components/dashboard/ContentCarousel";

const ProfilePage = () => {
  const { username } = useParams();

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .maybeSingle();

      if (error) throw error;
      return data as Profile | null;
    },
  });

  const { data: content, isLoading: isLoadingContent } = useQuery({
    queryKey: ["content", profile?.id],
    enabled: !!profile?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("creator_id", profile?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Content[];
    },
  });

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="container max-w-4xl mx-auto py-32 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Profile not found</h1>
          <p className="text-gray-400">
            The profile you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="h-4 w-4" />
              <span>Miami</span>
            </div>
            <Button variant="link" className="text-blue-400 p-0">
              Show more
            </Button>
          </div>
          <div className="text-gray-400">
            Daily activity
          </div>
        </div>

        {/* Subscription Tiers */}
        <div className="space-y-6 mb-8">
          {/* My Fan Tier */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-white">My fan 😊: Limited offer First Month 50% Off!</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">Offer ends Jun 6</p>
              <Button className="w-full bg-blue-500 hover:bg-blue-600">
                My fan 😊 1 Month - $5 (First Month 50% Off!)
              </Button>
            </CardContent>
          </Card>

          {/* VIP Fan Tier */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-white">VIP Fan 😍: Limited offer First Month 36.67% Off!</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">Offer ends May 9</p>
              <Button className="w-full bg-blue-500 hover:bg-blue-600">
                VIP Fan 😍 1 Month - $19 (First Month 36.67% Off!)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="posts" className="mt-8">
          <TabsList className="w-full bg-gray-800">
            <TabsTrigger value="posts" className="flex-1">Posts</TabsTrigger>
            <TabsTrigger value="media" className="flex-1">Media</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search Timeline"
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <Button variant="ghost" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            {isLoadingContent ? (
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : (
              <ContentCarousel content={content || []} />
            )}
          </TabsContent>

          <TabsContent value="media" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {content?.filter(item => item.content_type === "image").map(item => (
                <div key={item.id} className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={item.content_url || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;