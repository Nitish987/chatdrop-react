import RequestClient from "../infra/client";
import { FollowersModel, FollowingsModel } from "../models/fans";
import AuthService from "./AuthService";

class FansService {
  private static instance: FansService = new FansService();

  private constructor() {}

  static getInstance() {
    return this.instance;
  }

  async listFollowers(uid: string, page: number): Promise<FollowersModel | null> {
    try {
      const data = await RequestClient.get({
        url: `/web/fanfollowing/v1/followers/list/?of=${uid}&page=${page}`,
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        const followers: FollowersModel = JSON.parse(JSON.stringify(response.data()));
        return followers;
      }
      return null;
    } catch(e) {
      return null;
    }
  }

  async listFollowings(uid: string, page: number): Promise<FollowingsModel | null> {
    try {
      const data = await RequestClient.get({
        url: `/web/fanfollowing/v1/followings/list/?of=${uid}&page=${page}`,
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        const followers: FollowingsModel = JSON.parse(JSON.stringify(response.data()));
        return followers;
      }
      return null;
    } catch(e) {
      return null;
    }
  }
}

export default FansService;