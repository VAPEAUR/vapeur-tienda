import Link from "next/link";
import ListaProductos from "@/components/ListaProductos";
import type { Producto } from "@/lib/catalogo";

export default function PaginaListado({
  titulo,
  bajada,
  migas,
  productos,
  children,
}: {
  titulo: string;
  bajada: string;
  migas: string;
  productos: Producto[];
  children?: React.ReactNode;
}) {
  return (
    <div className="wrap pagina">
      <nav className="migas" aria-label="Migas">
        <Link href="/">Inicio</Link> / <span>{migas}</span>
      </nav>
      <header className="cabecera-listado">
        <h1>{titulo}</h1>
        <p className="muted">{bajada}</p>
      </header>
      {children}
      {productos.length > 0 ? (
        <ListaProductos productos={productos} />
      ) : (
        <p className="vacio">Pronto tendremos productos aquí.</p>
      )}
    </div>
  );
}
