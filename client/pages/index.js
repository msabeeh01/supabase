import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'

//lib imports
import { supabase } from '@/lib/supabase'

//context import
import withAuth from '@/context/withAuth'
import NavBar from '@/components/Header'


function Home() {
  //const [data, setData] = useState(null)
  const [allImages, setAllImages] = useState([])
  const [userID, setUserID] = useState(null)

  useEffect(() => {
    getID().then(async (id) => {
      setUserID(id)
    })
    handleImageFetch()
  }, [userID])

  //function to upload image to supabase storage
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

  //function to fetch images from supabase storage
  const handleImageFetch = async () => {
    const res = await fetch('api/images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userID })
    })
    const data = await res.json()
    setAllImages(data)
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      <NavBar />

      <div className='flex flex-col'>
        <input type='file' onChange={(e) => handleUpload(e.target.files[0])} />

        <div className='flex w-screen h-full items-center justify-center bg-white p-5 flex-wrap'>
          {allImages && allImages.map((image, i) => {
            return (
              <div key={i} className='w-[25rem] h-[25rem] overflow-hidden flex'>
                <img src={image.signedUrl} className='h-full w-full object-cover' />
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
