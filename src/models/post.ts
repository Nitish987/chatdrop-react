import Hashtag from "./hashtag";
import UserModel from "./user";

interface PostPhotoModel {
    url: string;
    aspect_ratio: number;
    labels: string[];
}

interface PostVideoModel {
    url: string;
    aspect_ratio: number;
    thumbnail: string | null;
    labels: string[];
}

interface PostModel {
    id: string;
    user: UserModel;
    type: string;
    visibility: string;
    content_type: string;
    posted_on: string;
    contains_hashtags: boolean;
    likes_count: number;
    comments_count: number;
    hashtags: Hashtag[];
    text: string | null;
    photos: PostPhotoModel[];
    video: PostVideoModel | null;
    liked: string | null;
    auth_user: UserModel;
}

interface PostCommentModel {
    id: number;
    post_id: string;
    user: UserModel;
    text: string;
    likes_count: number;
    commented_on: string;
    liked: string | null;
}

interface PostsModel {
    posts: PostModel[];
    has_next: boolean;
}

export default PostModel;
export type { PostPhotoModel, PostVideoModel, PostCommentModel, PostsModel };