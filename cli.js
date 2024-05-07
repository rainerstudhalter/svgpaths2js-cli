#!/usr/bin/env node
'use strict'

import { Option, program } from 'commander';
import fs from "fs";
import path from "path";
import isSvg from 'is-svg';
import { parse } from 'svgson';
import { pathThatSvg } from 'path-that-svg';
import { svgPathProperties } from "svg-path-properties";
import { inPlaceSort } from "fast-sort";

const getPaths = (node) => {
    let paths = [];
    if (node.name == 'path') {
        const d = node.attributes.d.replaceAll('\n', ' ');
        paths.push({id: node.attributes.id, d: d, l: Math.floor(new svgPathProperties(d).getTotalLength())});
    } else if (node.children && Array.isArray(node.children)) {
        // process the paths children recursively
        paths.push(...node.children.map(getPaths));
    }
    return paths;
}

program
    .description('Convert an entire svg to path elements, optionally sorted by ids, and output them to a json, js, or ts file')
    .argument('<input file>', 'svg input file to convert')
    .addOption(new Option('-f, --format <format>', 'output file format').choices(['json', 'js', 'ts']).default('json'))
    .addOption(new Option('-t, --type <type>', 'type of output data').choices(['array', 'object']).default('array'))
    .option('-a, --sort-ids-asc', 'sort paths by ids ascending')
    .option('-d, --sort-ids-desc', 'sort paths by ids descending')
    .action(async (inputFile, options) => {
        const filePath = path.parse(inputFile);
        const file = fs.readFileSync(inputFile);
        const fileData = file.toString();
        if (!isSvg(fileData)) {
            throw 'Invalid SVG';
        }

        // parse the svg file and convert all elements to paths
        const pathedSVG = await parse(await pathThatSvg(fileData));

        // get an array of paths
        const SVGpaths = getPaths(pathedSVG).flat(Infinity);

        // sort all paths by id
        if (options.sortIdsAsc) {
            inPlaceSort(SVGpaths).asc(p => p.id);
        } else if (options.sortIdsDesc) {
            inPlaceSort(SVGpaths).desc(p => p.id);
        }
        
        // prepend an optional outputstring
        let outputString = '';
        if (['js', 'ts'].indexOf(options.format) != -1) {
            outputString += 'export default ';
        }
        // create the output
        if (options.type == 'array') {
            outputString += JSON.stringify(SVGpaths, null, 4);
        } else if (options.type == 'object') {
            outputString += JSON.stringify(SVGpaths.reduce((o, node) => ({...o, [node.id]: {d: node.d, l: node.l}}), {}));
        }

        // save output file
        const outputPath = path.join(filePath.dir, filePath.name + '.' + options.format);
        fs.writeFileSync(outputPath, outputString);
    })

program.parse();