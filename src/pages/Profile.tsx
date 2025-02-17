import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Navigation } from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Search, RefreshCw, Mail, DollarSign, MoreHorizontal, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Profile, Content } from "@/components/dashboard/types";
import { ContentCarousel } from "@/components/dashboard/ContentCarousel";
import { CreatePostForm } from "@/components/profile/CreatePostForm";
import { useState } from "react";

const ProfilePage = () => {
  const { username } = useParams();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

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

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const parseAdditionalMedia = (contentUrl: string | null) => {
    if (!contentUrl) return [];
    try {
      return JSON.parse(contentUrl);
    } catch {
      return [];
    }
  };

  // Get all media from posts (main image and additional media)
  const getAllMedia = () => {
    if (!content) return [];
    
    return content.reduce((acc: Array<{ url: string, type: string }>, post) => {
      // Add main image if it exists
      if (post.content_image_url) {
        acc.push({
          url: post.content_image_url,
          type: 'image'
        });
      }
      
      // Add additional media if it exists
      const additionalMedia = parseAdditionalMedia(post.content_url);
      return [...acc, ...additionalMedia];
    }, []);
  };

  const isOwnProfile = currentUser?.id === profile?.id;

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
      
      {/* Banner Image */}
      <div className="relative h-48 md:h-64 w-full">
        {profile.banner_url ? (
          <img
            src={profile.banner_url}
            alt="Profile banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-800" />
        )}
      </div>

      <div className="container max-w-4xl mx-auto px-4">
        {/* Profile Info Section */}
        <div className="relative -mt-20 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
            {/* Avatar */}
            <Avatar className="w-32 h-32 border-4 border-gray-900">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback>{profile.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            
            {/* Profile Actions */}
            <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">{profile.full_name}</h1>
                <p className="text-gray-400">@{profile.username}</p>
              </div>
              <div className="flex gap-2">
                {isOwnProfile && (
                  <Button 
                    onClick={() => setIsCreatePostOpen(true)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                )}
                <Button variant="outline" size="icon">
                  <Mail className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <DollarSign className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          {profile.bio && (
            <div className="mt-4 text-gray-300">
              <p>{profile.bio}</p>
            </div>
          )}

          {/* Location and Website */}
          <div className="mt-4 flex flex-wrap gap-4">
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline flex items-center gap-1"
              >
                🌐 {profile.website}
              </a>
            )}
            <div className="flex items-center gap-1 text-gray-400">
              <MapPin className="h-4 w-4" />
              <span>Miami</span>
            </div>
          </div>
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
              <ContentCarousel content={content || []} profile={profile} />
            )}
          </TabsContent>

          <TabsContent value="media" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {getAllMedia().map((media, index) => (
                <div key={index} className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                  {media.type === "image" ? (
                    <img
                      src={media.url}
                      alt={`Media ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : media.type === "video" ? (
                    <video
                      src={media.url}
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <CreatePostForm
          isOpen={isCreatePostOpen}
          onClose={() => setIsCreatePostOpen(false)}
        />
      </div>
    </div>
  );
};

export default ProfilePage;