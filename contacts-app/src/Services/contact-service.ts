import { AxiosResponse } from "axios";
import { IContact } from "../Interfaces/contact";
import httpClient from "./base-service";
import { ISearch } from "../Interfaces/search";
import { IContactListResponse } from "../Interfaces/contactListResponse";

const endPointBaseURL = `https://localhost:44305/api/contact`;

const getAll = async (
  contactRequest: ISearch
): Promise<AxiosResponse<IContactListResponse>> =>
  httpClient.post<IContactListResponse>(
    `${endPointBaseURL}/search`,
    contactRequest
  );

const get = async (id: number): Promise<AxiosResponse<IContact>> =>
  httpClient.get<IContact>(`${endPointBaseURL}/${id}`);

const add = async (contact: IContact): Promise<AxiosResponse<IContact>> =>
  httpClient.post<IContact>(`${endPointBaseURL}`, contact);

const update = async (
  id: number,
  contact: IContact
): Promise<AxiosResponse<IContact>> =>
  httpClient.put<IContact>(`${endPointBaseURL}/${id}`, contact);

const deleteContact = async (id: number): Promise<AxiosResponse<string>> =>
  httpClient.delete<string>(`${endPointBaseURL}/${id}`);

export default {
  getAll,
  get,
  add,
  update,
  deleteContact,
};
