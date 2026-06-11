import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  items: FAQItem[];
}

export function FAQSection({
  title = "Frequently Asked Questions",
  items,
}: FAQSectionProps) {
  return (
    <section className="w-full py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <HelpCircle className="w-6 h-6 text-[hsl(var(--primary))]" />
          <h2 className="text-2xl md:text-3xl font-bold tracking-wide text-foreground">
            {title}
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-[hsl(var(--border))]"
            >
              <AccordionTrigger className="text-left text-foreground hover:text-[hsl(var(--primary))] hover:no-underline py-5 text-base md:text-lg font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-[hsl(var(--muted-foreground))] text-sm md:text-base leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export const betaDemoFAQItems: FAQItem[] = [
  {
    question: "What is Metaparlour?",
    answer:
      "Metaparlour is the upcoming, AI-powered operating system and marketplace designed specifically for independent beauty, grooming, and wellness professionals. We combine hyper-local discovery, automated client retention tools, integrated booking, and secure payment processing into one seamless platform.",
  },
  {
    question: "What do I get with the Beta Demo ticket?",
    answer:
      "The Beta Demo ticket is exclusively available to founding members and early backers. It grants VIP entry to the live demo, permanent premium software perks upon public launch, and a strategic equity allocation (0.1%) within the Metaparlour ecosystem.",
  },
  {
    question: "When and where is the event being held?",
    answer:
      "The launch demo runs from August 21 to August 24, 2026 in Toronto, Ontario. Registered ticket holders will receive precise venue, studio location details, and the daily session schedule straight to their email inbox prior to the kickoff.",
  },
];

export function BetaDemoFAQ() {
  return (
    <FAQSection
      title="Metaparlour Toronto Beta Demo: Frequently Asked Questions"
      items={betaDemoFAQItems}
    />
  );
}
