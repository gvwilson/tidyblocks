export function isUrlData(data) {
    return 'url' in data;
}
export function isInlineData(data) {
    return 'values' in data;
}
export function isNamedData(data) {
    return 'name' in data && !isUrlData(data) && !isInlineData(data) && !isGenerator(data);
}
export function isGenerator(data) {
    return data && (isSequenceGenerator(data) || isSphereGenerator(data) || isGraticuleGenerator(data));
}
export function isSequenceGenerator(data) {
    return 'sequence' in data;
}
export function isSphereGenerator(data) {
    return 'sphere' in data;
}
export function isGraticuleGenerator(data) {
    return 'graticule' in data;
}
export const MAIN = 'main';
export const RAW = 'raw';
//# sourceMappingURL=data.js.map