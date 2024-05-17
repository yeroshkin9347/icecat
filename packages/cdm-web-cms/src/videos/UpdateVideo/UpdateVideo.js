import React, { useCallback, useEffect, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  getVideoById,
  getVideoByIdCms,
  getVideoCategoriesCms,
  getVideoCensorsCms,
  getVideoLanguagesCms,
  updateVideo,
} from "cdm-shared/services/videos";
import {
  Col,
  Container,
  Input,
  Label,
  VirtualizedSelect,
  Zone,
  Margin,
  Padding,
} from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { useState } from "react";
import { getTradeItemsCms } from "cdm-shared/services/product";
import { getRetailersWithIcecatIdForCms } from "cdm-shared/services/retailer";
import { compact, find, get, isArray, isObject } from "lodash";
import LoaderOverlay from "cdm-shared/component/LoaderOverlay";
import TradeItemSelector from "cdm-shared/component/tradeitem/TradeItemSelector";
import ActionRow from "./ActionRow";
import ProductsTable from "cdm-shared/component/product/ProductsTable";
import Sticky from "react-stickynode";
import styled from "styled-components";

const VideoContainer = styled.div`
  background-color: white;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
`;

const ContainerNoPadding = styled(Container)`
  padding-left: 0;
  padding-right: 0;
`; 

const ColNoPadding = styled(Col)`
  padding-left: 0;
  padding-right: 0;
`;

const productsTableActions = ["edit", "remove"];

