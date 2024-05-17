import React from "react";
import {
  UploadZone,
  P,
  H5,
  Text,
  Button,
  Modal,
  Select,
  Row,
  Col,
  Loader,
} from "cdm-ui-components";
import Dropzone from "react-dropzone";
import get from "lodash/get";
import join from "lodash/join";
import map from "lodash/map";
import size from "lodash/size";
import isEmpty from "lodash/isEmpty";
import { withLocalization } from "common/redux/hoc/withLocalization";
import {
  getManufacturerEntities,
  triggerImport as triggerImportApi,
} from "./api";
import { PrimaryLink } from "cdm-shared/component/Link";
import withUser from "cdm-shared/redux/hoc/withUser";

const FILE_TYPES_ACCEPTED = [
  "text/plain",
  "text/xml",
  "application/json",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
  "application/vnd.ms-excel.sheet.macroEnabled.12",
  "application/vnd.ms-excel.template.macroEnabled.12",
  "application/vnd.ms-excel.addin.macroEnabled.12",
  "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
];

class ImportProducts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      manufacturerEntities: [],
      displayEntityChoser: false,
      selectedEntity: null,
      loading: false,
      success: false,
    };
    this.triggerImport = this.triggerImport.bind(this);
  }

  componentDidMount() {
    this.loadManufacturerEntities();
  }

  loadManufacturerEntities() {
    const { getCurrentUser } = this.props;

    getManufacturerEntities(getCurrentUser())().then((res) => {
      this.setState({
        manufacturerEntities: map(get(res, "data"), (o) => {
          return {
            id: get(o, "id"),
            name: get(o, "name"),
          };
        }),
      });
    });
  }

  import(entityId) {
    const { user } = this.props;
    const { file } = this.state;

    this.setState({ loading: true });
    triggerImportApi(user)(entityId, file)
      .then((res) => {
        this.setState({
          loading: false,
          success: true,
          file: null,
        });
      })
      .catch((err) => {
        this.setState({ loading: false });
        alert("Error");
      });
  }

  triggerImport(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const { manufacturerEntities } = this.state;

    if (size(manufacturerEntities) > 1) {
      this.setState({ displayEntityChoser: true });
    } else {
      this.import(get(manufacturerEntities, "[0].id"));
    }
  }

  render() {
    const {
      file,
      displayEntityChoser,
      manufacturerEntities,
      selectedEntity,
      loading,
      success,
    } = this.state;

    const { translate, height } = this.props;

    return (
      <>
        {/* Drop file zone */}
        <Dropzone
          onDrop={(accepted, rejected) =>
            !loading && this.setState({ file: get(accepted, "[0]", null) })
          }
          maxSize={100000000} // 100Mo
          accept={join(FILE_TYPES_ACCEPTED, ", ")}
        >
          {({
            getRootProps,
            getInputProps,
            isDragActive,
            isDragAccept,
            isDragReject,
            acceptedFiles,
          }) => {
            return (
              <UploadZone
                style={{
                  height: height || "400px",
                }}
                borderRadius
                isDragActive={isDragActive}
                isDragReject={isDragReject}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <P
                  style={{
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                  lead
                >
                  {loading && <Loader />}
                  {isDragReject && !loading && translate("uploadMatrix.reject")}
                  {!file &&
                    !loading &&
                    !isDragReject &&
                    isDragAccept &&
                    translate("uploadMatrix.drop")}
                  {!file &&
                    !loading &&
                    !isDragReject &&
                    !isDragAccept &&
                    translate("uploadMatrix.drag")}
                  {file && !loading && !isDragReject && (
                    <>
                      {get(file, "name")}
                      <br />
                      <Text small>
                        (
                        {Math.round((100 * get(file, "size", 0)) / 1000000) /
                          100}{" "}
                        {translate("uploadMatrix.mb")})
                      </Text>
                      <br />
                      <Button
                        onClick={this.triggerImport}
                        primary
                        noMargin
                        shadow
                      >
                        {translate("uploadMatrix.trigger")}
                      </Button>
                    </>
                  )}
                </P>
              </UploadZone>
            );
          }}
        </Dropzone>

        {displayEntityChoser && !isEmpty(manufacturerEntities) && (
          <Modal
            style={{ overflow: "initial" }}
            sm
            onClose={() => this.setState({ displayEntityChoser: false })}
          >
            <>
              <H5>{translate("uploadMatrix.selectEntity")}</H5>

              {/* Select entity */}
              <Select
                hideSelectedOptions={true}
                getOptionLabel={(o) => get(o, "name")}
                getOptionValue={(o) => get(o, "id")}
                placeholder=""
                value={selectedEntity}
                onChange={(val) => this.setState({ selectedEntity: val })}
                options={manufacturerEntities}
              />

              <br />
              <br />

              {/* Import selected entity */}
              {selectedEntity && (
                <Row>
                  <Col right>
                    <Button
                      onClick={(e) => {
                        this.import(get(selectedEntity, "id"));
                        this.setState({
                          displayEntityChoser: false,
                        });
                      }}
                      right
                      primary
                      noMargin
                    >
                      {translate("uploadMatrix.trigger")}
                    </Button>
                  </Col>
                </Row>
              )}
            </>
          </Modal>
        )}

        {success && (
          <Modal
            style={{ overflow: "initial" }}
            sm
            onClose={() => this.setState({ success: false })}
          >
            <>
              <H5>{translate("uploadMatrix.success")}</H5>

              <PrimaryLink to={this.props.importsLink}>
                {translate("uploadMatrix.seeImport")}
              </PrimaryLink>
            </>
          </Modal>
        )}
      </>
    );
  }
}

export default withUser(withLocalization(ImportProducts));
