import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Padding, Button, H5, Loader } from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import withUser from "cdm-shared/redux/hoc/withUser";
import {
  deleteCollectionPricing,
  getCollections,
} from "cdm-shared/services/collection";
import { updateUrl } from "cdm-shared/utils/url";
import { get } from "lodash";
import styled from "styled-components";
import { IconButton, Tooltip } from "@mui/material";
import { ModalStyled } from "cdm-shared/component/styled/modal/ModalStyled";
import { CdmDataGrid } from "cdm-shared/component/styled/datagrid";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { SinglePageLayout } from "styled-components/layout";
import { fullSearch } from "cdm-shared/services/product";

const LinkDanger = styled(Link)`
  color: rgb(210, 35, 77);
`;

class Collections extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      total: 0,
      loading: false,
      pageNumber: 0,
      pageSize: 20,
      intervalId: null,
      showPurgeConfirmation: false,
      deleteCollectionPricingLoading: false,
    };
  }

  componentDidMount() {
    const { filters, pageSize, pageNumber } = this.state;
    this.search(pageNumber, pageSize, filters);
  }

  search(pageNumber, pageSize, filters) {
    this.setState({
      loading: true,
      filters,
    });

    getCollections({
      pageNumber,
      pageSize,
    })
      .then(async (res) => {
        updateUrl(filters);
        const data = get(res, "data");
        const productCounts = await this.getProductCounts();
        const results = data.map((d) => ({
          ...d,
          productCount: productCounts[d.code],
        }));

        this.setState({
          loading: false,
          results,
          total: get(res, "data").length,
          pageNumber,
          pageSize,
        });
      })
      .catch((err) => this.setState({ loading: false }));
  }

  reload() {
    this.setState({
      loading: true,
    });
    const { pageSize, pageNumber } = this.state;
    getCollections({
      pageNumber,
      pageSize,
    })
      .then(async (res) => {
        const data = get(res, "data");
        const productCounts = await this.getProductCounts();
        const results = data.map((d) => ({
          ...d,
          productCount: productCounts[d.code],
        }));

        this.setState({
          loading: false,
          results,
          total: get(res, "data").length,
        });
      })
      .catch((err) => this.setState({ loading: false }));
  }

  getProductCounts = async () => {
    const { currentLocaleCode } = this.props;
    return new Promise((resolve) => {
      fullSearch(currentLocaleCode, 0)
        .then((res) => {
          resolve(get(res, "data.collections") ?? {});
        })
        .catch(() => {
          resolve({});
        });
    });
  };

  deleteCollectionPricingHandler = () => {
    const { collectionToPurePrice } = this.state;
    this.setState({
      deleteCollectionPricingLoading: true,
    });
    deleteCollectionPricing(collectionToPurePrice)
      .then((res) => {
        this.setState({
          showPurgeConfirmation: false,
          collectionToPurePrice: null,
        });
        this.reload();
      })
      .finally(() => {
        this.setState({
          deleteCollectionPricingLoading: false,
        });
      });
  };

  render() {
    const {
      results,
      total,
      pageNumber,
      pageSize,
      filters,
      loading,
      showPurgeConfirmation,
    } = this.state;
    const { translate } = this.props;
    const columns = [
      {
        field: "name",
        headerName: translate("collections.table.collectionName"),
        flex: 2,
      },
      {
        field: "code",
        headerName: translate("collections.table.collectionCode"),
        flex: 2,
      },
      {
        field: "productCount",
        headerName: translate("collections.table.numberOfProducts"),
        flex: 1,
      },
      {
        headerName: translate("collections.table.actions"),
        sortable: false,
        sortingOrder: false,
        pinnable: false,
        renderCell: (params) => {
          return (
            <>
              <Link to={"collections/" + params.row.id}>
                <Tooltip
                  arrow
                  enterDelay={0}
                  leaveDelay={0}
                  placement="left"
                  title={translate("collections.table.manage")}
                >
                  <IconButton
                    color="primary"
                    size="large"
                    aria-label="View collection details"
                    sx={{
                      padding: 0.5,
                    }}
                  >
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </Link>
              <Padding horizontal={1} />
              {!!params.row.productCount && (
                <LinkDanger
                  onClick={() =>
                    this.setState({
                      showPurgeConfirmation: true,
                      collectionToPurePrice: params.row.id,
                    })
                  }
                >
                  <Tooltip
                    arrow
                    enterDelay={0}
                    leaveDelay={0}
                    placement="left"
                    title={translate("collections.table.purgePrice")}
                  >
                    <IconButton
                      color="error"
                      size="large"
                      aria-label="Purge collection price"
                      sx={{
                        padding: 0.5,
                      }}
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                </LinkDanger>
              )}
            </>
          );
        },
      },
    ];

    return (
      <>
        <SinglePageLayout
          title={translate("collections.title")}
          subtitle={translate("collections.subtitle")}
          breadcrumbs={[
            { title: translate("header.nav.home"), route: "/" },
            { title: translate("collections.title") },
          ]}
        >
          <CdmDataGrid
            rows={results}
            disableColumnMenu
            columns={columns}
            loading={loading}
            checkboxSelection={false}
            rowSelection={false}
            pageSizeOptions={[20, 50, 100, 200]}
            onPaginationModelChange={(params) => {
              this.search(params.page, params.pageSize, filters);
            }}
            paginationModel={{
              pageSize: pageSize,
              page: pageNumber,
            }}
            rowCount={total}
            paginationMode="server"
          />
        </SinglePageLayout>

        {showPurgeConfirmation && (
          <ModalStyled sm>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <H5>{translate("collections.purgePriceConfirmation")}</H5>
              <Padding vertical={3} />
              <div style={{ display: "flex" }}>
                {this.state.deleteCollectionPricingLoading ? (
                  <Loader />
                ) : (
                  <>
                    <Button
                      small
                      danger
                      onClick={() => {
                        this.deleteCollectionPricingHandler();
                      }}
                    >
                      {translate("collections.yes")}
                    </Button>
                    <Padding horizontal={2} />
                    <Button
                      small
                      onClick={() =>
                        this.setState({
                          showPurgeConfirmation: false,
                          collectionToPurePrice: null,
                        })
                      }
                    >
                      {translate("collections.no")}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </ModalStyled>
        )}
      </>
    );
  }
}

export default withRouter(withUser(withLocalization(Collections)));
