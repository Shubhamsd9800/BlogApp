//import model
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");

//business logic

exports.createComment = async (req, res) => {
    try{
        //fetch data from req body
        const {post, user, body} = req.body;

        //create comment object
        const comment = new Comment({
            post,user,body
        });

        //save  the new comment into the database
        const savedComment = await comment.save();

        //find the post by ID, add new comment to its comments array
        const updatedPost = await Post.findByIdAndUpdate(post, {$push: {comments: savedComment._id} }, {new: true} )
                            .populate("comments") // populate the comments array with comment documents
                            .exec();
       res.status(200).json(
        {
            post:updatedPost,
            message:"Entry created successfully"
        }
       );
    }
    catch(error){
        return res.status(500).json({
            error: "Error while creating comment",
        });
    }
};