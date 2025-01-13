import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageCircle, Heart, Share2 } from "lucide-react";
import type { Content } from "./types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface ContentCarouselProps {
  content: Content[];
  profile?: {
    username?: string | null;
    avatar_url?: string | null;
    full_name?: string | null;
  };
}

export const ContentCarousel = ({ content, profile }: ContentCarouselProps) => {
  if (content.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No posts yet. Create your first post!
      </div>
    );
  }

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
        <Card key={item.id} className="bg-[#1A1A1A] border-gray-800">
          <CardContent className="p-4">
            {/* Post Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback>
                    {profile?.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-white">
                    {profile?.full_name || profile?.username}
                  </h3>
                  <p className="text-sm text-gray-400">
                    @{profile?.username}{" "}
                    {item.published_at && (
                      <span className="ml-2">
                        · {formatDistanceToNow(new Date(item.published_at))} ago
                      </span>
                    )}
                  </p>
                </div>
              </div>
              {item.is_premium && (
                <span className="px-2 py-1 text-xs bg-primary text-white rounded">
                  Premium
                </span>
              )}
            </div>

            {/* Post Content */}
            <div className="space-y-3">
              <p className="text-white whitespace-pre-wrap">{item.description}</p>
              
              {/* Main Media */}
              {item.content_image_url && (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={item.content_image_url}
                    alt={item.title}
                    className="w-full h-auto max-h-[500px] object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Additional Media */}
              {item.content_url && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {parseAdditionalMedia(item.content_url).map((media: { url: string, type: string }, index: number) => (
                    <div key={index} className="rounded-lg overflow-hidden">
                      {media.type === "image" ? (
                        <img
                          src={media.url}
                          alt={`Additional media ${index + 1}`}
                          className="w-full h-auto max-h-[300px] object-cover rounded-lg"
                        />
                      ) : media.type === "video" ? (
                        <video
                          src={media.url}
                          controls
                          className="w-full rounded-lg"
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
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