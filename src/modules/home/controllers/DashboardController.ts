import { TimelineFeedModel } from "../../../models/feed";
import FeedService from "../../../services/FeedService";
import PostService from "../../../services/PostService";

class DashboardController {
    private static instance: DashboardController = new DashboardController();
    private feedService = FeedService.getInstance();
    private postService = PostService.getIntance();
    private static page: number = 2;

    static getInstance() {
        return this.instance;
    }

    fetchTimelineFeeds(): Promise<TimelineFeedModel | null> {
        return this.feedService.getTimelineFeeds(DashboardController.page++);
    }

    deletePost(postId: string): Promise<boolean> {
        return this.postService.deletePost(postId);
    }
}

export default DashboardController;