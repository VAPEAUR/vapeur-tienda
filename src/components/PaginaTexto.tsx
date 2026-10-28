import Link from "next/link";
import type { PaginaInfo } from "@/lib/paginas";

export default function PaginaTexto({ seccion, pagina }: { seccion: string; pagina: PaginaInfo }) {
  return (
    <div className="wrap pagina angosta texto-largo">
      <nav className="migas" aria-label="Migas">
        <Link href="/">Inicio</Link> / <span>{seccion}</span>
      </nav>
      <h1>{pagina.titulo}</h1>
      {pagina.vigencia ? <p className="muted">{pagina.vigencia}</p> : null}
      {pagina.parrafos.map((p) => (
        <p key={p}>{p}</p>
      ))}
      {pagina.secciones?.map((s) => (
        <section key={s.titulo} className="texto-seccion">
          <h2>{s.titulo}</h2>
          {s.parrafos?.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {s.lista ? (
            <ul>
              {s.lista.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
      {pagina.accion ? (
        <p className="pagina-accion">
          <a
            href={pagina.accion.href}
            className="boton"
            target={pagina.accion.externo ? "_blank" : undefined}
            rel={pagina.accion.externo ? "noopener noreferrer" : undefined}
          >
            {pagina.accion.texto}
          </a>
        </p>
      ) : null}
    </div>
  );
}
