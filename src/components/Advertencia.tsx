// Advertencia sanitaria en blanco y negro, como en el envase (Ley 21.642).
import { advertenciaPara } from "@/lib/legal";

export default function Advertencia({ producto }: { producto: { categoria: string; nicotina: boolean } }) {
  return (
    <p className="advertencia" role="note">
      ADVERTENCIA: {advertenciaPara(producto).join(" ")}
    </p>
  );
}
