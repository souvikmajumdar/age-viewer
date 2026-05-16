import fs from 'node:fs/promises';
import Papa from 'papaparse';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const readCSV = (file, resolve, reject)=>{
    return Papa.parse(file, {
        skipEmptyLines:true,
        transform:(val, col)=>{
            if (col !== 0) return val;

        },
        complete:(results)=>{
            resolve(results);
        },
        error:(err)=>{
            reject(err);
        },
    });
}
const getQueryList = async (req, res, next)=>{
    const p = join(__dirname, "../../misc/graph_kw.csv");
    const file = await fs.readFile(p, {
        encoding: 'utf-8'
    });

    const results = await new Promise((resolve, reject)=>{
        readCSV(file, resolve, reject);
    });

    const kwResults = {
        kw:results.data[0].splice(1),
        relationships:results.data.slice(1)
    }
    res.status(200).json(kwResults).end();

}

export default getQueryList;
