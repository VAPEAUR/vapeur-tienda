import Link from "next/link";
import type { PaginaInfo } from "@/lib/paginas";

export default function PaginaTexto({ seccion, pagina }: { seccion: string; pagina: PaginaInfo }) {
  return (
    <div className="wrap pagina angosta texto-largo">
      <nav className="migas" aria-label="Migas">
        <Link href="/">Inicio</Link> / <span>{seccion}</span>
      </nav>
      <h1>{pagina.titulo}</h1>
      {pagina.parrafos.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}
