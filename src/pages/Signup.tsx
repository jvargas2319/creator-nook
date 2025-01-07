import { Navigation } from "@/components/Navigation";
import { SignupForm } from "@/components/auth/SignupForm";

const Signup = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <SignupForm />
      </main>
    </div>
  );
};

export default Signup;