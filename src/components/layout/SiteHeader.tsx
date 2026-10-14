"use client";

import { ChevronDown, Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { MAIN_NAV } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { getProducts } from "@/domain/catalog";
import { useQuoteAgent } from "@/features/quote-agent";
import { cn } from "@/lib/cn";

const navLink =
  "relative inline-flex min-h-11 items-center gap-1 rounded px-2.5 text-[15px] font-medium text-ink-soft hover:text-ink aria-[current=page]:text-ink";

function ActiveBar() {
  return <span aria-hidden className="absolute inset-x-2.5 -bottom-[11px] h-0.5 bg-accent" />;
}

/**
 * Barra de navegación: fija, clara y con menú de productos.
 * Todas las rutas son internas; las secciones sin contenido muestran "Próximamente".
 */
export function SiteHeader() {
  const pathname = usePathname();
  const { open: openAgent } = useQuoteAgent();
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const productsRef = useRef<HTMLLIElement>(null);
  const menuId = useId();
  const productsId = useId();
  const products = getProducts();

  // Cierra los menús al navegar (ajuste de estado durante el render, sin efecto).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
    setProductsOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!productsOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setProductsOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!productsRef.current?.contains(e.target as Node)) setProductsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [productsOpen]);

  const isProductsActive =
    pathname === "/" ||
    pathname.startsWith("/productos") ||
    siteConfig.productFamilies.some((f) => f.href === pathname);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur transition-shadow",
        scrolled && "shadow-[0_8px_24px_-16px_rgba(16,20,23,0.45)]",
      )}
    >
      <Container className="flex min-h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex shrink-0 items-baseline gap-2"
          aria-label="Euroheaters México, controladores"
        >
          <span className="font-display text-2xl font-extrabold tracking-wide uppercase">
            Euroheaters
          </span>
          <span className="font-mono text-[11px] text-muted uppercase">Peru</span>
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center">
            {MAIN_NAV.map((item) =>
              "type" in item ? (
                <li key={item.label} ref={productsRef} className="relative">
                  <button
                    type="button"
                    aria-expanded={productsOpen}
                    aria-controls={productsId}
                    onClick={() => setProductsOpen((v) => !v)}
                    className={cn(navLink, isProductsActive && "text-ink")}
                  >
                    {item.label}
                    <ChevronDown
                      aria-hidden
                      className={cn("size-4 transition-transform", productsOpen && "rotate-180")}
                    />
                    {isProductsActive && <ActiveBar />}
                  </button>
                  {productsOpen && <ProductsMenu id={productsId} products={products} />}
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={navLink}
                  >
                    {item.label}
                    {pathname === item.href && <ActiveBar />}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${siteConfig.contact.phone}`}
            aria-label={`Llamar al ${siteConfig.contact.phoneLabel}`}
            className="hidden size-11 place-items-center rounded border border-line hover:border-ink sm:grid"
          >
            <Phone aria-hidden className="size-4" />
          </a>
          <button
            type="button"
            onClick={() => openAgent()}
            className="hidden min-h-11 items-center rounded bg-accent px-4 text-[15px] font-semibold text-white hover:bg-accent-hover sm:inline-flex"
          >
            Cotizar
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            className="grid size-11 place-items-center rounded border border-line lg:hidden"
          >
            {menuOpen ? (
              <X aria-hidden className="size-5" />
            ) : (
              <Menu aria-hidden className="size-5" />
            )}
          </button>
        </div>
      </Container>

      {menuOpen && (
        <nav id={menuId} aria-label="Principal" className="border-t border-line bg-paper lg:hidden">
          <Container className="flex max-h-[calc(100dvh-4rem)] flex-col gap-5 overflow-y-auto py-5">
            <div className="flex flex-col gap-1">
              <p className="font-mono text-[11px] tracking-[0.1em] text-accent uppercase">
                Controladores
              </p>
              <ul className="grid grid-cols-2 gap-2 pt-1">
                {products.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/productos/${p.slug}`}
                      aria-current={pathname === `/productos/${p.slug}` ? "page" : undefined}
                      className="flex min-h-11 items-center rounded-md border border-line px-3 py-2 text-sm font-semibold aria-[current=page]:border-ink"
                    >
                      {p.shortName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <ul className="grid grid-cols-2 gap-x-4 border-t border-line-soft pt-3">
              {[
                ...MAIN_NAV.filter((i): i is { label: string; href: string } => "href" in i),
                ...siteConfig.productFamilies,
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={pathname === l.href ? "page" : undefined}
                    className="flex min-h-11 items-center text-[15px] aria-[current=page]:font-semibold"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openAgent();
                }}
                className="min-h-12 flex-1 rounded bg-accent font-semibold text-white"
              >
                Cotizar
              </button>
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded border-[1.5px] border-ink font-semibold"
              >
                <Phone aria-hidden className="size-4" /> Llamar
              </a>
            </div>
          </Container>
        </nav>
      )}
    </header>
  );
}

function ProductsMenu({ id, products }: { id: string; products: ReturnType<typeof getProducts> }) {
  return (
    <div
      id={id}
      className="absolute top-[calc(100%+12px)] left-1/2 flex w-[640px] -translate-x-1/2 gap-6 rounded-lg border border-line bg-paper p-5 shadow-[0_24px_48px_-24px_rgba(16,20,23,0.45)]"
    >
      <div className="flex flex-[1.4] flex-col gap-2">
        <p className="font-mono text-[11px] tracking-[0.1em] text-accent uppercase">
          Controladores
        </p>
        <ul className="grid grid-cols-2 gap-2">
          {products.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/productos/${p.slug}`}
                className="flex items-center gap-3 rounded-md p-2 hover:bg-canvas"
              >
                <span className="relative size-12 shrink-0 rounded border border-line-soft bg-paper">
                  <Image
                    src={p.images[0].src}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-contain p-1"
                  />
                </span>
                <span className="text-sm leading-tight font-semibold">{p.shortName}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/" className="mt-1 text-sm font-semibold text-accent hover:underline">
          Ver todos los controladores →
        </Link>
      </div>
      <div className="flex flex-1 flex-col gap-2 border-l border-line-soft pl-6">
        <p className="font-mono text-[11px] tracking-[0.1em] text-muted uppercase">Otras líneas</p>
        <ul className="flex flex-col">
          {siteConfig.productFamilies.map((f) => (
            <li key={f.href}>
              <Link
                href={f.href}
                className="flex min-h-10 items-center justify-between gap-2 rounded px-2 text-sm hover:bg-canvas"
              >
                {f.label}
                <span className="rounded bg-canvas px-1.5 py-0.5 font-mono text-[10px] text-muted uppercase">
                  Pronto
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
