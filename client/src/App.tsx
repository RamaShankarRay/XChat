import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import LoginScreen from "@/pages/LoginScreen";
import ProfileSetup from "@/pages/ProfileSetup";
import MainApp from "@/pages/MainApp";
import SettingsScreen from "@/pages/SettingsScreen";
import NotFound from "@/pages/not-found";

function AuthenticatedRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-whatsapp-bg dark:bg-whatsapp-dark-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-whatsapp-green"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  // Check if user needs to complete profile setup
  const needsProfileSetup = !user.displayName || user.displayName === 'User';

  if (needsProfileSetup) {
    return <ProfileSetup />;
  }

  return (
    <Switch>
      <Route path="/home" component={MainApp} />
      <Route path="/settings" component={SettingsScreen} />
      <Route path="/" component={MainApp} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="*" component={AuthenticatedRoutes} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
