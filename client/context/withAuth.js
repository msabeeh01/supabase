import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

//HOC auth component
export default function withAuth(WrappedComponent){
    return function(props){
        const [loading, setLoading] = useState(true)
        const router = useRouter()

        useEffect(() => {
            supabase.auth.onAuthStateChange(async (event, session) => {
                const user = session?.user

                if(!user){
                    router.push('/login')
                }else{
                    setLoading(false)
                }
            })

        }, [])

        if(loading){
            return <div>
                LOADINGGG
            </div>
        }


        return(
            <WrappedComponent {...props} />
        )
    }
}