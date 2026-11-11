import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export type PromoKind = "service" | "style" | "experience" | "product";
export interface Promo { id: string; kind: PromoKind; title: string; offer: string; href: string; }

// Sample promotions — replace with real offers.
export const PROMOS: Promo[] = [
  { id: "p1", kind: "service", title: "First Fade", offer: "20% off your first cut", href: "/" },
  { id: "p2", kind: "style", title: "Knotless Braids", offer: "Free wash with any braid style", href: "/" },
  { id: "p3", kind: "experience", title: "Wellness Retreat", offer: "Early bird R500 off", href: "/shop" },
  { id: "p4", kind: "product", title: "Metaparlour Tracksuit", offer: "Buy 2, get 15% off", href: "/shop" },
];

export default function PromoBanner({ promos = PROMOS }: { promos?: Promo[] }) {
  if (!promos.length) return null;
  return (
    <Carousel opts={{ loop: true }} className="mb-8">
      <CarouselContent>
        {promos.map((p) => (
          <CarouselItem key={p.id} className="sm:basis-1/2 lg:basis-1/3">
            <div className="h-full rounded-lg border bg-accent p-5 text-accent-foreground">
              <Badge variant="secondary" className="mb-3 capitalize">{p.kind}</Badge>
              <h3 className="text-2xl text-foreground">{p.title}</h3>
              <p className="mb-4 text-sm">{p.offer}</p>
              <Button asChild size="sm"><a href={p.href}>Claim offer</a></Button>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
