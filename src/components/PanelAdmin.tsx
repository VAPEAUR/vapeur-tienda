"use client";

import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ARTES, CATEGORIAS, slugMarca } from "@/lib/catalogo";
import { COLUMNAS, type FilaProducto } from "@/lib/datos-filas";
import { clp } from "@/lib/formato";
import Logo from "@/components/Logo";

// Panel para que la dueña cargue productos, precios y stock. Solo entra quien
// tiene usuario en Supabase Auth y fila en public.administradores; la base de
// datos rechaza cualquier cambio de otra persona.

type Formulario = {
  slug: string;
  categoria: string;
  marca: string;
  nombre: string;
  dato: string;
  precio: string;
  stock: string;
  arte: string;
  color: string;
  variante_nombre: string;
  variante_opciones: string;
  compatible: string;
  equipo: string;
  elegido: string;
  nicotina: boolean;
  descripcion: string;
  activo: boolean;
  orden: string;
};

const NUEVO: Formulario = {
  slug: "",
  categoria: "equipos",
  marca: "",
  nombre: "",
  dato: "",
  precio: "",
  stock: "0",
  arte: "pod",
  color: "",
  variante_nombre: "",
  variante_opciones: "",
  compatible: "",
  equipo: "",
  elegido: "",
  nicotina: false,
  descripcion: "",
  activo: true,
  orden: "100",
};

const NOMBRE_ARTE: Record<string, string> = {
  pod: "Pod",
  pod2: "Pod (otro)",
  mod: "Mod con batería externa",
  cartucho: "Cartucho",
  coil: "Coil",
  frasco: "Frasco de líquido",
  desechable: "Desechable",
  cable: "Cable",
  estuche: "Estuche u otro",
  bateria: "Batería",
};

function aFormulario(f: FilaProducto): Formulario {
  return {
    slug: f.slug,
    categoria: f.categoria,
    marca: f.marca,
    nombre: f.nombre,
    dato: f.dato,
    precio: String(f.precio),
    stock: String(f.stock),
    arte: f.arte,
    color: f.color ?? "",
    variante_nombre: f.variante_nombre ?? "",
    variante_opciones: (f.variante_opciones ?? []).join(", "),
    compatible: f.compatible ?? "",
    equipo: f.equipo ?? "",
    elegido: f.elegido ?? "",
    nicotina: f.nicotina,
    descripcion: f.descripcion,
    activo: f.activo,
    orden: String(f.orden),
  };
}

const vacioANull = (t: string) => (t.trim() ? t.trim() : null);
// Acepta "34990", "34.990" o "$34.990".
const entero = (t: string) => {
  const limpio = t.replace(/[\s.$]/g, "");
  return /^\d+$/.test(limpio) ? Number(limpio) : NaN;
};

function validar(f: Formulario) {
  const e: Partial<Record<keyof Formulario, string>> = {};
  if (!f.nombre.trim()) e.nombre = "Escribe el nombre del producto.";
  if (!f.marca.trim()) e.marca = "Escribe la marca.";
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(f.slug)) e.slug = "Solo minúsculas, números y guiones, por ejemplo xros-4-kit-pod.";
  if (Number.isNaN(entero(f.precio))) e.precio = "Escribe el precio en pesos, por ejemplo 34990.";
  if (Number.isNaN(entero(f.stock))) e.stock = "Escribe el stock como número entero (0 si no hay).";
  if (Number.isNaN(entero(f.orden))) e.orden = "Escribe un número entero.";
  if (f.variante_nombre.trim() && !f.variante_opciones.trim()) e.variante_opciones = "Escribe las opciones separadas por coma.";
  return e;
}

function aFila(f: Formulario) {
  const opciones = f.variante_opciones
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  return {
    slug: f.slug,
    categoria: f.categoria,
    marca: f.marca.trim(),
    nombre: f.nombre.trim(),
    dato: f.dato.trim(),
    precio: entero(f.precio),
    stock: entero(f.stock),
    arte: f.arte,
    color: vacioANull(f.color),
    variante_nombre: vacioANull(f.variante_nombre),
    variante_opciones: opciones.length > 0 ? opciones : null,
    compatible: vacioANull(f.compatible),
    equipo: vacioANull(f.equipo),
    elegido: vacioANull(f.elegido),
    nicotina: f.nicotina,
    descripcion: f.descripcion.trim(),
    activo: f.activo,
    orden: entero(f.orden),
  };
}

