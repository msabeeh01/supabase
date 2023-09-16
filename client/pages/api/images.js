import { redis } from "@/lib/redis";
import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
    if (req.method == 'POST') {
        //req.body
        const userID = req.body.userID

        //redis.keys('*').then((keys) => { res.status(200).json(keys) });

        const { data, error } = await supabase
            .storage
            .from('images')
            .list(`${userID}`, {
                limit: 100,
                offset: 0
            })
        if (error) {
            console.log(error)
        } else {
            const signedUrlPromises = data.map(async (image) => {
                const { data, error } = await supabase
                    .storage
                    .from(`images`)
                    .createSignedUrl(`${userID}/${image.name}`, 60)
                if (error) {
                    console.log(error)
                } else {
                    return data
                }
            })

            Promise.all(signedUrlPromises).then((values) => {
                res.status(200).json(values)
            })
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' })
    }
}