"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PERFIL_VACIO, useCuenta, type Perfil } from "@/components/Cuenta";
import { DESPACHO } from "@/lib/catalogo";
import { clp } from "@/lib/formato";

// Ingresar o crear cuenta en una sola pantalla: correo → código de 6 dígitos.
// La primera vez se pide declarar la mayoría de edad y aceptar los términos.
// Después, Mi cuenta: pedidos, datos de despacho y eliminar la cuenta.

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Solo rutas de la tienda, para que nadie use el enlace para mandar a otro sitio.
function rutaVolver(): string | null {
  const v = new URLSearchParams(window.location.search).get("volver");
  return v && v.startsWith("/") && !v.startsWith("//") ? v : null;
}

export default function PaginaCuenta() {
  const { listo, disponible, sesion, perfil } = useCuenta();
  const [volver, setVolver] = useState<string | null>(null);

  useEffect(() => setVolver(rutaVolver()), []);

  // Si venía del checkout, vuelve allá con la cuenta lista.
  useEffect(() => {
    if (listo && sesion && perfil && volver) window.location.assign(volver);
  }, [listo, sesion, perfil, volver]);

  if (!disponible) {
    return (
      <div className="wrap pagina angosta cuenta">
        <h1>Mi cuenta</h1>
        <p className="nota">Las cuentas todavía no están activas. Puedes comprar como invitado sin problema.</p>
      </div>
    );
  }
  if (!listo) return <div className="wrap pagina angosta cuenta" aria-busy="true" />;
  if (!sesion) return <Ingresar volver={volver} />;
  if (!perfil) return <CompletarCuenta />;
  return <MiCuenta />;
}

function Ingresar({ volver }: { volver: string | null }) {
  const { enviarCodigo, verificarCodigo } = useCuenta();
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [paso, setPaso] = useState<"correo" | "codigo">("correo");
  const [error, setError] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [espera, setEspera] = useState(0);

  // Supabase permite pedir un código nuevo cada 60 segundos.
  useEffect(() => {
    if (espera <= 0) return;
    const t = setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [espera]);

  async function pedir(ev?: React.FormEvent) {
    ev?.preventDefault();
    const c = correo.trim().toLowerCase();
    if (!CORREO_VALIDO.test(c)) return setError("Escribe un correo válido.");
    setError("");
    setOcupado(true);
    try {
      await enviarCodigo(c);
      setCorreo(c);
      setCodigo("");
      setPaso("codigo");
      setEspera(60);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setOcupado(false);
    }
  }

  async function verificar(ev: React.FormEvent) {
    ev.preventDefault();
    const c = codigo.replace(/\D/g, "");
    if (c.length < 6) return setError("Escribe el código de 6 dígitos que te enviamos.");
    setError("");
    setOcupado(true);
    try {
      await verificarCodigo(correo, c);
    } catch (e) {
      setError((e as Error).message);
      setOcupado(false);
    }
  }

  return (
    <div className="wrap pagina angosta cuenta">
      <div className="cuenta-caja">
        {paso === "correo" ? (
          <form onSubmit={pedir} noValidate className="formulario">
            <h1>Ingresar</h1>
            <p className="muted">
              {volver === "/checkout"
                ? "Ingresa para usar tus datos de despacho guardados."
                : "Escribe tu correo y te enviamos un código para entrar. Si es tu primera vez, se crea tu cuenta."}
            </p>
            <div className="campo">
              <label htmlFor="cuenta-correo">Correo</label>
              <input
                id="cuenta-correo"
                type="email"
                autoComplete="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "cuenta-error" : undefined}
              />
            </div>
            {error ? (
              <span id="cuenta-error" className="error" role="alert">
                {error}
              </span>
            ) : null}
            <button type="submit" className="boton ancho" disabled={ocupado} aria-busy={ocupado || undefined}>
              {ocupado ? "Enviando…" : "Continuar"}
            </button>
            <p className="muted chico">Sin contraseña: cada vez que entres te llega un código nuevo.</p>
          </form>
        ) : (
          <form onSubmit={verificar} noValidate className="formulario">
            <h1>Revisa tu correo</h1>
            <p className="muted">
              Enviamos un código a <b>{correo}</b>. Si no lo ves, revisa Promociones o Spam.
            </p>
            <div className="campo">
              <label htmlFor="cuenta-codigo">Código</label>
              <input
                id="cuenta-codigo"
                className="codigo"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={10}
                placeholder="123456"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "cuenta-error" : undefined}
                autoFocus
              />
            </div>
            {error ? (
              <span id="cuenta-error" className="error" role="alert">
                {error}
              </span>
            ) : null}
            <button type="submit" className="boton ancho" disabled={ocupado} aria-busy={ocupado || undefined}>
              {ocupado ? "Verificando…" : "Entrar"}
            </button>
            <div className="cuenta-acciones">
              <button type="button" className="enlace" disabled={espera > 0 || ocupado} onClick={() => pedir()}>
                {espera > 0 ? `Enviar otro código en ${espera} s` : "Enviar otro código"}
              </button>
              <button
                type="button"
                className="enlace"
                onClick={() => {
                  setPaso("correo");
                  setError("");
                }}
              >
                Usar otro correo
              </button>
            </div>
          </form>
        )}
      </div>
      <p className="muted centrado chico">
        ¿Prefieres no crear cuenta? Puedes <Link href="/carro">comprar como invitado</Link>.
      </p>
    </div>
  );
}

