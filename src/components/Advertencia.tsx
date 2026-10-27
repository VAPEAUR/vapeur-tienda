// Advertencia sanitaria en blanco y negro, como en el envase.
// TEXTO PROVISORIO: lo debe validar el abogado (Ley 21.642 y su reglamento).
export default function Advertencia({ nicotina = true }: { nicotina?: boolean }) {
  return (
    <p className="advertencia" role="note">
      {nicotina
        ? "ADVERTENCIA: Este producto contiene nicotina, sustancia altamente adictiva. Venta solo a mayores de 18 años."
        : "ADVERTENCIA: Venta solo a mayores de 18 años. Se usa con líquidos que pueden contener nicotina, sustancia altamente adictiva."}
    </p>
  );
}
