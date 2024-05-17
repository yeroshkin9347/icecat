import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Autocomplete } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { getAssetTags } from "../../../services/resource";
import { Col, Label, Row } from "cdm-ui-components";
import TradeProperty from "../properties/TradeProperty";
import { get } from "lodash";

const MediaTagsEdit = ({ property, tagIds = [], onChange, disabled }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    setLoading(true);
    const response = await getAssetTags();
    const tags = response.data || [];
    setOptions(
      tags.map((tag) => ({
        label: get(tag, "localizedName.value", ""),
        id: tag.id,
      }))
    );
    setLoading(false);
  }, []);

  return (
    <Row>
      <Col>
        <Label
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <TradeProperty property={property} showTooltip />
        </Label>

        <Autocomplete
          disablePortal
          disabled={disabled}
          multiple
          autoComplete
          includeInputInList
          open={open}
          value={options.filter((option) => tagIds.includes(option.id))}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          options={options}
          loading={loading}
          onChange={(e, v) => {
            onChange(v);
          }}
          getOptionLabel={(o) => o.label || ""}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              className="form-field"
              InputProps={{
                ...params.InputProps,
                style: {
                  paddingTop: 6,
                  paddingBottom: 6,
                },
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
              variant="filled"
              size="small"
              hiddenLabel
              fullWidth
            />
          )}
        />
      </Col>
    </Row>
  );
};

export default MediaTagsEdit;
