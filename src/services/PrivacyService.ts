import RequestClient from "../infra/client";
import UserModel from "../models/user";
import AuthService from "./AuthService";

class PrivacyService {
  private static instance: PrivacyService = new PrivacyService();

  private constructor() {}

  static getInstance() {
    return this.instance;
  }

  async block(uid: string): Promise<boolean> {
    try {
      const data = await RequestClient.post({
        url: `/web/privacy/v1/block/?to=${uid}`,
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      return response.success()
    } catch(e) {
      return false;
    }
  }

  async unblock(uid: string): Promise<boolean> {
    try {
      const data = await RequestClient.delete({
        url: `/web/privacy/v1/block/?to=${uid}`,
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      return response.success()
    } catch(e) {
      return false;
    }
  }

  async listBlockedUser(): Promise<UserModel[] | null> {
    try {
      const headers = AuthService.getAuthHeaders();
      const data = await RequestClient.get({
        url: '/web/privacy/v1/block/',
        headers: headers
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        const blockedList: UserModel[] = JSON.parse(JSON.stringify(response.data()['blocked_users']));
        return blockedList;
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}

export default PrivacyService;