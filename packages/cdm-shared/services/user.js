import axios from "axios";
import get from "lodash/get";
import "./index";
import * as env from "cdm-shared/environment";

// Set the services URIs
//
const MANUFACTURER_CATALOG_URL = `${env.CDM_USER_URI}/api/manufacturer/ManufacturerCatalogUser`;
const GET_ALL_USERS = `${MANUFACTURER_CATALOG_URL}/all`;
const GET_GROUPS = `${MANUFACTURER_CATALOG_URL}/GetUserGroups`;
const GET_MULTIPLE = `${MANUFACTURER_CATALOG_URL}/GetMultiple`;
const CHANGE_PASSWORD = `${MANUFACTURER_CATALOG_URL}/changePassword`;

// Get user information
//
export const getUsers = () => axios.get(GET_ALL_USERS);

// Get multiple user information
//
export const getMultipleUsers = userIds =>
  axios.post(`${GET_MULTIPLE}`, userIds);

// Delete user
//
export const deleteUser = id =>
  axios.delete(`${MANUFACTURER_CATALOG_URL}/${id}`);

// Create user
//
export const createUser = user =>
  axios.post(`${MANUFACTURER_CATALOG_URL}`, { ...user });

// Update user
//
export const updateUser = user =>
  axios.put(`${MANUFACTURER_CATALOG_URL}/${get(user, "id")}`, { ...user });

// Get users groups
//
export const getUsersGroups = () => axios.get(GET_GROUPS);

// Change password
//
export const changeUserPassword = id => axios.put(`${CHANGE_PASSWORD}/${id}`);

