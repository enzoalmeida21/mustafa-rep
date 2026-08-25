import Image from "next/image";

const photos = [
  { src: "/hero/expo-01.jpg", alt: "Degustação Pinheirense em atacarejo" },
  { src: "/hero/expo-02.jpg", alt: "Balcão de ativação com equipe Mustafá" },
  { src: "/hero/expo-04.jpg", alt: "Corredor com exposições das marcas" },
  { src: "/hero/expo-08.jpg", alt: "Equipe em reposição e merchandising" },
];

export function ExpoGallery() {
  return (
    <section className="container py-8">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--gold)]">
            Em loja
          </p>
          <h2 className="mt-1 text-xl font-extrabold text-[var(--ink)] md:text-2xl">
            Nossas exposições
          </h2>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {photos.map((photo) => (
          <div
            key={photo.src}
            className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius)] bg-white"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover transition duration-500 hover:scale-[1.03]"
              sizes="(max-width:768px) 50vw, 25vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
