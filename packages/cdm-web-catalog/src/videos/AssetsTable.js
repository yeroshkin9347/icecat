import React, { useMemo } from "react";
import map from "lodash/map";
import join from "lodash/join";
import styled from "styled-components";
import {Padding, RoundedButton, Text} from "cdm-ui-components";
import Tooltip from '@mui/material/Tooltip'

import { withLocalization } from "../common/redux/hoc/withLocalization";
import Flag from "cdm-shared/component/Flag";
import get from "lodash/get";
import { Background } from "./AssetCard";
import DocumentIcon from "./DocumentIcon";
import Table from "cdm-shared/component/Table";
import { Download, Edit, RemoveShoppingCart, ShoppingCart } from '@mui/icons-material';
import { DARK } from 'cdm-shared/component/color';

const TableWrapper = styled.div`
  .ReactTable {
      border-radius: 0 !important;
      box-shadow: none !important;
  }
  .rt-thead {
      display: none !important;
  }
  .rt-tbody {
    gap: 1rem;

    .rt-tr-group {
      padding: 1rem;
      border-radius: 0.5rem;
      overflow: hidden;
      background: white;
      cursor: pointer;

      .rt-td {
        padding: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
        border-right: 0 !important;
        background: transparent;
      }
    }
  }
  .table-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;


const MIMEType = styled.div`
  width: fit-content;
  padding: 0.5rem 1rem;
  overflow: hidden;
  word-break: break-all;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const AssetsTable = ({
  assetType,
  assets,
  isExportable,
  basketAssets,
  translate,
  onEdit,
  onExport,
  onAddAssetToBasket,
  onRemoveAssetFromBasket,
}) => {
  const columns = useMemo(() => {
    const cols = [
      {
        Header: translate("video.table.title"),
        id: "preview",
        accessor: (d) => {
          const url = get(d, "thumbUrl") ||get(d, "prePictureSmallUri") || get(d, "publicUrl") || "";
          return (
            <Background
              height="50px"
              width="50px"
              cover
              src={url}
            >
              {assetType === 'document' && (
                <DocumentIcon asset={d} size={32} />
              )}
            </Background>
          );
        },
        width: 60
      },
      {
        Header: translate("video.table.title"),
        id: "title",
        accessor: (d) => <Text style={{ padding: "0.5rem", wordBreak: "break-all", whiteSpace: "normal", textAlign: "left" }}>{d.title}</Text>,
        // width: "10%"
      },
      {
        Header: translate("video.table.languages"),
        id: "languageCodes",
        accessor: (d) => (
          <>
            {map(d.languageCodes, (l, kLang) => (
              <Padding key={`banner-change-lang-${kLang}`}>
                <Flag code={l} />
              </Padding>
            ))}
          </>
        ),
        // width: "5%"
      },
      {
        Header: translate("video.table.mimeType"),
        id: "mimeType",
        accessor: (d) =>
          <Tooltip title={d.mimeType}>
            <MIMEType onClick={(e) => e.stopPropagation()}>{d.mimeType}</MIMEType>
          </Tooltip>,
      },
      {
        Header: translate("video.table.size"),
        id: "size",
        accessor: (d) => ((d.size || 0) / 1024).toFixed(2) + 'KB',
        // width: "10%"
      },
      {
        Header: translate("video.table.categories"),
        id: "videoCategories",
        accessor: (d) => join(d.categories.map((category) => translate(`video.meta.categories.${category}`)), ", "),
      },
    ];
    if (assetType === 'video') {
      cols.push({
        Header: translate("video.table.censors"),
        id: "censors",
        accessor: (d) => join(d.censors, ", "),
      });
    }
    if (assetType === 'image') {
      cols.push({
        Header: translate("video.table.index"),
        id: "index",
        accessor: "index",
      }, {
        Header: translate("video.table.resolution"),
        id: "resolution",
        accessor: (d) => `${d.width} x ${d.height}`,
      });
    }
    cols.push({
      Header: "Actions",
      id: "actions",
      accessor: (d) => {
        const isAddedToBasket = basketAssets.some((item) => item.id === d.id);
        return (
          <div class="table-actions">
            {/* Edit */}
            <RoundedButton
              style={{ marginRight: 0 }}
              onClick={e => {
                e.preventDefault();
                onEdit && onEdit(d);
              }}
              light
            >
              <Edit fontSize="small" sx={{ color: DARK }} />
            </RoundedButton>

            {/* Add to cart */}
            <RoundedButton
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                if (isAddedToBasket) {
                  onRemoveAssetFromBasket(d);
                } else {
                  onAddAssetToBasket(d);
                }
              }}
              light={!isAddedToBasket}
              danger={isAddedToBasket}
              style={{ marginRight: 0 }}
            >
              {
              isAddedToBasket ? (
                <RemoveShoppingCart fontSize="small" sx={{ color: "#fff" }} />
              ) : (
                <ShoppingCart fontSize="small" sx={{ color: DARK }} />
              )
            }
            </RoundedButton>

            {/* Export */}
            {isExportable && (
              <RoundedButton
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onExport && onExport();
                }}
                light
              >
                <Download fontSize="small" sx={{ color: DARK }} />
              </RoundedButton>
            )}
          </div>
        );
      },
      width: isExportable ? 120 : 80,
    });
    return cols;
  }, [assetType, basketAssets, isExportable, onAddAssetToBasket, onEdit, onExport, onRemoveAssetFromBasket, translate]);

  return (
    <TableWrapper>
      <Table
        columns={columns}
        data={assets}
        pageSize={assets.length || 5}
        showPagination={false}
        style={{ backgroundColor: "transparent" }}
        getTrProps={(_, row) => {
          return {
            onClick() {
              if (row?.original) {
                onEdit(row.original);
              }
            },
          };
        }}
      />
    </TableWrapper>
  );
};

export default withLocalization(AssetsTable, 'video');
