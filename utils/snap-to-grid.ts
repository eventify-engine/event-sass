export default function (value: number, gridSize: number): number {
    return Math.round(value / gridSize) * gridSize;
};