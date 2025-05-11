
// **Segment Interface**
export interface Segment {
    x: number;
    y: number;
    color: string;
    stroke: string;
    opacity?: number;
}

/**
 * Extract contiguous segments from score arrays
 * @param scoreArray - The array containing score values
 * @param threshold - The minimum value to extract as a segment
 * @param color - Segment fill color
 * @returns Array of Segment objects
 */
export function extractScoreSegments(scoreArray, threshold, color) {
    const segments: Segment[] = [];
    let inSegment = false;
    let start = 0;

    for (let i = 0; i < scoreArray.length; i++) {
        if (scoreArray[i] >= threshold) {
            if (!inSegment) {
                start = i;
                inSegment = true;
            }
        } else if (inSegment) {
            segments.push({ x: start + 1, y: i, color, stroke: "black" });
            inSegment = false;
        }
    }

    if (inSegment) {
        segments.push({ x: start + 1, y: scoreArray.length, color, stroke: "black" });
    }

    return segments;
}

/**
 * Extract contiguous segments from binary arrays
 * @param binaryArray - The array containing binary values (0,1,2)
 * @param targetValue - The value to extract as a segment
 * @param color - Segment fill color
 * @returns Array of Segment objects
 */
export function extractSegments(binaryArray: number[], targetValue: number, color: string): Segment[] {
    const segments: Segment[] = [];
    let inSegment = false;
    let start = 0;

    for (let i = 0; i < binaryArray.length; i++) {
        if (binaryArray[i] === targetValue) {
            if (!inSegment) {
                start = i;
                inSegment = true;
            }
        } else if (inSegment) {
            segments.push({ x: start + 1, y: i, color, stroke: "black" });
            inSegment = false;
        }
    }

    if (inSegment) {
        segments.push({ x: start + 1, y: binaryArray.length, color, stroke: "black" });
    }

    return segments;
}


/**
 * Converts an array of numerical scores into an array of coordinate points `{x, y}` 
 * for line plotting in FeatureViewer.
 *
 * @param {number[]} scoreArray - An array of numerical scores representing Y-values.
 * @returns {{x: number; y: number}[]} An array of objects, where each object contains an X (position) and Y (score) value.
 */
export function extractLines(scoreArray: number[]): { x: number; y: number }[] {
    return scoreArray.map((value, index) => ({
        x: index + 1,
        y: value
    }));
}


// **Rescaling for psi pred score**
export function psipredRescaleScores(scores) {
    // find min and max values in array
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    
    // apply min-max scaling
    return scores.map(value => 0.33 + ((value - min) / (max - min)) * (1 - 0.33));
}

// **Rescaling for mmseq score**
export function mmseqRescaleScores(scores) {
    // find min and max values in array
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    
    // apply min-max scaling
    return scores.map(value => (value - min) / (max - min));
}

// TODO: Potenitally overhaul --Ben
// Works for testing
// Sort and nested for loop bring complexity questions
export function lineColorSegments(data : {x: number; y: number;}[], segments: Segment[]): any {

    const colorData = data.map(point => ({...point, color: ""}));
    segments.sort((a, b) => a.x - b.x);

    let inSegment: boolean = false;
    let colorValue: string = "";
    for (let i = 0; i < colorData.length; i++){

        for (let segIndex = 0; segIndex < segments.length; segIndex++){

            if (colorData[i].x == segments[segIndex].x){
                inSegment = true;
                colorValue = segments[segIndex].color;
            }
    
            if (inSegment){
                colorData[i].color = colorValue;
            }
    
            if (colorData[i].x == segments[segIndex].y){
                inSegment == false;
            }

        }

    }
    return colorData;
}