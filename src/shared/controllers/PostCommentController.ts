import PostService from "../../services/PostService";

const CommmentLike = PostService.Like;

class PostCommentController {
    private postService = PostService.getIntance();
    private commentId: number;

    private constructor(commentId: number) {
        this.commentId = commentId;
    }

    static getInstance(commentId: number): PostCommentController {
        return new PostCommentController(commentId);
    }

    like(type: string): Promise<boolean> {
        return this.postService.likeComment(this.commentId, type);
    }

    dislike(): Promise<boolean> {
        return this.postService.dislikeComment(this.commentId);
    }
}

export default PostCommentController;
export { CommmentLike };