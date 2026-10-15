import { ArrowDown } from "lucide-react";
import BrandReveal from "../components/BrandReveal";
import { useIntroProgress } from "../hooks/useIntroProgress";
export default function IntroExperience({
  onReveal,
}: {
  onReveal: (visible: boolean) => void;
}) {
  const { scene, reduced } = useIntroProgress(onReveal);
  return (
    <section
      id="inicio"
      tabIndex={-1}
      className={`intro-experience ${reduced ? "reduced-intro" : ""}`}
      ref={scene}
      aria-label="Apresentação da Bad Boys"
    >
      <div className="intro-stage">
        <div className="intro-topline">
          <span>BAD BOYS BARBEARIA</span>
          <span>P. SUL · IDENTIDADE LOCAL</span>
        </div>
        <h1 className="sr-only">
          Bad Boys Barbearia. Não é só um corte. É identidade.
        </h1>
        <div className="intro-frame">
          <span className="intro-fragment fragment-left" aria-hidden="true">
            ATITUDE
          </span>
          <BrandReveal />
          <span className="intro-fragment fragment-right" aria-hidden="true">
            PRESENÇA
          </span>
          <span className="construction-caption" aria-hidden="true">
            CADA TRAÇO. UMA IDENTIDADE.
          </span>
        </div>
        <div className="intro-statement" aria-hidden="true">
          <span>NÃO É SÓ UM CORTE.</span>
          <strong>É IDENTIDADE.</strong>
        </div>
        <div className="intro-footer">
          <nav className="intro-shortcuts" aria-label="Acesso rápido">
            <a href="#servicos">SERVIÇOS</a>
            <a href="#agendamento">AGENDAMENTO</a>
          </nav>
          <a href="#sobre" className="intro-explore">
            {reduced ? "CONHEÇA A BAD BOYS" : "ROLE PARA REVELAR"}
            <ArrowDown size={16} />
          </a>
          <span className="intro-progress" aria-hidden="true">
            <i />
          </span>
        </div>
      </div>
    </section>
  );
}
