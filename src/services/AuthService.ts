import { onAuthStateChanged, signInWithCustomToken, signOut } from "firebase/auth";
import FireApi from "../api/firebase";
import RequestClient, { ResponseCollector } from "../infra/client";
import { getCookie } from "../infra/utils";
import { getToken } from "firebase/messaging";

interface ISignupParams {
  firstname: string;
  lastname: string;
  email: string;
  gender: string;
  dob: string;
  password: string;
}

interface ILoginParams {
  email: string;
  password: string;
}

interface AuthHeaderParams {
  uid: string | null;
  lst: string | null;
}

class AuthService {
  private static instance: AuthService = new AuthService();

  static getInstance(): AuthService {
    return AuthService.instance;
  }

  static getLoginStateToken(): string | null {
    const lst = getCookie('lst')
    return lst;
  }

  static isAuthenticated(): boolean {
    const lst = AuthService.getLoginStateToken();
    return lst !== null && FireApi.auth.currentUser !== null;
  }

  static getUserId(): string | null {
    if (AuthService.isAuthenticated()) {
      return FireApi.auth.currentUser!.uid;
    }
    return null;
  }

  static getAuthHeaders(): AuthHeaderParams {
    const headers: AuthHeaderParams = {
      uid: AuthService.getUserId(),
      lst: AuthService.getLoginStateToken(),
    }
    return headers;
  }

  setAuthStateChangeListener(listen: Function) {
    onAuthStateChanged(FireApi.auth, user => {
      if (user && AuthService.getLoginStateToken()) {
        listen(true);
      } else {
        listen(false);
      }
    });
  }

  async signup({ firstname, lastname, email, gender, dob, password }: ISignupParams): Promise<ResponseCollector> {
    try {
      const data = await RequestClient.post({
        url: '/web/account/v1/signup/',
        data: {
          first_name: firstname,
          last_name: lastname,
          gender: gender,
          date_of_birth: dob,
          email: email,
          password: password,
          msg_token: '',
        }
      });
      return RequestClient.collect(data);
    } catch (e) {
      return ResponseCollector.localErrorResponse();
    }
  }

  async signupVerification(otp: string): Promise<ResponseCollector> {
    try {
      const data = await RequestClient.post({
        url: '/web/account/v1/signup/verify/',
        data: {
          otp: otp
        }
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        const firebase_auth_token = response.data()['fat'];
        await signInWithCustomToken(FireApi.auth, firebase_auth_token);
      }
      return response;
    } catch (e) {
      return ResponseCollector.localErrorResponse();
    }
  }

  async resentSignupVerificationOtp(): Promise<ResponseCollector> {
    try {
      const data = await RequestClient.post({
        url: '/web/account/v1/signup/resent/otp/',
      });
      return RequestClient.collect(data);
    } catch (e) {
      return ResponseCollector.localErrorResponse();
    }
  }

  async login({ email, password }: ILoginParams): Promise<ResponseCollector> {
    try {
      const data = await RequestClient.post({
        url: '/web/account/v1/login/',
        data: {
          email: email,
          password: password,
          msg_token: '',
        }
      });
      const response = RequestClient.collect(data)
      if (response.success()) {
        const firebase_auth_token = response.data()['fat'];
        await signInWithCustomToken(FireApi.auth, firebase_auth_token);
      }
      return response;
    } catch (e) {
      return ResponseCollector.localErrorResponse();
    }
  }

  async passwordRecovery(email: string): Promise<ResponseCollector> {
    try {
      const data = await RequestClient.post({
        url: '/web/account/v1/recovery/password/',
        data: {
          email: email
        }
      });
      return RequestClient.collect(data);
    } catch (e) {
      return ResponseCollector.localErrorResponse();
    }
  }

  async passwordRecoveryVerification(otp: string): Promise<ResponseCollector> {
    try {
      const data = await RequestClient.post({
        url: '/web/account/v1/recovery/password/verify/',
        data: {
          otp: otp
        }
      });
      return RequestClient.collect(data);
    } catch (e) {
      return ResponseCollector.localErrorResponse();
    }
  }

  async passwordRecoveryNewPassword(password: string): Promise<ResponseCollector> {
    try {
      const data = await RequestClient.post({
        url: '/web/account/v1/recovery/password/verify/new/',
        data: {
          password: password
        }
      });
      return RequestClient.collect(data);
    } catch (e) {
      return ResponseCollector.localErrorResponse();
    }
  }

  async resentPasswordRecoveryOtp(): Promise<ResponseCollector> {
    try {
      const data = await RequestClient.post({
        url: '/web/account/v1/recovery/password/resent/otp/',
        data: {}
      });
      return RequestClient.collect(data);
    } catch (e) {
      return ResponseCollector.localErrorResponse();
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ResponseCollector> {
    try {
      const headers = AuthService.getAuthHeaders();
      const data = await RequestClient.post({
        url: '/web/account/v1/account/password/change/',
        data: {
          password: currentPassword,
          new_password: newPassword
        },
        headers: headers,
      });
      return RequestClient.collect(data);
    } catch (e) {
      return ResponseCollector.localErrorResponse();
    }
  }

  async changeUserNames(firstName: string, lastName: string, username: string, password: string): Promise<ResponseCollector> {
    try {
      const headers = AuthService.getAuthHeaders();
      const data = await RequestClient.post({
        url: '/web/account/v1/account/names/change/',
        data: {
          first_name: firstName,
          last_name: lastName,
          username: username,
          password: password
        },
        headers: headers,
      });
      return RequestClient.collect(data);
    } catch (e) {
      return ResponseCollector.localErrorResponse();
    }
  }

  async updateFcmToken(token: string = ''): Promise<boolean> {
    try {
      const headers = AuthService.getAuthHeaders();
      if (token === '') {
        token = await getToken(FireApi.fcm, {
          vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
        });
      }
      const data = await RequestClient.post({
        url: '/web/account/v1/fcm/token/',
        data: { msg_token: token },
        headers: headers,
      });
      const response = RequestClient.collect(data);
      return response.success();
    } catch (e) {
      return false;
    }
  }

  async loginCheck(): Promise<boolean> {
    try {
      const headers = AuthService.getAuthHeaders();
      const data = await RequestClient.get({
        url: '/web/account/v1/login/check/',
        headers: headers,
      });
      const response = RequestClient.collect(data);
      if (!response.success()) {
        await signOut(FireApi.auth);
      }
      return response.success();
    } catch (e) {
      return false;
    }
  }

  async logout(): Promise<boolean> {
    try {
      const headers = AuthService.getAuthHeaders();
      const data = await RequestClient.post({
        url: '/web/account/v1/logout/',
        headers: headers,
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        await signOut(FireApi.auth);
      }
      return response.success();
    } catch (e) {
      return false;
    }
  }
}

export default AuthService;
export type { ISignupParams, ILoginParams }