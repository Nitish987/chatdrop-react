import { ReellineFeedModel } from "../../../models/feed";
import FeedService from "../../../services/FeedService";
import ReelService from "../../../services/ReelService";

class ReelPageController {
    private static instance: ReelPageController = new ReelPageController();
    private feedService = FeedService.getInstance();
    private reelService = ReelService.getInstance();
    private static page: number = 2;

    static getInstance() {
        return this.instance;
    }

    fetchReellineFeeds(): Promise<ReellineFeedModel | null> {
        return this.feedService.getReellineFeeds(ReelPageController.page++);
    }

    deleteReel(reelId: string): Promise<boolean> {
        return this.reelService.deleteReel(reelId);
    }
}

export default ReelPageController;