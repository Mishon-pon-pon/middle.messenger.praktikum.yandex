import { HTTPTransport } from "../libs/Transport";

export interface IAPIModule {
  getData: <P>(url: string, params: Record<string, string>) => Promise<P>;
  postData: <P extends Record<string, string>>(
    url: string,
    params: P
  ) => Promise<P>;
  putData: <P>(url: string, params: Record<string, any>) => Promise<P>;
  deleteData: (url: string, params: Record<string, string>) => Promise<void>;
}

export class APIModule implements IAPIModule {
  constructor() {}
  getData = <P>(url: string, data: Record<string, string>): Promise<P> => {
    return HTTPTransport.getInstance()
      .GET(url, this.getParms(data))
      .then((result) => {
        return JSON.parse(result.response);
      });
  };

  postData = async <P extends Record<string, string>>(
    url: string,
    data: P
  ): Promise<P> => {
    return HTTPTransport.getInstance()
      .POST(url, this.getParms(data))
      .then((result) => {
        return JSON.parse(result.response);
      });
  };

  deleteData = (url: string, data: Record<string, string>): Promise<void> => {
    return HTTPTransport.getInstance()
      .DELETE(url, this.getParms(data))
      .then((result) => {
        return JSON.parse(result.response);
      });
  };

  putData = <P>(url: string, data: Record<string, string>): Promise<P> => {
    return HTTPTransport.getInstance().PUT(url, this.getParms(data));
  };

  private getParms<T extends Record<string, string>>(
    data: T
  ): { [key: string]: Record<string, string> } {
    return {
      headers: {
        "Content-type": "application/json",
      },
      data: {
        ...data,
      },
    };
  }
}
