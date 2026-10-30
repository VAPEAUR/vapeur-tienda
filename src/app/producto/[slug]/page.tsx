import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Advertencia from "@/components/Advertencia";
import AgregarAlCarro from "@/components/AgregarAlCarro";
import ArteProducto from "@/components/ArteProducto";
import CalculaDespacho from "@/components/CalculaDespacho";
import FechaCompra from "@/components/FechaCompra";
import EscalaNicotina from "@/components/EscalaNicotina";
import PagoSeguro from "@/components/PagoSeguro";
import TarjetaProducto, { TextoStock } from "@/components/TarjetaProducto";
import { categoria, slugMarca } from "@/lib/catalogo";
import { obtenerCatalogo } from "@/lib/datos";
import { clp, sinCorte } from "@/lib/formato";
import { GARANTIA_CORTA, RETRACTO_CORTO } from "@/lib/legal";
import { DatosEstructurados, datosProducto, descripcionProducto } from "@/lib/seo";
import { colorArte, NOMBRE_TIPO, tipoDe } from "@/lib/tipo-producto";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { producto } = await obtenerCatalogo();
  const p = producto((await params).slug);
  if (!p) return {};
  return {
    // La marca adelante ("Vaporesso XROS 4 kit pod"), salvo la línea propia.
    title: p.marca.startsWith("Vapeur") ? p.nombre : `${p.marca} ${p.nombre}`,
    description: descripcionProducto(p),
    alternates: { canonical: `/producto/${p.slug}` },
  };
}

// Ficha en la vitrina de estudio: foto sobre el fondo de su tipo con su banda,
// escala de nicotina neutra en líquidos y advertencia en blanco sobre negro.
export default async function FichaProducto({ params }: Props) {
  const { producto, repuestosPara } = await obtenerCatalogo();
  const p = producto((await params).slug);
  if (!p) notFound();
  const cat = categoria(p.categoria);
  const repuestos = p.categoria === "equipos" ? repuestosPara(p.slug) : [];
  const equipo = p.equipo ? producto(p.equipo) : undefined;

  return (
    <>
      <div className="wrap pagina">
        <DatosEstructurados datos={datosProducto(p, cat)} />
        <nav className="migas" aria-label="Migas">
          <Link href="/">Inicio</Link> / {cat ? <Link href={`/${cat.slug}`}>{cat.nombre}</Link> : null} /{" "}
          <span>{p.nombre}</span>
        </nav>

        <div className={`ficha tipo-${tipoDe(p.categoria)}`}>
          <div className="galeria">
            <div className="principal foto-estudio">
              <ArteProducto arte={p.arte} color={colorArte(p)} />
              <span className="banda" aria-hidden="true" />
            </div>
            <p className="muted nota-foto">Imagen referencial. Las fotos reales llegan con el stock.</p>
          </div>

          <div className="info">
            <p className="rotulo-ficha">
              <span className="rotulo-tipo">{NOMBRE_TIPO[p.categoria] ?? "Producto"}</span>
              <Link href={`/marcas/${slugMarca(p.marca)}`} className="marca">
                {p.marca}
              </Link>
            </p>
            <h1>{sinCorte(p.nombre)}</h1>
            <div className="linea-precio">
              <span className="precio">{clp(p.precio)}</span>
              <span className="muted">IVA incluido</span>
              <TextoStock stock={p.stock} />
            </div>
            <EscalaNicotina p={p} />
            <p className="aviso-retracto">
              {RETRACTO_CORTO} <Link href="/legal/retracto">Ver detalle</Link>
            </p>
            <p>{p.descripcion}</p>

            {p.stock > 0 ? <FechaCompra /> : null}
            <AgregarAlCarro p={p} />
            <PagoSeguro />

            <Advertencia producto={p} />

            {p.elegido ? (
              <div className="elegido">
                <b>Elegido por Vapeur</b>
                <span>{p.elegido}</span>
              </div>
            ) : null}

            <ul className="garantias">
              <li>Despacho a domicilio: costo y plazo según tu comuna, visibles antes de pagar.</li>
              <li>Se entrega solo a una persona mayor de 18 años con carnet.</li>
              <li>{GARANTIA_CORTA}</li>
            </ul>

            <CalculaDespacho items={[{ slug: p.slug, cantidad: 1 }]} />

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
      </div>

      {repuestos.length > 0 ? (
        <section className="seccion-color piedra">
          <div className="wrap">
            <div className="titulo-seccion con-enlace">
              <div>
                <span className="etiqueta">Compatibles</span>
                <h2>Repuestos para este equipo</h2>
              </div>
              <Link href={`/repuestos/${p.slug}`} className="ver-todo">
                Ver todos
              </Link>
            </div>
            <div className="grilla">
              {repuestos.map((r) => (
                <TarjetaProducto key={r.slug} p={r} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
