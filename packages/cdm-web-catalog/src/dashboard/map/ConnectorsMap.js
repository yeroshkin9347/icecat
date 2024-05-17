import React, { useState, useMemo } from "react";
import map from "lodash/map";
import get from "lodash/get";
import reduce from "lodash/reduce";
import find from "lodash/find";
import { ComposableMap, ZoomableGroup, Geographies } from "react-simple-maps";
import { PUBLIC_URL } from "cdm-shared/environment";
import { Zone, Tooltip, H4 } from "cdm-ui-components";
import withTheme from "cdm-shared/redux/hoc/withTheme";
import { withLocalization } from "common/redux/hoc/withLocalization";
import CustomGeography from "./CustomGeography";
import Connectors from "./Connectors";
import { useStateValue } from "cdm-shared/hook/useStateValue";
import PrimaryLoader from "cdm-shared/component/PrimaryLoader";
import styled from "styled-components";

const ZoneStyled = styled(Zone)`
  padding: 4px;
`;

const initialState = {
  center: [0, 45],
  zoom: 2
};

const LoadingZone = () => (
  <Zone center>
    <PrimaryLoader />
  </Zone>
);

const isGeographySelected = (memoizedCountries, geography) =>
  get(memoizedCountries, geography.id) || false;

const ConnectorsMap = ({ translate }) => {
  const [state] = useState(initialState);

  const [{ connectors, loading }] = useStateValue();

  const [selectedCountryId, setSelectedCountryId] = useState(null);

  const { center, zoom } = state;

  // memoized values for perf increase
  const memoizedCountries = useMemo(
    () =>
      reduce(
        connectors,
        (results, value) => {
          return { ...results, [get(value, "key")]: true };
        },
        {}
      ),
    [connectors]
  );

  const memoizedSelectedConnectors = useMemo(
    () => find(connectors, c => get(c, "key") === selectedCountryId) || null,
    [connectors, selectedCountryId]
  );

  if (get(loading, "connectors")) return <LoadingZone />;

  return (
    <>
      <H4> { translate("dashboard.map.title") }</H4>
      <ZoneStyled noPadding>
        <Tooltip
          offset={[0, -200]}
          visible={memoizedSelectedConnectors !== null}
          followCursor={true}
          html={
            <Connectors
              selectedCountryId={selectedCountryId}
              connectors={memoizedSelectedConnectors}
            />
          }
        >
          <div
            style={{
              position: "relative",
              height: 0,
              paddingBottom: "50%",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
              }}
            >
              <ComposableMap
                projectionConfig={{
                  scale: 205
                }}
                style={{
                  width: "100%",
                  height: "auto"
                }}
              >
                <ZoomableGroup center={center} zoom={zoom}>
                  <Geographies
                    geography={`${PUBLIC_URL}/assets/js/world-50m.json`}
                  >
                    {(geographies, projection) =>
                      map(
                        geographies,
                        (geography, i) =>
                          geography.id !== "ATA" && (
                            <CustomGeography
                              key={`geography-${i}`}
                              cacheId={`geography-${i}`}
                              geography={geography}
                              projection={projection}
                              selected={isGeographySelected(
                                memoizedCountries,
                                geography
                              )}
                              setSelectedCountryId={setSelectedCountryId}
                            />
                          )
                      )
                    }
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>
            </div>
          </div>
        </Tooltip>
      </ZoneStyled>
    </>
  );
};

export default withTheme(withLocalization(ConnectorsMap));
