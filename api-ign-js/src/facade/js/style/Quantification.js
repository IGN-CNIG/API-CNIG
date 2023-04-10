/**
 * @module M/style/quantification
 */

/**
 * @constant
 * @type {number}
 */
const DEFAULT_CLASS_JENKS = 5;

/**
 * @constant
 * @type {number}
 */
const DEFAULT_CLASS_QUANTILE = 5;

/**
 * @constant
 * @type {number}
 */
const DEFAULT_CLASS_EQUAL_INTERVAL = 5;


/**
 * @constant
 * @type {number}
 */
const DEFAULT_CLASS_MEDIA_SIGMA = 5;

/**
 * @constant
 * @type {number}
 */
const DEFAULT_CLASS_ARITHMETIC_PROGRESSION = 5;

/**
 * @constant
 * @type {number}
 */
const DEFAULT_CLASS_GEOMETRIC_PROGRESSION = 5;

/**
 * This function takes an array and creates a unique element array with it.
 * @function
 * @private
 * @param {Array} array - array of elements
 * @return {Array}
 */
const uniqueArray = (array) => {
  const uniqueArrayParam = [];
  array.forEach((elem) => {
    if (uniqueArrayParam.indexOf(elem) === -1) {
      uniqueArrayParam.push(elem);
    }
  });
  return uniqueArrayParam;
};

/**
 * This function checks if the serie contains negative value
 * @function
 * @private
 * @param {Array} array - array of elements
 * @return {boolean}
 */
const hasNegativeValue = (array) => {
  for (let i = 0; i < array.length; i += 1) {
    if (array[i] < 0) return true;
  }
  return false;
};

/**
 * This function checks if the serie contains zero value
 * @function
 * @private
 * @param {Array} array - array of elements
 * @return {boolean}
 */
const hasZeroValue = (array) => {
  for (let i = 0; i < array.length; i += 1) {
    if (parseFloat(array[i]) === 0) return true;
  }
  return false;
};

/**
 * This function returns mean value
 * @function
 * @private
 * @param {Array} array - array of elements
 */
const meanFn = (array) => {
  let sum = 0;
  let mean = 0;
  for (let i = 0; i < array.length; i += 1) {
    sum += parseFloat(array[i]);
  }
  mean = parseFloat(sum / array.length);
  return mean;
};

/**
 * This function returns standard deviation value
 * @function
 * @private
 */
const stddevFn = (array) => {
  let tmp = 0;
  const mean = meanFn(array);
  for (let i = 0; i < array.length; i += 1) {
    tmp += ((array[i] - mean) ** 2);
  }
  const stddev = Math.sqrt(tmp / array.length);
  return stddev;
};


/**
 *  Compute the matrices required for Jenks breaks. These matrices
 * can be used for any classing of data with `classes <= n_classes`
 * @function
 */
const getMatrices = (data, numberClasses) => {
  // in the original implementation, these matrices are referred to
  // as `LC` and `OP`
  //
  // * lower_class_limits (LC): optimal lower class limits
  // * variance_combinations (OP): optimal variance combinations for all classes
  const lowerClassLimits = [];
  const varianceCombinations = [];
  // the variance, as computed at each step in the calculation
  let variance = 0;

  // Initialize and fill each matrix with zeroes
  for (let i = 0; i < data.length + 1; i += 1) {
    const tmp1 = [];
    const tmp2 = [];
    for (let j = 0; j < numberClasses + 1; j += 1) {
      tmp1.push(0);
      tmp2.push(0);
    }
    lowerClassLimits.push(tmp1);
    varianceCombinations.push(tmp2);
  }

  for (let i = 1; i < numberClasses + 1; i += 1) {
    lowerClassLimits[1][i] = 1;
    varianceCombinations[1][i] = 0;
    // in the original implementation, 9999999 is used but
    // since Javascript has `Infinity`, we use that.
    for (let j = 2; j < data.length + 1; j += 1) {
      varianceCombinations[j][i] = Infinity;
    }
  }

  for (let l = 2; l < data.length + 1; l += 1) {
    // `SZ` originally. this is the sum of the values seen thus
    // far when calculating variance.
    let sum = 0;
    let sumSquares = 0;
    let w = 0;
    let i4 = 0;

    // in several instances, you could say `Math.pow(x, 2)`
    // instead of `x * x`, but this is slower in some browsers
    // introduces an unnecessary concept.
    for (let m = 1; m < l + 1; m += 1) {
      // `III` originally
      const lowerClassLimit = (l - m) + 1;
      const val = data[lowerClassLimit - 1];

      // here we're estimating variance for each potential classing
      // of the data, for each potential number of classes. `w`
      // is the number of data points considered so far.
      w += 1;

      // increase the current sum and sum-of-squares
      sum += val;
      sumSquares += val * val;

      // the variance at this point in the sequence is the difference
      // between the sum of squares and the total x 2, over the number
      // of samples.
      variance = sumSquares - ((sum ** 2) / w);

      i4 = lowerClassLimit - 1;

      if (i4 !== 0) {
        for (let j = 2; j < numberClasses + 1; j += 1) {
          // if adding this element to an existing class
          // will increase its variance beyond the limit, break
          // the class at this point, setting the lowerClassLimit
          // at this point.
          if (varianceCombinations[l][j] >=
            (variance + varianceCombinations[i4][j - 1])) {
            lowerClassLimits[l][j] = lowerClassLimit;
            varianceCombinations[l][j] = variance +
              varianceCombinations[i4][j - 1];
          }
        }
      }
    }

    lowerClassLimits[l][1] = 1;
    varianceCombinations[l][1] = variance;
  }

  // return the two matrices. for just providing breaks, only
  // `lower_class_limits` is needed, but variances can be useful to
  // evaluage goodness of fit.
  return {
    lowerClassLimits,
    varianceCombinations,
  };
};

