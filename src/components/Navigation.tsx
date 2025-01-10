import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

export function Navigation() {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  return (
    <nav className="border-b border-gray-800 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-400">
              ContentSub
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/explore">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
                Explore
              </Button>
            </Link>
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={handleSignOut}
                  className="text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="default" className="bg-primary-600 hover:bg-primary-700 text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}