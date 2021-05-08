const METHODS = {
  GET: "GET",
  PUT: "PUT",
  POST: "POST",
  DELETE: "DELETE",
};

const DOMEN = "https://ya-praktikum.tech/api/v2";

export class HTTPTransport {
  defaultOptions = {
    headers: {},
    data: {},
  };
  GET = (
    url: string,
    options: { [key: string]: Record<string, string> } = this.defaultOptions
  ) => {
    const requestParams = queryStringify(options.data);
    url += requestParams;
    return this.request(
      url,
      { ...options, method: METHODS.GET },
      Number(options.timeout) || 5000
    );
  };
  PUT = (
    url: string,
    options: { [key: string]: Record<string, string> } = this.defaultOptions
  ) => {
    return this.request(
      url,
      { ...options, method: METHODS.PUT },
      Number(options.timeout) || 5000
    );
  };
  POST = (
    url: string,
    options: { [key: string]: Record<string, string | number> } = this
      .defaultOptions
  ) => {
    return this.request(
      url,
      { ...options, method: METHODS.POST },
      Number(options.timeout) || 5000
    );
  };
  DELETE = (
    url: string,
    options: { [key: string]: Record<string, string> } = this.defaultOptions
  ) => {
    return this.request(
      url,
      { ...options, method: METHODS.DELETE },
      Number(options.timeout) || 5000
    );
  };
  request = (
    url: string,
    options: { [key: string]: Record<string, string> } | Record<string, string>,
    timeout: number = 5000
  ) => {
    url = DOMEN + url;
    return new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open(<string>options.method, url);
      const headers = options.headers;
      for (let header in <Record<string, string>>headers) {
        //@ts-ignore
        xhr.setRequestHeader(header, headers[header]);
      }
      xhr.onload = () => {
        resolve(xhr);
      };
      xhr.onerror = (e) => {
        reject(e);
      };
      xhr.onabort = (e) => {
        reject(e);
      };
      setTimeout(() => {
        xhr.abort();
      }, timeout);

      xhr.send(JSON.stringify(options.data));
    });
  };
}

function queryStringify(data: Record<string, string>) {
  let requestParams = "?";
  for (let key in data) {
    requestParams += `${key}=${data[key]}&`;
  }
  requestParams = requestParams.substring(0, requestParams.length - 1);
  return requestParams;
}
