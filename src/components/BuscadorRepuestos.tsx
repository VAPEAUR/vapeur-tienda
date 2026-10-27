"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCatalogo } from "@/components/Catalogo";

export default function BuscadorRepuestos() {
  const router = useRouter();
  const { equipos } = useCatalogo();
  const [equipo, setEquipo] = useState("");

  return (
    <form
      className="buscador"
      onSubmit={(e) => {
        e.preventDefault();
        if (equipo) router.push(`/repuestos/${equipo}`);
      }}
    >
      <label htmlFor="equipo">¿Qué equipo tienes?</label>
      <div className="fila">
        <select id="equipo" value={equipo} onChange={(e) => setEquipo(e.target.value)} required>
          <option value="">Elige tu equipo</option>
          {equipos().map((e) => (
            <option key={e.slug} value={e.slug}>
              {e.marca} {e.nombre}
            </option>
          ))}
        </select>
        <button type="submit" className="boton">
          Ver repuestos
        </button>
      </div>
    </form>
  );
}
