import axios from "axios";
import "./index";
import * as env from "cdm-shared/environment";

const BASE_URL = `${env.CDM_MESSAGING_SERVICE_URI}/api`;
export const HUB_URL = `${env.CDM_MESSAGING_SERVICE_URI}/messageHub`;

// MANUFACTURER API
//
export const getMessagesForManufacturerInbox = (
  pageNumber,
  pageSize,
  bodyLength,
  filters
) =>
  axios.get(
    `${BASE_URL}/Manufacturer/GetInboxMessages/${pageNumber}/${pageSize}/${bodyLength}`,
    {
      params: filters
    }
  );

export const getMessageDetailForManufacturerInbox = id =>
  axios.get(`${BASE_URL}/Manufacturer/GetMessageForInbox/${id}`);

export const getMessagesForManufacturerOutbox = (
  pageNumber,
  pageSize,
  bodyLength,
  filters
) =>
  axios.get(
    `${BASE_URL}/Manufacturer/GetOutboxMessages/${pageNumber}/${pageSize}/${bodyLength}`,
    {
      params: filters
    }
  );

export const getMessageDetailForManufacturerOutbox = id =>
  axios.get(`${BASE_URL}/Manufacturer/GetMessageForOutbox/${id}`);

export const createMessageByManufacturer = message =>
  axios.post(`${BASE_URL}/Manufacturer`, message);

export const getManufacturerMessagingTemplates = () =>
  axios.get(`${BASE_URL}/Manufacturer/GetTemplates`);

export const getManufacturerMessagingTemplate = id =>
  axios.get(`${BASE_URL}/Manufacturer/GetTemplate/${id}`);

// RETAILER API
//
export const getMessagesForRetailerInbox = (
  pageNumber,
  pageSize,
  bodyLength,
  filters
) =>
  axios.get(
    `${BASE_URL}/Retailer/GetInboxMessages/${pageNumber}/${pageSize}/${bodyLength}`,
    {
      params: filters
    }
  );

export const getMessageDetailForRetailerInbox = id =>
  axios.get(`${BASE_URL}/Retailer/GetMessageForInbox/${id}`);

export const getMessagesForRetailerOutbox = (
  pageNumber,
  pageSize,
  bodyLength,
  filters
) =>
  axios.get(
    `${BASE_URL}/Retailer/GetOutboxMessages/${pageNumber}/${pageSize}/${bodyLength}`,
    {
      params: filters
    }
  );

export const getMessageDetailForRetailerOutbox = id =>
  axios.get(`${BASE_URL}/Retailer/GetMessageForOutbox/${id}`);

export const createMessageByRetailer = message =>
  axios.post(`${BASE_URL}/Retailer`, message);

export const getRetailerMessagingTemplates = () =>
  axios.get(`${BASE_URL}/Retailer/GetTemplates`);

export const getRetailerMessagingTemplate = id =>
  axios.get(`${BASE_URL}/Retailer/GetTemplate/${id}`);

// CMS API
//
export const getMessagesForCmsInbox = (
  pageNumber,
  pageSize,
  bodyLength,
  filters
) =>
  axios.get(
    `${BASE_URL}/Cms/GetInboxMessages/${pageNumber}/${pageSize}/${bodyLength}`,
    {
      params: filters
    }
  );

export const getMessageDetailForCmsInbox = id =>
  axios.get(`${BASE_URL}/Cms/GetMessageForInbox/${id}`);

export const getMessagesForCmsOutbox = (
  pageNumber,
  pageSize,
  bodyLength,
  filters
) =>
  axios.get(
    `${BASE_URL}/Cms/GetOutboxMessages/${pageNumber}/${pageSize}/${bodyLength}`,
    {
      params: filters
    }
  );

export const getMessageDetailForCmsOutbox = id =>
  axios.get(`${BASE_URL}/Cms/GetMessageForOutbox/${id}`);

export const createMessageByCms = message =>
  axios.post(`${BASE_URL}/Cms`, message);

export const getCmsMessagingTemplates = () =>
  axios.get(`${BASE_URL}/Cms/GetTemplates`);

export const getCmsMessagingTemplate = id =>
  axios.get(`${BASE_URL}/Cms/GetTemplate/${id}`);

export const getCmsMessages = (pageNumber, pageSize, bodyLength, filters) =>
  axios.get(`${BASE_URL}/Cms/${pageNumber}/${pageSize}/${bodyLength}`, {
    params: filters
  });

export const getCmsMessage = id => axios.get(`${BASE_URL}/Cms/${id}`);
