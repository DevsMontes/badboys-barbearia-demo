import { asset } from "../data/business";
export default function Brand({
  className = "",
  lazy = false,
}: {
  className?: string;
  lazy?: boolean;
}) {
  return (
    <img
      className={`brand ${className}`}
      src={asset("brand/logo.webp")}
      width="648"
      height="656"
      loading={lazy ? "lazy" : "eager"}
      alt="Bad Boys Barbearia — logomarca oficial vermelha"
    />
  );
}
