import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-start gap-5 py-24">
      <span className="font-mono text-sm text-accent">404</span>
      <h1 className="font-display text-5xl font-extrabold uppercase">Página no encontrada</h1>
      <p className="text-ink-soft">La página que busca no existe o cambió de dirección.</p>
      <ButtonLink href="/">Ver todos los controladores</ButtonLink>
    </Container>
  );
}
