import { IContact } from "./contact";

export interface IContactListResponse {
  contacts: IContact[],
  totalRows: number
}