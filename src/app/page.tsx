import type { Metadata } from "next";
import Link from "next/link";
import ArteProducto from "@/components/ArteProducto";
import BuscadorRepuestos from "@/components/BuscadorRepuestos";
import Carrusel from "@/components/Carrusel";
import CarruselPortada from "@/components/CarruselPortada";
import QuizEquipo from "@/components/QuizEquipo";
import RutaPedido from "@/components/RutaPedido";
import TarjetaProducto from "@/components/TarjetaProducto";
import { type Arte, CATEGORIAS, slugMarca } from "@/lib/catalogo";
import { obtenerCatalogo } from "@/lib/datos";
import { clp } from "@/lib/formato";
import { GUIAS } from "@/lib/guias";
import { DATOS_SITIO, DatosEstructurados } from "@/lib/seo";
import { colorArte, type Tipo, tipoDe } from "@/lib/tipo-producto";

export const metadata: Metadata = { alternates: { canonical: "/" } };

// Guías de la portada, cada una con el dibujo y el fondo de su tipo.
const GUIAS_PORTADA: { slug: string; rotulo: string; arte: Arte; tipo: Tipo }[] = [
  { slug: "que-cartucho-usa-tu-equipo", rotulo: "Repuestos", arte: "coil", tipo: "repuestos" },
  { slug: "como-elegir-un-pod", rotulo: "Equipos", arte: "pod", tipo: "equipos" },
  { slug: "sales-de-nicotina-y-freebase", rotulo: "Líquidos", arte: "frasco", tipo: "liquidos" },
];

