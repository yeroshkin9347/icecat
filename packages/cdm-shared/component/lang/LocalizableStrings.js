import React, { useState, useEffect, useCallback } from "react";
import get from "lodash/get";
import map from "lodash/map";
import reduce from "lodash/reduce";
import findIndex from "lodash/findIndex";
import flattenDeep from "lodash/flattenDeep";
import uniq from "lodash/uniq";
import find from "lodash/find";
import size from "lodash/size";
import LanguageSelect from "./LanguageSelect";
import FlagIcon from "./FlagIcon";
import {
    Row,
    Label,
    Margin,
} from "cdm-ui-components";

import { DivWrap, InputWrap, TextareaWrap, LangWrapper } from "./styles";

// styles
const styles = {
    wrapper: {
        padding: "1.5rem 2rem",
        borderRadius: "3px",
        boxShadow:
            "rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px",
    },
    flag: {
        cursor: "pointer",
        marginRight: "1rem",
    },
};

// retrieve a translated value among all of the values
const getTranslatedValueIndex = (languageCode, input, property) => {
    const index = findIndex(
        get(input, `${property}.values`),
        (t) => get(t, "languageCode") === languageCode,
        null
    );
    return index === -1 ? size(get(input, `${property}.values`)) : index;
};
const resetPropertiesIndices = (languageCode, input, properties) => {
    let indices = {};
    properties.forEach((property) => {
        indices[property] = getTranslatedValueIndex(languageCode, input, property);
    });
    return indices;
};
const getCurrentLanguageCodes = (input, properties) => {
    return uniq(
        flattenDeep(
            map(properties, (property, propertyIndex) =>
                reduce(
                    get(input, `${property}.values`),
                    (result, curr) => {
                        return [...result, get(curr, "languageCode")];
                    },
                    []
                )
            )
        )
    );
};
const findLanguageByCode = (languageCode, languages) =>
    find(languages, (_l) => get(_l, "code") === languageCode) || null;

const CC = ({ component, ...otherProps }) =>
    component === "textarea" ? (
        <TextareaWrap {...otherProps} />
    ) : (
        <InputWrap {...otherProps} />
    );

