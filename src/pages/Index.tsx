import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, LayoutDashboard, LogIn, LogOut } from "lucide-react";

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <img src="/metaparlour-logo.svg" alt="MetaParlour" className="h-8" />
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => navigate("/auth")}>
              <LogIn className="mr-2 h-4 w-4" /> Sign In
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16 text-center space-y-12">
        <div className="space-y-6">
          <img
            src="/metaparlour-logo.svg"
            alt="MetaParlour"
            className="mx-auto h-24 md:h-32"
          />
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            View your booking details, check payment status, and manage your appointments.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-lg mx-auto">
          <Card
            className="cursor-pointer hover:shadow-lg hover:shadow-primary/10 transition-all border-border/50 hover:border-primary/40"
            onClick={() => navigate(user ? "/dashboard" : "/auth")}
          >
            <CardContent className="pt-8 pb-6 text-center space-y-3">
              <LayoutDashboard className="mx-auto h-10 w-10 text-primary" />
              <h3 className="text-xl">Barber Dashboard</h3>
              <p className="text-sm text-muted-foreground">View earnings, manage bookings</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg hover:shadow-primary/10 transition-all border-border/50 hover:border-primary/40"
            onClick={() => navigate("/auth")}
          >
            <CardContent className="pt-8 pb-6 text-center space-y-3">
              <Calendar className="mx-auto h-10 w-10 text-primary" />
              <h3 className="text-xl">View Booking</h3>
              <p className="text-sm text-muted-foreground">Sign in with your booking email</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
