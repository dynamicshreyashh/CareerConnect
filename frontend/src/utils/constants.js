const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1").replace(/\/$/, "");

export const API_BASE_URL = apiBaseUrl;
export const USER_API_END_POINT = `${apiBaseUrl}/user`;
export const JOB_API_END_POINT = `${apiBaseUrl}/job`;
export const APPLICATION_API_END_POINT = `${apiBaseUrl}/application`;
export const COMPANY_API_END_POINT = `${apiBaseUrl}/company`;
