import { createBrowserClient } from '@supabase/ssr'

const hasSupabaseEnv = () => {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  return !!(url && key && url.startsWith('http') && !url.includes('your_supabase_url'))
}

// Fallback stub client when Supabase env vars are not set
const createStubClient = () => {
  return {
    auth: {
      getSession: async () => {
        const storedUser = localStorage.getItem('devforge_user')
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser)
            return {
              data: {
                session: {
                  user,
                  access_token: 'mock-token',
                  refresh_token: 'mock-refresh',
                  expires_in: 3600,
                  token_type: 'bearer',
                } as any,
              },
              error: null,
            }
          } catch {
            // ignore
          }
        }
        return { data: { session: null }, error: null }
      },
      onAuthStateChange: (callback: any) => {
        // Simple listener for local auth changes
        const handleStorage = (e: StorageEvent) => {
          if (e.key === 'devforge_user') {
            const session = e.newValue ? { user: JSON.parse(e.newValue) } : null
            callback('SIGNED_IN', session)
          }
        }
        window.addEventListener('storage', handleStorage)
        return {
          data: {
            subscription: {
              unsubscribe: () => window.removeEventListener('storage', handleStorage),
            },
          },
        }
      },
      signOut: async () => {
        localStorage.removeItem('devforge_user')
        localStorage.removeItem('dev_auth_bypass')
        return { error: null }
      },
      signInWithPassword: async ({ email }: { email: string }) => {
        const user = {
          id: 'user-devforge-lead',
          email,
          user_metadata: { name: email.split('@')[0] || 'Developer' },
        }
        localStorage.setItem('devforge_user', JSON.stringify(user))
        localStorage.setItem('dev_auth_bypass', 'true')
        return { data: { user, session: { user } }, error: null }
      },
      signUp: async ({ email }: { email: string }) => {
        const user = {
          id: 'user-devforge-lead',
          email,
          user_metadata: { name: email.split('@')[0] || 'Developer' },
        }
        localStorage.setItem('devforge_user', JSON.stringify(user))
        localStorage.setItem('dev_auth_bypass', 'true')
        return { data: { user, session: { user } }, error: null }
      },
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          order: () => Promise.resolve({ data: [], error: null }),
        }),
        order: () => Promise.resolve({ data: [], error: null }),
      }),
      insert: async () => ({ data: null, error: null }),
      update: () => ({
        eq: async () => ({ data: null, error: null }),
      }),
      delete: () => ({
        eq: async () => ({ data: null, error: null }),
      }),
    }),
  } as any
}

export const createClient = () => {
  if (hasSupabaseEnv()) {
    try {
      return createBrowserClient(
        import.meta.env.VITE_SUPABASE_URL!,
        import.meta.env.VITE_SUPABASE_ANON_KEY!,
        {
          cookieOptions: {
            maxAge: 60 * 60 * 3,
            path: '/',
            sameSite: 'lax',
            secure: import.meta.env.PROD,
          },
        }
      )
    } catch (e) {
      console.warn('Failed to initialize Supabase client, falling back to local store:', e)
      return createStubClient()
    }
  }

  return createStubClient()
}
