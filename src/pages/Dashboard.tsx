import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, RefreshCw } from "lucide-react";
import { CreatorDashboard } from "@/components/dashboard/CreatorDashboard";
import { SubscriberDashboard } from "@/components/dashboard/SubscriberDashboard";
import { Suggestions } from "@/components/dashboard/Suggestions";
import type { Profile, Content } from "@/components/dashboard/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";

const POSTS_PER_PAGE = 10;

const Dashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchContent = async (userId: string, filter: string, pageNumber: number = 0) => {
    try {
      let query = supabase
        .from("content")
        .select(`
          *,
          profiles:creator_id (
            username,
            avatar_url,
            full_name
          )
        `)
        .order('published_at', { ascending: false })
        .range(pageNumber * POSTS_PER_PAGE, (pageNumber + 1) * POSTS_PER_PAGE - 1);

      // For "all" tab, we only filter by published posts
      if (filter === "all") {
        query = query.not('published_at', 'is', null);
      } else if (filter === "subscribed") {
        // Fetch only posts from users that the current user follows
        const { data: followedUsers } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', userId);
        
        const followedUserIds = followedUsers?.map(follow => follow.following_id) || [];
        
        if (followedUserIds.length > 0) {
          query = query.in('creator_id', followedUserIds);
        } else {
          setContent([]);
          setHasMore(false);
          return;
        }
      } else if (filter === "for-you") {
        // Add personalized content filter logic here
        query = query.limit(POSTS_PER_PAGE);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Transform the data to match the expected format
      const transformedContent = data?.map(item => ({
        ...item,
        profile: item.profiles
      })) || [];
      
      if (pageNumber === 0) {
        setContent(transformedContent);
      } else {
        setContent(prev => [...prev, ...transformedContent]);
      }

      // Update hasMore based on whether we got a full page of results
      setHasMore(transformedContent.length === POSTS_PER_PAGE);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching content",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setLoading(false);
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        await fetchContent(session.user.id, activeTab);
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
    // Reset page when tab changes
    setPage(0);
  }, [toast, activeTab]);

  const handleRefresh = async () => {
    if (profile) {
      setPage(0);
      await fetchContent(profile.id, activeTab);
    }
  };

  const loadMore = async () => {
    if (profile && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      await fetchContent(profile.id, activeTab, nextPage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <img
            src={profile?.avatar_url || "/placeholder.svg"}
            alt="Profile"
            className="w-12 h-12 rounded-full border-2 border-primary"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">
              {profile?.full_name || profile?.username}
            </h1>
          </div>
          <button 
            className="p-2 hover:bg-gray-800 rounded-full"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="bg-[#1A1A1A] border-b border-gray-800 p-0 h-auto">
                <TabsTrigger
                  value="all"
                  className="px-6 py-3 data-[state=active]:bg-transparent data-[state=active]:text-primary"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="subscribed"
                  className="px-6 py-3 data-[state=active]:bg-transparent data-[state=active]:text-primary"
                >
                  Subscribed
                </TabsTrigger>
                <TabsTrigger
                  value="for-you"
                  className="px-6 py-3 data-[state=active]:bg-transparent data-[state=active]:text-primary"
                >
                  For You
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {profile?.is_creator ? (
              <CreatorDashboard
                profile={profile}
                content={content}
                showCreateForm={showCreateForm}
                setShowCreateForm={setShowCreateForm}
              />
            ) : (
              <SubscriberDashboard profile={profile} content={content} />
            )}

            {hasMore && content.length > 0 && (
              <div className="mt-4 text-center">
                <button
                  onClick={loadMore}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
          
          <div className="space-y-8">
            <Suggestions />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;