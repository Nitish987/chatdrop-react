import Hashtag from "./hashtag";
import UserModel from "./user";

interface Audio {
    id: number;
    name: string;
    filename: string;
    url: string;
    duration: number;
    from_user: UserModel;
}

interface ReelVideoModel {
    url: string;
    thumbnail: string | null;
    labels: string[];
    audio: Audio | null;
    aspect_ratio: number;
}

interface ReelModel {
    id: string;
    user: UserModel;
    type: string;
    visibility: string;
    posted_on: string;
    contains_hashtags: boolean;
    is_following: boolean;
    views_count: number;
    likes_count: number;
    comments_count: number;
    hashtags: Hashtag[];
    text: string | null;
    video: ReelVideoModel | null;
    liked: string | null;
    auth_user: UserModel;
}

interface ReelCommentModel {
    id: number;
    reel_id: string;
    user: UserModel;
    text: string;
    likes_count: number;
    commented_on: string;
    liked: string | null;
}

interface ReelsModel {
    reels: ReelModel[];
    has_next: boolean;
}

export default ReelModel;
export type { ReelVideoModel, ReelCommentModel, ReelsModel };