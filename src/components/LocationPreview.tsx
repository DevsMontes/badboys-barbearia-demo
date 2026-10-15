import { useEffect, useState } from "react";
import { ArrowUpRight, MapPin, Navigation } from "lucide-react";
import { business } from "../data/business";
export default function LocationPreview() {
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!loaded || ready) return;
    const timer = window.setTimeout(() => {
      setFailed(true);
      setLoaded(false);
    }, 12000);
    return () => window.clearTimeout(timer);
  }, [loaded, ready]);
  const embed = `https://maps.google.com/maps?hl=pt-BR&q=${encodeURIComponent(business.address)}&output=embed`;
  return (
    <div className="location-preview">
      <div className="location-preview-heading">
        <span>ENCONTRE A BAD BOYS</span>
        <span>P. SUL / BRASÍLIA</span>
      </div>
      <div className="map-surface">
        {loaded ? (
          <a
            className="embedded-map-link"
            data-ready={ready}
            href={business.mapsUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Abrir localização no Google Maps"
          >
            <iframe
              src={embed}
              title="Prévia do Google Maps baseada no endereço divulgado"
              width="800"
              height="360"
              loading="eager"
              onLoad={() => setReady(true)}
              onError={() => {
                setFailed(true);
                setLoaded(false);
              }}
              tabIndex={-1}
              aria-hidden="true"
              referrerPolicy="strict-origin-when-cross-origin"
            />
            {!ready && (
              <div className="map-loading" role="status">
                <MapPin size={30} />
                <p>Carregando a prévia do Google Maps…</p>
              </div>
            )}
            <span>
              ABRIR LOCALIZAÇÃO FORNECIDA <ArrowUpRight size={17} />
            </span>
          </a>
        ) : (
          <div className="map-placeholder">
            <MapPin size={36} strokeWidth={1} />
            <p>
              O próximo corte
              <br />
              <strong>tem endereço.</strong>
            </p>
            {failed && (
              <p className="map-unavailable">
                A prévia não respondeu. Você pode abrir a localização pelo link
                abaixo.
              </p>
            )}
            <button
              onClick={() => {
                setReady(false);
                setFailed(false);
                setLoaded(true);
              }}
            >
              CARREGAR PRÉVIA DO MAPA <ArrowUpRight size={17} />
            </button>
            <small>
              A prévia carrega conteúdo do Google somente ao clicar.
            </small>
          </div>
        )}
      </div>
      <p className="map-note">
        Prévia por pesquisa do endereço divulgado. O link de navegação fornecido
        é a referência para chegar à barbearia; não foi atribuído um marcador
        próprio.
      </p>
      <div className="map-actions">
        <a href={business.mapsUrl} target="_blank" rel="noreferrer">
          VER NO GOOGLE MAPS <ArrowUpRight size={17} />
        </a>
        <a href={business.mapsUrl} target="_blank" rel="noreferrer">
          COMO CHEGAR <Navigation size={16} />
        </a>
      </div>
    </div>
  );
}
