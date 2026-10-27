import type { Metadata } from "next";
import PanelAdmin from "@/components/PanelAdmin";

export const metadata: Metadata = { title: "Panel de productos" };

// La clave publicable de Supabase se puede mostrar en el navegador: los
// permisos los controla la base de datos (RLS, ver supabase/catalogo.sql).
export default function PaginaAdmin() {
  const url = process.env.SUPABASE_URL;
  const clave = process.env.SUPABASE_PUBLISHABLE_KEY;

  return (
    <div className="wrap pagina">
      {url && clave ? (
        <PanelAdmin url={url} clave={clave} />
      ) : (
        <div className="formulario">
          <h1>Panel de productos</h1>
          <p className="muted">Falta configurar SUPABASE_URL y SUPABASE_PUBLISHABLE_KEY en este servidor.</p>
        </div>
      )}
    </div>
  );
}
