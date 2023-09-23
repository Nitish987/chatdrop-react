import PostModel from "./post";
import ReelModel from "./reel";

interface TimelineFeedModel {
    posts: PostModel[];
    hasNext: boolean;
}

interface ReellineFeedModel {
    reels: ReelModel[];
    hasNext: boolean;
}

export type { TimelineFeedModel, ReellineFeedModel };