/**
 * This function take the calculated matrices
 * and derive an array of n breaks.
 * @function
 * @private
 */
const jenksBreaks = (data, lowerClassLimits, nClasses) => {
  let k = data.length - 1;
  const kclass = [];
  let countNum = nClasses;

  // the calculation of classes will never include the upper and
  // lower bounds, so we need to explicitly set them
  kclass[nClasses] = data[data.length - 1];
  kclass[0] = data[0];

  // the lowerClassLimits matrix is used as indexes into itself
  // here: the `k` variable is reused in each iteration.
  while (countNum > 1) {
    kclass[countNum - 1] = data[lowerClassLimits[k][countNum] - 2];
    k = lowerClassLimits[k][countNum] - 1;
    countNum -= 1;
  }

  return kclass;
};

/** This function returns a jenks quantification function
 * @function
 * @public
 * @param {number} n_classes_param - Number of classes
 * @return {function}
 * @api
 */
export const JENKS = (numberClassesParam) => {
  let numberClasses = numberClassesParam;
  numberClasses = numberClasses || DEFAULT_CLASS_JENKS;

  const jenksFn = (data, nclassesParam = numberClasses) => {
    const uniqueData = uniqueArray(data);
    const nclasses = uniqueData.length <= nclassesParam ? uniqueData.length - 1 : nclassesParam;
    // sort data in numerical order, since this is expected
    // by the matrices function
    data.sort((a, b) => {
      return a - b;
    });

    // get our basic matrices
    const matrices = getMatrices(data, nclasses);
    // we only need lower class limits here
    const lowerClassLimits = matrices.lowerClassLimits;

    // extract nclasses out of the computed matrices
    const breaks = jenksBreaks(data, lowerClassLimits, nclasses);
    // No cogemos el minimo
    const breakPoints = breaks.slice(1, breaks.length);
    return breakPoints;
  };

  Object.defineProperty(jenksFn, 'name', {
    value: 'jenks',
  });

  return jenksFn;
};

/** This function returns a quantile quantification function
 * @function
 * @public
 * @param {number} n_classes_param - Number of classes
 * @return {function}
 * @api
 */
export const QUANTILE = (nclasses) => {
  const nClassesDefault = nclasses || DEFAULT_CLASS_QUANTILE;
  const quantileFn = (data, nclassesParam = nClassesDefault) => {
    const uniqueData = uniqueArray(data);
    const nClasses = uniqueData.length <= nclassesParam ? uniqueData.length - 1 : nclassesParam;
    const numData = data.length;
    data.sort((a, b) => a - b);

    // Calculamos el salto para calcular los puntos de ruptura
    const step = numData / nClasses;
    const breaks = [];
    for (let i = 0; i < nClasses; i += 1) {
      let partition = data.slice(i * step, (i + 1) * step);
      if (i === nClasses - 1) {
        partition = data.slice(i * step);
      }
      const breakPoint = step % 1 === 0 ? partition.slice(-1)[0] : partition.slice(0)[0];
      if (i !== 0 || step % 1 === 0) breaks.push(breakPoint);
    }
    if (step % 1 !== 0) breaks.push(data[data.length - 1]);
    return breaks;
  };

  Object.defineProperty(quantileFn, 'name', {
    value: 'quantile',
  });
  return quantileFn;
};

/** This function returns a equal interval quantification function
 * @function
 * @public
 * @param {number} n_classes_param - Number of classes
 * @return {function}
 * @api
 */
export const EQUAL_INTERVAL = (nclasses) => {
  const nClassesDefault = nclasses || DEFAULT_CLASS_EQUAL_INTERVAL;
  const equalFn = (data, nclassesParam = nClassesDefault) => {
    const uniqueData = uniqueArray(data);
    const nClasses = uniqueData.length <= nclassesParam ? uniqueData.length - 1 : nclassesParam;
    data.sort((a, b) => a - b);
    const min = data[0];
    const max = data[data.length - 1];
    const step = (max - min) / nClasses;
    const breaks = [];
    let breakPoint = min;
    for (let i = 0; i < nClasses; i += 1) {
      breakPoint += step;
      if (i === nClasses - 1) {
        breakPoint = max;
      }
      breaks.push(breakPoint);
    }
    return breaks;
  };

  Object.defineProperty(equalFn, 'name', {
    value: 'equal_interval',
  });
  return equalFn;
};

