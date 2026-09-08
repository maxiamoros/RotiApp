const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed del menú completo y prompts de IA...');

  // 1. Crear Categorías Principales
  const categoriasBase = [
    { nombre: 'Platos Principales', emoji: '🍽️' },
    { nombre: 'Bebidas', emoji: '🥤' }
  ];

  const categoriasDb = {};
  for (const cat of categoriasBase) {
    const creada = await prisma.categoria.upsert({
      where: { nombre: cat.nombre },
      update: { emoji: cat.emoji, activo: true },
      create: { nombre: cat.nombre, emoji: cat.emoji, activo: true }
    });
    categoriasDb[creada.nombre] = creada;
  }
  console.log('✅ Categorías "Platos Principales" y "Bebidas" preparadas.');

  // 2. Definición completa de productos con Prompts IA para fotografía gastronómica
  const productosBase = [
    // --- PLATOS PRINCIPALES ---
    {
      nombre: 'Milanesa de carne',
      precio: 6500,
      imagenUrl: '/images/milanesa_carne.jpg',
      promptIA: 'Fotografía gastronómica profesional de una milanesa de carne servida sobre un plato cerámico. Filete empanado crujiente y dorado, acompañado de una rodaja de limón fresco y perejil picado. Toma a 45 grados sobre mesa neutra sin personas ni elementos extra.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Milanesa de carne a la napolitana',
      precio: 7500,
      imagenUrl: '/images/milanesa_napolitana.jpg',
      promptIA: 'Fotografía gastronómica profesional de una milanesa de carne a la napolitana sobre plato. Milanesa empanada y crujiente gratinada con abundante queso mozzarella derretido, salsa de tomate casera, jamón cocido y orégano. Toma cerrada enfocada exclusivamente en el plato.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Milanesa de pollo',
      precio: 6000,
      imagenUrl: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=400',
      promptIA: 'Fotografía gastronómica profesional de una milanesa de pechuga de pollo empanada y dorada servida en plato cerámico blanco. Decorada con rodaja de limón fresco y hojas de perejil, iluminación cálida de restaurante sobre plato.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Milanesa de pollo a la napolitana',
      precio: 7000,
      imagenUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=400',
      promptIA: 'Fotografía gastronómica profesional de una milanesa de pollo a la napolitana servida en plato. Pechuga empanada y crocante cubierta con queso mozzarella fundido, salsa de tomate y jamón gratinado, sin personas de fondo.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Milanesa (carne o pollo) con papas fritas',
      precio: 8500,
      imagenUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&q=80&w=400',
      promptIA: 'Fotografía gastronómica profesional de una milanesa dorada servida junto a una porción generosa de papas fritas bastón crocantes en plato amplio. Toma cenital a 45 grados enfocada en el plato servido.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Lomito completo',
      precio: 8900,
      imagenUrl: '/images/lomito_completo.jpg',
      promptIA: 'Fotografía gastronómica profesional de un sándwich lomito completo servido picado sobre plato. Bife de lomo tierno a la plancha en pan tostado con queso mozzarella derretido, huevo frito con yema jugosa, jamón, lechuga y tomate fresco.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Pizza Fugazzeta',
      precio: 7800,
      imagenUrl: '/images/pizza_fugazzeta.jpg',
      promptIA: 'Fotografía gastronómica profesional de una pizza fugazzeta rellena servida en tabla o plato. Masa dorada rellena de queso mozzarella chorreante, cubierta de cebolla caramelizada y orégano.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Pizza Napolitana',
      precio: 8200,
      imagenUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=400',
      promptIA: 'Fotografía gastronómica profesional de una pizza napolitana argentina servida en plato. Queso mozzarella fundido, rodajas de tomate natural fresco, ajo picado, aceitunas verdes y albahaca sobre masa crujiente.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Pizza Muzzarella',
      precio: 7000,
      imagenUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400',
      promptIA: 'Fotografía gastronómica profesional de una pizza muzzarella clásica servida en plato. Capa dorada y fundida de queso mozzarella con salsa de tomate y aceitunas sobre masa artesanal.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Pizza Con ananá',
      precio: 8500,
      imagenUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400',
      promptIA: 'Fotografía gastronómica profesional de una pizza con ananá servida sobre plato. Queso mozzarella fundido, trozos jugosos de ananá dorado y láminas de jamón cocido sobre base de pizza dorada.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Tarta de Jamón y Queso',
      precio: 4200,
      imagenUrl: 'https://images.unsplash.com/photo-1601000938259-9e92002320b2?auto=format&fit=crop&q=80&w=400',
      promptIA: 'Fotografía gastronómica profesional de una porción de tarta de jamón y queso servida sobre plato blanco. Masa hojaldrada crujiente con abundante relleno cremoso de jamón picado y queso fundido.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Tarta de Acelga y Queso',
      precio: 4000,
      imagenUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
      promptIA: 'Fotografía gastronómica profesional de una porción de tarta de acelga, espinaca y queso gratinado sobre plato. Relleno abundante de verduras sazonadas y masa hojaldrada dorada.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Tarta de Choclo y Humita',
      precio: 4200,
      imagenUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400',
      promptIA: 'Fotografía gastronómica profesional de una porción de tarta de choclo cremoso y humita servida en plato. Relleno de maíz dulce gratinado con queso sobre masa crujiente.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Ñoquis de Papa',
      precio: 6200,
      imagenUrl: '/images/noquis_papa.jpg',
      promptIA: 'Fotografía gastronómica profesional de un plato hondo con ñoquis de papa artesanal servidos con abundante salsa tuco de tomate, queso parmesano rallado y hoja de albahaca fresca.',
      categoriaNombre: 'Platos Principales'
    },
    {
      nombre: 'Ravioles de Verdura y Carne',
      precio: 6800,
      imagenUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=400',
      promptIA: 'Fotografía gastronómica profesional de un plato de ravioles de verdura y carne bañados en salsa boloñesa casera y espolvoreados con queso rallado sobre plato de pasta.',
      categoriaNombre: 'Platos Principales'
    },

    // --- BEBIDAS ---
    {
      nombre: 'Coca Cola 1.25 Lts',
      precio: 2500,
      imagenUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400',
      promptIA: 'Fotografía de producto gastronómico de una botella de Coca Cola de 1.25 Lts helada junto a un vaso con gaseosa fría, cubos de hielo y gotas de condensación sobre fondo limpio.',
      categoriaNombre: 'Bebidas'
    },
    {
      nombre: 'Sprite',
      precio: 2400,
      imagenUrl: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&q=80&w=400',
      promptIA: 'Fotografía de producto gastronómico de una botella de Sprite helada con gotas de agua y un vaso de gaseosa transparente lima-limón burbujeante con hielo.',
      categoriaNombre: 'Bebidas'
    },
    {
      nombre: 'Fanta',
      precio: 2400,
      imagenUrl: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&q=80&w=400',
      promptIA: 'Fotografía de producto de una botella de Fanta Naranja bien fría servida junto a un vaso de gaseosa sabor naranja con gas y hielo.',
      categoriaNombre: 'Bebidas'
    },
    {
      nombre: 'Cerveza Andes',
      precio: 3200,
      imagenUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=400',
      promptIA: 'Fotografía de bebida comercial de una botella de cerveza Andes rubia servida en vaso alto helado con espuma cremosa y gotas de humedad en el vidrio.',
      categoriaNombre: 'Bebidas'
    },
    {
      nombre: 'Vino Malbec',
      precio: 4500,
      imagenUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=400',
      promptIA: 'Fotografía de botella de vino tinto Malbec argentino junto a una copa de cristal con vino rojo rubí intenso, sobre mesa sobria de presentación.',
      categoriaNombre: 'Bebidas'
    },
    {
      nombre: 'Vino Blanco',
      precio: 4200,
      imagenUrl: 'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?auto=format&fit=crop&q=80&w=400',
      promptIA: 'Fotografía de botella de vino blanco helado servido en copa transparente de cristal con reflejos dorados y fondo estético claro.',
      categoriaNombre: 'Bebidas'
    },
    {
      nombre: 'Agua',
      precio: 1200,
      imagenUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4e?auto=format&fit=crop&q=80&w=400',
      promptIA: 'Fotografía de producto minimalista de una botella de agua mineral transparente servida en vaso de vidrio con cubos de hielo traslúcidos.',
      categoriaNombre: 'Bebidas'
    },
    {
      nombre: 'Soda',
      precio: 1500,
      imagenUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&q=80&w=400',
      promptIA: 'Fotografía de bebida de un sifón de soda tradicional junto a un vaso con agua con gas efervescente y cubos de hielo.',
      categoriaNombre: 'Bebidas'
    }
  ];

  for (const prod of productosBase) {
    const categoria = categoriasDb[prod.categoriaNombre];
    if (!categoria) continue;

    const data = {
      nombre: prod.nombre,
      precio: prod.precio,
      imagenUrl: prod.imagenUrl,
      promptIA: prod.promptIA,
      categoriaId: categoria.id,
      activo: true
    };

    const dbProd = await prisma.producto.findFirst({ where: { nombre: prod.nombre } });
    if (!dbProd) {
      await prisma.producto.create({ data });
      console.log(`✅ Producto creado: ${prod.nombre}`);
    } else {
      await prisma.producto.update({
        where: { id: dbProd.id },
        data
      });
      console.log(`🔄 Producto actualizado: ${prod.nombre}`);
    }
  }

  console.log('🎉 Seed completado con éxito.');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
