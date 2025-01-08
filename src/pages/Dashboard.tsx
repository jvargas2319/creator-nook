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

const Dashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

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
          <button className="p-2 hover:bg-gray-800 rounded-full">
            <RefreshCw className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="all" className="mb-8">
              <TabsList className="bg-[#1A1A1A] border-b border-gray-800 p-0 h-auto">
                <TabsTrigger
                  value="all"
                  className="px-6 py-3 data-[state=active]:bg-transparent data-[state=active]:text-primary"
                  onClick={() => setActiveTab("all")}
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="subscribed"
                  className="px-6 py-3 data-[state=active]:bg-transparent data-[state=active]:text-primary"
                  onClick={() => setActiveTab("subscribed")}
                >
                  Subscribed
                </TabsTrigger>
                <TabsTrigger
                  value="for-you"
                  className="px-6 py-3 data-[state=active]:bg-transparent data-[state=active]:text-primary"
                  onClick={() => setActiveTab("for-you")}
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
              <SubscriberDashboard profile={profile} />
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