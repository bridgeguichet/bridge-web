import { ServiceCardHexagon } from "./service-card-hexagon";
import { ServiceCardOctagon } from "./service-card-octagon";
import { ServiceCardTrapeze } from "./service-card-trapeze";
import type { ServiceWithDetails } from "../types";

interface ServiceCardWrapperProps {
  service: ServiceWithDetails;
  index: number;
  featured?: boolean;
}

export function ServiceCardWrapper({ service, index, featured = false }: ServiceCardWrapperProps) {
  const cardType = index % 3;

  if (cardType === 0) {
    return <ServiceCardOctagon service={service} featured={featured} />;
  }

  if (cardType === 1) {
    return <ServiceCardTrapeze service={service} featured={featured} />;
  }

  return <ServiceCardHexagon service={service} featured={featured} />;
}
