import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Users, Sparkles, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ExperienceEvent {
  id: number;
  title: string;
  description: string;
  duration: string;
  price: number;
  level: string;
  maxStudents: number;
  image: string;
  nextSession: string;
  location: string;
  url: string;
}

const events: ExperienceEvent[] = [
  {
    id: 1,
    title: "Metaparlour VIP Experience",
    description:
      "Learn the fundamentals of building an online business. From content creation to monetization strategies and personal branding.",
    duration: "8 weeks",
    price: 299,
    level: "Beginner",
    maxStudents: 20,
    image: "/metaparlourVIPevent.png",
    nextSession: "2024-12-20",
    location: "Cape Town, South Africa",
    url: "events",
  },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-ZA", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const EventCard = ({ event }: { event: ExperienceEvent }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card
        onClick={() => navigate(`/${event.url}`)}
        className="group overflow-hidden cursor-pointer border-border/60 bg-card hover:border-primary/60 transition-colors"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={event.image}
            alt={event.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
            {event.level}
          </Badge>
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur px-2.5 py-1 rounded-md text-xs">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>{formatDate(event.nextSession)}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur px-2.5 py-1 rounded-md text-xs">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        <CardContent className="p-5 space-y-3">
          <h3 className="text-2xl tracking-wide group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-border/60">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> {event.maxStudents}
              </span>
              <span>{event.duration}</span>
            </div>
            <div className="text-lg font-semibold text-primary">
              R{event.price}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Shop = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 -ml-3"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 text-primary mb-2">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs uppercase tracking-[0.25em]">
              MetaParlour Shop
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl tracking-wide">Shop</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            Curated experiences, products and merch from MetaParlour.
          </p>
        </motion.div>

        <Tabs defaultValue="experiences" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="experiences">Experiences</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="merch">Merch</TabsTrigger>
          </TabsList>

          <TabsContent value="experiences">
            {events.length === 0 ? (
              <div className="text-center py-20">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  No experiences available at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="products">
            <div className="text-center py-20">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                Products coming soon.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="merch">
            <div className="text-center py-20">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">Merch coming soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Shop;
