import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle light or dark mode"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
