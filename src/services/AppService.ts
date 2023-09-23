import FireApi from "../api/firebase";

class AppService {
  private static instance: AppService = new AppService();

  static getInstance() {
    return AppService.instance;
  }

  initialize() {
    FireApi.initialize();
  }
}

export default AppService;