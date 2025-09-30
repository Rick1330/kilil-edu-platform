// Map Keycloak access token claims to Principal
export function principalFromJwt(jwtPayload: any): import("./types").Principal {
  const roles = [
    ...(jwtPayload?.realm_access?.roles ?? []),
    ...(jwtPayload?.resource_access?.["web-portal"]?.roles ?? [])
  ];
  return {
    sub: jwtPayload?.sub,
    email: jwtPayload?.email,
    preferredUsername: jwtPayload?.preferred_username,
    roles,
    tenantId: jwtPayload?.tenant_id,   // optional, future use
    campusId: jwtPayload?.campus_id
  };
}