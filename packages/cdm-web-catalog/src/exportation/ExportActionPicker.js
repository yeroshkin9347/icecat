import React from "react";
import dotProps from "dot-prop-immutable";
import isEmpty from "lodash/isEmpty";
import find from "lodash/find";
import get from "lodash/get";
import { withLocalization } from "common/redux/hoc/withLocalization";
import withUser from "cdm-shared/redux/hoc/withUser";
import {
  getExportAuthorizedActions,
} from "cdm-shared/redux/hoc/withAuth";
import {
  Loader,
  Button,
  Row,
  Col,
  P,
  Select,
  Margin,
  Label,
  Padding,
} from "cdm-ui-components";
import withActionPicking from "./withActionPicking";
import { getFormatConfigurationById } from "cdm-shared/services/formatManagement";
import { getActionById } from "cdm-shared/services/export";
import PreComputingJobStatus from "./PreComputingJobStatus";
import { getCollections } from "cdm-shared/services/collection";
import LoaderOverlay from "cdm-shared/component/LoaderOverlay";
import { getDatePickerFormatByLocale } from "cdm-shared/redux/localization";
import TextField from "@mui/material/TextField";
import moment from "moment";
import { DatePicker } from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

// this component is self contained for reusability and its SOLID purpose
// i.e. only fetching export action that is going to be used for something (e.g. export of trade items)
class ExportActionPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedExportActionId: null,
      exportActionParams: this.props.exportActionParams || {},
      displayComparisonDate: false,
      preComputingActionId: null,
      collections: [],
    };
    this.exportActionChanged = this.exportActionChanged.bind(this);
  }

  // fetch export actions
  componentDidMount() {
    // from hoc withActionPicking
    this.props.fetchActions(
      getExportAuthorizedActions(this.props.getCurrentUser())
    );

    getCollections().then((res) => {
      const filterCollection = res.data?.find(({code}) => code === this.props.filterCollectionCode);

      this.setState({ collections: res.data, exportActionParams: {Collection: filterCollection} });
    });
  }

  // when an export action changes
  // + check if highlight date input field unlocking is relevant
  // + fetch precomputing job information
  exportActionChanged(action) {
    const { exportActionParams } = this.state;

    const newActionId = action ? action.id : null;
    this.setState({ selectedExportActionId: newActionId });

    if (newActionId === null) {
      // remove comparison date field & precomputing job
      this.setState({
        displayComparisonDate: false,
        exportActionParams: { ...exportActionParams, ComparisonDateFrom: null },
        preComputingActionId: null,
      });
    } else {
      this.setState({
        preComputingActionId: action.exportPreComputedTradeItemActionId,
      });

      // fetch the precomputed trade item action
      this.setState({
        isLoading: true,
      });
      getActionById(action.exportPreComputedTradeItemActionId)
        .then(async (preComputingActionRes) => {
          const preComputingAction = get(preComputingActionRes, "data");

          // get format information to know if a comparison date is relevant
          return getFormatConfigurationById(
            get(preComputingAction, "formatConfigurationId")
          ).then((res) => {
            if (get(res, "data.highlightDifferences"))
              this.setState({ displayComparisonDate: true });
            else this.setState({ displayComparisonDate: false });
          });
        })
        .finally(() => {
          this.setState({
            isLoading: false,
          });
        });
    }
  }

  render() {
    const {
      selectedExportActionId,
      exportActionParams,
      displayComparisonDate,
      preComputingActionId,
    } = this.state;

    const {
      exportActions,
      failedFetchActions,
      currentParsedLocaleCode,
    } = this.props;

    const { onSubmit, onCancel, translate } = this.props;

    const canChoose = !isEmpty(exportActions);

    if (failedFetchActions) return <P>{translate("export.meta.error")}</P>;

    if (!canChoose) return <Loader />;

    return (
      <>
        {this.state.isLoading && <LoaderOverlay />}
        <Row>
          <Col col>
            <P>{translate("export.form.chooseExportAction")}</P>
            <br />

            <Row>
              <Col col={12}>
                <Select
                  getOptionLabel={(o) => o.name}
                  getOptionValue={(o) => o.id}
                  placeholder=""
                  closeMenuOnSelect={true}
                  hideSelectedOptions={true}
                  value={find(
                    exportActions,
                    (action) => action.id === selectedExportActionId
                  )}
                  onChange={this.exportActionChanged}
                  options={exportActions}
                  classNamePrefix="cde-select"
                  className="cde-select"
                />
                <Padding top={2} />
              </Col>
            </Row>
            <br />

            {/* {selectedExportActionId && (!filters || !filters.collections) && (
              <ToysParameters
                user={user}
                values={exportActionParams}
                onChange={(newValues) =>
                  this.setState({ exportActionParams: newValues })
                }
              />
            )} */}

            <Row>
              {selectedExportActionId && (
                <Col
                  col={12}
                >
                  <Label block>{translate("export.form.collection")}</Label>
                  <Select
                    isClearable
                    simpleValue
                    value={get(exportActionParams, "Collection")}
                    getOptionLabel={(o) => o.name}
                    getOptionValue={(o) => o.id}
                    onChange={(o) =>
                      this.setState({
                        exportActionParams: dotProps.set(
                          exportActionParams,
                          "Collection",
                          o ? o : null
                        ),
                      })
                    }
                    options={this.state.collections}
                    classNamePrefix="cde-select"
                    className="cde-select"
                  />
                  <Padding top={4} />
                </Col>
              )}

              {/* Show the highlight options */}
              {displayComparisonDate && (
                <Col col={12}>
                  <Label block>
                    {translate("export.toysFilters.comparisonDateFrom")}
                  </Label>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      locale={currentParsedLocaleCode}
                      inputFormat={getDatePickerFormatByLocale()}
                      onChange={(d) =>
                        this.setState({
                          exportActionParams: dotProps.set(
                            exportActionParams,
                            "ComparisonDateFrom",
                            d ? moment(d).format("YYYY-MM-DD") : null
                          ),
                        })
                      }
                      value={get(exportActionParams, "ComparisonDateFrom")}
                      block
                      PopperProps={{
                        style: {
                          zIndex: 9999,
                        },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          className="form-field"
                          variant="filled"
                          size="small"
                          hiddenLabel
                          fullWidth
                        />
                      )}
                    />
                  </LocalizationProvider>
                  <Padding top={4} />
                </Col>
              )}
            </Row>
          </Col>
        </Row>

        <Margin bottom={4} />

        <Row>
          <Col center>
            {preComputingActionId && (
              <PreComputingJobStatus
                preComputingActionId={preComputingActionId}
                translate={translate}
              />
            )}
          </Col>
        </Row>

        <Margin bottom={4} />

        {/* Actions */}
        <Row>
          <Col right>
            {/* Cancel */}
            <Button
              light
              small
              onClick={(e) => {
                e.preventDefault();
                onCancel();
              }}
              className="btn btn-outline-dark text-uppercase"
            >
              {translate("export.form.cancel")}
            </Button>

            {/* Submit */}
            <Button
              primary
              shadow
              small
              style={{ marginRight: 0 }}
              onClick={(e) => {
                e.preventDefault();
                const preparedExportActionParams = {
                  ...exportActionParams,
                  CollectionIds: get(exportActionParams, "Collection.id") ? [get(exportActionParams, "Collection.id")] : null,
                  Collection: undefined,
                };
                selectedExportActionId &&
                  onSubmit(selectedExportActionId, preparedExportActionParams);
              }}
            >
              {translate("export.form.exportActionChosen")}
            </Button>
          </Col>
        </Row>
      </>
    );
  }
}

export default withLocalization(
  withUser(withActionPicking(ExportActionPicker))
);
