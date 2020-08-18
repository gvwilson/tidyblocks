// ======================================================================
// These routines have been submitted to the simple-statistics library but not
// yet merged.  They are styled in accordance with SS conventions.
// ======================================================================

const stats = require('simple-statistics');

// ----------------------------------------------------------------------
// K-means clustering
// ----------------------------------------------------------------------

/**
 * Perform k-means clustering.
 *
 * @param {Array<Array<number>>} points N-dimensional coordinates of points to be clustered.
 * @param {number} numCluster How many clusters to create.
 * @param {Function} randomSource An optional entropy source that generates uniform values in [0, 1).
 * @returns {Array<number>, Array<Array<number>>} Labels (same length as data)
 * and centroids (XY coordinates, same length as numCluster).
 * @throws {Error} If any centroids wind up friendless (i.e., without associated points).
 */
function kMeansCluster(points, numCluster, randomSource = Math.random) {
    let oldCentroids = null;
    let newCentroids = generateInitialCentroids(
        points,
        numCluster,
        randomSource
    );
    let labels = null;
    let change = Number.MAX_VALUE;
    while (change !== 0) {
        labels = labelPoints(points, newCentroids);
        oldCentroids = newCentroids;
        newCentroids = calculateCentroids(points, labels, numCluster);
        change = calculateChange(newCentroids, oldCentroids);
    }
    return {
        labels: labels,
        centroids: newCentroids
    };
}

/**
 * Generate starting points for clusters by randomly selecting points.
 * @param {Array<Array<number>>} points Array of XY coordinates.
 * @param {number} num How many points to select.
 * @param {function} randomSource Generate uniform random values in [0, 1).
 * @returns {Array<Array<number>>} XY coordinates of centroids.
 */
function generateInitialCentroids(points, num, randomSource) {
    return stats.sample(points, num, randomSource);
}

/**
 * Label each point according to which centroid it is closest to.
 * @param {Array<Array<number>>} points Array of XY coordinates.
 * @param {Array<Array<number>>} centroids Current centroids.
 * @returns {Array<number>} Group labels.
 */
function labelPoints(points, centroids) {
    return points.map((p) => {
        let minDist = Number.MAX_VALUE;
        let label = -1;
        for (let i = 0; i < centroids.length; i++) {
            const dist = euclideanDistance(p, centroids[i]);
            if (dist < minDist) {
                minDist = dist;
                label = i;
            }
        }
        return label;
    });
}

/**
 * Calculate centroids for points given labels.
 * @param {Array<Array<number>>} points Array of XY coordinates.
 * @param {Array<number>} labels Which groups points belong to.
 * @param {number} numCluster Number of clusters being created.
 * @returns {Array<Array<number>>} Centroid for each group.
 * @throws {Error} If any centroids wind up friendless (i.e., without associated points).
 */
function calculateCentroids(points, labels, numCluster) {
    // Initialize accumulators.
    const dimension = points[0].length;
    const centroids = makeMatrix(numCluster, dimension);
    const counts = Array(numCluster).fill(0);

    // Add points to centroids' accumulators and count points per centroid.
    const numPoints = points.length;
    for (let i = 0; i < numPoints; i++) {
        const point = points[i];
        const label = labels[i];
        const current = centroids[label];
        for (let j = 0; j < dimension; j++) {
            current[j] += point[j];
        }
        counts[label] += 1;
    }

    // Rescale centroids, checking for any that have no points.
    for (let i = 0; i < numCluster; i++) {
        if (counts[i] === 0) {
            throw new Error(`Centroid ${i} has no friends`);
        }
        const centroid = centroids[i];
        for (let j = 0; j < dimension; j++) {
            centroid[j] /= counts[i];
        }
    }

    return centroids;
}

/**
 * Calculate the difference between old centroids and new centroids.
 * @param {Array<Array<number>>} left One list of centroids.
 * @param {Array<Array<number>>} right Another list of centroids.
 * @returns {number} Distance between centroids.
 */
function calculateChange(left, right) {
    let total = 0;
    for (let i = 0; i < left.length; i++) {
        total += euclideanDistance(left[i], right[i]);
    }
    return total;
}

// ----------------------------------------------------------------------
// Silhouette
// ----------------------------------------------------------------------

/**
 * Calculate the [silhouette values](https://en.wikipedia.org/wiki/Silhouette_(clustering))
 * for clustered data.
 * @param {Array<Array<number>>} points N-dimensional coordinates of points.
 * @param {Array<number>} labels Labels of points. This must be the same length as `points`,
 * and values must lie in [0..G-1], where G is the number of groups.
 * @returns {Array<number>} The silhouette value for each point.
 */
