import get from "lodash/get";

export const getDefaultActionSetValue = () => {
    return {
        name: null,
        sourcePropertyCode: null,
        propertyGroupId: null,
        orderedParametrizedActions: []
    };
};

export const getDefaultActionSet = () => {
    return {
        actionSet: getDefaultActionSetValue(),
        businessRuleSetId: null
    };
};

export const getDefaultBuiltInAction = () => {
    return {
        discriminator: "BuiltInActionViewModel",
        builtInActionDefinitionId: null,
        parameterValues: []
    };
};

export const isBuiltInAction = action =>
    get(action, "discriminator") === "BuiltInActionViewModel";