function mensajeError(error: { code?: string; message: string }) {
  if (error.code === "23505") return "Ya existe un producto con esa dirección. Cambia la dirección.";
  if (error.code === "42501") return "Tu usuario no tiene permiso para cambiar productos.";
  if (error.code === "23503") return "El equipo elegido no existe.";
  return `No se pudo guardar: ${error.message}`;
}

export default function PanelAdmin({ url, clave }: { url: string; clave: string }) {
  const supabase = useMemo<SupabaseClient>(() => createClient(url, clave), [url, clave]);
  const [sesion, setSesion] = useState<Session | null>(null);
  const [revisado, setRevisado] = useState(false);
  const [esAdmin, setEsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSesion(data.session);
      setRevisado(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_evento, s) => setSesion(s));
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!sesion) {
      setEsAdmin(null);
      return;
    }
    supabase
      .from("administradores")
      .select("user_id")
      .eq("user_id", sesion.user.id)
      .maybeSingle()
      .then(({ data }) => setEsAdmin(!!data));
  }, [supabase, sesion]);

  if (!revisado) return <p className="muted">Cargando…</p>;
  if (!sesion) return <Ingreso supabase={supabase} />;
  if (esAdmin === null) return <p className="muted">Revisando permisos…</p>;
  if (!esAdmin) {
    return (
      <div className="formulario">
        <h1>Panel de productos</h1>
        <p className="alerta">Tu usuario ({sesion.user.email}) no tiene permiso de administración.</p>
        <button type="button" className="boton secundario" onClick={() => supabase.auth.signOut()}>
          Salir
        </button>
      </div>
    );
  }
  return <Productos supabase={supabase} correo={sesion.user.email ?? ""} />;
}

