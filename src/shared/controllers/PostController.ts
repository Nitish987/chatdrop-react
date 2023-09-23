import { PostCommentModel } from "../../models/post";
import PostService from "../../services/PostService";

const PostVisibility = PostService.Visibility;
const PostLike = PostService.Like;
const PostHashTag = PostService.HashTagType;

class PostController {
    private postService = PostService.getIntance();
    private postId: string;

    private constructor(postId: string) {
        this.postId = postId;
    }

    static getInstance(postId: string): PostController {
        return new PostController(postId);
    }

    changeVisibility(visibility: string): Promise<boolean> {
        return this.postService.changeVisibility(this.postId, visibility);
    }

    like(type: string): Promise<boolean> {
        return this.postService.likePost(this.postId, type);
    }

    dislike(): Promise<boolean> {
        return this.postService.dislikePost(this.postId);
    }

    listComment(): Promise<PostCommentModel[] | null> {
        return this.postService.listComment(this.postId);
    }

    addComment(text: string): Promise<PostCommentModel | null> {
        return this.postService.addComment(this.postId, text);
    }

    deleteComment(commentId: number): Promise<boolean> {
        return this.postService.deleteComment(this.postId, commentId);
    }
}

export default PostController;
export { PostVisibility, PostLike, PostHashTag };