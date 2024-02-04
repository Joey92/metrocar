export interface Jwt {
  iat: number;
  exp: number;
  iss: string;
}

export interface JwtPasswordReset extends Jwt {
  email: string;
  scope: string;
  hash: string;
}

export interface JwtAuth extends Jwt {
  id: string;
  role: string;
  app_access: boolean;
  admin_access: boolean;
}

export function parseJwt<JWT extends Jwt>(token: string): JWT | null {
  if (!token) {
    return null;
  }

  const base64Url = token.split(".")[1];

  if (!base64Url) {
    return null;
  }

  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
