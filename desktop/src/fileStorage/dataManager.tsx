import { read, write } from "fs";
import { LibraryEntry } from "../models/libraryEntry";

const fs = require('fs');

export const writeDataToFile = async (filename: string, data: string) => {
    try { 
        fs.writeFileSync(filename, data, 'utf-8'); 
    } catch(err) {
        console.error(err);
    }
}

export const readDataFromFile = (filename: string) => {
    try {
        const data = fs.readFileSync(filename, 'utf-8');
        //console.log(data);
        return JSON.parse(data);
    } catch(err) {
        console.error(err);
    }
}

export const replaceFileData = async (libraryFilename: string, newLibraryFilepath: string) => {
    try {
        const data = readDataFromFile(newLibraryFilepath);
        if(data){
            writeDataToFile(libraryFilename, JSON.stringify(data));
        }
        else throw new Error("data from library import is not valid");
        
    } catch(err) {
        console.log("something went wrong")
    }

}

