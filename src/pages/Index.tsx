import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 animate-fadeIn">
          Share Your Content,
          <br />
          <span className="text-primary-700">Build Your Community</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fadeIn">
          ContentSub is the platform where creators can share their unique content and build a
          sustainable income through subscriptions.
        </p>
        <div className="flex justify-center gap-4 animate-fadeIn">
          <Link to="/signup">
            <Button size="lg" className="bg-primary-700 hover:bg-primary-800">
              Get Started
            </Button>
          </Link>
          <Link to="/explore">
            <Button size="lg" variant="outline">
              Explore Content
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Index;