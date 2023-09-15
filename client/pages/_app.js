import '@/styles/globals.css'
import { supabase } from '@/lib/supabase'
export default function App({ Component, pageProps }) {
  return(
      <Component {...pageProps} />
  )
}
