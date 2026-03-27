export interface Service {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  subcategory?: string;
  price?: string;
  relevantFor: string[];
}

export interface ServicePack {
  id: string;
  name: string;
  price: string;
  category: string;
  description: string;
  services: string[];
  valueProposition: string;
  relevantFor: string[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  services: Service[];
}
