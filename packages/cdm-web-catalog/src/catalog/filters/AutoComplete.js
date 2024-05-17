import React from "react";
import styled, { css } from "styled-components";
import {
  Input,
  BackgroundImage,
  P,
  Tooltip,
  Text,
  Loader,
} from "cdm-ui-components";
import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import size from "lodash/size";
import noimage from "cdm-shared/assets/noimage.svg";
import debounce from "cdm-shared/utils/debounce";
import { Link } from "react-router-dom";
import { suggest } from "cdm-shared/services/product";
import { Search } from "@mui/icons-material";

const SuggestionRow = styled.div`
  min-width: 300px;
  display: block;
  text-align: left;
  height: 45px;
  overflow: hidden;
  margin-bottom: 10px;

  ${(props) =>
    props.selected &&
    css`
      background-color: #f5f5f5;
    `}
  :hover {
    background-color: #f5f5f5;
  }
`;
const SuggestionsContainer = styled.div`
  background-color: #fff;
  position: relative;
  overflow: hidden;
`;
const AutocompleteInput = styled(Input)`
  width: 100%;
  padding: 1em 1.3em;
  font-size: 1.2em;
  border: none !important;
  border-radius: 12.6em;
  box-shadow: 0 1px 6px 0 rgba(32, 33, 36, 0.28);
  z-index: 1;
  height: 3rem;
  background-color: #fff;
  &:focus {
    background-color: #fff;
  }
`;
const InputContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;

  transition: width 0.3s ease;
`;
const RightContainer = styled.div`
  position: absolute;
  right: 1.2rem;
  top: 0.8rem;
`;
const SearchIcon = styled(Search)`
  margin-top: -0.2em;
  cursor: pointer;
`;

const Suggestion = ({ suggestion }) => (
  <Link
    to={`/product/${suggestion.languageCode}/${suggestion.tradeItemId}`}
    style={{
      position: "relative",
      display: "block",
      textDecoration: "none",
      color: "inherit",
      textAlign: "left",
    }}
  >
    <BackgroundImage
      style={{
        position: "absolute",
        left: 0,
        top: 0,
      }}
      src={suggestion.tradeItemThumbnailImagePath || noimage}
      width="45px"
      height="45px"
      cover={!suggestion.tradeItemThumbnailImagePath}
    />

    <P
      style={{
        display: "inline-block",
        paddingLeft: "55px",
        width: "100%",
        verticalAlign: "top",
      }}
    >
      <Text bold>{suggestion.title}</Text>
      <Text uppercase small spaced>
        {suggestion.manufacturerName}
      </Text>
    </P>
  </Link>
);

class AutoComplete extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value:
        props.defaultValue === undefined || props.defaultValue === null
          ? ""
          : props.defaultValue,
      suggestions: [],
      loading: false,
      didInvalidate: false,
      selectedRowIndex: -1,
    };
    this._onChange = this._onChange.bind(this);
    this.suggest = this.suggest.bind(this);
    this.reset = this.reset.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.handleKeyPressed = this.handleKeyPressed.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.keyword !== this.props.keyword) {
      this.setState({ value: this.props.keyword || "" });
    }
  }

  suggest(force) {
    const { value, didInvalidate } = this.state;

    const { lang } = this.props;

    if (value !== "") {
      this.setState({ loading: true, selectedRowIndex: -1 });
      suggest(lang, value)
        .then((res) => {
          this.setState({
            suggestions: didInvalidate && !force ? [] : res.data || [],
            didInvalidate: false,
            loading: false,
          });
        })
        .catch((err) =>
          this.setState({
            loading: false,
            didInvalidate: false,
          })
        );
    }
  }

  _onChange = debounce((val) => this.suggest(), 250);

  changeValue(value) {
    this.setState({ value });
    this._onChange(value);
  }

  reset(invalidate, callback) {
    this.setState(
      {
        suggestions: [],
        didInvalidate: invalidate || false,
        loading: false,
        selectedRowIndex: -1,
        value: "",
      },
      () => callback && callback()
    );
    this.autocompleteInput.blur();
  }

  handleKeyPressed(e) {
    const { suggestions, selectedRowIndex } = this.state;
    const { onSelectRow } = this.props;

    // escape
    if (e.keyCode === 27) {
      e.preventDefault();
      e.stopPropagation();
      this.reset();
    }
    // enter
    if (e.keyCode === 13) {
      if (selectedRowIndex >= 0 && !isEmpty(suggestions)) {
        e.preventDefault();
        e.stopPropagation();
        this.reset();
        if (onSelectRow) onSelectRow(suggestions[selectedRowIndex]);
      }
    }
    // key up
    else if (e.keyCode === 38) {
      e.preventDefault();
      e.stopPropagation();
      if (selectedRowIndex < 0) return;
      this.setState({ selectedRowIndex: selectedRowIndex - 1 });
    }
    // key down
    else if (e.keyCode === 40) {
      e.preventDefault();
      e.stopPropagation();
      if (selectedRowIndex >= size(suggestions) - 1) return;
      this.setState({ selectedRowIndex: selectedRowIndex + 1 });
    }
  }

  submit(e) {
    e.preventDefault();

    const { value } = this.state;

    const { onSubmit } = this.props;

    this.reset(true, () => {
      onSubmit(value);
      this.setState({ value });
    });
  }

  render() {
    const { value, suggestions, selectedRowIndex, loading } = this.state;

    const { style, autoCompleteStyle } = this.props;

    return (
      <form onSubmit={this.submit}>
        <div>
          <Tooltip
            placement="bottom"
            visible={!isEmpty(suggestions)}
            useContext={true}
            appendTo="parent"
            interactive
            html={
              <SuggestionsContainer onClick={() => this.reset()}>
                {map(suggestions, (suggestion, suggestionKey) => (
                  <SuggestionRow
                    key={`suggestion-catalog-${suggestionKey}`}
                    selected={selectedRowIndex === suggestionKey}
                  >
                    <Suggestion suggestion={suggestion} />
                  </SuggestionRow>
                ))}
              </SuggestionsContainer>
            }
            // popperOptions={{
            //   modifiers: {
            //     addZIndex: {
            //       enabled: true,
            //       order: 810,
            //       fn: data => ({
            //         ...data,
            //         styles: {
            //           ...data.styles,
            //           zIndex: 2010
            //         }
            //       })
            //     }
            //   }
            // }}
          >
            <InputContainer style={style}>
              <AutocompleteInput
                style={autoCompleteStyle}
                ref={(c) => (this.autocompleteInput = c)}
                value={value}
                onKeyDown={this.handleKeyPressed}
                onFocus={(e) => {
                  // this.suggest(true)
                }}
                onChange={(e) => this.changeValue(e.target.value)}
                lg
              />
              <RightContainer>
                {loading && <Loader small />}
                {!loading && (
                  <SearchIcon
                    onClick={this.submit}
                    fontSize="large"
                  />
                )}
              </RightContainer>
            </InputContainer>
          </Tooltip>
        </div>
      </form>
    );
  }
}

export default AutoComplete;