function CompletarCuenta() {
  const { correo, crearPerfil, salir } = useCuenta();
  const [acepto, setAcepto] = useState(false);
  const [error, setError] = useState("");
  const [ocupado, setOcupado] = useState(false);

  async function crear(ev: React.FormEvent) {
    ev.preventDefault();
    if (!acepto) return setError("Debes confirmar que tienes 18 años o más y aceptar los Términos y la Política de privacidad.");
    setError("");
    setOcupado(true);
    try {
      await crearPerfil(PERFIL_VACIO);
    } catch (e) {
      setError((e as Error).message);
      setOcupado(false);
    }
  }

  return (
    <div className="wrap pagina angosta cuenta">
      <form onSubmit={crear} noValidate className="formulario cuenta-caja">
        <h1>Crea tu cuenta</h1>
        <p className="muted">
          Tu cuenta queda con el correo <b>{correo}</b>. Ahí verás tus pedidos y podrás guardar tus datos de despacho.
        </p>
        <p className="nota">
          Vapeur vende solo a mayores de 18 años. En cada compra igual verificamos tu edad con RUT y fecha de nacimiento,
          que no guardamos.
        </p>
        <label className="check">
          <input type="checkbox" checked={acepto} onChange={(e) => setAcepto(e.target.checked)} />
          <span>
            Declaro que tengo 18 años o más y acepto los <Link href="/legal/terminos">Términos</Link> y la{" "}
            <Link href="/legal/privacidad">Política de privacidad</Link>.
          </span>
        </label>
        {error ? (
          <span className="error" role="alert">
            {error}
          </span>
        ) : null}
        <button type="submit" className="boton ancho" disabled={ocupado} aria-busy={ocupado || undefined}>
          {ocupado ? "Creando…" : "Crear mi cuenta"}
        </button>
        <button type="button" className="enlace centrado" onClick={() => salir()}>
          Salir sin crear cuenta
        </button>
      </form>
    </div>
  );
}

type PedidoCuenta = {
  numero: number;
  clave_acceso: string;
  estado: string;
  items: { nombre: string; variante?: string | null; cantidad: number }[];
  total: number;
  comuna: string;
  creado_en: string;
};

const ESTADO: Record<string, string> = {
  pagado: "Pagado · en preparación",
  enviado: "En camino",
  entregado: "Entregado",
  devuelto: "Devuelto",
  anulado: "Anulado",
};

function fecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-CL", { timeZone: "America/Santiago", day: "numeric", month: "long", year: "numeric" });
}

