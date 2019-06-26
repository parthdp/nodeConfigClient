const request = require('request').defaults({ rejectUnauthorized: false });
import { Promise } from 'es6-promise';
import { URL } from 'url';

export class HttpService {
  private startingHttpStatusErrorCode: number = 300;

  public get(url: URL, headers: {}): Promise<string> {
    return new Promise<any>((resolve: any, reject: any) => {
      request.get({ url: url.toString(), headers }, (error: any, response: any, body: any) => {
        if (error) {
          reject(error.code);
        } else if (response.statusCode < this.startingHttpStatusErrorCode) {
          resolve(body);
        } else {
          reject(response.body);
        }
      });
    });
  }

  public post(url: URL, headers: {}): Promise<string> {
    return new Promise<any>((resolve: any, reject: any) => {
      const options = {
        headers,
        method: 'POST',
        url: url.toString(),
      };

      request(options, (error: any, response: any, body: any) => {
        if (error) {
          reject(error.code);
        } else if (response.statusCode < this.startingHttpStatusErrorCode) {
          resolve(body);
        } else {
          reject(response.body);
        }
      });
    });
  }
}