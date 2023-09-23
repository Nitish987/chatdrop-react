import RequestClient from "../infra/client";
import ReelModel, { ReelCommentModel, ReelsModel } from "../models/reel";
import AuthService from "./AuthService";

class ReelService {
  private static instance: ReelService = new ReelService();
  public static Visibility = { PUBLIC: 'PUBLIC', PRIVATE: 'PRIVATE', ONLY_FRIENDS: 'ONLY_FRIENDS' };
  public static Like = { NONE: null, LIKE: 'LIKE', LOVE: 'LOVE', HAHA: 'HAHA', YAY: 'YAY', WOW: 'WOW', SAD: 'SAD', ANGRY: 'ANGRY' };
  public static HashTagType = {USER: 'USER', TAG: 'TAG', URL: 'URL'}

  private constructor() {}

  static getInstance() {
    return this.instance;
  }

  async viewReel(reelId: string): Promise<ReelModel | null> {
    try {
      const data = await RequestClient.get({
        url: `/web/reel/v1/reel/${reelId}/view/`,
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        const reel: ReelModel = JSON.parse(JSON.stringify(response.data()['reel']));
        return reel;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async changeVisibility(reelId: string, visibility: string): Promise<boolean> {
    try {
      const data = await RequestClient.put({
        url: `/web/reel/v1/reel/${reelId}/visibility/?vbt=${visibility}`,
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      return response.success();
    } catch (e) {
      return false;
    }
  }

  async listReel(uid: string, page: number = 1): Promise<ReelsModel | null> {
    try {
      const data = await RequestClient.get({
        url: `/web/reel/v1/reel/list/?of=${uid}&page=${page}`,
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        const reels: ReelsModel = JSON.parse(JSON.stringify(response.data()));
        return reels;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async deleteReel(reelId: string): Promise<boolean> {
    try {
      const data = await RequestClient.delete({
        url: `/web/reel/v1/reel/${reelId}/delete/`,
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      return response.success();
    } catch (e) {
      return false;
    }
  }

  async addComment(reelId: string, text: string): Promise<ReelCommentModel | null> {
    try {
      const data = await RequestClient.post({
        url: `/web/reel/v1/reel/${reelId}/comment/`,
        data: { text: text },
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        const comment: ReelCommentModel = JSON.parse(JSON.stringify(response.data()['comment']));
        return comment;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async listComment(reelId: string): Promise<ReelCommentModel[] | null> {
    try {
      const data = await RequestClient.get({
        url: `/web/reel/v1/reel/${reelId}/comment/`,
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        const comments: ReelCommentModel[] = JSON.parse(JSON.stringify(response.data()['comments']));
        return comments;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async deleteComment(reelId: string, commentId: number): Promise<boolean> {
    try {
      const data = await RequestClient.delete({
        url: `/web/reel/v1/reel/${reelId}/comment/${commentId}/delete/`,
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      return response.success();
    } catch (e) {
      return false;
    }
  }

  async likePost(reelId: string, type: string): Promise<boolean> {
    try {
      const data = await RequestClient.post({
        url: `/web/reel/v1/reel/${reelId}/like/`,
        data: { type: type },
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      return response.success();
    } catch (e) {
      return false;
    }
  }

  async dislikePost(reelId: string): Promise<boolean> {
    try {
      const data = await RequestClient.delete({
        url: `/web/reel/v1/reel/${reelId}/like/`,
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      return response.success();
    } catch (e) {
      return false;
    }
  }

  async likeComment(commentId: number, type: string): Promise<boolean> {
    try {
      const data = await RequestClient.post({
        url: `/web/reel/v1/reel/comment/${commentId}/like/`,
        data: { type: type },
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      return response.success();
    } catch (e) {
      return false;
    }
  }

  async dislikeComment(commentId: number): Promise<boolean> {
    try {
      const data = await RequestClient.delete({
        url: `/web/reel/v1/reel/comment/${commentId}/like/`,
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      return response.success();
    } catch (e) {
      return false;
    }
  }
}

export default ReelService;