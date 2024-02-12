import type { NextAuthConfig } from 'next-auth';
import { getRoleUserById } from './app/lib/services';
import { UserSession } from './app/lib/types';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
    async session({ session, token }) {
      const { sub: id = '' } = token;
      const isAdmin = await getRoleUserById(id);
      return { ...session, id, isAdmin } as UserSession;
    },
  },

  providers: [],
} satisfies NextAuthConfig;
