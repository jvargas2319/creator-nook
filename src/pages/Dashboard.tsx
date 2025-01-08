import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Loader2, 
  Plus, 
  RefreshCw, 
  Edit3,
  Users,
  MessageCircle 
} from "lucide-react";
import { CreateContentForm } from "@/components/CreateContentForm";
import { Button } from "@/components/ui/button";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  is_creator: boolean;
}

interface Content {
  id: string;
  title: string;
  description: string;
  content_type: string;
  is_premium: boolean;
  published_at: string;
}

const placeholderImages = [
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  "https://images.unsplash.com/photo-1518770660439-4636190af475",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
];

const Dashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        if (profileData.is_creator) {
          const { data: contentData, error: contentError } = await supabase
            .from("content")
            .select("*")
            .eq("creator_id", session.user.id)
            .order("created_at", { ascending: false });

          if (contentError) throw contentError;
          setContent(contentData);
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1F2C]">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img
              src={profile?.avatar_url || "/placeholder.svg"}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-primary"
            />
            <div>
              <h1 className="text-2xl font-bold">
                Welcome, {profile?.full_name || profile?.username}
              </h1>
              <p className="text-gray-400">
                {profile?.is_creator ? "Creator Dashboard" : "Subscriber Dashboard"}
              </p>
            </div>
          </div>
          {profile?.is_creator && (
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-primary hover:bg-primary-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Content
            </Button>
          )}
        </div>

        {profile?.is_creator ? (
          <div className="grid gap-6">
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
                <Carousel className="w-full">
                  <CarouselContent>
                    {content.length === 0 ? (
                      <p className="text-gray-400">No content yet. Start creating!</p>
                    ) : (
                      content.map((item, index) => (
                        <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                          <Card className="bg-[#2A2A2A] border-gray-700">
                            <CardContent className="p-4">
                              <img
                                src={placeholderImages[index % placeholderImages.length]}
                                alt={item.title}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                              />
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-semibold text-lg">{item.title}</h3>
                                  {item.is_premium && (
                                    <span className="px-2 py-1 text-xs bg-primary text-white rounded">
                                      Premium
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-400">{item.description}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    <span>0 subscribers</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MessageCircle className="h-4 w-4" />
                                    <span>0 comments</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))
                    )}
                  </CarouselContent>
                  <CarouselPrevious className="bg-primary text-white" />
                  <CarouselNext className="bg-primary text-white" />
                </Carousel>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid gap-6">
            <Card className="bg-[#222222] border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-white">Your Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">No active subscriptions</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;