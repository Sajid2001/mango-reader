const fs = require('fs');

export const writeDataToFile = (filename: string, data: string) => {
    try { 
        fs.writeFileSync(filename, data, 'utf-8'); 
    } catch(err) {
        console.error(err);
    }
}

export const readDataFromFile = (filename: string) => {
    try {
        const data = fs.readFileSync(filename, 'utf-8');
        console.log(data);
        return JSON.parse(data);
    } catch(err) {
        console.error(err);
    }
}

