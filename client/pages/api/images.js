import { redis } from "@/lib/redis";
import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
    if (req.method == 'POST') {
        //req.body
        const userID = req.body.userID

        //generate a cache key baesd on the userID
        const cacheKey = `images:${userID}`

        //get images from cache
        const cachedImages = await redis.get(cacheKey)

        if (cachedImages) {
            const images = JSON.parse(cachedImages)
            return res.status(200).json(images)
        } else {
            const { data, error } = await supabase
                .storage
                .from('images')
                .list(`${userID}`, {
                    limit: 100,
                    offset: 0
                })
            if (error) {
                console.log(error)
                return res.status(500).json({ error: 'Failed to fetch images' })
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

                const images = await Promise.all(signedUrlPromises)

                await redis.set(cacheKey, JSON.stringify(images), 'EX', 59)

                return res.status(200).json(images)
            }
        }


    } else {
        res.status(405).json({ message: 'Method not allowed' })
    }
}