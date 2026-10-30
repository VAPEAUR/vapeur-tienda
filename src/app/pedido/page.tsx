import type { Metadata } from "next";
import Link from "next/link";
import VaciarCarro from "@/components/VaciarCarro";
import { diaChile, diaLargo, diaPreparado, fechaEstimada, sinCobertura, textoRangoCorto } from "@/lib/fecha-entrega";
import { clp } from "@/lib/formato";
import { COLUMNAS_PEDIDO, type FilaPedido } from "@/lib/pedidos";
import { supabaseAdmin } from "@/lib/supabase";
import { tipoPago } from "@/lib/webpay";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Tu pedido", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ n?: string; k?: string }> };

// El pedido se muestra solo con su número y su clave al azar (k), que llegan
// en la dirección a la que Webpay devuelve al cliente.
async function leerPedido(n?: string, k?: string): Promise<FilaPedido | null> {
  if (!n || !/^\d{1,12}$/.test(n) || !k || !/^[0-9a-f]{32}$/.test(k)) return null;
  try {
    const { data } = await supabaseAdmin()
      .from("pedidos")
      .select(COLUMNAS_PEDIDO)
      .eq("numero", Number(n))
      .eq("clave_acceso", k)
      .maybeSingle<FilaPedido>();
    return data;
  } catch (e) {
    console.error(`No se pudo leer el pedido ${n}: ${(e as Error).message}`);
    return null;
  }
}

function fechaChile(iso: string) {
  return new Date(iso).toLocaleString("es-CL", { timeZone: "America/Santiago", dateStyle: "long", timeStyle: "short" });
}

