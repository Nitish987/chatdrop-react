import ReelService from "../../services/ReelService";

const CommmentLike = ReelService.Like;

class ReelCommentController {
    private ReelService = ReelService.getInstance();
    private commentId: number;

    private constructor(commentId: number) {
        this.commentId = commentId;
    }

    static getInstance(commentId: number): ReelCommentController {
        return new ReelCommentController(commentId);
    }

    like(type: string): Promise<boolean> {
        return this.ReelService.likeComment(this.commentId, type);
    }

    dislike(): Promise<boolean> {
        return this.ReelService.dislikeComment(this.commentId);
    }
}

export default ReelCommentController;
export { CommmentLike };