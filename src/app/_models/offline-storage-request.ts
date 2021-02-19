
export interface IStoredRequest {
    URL: string,
    Type: string,
    Data: any,
    Time: number,
    Id: string,
  }

  export interface IStoredContentRequest {
    tableName: string,
    key: string,
    contentURL: any,
    contentType: string;
    containerName: string;
  }