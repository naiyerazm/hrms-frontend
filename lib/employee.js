import { apiRequest } from "./api";
import { getToken } from "./session";

export async function getDepartmentWiseCount(filters = {}) {
  const token = getToken();
  let query = new URLSearchParams(filters).toString();

  return apiRequest(
    `/employee/department-wise-count/?${query}`,
    "GET",
    null,
    token
  );
}

export async function getDesignationWiseCount(filters = {}) {
  const token = getToken();
  let query = new URLSearchParams(filters).toString();

  return apiRequest(
    `/employee/designation-wise-count/?${query}`,
    "GET",
    null,
    token
  );
}

export async function getDepartmentWiseTransferCount(filters = {}) {
  const token = getToken();
  let query = new URLSearchParams(filters).toString();

  return apiRequest(
    `/employee/transfer-report/department-wise-count/?${query}`,
    "GET",
    null,
    token
  );
}

export async function getDepartmentWiseAppointmentCount(filters = {}) {
  const token = getToken();
  let query = new URLSearchParams(filters).toString();

  return apiRequest(
    `/employee/appointment-report/department-wise-count/?${query}`,
    "GET",
    null,
    token
  );
}

export async function getEmeployementTypes() {
  const token = getToken();

  return apiRequest(
    `/master/employment-types/`,
    "GET",
    null,
    token
  );
}

export async function getServiceGroups() {
  const token = getToken();

  return apiRequest(
    `/master/service-groups/`,
    "GET",
    null,
    token
  );
}

export async function getDesignations() {
  const token = getToken();

  return apiRequest(
    `/master/designations/`,
    "GET",
    null,
    token
  );
}

export async function getDepartments() {
  const token = getToken();

  return apiRequest(
    `/master/departments/`,
    "GET",
    null,
    token
  );
}

export async function getEmeployementStatuses() {
  const token = getToken();

  return apiRequest(
    `/master/employment-status/`,
    "GET",
    null,
    token
  );
}