import Service from '@ember/service';

export type Address = {
  streetAndNumber: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  email: string;
};

export type ResponsibleEntity = {
  fullName: string;
  entityNumber?: string;
  address: Address;
};

export type InternalDpo = {
  fullName: string;
  address: Address;
};

export type ExternalOrganizationDpo = {
  fullName: string;
  entityNumber?: string;
  address: Address;
};

export type CompanyType = {
  hasExternalDPO: boolean;
  hasDPO: boolean;
  responsible: ResponsibleEntity;
  DPO?: InternalDpo;
  externalOrganizationDPO?: ExternalOrganizationDpo;
};

export default class CompanyService extends Service {
  async load(): Promise<CompanyType> {
    const res = await fetch('/api/v1/company');
    const json = (await res.json()) as { data: { attributes: CompanyType } };
    return json.data.attributes;
  }

  async save(company: CompanyType): Promise<CompanyType> {
    const res = await fetch('/api/v1/company', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { type: 'company', attributes: company } }),
    });
    const json = (await res.json()) as { data: { attributes: CompanyType } };
    return json.data.attributes;
  }
}
