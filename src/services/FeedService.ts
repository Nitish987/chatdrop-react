import RequestClient from "../infra/client";
import {ReellineFeedModel, TimelineFeedModel} from "../models/feed";
import PostModel from "../models/post";
import ReelModel from "../models/reel";
import AuthService from "./AuthService";

class FeedService {
  private static instance: FeedService = new FeedService()

  static getInstance() {
    return this.instance;
  }

  async getTimelineFeeds(page: number = 1): Promise<TimelineFeedModel | null> {
    try {
      const headers = AuthService.getAuthHeaders();
      const data = await RequestClient.get({
        url: `/web/feeds/v3/feeds/timeline/?page=${page}`,
        headers: headers,
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        const posts: PostModel[] = JSON.parse(JSON.stringify(response.data()['feeds']));
        const hasNext: boolean = response.data()['has_next'];
        return { posts, hasNext };
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async getReellineFeeds(page: number = 1): Promise<ReellineFeedModel | null> {
    try {
      const headers = AuthService.getAuthHeaders();
      const data = await RequestClient.get({
        url: `/web/feeds/v1/feeds/reelline/?page=${page}`,
        headers: headers,
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        const reels: ReelModel[] = JSON.parse(JSON.stringify(response.data()['feeds']));
        const hasNext: boolean = response.data()['has_next'];
        return { reels, hasNext };
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}

export default FeedService;