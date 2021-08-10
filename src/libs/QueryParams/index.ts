type QueryParamsValue =
  | null
  | undefined
  | string
  | number
  | Array<string | number>;

class QueryUtils {
  getQueryParamsStr(): string | null {
    return window.location.href.split("?")[1] || null;
  }

  getQueryParamsObj = (): Record<string, string> => {
    const filterUrlString = this.getQueryParamsStr();
    if (filterUrlString === null) {
      return {};
    }

    return filterUrlString
      .split("&")
      .map((item) => {
        return item.split("=");
      })
      .reduce((prev, next) => {
        const [filterName, filterValue] = next;
        const isArrayValue = this.checkStringIsArrayValue(filterValue);

        if (isArrayValue) {
          const value = this.extractArrayFromString(filterValue);
          return { ...prev, ...{ [filterName]: value } };
        }

        return { ...prev, ...{ [filterName]: window.decodeURI(filterValue) } };
      }, {});
  };

  setQueryParamsStr = (params: string) => {
    window.history.pushState(
      { params: params },
      "",
      `${window.location.hash.split("?")[0]}${params ? "?" : ""}${params}`
    );
  };

  setQueryParamsObj = (
    params: Record<string, QueryParamsValue>,
    replace?: boolean
  ) => {
    const queryParams: string = this.compileFilters(params);
    if (replace) {
      window.history.replaceState(
        null,
        "",
        `${window.location.hash.split("?")[0]}${
          queryParams ? "?" : ""
        }${queryParams}`
      );
    } else {
      window.history.pushState(
        null,
        "",
        `${window.location.hash.split("?")[0]}${
          queryParams ? "?" : ""
        }${queryParams}`
      );
    }
  };

  private compileFilters = (
    filters: Record<string, QueryParamsValue>
  ): string => {
    const arrayFilters = [];

    for (let key in filters) {
      if (Array.isArray(filters[key])) {
        const value = (filters[key] as Array<unknown>).join("%");
        if (value.length > 0) {
          arrayFilters.push(`${key}=[${encodeURI(`${value}`)}]`);
        }
      } else {
        if (filters[key] || filters[key] === 0) {
          arrayFilters.push(`${key}=${filters[key]}`);
        }
      }
    }

    return arrayFilters.join("&");
  };

  private checkStringIsArrayValue = (value: string): boolean => {
    return Array.isArray(decodeURI(value).match(/^\[[\d%]+\]$/gm));
  };

  private extractArrayFromString = (value: string): RegExpMatchArray | null => {
    const regex = /[\d,a-z,A-Z,а-я,А-Я,_-]+/gm;
    return decodeURI(value).match(regex);
  };
}

export default QueryUtils;
