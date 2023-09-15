import Image from 'next/image'
import { Inter } from 'next/font/google'

//lib imports
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'


//context import
import withAuth from '@/context/withAuth'

const inter = Inter({ subsets: ['latin'] })

function Home() {
  //const [data, setData] = useState(null)
  const [allImages, setAllImages] = useState([])
  const [userID, setUserID] = useState(null)



  useEffect(() => {
    getID().then((id) => {
      console.log('MY ID', id)
      if (id) handleImageFetch(id)
      setUserID(id)
    })
  }, [])


  const handleUpload = async (file) => {
    const { data, error } = await supabase.storage.from(`images`).upload(`${userID}/${file.name}`, file)
    if (error) {
      console.log(error)
    } else {
      console.log(data)
      window.location.reload()
    }
  }

  const getID = async () => {
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      console.log('Error: ', error)
    } else {

      return data.user.id
    }
  }

  const handleImageFetch = async (userID) => {
    const { data, error } = await supabase
      .storage
      .from('images')
      .list(`${userID}`, {
        limit: 100,
        offset: 0
      })
    if (error) {
      console.log(error)
    }
    else {
      const signedUrlPromises = data.map(async (image) => {
        const { data, error } = await supabase
          .storage
          .from(`images`)
          .createSignedUrl(`${userID}/${image.name}`, 60)
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

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='flex flex-col'>
        <input type='file' onChange={(e) => handleUpload(e.target.files[0])} />

        <div className='flex w-screen h-full items-center justify-center bg-white p-5 flex-wrap'>
          {allImages && allImages.map((image, i) => {
            return (
              <div key={i} className='w-[25rem] h-[25rem] overflow-hidden flex'>
                <img src={image} className='h-full w-full object-cover' />
              </div>
            )
          })}

        </div>
      </div>

      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4' onClick={() => supabase.auth.signOut()}>Sign Out</button>
    </div>
  )
}

export default withAuth(Home)
