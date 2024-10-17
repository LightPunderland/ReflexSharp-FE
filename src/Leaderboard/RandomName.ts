export function seedRandomUsername(id: string): string {
    const colors = ['Green', 'Red', 'Blue', 'Yellow'];
    const characters = ['Ninja', 'Dragon', 'Banana', 'Apple'];

    const colorIndex = id.split('-')[0].charCodeAt(0) % colors.length;
    const color = colors[colorIndex];

    const characterIndex = id.split('-')[1].charCodeAt(0) % characters.length;
    const character = characters[characterIndex];

    let randomNumber = 0;
    for(let i = 0; i < 4;i++) {
        const indexChar = (id.split('-')[2].charCodeAt(i) % characters.length) % 10;
        randomNumber = (randomNumber * 10) + indexChar;
    }

    return `${color}${character}${randomNumber}`;
}