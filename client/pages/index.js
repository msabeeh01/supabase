import Image from 'next/image'
import { Inter } from 'next/font/google'

//lib imports
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [data, setData] = useState(null)
  const [allImages, setAllImages] = useState([])

  useEffect(() => {
    handleImageFetch()
  }, [])


  const handleUpload = async (file) => {
    const { data, error } = await supabase.storage.from('images').upload('file_path', file)
    if (error) {
      console.log(error)
    } else {
      console.log(data)
      window.location.reload()
    }
  }
  const handleImageFetch = async () => {
    const { data, error } = await supabase
      .storage
      .from('images')
      .list('people', {
        limit: 100,
        offset: 0
      })
    if (error) {
      console.log(error)
    } else {
      const signedUrlPromises = data.map(async (image) => {
        const { data, error } = await supabase
          .storage
          .from('images/people')
          .createSignedUrl(image.name, 60)
        if (error) {
          console.log(error)
          return null
        }
        return data.signedUrl
      })

      const signedUrls = await Promise.all(signedUrlPromises)
      setAllImages(signedUrls.filter(url => url !== null))

    }

  }
  const handleFetch = async () => {
    const { data, error } = await supabase
      .from('test')
      .select()
      .eq('id', 1)
    console.log(data)
    setData(data)
  }




  return (
    <div>
      <h1>HELLO</h1>
      {data && <h1>{data[0].name}</h1>}

      <div style={{ display: "flex", backgroundColor: "blue", flexDirection: "column" }}>
        <input type='file' onChange={(e) => handleUpload(e.target.files[0])} />

        {allImages && allImages.map((image, i) => {
          return (
            <div key={i}>
              <img src={image} width={100} height={100} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
