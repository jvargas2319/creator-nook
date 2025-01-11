import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Navigation } from "@/components/Navigation";
import { MapPin, Mail, DollarSign, Calendar } from "lucide-react";
import type { Profile, Content } from "@/components/dashboard/types";

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
                    <Mail className="h-4 w-4 mr-1" />
                    Contact
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

        {/* Content Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Content</h2>
          </div>

          {isLoadingContent ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="aspect-video w-full" />
              ))}
            </div>
          ) : content?.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No content yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content?.map((item) => (
                <Card key={item.id} className="bg-gray-800 border-gray-700 overflow-hidden group">
                  <CardContent className="p-0">
                    <div className="relative aspect-video">
                      <img
                        src="/placeholder.svg"
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      {item.is_premium && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-primary-600 text-white px-2 py-1 rounded text-xs">
                            Premium
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;