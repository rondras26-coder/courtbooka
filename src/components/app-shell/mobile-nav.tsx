"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Dialog } from "radix-ui";

import { Button } from "@/components/ui/button";
import { primaryNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0"
          aria-label="Open menu"
        >
          <Menu className="size-5" aria-hidden />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=closed]:animate-out data-[state=open]:animate-in fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right fixed top-0 right-0 z-[70] flex h-full w-[min(100%,18rem)] flex-col border-border bg-background shadow-lg duration-200 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          aria-describedby={undefined}
        >
          <div className="border-border flex h-14 items-center justify-between border-b px-4">
            <Dialog.Title className="text-sm font-semibold tracking-tight">
              Menu
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Close menu"
              >
                <X className="size-5" aria-hidden />
              </Button>
            </Dialog.Close>
          </div>
          <nav
            className="flex flex-1 flex-col gap-0.5 p-3"
            aria-label="Primary navigation"
          >
            {primaryNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Dialog.Close key={item.href} asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </Dialog.Close>
              );
            })}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
