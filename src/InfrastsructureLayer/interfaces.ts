import {HTTPTransport} from '../libs/Transport';

export interface IAPIModule {
  getData: <P>(url: string, params: Record<string, string>) => Promise<P>;
  postData: <P extends Record<string, string>>(
    url: string,
    params: P
  ) => Promise<P>;
  putData: <P>(url: string, params: Record<string, any>) => Promise<P>;
  deleteData: (url: string, params: Record<string, string>) => Promise<void>;
}
