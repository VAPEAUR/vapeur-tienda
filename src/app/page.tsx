import Link from "next/link";
import ArteProducto from "@/components/ArteProducto";
import BuscadorRepuestos from "@/components/BuscadorRepuestos";
import QuizEquipo from "@/components/QuizEquipo";
import TarjetaProducto from "@/components/TarjetaProducto";
import { CATEGORIAS } from "@/lib/catalogo";
import { obtenerCatalogo } from "@/lib/datos";
import { clp } from "@/lib/formato";

export default async function Inicio() {
  const { productos, producto, marcas, kits, precioKit } = await obtenerCatalogo();
  const elegidos = productos.filter((p) => p.elegido);
  const novedades = productos.filter((p) => p.categoria !== "equipos" && p.stock > 0).slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-texto">
            <span className="etiqueta">Tienda de vapeo en Chile</span>
            <h1>Tu vape, sin vueltas.</h1>
            <p>Equipos, repuestos y líquidos originales. Te ayudamos a elegir y te lo llevamos a la puerta.</p>
            <div className="botones">
              <Link href="/equipos" className="boton">
                Ver equipos
              </Link>
              <Link href="#repuestos" className="boton secundario claro">
                Busco repuestos
              </Link>
            </div>
          </div>
          <div className="hero-arte">
            <ArteProducto arte="pod" color="#A9B1B5" />
          </div>
        </div>
      </section>

      <section className="marcas" aria-label="Marcas">
        <div className="wrap fila-marcas">
          {marcas().map((m) => (
            <span key={m}>{m}</span>
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
          <p className="muted">Pocos equipos, probados por nosotros, con repuestos siempre disponibles.</p>
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
          <span className="etiqueta">Kits por nivel</span>
          <h2>Todo lo que necesitas, en un solo paso</h2>
          <p className="muted">El precio del kit es la suma de sus productos.</p>
        </div>
        <div className="kits">
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

      <section className="seccion wrap">
        <div className="titulo-seccion">
          <span className="etiqueta">También en la tienda</span>
          <h2>Repuestos, líquidos y accesorios</h2>
        </div>
        <div className="grilla">
          {novedades.map((p) => (
            <TarjetaProducto key={p.slug} p={p} />
          ))}
        </div>
      </section>

      <section className="seccion wrap">
        <div className="titulo-seccion">
          <span className="etiqueta">Comprar sin vueltas</span>
          <h2>Así de simple</h2>
        </div>
        <ol className="pasos">
          <li>
            <b>Eliges</b>
            <span>Por tipo, por marca o por tu equipo. Si dudas, te ayudamos por WhatsApp.</span>
          </li>
          <li>
            <b>Pagas con Webpay</b>
            <span>Crédito, débito o prepago, en el sitio seguro de Transbank. Sin crear cuenta.</span>
          </li>
          <li>
            <b>Recibes con tu carnet</b>
            <span>Entregamos solo a mayores de 18 años, mostrando el carnet.</span>
          </li>
        </ol>
      </section>

      <section className="confianza">
        <div className="wrap fila-confianza">
          <span>Productos originales</span>
          <span>Despacho en Santiago en 24 a 48 h hábiles</span>
          <span>Garantía legal</span>
          <span>Ayuda por WhatsApp</span>
        </div>
      </section>
    </>
  );
}
