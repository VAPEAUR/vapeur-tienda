import Link from "next/link";

export default function NoEncontrada() {
  return (
    <div className="wrap pagina angosta vacio">
      <h1>No encontramos esta página</h1>
      <p className="muted">Puede que el producto ya no esté o que el enlace tenga un error.</p>
      <Link href="/" className="boton">
        Volver al inicio
      </Link>
    </div>
  );
}
