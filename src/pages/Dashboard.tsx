import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { CreatorDashboard } from "@/components/dashboard/CreatorDashboard";
import { SubscriberDashboard } from "@/components/dashboard/SubscriberDashboard";
import type { Profile, Content } from "@/components/dashboard/types";

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
      </main>
    </div>
  );
};

export default Dashboard;