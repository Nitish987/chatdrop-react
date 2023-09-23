import { ResponseCollector } from "../../../infra/client";
import AuthService from "../../../services/AuthService";

class RecoveryFormController {
    private authService = AuthService.getInstance();

    async passwordRecovery(email: string): Promise<ResponseCollector> {
        return this.authService.passwordRecovery(email);
    }

    async passwordRecoveryVerification(otp: string): Promise<ResponseCollector> {
        return this.authService.passwordRecoveryVerification(otp);
    }

    async passwordRecoveryNewPassword(password: string): Promise<ResponseCollector> {
        return this.authService.passwordRecoveryNewPassword(password);
    }

    async resentPasswordRecoveryVerificationOtp(): Promise<ResponseCollector> {
        return this.authService.resentPasswordRecoveryOtp();
    }
}

export default RecoveryFormController;