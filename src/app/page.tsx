import type { Metadata } from "next";
import Link from "next/link";
import ArteProducto from "@/components/ArteProducto";
import BuscadorRepuestos from "@/components/BuscadorRepuestos";
import Carrusel from "@/components/Carrusel";
import CarruselPortada from "@/components/CarruselPortada";
import QuizEquipo from "@/components/QuizEquipo";
import TarjetaProducto from "@/components/TarjetaProducto";
import { CATEGORIAS, slugMarca } from "@/lib/catalogo";
import { obtenerCatalogo } from "@/lib/datos";
import { clp } from "@/lib/formato";
import { DATOS_SITIO, DatosEstructurados } from "@/lib/seo";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Inicio() {
  const { productos, producto, marcas, kits, precioKit } = await obtenerCatalogo();
  const elegidos = productos.filter((p) => p.elegido);
  const novedades = productos.filter((p) => p.categoria !== "equipos" && p.stock > 0).slice(0, 10);

  return (
    <>
      <DatosEstructurados datos={DATOS_SITIO} />
      <CarruselPortada />

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
        <div className="bento">
          {CATEGORIAS.map((c, i) => (
            <Link key={c.slug} href={`/${c.slug}`} className={i === 0 ? "baldosa grande" : "baldosa"}>
              <div className="texto">
                <b>{c.nombre}</b>
                <span>{c.bajada}</span>
              </div>
              <div className="mini">
                <ArteProducto arte={c.arte} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="seccion wrap" id="repuestos">
        <div className="panel-repuestos">
          <div>
            <span className="etiqueta">Repuestos para tu equipo</span>
            <h2>Elige tu equipo y te mostramos solo lo compatible.</h2>
            <p className="muted">Cartuchos, coils y baterías que sirven de verdad, sin adivinar.</p>
          </div>
          <BuscadorRepuestos />
        </div>
      </section>

      <section className="seccion wrap">
        <div className="titulo-seccion">
          <span className="etiqueta">Curaduría</span>
          <h2>Elegidos por Vapeur</h2>
          <p className="muted">Pocos equipos, elegidos por lo simples de usar y porque sus repuestos se encuentran en Chile.</p>
        </div>
        <div className="grilla">
          {elegidos.map((p) => (
            <TarjetaProducto key={p.slug} p={p} />
          ))}
        </div>
      </section>

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
            <div className="zz-arte" aria-hidden="true">
              <ArteProducto arte="cartucho" />
            </div>
            <div>
              <span className="num">Paso 1</span>
              <h3>Eliges sabiendo qué le sirve a tu equipo</h3>
              <p className="muted">Cada repuesto dice con qué equipos funciona. Si tienes dudas, nos escribes por WhatsApp antes de comprar.</p>
            </div>
          </li>
          <li>
            <div className="zz-arte" aria-hidden="true">
              <ArteProducto arte="pod2" color="#3A4247" />
            </div>
            <div>
              <span className="num">Paso 2</span>
              <h3>Pagas con Webpay, sin crear cuenta</h3>
              <p className="muted">Crédito, débito o prepago en el sitio de Transbank. Ves el total con despacho antes de pagar.</p>
            </div>
          </li>
          <li>
            <div className="zz-arte" aria-hidden="true">
              <ArteProducto arte="estuche" />
            </div>
            <div>
              <span className="num">Paso 3</span>
              <h3>Recibes en tu casa, con plazo según tu comuna</h3>
              <p className="muted">Despacho en Santiago, en mano y solo a una persona mayor de 18 años con carnet.</p>
            </div>
          </li>
        </ol>
      </section>

      <section className="seccion wrap duo" aria-label="Información">
        <div className="duo-uno">
          <span className="pronto">Próximamente</span>
          <h3>Guía: qué coil sirve para tu equipo</h3>
          <p>Cómo leer los ohmios y cuándo cambiar el cartucho. Solo información técnica.</p>
          <div className="deco" aria-hidden="true">
            <ArteProducto arte="coil" />
          </div>
        </div>
        <div className="duo-dos">
          <span className="etiqueta">Despacho</span>
          <h3>Costo y plazo según tu comuna</h3>
          <p className="muted">Los ves antes de pagar. Entrega solo a mayores de 18 con carnet.</p>
          <Link href="/ayuda/despacho">Ver despacho y plazos</Link>
          <div className="deco" aria-hidden="true">
            <ArteProducto arte="estuche" />
          </div>
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
            <span className="etiqueta">Para cada etapa</span>
            <h2>Kits por nivel</h2>
            <p className="muted">El precio del kit es la suma de sus productos.</p>
          </div>
          <div className="kits deslizable">
            {kits().map((k) => (
              <article key={k.nombre} className="kit">
                <div className="arte-kit">
                  <ArteProducto arte={k.arte} />
                </div>
                <span className="etiqueta">
                  {k.nivel} · {k.para}
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
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
