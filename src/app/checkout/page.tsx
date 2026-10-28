"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { guardarDestino, leerDestino } from "@/components/CalculaDespacho";
import { useCarro } from "@/components/Carro";
import { useCatalogo } from "@/components/Catalogo";
import { DESPACHO } from "@/lib/catalogo";
import { EDAD_MINIMA, calcularEdad } from "@/lib/edad";
import { clp } from "@/lib/formato";
import { RETRACTO_CORTO } from "@/lib/legal";
import { formatearRut, rutValido } from "@/lib/rut";

type Datos = { correo: string; nombre: string; rut: string; dia: string; mes: string; anio: string; telefono: string };
type Errores = Partial<Record<keyof Datos | "declaracion" | "edad", string>>;

const VACIO: Datos = { correo: "", nombre: "", rut: "", dia: "", mes: "", anio: "", telefono: "" };

function validarDatos(d: Datos, declaracion: boolean): Errores {
  const e: Errores = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.correo)) e.correo = "Escribe un correo válido.";
  if (d.nombre.trim().length < 3) e.nombre = "Escribe tu nombre y apellido.";
  if (!rutValido(d.rut)) e.rut = "Revisa tu RUT: el dígito verificador no coincide.";
  const edad = calcularEdad(Number(d.dia), Number(d.mes), Number(d.anio));
  if (edad === null) e.edad = "Revisa tu fecha de nacimiento.";
  else if (edad < EDAD_MINIMA)
    e.edad = "Lo sentimos: solo podemos vender a personas de 18 años o más. No se hizo ningún cargo.";
  if (d.telefono.replace(/\D/g, "").length < 9) e.telefono = "Escribe un teléfono de 9 dígitos.";
  if (!declaracion) e.declaracion = "Debes confirmar que tienes 18 años o más.";
  return e;
}

