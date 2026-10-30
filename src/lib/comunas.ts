// Regiones y comunas de Chile (346), de norte a sur, para elegir el destino
// del despacho. `ine` es el código de región del INE: con él se busca la
// región en la API de cobertura de Chilexpress.

export type Region = { nombre: string; ine: number; comunas: string[] };

export const REGIONES: Region[] = [
  { nombre: "Arica y Parinacota", ine: 15, comunas: ["Arica", "Camarones", "General Lagos", "Putre"] },
  {
    nombre: "Tarapacá",
    ine: 1,
    comunas: ["Alto Hospicio", "Camiña", "Colchane", "Huara", "Iquique", "Pica", "Pozo Almonte"],
  },
  {
    nombre: "Antofagasta",
    ine: 2,
    comunas: ["Antofagasta", "Calama", "María Elena", "Mejillones", "Ollagüe", "San Pedro de Atacama", "Sierra Gorda", "Taltal", "Tocopilla"],
  },
  {
    nombre: "Atacama",
    ine: 3,
    comunas: ["Alto del Carmen", "Caldera", "Chañaral", "Copiapó", "Diego de Almagro", "Freirina", "Huasco", "Tierra Amarilla", "Vallenar"],
  },
  {
    nombre: "Coquimbo",
    ine: 4,
    comunas: [
      "Andacollo", "Canela", "Combarbalá", "Coquimbo", "Illapel", "La Higuera", "La Serena", "Los Vilos",
      "Monte Patria", "Ovalle", "Paihuano", "Punitaqui", "Río Hurtado", "Salamanca", "Vicuña",
    ],
  },
  {
    nombre: "Valparaíso",
    ine: 5,
    comunas: [
      "Algarrobo", "Cabildo", "Calle Larga", "Cartagena", "Casablanca", "Catemu", "Concón", "El Quisco", "El Tabo",
      "Hijuelas", "Isla de Pascua", "Juan Fernández", "La Calera", "La Cruz", "La Ligua", "Limache", "Llaillay",
      "Los Andes", "Nogales", "Olmué", "Panquehue", "Papudo", "Petorca", "Puchuncaví", "Putaendo", "Quillota",
      "Quilpué", "Quintero", "Rinconada", "San Antonio", "San Esteban", "San Felipe", "Santa María", "Santo Domingo",
      "Valparaíso", "Villa Alemana", "Viña del Mar", "Zapallar",
    ],
  },
  {
    nombre: "Región Metropolitana",
    ine: 13,
    comunas: [
      "Alhué", "Buin", "Calera de Tango", "Cerrillos", "Cerro Navia", "Colina", "Conchalí", "Curacaví", "El Bosque",
      "El Monte", "Estación Central", "Huechuraba", "Independencia", "Isla de Maipo", "La Cisterna", "La Florida",
      "La Granja", "La Pintana", "La Reina", "Lampa", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul",
      "Maipú", "María Pinto", "Melipilla", "Ñuñoa", "Padre Hurtado", "Paine", "Pedro Aguirre Cerda", "Peñaflor",
      "Peñalolén", "Pirque", "Providencia", "Pudahuel", "Puente Alto", "Quilicura", "Quinta Normal", "Recoleta",
      "Renca", "San Bernardo", "San Joaquín", "San José de Maipo", "San Miguel", "San Pedro", "San Ramón", "Santiago",
      "Talagante", "Tiltil", "Vitacura",
    ],
  },
  {
    nombre: "O'Higgins",
    ine: 6,
    comunas: [
      "Chépica", "Chimbarongo", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "La Estrella", "Las Cabras",
      "Litueche", "Lolol", "Machalí", "Malloa", "Marchigüe", "Mostazal", "Nancagua", "Navidad", "Olivar", "Palmilla",
      "Paredones", "Peralillo", "Peumo", "Pichidegua", "Pichilemu", "Placilla", "Pumanque", "Quinta de Tilcoco",
      "Rancagua", "Rengo", "Requínoa", "San Fernando", "San Vicente", "Santa Cruz",
    ],
  },
  {
    nombre: "Maule",
    ine: 7,
    comunas: [
      "Cauquenes", "Chanco", "Colbún", "Constitución", "Curepto", "Curicó", "Empedrado", "Hualañé", "Licantén",
      "Linares", "Longaví", "Maule", "Molina", "Parral", "Pelarco", "Pelluhue", "Pencahue", "Rauco", "Retiro",
      "Río Claro", "Romeral", "Sagrada Familia", "San Clemente", "San Javier", "San Rafael", "Talca", "Teno",
      "Vichuquén", "Villa Alegre", "Yerbas Buenas",
    ],
  },
  {
    nombre: "Ñuble",
    ine: 16,
    comunas: [
      "Bulnes", "Chillán", "Chillán Viejo", "Cobquecura", "Coelemu", "Coihueco", "El Carmen", "Ninhue", "Ñiquén",
      "Pemuco", "Pinto", "Portezuelo", "Quillón", "Quirihue", "Ránquil", "San Carlos", "San Fabián", "San Ignacio",
      "San Nicolás", "Treguaco", "Yungay",
    ],
  },
  {
    nombre: "Biobío",
    ine: 8,
    comunas: [
      "Alto Biobío", "Antuco", "Arauco", "Cabrero", "Cañete", "Chiguayante", "Concepción", "Contulmo", "Coronel",
      "Curanilahue", "Florida", "Hualpén", "Hualqui", "Laja", "Lebu", "Los Álamos", "Los Ángeles", "Lota", "Mulchén",
      "Nacimiento", "Negrete", "Penco", "Quilaco", "Quilleco", "San Pedro de la Paz", "San Rosendo", "Santa Bárbara",
      "Santa Juana", "Talcahuano", "Tirúa", "Tomé", "Tucapel", "Yumbel",
    ],
  },
  {
    nombre: "La Araucanía",
    ine: 9,
    comunas: [
      "Angol", "Carahue", "Cholchol", "Collipulli", "Cunco", "Curacautín", "Curarrehue", "Ercilla", "Freire",
      "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Lonquimay", "Los Sauces", "Lumaco", "Melipeuco",
      "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Purén", "Renaico", "Saavedra",
      "Temuco", "Teodoro Schmidt", "Toltén", "Traiguén", "Victoria", "Vilcún", "Villarrica",
    ],
  },
  {
    nombre: "Los Ríos",
    ine: 14,
    comunas: [
      "Corral", "Futrono", "La Unión", "Lago Ranco", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco",
      "Panguipulli", "Río Bueno", "Valdivia",
    ],
  },
  {
    nombre: "Los Lagos",
    ine: 10,
    comunas: [
      "Ancud", "Calbuco", "Castro", "Chaitén", "Chonchi", "Cochamó", "Curaco de Vélez", "Dalcahue", "Fresia",
      "Frutillar", "Futaleufú", "Hualaihué", "Llanquihue", "Los Muermos", "Maullín", "Osorno", "Palena",
      "Puerto Montt", "Puerto Octay", "Puerto Varas", "Puqueldón", "Purranque", "Puyehue", "Queilén", "Quellón",
      "Quemchi", "Quinchao", "Río Negro", "San Juan de la Costa", "San Pablo",
    ],
  },
  {
    nombre: "Aysén",
    ine: 11,
    comunas: ["Aysén", "Chile Chico", "Cisnes", "Cochrane", "Coyhaique", "Guaitecas", "Lago Verde", "O'Higgins", "Río Ibáñez", "Tortel"],
  },
  {
    nombre: "Magallanes",
    ine: 12,
    comunas: [
      "Antártica", "Cabo de Hornos", "Laguna Blanca", "Natales", "Porvenir", "Primavera", "Punta Arenas", "Río Verde",
      "San Gregorio", "Timaukel", "Torres del Paine",
    ],
  },
];

export function buscarRegion(nombre: string) {
  return REGIONES.find((r) => r.nombre === nombre);
}

export function comunaValida(region: string, comuna: string) {
  return buscarRegion(region)?.comunas.includes(comuna) ?? false;
}
