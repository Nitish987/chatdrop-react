import AuthService from "../../services/AuthService";

class NavbarController {
  private static instance: NavbarController = new NavbarController();
  private authService = AuthService.getInstance();

  private constructor() { }

  static getInstance(): NavbarController {
    return NavbarController.instance;
  }

  logoutAccount(): Promise<boolean> {
    return this.authService.logout();
  }
}

export default NavbarController;