const UpdateVideo = ({ translate }) => {
  let { id } = useParams();
  const history = useHistory();
  const [video, setVideo] = useState({});
  const [videoWithMetadata, setVideoWithMetadata] = useState({});
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [censorOptions, setCensorOptions] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [retailerOptions, setRetailerOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [languageCodes, setLanguageCodes] = useState([]);
  const [videoCategories, setVideoCategories] = useState([]);
  const [censors, setCensors] = useState([]);
  const [authorizedRetailers, setAuthorizedRetailers] = useState([]);
  const [tradeItems, setTradeItems] = useState([]);

  const [getTradeItemsCmsLoading, setTradeItemsCmsLoading] = useState(false);
  const [getRetailersAllLightForCMSLoading, setRetailersAllLightForCMSLoading] =
    useState(false);

  const tradeItemIds = useMemo(
    () => tradeItems.map((item) => item.tradeItemId),
    [tradeItems]
  );

  const goBack = () => {
    history.push("/videos");
  };

  const onChangeProperty = (property, value) => {
    setVideo({
      ...video,
      [property]: isArray(value) ? [...value] : value,
    });
  };

  const onSave = () => {
    setLoading(true);
    updateVideo({
      ...video,
      id: video.id,
      metadataId: video.id,
      videoCategories,
      censors: censors.map((censor) => censor.value),
      languageCodes,
      authorizedRetailers: (authorizedRetailers || []).map((retailer) =>
        isObject(retailer) ? retailer.id : retailer
      ),
      tradeItemIds: (tradeItems || []).map((tradeItem) =>
        isObject(tradeItem) ? tradeItem.tradeItemId : tradeItem
      ),
    })
      .then((res) => {
        if (res.status === 200) {
          goBack();
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      getVideoById(id).then((res) => {
        const videoData = res.data;
        setVideoWithMetadata(videoData);
      });
      getVideoByIdCms(id).then((res) => {
        const videoData = res.data;
        setVideo(videoData);
        setLanguageCodes(videoData.languageCodes || []);
        setVideoCategories(videoData.videoCategories || []);
        // setCensors(videoData.censors || []);

        setTradeItemsCmsLoading(true);
        getTradeItemsCms(videoData.tradeItemIds || [])
          .then((tradeItemsRes) => {
            const tradeItems = tradeItemsRes.map(
              (tradeItemRes) => tradeItemRes.data
            );
            setTradeItems([...tradeItems]);
          })
          .finally(() => setTradeItemsCmsLoading(false));

        setRetailersAllLightForCMSLoading(true);
        getRetailersWithIcecatIdForCms()
          .then((res) => {
            const retailers = res.data;
            setRetailerOptions([...retailers]);
            setAuthorizedRetailers(
              retailers.filter((retailer) =>
                (videoData.authorizedRetailers || []).includes(retailer.id)
              )
            );
          })
          .finally(() => setRetailersAllLightForCMSLoading(false));

        setLoading(false);
      });

      getVideoCategoriesCms().then((res) => {
        setCategoryOptions(res.data);
      });

      getVideoLanguagesCms().then((res) => {
        setLanguageOptions(res.data);
      });

      getVideoCensorsCms().then((res) => {
        const censorsMap = res.data;
        setCensorOptions(
          Object.keys(censorsMap).map((key) => ({
            value: key,
            label: censorsMap[key],
          }))
        );
      });
    }
  }, [id]);

  useEffect(() => {
    if (video && video.censors && censorOptions) {
      setCensors(
        compact(
          (video.censors || []).map((censor) => {
            const opt = find(censorOptions, { value: censor });
            return opt ? opt : { value: censor, label: censor };
          })
        )
      );
    }
  }, [video, censorOptions]);

  const onSelectTradeItem = useCallback((tradeItem) => {
    setTradeItems((prev) => [...prev, tradeItem]);
  }, []);

  const onDeselectTradeItem = useCallback((tradeItem) => {
    setTradeItems((prev) =>
      prev.filter((item) => item.tradeItemId !== tradeItem.tradeItemId)
    );
  }, []);

  return (
    <>
      {(loading ||
        getRetailersAllLightForCMSLoading ||
        getTradeItemsCmsLoading) && <LoaderOverlay />}

      <ContainerNoPadding fluid center>
        <ColNoPadding col={12}>
          <Zone>
            <Sticky innerZ={999} wd>
              <VideoContainer>
                <iframe
                  title={get(video, "title")}
                  width={600}
                  height={350}
                  frameBorder={0}
                  src={`https://video.cedemo.com/i/?prefer=html5&clID=4&div=cedemoPlayer&h=100%&noJQ=0&codeType=video&code=${get(
                    videoWithMetadata,
                    "externalId"
                  )}&w=100%&ratio=1.87&plType=VerticalList`}
                />
              </VideoContainer>
            </Sticky>
            <Padding vertical={2} />
            <Label block>{translate("video.table.title")}</Label>
            <Input
              onChange={(e) => onChangeProperty("title", e.target.value)}
              value={video.title}
              block
            />
            <br />

            <Label block>{translate("video.table.languages")}</Label>
            <VirtualizedSelect
              simpleValue
              isMulti
              placeholder=""
              closeMenuOnSelect={false}
              value={languageCodes}
              onChange={setLanguageCodes}
              options={languageOptions}
              classNamePrefix="react-select-full-height"
              className="react-select-full-height"
            />
            <br />

            <Label block>{translate("video.table.categories")}</Label>
            <VirtualizedSelect
              simpleValue
              isMulti
              placeholder=""
              closeMenuOnSelect={false}
              value={videoCategories}
              onChange={setVideoCategories}
              options={categoryOptions}
              classNamePrefix="react-select-full-height"
              className="react-select-full-height"
            />
            <br />

            <Label block>{translate("video.table.rating")}</Label>
            <VirtualizedSelect
              simpleValue
              isMulti
              placeholder=""
              closeMenuOnSelect={false}
              value={censors}
              onChange={setCensors}
              options={censorOptions}
              getOptionValue={(o) => get(o, "value")}
              getOptionLabel={(o) => get(o, "label") || o}
              classNamePrefix="react-select-full-height"
              className="react-select-full-height"
            />
            <br />

            <Label block>{translate("video.table.retailer")}</Label>
            <VirtualizedSelect
              simpleValue
              isMulti
              placeholder=""
              closeMenuOnSelect={false}
              value={authorizedRetailers}
              onChange={setAuthorizedRetailers}
              options={retailerOptions}
              getOptionValue={(o) => get(o, "id")}
              getOptionLabel={(o) => get(o, "name") || o}
              classNamePrefix="react-select-full-height"
              className="react-select-full-height"
            />
            <br />

            <Label block>{translate("video.table.tradeItems")}</Label>
            <TradeItemSelector
              mode="multi-select"
              placeholder={translate("menu.searchplaceholder")}
              selectedIds={tradeItemIds}
              onTradeItemSelected={onSelectTradeItem}
              onTradeItemDeselected={onDeselectTradeItem}
            />
            <Margin top={2} />
            <ProductsTable
              products={tradeItems}
              actions={productsTableActions}
              onRemoveRow={onDeselectTradeItem}
            />

            <ActionRow onUpdate={onSave} onCancel={goBack} />
          </Zone>
        </ColNoPadding>
      </ContainerNoPadding>
    </>
  );
};

export default withLocalization(UpdateVideo);
