import RequestClient from "../infra/client";
import LinkPreview from "../models/linkpreview";
import AuthService from "./AuthService";

class FacilityService {
  private static instance: FacilityService = new FacilityService();

  private constructor() {}

  static getInstance() {
    return this.instance;
  }

  async linkPreview(url: string): Promise<LinkPreview | null> {
    try {
      const data = await RequestClient.post({
        url: '/web/facility/v1/linkpreview/',
        data: { url },
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        const preview: LinkPreview = JSON.parse(JSON.stringify(response.data()['preview']));
        return preview;
      }
      return null;
    } catch(e) {
      return null;
    }
  }
}

export default FacilityService;