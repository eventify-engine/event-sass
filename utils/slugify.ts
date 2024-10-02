export default function (slug: string): string {
    return slug.toLowerCase()
               .replace(/[^_a-z0-9\s]/g, '')
               .replace(/\s{2}/g, ' ')
               .replace(/[_\s]/g, '-');
}