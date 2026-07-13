import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export function Placeholder({
  title,
  description,
  Icon,
}: {
  title: string;
  description: string;
  Icon: LucideIcon;
}) {
  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-sans mb-2">{title}</h1>
      <p className="text-muted-foreground mb-8">{description}</p>
      <Card>
        <CardContent className="py-16 text-center">
          <Icon className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
          <p className="font-medium">Coming soon</p>
          <p className="text-sm text-muted-foreground mt-1">
            This module is on the roadmap and will land in an upcoming release.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
