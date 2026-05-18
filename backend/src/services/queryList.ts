import fs from 'node:fs/promises';
import Papa from 'papaparse';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import type { Request, Response, NextFunction } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ParseResult {
    data: string[][];
    errors: unknown[];
    meta: unknown;
}

const readCSV = (file: string, resolve: (value: ParseResult) => void, reject: (reason?: unknown) => void): void => {
    Papa.parse(file, {
        skipEmptyLines: true,
        transform: (val: string, col: number): string | undefined => {
            if (col !== 0) return val;
            return undefined;
        },
        complete: (results: ParseResult): void => {
            resolve(results);
        },
        error: (err: unknown): void => {
            reject(err);
        },
    });
};

const getQueryList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const p = join(__dirname, '../../misc/graph_kw.csv');
    const file = await fs.readFile(p, {
        encoding: 'utf-8',
    });

    const results = await new Promise<ParseResult>((resolve, reject) => {
        readCSV(file, resolve, reject);
    });

    const kwResults = {
        kw: results.data[0].splice(1),
        relationships: results.data.slice(1),
    };
    res.status(200).json(kwResults).end();
};

export default getQueryList;
