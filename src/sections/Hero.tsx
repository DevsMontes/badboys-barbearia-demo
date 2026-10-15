import { ArrowDown, ArrowUpRight } from "lucide-react";
import Brand from "../components/Brand";
export default function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-content">
        <p className="eyebrow">
          <span /> BAD BOYS BARBEARIA · P. SUL
        </p>
        <h1>
          SEU ESTILO.
          <br />
          <span>SUAS REGRAS.</span>
        </h1>
        <div className="hero-bottom">
          <p>
            Cortes, barba e atitude.
            <br />
            Seu próximo visual começa aqui.
          </p>
          <a className="button primary" href="#agendamento">
            AGENDAR MEU CORTE{" "}
            <span>
              <ArrowUpRight />
            </span>
          </a>
          <a className="text-link" href="#servicos">
            CONHECER OS SERVIÇOS <ArrowDown size={16} />
          </a>
        </div>
      </div>
      <div className="hero-art">
        <div className="art-cross cross-top" aria-hidden="true">
          +
        </div>
        <Brand className="hero-brand" />
        <p className="art-caption">
          IDENTIDADE NÃO SE COPIA.
          <br />
          <b>SE ASSUME.</b>
        </p>
        <span className="art-coordinate" aria-hidden="true">
          BB / ESTILO & ATITUDE
        </span>
        <div className="art-cross cross-bottom" aria-hidden="true">
          +
        </div>
      </div>
      <div className="hero-foot">
        <span>O VISUAL É SEU. A ATITUDE TAMBÉM.</span>
        <a href="#sobre">
          EXPLORE A BAD BOYS <ArrowDown size={14} />
        </a>
        <span className="hero-location">P. SUL</span>
      </div>
    </section>
  );
}
