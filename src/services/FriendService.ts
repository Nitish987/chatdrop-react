import RequestClient from "../infra/client";
import { FriendProfileModel } from "../models/profile";
import UserModel from "../models/user";
import AuthService from "./AuthService";


class FriendProfileService {
  private static instance: FriendProfileService = new FriendProfileService();

  static getInstance(): FriendProfileService {
    return FriendProfileService.instance;
  }

  async getProfile(uid: string): Promise<FriendProfileModel | null> {
    try {
      const headers = AuthService.getAuthHeaders();
      const data = await RequestClient.get({
        url: `/web/account/v1/profile/${uid}/`,
        headers: headers
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        const profile: FriendProfileModel = JSON.parse(JSON.stringify(response.data()));
        return profile;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async sendFriendRequest(uid: string): Promise<boolean> {
    try {
      const headers = AuthService.getAuthHeaders();
      const data = await RequestClient.post({
        url: `/web/friend/v1/friend/request/send/?to=${uid}`,
        headers: headers
      });
      const response = RequestClient.collect(data);
      return response.success();
    } catch (e) {
      return false;
    }
  }

  async acceptFriendRequest(requestId: number): Promise<boolean> {
    try {
      const headers = AuthService.getAuthHeaders();
      const data = await RequestClient.post({
        url: `/web/friend/v1/friend/request/${requestId}/accept/`,
        headers: headers
      });
      const response = RequestClient.collect(data);
      return response.success();
    } catch (e) {
      return false;
    }
  }

  async unfriend(uid: string): Promise<boolean> {
    try {
      const headers = AuthService.getAuthHeaders();
      const data = await RequestClient.delete({
        url: `/web/friend/v1/unfriend/?to=${uid}`,
        headers: headers
      });
      const response = RequestClient.collect(data);
      return response.success();
    } catch (e) {
      return false;
    }
  }

  async isFriend(uid: string): Promise<boolean> {
    try {
      const headers = AuthService.getAuthHeaders();
      const data = await RequestClient.delete({
        url: `/web/friend/v1/friend/check/?of=${uid}`,
        headers: headers
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        return response.data()['is_friend'];
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  async listFriend(uid: string, page: number = 1): Promise<UserModel[] | null> {
    try {
      const headers = AuthService.getAuthHeaders();
      const data = await RequestClient.get({
        url: `/web/friend/v1/friend/list/?of=${uid}&page=${page}`,
        headers: headers
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        const friendList: UserModel[] = JSON.parse(JSON.stringify(response.data()['friends']));
        return friendList;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async listFriendRequests(page: number = 1): Promise<UserModel[] | null> {
    try {
      const headers = AuthService.getAuthHeaders();
      const data = await RequestClient.delete({
        url: `/web/friend/v1/friend/request/list/?page=${page}`,
        headers: headers
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        const friendRequestList: UserModel[] = JSON.parse(JSON.stringify(response.data()['requests']));
        return friendRequestList;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async sendFollowRequest(uid: string): Promise<boolean> {
    try {
      const headers = AuthService.getAuthHeaders();
      const data = await RequestClient.post({
        url: `/web/fanfollowing/v1/follow/request/send/?to=${uid}`,
        headers: headers
      });
      const response = RequestClient.collect(data);
      return response.success();
    } catch (e) {
      return false;
    }
  }

  async acceptFollowRequest(requestId: number): Promise<boolean> {
    try {
      const headers = AuthService.getAuthHeaders();
      const data = await RequestClient.post({
        url: `/web/fanfollowing/v1/follow/request/${requestId}/accept/`,
        headers: headers
      });
      const response = RequestClient.collect(data);
      return response.success();
    } catch (e) {
      return false;
    }
  }

  async unfollow(uid: string): Promise<boolean> {
    try {
      const headers = AuthService.getAuthHeaders();
      const data = await RequestClient.delete({
        url: `/web/fanfollowing/v1/unfollow/?to=${uid}`,
        headers: headers
      });
      const response = RequestClient.collect(data);
      return response.success();
    } catch (e) {
      return false;
    }
  }
}

export default FriendProfileService;