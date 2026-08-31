import Image from "next/image";

const FILM_GRADE = "[filter:sepia(0.2)_contrast(1.05)_saturate(1.05)]";
const VIGNETTE =
  "radial-gradient(ellipse at center, transparent 45%, rgba(8,5,3,0.55) 100%)";

type Photo = { src: string; alt: string; delay: string; duration: string };

const photos: Photo[] = [
  {
    src: "/gallery/aerial-01.jpg",
    alt: "Aerial drone photo of a water park pool complex in Utah, captured by Apex Visuals LLC",
    delay: "0s",
    duration: "22s",
  },
  {
    src: "/gallery/aerial-02.jpg",
    alt: "Aerial drone photo of a lazy river and pool deck at a Utah water park",
    delay: "-6s",
    duration: "26s",
  },
  {
    src: "/gallery/aerial-03.jpg",
    alt: "Aerial drone photo of water slides at a Utah water park resort",
    delay: "-3s",
    duration: "19s",
  },
  {
    src: "/gallery/aerial-05.jpg",
    alt: "Drone photo overlooking layered red rock mountains in Southern Utah",
    delay: "-9s",
    duration: "24s",
  },
];

export default function PhotoWall() {
  return (
    <div className="grid grid-cols-4 auto-rows-[90px] gap-1.5 overflow-hidden rounded-2xl sm:auto-rows-[110px] md:auto-rows-[130px]">
      <div className="relative col-span-2 row-span-2 overflow-hidden">
        <Image
          src="/gallery/aerial-04.jpg"
          alt="Drone photo of a red rock canyon at sunset in Southern Utah, captured by Apex Visuals LLC"
          fill
          quality={90}
          sizes="(min-width: 640px) 45vw, 60vw"
          className={`object-cover ${FILM_GRADE}`}
          style={{
            animation: "kenburns 28s ease-in-out infinite alternate",
            transformOrigin: "center",
          }}
        />
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: VIGNETTE }} />
      </div>

      {photos.map((photo) => (
        <div key={photo.src} className="relative overflow-hidden">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            quality={90}
            sizes="(min-width: 640px) 22vw, 30vw"
            className={`object-cover ${FILM_GRADE}`}
            style={{
              animation: `kenburns ${photo.duration} ease-in-out infinite alternate`,
              animationDelay: photo.delay,
              transformOrigin: "center",
            }}
          />
          <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: VIGNETTE }} />
        </div>
      ))}
    </div>
  );
}
