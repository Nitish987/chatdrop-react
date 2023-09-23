import { ReelCommentModel } from "../../models/reel";
import ReelService from "../../services/ReelService";

const ReelVisibility = ReelService.Visibility;
const ReelLike = ReelService.Like;
const ReelHashTag = ReelService.HashTagType;

class ReelController {
    private reelService = ReelService.getInstance();
    private reelId: string;

    private constructor(reelId: string) {
        this.reelId = reelId;
    }

    static getInstance(reelId: string): ReelController {
        return new ReelController(reelId);
    }

    changeVisibility(visibility: string): Promise<boolean> {
        return this.reelService.changeVisibility(this.reelId, visibility);
    }

    like(type: string): Promise<boolean> {
        return this.reelService.likePost(this.reelId, type);
    }

    dislike(): Promise<boolean> {
        return this.reelService.dislikePost(this.reelId);
    }

    listComment(): Promise<ReelCommentModel[] | null> {
        return this.reelService.listComment(this.reelId);
    }

    addComment(text: string): Promise<ReelCommentModel | null> {
        return this.reelService.addComment(this.reelId, text);
    }

    deleteComment(commentId: number): Promise<boolean> {
        return this.reelService.deleteComment(this.reelId, commentId);
    }
}

export default ReelController;
export { ReelVisibility, ReelLike, ReelHashTag };