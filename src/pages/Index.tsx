import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 dark">
      <Navigation />
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-white mb-6 animate-fadeIn">
          Share Your Content,
          <br />
          <span className="text-primary-400">Build Your Community</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto animate-fadeIn">
          ContentSub is the platform where creators can share their unique content and build a
          sustainable income through subscriptions.
        </p>
        <div className="flex justify-center gap-4 animate-fadeIn">
          <Link to="/signup">
            <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white">
              Get Started
            </Button>
          </Link>
          <Link to="/explore">
            <Button size="lg" variant="outline" className="border-gray-500 text-gray-300 hover:text-white hover:border-gray-400">
              Explore Content
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Index;