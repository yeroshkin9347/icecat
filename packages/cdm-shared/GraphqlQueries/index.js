
import { gql } from "@apollo/client";

export const GET_OFFERS_QUERY = gql`
  query GetOffers($skip: Int, $take: Int) {
    offers(skip: $skip, take: $take) {
      items {
        id
        order
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      totalCount
    }
  }
`;

export const GET_SUBSCRIPTIONS_QUERY = gql`
  query GetSubscriptions($skip: Int, $take: Int) {
    subscriptions(skip: $skip, take: $take) {
      items {
        id
        offerId
        manufacturerName
        manufacturerId
        offerId
        numberOfTradeItem {
          max
          min
        }
        numberOfConnector
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      totalCount
    }
  }
`;

export const GET_CONNECTIONS_QUERY = gql`
  query GetConnections($skip: Int, $take: Int) {
    connections(skip: $skip, take: $take) {
      items {
        id
        status
        releaseDate
        connectorId
        manufacturerId
        manufacturerName
        connectorName
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      totalCount
    }
  }
`;

export const GET_CONNECTORS_QUERY = gql`
  query GetConnectors($skip: Int, $take: Int) {
    connectors(skip: $skip, take: $take) {
      items {
        id
        name
        type
        retailerId
        retailerName
        targetMarketId
        targetMarketName
        status
        visibility
        sentByManufacturer
        releaseDate
        connectorId
        offerIds
        offerNames
        discontinuedDate
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      totalCount
    }
  }
`;
