import { useState } from "react";
import { asset } from "../data/business";
export default function FacadeImage() {
  const [fallback, setFallback] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <>
      {failed ? (
        <div className="facade-error" role="status">
          <p>A imagem do nosso espaço não carregou.</p>
          <button
            onClick={() => {
              setFallback(false);
              setFailed(false);
            }}
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <picture>
          {!fallback && (
            <source
              srcSet={asset("editorial/fachada.webp")}
              type="image/webp"
            />
          )}
          <img
            src={asset("editorial/fachada.jpg")}
            width="361"
            height="485"
            alt="Fachada real da Bad Boys Barbearia, letreiro preto e vermelho e entrada com grade branca"
            loading="eager"
            decoding="async"
            onError={() => {
              if (!fallback) setFallback(true);
              else setFailed(true);
            }}
          />
        </picture>
      )}
    </>
  );
}
