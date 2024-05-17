const isRgb = colorspace =>
  colorspace === "sRGB" ||
  colorspace === "RGB" ||
  colorspace === "scRGB" ||
  colorspace === 21 ||
  colorspace === 22 ||
  colorspace === 23;

const isUndefinedColorspace = (colorspace) => colorspace === "Undefined";


export { isRgb, isUndefinedColorspace };
