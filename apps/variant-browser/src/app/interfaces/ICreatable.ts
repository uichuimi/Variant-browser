import { AxiosResponse } from "axios";

/**
 * An interface responsible of creating entities in a certain API resource
 */
export interface ICreatable {
  /**
   * Creates a record in the database via API
   * @param endpoint Resource that were the HTTP request will be sent to
   * @param data A JSON payload with the details of the object that is requested to be created
   * @return A promise with the server response of the create request
   */
    create<T,U>(endpoint: string, data: T): Promise<AxiosResponse<U>>;
}
