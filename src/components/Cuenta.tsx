"use client";

import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

// Cuenta del cliente: entra con un código que le llega al correo (Supabase
// Auth, sin contraseña). La sesión vive en este navegador con su propia clave,
// separada de la del panel /admin. Comprar como invitado sigue funcionando.
// Nunca se guardan RUT, fecha de nacimiento ni datos de tarjeta.

export type Perfil = {
  nombre: string;
  telefono: string;
  region: string;
  comuna: string;
  direccion: string;
  depto: string;
};

export const PERFIL_VACIO: Perfil = { nombre: "", telefono: "", region: "", comuna: "", direccion: "", depto: "" };

type EstadoCuenta = {
  // false mientras se lee la sesión guardada: así no parpadea "Ingresar".
  listo: boolean;
  disponible: boolean;
  correo: string | null;
  // null = la cuenta existe pero todavía no completa el alta (mayoría de edad y términos).
  perfil: Perfil | null;
  supabase: SupabaseClient | null;
  sesion: Session | null;
  enviarCodigo: (correo: string) => Promise<void>;
  verificarCodigo: (correo: string, codigo: string) => Promise<void>;
  crearPerfil: (datos: Perfil) => Promise<void>;
  guardarPerfil: (datos: Partial<Perfil>) => Promise<void>;
  salir: () => Promise<void>;
};

const Contexto = createContext<EstadoCuenta | null>(null);

const COLUMNAS_PERFIL = "nombre, telefono, region, comuna, direccion, depto";

function limpiar(p: Partial<Record<keyof Perfil, string | null>>): Perfil {
  return {
    nombre: p.nombre ?? "",
    telefono: p.telefono ?? "",
    region: p.region ?? "",
    comuna: p.comuna ?? "",
    direccion: p.direccion ?? "",
    depto: p.depto ?? "",
  };
}

// Supabase responde en inglés; al cliente se le muestra un mensaje claro.
function traducir(error: { message?: string; status?: number; code?: string }): Error {
  const m = (error.message || "").toLowerCase();
  if (error.code === "otp_expired" || m.includes("expired") || m.includes("invalid"))
    return new Error("El código no es correcto o ya venció. Pide uno nuevo.");
  if (error.status === 429 || m.includes("rate limit") || m.includes("security purposes"))
    return new Error("Pediste varios códigos seguidos. Espera un minuto y vuelve a intentarlo.");
  if (m.includes("signups not allowed")) return new Error("Por ahora no se pueden crear cuentas nuevas. Escríbenos y te ayudamos.");
  return new Error("No pudimos conectar con tu cuenta. Intenta de nuevo en unos minutos.");
}

export function CuentaProvider({ url, clave, children }: { url?: string; clave?: string; children: React.ReactNode }) {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [sesion, setSesion] = useState<Session | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [listo, setListo] = useState(false);
  const disponible = Boolean(url && clave);

  // La librería de Supabase se carga después de pintar la página, para no
  // hacer más pesada la primera visita.
  useEffect(() => {
    if (!url || !clave) {
      setListo(true);
      return;
    }
    let vivo = true;
    let cancelar: (() => void) | undefined;
    import("@supabase/supabase-js").then(({ createClient }) => {
      if (!vivo) return;
      const cliente = createClient(url, clave, {
        auth: { storageKey: "vapeur-cuenta", persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
      });
      setSupabase(cliente);
      const { data } = cliente.auth.onAuthStateChange((_evento, s) => {
        setSesion(s);
        if (!s) {
          setPerfil(null);
          setListo(true);
        }
      });
      cancelar = () => data.subscription.unsubscribe();
    });
    return () => {
      vivo = false;
      cancelar?.();
    };
  }, [url, clave]);

  const usuario = sesion?.user.id;

  // Con sesión, se lee el perfil (RLS: cada cliente ve solo el suyo).
  useEffect(() => {
    if (!supabase || !usuario) return;
    let vivo = true;
    supabase
      .from("perfiles")
      .select(COLUMNAS_PERFIL)
      .eq("usuario_id", usuario)
      .maybeSingle()
      .then(({ data }) => {
        if (!vivo) return;
        setPerfil(data ? limpiar(data) : null);
        setListo(true);
      });
    return () => {
      vivo = false;
    };
  }, [supabase, usuario]);

  const enviarCodigo = useCallback(
    async (correo: string) => {
      if (!supabase) throw new Error("La cuenta no está disponible en este momento.");
      const { error } = await supabase.auth.signInWithOtp({ email: correo, options: { shouldCreateUser: true } });
      if (error) throw traducir(error);
    },
    [supabase],
  );

  const verificarCodigo = useCallback(
    async (correo: string, codigo: string) => {
      if (!supabase) throw new Error("La cuenta no está disponible en este momento.");
      setListo(false);
      const { error } = await supabase.auth.verifyOtp({ email: correo, token: codigo, type: "email" });
      if (error) {
        setListo(true);
        throw traducir(error);
      }
    },
    [supabase],
  );

  const crearPerfil = useCallback(
    async (datos: Perfil) => {
      if (!supabase || !usuario) throw new Error("Tu sesión se cerró. Vuelve a ingresar.");
      const fila = { usuario_id: usuario, ...datos, mayor_de_edad: true, acepto_terminos_en: new Date().toISOString() };
      const { error } = await supabase.from("perfiles").upsert(fila);
      if (error) throw new Error("No pudimos crear tu cuenta. Intenta de nuevo.");
      setPerfil(datos);
    },
    [supabase, usuario],
  );

  const guardarPerfil = useCallback(
    async (datos: Partial<Perfil>) => {
      if (!supabase || !usuario || !perfil) throw new Error("Tu sesión se cerró. Vuelve a ingresar.");
      const nuevo = { ...perfil, ...datos };
      const { error } = await supabase.from("perfiles").update(nuevo).eq("usuario_id", usuario);
      if (error) throw new Error("No pudimos guardar tus datos. Intenta de nuevo.");
      setPerfil(nuevo);
    },
    [supabase, usuario, perfil],
  );

  const salir = useCallback(async () => {
    await supabase?.auth.signOut();
  }, [supabase]);

  return (
    <Contexto.Provider
      value={{
        listo,
        disponible,
        correo: sesion?.user.email ?? null,
        perfil,
        supabase,
        sesion,
        enviarCodigo,
        verificarCodigo,
        crearPerfil,
        guardarPerfil,
        salir,
      }}
    >
      {children}
    </Contexto.Provider>
  );
}

export function useCuenta() {
  const c = useContext(Contexto);
  if (!c) throw new Error("useCuenta va dentro de CuentaProvider");
  return c;
}
