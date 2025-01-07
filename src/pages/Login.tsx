import { Navigation } from "@/components/Navigation";
import { LoginForm } from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <LoginForm />
      </main>
    </div>
  );
};

export default Login;