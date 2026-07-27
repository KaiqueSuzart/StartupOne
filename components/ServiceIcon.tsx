import type { ServiceType } from "@/domain/types";

/** Ícone por tipo de serviço: torna a linha do tempo escaneável de relance. */
const PATHS: Record<ServiceType, string> = {
  initial_registration:
    "M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3Z",
  scheduled_maintenance:
    "M21 11h-2.1a7 7 0 0 0-1-2.4l1.5-1.5-1.5-1.5-1.5 1.5a7 7 0 0 0-2.4-1V4h-2v2.1a7 7 0 0 0-2.4 1L8.1 5.6 6.6 7.1 8.1 8.6a7 7 0 0 0-1 2.4H5v2h2.1a7 7 0 0 0 1 2.4l-1.5 1.5 1.5 1.5 1.5-1.5a7 7 0 0 0 2.4 1V20h2v-2.1a7 7 0 0 0 2.4-1l1.5 1.5 1.5-1.5-1.5-1.5a7 7 0 0 0 1-2.4H21v-2Zm-9 4a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z",
  oil_change:
    "M12 2S5 10 5 14a7 7 0 0 0 14 0c0-4-7-12-7-12Zm0 17a5 5 0 0 1-5-5h2a3 3 0 0 0 3 3v2Z",
  brakes:
    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
  tires:
    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 3.5 1.8 3.7-1.8 1.3-1.8-1.3L12 5.5ZM6.6 9.9l4 .4.5 2.2-2 1-2.5-3.6Zm10.8 0-2.5 3.6-2-1 .5-2.2 4-.4ZM8.9 18l1.3-3.8h3.6L15.1 18a6.5 6.5 0 0 1-6.2 0Z",
  suspension:
    "M6 3v2h12V3H6Zm0 4 3 2-3 2 3 2-3 2 3 2-3 2v2h12v-2l-3-2 3-2-3-2 3-2-3-2 3-2V7H6Z",
  electrical: "M11 21v-7H7l6-11v7h4l-6 11Z",
  other:
    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2v2Zm1.6-6.5-.9.9c-.5.5-.7.9-.7 1.6h-2v-.5c0-.7.3-1.4.9-1.9l1.2-1.2c.3-.3.5-.8.4-1.3-.1-.6-.6-1-1.2-1.1a1.5 1.5 0 0 0-1.8 1.5H8.5A3.5 3.5 0 0 1 12 5a3.5 3.5 0 0 1 2.6 5.5Z",
};

interface ServiceIconProps {
  type: ServiceType;
  className?: string;
}

export function ServiceIcon({ type, className }: ServiceIconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <path d={PATHS[type]} />
    </svg>
  );
}
