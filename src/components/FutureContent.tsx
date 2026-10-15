import { gallery, team } from "../data/business";
export default function FutureContent() {
  return (
    <>
      {gallery.length > 0 && (
        <section className="section shell" aria-label="Trabalhos da Bad Boys">
          <h2>NA PRÁTICA.</h2>
          <div className="gallery">
            {gallery.map((image) => (
              <img
                key={image.src}
                src={image.src}
                alt={image.alt}
                loading="lazy"
              />
            ))}
          </div>
        </section>
      )}
      {team.length > 0 && (
        <section className="section shell" aria-label="Equipe">
          <h2>QUEM FAZ ACONTECER.</h2>
          {team.map((person) => (
            <p key={person.id}>{person.name}</p>
          ))}
        </section>
      )}
    </>
  );
}
