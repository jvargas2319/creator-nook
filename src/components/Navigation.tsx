import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export function Navigation() {
  const navigate = useNavigate();

  const { data: profile, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      return data;
    },
  });

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        duration: 2000,
      });
      
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-xl">
              Your App
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-gray-300 hover:text-white">
              Dashboard
            </Link>
            <Link to="/settings" className="text-gray-300 hover:text-white">
              Settings
            </Link>
            <Link 
              to={profile?.username ? `/profile/${profile.username}` : "/settings"} 
              className="text-gray-300 hover:text-white"
            >
              Profile
            </Link>
            <button 
              onClick={handleLogout}
              className="text-gray-300 hover:text-white cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}