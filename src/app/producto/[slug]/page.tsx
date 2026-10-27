import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Advertencia from "@/components/Advertencia";
import AgregarAlCarro from "@/components/AgregarAlCarro";
import ArteProducto from "@/components/ArteProducto";
import TarjetaProducto, { TextoStock } from "@/components/TarjetaProducto";
import { PRODUCTOS, categoria, producto, repuestosPara } from "@/lib/catalogo";
import { clp } from "@/lib/formato";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTOS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = producto((await params).slug);
  return { title: p?.nombre, description: p?.descripcion };
}

export default async function FichaProducto({ params }: Props) {
  const p = producto((await params).slug);
  if (!p) notFound();
  const cat = categoria(p.categoria);
  const repuestos = p.categoria === "equipos" ? repuestosPara(p.slug) : [];
  const equipo = p.equipo ? producto(p.equipo) : undefined;

  return (
    <div className="wrap pagina">
      <nav className="migas" aria-label="Migas">
        <Link href="/">Inicio</Link> / {cat ? <Link href={`/${cat.slug}`}>{cat.nombre}</Link> : null} /{" "}
        <span>{p.nombre}</span>
      </nav>

      <div className="ficha">
        <div className="galeria">
          <div className="principal">
            <ArteProducto arte={p.arte} color={p.color} />
          </div>
          <p className="muted nota-foto">Imagen referencial. Las fotos reales llegan con el stock.</p>
        </div>

        <div className="info">
          <span className="marca">{p.marca}</span>
          <h1>{p.nombre}</h1>
          <div className="linea-precio">
            <span className="precio">{clp(p.precio)}</span>
            <span className="muted">IVA incluido</span>
            <TextoStock stock={p.stock} />
          </div>
          <p>{p.descripcion}</p>

          <AgregarAlCarro p={p} />

          <Advertencia nicotina={p.nicotina} />

          {p.elegido ? (
            <div className="elegido">
              <b>Elegido por Vapeur</b>
              <span>{p.elegido}</span>
            </div>
          ) : null}

          <ul className="garantias">
            <li>Despacho en Santiago: 24 a 48 h hábiles. Costo visible antes de pagar.</li>
            <li>Se entrega solo a una persona mayor de 18 años con carnet.</li>
            <li>Producto original con garantía legal.</li>
          </ul>

          <div className="acordeon">
            <details open>
              <summary>Características</summary>
              <p>{p.dato}</p>
            </details>
            {p.compatible || equipo ? (
              <details>
                <summary>Compatible con</summary>
                <p>
                  {p.compatible ?? (
                    <>
                      Sirve para <Link href={`/producto/${equipo!.slug}`}>{equipo!.nombre}</Link>.
                    </>
                  )}
                </p>
              </details>
            ) : null}
            <details>
              <summary>Despacho y cambios</summary>
              <p>
                Ver <Link href="/ayuda/despacho">despacho y plazos</Link> y{" "}
                <Link href="/ayuda/cambios-y-garantia">cambios y garantía</Link>.
              </p>
            </details>
          </div>
        </div>
      </div>

      {repuestos.length > 0 ? (
        <section className="seccion">
          <div className="titulo-seccion">
            <h2>Repuestos para este equipo</h2>
          </div>
          <div className="grilla">
            {repuestos.map((r) => (
              <TarjetaProducto key={r.slug} p={r} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
