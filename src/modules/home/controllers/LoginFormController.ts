import { ResponseCollector } from "../../../infra/client";
import AuthService, { ILoginParams } from "../../../services/AuthService";

class LoginFormController {
  private authService: AuthService = AuthService.getInstance();

  async login({ email, password }: ILoginParams): Promise<ResponseCollector> {
    return this.authService.login({
      email: email,
      password: password
    });
  }
}

export default LoginFormController;