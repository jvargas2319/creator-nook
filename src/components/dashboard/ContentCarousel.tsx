import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageCircle, Heart, Share2, Pencil, Trash2 } from "lucide-react";
import type { Content, Profile } from "./types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface ContentCarouselProps {
  content: Content[];
  profile: Profile;
}

export const ContentCarousel = ({ content: initialContent, profile }: ContentCarouselProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  useEffect(() => {
    // Subscribe to real-time updates
    const channel = supabase
      .channel('public:content')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'content'
        },
        (payload) => {
          // Add the new post to the content array
          setContent(prevContent => [payload.new as Content, ...prevContent]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (content.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No posts yet. Create your first post!
      </div>
    );
  }

  const handleDelete = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Post deleted successfully",
        description: "Your post has been removed.",
      });

      // Remove the deleted post from the local state
      setContent(prevContent => prevContent.filter(item => item.id !== postId));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting post",
        description: error.message,
      });
    }
  };

  const parseAdditionalMedia = (contentUrl: string | null) => {
    if (!contentUrl) return [];
    try {
      return JSON.parse(contentUrl);
    } catch {
      return [];
    }
  };

  return (
    <div className="space-y-4">
      {content.map((item) => (
        <Card 
          key={item.id} 
          className={`bg-[#1A1A1A] border-gray-800 ${
            item.creator_id === user?.id ? 'border-l-4 border-l-primary' : ''
          }`}
        >
          <CardContent className="p-4">
            {/* Post Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={item.profile?.avatar_url || undefined} />
                  <AvatarFallback>
                    {item.profile?.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-white">
                    {item.profile?.full_name || item.profile?.username}
                  </h3>
                  <p className="text-sm text-gray-400">
                    @{item.profile?.username}{" "}
                    {item.published_at && (
                      <span className="ml-2">
                        · {formatDistanceToNow(new Date(item.published_at))} ago
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.is_premium && (
                  <span className="px-2 py-1 text-xs bg-primary text-white rounded">
                    Premium
                  </span>
                )}
                {item.creator_id === user?.id && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Post Content */}
            <div className="space-y-2">
              <p className="text-white whitespace-pre-wrap">{item.description}</p>
              
              {/* Media Gallery */}
              <div className="space-y-2">
                {/* Main Media */}
                {item.content_image_url && (
                  <div className="rounded-lg overflow-hidden">
                    <div className="h-[250px] w-full flex items-center justify-center bg-black/10">
                      <img
                        src={item.content_image_url}
                        alt={item.title}
                        className="h-[250px] w-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Additional Media */}
                {item.content_url && (
                  <div className={`grid ${
                    parseAdditionalMedia(item.content_url).length > 1 ? 'grid-cols-2' : 'grid-cols-1'
                  } gap-2`}>
                    {parseAdditionalMedia(item.content_url).map((media: { url: string, type: string }, index: number) => (
                      <div key={index} className="rounded-lg overflow-hidden">
                        <div className="h-[200px] w-full flex items-center justify-center bg-black/10">
                          {media.type === "image" ? (
                            <img
                              src={media.url}
                              alt={`Additional media ${index + 1}`}
                              className="h-[200px] w-full object-cover"
                            />
                          ) : media.type === "video" ? (
                            <video
                              src={media.url}
                              controls
                              className="h-[200px] w-full object-cover"
                            />
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Post Actions */}
            <div className="flex items-center gap-6 mt-4 text-gray-400">
              <button className="flex items-center gap-2 hover:text-primary transition-colors">
                <Heart className="h-5 w-5" />
                <span>0</span>
              </button>
              <button className="flex items-center gap-2 hover:text-primary transition-colors">
                <MessageCircle className="h-5 w-5" />
                <span>0</span>
              </button>
              <button className="flex items-center gap-2 hover:text-primary transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};