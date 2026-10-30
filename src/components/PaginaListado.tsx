import Link from "next/link";
import ArteProducto from "@/components/ArteProducto";
import ListaProductos from "@/components/ListaProductos";
import type { Arte, Producto } from "@/lib/catalogo";
import type { Tipo } from "@/lib/tipo-producto";

type Cabecera = {
  titulo: string;
  bajada: string;
  migas: string;
  /** Dibujo y tipo de la foto de la cabecera; sin foto, la cabecera va solo con texto. */
  foto?: { arte: Arte; tipo: Tipo; color?: string };
  /** Contenido extra dentro de la cabecera, como el buscador de repuestos. */
  children?: React.ReactNode;
};

// Cabecera de listado en negro cálido, como la portada: migas, título, bajada y
// la foto del tipo sobre su fondo.
export function CabeceraListado({ titulo, bajada, migas, foto, children }: Cabecera) {
  return (
    <header className="cabecera-listado sobre-oscuro">
      <div className={foto ? "wrap cabecera-listado-caja" : "wrap cabecera-listado-caja sin-foto"}>
        <div className="cabecera-listado-texto">
          <nav className="migas" aria-label="Migas">
            <Link href="/">Inicio</Link> / <span>{migas}</span>
          </nav>
          <h1>{titulo}</h1>
          <p className="bajada">{bajada}</p>
          {children ? <div className="cabecera-listado-extra">{children}</div> : null}
        </div>
        {foto ? (
          <div className={`foto foto-estudio tipo-${foto.tipo}`} aria-hidden="true">
            <ArteProducto arte={foto.arte} color={foto.color} />
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default function PaginaListado({
  productos,
  vacio = "Pronto tendremos productos aquí.",
  ...cabecera
}: Cabecera & {
  productos: Producto[];
  /** Texto cuando no hay productos que mostrar. */
  vacio?: string;
}) {
  return (
    <>
      <CabeceraListado {...cabecera} />
      <div className="wrap pagina">
        {productos.length > 0 ? (
          <ListaProductos productos={productos} />
        ) : vacio ? (
          <p className="vacio">{vacio}</p>
        ) : null}
      </div>
    </>
  );
}
