export const getLocalizedValue = (property, flag, currentLang) => {
    if (property.name && property.name.values && property.name.values.length > 0) {
        if (flag === 'boolean') {
            return true;
        }
        const newProperty = property.name.values.filter(
            (p) => p.languageCode === currentLang
        );
        if (newProperty.length > 0) {
            return newProperty[0].value;
        }
        return property.code;
    } else {
        if (flag === "boolean") {
            return false;
        }
        return property.code;
    }
}
