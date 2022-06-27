import PostModel from '../Models/Post.js'

export const createPost = async (req, res) => {
    try {
        const doc = await new PostModel({
            title:req.body.title,
            text:req.body.text,
            tags:req.body.tags,
            imageUrl:req.body.imageUrl,
            user:req.userId
        })

        const post = await doc.save()
        res.json(post)

    } catch (e) {
        console.log(e)
        res.status(500).json({
            message:'Не удалось создать статью'
        })
    }
}