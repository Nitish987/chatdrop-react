import {ReellineFeedModel, TimelineFeedModel} from "./models/feed";
import { FullProfileModel } from "./models/profile";
import AppService from "./services/AppService";
import AuthService from "./services/AuthService";
import FeedService from "./services/FeedService";
import ProfileService from "./services/ProfileService";

class AppController {
  private static instance: AppController = new AppController();
  private appService = AppService.getInstance();
  private authService = AuthService.getInstance();
  private profileService = ProfileService.getInstance();
  private feedService = FeedService.getInstance();

  private constructor() {}

  static getInstance(): AppController {
    return AppController.instance;
  }

  initializeApp() {
    this.appService.initialize();
  }

  authStateChangeListener(listen: Function) {
    this.authService.setAuthStateChangeListener(listen);
  }

  async updateMessagingToken() {
    await this.authService.updateFcmToken();
  }
  
  async loginCheck(): Promise<boolean> {
    return this.authService.loginCheck();
  }

  async logoutAccount(): Promise<boolean> {
    return this.authService.logout();
  }

  async fetchProfile(): Promise<FullProfileModel | null> {
    return await this.profileService.getProfile();
  }

  async fetchTimelineFeeds(): Promise<TimelineFeedModel | null> {
    return await this.feedService.getTimelineFeeds();
  }

  async fetchReellineFeeds(): Promise<ReellineFeedModel | null>  {
    return this.feedService.getReellineFeeds();
}
}

export default AppController;