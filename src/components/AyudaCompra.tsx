import { enlaceWhatsApp } from "@/lib/contacto";

// En el carro y el checkout no va el botón flotante de WhatsApp (en el celular
// tapaba campos y botones): la ayuda queda como enlace dentro de la página.
export default function AyudaCompra() {
  return (
    <p className="ayuda-compra">
      ¿Necesitas ayuda?{" "}
      <a href={enlaceWhatsApp("Hola, tengo una duda con mi compra en Vapeur.")} target="_blank" rel="noopener noreferrer">
        Escríbenos por WhatsApp
      </a>
      .
    </p>
  );
}
