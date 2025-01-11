import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function Navigation() {
  const { data: profile } = useQuery({
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
            <Link to="/logout" className="text-gray-300 hover:text-white">
              Logout
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}