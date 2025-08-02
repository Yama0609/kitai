import { NextAuthOptions } from "next-auth"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import { createClient } from "@supabase/supabase-js"
import CredentialsProvider from "next-auth/providers/credentials"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    db: {
      schema: "next_auth",
    },
  }
)

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Supabase認証
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        })

        if (error || !data.user) {
          return null
        }

        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email,
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
}
