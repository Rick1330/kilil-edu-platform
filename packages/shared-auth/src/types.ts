export type Principal = {
  sub: string;
  email?: string;
  preferredUsername?: string;
  roles: string[];
  tenantId?: string;
  campusId?: string;
};