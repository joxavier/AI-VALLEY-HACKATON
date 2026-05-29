import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, MapPin, Users, Sparkles, ShoppingBag, FilterX, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ProductAddition {
  name: string;
  description: string;
  options: string[];
}

interface MerchProduct {
  productId: string;
  service?: string;
  type: string;
  name: string;
  description: string;
  image: string;
  price: number;
  additions: ProductAddition[];
  associatedTags?: string[];
}

const merchProducts: MerchProduct[] = [
  {
    productId: "prod_TO1JOcXDlw62qN",
    service: "",
    type: "Products",
    name: "Metaparlour Tracksuit",
    description:
      "The Metaparlour Tracksuit blends luxury comfort with modern design. Crafted from premium EcoTech™ fabric, it delivers a weighted cozy, structured fit made for movement and focus. Featuring 3D MP embroidery, and tapered lines — it's where wellness meets innovation. Unisex. Limited Edition.",
    image: "/MPhoodie.png",
    price: 220,
    additions: [
      {
        name: "Size",
        description: "Hoodies fit Regular",
        options: ["Small", "Medium", "Large", "X-Large"],
      },
      {
        name: "Pieces",
        description: "Select your style",
        options: ["Tracksuit", "Hoodie", "Joggers"],
      },
    ],
    associatedTags: [],
  },
];

const ProductCard = ({ product }: { product: MerchProduct }) => {
  const [selections, setSelections] = useState<Record<string, string>>(() =>
    product.additions.reduce(
      (acc, a) => ({ ...acc, [a.name]: a.options[0] }),
      {} as Record<string, string>,
    ),
  );
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    const missing = product.additions.find((a) => !selections[a.name]);
    if (missing) {
      toast({
        title: `Select a ${missing.name.toLowerCase()}`,
        description: missing.description,
      });
      return;
    }
    setAdded(true);
    toast({
      title: "Added to cart",
      description: `${product.name} — ${Object.entries(selections)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ")}`,
    });
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="group overflow-hidden border-border/60 bg-card hover:border-primary/60 transition-colors h-full flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
            Limited
          </Badge>
        </div>

        <CardContent className="p-5 space-y-4 flex-1 flex flex-col">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-xl tracking-wide group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <div className="text-lg font-semibold text-primary whitespace-nowrap">
                R{product.price}
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {product.description}
            </p>
          </div>

          <div className="space-y-3 flex-1">
            {product.additions.map((addition) => (
              <div key={addition.name} className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <label className="text-xs font-medium uppercase tracking-wider">
                    {addition.name}
                  </label>
                  <span className="text-[10px] text-muted-foreground">
                    {addition.description}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {addition.options.map((opt) => {
                    const active = selections[addition.name] === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          setSelections((s) => ({ ...s, [addition.name]: opt }))
                        }
                        className={cn(
                          "px-3 py-1.5 rounded-md text-xs border transition-colors",
                          active
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border hover:border-primary/60",
                        )}
                      >
                        {active && <Check className="inline h-3 w-3 mr-1" />}
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <Button
            variant={added ? "secondary" : "default"}
            className="w-full"
            onClick={handleAddToCart}
          >
            {added ? "✓ Added to Cart" : "Add to Cart"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

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
  type: "learning" | "retreat";
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
    type: "learning",
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
  const [added, setAdded] = useState(false);

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`/shop/services/${event.url}`, "_blank");
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAdded(true);
    toast({ title: "Added to cart", description: event.title });
  };
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
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground capitalize">
            {event.type}
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

          <div className="pt-2 space-y-2">
            <Button
              className="w-full"
              onClick={handleBookNow}
            >
              Book Now
            </Button>
            <Button
              variant={added ? "secondary" : "outline"}
              className="w-full"
              onClick={handleAddToCart}
            >
              {added ? "✓ Added to Cart" : "Add to Cart"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Shop = () => {
  const navigate = useNavigate();
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const uniqueLocations = useMemo(
    () => Array.from(new Set(events.map((e) => e.location))),
    []
  );

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchLocation =
        locationFilter === "all" || event.location === locationFilter;
      const matchType =
        typeFilter === "all" || event.type === typeFilter;
      return matchLocation && matchType;
    });
  }, [locationFilter, typeFilter]);

  const hasActiveFilters = locationFilter !== "all" || typeFilter !== "all";

  const clearFilters = () => {
    setLocationFilter("all");
    setTypeFilter("all");
  };

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
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All locations</SelectItem>
                  {uniqueLocations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                  <SelectItem value="retreat">Retreat</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <FilterX className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {filteredEvents.length === 0 ? (
              <div className="text-center py-20">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  No experiences match your filters.
                </p>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="mt-4"
                  >
                    Reset filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEvents.map((event) => (
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