function Ingreso({ supabase }: { supabase: SupabaseClient }) {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  return (
    <form
      className="formulario"
      onSubmit={async (e) => {
        e.preventDefault();
        setEnviando(true);
        setError("");
        const { error } = await supabase.auth.signInWithPassword({ email: correo.trim(), password: clave });
        if (error) setError("Correo o contraseña incorrectos.");
        setEnviando(false);
      }}
    >
      <Logo />
      <h1>Panel de productos</h1>
      <div className="campo">
        <label htmlFor="admin-correo">Correo</label>
        <input id="admin-correo" type="email" autoComplete="username" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
      </div>
      <div className="campo">
        <label htmlFor="admin-clave">Contraseña</label>
        <input
          id="admin-clave"
          type="password"
          autoComplete="current-password"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
        />
      </div>
      {error ? (
        <span className="error" role="alert">
          {error}
        </span>
      ) : null}
      <button type="submit" className="boton ancho" disabled={enviando}>
        {enviando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}

function Productos({ supabase, correo }: { supabase: SupabaseClient; correo: string }) {
  const [filas, setFilas] = useState<FilaProducto[] | null>(null);
  const [errorCarga, setErrorCarga] = useState("");
  const [editando, setEditando] = useState<{ form: Formulario; nuevo: boolean } | null>(null);
  const [aviso, setAviso] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const cargar = useCallback(async () => {
    const { data, error } = await supabase.from("productos").select(COLUMNAS).order("categoria").order("orden").order("nombre");
    if (error) setErrorCarga(`No se pudo leer el catálogo: ${error.message}`);
    else setFilas(data as FilaProducto[]);
  }, [supabase]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const equipos = (filas ?? []).filter((f) => f.categoria === "equipos");
  const q = busqueda.trim().toLowerCase();
  const visibles = (filas ?? []).filter((f) => !q || `${f.marca} ${f.nombre} ${f.slug}`.toLowerCase().includes(q));

  if (editando) {
    return (
      <Editor
        supabase={supabase}
        inicial={editando.form}
        nuevo={editando.nuevo}
        equipos={equipos}
        onListo={async (texto) => {
          setEditando(null);
          setAviso(texto);
          await cargar();
        }}
        onCancelar={() => setEditando(null)}
      />
    );
  }

  return (
    <div className="admin">
      <div className="admin-cabecera">
        <div>
          <h1>Productos</h1>
          <p className="muted">
            {correo} ·{" "}
            <button type="button" className="enlace" onClick={() => supabase.auth.signOut()}>
              Salir
            </button>
          </p>
        </div>
        <button
          type="button"
          className="boton"
          onClick={() => {
            setAviso("");
            setEditando({ form: NUEVO, nuevo: true });
          }}
        >
          Agregar producto
        </button>
      </div>

      {aviso ? (
        <p className="aviso-ok" role="status">
          {aviso}
        </p>
      ) : null}
      {errorCarga ? <p className="alerta">{errorCarga}</p> : null}

      <div className="campo">
        <label htmlFor="admin-buscar">Buscar</label>
        <input id="admin-buscar" type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Marca o nombre" />
      </div>

      {filas === null && !errorCarga ? <p className="muted">Cargando productos…</p> : null}
      {filas ? (
        <ul className="admin-lista">
          {visibles.map((f) => (
            <li key={f.slug}>
              <div>
                <b>{f.nombre}</b>
                <span className="muted">
                  {f.marca} · {CATEGORIAS.find((c) => c.slug === f.categoria)?.nombre ?? f.categoria}
                </span>
              </div>
              <span className="precio">{clp(f.precio)}</span>
              <span className={f.stock === 0 ? "sin-stock" : undefined}>Stock {f.stock}</span>
              <span className={f.activo ? "estado publicado" : "estado oculto"}>{f.activo ? "Publicado" : "Oculto"}</span>
              <button
                type="button"
                className="boton secundario"
                onClick={() => {
                  setAviso("");
                  setEditando({ form: aFormulario(f), nuevo: false });
                }}
              >
                Editar
              </button>
            </li>
          ))}
          {visibles.length === 0 ? <li className="muted">No hay productos que coincidan.</li> : null}
        </ul>
      ) : null}
    </div>
  );
}

function Editor({
  supabase,
  inicial,
  nuevo,
  equipos,
  onListo,
  onCancelar,
}: {
  supabase: SupabaseClient;
  inicial: Formulario;
  nuevo: boolean;
  equipos: FilaProducto[];
  onListo: (aviso: string) => void;
  onCancelar: () => void;
}) {
  const [f, setF] = useState(inicial);
  const [slugTocado, setSlugTocado] = useState(!nuevo);
  const [errores, setErrores] = useState<Partial<Record<keyof Formulario, string>>>({});
  const [errorGuardar, setErrorGuardar] = useState("");
  const [guardando, setGuardando] = useState(false);

  function cambiar<K extends keyof Formulario>(clave: K, valor: Formulario[K]) {
    setF((x) => {
      const siguiente = { ...x, [clave]: valor };
      // En un producto nuevo la dirección se arma sola con marca y nombre.
      if (nuevo && !slugTocado && (clave === "marca" || clave === "nombre")) {
        siguiente.slug = slugMarca(`${siguiente.marca} ${siguiente.nombre}`);
      }
      return siguiente;
    });
  }

  const texto = (clave: keyof Formulario, etiqueta: string, ayuda?: string, tipo: "text" | "area" = "text") => (
    <div className="campo">
      <label htmlFor={`f-${clave}`}>{etiqueta}</label>
      {tipo === "area" ? (
        <textarea id={`f-${clave}`} rows={4} value={f[clave] as string} onChange={(e) => cambiar(clave, e.target.value)} />
      ) : (
        <input
          id={`f-${clave}`}
          type="text"
          value={f[clave] as string}
          onChange={(e) => cambiar(clave, e.target.value)}
          aria-invalid={errores[clave] ? true : undefined}
          aria-describedby={errores[clave] ? `e-${clave}` : ayuda ? `a-${clave}` : undefined}
        />
      )}
      {ayuda ? (
        <span id={`a-${clave}`} className="ayuda-campo">
          {ayuda}
        </span>
      ) : null}
      {errores[clave] ? (
        <span id={`e-${clave}`} className="error">
          {errores[clave]}
        </span>
      ) : null}
    </div>
  );

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    const encontrados = validar(f);
    setErrores(encontrados);
    setErrorGuardar("");
    if (Object.keys(encontrados).length > 0) return;
    setGuardando(true);
    const fila = aFila(f);
    const { error } = nuevo
      ? await supabase.from("productos").insert(fila)
      : await supabase.from("productos").update(fila).eq("slug", inicial.slug);
    setGuardando(false);
    if (error) {
      setErrorGuardar(mensajeError(error));
      return;
    }
    onListo(`Guardado: ${fila.nombre}. La tienda lo muestra en menos de 1 minuto.`);
  }

  return (
    <form className="formulario admin-editor" onSubmit={guardar} noValidate>
      <h1>{nuevo ? "Agregar producto" : `Editar ${inicial.nombre}`}</h1>

      {texto("nombre", "Nombre")}
      {texto("marca", "Marca")}
      <div className="campo">
        <label htmlFor="f-categoria">Categoría</label>
        <select id="f-categoria" value={f.categoria} onChange={(e) => cambiar("categoria", e.target.value)}>
          {CATEGORIAS.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="admin-dos">
        {texto("precio", "Precio en pesos, IVA incluido", "Ejemplo: 34990")}
        {texto("stock", "Stock", "Unidades disponibles. Con 0 se muestra como agotado.")}
      </div>

      <label className="check">
        <input type="checkbox" checked={f.activo} onChange={(e) => cambiar("activo", e.target.checked)} />
        <span>Publicado en la tienda (desmárcalo para ocultarlo sin borrarlo)</span>
      </label>
      <label className="check">
        <input type="checkbox" checked={f.nicotina} onChange={(e) => cambiar("nicotina", e.target.checked)} />
        <span>Contiene nicotina (muestra la advertencia de nicotina)</span>
      </label>

      {texto("dato", "Características en una línea", "Ejemplo: 1.000 mAh · USB-C · cartucho 3 ml")}
      {texto("descripcion", "Descripción", "Sin mensajes de salud ni de dejar de fumar (Ley 21.642).", "area")}

      {f.categoria !== "equipos" ? (
        <div className="campo">
          <label htmlFor="f-equipo">Sirve para el equipo</label>
          <select id="f-equipo" value={f.equipo} onChange={(e) => cambiar("equipo", e.target.value)}>
            <option value="">Ninguno en particular</option>
            {equipos.map((eq) => (
              <option key={eq.slug} value={eq.slug}>
                {eq.marca} {eq.nombre}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      {texto("compatible", "Compatible con (texto)", "Opcional. Ejemplo: Cartuchos XROS 0,6 Ω y 0,8 Ω.")}

      <div className="admin-dos">
        {texto("variante_nombre", "Variante", "Opcional. Ejemplo: Color")}
        {texto("variante_opciones", "Opciones de la variante", "Separadas por coma. Ejemplo: Negro, Plata")}
      </div>

      {texto("elegido", "Sello \"Elegido por Vapeur\"", "Opcional: para quién es y por qué. Vacío = sin sello.")}

      <div className="admin-dos">
        <div className="campo">
          <label htmlFor="f-arte">Imagen provisoria</label>
          <select id="f-arte" value={f.arte} onChange={(e) => cambiar("arte", e.target.value)}>
            {ARTES.map((a) => (
              <option key={a} value={a}>
                {NOMBRE_ARTE[a]}
              </option>
            ))}
          </select>
        </div>
        {texto("orden", "Orden en la lista", "Más bajo = aparece antes.")}
      </div>

      {nuevo ? (
        <div className="campo">
          <label htmlFor="f-slug">Dirección del producto</label>
          <input
            id="f-slug"
            type="text"
            value={f.slug}
            onChange={(e) => {
              setSlugTocado(true);
              cambiar("slug", e.target.value);
            }}
            aria-invalid={errores.slug ? true : undefined}
            aria-describedby="a-slug"
          />
          <span id="a-slug" className="ayuda-campo">
            vapeur.cl/producto/{f.slug || "…"} · No se puede cambiar después.
          </span>
          {errores.slug ? <span className="error">{errores.slug}</span> : null}
        </div>
      ) : (
        <p className="ayuda-campo">Dirección: vapeur.cl/producto/{f.slug}</p>
      )}

      {errorGuardar ? (
        <p className="alerta" role="alert">
          {errorGuardar}
        </p>
      ) : null}
      {Object.keys(errores).length > 0 ? (
        <p className="error" role="alert">
          Revisa los campos marcados.
        </p>
      ) : null}

      <div className="admin-acciones">
        <button type="submit" className="boton" disabled={guardando}>
          {guardando ? "Guardando…" : "Guardar"}
        </button>
        <button type="button" className="boton secundario" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
