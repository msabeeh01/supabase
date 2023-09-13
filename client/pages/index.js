import Image from 'next/image'
import { Inter } from 'next/font/google'

//lib imports
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const handleFetch = async () => {
      const { data, error } = await supabase
        .from('test')
        .select()
        .eq('id', 1)
      console.log(data)
      setData(data)
    }

    handleFetch()
  }, [])



  return (
    <div>
      <h1>HELLO</h1>
      {data && <h1>{data[0].name}</h1>}
    </div>
  )
}
