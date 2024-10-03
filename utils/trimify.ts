export default function (input: string, length: number = 20): string {
    return input.length > length ? input.substring(0, length) + '...' : input;
}