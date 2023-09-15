import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import Link from "next/link"
const NavBar = () => {
    const [user, setUser] = useState(null)

    //get the current user from supabase
    useEffect(() => {
        getUser()
    })

    const getUser = async () => {
        await supabase.auth.onAuthStateChange((event, session) => {
            if (session){
                setUser(session?.user)
            }

        })
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
    }

    if (user) {
        return (
            <nav className="flex items-center w-screen justify-between flex-wrap bg-teal-500 p-6">
                <div className="flex items-center flex-shrink-0 text-white mr-6">
                    <span className="font-semibold text-xl tracking-tight">Supabase Photo App</span>
                </div>
                <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                    <div className="text-sm lg:flex-grow">
                        <Link href="/" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                            Home
                        </Link>
                        <Link href="https://github.com/msabeeh01" target="_blank" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                            GitHub
                        </Link>
                    </div>
                    <div>
                        <button onClick={handleLogout} className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">Logout</button>
                    </div>
                </div>
            </nav>
        )
    }
    return null
}

export default NavBar