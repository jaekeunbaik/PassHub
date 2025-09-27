import { createClient } from '@supabase/supabase-js'

function readEnvFromProcess(keyCandidates) {
  let value = ''
  try {
    if (typeof process !== 'undefined' && process.env) {
      for (const k of keyCandidates) {
        if (k in process.env && process.env[k]) {
          value = process.env[k]
          break
        }
      }
    }
  } catch (_) {
    // ignore
  }
  return value
}

// Vue CLI에서는 VUE_APP_* 접두어를 사용해야 브라우저 번들에 노출됩니다.
// (예: VUE_APP_SUPABASE_URL, VUE_APP_SUPABASE_ANON_KEY)
let supabaseUrl = readEnvFromProcess(['VUE_APP_SUPABASE_URL'])
let supabaseAnonKey = readEnvFromProcess(['VUE_APP_SUPABASE_ANON_KEY'])

// 로컬 개발 편의를 위해, 환경변수가 비어있다면 임시 기본값을 사용합니다.
// 배포 전에 반드시 환경변수로 대체하세요.
if (!supabaseUrl) {
  supabaseUrl = 'https://qzcultlvhlgqfbxjnylo.supabase.co'
}
if (!supabaseAnonKey) {
  supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6Y3VsdGx2aGxncWZieGpueWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwOTEwMDYsImV4cCI6MjA3MDY2NzAwNn0.YwDelPUXWjxySF5x0HPSocsYG956g9JFMcoy4m_PQlc'
}

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn('[Supabase] 환경변수 미설정: .env.local에 VUE_APP_SUPABASE_URL, VUE_APP_SUPABASE_ANON_KEY를 설정하세요.')
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')

export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return { ok: true, session: data?.session ?? null }
  } catch (err) {
    return { ok: false, error: err }
  }
}


