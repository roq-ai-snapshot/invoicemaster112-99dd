import axios from 'axios';
import queryString from 'query-string';
import { DisputeInterface } from 'interfaces/dispute';
import { GetQueryInterface } from '../../interfaces';

export const getDisputes = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/disputes${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createDispute = async (dispute: DisputeInterface) => {
  const response = await axios.post('/api/disputes', dispute);
  return response.data;
};

export const updateDisputeById = async (id: string, dispute: DisputeInterface) => {
  const response = await axios.put(`/api/disputes/${id}`, dispute);
  return response.data;
};

export const getDisputeById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/disputes/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteDisputeById = async (id: string) => {
  const response = await axios.delete(`/api/disputes/${id}`);
  return response.data;
};
