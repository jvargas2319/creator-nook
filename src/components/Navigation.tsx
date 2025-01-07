import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-700">
              ContentSub
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/explore">
              <Button variant="ghost">Explore</Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button variant="default" className="bg-primary-700 hover:bg-primary-800">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}