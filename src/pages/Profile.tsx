import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
      <div className="container max-w-4xl mx-auto py-8">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container max-w-4xl mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold">Profile not found</h1>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="flex flex-col items-center space-y-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile.avatar_url || undefined} />
          <AvatarFallback>
            {profile.full_name?.[0] || profile.username?.[0] || "?"}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h1 className="text-2xl font-bold">{profile.full_name || profile.username}</h1>
          {profile.bio && <p className="text-muted-foreground mt-2">{profile.bio}</p>}
          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline mt-2 block"
            >
              {profile.website}
            </a>
          )}
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <h2 className="text-xl font-semibold mb-4">Content</h2>
        {isLoadingContent ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : content?.length === 0 ? (
          <p className="text-center text-muted-foreground">No content yet</p>
        ) : (
          <div className="space-y-6">
            {content?.map((item) => (
              <Card key={item.id} className="bg-[#1A1A1A] border-gray-800">
                <CardContent className="p-6">
                  <img
                    src="/placeholder.svg"
                    alt={item.title}
                    className="w-full aspect-video object-cover rounded-lg mb-4"
                  />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg text-white">
                        {item.title}
                      </h3>
                      {item.is_premium && (
                        <span className="bg-primary px-2 py-1 rounded text-xs">
                          Premium
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-gray-400">{item.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;