//import model
const Post= require("../models/postModel");
const Like= require("../models/likeModel");

//like a post
exports.likePost= async(req,res)=>{
    try{
            const {post,user}= req.body;
            const like= new Like({
                post,user,
            });
            const savedLike= await like.save();

            //update the post collection basis on this and add the new likes in the like array of the post
            const updatedPost= await Post.findByIdAndUpdate(post,{$push: {likes: savedLike._id}}, {new:true})
            .populate("likes").exec();
            res.status(200).json(
                {
                    post:updatedPost,
                    message:"Entry created successfully"
                }
               );
    }
    catch(error){
        return res.status(500).json({
            error: "Error while Liking comment",
        });
    }
}


//Unlike a Post
exports.unlikePost= async (req,res)=>{
    try{
        const {post,like} = req.body;
        //find and delete like collection from post
        const deletedLike= await Like.findOneAndDelete({post:post, _id:like});
        
        //update post collection
        const updatedPost= await Post.findByIdAndUpdate(post, {$pull : {likes: deletedLike._id}}, {new:true});

        res.status(200).json(
            {
                post:updatedPost,
                message:"Unlike the post successfully"
            }
           );
    }
    catch(error){
        return res.status(500).json({
            error: "Error while unliking post",
        });
    }

}

exports.dummyLink = (req,res)=>{
    res.send("This is your dummy page");
};