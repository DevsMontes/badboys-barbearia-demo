import { useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  MapPin,
  Instagram,
  Clock,
} from "lucide-react";
import Header from "./components/Header";
import Brand from "./components/Brand";
import FutureContent from "./components/FutureContent";
import IntroExperience from "./sections/IntroExperience";
import ExperienceTransition from "./components/ExperienceTransition";
import BookingSection from "./sections/Booking";
import FacadeImage from "./components/FacadeImage";
import LocationPreview from "./components/LocationPreview";
import WhatsAppContact from "./components/WhatsAppContact";
import { business, money, navigation, services } from "./data/business";
export default function App() {
  const [selected, setSelected] = useState("");
  const [revealed, setRevealed] = useState(false);
  function choose(id: string) {
    setSelected(id);
    document.getElementById("agendamento")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  return (
    <>
      <a className="skip-link" href="#sobre">
        Pular para o conteúdo
      </a>
      <Header visible={revealed} />
      <main id="conteudo">
        <IntroExperience onReveal={setRevealed} />
        <ExperienceTransition />
        <section className="section shell about" id="sobre" tabIndex={-1}>
          <div>
            <p className="eyebrow">01 / A NOSSA IDENTIDADE</p>
            <h2>
              MAIS QUE
              <br />
              UM CORTE.
              <br />
              <span>UMA ATITUDE.</span>
            </h2>
            <p className="body-copy">
              Na Bad Boys, cada detalhe do visual faz parte da sua identidade.
              Conheça nossos serviços e escolha seu próximo estilo.
            </p>
            <a className="text-link" href="#experiencia">
              ENTRE NO UNIVERSO BAD BOYS <ArrowUpRight size={18} />
            </a>
          </div>
          <figure className="facade">
            <FacadeImage />
            <figcaption>
              <span>
                <MapPin size={16} /> P. SUL
              </span>
              <span>NOSSO ESPAÇO. NOSSA IDENTIDADE.</span>
            </figcaption>
            <div className="photo-mark" aria-hidden="true">
              BAD
              <br />
              BOYS.
            </div>
          </figure>
        </section>
        <section id="servicos" tabIndex={-1} className="services section">
          <div className="shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">02 / ESCOLHA O SEU PRÓXIMO VISUAL</p>
                <h2>
                  NA RÉGUA.
                  <br />
                  <span>NO SEU ESTILO.</span>
                </h2>
              </div>
              <p>
                Do corte ao detalhe.
                <br />
                Escolha seu serviço e prepare
                <br />
                sua solicitação de agendamento.
              </p>
            </div>
            <div className="service-list">
              {services.map((service, i) => (
                <button
                  className={`service-row ${selected === service.id ? "chosen" : ""}`}
                  key={service.id}
                  onClick={() => choose(service.id)}
                  aria-label={`Selecionar ${service.name}, ${money(service.price)}`}
                >
                  <span className="service-number">0{i + 1}</span>
                  <span className="service-name">
                    {service.name}
                    <small>{service.tag}</small>
                  </span>
                  <span className="service-price">{money(service.price)}</span>
                  <span className="service-arrow">
                    <ArrowUpRight />
                  </span>
                </button>
              ))}
            </div>
            <p className="section-note">
              Valores divulgados nos materiais fornecidos. Confirme com a
              barbearia antes do atendimento.
            </p>
          </div>
        </section>
        <section id="experiencia" tabIndex={-1} className="experience section">
          <div className="shell">
            <p className="eyebrow">03 / EXPERIÊNCIA BAD BOYS</p>
            <div className="experience-head">
              <h2>
                ATITUDE NO OLHAR.
                <br />
                <span>IDENTIDADE NO CORTE.</span>
              </h2>
              <p>
                Preto, vermelho e personalidade.
                <br />
                Uma identidade que começa na fachada
                <br />e acompanha o seu próximo visual.
              </p>
            </div>
            <div className="identity-panel">
              <Brand lazy />
              <div>
                <span className="eyebrow">BAD BOYS / BARBEARIA</span>
                <p>
                  O SEU VISUAL
                  <br />
                  DIZ <em>MUITO.</em>
                  <br />
                  FAÇA VALER.
                </p>
                <a
                  className="text-link"
                  href={business.instagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  ACOMPANHE NO INSTAGRAM <ArrowUpRight size={18} />
                </a>
              </div>
              <span className="panel-label">ESTILO É IDENTIDADE.</span>
            </div>
          </div>
        </section>
        <FutureContent />
        <BookingSection selected={selected} onSelect={setSelected} />
        <section id="contato" tabIndex={-1} className="section shell contact">
          <div>
            <p className="eyebrow">05 / ENCONTRE A BAD BOYS</p>
            <h2>
              ENCONTRE
              <br />A <span>BAD BOYS.</span>
            </h2>
            <p className="address">
              <MapPin />
              {business.address}
            </p>
            <a
              className="button secondary"
              href={business.mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              VER NO GOOGLE MAPS{" "}
              <span>
                <ArrowUpRight />
              </span>
            </a>
          </div>
          <div className="contact-info">
            <div className="info-title">
              <Clock size={18} />
              <h3>HORÁRIO DE FUNCIONAMENTO</h3>
            </div>
            <dl>
              <div>
                <dt>Segunda a sábado</dt>
                <dd>
                  {business.hours.open} — {business.hours.weekdayClose}
                </dd>
              </div>
              <div>
                <dt>Domingo</dt>
                <dd>
                  {business.hours.open} — {business.hours.sundayClose}
                </dd>
              </div>
            </dl>
            <a
              className="social-link"
              href={business.instagram}
              target="_blank"
              rel="noreferrer"
            >
              <Instagram />
              <span>
                ACOMPANHE A BAD BOYS<small>{business.instagramHandle}</small>
              </span>
              <ArrowUpRight />
            </a>
            <p className="section-note">
              Prefere falar sobre um atendimento? Prepare sua solicitação no
              agendamento.
            </p>
          </div>
          <LocationPreview />
        </section>
      </main>
      <footer>
        <div className="shell footer-top">
          <a href="#inicio" aria-label="Voltar ao início">
            <Brand lazy />
          </a>
          <div>
            <p className="eyebrow">SEU ESTILO. SUAS REGRAS.</p>
            <p>{business.address}</p>
            <p>
              Seg–sáb · {business.hours.open}–{business.hours.weekdayClose} /
              Dom · {business.hours.open}–{business.hours.sundayClose}
            </p>
            <a href={business.instagram} target="_blank" rel="noreferrer">
              Instagram <ArrowUpRight size={14} />
            </a>
          </div>
          <a className="text-link" href="#agendamento">
            BORA MUDAR O VISUAL? <ArrowRight size={18} />
          </a>
        </div>
        <nav className="shell footer-nav" aria-label="Navegação do rodapé">
          {navigation.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
          <a href="#/admin">Painel demonstrativo</a>
        </nav>
        <div className="shell footer-bottom">
          <span>BAD BOYS BARBEARIA · {new Date().getFullYear()}</span>
          <span>
            Desenvolvido por <b>Montes Dev</b> · Demonstração conceitual
          </span>
          <span>Dados do formulário apenas nesta sessão.</span>
        </div>
      </footer>
      <WhatsAppContact enabled={revealed} />
    </>
  );
}
