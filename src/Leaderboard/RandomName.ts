export function seedRandomUsername(id: string): string {
    const colors = ['Green', 'Red', 'Blue', 'Yellow'];
    const characters = ['Ninja', 'Dragon', 'Banana', 'Apple'];

    const colorIndex = id.split('-')[0].charCodeAt(0) % colors.length;
    const color = colors[colorIndex];

    const characterIndex = id.split('-')[1].charCodeAt(0) % characters.length;
    const character = characters[characterIndex];

    const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    return `${color}${character}${randomNumber}`;
}