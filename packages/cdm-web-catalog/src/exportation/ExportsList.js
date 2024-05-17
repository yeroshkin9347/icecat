import React from "react";
import get from "lodash/get";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";
import size from "lodash/size";
import { Tag, Text, Tooltip, RoundedButton } from "cdm-ui-components";
import { getPagedActionsResults } from "cdm-shared/services/export";
import { formatDate, parseDate } from "cdm-shared/utils/date";
import Table from "cdm-shared/component/Table";
import { isManufacturer } from "cdm-shared/redux/hoc/withAuth";
import SendEmailModal from "./SendEmailModal";
import { CloudDownload, Mail, MoreHoriz } from "@mui/icons-material";
import { browserDownload } from "cdm-shared/utils/url";

class ExportsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      intervalId: null,
      timer: false,
      pageNumber: 0,
      pageSize: 12,
      results: [],
      total: 0,
      loading: false,
      sendingEmailRow: null,
    };
    this.getExportResultsActions = this.getExportResultsActions.bind(this);
    this.refreshExportResultsActions = this.refreshExportResultsActions.bind(
      this
    );
    this.clearTimer = this.clearTimer.bind(this);
  }

  componentDidMount() {
    this.refreshExportResultsActions(true);
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  clearTimer() {
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId);
      this.setState({
        intervalId: null,
        timer: false
      });
    }
  }

  getExportResultsActions(pageNumber, pageSize) {
    const pNumber = pageNumber || 0;
    const pSize = pageSize || 12;
    this.setState({
      pageNumber: pNumber,
      pageSize: pSize,
      loading: true
    });
    return getPagedActionsResults(pNumber, pSize)
      .then(res => {
        this.setState({ loading: false });
        return get(res, "data");
      })
      .catch(err => this.setState({ loading: false }));
  }

  refreshExportResultsActions(autoTimer, forceResetTimer) {
    if (autoTimer && (forceResetTimer || this.state.timer === false)) {
      this.setState({ timer: true }, () => {
        var intervalId = setInterval(
          () => this.refreshExportResultsActions(autoTimer),
          4000
        );
        this.setState({ intervalId });
      });
    }

    return this.getExportResultsActions(
      this.state.pageNumber,
      this.state.pageSize
    ).then(data => {
      if (
        autoTimer &&
        !find(get(data, "results", []), r => r.status === "InProgress")
      ) {
        this.clearTimer();
      }
      this.setState({
        results: get(data, "results", []),
        total: get(data, "total", 0)
      });
    });
  }

  onPageChanged(pageNumber) {
    this.setState({ pageNumber }, () =>
      this.refreshExportResultsActions(false, false)
    );
  }

  onLimitChanged(pageSize) {
    this.setState({ pageSize }, () =>
      this.refreshExportResultsActions(false, false)
    );
  }

  getMessage(status) {
    const { translate } = this.props;

    switch (status.statusCode) {
      case "PENDING":
        return translate("export.table.pendingStatus");
      case "MATRIX_GENERATION":
        return translate("export.table.matrixStatus");
      case "ERROR":
        return translate("export.table.errorStatus");
      case "ARCHIVE_SAVING_IN_PROGRESS":
        return translate("export.table.archiveProgressStatus");
      case "IMAGES_GENERATION_IN_PROGRESS":
        return translate("export.table.imagesProgressStatus", { ...status.additionalInformation });
      case "IMAGES_GENERATION":
        return translate("export.table.imageGenerationStatus");
      default:
        return "";
    }
  }

  setSendingEmailRow(actionResult) {
    this.setState({
      sendingEmailRow: actionResult,
    });
  }

  onCloseSendEmailModal(result) {
    if (result) {
      this.refreshExportResultsActions(false);
    }
    this.setSendingEmailRow(null);
  }

  downloadFile(actionResult) {
    const zipPath = get(actionResult, "output.ZipPath");
    const fileExtension = zipPath.split(".").pop();
    const actionName = get(actionResult, "actionName", "").replace(/ /g, "_");
    const fileName = `${actionName}_${formatDate(new Date(), "YYYYMMDD_HHmm")}.${fileExtension}`;

    browserDownload(zipPath, fileName);
  }

  render() {
    const {
      total,
      results,
      pageNumber,
      pageSize,
      sendingEmailRow,
    } = this.state;

    const { translate, user } = this.props;

    return (
      <>
        {/* Datatable */}
        <Table
          columns={[
            {
              Header: translate("export.table.status"),
              id: "status",
              className: "text-center",
              accessor: actionResult => (
                <Tag
                  noMargin
                  success={
                    get(actionResult, "status") === "Successful"
                  }
                  danger={
                    get(actionResult, "status") === "Failed"
                  }
                  info={
                    get(actionResult, "status") === "InProgress"
                  }
                >
                  {translate(
                    `export.actionExecutionResult.${get(
                      actionResult,
                      "status"
                    )}`
                  )}
                </Tag>
              )
            },
            {
              Header: translate("export.table.creationTimestamp"),
              id: "creationTimestamp",
              className: "text-center",
              accessor: actionResult => {
                const creationTimestamp = get(actionResult, "creationTimestamp");
                return creationTimestamp ? `${parseDate(creationTimestamp)} - ${formatDate(creationTimestamp, "HH[h]mm")}` : '';
              }
            },
            {
              Header: translate("export.table.actionName"),
              id: "actionName",
              accessor: actionResult => get(actionResult, "actionName")
            },
            {
              Header: translate("export.table.user"),
              id: "user",
              accessor: actionResult => (
                <>
                  {get(actionResult, "parameters.UserFirstName")}{" "}
                  {get(actionResult, "parameters.UserLastName")}
                </>
              )
            },
            {
              Header: translate("export.table.manufacturers"),
              show: !isManufacturer(user),
              id: "manufacturers",
              accessor: actionResult => {
                const filters =
                  get(actionResult, "parameters.Filters") &&
                  get(actionResult, "parameters.Filters") !== ""
                    ? JSON.parse(get(actionResult, "parameters.Filters"))
                    : null;
                const manufacturers = filters
                  ? get(filters, "Manufacturers")
                  : null;
                const joinedManufacturer = !isEmpty(manufacturers)
                  ? manufacturers.join(", ")
                  : null;
                return joinedManufacturer && size(manufacturers) > 2 ? (
                  <Tooltip interactive html={joinedManufacturer}>
                    <Text primary>{joinedManufacturer}</Text>
                  </Tooltip>
                ) : (
                  joinedManufacturer
                );
              }
            },
            {
              Header: translate("export.table.detailedStatus"),
              id: "detailedStatus",
              className: "text-center",
              accessor: actionResult =>
                !isEmpty(get(actionResult, "detailedStatus")) && (
                  <Tooltip
                    interactive
                    html={
                      this.getMessage(get(actionResult, "detailedStatus"))
                    }
                  >
                    <Text primary>{this.getMessage(get(actionResult, "detailedStatus"))}</Text>
                  </Tooltip>
                )
            },
            {
              Header: translate("export.table.collections"),
              id: "collections",
              className: "text-center",
              accessor: actionResult =>
                (get(actionResult, "parameters.CollectionCodes") || []).join(', ')
            },
            {
              Header: translate("export.table.errors"),
              id: "errors",
              className: "text-center",
              accessor: actionResult =>
                !isEmpty(get(actionResult, "errorMessages")) && (
                  <Tooltip
                    interactive
                    html={translate(
                      `errors.${get(actionResult, "errorMessages.0.message")}`
                    )}
                  >
                    <Text primary>Error</Text>
                  </Tooltip>
                )
            },
            {
              Header: translate("export.table.numberOfExportedTradeItems"),
              id: "numberOfExportedTradeItems",
              className: "text-center",
              accessor: actionResult =>
                get(actionResult, "output.NumberOfExportedTradeItems")
            },
            {
              Header: translate("export.table.actions"),
              id: "actions",
              className: "text-center",
              accessor: actionResult => {
                if (get(actionResult, "output.ZipPath"))
                  return (
                    <>
                      <RoundedButton
                        onClick={() => this.downloadFile(actionResult)}
                        primary
                        small
                      >
                        <CloudDownload style={{ fontSize: 14 }} />
                      </RoundedButton>
                      <RoundedButton
                        secondary
                        small
                        onClick={() => this.setSendingEmailRow(actionResult)}
                      >
                        <Mail style={{ fontSize: 14 }}/>
                      </RoundedButton>
                    </>
                  );
                if (get(actionResult, "status") === "InProgress")
                  return (
                    <MoreHoriz fontSize="large" style={{ cursor: "wait" }} />
                  );
                return "";
              }
            }
          ]}
          manual
          sortable={false}
          onPageSizeChange={size => this.onLimitChanged(pageNumber, size)}
          onPageChange={page => this.onPageChanged(page, pageSize)}
          pageSizeOptions={[12]}
          page={pageNumber}
          pages={Math.round(total / pageSize)}
          pageSize={pageSize}
          data={results}
          showPaginationTop={true}
          showPaginationBottom={false}
        />

        {sendingEmailRow && (
          <SendEmailModal
            actionResult={sendingEmailRow}
            translate={translate}
            onClose={this.onCloseSendEmailModal.bind(this)}
          />
        )}
      </>
    );
  }
}

export default ExportsList;
