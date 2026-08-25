import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.industry.deleteMany();

  const oliveira = await prisma.industry.create({
    data: {
      name: "Oliveira",
      slug: "oliveira",
      tagline: "Doces e laticínios com tradição de gôndola",
      description:
        "Hall Oliveira: doces cremosos e mercearia com alto giro para supermercado, atacarejo e food service.",
      coverImage: "/hero/expo-09.jpg",
      logoImage: "/products/oliveira-doce-leite-900g.png",
      accentColor: "#c62828",
      sortOrder: 1,
    },
  });

  const pinheirense = await prisma.industry.create({
    data: {
      name: "Pinheirense",
      slug: "pinheirense",
      tagline: "Bebidas e coquetéis com presença de PDV",
      description:
        "Hall Pinheirense: linha de bebidas e coquetéis para ativação, degustação e revenda no varejo.",
      coverImage: "/hero/expo-03.jpg",
      logoImage: "/products/pinheirense-coquetel-suave-tinto.png",
      accentColor: "#b71c1c",
      sortOrder: 2,
    },
  });

  const casafort = await prisma.industry.create({
    data: {
      name: "Casafort",
      slug: "casafort",
      tagline: "Utilidades domésticas de alta resistência",
      description:
        "Hall Casafort: sacos para lixo e utilidades com embalagem econômica e performance de gôndola.",
      coverImage: "/hero/expo-08.jpg",
      logoImage: "/products/casafort-saco-lixo-100l.png",
      accentColor: "#d32f2f",
      sortOrder: 3,
    },
  });

  const wyda = await prisma.industry.create({
    data: {
      name: "Wyda",
      slug: "wyda",
      tagline: "Linha prática para facilitar a rotina",
      description:
        "Hall Wyda: folhas de alumínio e utilidades desenvolvidas para facilitar o dia a dia do consumidor.",
      coverImage: "/hero/expo-05.jpg",
      logoImage: "/products/wyda-folha-aluminio.png",
      accentColor: "#1565c0",
      sortOrder: 4,
    },
  });

  const alklin = await prisma.industry.create({
    data: {
      name: "Alklin",
      slug: "alklin",
      tagline: "Limpeza leve com fibras biodegradáveis",
      description:
        "Hall Alklin: panos multiuso e soluções de limpeza com apelo sustentável e boa rotatividade.",
      coverImage: "/hero/expo-06.jpg",
      logoImage: "/products/alklin-pano-multiuso.png",
      accentColor: "#2e7d32",
      sortOrder: 5,
    },
  });

  const doces = await prisma.category.create({
    data: {
      name: "Doces & Mercearia",
      slug: "doces-mercearia",
      description: "Doces e mercearia.",
      sortOrder: 1,
    },
  });

  const bebidas = await prisma.category.create({
    data: {
      name: "Bebidas",
      slug: "bebidas",
      description: "Bebidas e coquetéis.",
      sortOrder: 2,
    },
  });

  const limpeza = await prisma.category.create({
    data: {
      name: "Limpeza & Utilidades",
      slug: "limpeza-utilidades",
      description: "Limpeza e utilidades.",
      sortOrder: 3,
    },
  });

  await prisma.product.createMany({
    data: [
      {
        brand: "OLIVEIRA",
        name: "Doce de Leite Oliveira com Soro de Leite 900g",
        slug: "doce-de-leite-oliveira-com-soro-de-leite-900g",
        description:
          "Doce de leite cremoso Oliveira com soro de leite. Embalagem 900g ideal para mercearia e food service.",
        price: 23.99,
        unit: "unid.",
        packLabel: "900 g",
        ean: "7896202891491",
        sku: "270706",
        featured: true,
        industryId: oliveira.id,
        categoryId: doces.id,
        imageUrl: "/products/oliveira-doce-leite-900g.png",
      },
      {
        brand: "PINHEIRENSE",
        name: "Coquetel Suave Tinto Pinheirense",
        slug: "coquetel-suave-tinto-pinheirense-870ml",
        description:
          "Coquetel alcoólico suave tinto Pinheirense. Conteúdo 870ml — alta rotatividade no PDV.",
        price: 4.49,
        compareAtPrice: 4.65,
        unit: "unid.",
        packLabel: "870 ml",
        ean: "7898307570813",
        sku: "101784",
        featured: true,
        industryId: pinheirense.id,
        categoryId: bebidas.id,
        imageUrl: "/products/pinheirense-coquetel-suave-tinto.png",
      },
      {
        brand: "CASAFORT",
        name: "Saco Lixo Casafort 100 Litros 25X1 100L",
        slug: "saco-lixo-casafort-100-litros-25x1",
        description:
          "Sacos para lixo Casafort 100L, embalagem econômica com 25 unidades. Resistente, fundo reforçado.",
        price: 42.9,
        unit: "unid.",
        packLabel: "1 unidade",
        ean: "7896749313036",
        sku: "381550",
        featured: true,
        industryId: casafort.id,
        categoryId: limpeza.id,
        imageUrl: "/products/casafort-saco-lixo-100l.png",
      },
      {
        brand: "WYDA",
        name: "Folha de Alumínio Wyda 30cmx7,5m",
        slug: "folha-de-aluminio-wyda-30cmx7-5m",
        description:
          "Folha de alumínio Wyda, largura 30cm e comprimento 7,5m. Mais resistente para uso doméstico.",
        price: 7.79,
        unit: "unid.",
        packLabel: "1 unidade",
        ean: "7898927947057",
        sku: "98012",
        featured: true,
        industryId: wyda.id,
        categoryId: limpeza.id,
        imageUrl: "/products/wyda-folha-aluminio.png",
      },
      {
        brand: "ALKLIN",
        name: "Pano Multiuso Azul Alklin 33cm x 50cm 5 Unidades",
        slug: "pano-multiuso-azul-alklin-33x50-5un",
        description:
          "Panos para limpeza leve Alklin multiuso, 33cm x 50cm. Pacote com 5 unidades. Fibras 100% biodegradáveis.",
        price: 7.39,
        unit: "unid.",
        packLabel: "1 unidade",
        ean: "7897750770078",
        sku: "281924",
        featured: true,
        industryId: alklin.id,
        categoryId: limpeza.id,
        imageUrl: "/products/alklin-pano-multiuso.png",
      },
    ],
  });

  console.log("Seed concluído: indústrias e produtos Mustafá cadastrados.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