/** This function returns a quantification function based in media-sigma
 * @function
 * @public
 * @param {number} n_classes_param - Number of classes
 * @return {function}
 * @api
 */
export const MEDIA_SIGMA = (nclasses) => {
  const nClassesDefault = nclasses || DEFAULT_CLASS_MEDIA_SIGMA;
  const mediasigmaFn = (data, nclassesParam = nClassesDefault) => {
    const uniqueData = uniqueArray(data);
    const nClasses = uniqueData.length <= nclassesParam ? uniqueData.length - 1 : nclassesParam;
    data.sort((a, b) => a - b);
    const max = data[data.length - 1];
    const min = data[0];

    const stddev = stddevFn(data);

    const mean = meanFn(data);
    const breaks = [];

    if (nClasses % 2 === 1) {
      const infBound = Math.floor(nClasses / 2);
      const supBound = infBound + 1;

      breaks[infBound] = mean - stddev;
      breaks[supBound] = mean + stddev;

      for (let i = infBound - 1; i > 0; i -= 1) {
        breaks[i] = breaks[i + 1] - stddev;
      }

      for (let i = supBound + 1; i < nClasses; i += 1) {
        breaks[i] = breaks[i - 1] + stddev;
      }
    } else {
      const meanBound = nClasses / 2;

      breaks[meanBound] = mean;

      for (let i = meanBound - 1; i > 0; i -= 1) {
        breaks[i] = breaks[i + 1] - stddev;
      }

      for (let i = meanBound + 1; i < nClasses; i += 1) {
        breaks[i] = breaks[i - 1] + stddev;
      }
    }
    breaks[0] = min;
    breaks[nClasses] = max;
    const breakPoints = breaks.slice(1, breaks.length + 1);
    return breakPoints;
  };

  Object.defineProperty(mediasigmaFn, 'name', {
    value: 'media_sigma',
  });
  return mediasigmaFn;
};

/** This function returns a arithmetic progression quantification function
 * @function
 * @public
 * @param {number} n_classes_param - Number of classes
 * @return {function}
 * @api
 */
export const ARITHMETIC_PROGRESSION = (nclasses) => {
  const nClassesDefault = nclasses || DEFAULT_CLASS_ARITHMETIC_PROGRESSION;
  const arithmeticFn = (data, nclassesParam = nClassesDefault) => {
    const uniqueData = uniqueArray(data);
    const nClasses = uniqueData.length <= nclassesParam ? uniqueData.length - 1 : nclassesParam;
    data.sort((a, b) => a - b);
    let denominator = 0;

    for (let i = 1; i <= nClasses; i += 1) {
      denominator += i;
    }
    const min = data[0];
    const max = data[data.length - 1];
    const step = (max - min) / denominator;
    const breaks = [];
    let breakPoint = min;

    for (let i = 1; i <= nClasses; i += 1) {
      breakPoint += (i * step);
      if (i === nClasses) {
        breakPoint = max;
      }
      breaks.push(breakPoint);
    }
    return breaks;
  };

  Object.defineProperty(arithmeticFn, 'name', {
    value: 'arithmetic_progression',
  });
  return arithmeticFn;
};

/** This function returns a geometric progression quantification function
 * @function
 * @public
 * @param {number} n_classes_param - Number of classes
 * @return {function}
 * @api
 */
export const GEOMETRIC_PROGRESSION = (nclasses) => {
  const nClassesDefault = nclasses || DEFAULT_CLASS_GEOMETRIC_PROGRESSION;
  const geometricFn = (data, nclassesParam = nClassesDefault) => {
    const uniqueData = uniqueArray(data);
    if (hasNegativeValue(uniqueData) || hasZeroValue(uniqueData)) {
      return [];
    }
    const nClasses = uniqueData.length <= nclassesParam ? uniqueData.length - 1 : nclassesParam;
    data.sort((a, b) => a - b);
    const min = data[0];
    const max = data[data.length - 1];
    const logMin = Math.log(min) / Math.LN10;
    const logMax = Math.log(max) / Math.LN10;
    const step = (logMax - logMin) / nClasses;
    const breaks = [];
    let breakPoint = logMin;

    for (let i = 1; i < nClasses; i += 1) {
      breakPoint += step;
      breaks.push((10 ** breakPoint));
    }
    breaks.push(max);
    return breaks;
  };

  Object.defineProperty(geometricFn, 'name', {
    value: 'geometric_progression',
  });
  return geometricFn;
};
