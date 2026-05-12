import { SiteFooter } from "@/components/app-shell/site-footer";
import { SiteHeader } from "@/components/app-shell/site-header";

export async function AppShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-col">
      <a
        href="#main-content"
        className="bg-primary text-primary-foreground focus:not-sr-only sr-only rounded-md px-3 py-2 text-sm font-medium focus:absolute focus:left-4 focus:top-4 focus:z-[100]"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main
        id="main-content"
        className="flex flex-1 flex-col"
        tabIndex={-1}
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
