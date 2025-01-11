import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Navigation } from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Link2, MessageSquare, Image, Globe } from "lucide-react";
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
        <div className="w-full h-48 bg-gray-800 animate-pulse" />
        <div className="container max-w-4xl mx-auto -mt-24 px-4">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-32 w-32 rounded-full" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
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
      
      {/* Banner Image */}
      <div 
        className="w-full h-48 bg-cover bg-center bg-gray-800"
        style={profile.banner_url ? { backgroundImage: `url(${profile.banner_url})` } : {}}
      />
      
      {/* Profile Section */}
      <div className="container max-w-4xl mx-auto px-4">
        <div className="relative -mt-24 mb-8">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32 border-4 border-gray-900">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="text-2xl">
                {profile.full_name?.[0] || profile.username?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">
                {profile.full_name || profile.username}
                {profile.is_creator && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-500 text-white">
                    Creator
                  </span>
                )}
              </h1>
              
              <div className="flex items-center justify-center gap-4 mt-2 text-gray-400">
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-primary-400"
                  >
                    <Globe className="h-4 w-4 mr-1" />
                    Website
                  </a>
                )}
              </div>

              {profile.bio && (
                <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="about" className="mt-8">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="about" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              About
            </TabsTrigger>
            <TabsTrigger value="links" className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Links
            </TabsTrigger>
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Media
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">About</h3>
                <div className="space-y-4 text-gray-400">
                  {profile.bio ? (
                    <p>{profile.bio}</p>
                  ) : (
                    <p className="italic">No bio available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="links" className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Links</h3>
                <div className="space-y-4">
                  {profile.website ? (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary-400 hover:text-primary-300"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      {profile.website}
                    </a>
                  ) : (
                    <p className="text-gray-400 italic">No links available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts" className="mt-6">
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
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Media</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {content?.filter(item => item.content_type === "image").length ? (
                    content
                      .filter(item => item.content_type === "image")
                      .map(item => (
                        <div key={item.id} className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                          <img
                            src="/placeholder.svg"
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))
                  ) : (
                    <p className="text-gray-400 italic col-span-full">No media available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;