function MiCuenta() {
  const { correo, perfil, salir } = useCuenta();
  const nombre = perfil?.nombre.trim().split(/\s+/)[0];
  return (
    <div className="wrap pagina cuenta">
      <div className="cuenta-cabecera">
        <div>
          <span className="etiqueta">Mi cuenta</span>
          <h1>{nombre ? `Hola, ${nombre}` : "Hola"}</h1>
          <p className="muted">{correo}</p>
        </div>
        <button type="button" className="boton secundario" onClick={() => salir()}>
          Cerrar sesión
        </button>
      </div>
      <div className="cuenta-grilla">
        <MisPedidos />
        <div className="cuenta-columna">
          <MisDatos />
          <EliminarCuenta />
        </div>
      </div>
    </div>
  );
}

function MisPedidos() {
  const { sesion } = useCuenta();
  const [pedidos, setPedidos] = useState<PedidoCuenta[] | null>(null);
  const [error, setError] = useState("");
  const token = sesion?.access_token;

  useEffect(() => {
    if (!token) return;
    let vivo = true;
    fetch("/api/cuenta", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" })
      .then((r) => r.json() as Promise<{ ok: boolean; pedidos?: PedidoCuenta[]; error?: string }>)
      .then((r) => {
        if (!vivo) return;
        if (!r.ok) throw new Error(r.error);
        setPedidos(r.pedidos ?? []);
      })
      .catch((e: Error) => vivo && setError(e.message || "No pudimos cargar tus pedidos."));
    return () => {
      vivo = false;
    };
    // Solo al entrar: el token se renueva solo y no hace falta volver a pedir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(token)]);

  return (
    <section className="cuenta-seccion" aria-labelledby="titulo-pedidos">
      <h2 id="titulo-pedidos">Mis pedidos</h2>
      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : pedidos === null ? (
        <p className="muted">Cargando…</p>
      ) : pedidos.length === 0 ? (
        <div className="cuenta-vacio">
          <p className="muted">Todavía no tienes pedidos con este correo.</p>
          <Link href="/" className="boton">
            Ver la tienda
          </Link>
        </div>
      ) : (
        <ul className="cuenta-pedidos">
          {pedidos.map((p) => (
            <li key={p.numero}>
              <Link href={`/pedido?n=${p.numero}&k=${p.clave_acceso}`}>
                <span className="cuenta-pedido-arriba">
                  <b>N° {p.numero}</b>
                  <span className={`estado estado-${p.estado}`}>{ESTADO[p.estado] ?? p.estado}</span>
                </span>
                <span className="muted">
                  {fecha(p.creado_en)} · Despacho a {p.comuna}
                </span>
                <span className="cuenta-pedido-items">
                  {p.items.map((it) => `${it.cantidad} × ${it.nombre}${it.variante ? ` · ${it.variante}` : ""}`).join(", ")}
                </span>
                <span className="cuenta-pedido-abajo">
                  <b className="tab">{clp(p.total)}</b>
                  <span className="enlace-falso">Ver detalle</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function MisDatos() {
  const { perfil, guardarPerfil } = useCuenta();
  const [d, setD] = useState<Perfil>(perfil ?? PERFIL_VACIO);
  const [estado, setEstado] = useState<"" | "guardando" | "guardado">("");
  const [error, setError] = useState("");

  function campo(nombre: keyof Perfil) {
    return {
      value: d[nombre],
      onChange: (ev: React.ChangeEvent<HTMLInputElement>) => {
        setD({ ...d, [nombre]: ev.target.value });
        setEstado("");
      },
    };
  }

  async function guardar(ev: React.FormEvent) {
    ev.preventDefault();
    if (d.telefono && d.telefono.replace(/\D/g, "").length < 9) return setError("Escribe un teléfono de 9 dígitos.");
    setError("");
    setEstado("guardando");
    try {
      await guardarPerfil({
        nombre: d.nombre.trim(),
        telefono: d.telefono.trim(),
        region: d.region,
        comuna: d.comuna,
        direccion: d.direccion.trim(),
        depto: d.depto.trim(),
      });
      setEstado("guardado");
    } catch (e) {
      setError((e as Error).message);
      setEstado("");
    }
  }

  return (
    <section className="cuenta-seccion" aria-labelledby="titulo-datos">
      <h2 id="titulo-datos">Datos de despacho</h2>
      <p className="muted chico">Los usamos para llenar tu compra. Puedes cambiarlos cuando quieras.</p>
      <form onSubmit={guardar} noValidate className="formulario">
        <div className="campo">
          <label htmlFor="perfil-nombre">Nombre y apellido</label>
          <input id="perfil-nombre" autoComplete="name" maxLength={120} {...campo("nombre")} />
        </div>
        <div className="campo">
          <label htmlFor="perfil-telefono">Teléfono</label>
          <input id="perfil-telefono" type="tel" autoComplete="tel" placeholder="+56 9 1234 5678" maxLength={20} {...campo("telefono")} />
        </div>
        <div className="campo">
          <label htmlFor="perfil-region">Región</label>
          <select
            id="perfil-region"
            value={d.region}
            onChange={(e) => {
              setD({ ...d, region: e.target.value, comuna: "" });
              setEstado("");
            }}
          >
            <option value="">Selecciona</option>
            {Object.keys(DESPACHO).map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="perfil-comuna">Comuna</label>
          <select
            id="perfil-comuna"
            value={d.comuna}
            disabled={!d.region}
            onChange={(e) => {
              setD({ ...d, comuna: e.target.value });
              setEstado("");
            }}
          >
            <option value="">Selecciona</option>
            {d.region && DESPACHO[d.region]
              ? Object.keys(DESPACHO[d.region]).map((c) => (
                  <option key={c}>{c}</option>
                ))
              : null}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="perfil-direccion">Calle y número</label>
          <input id="perfil-direccion" autoComplete="address-line1" maxLength={160} {...campo("direccion")} />
        </div>
        <div className="campo">
          <label htmlFor="perfil-depto">Depto, casa u oficina (opcional)</label>
          <input id="perfil-depto" autoComplete="address-line2" maxLength={80} {...campo("depto")} />
        </div>
        {error ? (
          <span className="error" role="alert">
            {error}
          </span>
        ) : null}
        <button type="submit" className="boton" disabled={estado === "guardando"}>
          {estado === "guardando" ? "Guardando…" : "Guardar datos"}
        </button>
        {estado === "guardado" ? (
          <span className="ok-texto" role="status">
            Datos guardados.
          </span>
        ) : null}
      </form>
    </section>
  );
}

function EliminarCuenta() {
  const { sesion, salir } = useCuenta();
  const [confirmar, setConfirmar] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState("");

  async function eliminar() {
    setOcupado(true);
    setError("");
    try {
      const r = await fetch("/api/cuenta", { method: "DELETE", headers: { Authorization: `Bearer ${sesion?.access_token ?? ""}` } });
      const res = (await r.json()) as { ok: boolean; error?: string };
      if (!res.ok) throw new Error(res.error || "No pudimos eliminar tu cuenta.");
      await salir();
    } catch (e) {
      setError((e as Error).message);
      setOcupado(false);
    }
  }

  return (
    <section className="cuenta-seccion cuenta-eliminar" aria-labelledby="titulo-eliminar">
      <h2 id="titulo-eliminar">Eliminar mi cuenta</h2>
      <p className="muted chico">
        Borramos tu cuenta y tus datos de despacho guardados. Los pedidos ya pagados se conservan el tiempo que exige la
        ley tributaria, como explica la <Link href="/legal/privacidad">Política de privacidad</Link>.
      </p>
      {confirmar ? (
        <div className="cuenta-acciones">
          <button type="button" className="boton peligro" disabled={ocupado} onClick={eliminar}>
            {ocupado ? "Eliminando…" : "Sí, eliminar mi cuenta"}
          </button>
          <button type="button" className="enlace" onClick={() => setConfirmar(false)}>
            Cancelar
          </button>
        </div>
      ) : (
        <button type="button" className="boton secundario" onClick={() => setConfirmar(true)}>
          Eliminar mi cuenta
        </button>
      )}
      {error ? (
        <span className="error" role="alert">
          {error}
        </span>
      ) : null}
    </section>
  );
}