function fechaCorta(iso: string) {
  return new Date(iso).toLocaleString("es-CL", { timeZone: "America/Santiago", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
}

// Pasos del pedido con sus fechas estimadas; los mismos llegan en el correo de compra.
function pasos(region: string, comuna: string, pagado: string | null) {
  const dia = diaChile(pagado ? new Date(pagado) : undefined);
  const llega = sinCobertura(region, comuna) ? "Te escribimos para coordinar" : `Estimada: ${textoRangoCorto(fechaEstimada(region, comuna, dia))}`;
  return [
    { titulo: "Preparando", detalle: `En 1 día hábil: ${diaLargo(diaPreparado(dia))}` },
    { titulo: "En camino", detalle: "Te enviamos el número de seguimiento" },
    { titulo: "Entrega con carnet", detalle: `${llega}. Solo a mayores de 18` },
  ];
}

export default async function Confirmacion({ searchParams }: Props) {
  const { n, k } = await searchParams;
  const pedido = await leerPedido(n, k);

  if (!pedido) {
    return (
      <div className="wrap pagina angosta vacio">
        <h1>No encontramos este pedido</h1>
        <p className="muted">Si pagaste, revisa tu correo: ahí está el comprobante.</p>
        <Link href="/" className="boton">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  const prueba = pedido.webpay_ambiente === "integracion";

  if (pedido.estado === "rechazado" || pedido.estado === "anulado") {
    return (
      <div className="wrap pagina angosta confirmacion">
        <h1>No se realizó el pago</h1>
        <p>
          {pedido.estado === "anulado"
            ? "Cancelaste el pago o se acabó el tiempo en Webpay."
            : "Webpay no aprobó el pago. Puede ser por saldo, cupo o datos de la tarjeta."}{" "}
          No se hizo ningún cargo y tu carro sigue guardado.
        </p>
        <p className="muted">Pedido N° {pedido.numero} · Orden de compra {pedido.webpay_orden}</p>
        <Link href="/checkout" className="boton acento ancho">
          Intentar de nuevo
        </Link>
        <Link href="/carro" className="boton secundario ancho">
          Ver mi carro
        </Link>
      </div>
    );
  }

  if (pedido.estado === "pendiente_pago") {
    return (
      <div className="wrap pagina angosta confirmacion">
        <h1>Estamos confirmando tu pago</h1>
        <p>
          Pedido N° <b>{pedido.numero}</b>. Si Webpay aprobó el pago, te llegará el comprobante a <b>{pedido.correo}</b>. Si
          tienes dudas, escríbenos por WhatsApp con tu número de pedido.
        </p>
        <Link href="/" className="boton secundario ancho">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  const w = pedido.webpay_respuesta;
  const pagado = w?.transaction_date ?? pedido.pagado_en;
  return (
    <section className="pedido-ok sobre-oscuro">
      <VaciarCarro />
      <div className="wrap pedido-ok-caja">
        <div className="pedido-ok-tope">
          <div className="check-ok" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </div>
          <div>
            <h1>¡Listo! Recibimos tu pago</h1>
            <p className="pedido-ok-sub">
              Pedido N° <b>{pedido.numero}</b>.{" "}
              {pedido.correo_enviado_en ? (
                <>
                  Te enviamos el comprobante a <b>{pedido.correo}</b>.
                </>
              ) : (
                <>Guarda esta página: es tu comprobante.</>
              )}
            </p>
          </div>
        </div>

        {prueba ? <p className="nota-prueba">Compra de prueba: Webpay está en modo pruebas y no se hizo ningún cargo real.</p> : null}

        <ol className="avance" aria-label="Estado de tu pedido">
          <li className="hecho">
            <i aria-hidden="true" />
            <b>
              Pago recibido<span className="solo-lector"> (listo)</span>
            </b>
            <span>{pagado ? fechaCorta(pagado) : "Listo"}</span>
          </li>
          {pasos(pedido.region, pedido.comuna, pagado).map((paso) => (
            <li key={paso.titulo}>
              <i aria-hidden="true" />
              <b>{paso.titulo}</b>
              <span>{paso.detalle}</span>
            </li>
          ))}
        </ol>

        <div className="recibo">
          <div className="recibo-tarjeta">
            <h2>Tu pedido</h2>
            {pedido.items.map((it) => (
              <div key={`${it.slug}-${it.variante}`} className="recibo-fila">
                <span>
                  {it.cantidad} × {it.nombre}
                  {it.variante ? ` · ${it.variante}` : ""}
                </span>
                <span className="tab">{clp(it.precio * it.cantidad)}</span>
              </div>
            ))}
            <div className="recibo-fila">
              <span>Despacho a {pedido.comuna}</span>
              <span className="tab">{clp(pedido.despacho)}</span>
            </div>
            <div className="recibo-fila recibo-total">
              <span>Total pagado</span>
              <span className="tab">{clp(pedido.total)}</span>
            </div>
            <p className="recibo-direccion">
              <span>Llega a</span>
              {pedido.direccion}
              {pedido.depto ? `, ${pedido.depto}` : ""}, {pedido.comuna}, {pedido.region}
            </p>
          </div>

          {w ? (
            <div className="recibo-tarjeta">
              <h2>Comprobante Webpay</h2>
              <div className="recibo-fila">
                <span>Comercio</span>
                <span>Vapeur SpA</span>
              </div>
              <div className="recibo-fila">
                <span>Orden de compra</span>
                <span className="tab">{w.buy_order}</span>
              </div>
              <div className="recibo-fila">
                <span>Fecha</span>
                <span className="tab">{fechaChile(w.transaction_date)}</span>
              </div>
              <div className="recibo-fila">
                <span>Tipo de pago</span>
                <span>
                  {tipoPago(w.payment_type_code)}
                  {w.installments_number ? ` · ${w.installments_number} cuotas` : ""}
                </span>
              </div>
              <div className="recibo-fila">
                <span>Tarjeta</span>
                <span className="tab">**** {w.card_detail?.card_number}</span>
              </div>
              <div className="recibo-fila">
                <span>Código de autorización</span>
                <span className="tab">{w.authorization_code}</span>
              </div>
            </div>
          ) : null}
        </div>

        <p className="pedido-ok-retracto">
          <b>Derecho a retracto:</b> tienes 10 días desde que recibes tu pedido. <Link href="/legal/retracto">Ver condiciones</Link>
        </p>

        <div className="pedido-ok-acciones">
          <Link href="/" className="boton claro">
            Volver a la tienda
          </Link>
          <Link href="/ayuda/despacho" className="boton borde-claro">
            Ver despacho y plazos
          </Link>
        </div>
      </div>
    </section>
  );
}