function silhouette(points, labels) {
    if (points.length !== labels.length) {
        throw new Error("must have exactly as many labels as points");
    }
    const numPoints = points.length,
          groupings = createGroups(labels),
          distances = calculateAllDistances(points);
    const result = [];
    for (let i = 0; i < numPoints; i++){
        let s = 0;
        if (groupings[labels[i]].length > 1) {
            const a = meanDistanceWithinGroup(i, labels, groupings, distances);
            const b = meanDistanceToNearestGroup(i, labels, groupings, distances);
            s = (b - a) / Math.max(a, b);
        }
        result.push(s);
    }
    return result;
}

/**
 * Create a lookup table mapping group IDs to point IDs.
 * @param {Array<number>} labels Labels of points. This must be the same length as `points`,
 * and values must lie in [0..G-1], where G is the number of groups.
 * @returns {Array<Array<number>>} An array of length G, each of whose entries is an array
 * containing the indices of the points in that group.
 */
function createGroups(labels) {
    const numLabels = labels.length,
          numGroups = 1 + Math.max(...labels),
          result = Array(numGroups);
    for (let i = 0; i < numLabels; i++){
        const label = labels[i];
        if (result[label] === undefined){
            result[label] = [];
        }
        result[label].push(i);
    }
    return result;
}

/**
 * Create a lookup table of all inter-point distances.
 * @param {Array<Array<number>>} points N-dimensional coordinates of points.
 * @returns {Array<Array<number>>} A symmetric square array of inter-point distances
 * (zero on the diagonal).
 */
function calculateAllDistances(points) {
    const numPoints = points.length,
          result = makeMatrix(numPoints, numPoints);
    for (let i = 0; i < numPoints; i++){
        for (let j = 0; j < i; j++){
            result[i][j] = euclideanDistance(points[i], points[j]);
            result[j][i] = result[i][j];
        }
    }
    return result;
}

/**
 * Calculate the mean distance between a point and other points in its group
 * (which is zero if the group only has one element).
 * @param {number} which The index of this point.
 * @param {Array<number>} labels Labels of points.
 * @param {Array<Array<number>>} groupings An array whose entries are arrays
 * containing the indices of the points in that group.
 * @param {Array<Array<number>>} distances A symmetric square array of inter-point
 * distances.
 * @returns {number} The mean distance from this point to others in its group.
 */
function meanDistanceWithinGroup(which, labels, groupings, distances) {
    return meanDistanceFromPointToGroup(which, groupings[labels[which]], distances);
}

/**
 * Calculate the mean distance between this point and all the points in the
 * nearest group (as determined by which point in another group is closest).
 * @param {number} which The index of this point.
 * @param {Array<number>} labels Labels of points.
 * @param {Array<Array<number>>} groupings An array whose entries are arrays
 * containing the indices of the points in that group.
 * @param {Array<Array<number>>} distances A symmetric square array of inter-point
 * distances.
 * @returns {number} The mean distance from this point to others in the nearest
 * group.
 */
function meanDistanceToNearestGroup(which, labels, groupings, distances) {
    const label = labels[which],
          numGroups = groupings.length;
    let result = Number.MAX_VALUE;
    for (let i = 0; i < numGroups; i++){
        if (i !== label){
            const d = meanDistanceFromPointToGroup(which, groupings[i], distances);
            if (d < result){
                result = d;
            }
        }
    }
    return result;
}

/**
 * Calculate the mean distance between a point and all the points in a group
 * (possibly its own).
 * @param {number} which The index of this point.
 * @param {Array<number>} group The indices of all the points in the group in
 * question.
 * @param {Array<Array<number>>} distances A symmetric square array of inter-point
 * distances.
 * @returns {number} The mean distance from this point to others in the
 * specified group.
 */
function meanDistanceFromPointToGroup(which, group, distances) {
    const groupSize = group.length;
    let total = 0.0;
    for (let i = 0; i < groupSize; i++){
        total += distances[which][group[i]];
    }
    return total / groupSize;
}

// ----------------------------------------------------------------------
// Utilities
// ----------------------------------------------------------------------

/**
 * Calculate Euclidean distance between two points.
 * @param {Array<number>} left First N-dimensional point.
 * @param {Array<number>} right Second N-dimensional point.
 * @returns {number} Distance.
 */
function euclideanDistance(left, right) {
    let sum = 0;
    for (let i = 0; i < left.length; i++) {
        const diff = left[i] - right[i];
        sum += diff * diff;
    }
    return Math.sqrt(sum);
}

/**
 * Create a new column x row matrix.
 *
 * @private
 * @param {number} columns
 * @param {number} rows
 * @return {Array<Array<number>>} matrix
 * @example
 * makeMatrix(10, 10);
 */
function makeMatrix(columns, rows) {
    const matrix = [];
    for (let i = 0; i < columns; i++) {
        const column = [];
        for (let j = 0; j < rows; j++) {
            column.push(0);
        }
        matrix.push(column);
    }
    return matrix;
}

// ----------------------------------------------------------------------
// Exports
// ----------------------------------------------------------------------

module.exports = {
  kMeansCluster,
  silhouette,
  silhouetteMetric
};
