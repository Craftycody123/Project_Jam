import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  User,
  Shirt,
  Upload,
  Sparkles,
  Box,
  Clock,
} from "lucide-react";

const links = [
  { to: "/profile", label: "Profile", icon: User },
  { to: "/upload", label: "Upload", icon: Upload },
   { to: "/wardrobe", label: "Wardrobe", icon: LayoutGrid },
  { to: "/outfitbuilder", label: "Outfit Builder", icon: Sparkles },
  { to: "/mannequin", label: "Mannequin", icon: Box },
  { to: "/history", label: "History", icon: Clock },
];

export default function AppNav() {
  const { pathname } = useLocation();

  return (
    <>
      <aside className="sticky top-0 hidden md:flex h-screen w-60 shrink-0 flex-col border-r border-border bg-sidebar px-4 py-6">
        <Link to="/" className="mb-8 flex items-center gap-2 px-2">
          <span className="flex w-9 h-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shirt className="w-5 h-5" />
          </span>
          <span className="font-serif text-xl font-semibold tracking-tight">
            Atelier
          </span>
        </Link>

        <nav className="flex flex-col gap-1">
          {links.map((l) => {
            const active = pathname === l.to;

            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/80 hover:bg-secondary hover:text-foreground"
                }`}
              >
                <l.icon className="w-5 h-5" />
                {l.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex md:hidden items-center justify-around border-t border-border bg-sidebar/95 backdrop-blur px-2 py-2">
        {links.map((l) => {
          const active = pathname === l.to;

          return (
            <Link
              key={l.to}
              to={l.to}
              className={`flex flex-col items-center gap-0.5 rounded-md px-3 py-1 text-[11px] font-medium ${
                active ? "text-accent" : "text-muted-foreground"
              }`}
            >
              <l.icon className="w-5 h-5" />
              {l.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}