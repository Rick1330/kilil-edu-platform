import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

const issuer = process.env.KEYCLOAK_ISSUER_URL || 'http://localhost:8080/realms/et-univ';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const opts: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer,
      algorithms: ['RS256'],
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri: `${issuer}/protocol/openid-connect/certs`,
      }) as any
    };
    super(opts);
  }

  async validate(payload: any) {
    return payload; // attach JWT payload to req.user
  }
}