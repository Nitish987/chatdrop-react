import axios from "axios";
import { getCookie } from "./utils";

class ResponseCollector {
  response: any;

  constructor(response: any) {
    this.response = response;
  }

  success = (): boolean => this.response['success'];

  data = (): any => this.response['data'];

  error = (): string => {
    const errors = this.response['errors'];
    return errors[Object.keys(errors)[0]][0];
  }

  static localErrorResponse(error: string = "Something went wrong."): ResponseCollector {
    return new ResponseCollector({
      success: false,
      data: {},
      errors: {
        client: [error]
      }
    });
  }
}

interface IRequestConfig {
  url: string;
  data?: any;
  headers?: any;
}

class RequestClient {
  static async post({ url, data = {}, headers = {} }: IRequestConfig) {
    headers['X-CSRFToken'] = getCookie('csrftoken');
    headers['mode'] = 'same-origin';

    const response = await axios.post(url, data, {
      headers: headers
    });
    return response.data;
  }

  static async put({ url, data = {}, headers = {} }: IRequestConfig) {
    headers['X-CSRFToken'] = getCookie('csrftoken');
    headers['mode'] = 'same-origin';

    const response = await axios.put(url, data, {
      headers: headers
    });
    return response.data;
  }

  static async get({ url, headers = {} }: IRequestConfig) {
    headers['X-CSRFToken'] = getCookie('csrftoken');
    headers['mode'] = 'same-origin';

    const response = await axios.get(url, {
      headers: headers
    });
    return response.data;
  }

  static async delete({ url, headers = {} }: IRequestConfig) {
    headers['X-CSRFToken'] = getCookie('csrftoken');
    headers['mode'] = 'same-origin';
    
    const response = await axios.delete(url, {
      headers: headers
    });
    return response.data;
  }

  static collect(data: any): ResponseCollector {
    return new ResponseCollector(data);
  }
}

export default RequestClient;
export { ResponseCollector }