import Image from 'next/image'
import { Inter } from 'next/font/google'

//lib imports
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [data, setData] = useState(null)
  const [imageSrc, setImageSrc] = useState(null)
  const [images, setImages] = useState([])

  useEffect(() => {
    const handleFetch = async () => {
      const { data, error } = await supabase
        .from('test')
        .select()
        .eq('id', 1)
      console.log(data)
      setData(data)
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
        setImages(data)
      }

    }

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

  const createImage = async (name) => {
    const { data, error } = await supabase.storage
      .from('images/people')
      .createSignedUrl(name, 60)
    if (error) {
      console.log(error)
    } else {
      console.log(data.signedUrl)
      return data.signedURL
    }

  }



  return (
    <div>
      <h1>HELLO</h1>
      {data && <h1>{data[0].name}</h1>}

      <div style={{ display: "flex", backgroundColor: "blue", flexDirection: "column" }}>
        <input type='file' onChange={(e) => handleUpload(e.target.files[0])} />

        <button onClick={() => console.log(images)}>Click</button>

        {images && images.map((image) => {
          const src = createImage(image.name)
          return (
            <div key={image.name}>
              <img src={src} alt='image' />
            </div>
          )
        })}
      </div>
    </div>
  )
}
