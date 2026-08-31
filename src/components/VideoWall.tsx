const FILM_GRADE = "[filter:sepia(0.2)_contrast(1.05)_saturate(1.05)]";

type Clip = { src: string; label: string };

const clips: Clip[] = [
  { src: "/videos/jellystone-social-01.mp4", label: "Water slide" },
  { src: "/videos/jellystone-social-02.mp4", label: "Racing slides" },
  { src: "/videos/jellystone-social-04.mp4", label: "Toilet bowl slide" },
  { src: "/videos/jellystone-social-05.mp4", label: "Lazy river" },
  { src: "/videos/jellystone-social-06.mp4", label: "Racing slides" },
  { src: "/videos/jellystone-social-07.mp4", label: "Lazy river tubes" },
  { src: "/videos/jellystone-social-08.mp4", label: "Toilet bowl slide" },
  { src: "/videos/jellystone-social-09.mp4", label: "Splash boat" },
];

export default function VideoWall() {
  return (
    <div>
      <div className="grid grid-cols-4 auto-rows-[90px] gap-1.5 overflow-hidden rounded-2xl sm:auto-rows-[110px] md:auto-rows-[130px]">
        <div className="relative col-span-2 row-span-2 overflow-hidden">
          <video
            src="/videos/jellystone-social-featured.mp4"
            autoPlay
            muted
            loop
            playsInline
            className={`h-full w-full object-cover ${FILM_GRADE}`}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at center, transparent 45%, rgba(8,5,3,0.55) 100%)",
            }}
          />
        </div>

        {clips.map((clip) => (
          <div key={clip.src} className="relative overflow-hidden">
            <video
              src={clip.src}
              autoPlay
              muted
              loop
              playsInline
              className={`h-full w-full object-cover ${FILM_GRADE}`}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse at center, transparent 45%, rgba(8,5,3,0.55) 100%)",
              }}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-baseline gap-3 border-t border-border pt-6">
        <span className="font-serif text-3xl font-bold">250+</span>
        <span className="text-xs uppercase tracking-[0.15em] text-fg-faint">
          Short-form videos created for Jellystone Zion
        </span>
      </div>
    </div>
  );
}