const Boxed = ({
    styles,
    title,
    currentLanguageCodes,
    currentLanguageCode,
    selectedLanguage,
    languages,
    localizableStrings,
    propertiesIndices,
    labels,
    input,
    components,
    // functions
    onChange,
    onLanguageChanged,
}) => {
    return (
        <div style={styles.wrapper}>
            {title && <h5>{title}</h5>}

            <Label
                style={{
                    color: "#fff",
                    backgroundColor: "#161b33",
                    fontSize: 10,
                    padding: 3,
                    borderRadius: 5,
                }}
            >
                Localization:
            </Label>

            {/* Current languages */}
            <Row>
                <div className="form-group">
                    {map(currentLanguageCodes, (lc, lcIndex) => (
                        <FlagIcon
                            onClick={(l) => onLanguageChanged(lc)}
                            key={`tr-${lcIndex}`}
                            code={lc}
                            style={styles.flag}
                        />
                    ))}
                </div>
            </Row>

            {/* Choose language */}
            <div className="form-group" style={{ width: "80%" }}>
                <label>Language</label>
                <LanguageSelect
                    value={selectedLanguage}
                    isSearchable={true}
                    options={languages}
                    onChange={(l) => onLanguageChanged(get(l, "code"))}
                    getOptionLabel={(o) => get(o, "code")}
                    getOptionValue={(o) => get(o, "code")}
                />
            </div>

            {/* Iterate through properties */}
            {map(localizableStrings, (localizableString, locIndex) => {
                if (propertiesIndices[localizableString] < 0) return;

                return (
                    <div
                        key={`${localizableString}-${propertiesIndices[localizableString]}-${locIndex}`}
                        className="form-group"
                    >
                        <label>{get(labels, localizableString) || localizableString}</label>
                        <CC
                            component={get(components, localizableString) || null}
                            key={`c-${localizableString}-${propertiesIndices[localizableString]}-${locIndex}`}
                            value={
                                get(
                                    input,
                                    `[${localizableString}].values[${propertiesIndices[localizableString]}].value`
                                ) || ""
                            }
                            className="form-control"
                            onChange={(e) => {
                                onChange(localizableString, {
                                    values: Object.assign(
                                        [],
                                        get(input, `${localizableString}.values`) || [],
                                        {
                                            [propertiesIndices[localizableString]]: {
                                                languageCode: currentLanguageCode,
                                                value: e.currentTarget.value,
                                            },
                                        }
                                    ),
                                });
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
};

const Cameleon = ({
    width,
    styles,
    title,
    currentLanguageCodes,
    currentLanguageCode,
    selectedLanguage,
    languages,
    localizableStrings,
    propertiesIndices,
    labels,
    input,
    components,
    // functions
    onChange,
    onLanguageChanged,
}) => {
    return (
        <>
            <DivWrap>
                {title && <h5>{title}</h5>}

                <Label
                    style={{
                        color: "#fff",
                        backgroundColor: "#161b33",
                        fontSize: 10,
                        padding: 3,
                        borderRadius: 5,
                    }}
                >
                    Localization:
                </Label>

                {/* Current languages */}
                <LangWrapper>
                    {map(currentLanguageCodes, (lc, lcIndex) => (
                        <FlagIcon
                            onClick={() => onLanguageChanged(lc)}
                            key={`tr-${lcIndex}`}
                            code={lc}
                            style={styles.flag}
                        />
                    ))}
                </LangWrapper>

                {/* Choose language */}
                <div className="form-group d-inline-block" style={{ width: width || '80%' }}>
                    <LanguageSelect
                        value={selectedLanguage}
                        isSearchable={true}
                        options={languages}
                        onChange={(l) => onLanguageChanged(get(l, "code"))}
                        getOptionLabel={(o) => get(o, "code")}
                        getOptionValue={(o) => get(o, "code")}
                    />
                </div>
            </DivWrap>
            {/* Iterate through properties */}
            <div
                style={{
                    marginTop: "20px",
                    paddingLeft: "20px",
                    borderLeft: "1px solid #888",
                    flexDirection: "row",
                }}
            >
                {map(localizableStrings, (localizableString, locIndex) => {
                    if (propertiesIndices[localizableString] < 0) return;
                    return (
                        <>
                            <div
                                key={`${localizableString}-${propertiesIndices[localizableString]}-${locIndex}`}
                                className="form-group"
                            >
                                <Label>
                                    {get(labels, localizableString) || localizableString}
                                </Label>
                                <CC
                                    component={get(components, localizableString) || null}
                                    key={`c-${localizableString}-${propertiesIndices[localizableString]}-${locIndex}`}
                                    value={
                                        get(
                                            input,
                                            `[${localizableString}].values[${propertiesIndices[localizableString]}].value`
                                        ) || ""
                                    }
                                    className="form-control"
                                    style={{ width: "100%" }}
                                    onChange={(e) => {
                                        onChange(localizableString, {
                                            values: Object.assign(
                                                [],
                                                get(input, `${localizableString}.values`) || [],
                                                {
                                                    [propertiesIndices[localizableString]]: {
                                                        languageCode: currentLanguageCode,
                                                        value: e.currentTarget.value,
                                                    },
                                                }
                                            ),
                                        });
                                    }}
                                />
                            </div>
                        </>
                    );
                })}
            </div>
            <Margin bottom={4} />
        </>
    );
};

const MemoizedCameleon = React.memo(Cameleon);
const MemoizedBoxed = React.memo(Boxed);

const SharedLocalizableStrings = (props) => {
    // props passed from parent component
    const {
        width,
        input,
        title,
        localizableStrings,
        components,
        labels,
        languages,
        integrated,
    } = props;
    const { onChange } = props;

    // custom languages hook that encapsulate the languages retrieving logic
    const [currentLanguageCodes, setCurrentLanguageCodes] = useState(
        getCurrentLanguageCodes(input, localizableStrings)
    );
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [currentLanguageCode, setCurrentLanguageCode] = useState(
        get(selectedLanguage, "code")
    );
    const [propertiesIndices, setPropertiesIndices] = useState(
        reduce(
            localizableStrings,
            (result, k) => {
                return { ...result, [k]: -1 };
            },
            {}
        )
    );

    // callback functions
    const onLanguageChanged = useCallback(
        (languageCode) => {
            const l = findLanguageByCode(languageCode, languages);
            setSelectedLanguage(l);
            setPropertiesIndices(
                resetPropertiesIndices(get(l, "code"), input, localizableStrings)
            );
        },
        [input, languages, localizableStrings]
    );

    // calculated values
    useEffect(() => {
        setCurrentLanguageCode(get(selectedLanguage, "code"));
        if (selectedLanguage)
            setCurrentLanguageCodes((old) =>
                findIndex(old, (l) => l === get(selectedLanguage, "code")) > -1
                    ? old
                    : [...old, get(selectedLanguage, "code")]
            );
    }, [selectedLanguage]);

    useEffect(() => {
        if (
            !currentLanguageCode &&
            currentLanguageCodes.length > 0 &&
            languages.length > 0
        ) {
            onLanguageChanged(currentLanguageCodes[0]);
        }
    }, [languages, currentLanguageCodes, currentLanguageCode, onLanguageChanged]);

    useEffect(() => {
        if (
            !currentLanguageCode &&
            languages.length > 0 &&
            currentLanguageCodes.length === 0
        )
            setCurrentLanguageCodes(
                getCurrentLanguageCodes(input, localizableStrings)
            );
    }, [
        input,
        localizableStrings,
        currentLanguageCode,
        currentLanguageCodes.length,
        languages.length,
    ]);

    if (integrated)
        return (
            <MemoizedCameleon
                width={width || null}
                styles={styles}
                title={title}
                currentLanguageCodes={currentLanguageCodes}
                currentLanguageCode={currentLanguageCode}
                selectedLanguage={selectedLanguage}
                languages={languages}
                localizableStrings={localizableStrings}
                propertiesIndices={propertiesIndices}
                labels={labels}
                input={input}
                components={components}
                onChange={onChange}
                onLanguageChanged={onLanguageChanged}
            />
        );

    return (
        <MemoizedBoxed
            styles={styles}
            title={title}
            currentLanguageCodes={currentLanguageCodes}
            currentLanguageCode={currentLanguageCode}
            selectedLanguage={selectedLanguage}
            languages={languages}
            localizableStrings={localizableStrings}
            propertiesIndices={propertiesIndices}
            labels={labels}
            input={input}
            components={components}
            onChange={onChange}
            onLanguageChanged={onLanguageChanged}
        />
    );
};

export { SharedLocalizableStrings };
