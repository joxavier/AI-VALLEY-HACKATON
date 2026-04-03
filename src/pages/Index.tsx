import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scissors, Calendar, LayoutDashboard, LogIn, LogOut } from "lucide-react";

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scissors className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">MetaParlour</span>
          </div>
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
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
            <Scissors className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">MetaParlour</h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            View your booking details, check payment status, and manage your appointments.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-lg mx-auto">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/30"
            onClick={() => navigate(user ? "/dashboard" : "/auth")}
          >
            <CardContent className="pt-8 pb-6 text-center space-y-3">
              <LayoutDashboard className="mx-auto h-10 w-10 text-primary" />
              <h3 className="font-semibold text-lg">Barber Dashboard</h3>
              <p className="text-sm text-muted-foreground">View earnings, manage bookings</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/30"
            onClick={() => navigate(user ? "/auth" : "/auth")}
          >
            <CardContent className="pt-8 pb-6 text-center space-y-3">
              <Calendar className="mx-auto h-10 w-10 text-primary" />
              <h3 className="font-semibold text-lg">View Booking</h3>
              <p className="text-sm text-muted-foreground">Sign in with your booking email</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