export default function Checkout() {
  const router = useRouter();
  const { items, subtotal, listo, vaciar } = useCarro();
  const [paso, setPaso] = useState<1 | 2>(1);
  const [d, setD] = useState<Datos>(VACIO);
  const [declaracion, setDeclaracion] = useState(false);
  const [errores, setErrores] = useState<Errores>({});
  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState("");
  const [direccion, setDireccion] = useState("");
  const [depto, setDepto] = useState("");
  const [terminos, setTerminos] = useState(false);
  const [errorPago, setErrorPago] = useState("");

  // Si ya eligió su comuna en la ficha o el carro, llega marcada.
  useEffect(() => {
    const d = leerDestino();
    if (d) {
      setRegion(d.region);
      setComuna(d.comuna);
    }
  }, []);

  if (!listo) return <div className="wrap pagina" />;

  if (items.length === 0) {
    return (
      <div className="wrap pagina angosta vacio">
        <h1>Tu carro está vacío</h1>
        <Link href="/" className="boton">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  const costoDespacho = region && comuna ? DESPACHO[region]?.[comuna] : undefined;
  const total = subtotal + (typeof costoDespacho === "number" ? costoDespacho : 0);
  const menor = errores.edad?.startsWith("Lo sentimos");

  function campo(nombre: keyof Datos) {
    return {
      value: d[nombre],
      onChange: (ev: React.ChangeEvent<HTMLInputElement>) => setD({ ...d, [nombre]: ev.target.value }),
      "aria-invalid": errores[nombre] ? true : undefined,
      "aria-describedby": errores[nombre] ? `error-${nombre}` : undefined,
    };
  }

  function continuar(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validarDatos(d, declaracion);
    setErrores(e);
    if (Object.keys(e).length === 0) {
      setPaso(2);
      window.scrollTo({ top: 0 });
    }
  }

  function pagar(ev: React.FormEvent) {
    ev.preventDefault();
    if (!region || !comuna || direccion.trim().length < 4) return setErrorPago("Completa región, comuna y dirección.");
    if (costoDespacho === null) return setErrorPago("Todavía no tenemos la tarifa de despacho para esta comuna. Escríbenos por WhatsApp y te ayudamos.");
    if (!terminos) return setErrorPago("Debes aceptar los Términos y la Política de privacidad.");
    // PRUEBA: Webpay aún no está conectado. Se simula un pago aprobado.
    // Solo se guarda el resumen del pedido; nunca el RUT ni la fecha de nacimiento.
    const numero = String(Math.floor(100000 + Math.random() * 900000));
    try {
      sessionStorage.setItem(
        "vapeur-ultimo-pedido",
        JSON.stringify({ numero, correo: d.correo, subtotal, despacho: costoDespacho, total }),
      );
    } catch {
      // la confirmación muestra solo el número
    }
    vaciar();
    router.push(`/pedido?n=${numero}`);
  }

  return (
    <div className="wrap pagina angosta checkout">
      <ol className="pasos-checkout" aria-label="Pasos de la compra">
        <li aria-current={paso === 1 ? "step" : undefined}>1. Tus datos</li>
        <li aria-current={paso === 2 ? "step" : undefined}>2. Despacho y pago</li>
      </ol>

      {paso === 1 ? (
        <form onSubmit={continuar} noValidate className="formulario">
          <h1>Tus datos</h1>
          <p className="nota">
            La ley exige verificar que eres mayor de 18 años. Usamos tu RUT y fecha de nacimiento solo para eso, y tus
            datos solo para tu compra y el despacho.
          </p>

          <div className="campo">
            <label htmlFor="correo">Correo</label>
            <input id="correo" type="email" autoComplete="email" {...campo("correo")} />
            {errores.correo ? <span id="error-correo" className="error">{errores.correo}</span> : null}
          </div>
          <div className="campo">
            <label htmlFor="nombre">Nombre y apellido</label>
            <input id="nombre" type="text" autoComplete="name" {...campo("nombre")} />
            {errores.nombre ? <span id="error-nombre" className="error">{errores.nombre}</span> : null}
          </div>
          <div className="campo">
            <label htmlFor="rut">RUT</label>
            <input
              id="rut"
              type="text"
              inputMode="text"
              placeholder="12.345.678-5"
              {...campo("rut")}
              onBlur={() => setD((x) => ({ ...x, rut: formatearRut(x.rut) }))}
            />
            {errores.rut ? <span id="error-rut" className="error">{errores.rut}</span> : null}
          </div>
          <fieldset className="campo">
            <legend>Fecha de nacimiento</legend>
            <div className="fecha">
              <input aria-label="Día" inputMode="numeric" placeholder="DD" maxLength={2} {...campo("dia")} aria-describedby={errores.edad ? "error-edad" : undefined} />
              <input aria-label="Mes" inputMode="numeric" placeholder="MM" maxLength={2} {...campo("mes")} aria-describedby={errores.edad ? "error-edad" : undefined} />
              <input aria-label="Año" inputMode="numeric" placeholder="AAAA" maxLength={4} {...campo("anio")} aria-describedby={errores.edad ? "error-edad" : undefined} />
            </div>
            {errores.edad ? (
              <span id="error-edad" className={menor ? "alerta" : "error"} role={menor ? "alert" : undefined}>
                {errores.edad}
              </span>
            ) : null}
          </fieldset>
          <div className="campo">
            <label htmlFor="telefono">Teléfono</label>
            <input id="telefono" type="tel" autoComplete="tel" placeholder="+56 9 1234 5678" {...campo("telefono")} />
            {errores.telefono ? <span id="error-telefono" className="error">{errores.telefono}</span> : null}
          </div>
          <label className="check">
            <input type="checkbox" checked={declaracion} onChange={(e) => setDeclaracion(e.target.checked)} />
            <span>Declaro que tengo 18 años o más y que recibiré el pedido mostrando mi carnet.</span>
          </label>
          {errores.declaracion ? <span className="error">{errores.declaracion}</span> : null}

          <Resumen subtotal={subtotal} despacho={undefined} total={subtotal} />
          <button type="submit" className="boton ancho">
            Continuar a despacho
          </button>
          <p className="muted centrado">Compras sin crear cuenta. Pago con Webpay de Transbank.</p>
        </form>
      ) : (
        <form onSubmit={pagar} noValidate className="formulario">
          <h1>Despacho y pago</h1>
          <div className="campo">
            <label htmlFor="region">Región</label>
            <select
              id="region"
              value={region}
              onChange={(e) => {
                setRegion(e.target.value);
                setComuna("");
              }}
            >
              <option value="">Selecciona</option>
              {Object.keys(DESPACHO).map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="comuna">Comuna</label>
            <select
              id="comuna"
              value={comuna}
              onChange={(e) => {
                setComuna(e.target.value);
                if (e.target.value) guardarDestino({ region, comuna: e.target.value });
              }}
              disabled={!region}
            >
              <option value="">Selecciona</option>
              {region
                ? Object.keys(DESPACHO[region]).map((c) => (
                    <option key={c}>{c}</option>
                  ))
                : null}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="direccion">Calle y número</label>
            <input id="direccion" autoComplete="address-line1" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
          </div>
          <div className="campo">
            <label htmlFor="depto">Depto, casa u oficina (opcional)</label>
            <input id="depto" autoComplete="address-line2" value={depto} onChange={(e) => setDepto(e.target.value)} />
          </div>

          {comuna ? (
            <div className="envio">
              <b>Envío a {comuna}</b>
              {costoDespacho === null ? (
                <span>Todavía no tenemos la tarifa de despacho para esta comuna. Escríbenos por WhatsApp y te ayudamos.</span>
              ) : (
                <span>
                  Courier a domicilio · <b className="tab">{clp(costoDespacho ?? 0)}</b>
                </span>
              )}
              <span className="muted">Se entrega solo a una persona mayor de 18 años con carnet.</span>
            </div>
          ) : null}

          <Resumen subtotal={subtotal} despacho={typeof costoDespacho === "number" ? costoDespacho : undefined} total={total} />
          <p className="aviso-retracto">
            <Link href="/legal/retracto">{RETRACTO_CORTO}</Link>
          </p>

          <label className="check">
            <input type="checkbox" checked={terminos} onChange={(e) => setTerminos(e.target.checked)} />
            <span>
              Acepto los <Link href="/legal/terminos">Términos</Link> y la{" "}
              <Link href="/legal/privacidad">Política de privacidad</Link>.
            </span>
          </label>
          {errorPago ? (
            <p className="error" role="alert">
              {errorPago}
            </p>
          ) : null}
          <button type="submit" className="boton acento ancho">
            Pagar con Webpay
          </button>
          <p className="muted centrado">
            Te llevamos al sitio seguro de Transbank: crédito, débito o prepago. (Prototipo: el pago se simula.)
          </p>
          <button type="button" className="enlace centrado" onClick={() => setPaso(1)}>
            Volver a tus datos
          </button>
        </form>
      )}
    </div>
  );
}

function Resumen({ subtotal, despacho, total }: { subtotal: number; despacho: number | undefined; total: number }) {
  const { items } = useCarro();
  const { producto } = useCatalogo();
  return (
    <div className="resumen">
      {items.map((it) => {
        const p = producto(it.slug);
        if (!p) return null;
        return (
          <div key={`${it.slug}-${it.variante}`}>
            <span>
              {it.cantidad} × {p.nombre}
            </span>
            <span className="tab">{clp(p.precio * it.cantidad)}</span>
          </div>
        );
      })}
      <div className="muted">
        <span>Despacho</span>
        <span className="tab">{despacho === undefined ? "Siguiente paso" : clp(despacho)}</span>
      </div>
      <div className="total">
        <span>Total con IVA</span>
        <span className="tab">{clp(despacho === undefined ? subtotal : total)}</span>
      </div>
    </div>
  );
}
