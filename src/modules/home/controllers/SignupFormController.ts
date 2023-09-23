import { ResponseCollector } from "../../../infra/client";
import AuthService, { ISignupParams } from "../../../services/AuthService";

class SignupFormController {
  private authService: AuthService = AuthService.getInstance();

  async signup({ firstname, lastname, email, gender, dob, password }: ISignupParams): Promise<ResponseCollector> {
    return this.authService.signup({
      firstname: firstname,
      lastname: lastname,
      email: email,
      gender: gender,
      dob: dob,
      password: password
    });
  }

  async signupVerification(otp: string): Promise<ResponseCollector> {
    return this.authService.signupVerification(otp);
  }

  async resentSignupVerificationOtp(): Promise<ResponseCollector> {
    return this.authService.resentSignupVerificationOtp();
  }
}

export default SignupFormController;