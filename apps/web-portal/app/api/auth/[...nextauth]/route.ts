import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

const handler = NextAuth({
  providers: [
    KeycloakProvider({
      issuer: process.env.KEYCLOAK_ISSUER_URL || "http://localhost:8080/realms/et-univ",
      clientId: process.env.KEYCLOAK_WEB_CLIENT_ID || "web-portal",
      clientSecret: process.env.KEYCLOAK_WEB_CLIENT_SECRET || "CHANGE_ME_IN_REAL_KEYCLOAK"
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Attach access_token when refreshing
      if (account?.access_token) (token as any).access_token = account.access_token;
      // Type assertion to access Keycloak-specific properties
      const keycloakProfile = profile as { preferred_username?: string } | undefined;
      if (keycloakProfile?.preferred_username) token.name = keycloakProfile.preferred_username;
      return token;
    },
    async session({ session, token }) {
      (session as any).access_token = (token as any).access_token;
      return session;
    }
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "devsecret"
});

export { handler as GET, handler as POST };