export default async function Inicio() {
  const { productos, producto, marcas, kits, precioKit } = await obtenerCatalogo();
  const elegidos = productos.filter((p) => p.elegido);
  const novedades = productos.filter((p) => p.categoria !== "equipos" && p.stock > 0).slice(0, 10);
  const principal = elegidos.find((p) => p.categoria === "equipos" && p.stock > 0);
  const tipos = [
    ...CATEGORIAS.map((c) => ({ href: `/${c.slug}`, nombre: c.nombre, bajada: c.bajada, arte: c.arte, tipo: tipoDe(c.slug) })),
    { href: "/kits", nombre: "Kits", bajada: "Equipo y repuestos juntos", arte: "mod" as Arte, tipo: "kits" as Tipo },
  ];
  const guias = GUIAS_PORTADA.flatMap((g) => {
    const guia = GUIAS.find((x) => x.slug === g.slug);
    return guia ? [{ ...g, titulo: guia.titulo, bajada: guia.bajada }] : [];
  });

  return (
    <>
      <DatosEstructurados datos={DATOS_SITIO} />
      <CarruselPortada
        destacado={
          principal
            ? {
                nombre: principal.nombre,
                detalle: `${principal.marca} · ${principal.dato}`,
                precio: clp(principal.precio),
                href: `/producto/${principal.slug}`,
                arte: principal.arte,
                color: colorArte(principal),
              }
            : null
        }
      />

      <RutaPedido />

      <section className="marcas" aria-label="Marcas">
        <div className="wrap fila-marcas">
          <span className="etiqueta">Marcas que vendemos</span>
          {marcas().map((m) => (
            <Link key={m} href={`/marcas/${slugMarca(m)}`}>
              {m}
            </Link>
          ))}
        </div>
      </section>

      <section className="seccion wrap">
        <div className="titulo-seccion">
          <span className="etiqueta">Comprar por categoría</span>
          <h2>¿Qué buscas hoy?</h2>
        </div>
        <div className="tipos">
          {tipos.map((t) => (
            <Link key={t.href} href={t.href} className={`tipo-baldosa tipo-${t.tipo}`}>
              <div className="foto foto-estudio" aria-hidden="true">
                <ArteProducto arte={t.arte} />
              </div>
              <span className="banda" aria-hidden="true" />
              <span className="texto">
                <b>{t.nombre}</b>
                <span>{t.bajada}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="seccion wrap" id="repuestos">
        <div className="panel-repuestos oscuro sobre-oscuro">
          <div className="panel-repuestos-texto">
            <span className="etiqueta">Repuestos para tu equipo</span>
            <h2>Elige tu equipo y te mostramos solo lo compatible.</h2>
            <p>Cartuchos, coils y baterías que sirven de verdad, sin adivinar.</p>
            <BuscadorRepuestos botonClaro />
          </div>
          <div className="foto foto-estudio tipo-repuestos" aria-hidden="true">
            <ArteProducto arte="cartucho" />
          </div>
        </div>
      </section>

      {elegidos.length > 0 ? (
        <section className="seccion-color piedra">
          <div className="wrap">
            <div className="titulo-seccion con-enlace">
              <div>
                <span className="etiqueta">Curaduría</span>
                <h2>Elegidos por Vapeur</h2>
                <p className="muted">Pocos equipos, elegidos por lo simples de usar y porque sus repuestos se encuentran en Chile.</p>
              </div>
              <Link href="/equipos" className="ver-todo">
                Ver todos los equipos
              </Link>
            </div>
            <div className={elegidos.length === 3 ? "grilla tres" : "grilla"}>
              {elegidos.map((p) => (
                <TarjetaProducto key={p.slug} p={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="seccion wrap">
        <div className="titulo-seccion">
          <span className="etiqueta">Te ayudamos a elegir</span>
          <h2>¿Qué equipo es para ti?</h2>
        </div>
        <QuizEquipo />
      </section>

      <section className="seccion wrap">
        <div className="titulo-seccion">
          <span className="etiqueta">Cómo funciona</span>
          <h2>Comprar sin vueltas</h2>
        </div>
        <ol className="zigzag">
          <li>
            <div className="zz-arte foto-estudio tipo-repuestos" aria-hidden="true">
              <ArteProducto arte="cartucho" />
            </div>
            <div>
              <span className="num">Paso 1</span>
              <h3>Eliges sabiendo qué le sirve a tu equipo</h3>
              <p className="muted">Cada repuesto dice con qué equipos funciona. Si tienes dudas, nos escribes por WhatsApp antes de comprar.</p>
            </div>
          </li>
          <li>
            <div className="zz-arte foto-estudio tipo-equipos" aria-hidden="true">
              <ArteProducto arte="pod2" />
            </div>
            <div>
              <span className="num">Paso 2</span>
              <h3>Pagas con Webpay, sin crear cuenta</h3>
              <p className="muted">Crédito, débito o prepago en el sitio de Transbank. Ves el total con despacho antes de pagar.</p>
            </div>
          </li>
          <li>
            <div className="zz-arte foto-estudio tipo-repuestos" aria-hidden="true">
              <ArteProducto arte="estuche" />
            </div>
            <div>
              <span className="num">Paso 3</span>
              <h3>Recibes en tu casa, con plazo según tu comuna</h3>
              <p className="muted">Despacho a todo Chile, en mano y solo a una persona mayor de 18 años con carnet.</p>
            </div>
          </li>
        </ol>
      </section>

      <section className="seccion wrap">
        <div className="titulo-seccion con-enlace">
          <div>
            <span className="etiqueta">Guías</span>
            <h2>Antes de comprar</h2>
          </div>
          <Link href="/guias" className="ver-todo">
            Todas las guías
          </Link>
        </div>
        <div className="guias-portada">
          {guias.map((g) => (
            <Link key={g.slug} href={`/guias/${g.slug}`} className={`guia-tarjeta tipo-${g.tipo}`}>
              <div className="foto foto-estudio" aria-hidden="true">
                <ArteProducto arte={g.arte} />
              </div>
              <span className="etiqueta">{g.rotulo}</span>
              <h3>{g.titulo}</h3>
              <p className="muted">{g.bajada}</p>
            </Link>
          ))}
          <Link href="/ayuda/despacho" className="guia-tarjeta tipo-repuestos">
            <div className="foto foto-estudio" aria-hidden="true">
              <ArteProducto arte="estuche" />
            </div>
            <span className="etiqueta">Despacho</span>
            <h3>Costo y plazo según tu comuna</h3>
            <p className="muted">Los ves antes de pagar. Entrega solo a mayores de 18 con carnet.</p>
          </Link>
        </div>
      </section>

      {novedades.length > 0 ? (
        <section className="seccion wrap">
          <div className="titulo-seccion">
            <span className="etiqueta">También en la tienda</span>
            <h2>Repuestos, líquidos y accesorios</h2>
          </div>
          <Carrusel etiqueta="Repuestos, líquidos y accesorios">
            {novedades.map((p) => (
              <TarjetaProducto key={p.slug} p={p} />
            ))}
          </Carrusel>
        </section>
      ) : null}

      {kits().length > 0 ? (
        <section className="seccion wrap">
          <div className="titulo-seccion">
            <span className="etiqueta">Compatibles entre sí</span>
            <h2>Kits: equipo y repuestos juntos</h2>
            <p className="muted">El precio del kit es la suma de sus productos.</p>
          </div>
          <div className="kits deslizable">
            {kits().map((k) => (
              <article key={k.nombre} className="kit tipo-kits">
                <div className="arte-kit foto-estudio" aria-hidden="true">
                  <ArteProducto arte={k.arte} />
                </div>
                <span className="banda" aria-hidden="true" />
                <div className="kit-info">
                  <span className="rotulo-tipo">
                    {k.tipo} · {k.para}
                  </span>
                  <h3>{k.nombre}</h3>
                  <ul>
                    {k.productos.map((slug) => {
                      const p = producto(slug);
                      return p ? (
                        <li key={slug}>
                          <Link href={`/producto/${slug}`}>{p.nombre}</Link>
                        </li>
                      ) : null;
                    })}
                  </ul>
                  <span className="precio">{clp(precioKit(k))}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
