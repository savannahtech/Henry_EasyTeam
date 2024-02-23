import axios from './axios';

export const GetStaffMembers = async () => await axios.get(`/staff-members`);
export const GetProducts = async () => await axios.get(`/products`);
