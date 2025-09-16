import { FeatureViewer } from "../FeatureViewerTypeScript/src/feature-viewer";
import { extractSegments, extractLines, Segment, extractScoreSegments, psipredRescaleScores, mmseqRescaleScores, lineColorSegments} from "../utils/utils";
import '../feature-constructor.scss';

declare var inputValues: string;

// Split lines into array
const lines: string[] = inputValues.split('\n');
const sequence: string = lines[1]?.trim() || "";


// **Disorder Data**
const rawDisorderBinary: string = lines[30]?.trim() || "";
const rawVSLBinary: string = lines[2]?.trim() || "";
const rawVSLScore: string = lines[3]?.trim() || "";

const disorderBinary: number[] = rawDisorderBinary ? Array.from(rawDisorderBinary, Number) : [];
const vslBinary: number[] = rawVSLBinary ? Array.from(rawVSLBinary, Number) : [];
const vslScore: number[] = rawVSLScore ? rawVSLScore.trim().split(',').map(val => parseFloat(val)) : [];

// **ASA Panel Data**
const rawRSABinary: string = lines[32]?.trim() || "";
const rawRSAScore: string = lines[33]?.trim() || "";
const rawASABinary: string = lines[14]?.trim() || "";
const rawASAScore: string = lines[15]?.trim() || "";

const rsaBinary: number[] = rawRSABinary ? Array.from(rawRSABinary, Number) : [];
const rsaScore: number[] = rawRSAScore ? rawRSAScore.trim().split(',').map(val => parseFloat(val)) : [];
const asaBinary: number[] = rawASABinary ? Array.from(rawASABinary, Number) : [];
const asaScore: number[] = rawASAScore ? rawASAScore.trim().split(',').map(val => parseFloat(val)) : [];

//--------------------------------------------------------------------------------------------------------

// **Sec.Struc Panel Data**

const rawSECSSBinary: string = lines[31]?.trim() || "";
const SECSSBinary: number[] = rawDisorderBinary ? Array.from(rawSECSSBinary, Number) : [];

const rawPsiPredBinary: string = lines[4]?.trim() || "";
const PsiPredBinary: number[] = rawDisorderBinary ? Array.from(rawPsiPredBinary, Number) : [];


if (lines[5] != "NULL"){
    var rawHelixScore: string = lines[5]?.trim() || "";
    var rawStrandScore: string = lines[6]?.trim() || "";

    var HelixScore: number[] = rawHelixScore ? rawHelixScore.trim().split(',').map(val => parseFloat(val)) : [];
    var StrandScore: number[] = rawStrandScore ? rawStrandScore.trim().split(',').map(val => parseFloat(val)) : [];  

}else{
    //TODO: Check this functionality
    var HelixScore: number[] = null;
    var StrandScore: number[] = null;
}

//Plddt Scores in  case of AF results
var rawCoilScore: string = lines[7]?.trim() || "";
var CoilScore: number[] = rawCoilScore ? rawCoilScore.trim().split(',').map(val => parseFloat(val)) : [];


let PsiPredScore  = [];

//TODO: THIS CAN BE FUNCKY; LOOK INTO IT 
const  SecStructScoresConcat = [CoilScore, StrandScore, HelixScore];
//const  SecStructScoresConcat = [HelixScore, StrandScore, CoilScore];

if (HelixScore !=  null){
    PsiPredScore = SecStructScoresConcat.reduce(function(final, current) {
        for (var i = 0; i < final.length; ++i) {
            if (current[i] > final[i]) {
            final[i] = current[i];
            }
        }
        return final;
        });
}else{
    //TODO: Determine if this is best way to clone array for use case
    for (var b = 0; b < CoilScore.length; b++){
        PsiPredScore[b] = CoilScore[b];
    }
}

//--------------------------------------------------------------------------------------------------------

// **Conservation Panel Data**
const rawmmseqBinary: string = lines[8]?.trim() || "";
const rawmmseqScore: string = lines[9]?.trim() || "";

const mmseqBinary: number[] = rawmmseqBinary ? Array.from(rawmmseqBinary, Number) : [];
const mmseqScore: number[] = rawmmseqScore ? rawmmseqScore.trim().split(',').map(val => parseFloat(val)) : [];


// **Protein Binding Data**
const rawDisoRDPbindBinary: string = lines[24]?.trim() || "";    
const rawScriberBinary: string = lines[26]?.trim() || "";  
const rawMorfChibiBinary: string = lines[28]?.trim() || "";  

const scriberBinary: number[] = rawScriberBinary ? Array.from(rawScriberBinary, Number) : [];
const disoRDPbindBinary: number[] = rawDisoRDPbindBinary ? Array.from(rawDisoRDPbindBinary, Number) : [];
const morfChibiBinary: number[] = rawMorfChibiBinary ? Array.from(rawMorfChibiBinary, Number) : [];

const disoRDPbindScore: number[] = lines[25] ? lines[25].trim().split(',').map(val => parseFloat(val)) : [];
const scriberScore: number[] = lines[27] ? lines[27].trim().split(',').map(val => parseFloat(val)) : [];
const morfChibiScore: number[] = lines[29] ? lines[29].trim().split(',').map(val => parseFloat(val)) : [];


// **Linker Data**
const rawLinkerBinary: string = lines[12]?.trim() || "";
const rawLinkerScore: string = lines[13]?.trim() || "";

const linkerBinary: number[] = rawLinkerBinary ? Array.from(rawLinkerBinary, Number) : [];
const linkerScore: number[] = rawLinkerScore.split(',').map(val => parseFloat(val) || 0);


// ** CALCULATING DATA **

// **Disorder panel**
const nativeDisorderColor: Segment[] = extractSegments(disorderBinary, 1, "#2da02c"); // assigned color for data exists
const nativeDisorderGrey: Segment[] = extractSegments(disorderBinary, 2, "grey"); // Grey overlay for not available data

// This is to plot the available and unavailable data at the same line
const mergedNativeDisorder: Segment[] = [
    ...nativeDisorderColor.map(s => ({ ...s, color: "#2da02c"})),
    ...nativeDisorderGrey.map(s => ({ ...s, color: "grey"}))
];

const putativeDisorder: Segment[] = extractSegments(vslBinary, 1, "#76fd63");


// **RSA panel**
const nativeRSABinaryColor: Segment[] = extractSegments(rsaBinary, 1, "#fc0080"); // assigned color for available RSA data
const nativeRSABinaryGrey: Segment[] = extractSegments(rsaBinary, 2, "grey"); // Grey for not available RSA data

// This is to plot the available and unavailable data at the same line
const mergedRSABinary: Segment[] = [
    ...nativeRSABinaryColor.map(s => ({ ...s, color: "#fc0080" })),
    ...nativeRSABinaryGrey.map(s => ({ ...s, color: "grey" }))
];

// Extract line data
const vslScoreData = extractLines(vslScore);

// line data for RSA Score
const rsaLines =  extractLines(rsaScore);
const rsaSegment: Segment[] = extractScoreSegments(rsaScore, 0, "#fc0080");
const mergedRSA: Segment[] = [
    ...rsaSegment.map(s => ({ ...s, color: "#fc0080"})),
];
const rsaScoreData = lineColorSegments(rsaLines, mergedRSA);

// line data for ASA Score
const asaLines =  extractLines(asaScore);
const asaSegment: Segment[] = extractScoreSegments(asaScore, 0, "#ffd2df");
const mergedASA: Segment[] = [
    ...asaSegment.map(s => ({ ...s, color: "#ffd2df"})),
];
const asaScoreData = lineColorSegments(asaLines, mergedASA);

// Extract ASA and RSA Binary Data
const buriedResiduesResults: Segment[] = extractSegments(asaBinary, 1, "#ffd2df");

// **Conservation Panel**
const conv_0_residues: Segment[] = extractSegments(mmseqBinary, 0, "#f0f3f5");
const conv_1_residues: Segment[] = extractSegments(mmseqBinary, 1, "#f0f3f5");
const conv_2_residues: Segment[] = extractSegments(mmseqBinary, 2, "#d1dae0");
const conv_3_residues: Segment[] = extractSegments(mmseqBinary, 3, "#b3c2cb");
const conv_4_residues: Segment[] = extractSegments(mmseqBinary, 4, "#95aab7");
const conv_5_residues: Segment[] = extractSegments(mmseqBinary, 5, "#7691a2");
const conv_6_residues: Segment[] = extractSegments(mmseqBinary, 6, "#5d7889");
const conv_7_residues: Segment[] = extractSegments(mmseqBinary, 7, "#485d6a");
const conv_8_residues: Segment[] = extractSegments(mmseqBinary, 8, "#34434c");
const conv_9_residues: Segment[] = extractSegments(mmseqBinary, 9, "#1f282e");

// Plotting all conservation levels on the same line
const mergedConservationLevels: Segment[] = [
    ...conv_0_residues.map(s => ({ ...s, color: "#f0f3f5"})),
    ...conv_1_residues.map(s => ({ ...s, color: "#f0f3f5"})),
    ...conv_2_residues.map(s => ({ ...s, color: "#d1dae0"})),
    ...conv_3_residues.map(s => ({ ...s, color: "#b3c2cb"})),
    ...conv_4_residues.map(s => ({ ...s, color: "#95aab7"})),
    ...conv_5_residues.map(s => ({ ...s, color: "#7691a2"})),
    ...conv_6_residues.map(s => ({ ...s, color: "#5d7889"})),
    ...conv_7_residues.map(s => ({ ...s, color: "#485d6a"})),
    ...conv_8_residues.map(s => ({ ...s, color: "#34434c"})),
    ...conv_9_residues.map(s => ({ ...s, color: "#1f282e"})),
];

// Rescale then extract mmseq score line data
const mmseqScoreRescaled = mmseqRescaleScores(mmseqScore);
const mmseqScoreData = extractLines(mmseqScoreRescaled);

// **Protein Panel**
const disoRDPbindSegments: Segment[] = extractSegments(disoRDPbindBinary, 1, "#3d7afd");
const morfChibiSegments: Segment[] = extractSegments(morfChibiBinary, 1, "#01889f");
const scriberSegments: Segment[] = extractSegments(scriberBinary, 1, "#3b5b92");

// line data for disoRDPbind Score
const disoRDPbindLines =  extractLines(disoRDPbindScore);
const disoRDPbindSegment: Segment[] = extractScoreSegments(disoRDPbindScore, 0, "#3d7afd");
const mergeddisoRDPbind: Segment[] = [
    ...disoRDPbindSegment.map(s => ({ ...s, color: "#3d7afd"})),
];
const disoRDPbindScoreData = lineColorSegments(disoRDPbindLines, mergeddisoRDPbind);

// line data for scriber Score
const scriberLines =  extractLines(scriberScore);
const scriberSegment: Segment[] = extractScoreSegments(scriberScore, 0, "#3b5b92");
const mergedScriber: Segment[] = [
    ...scriberSegment.map(s => ({ ...s, color: "#3b5b92"})),
];
const scriberScoreData = lineColorSegments(scriberLines, mergedScriber);

// line data for morfChibi Score
const morfChibiLines =  extractLines(morfChibiScore);
const morfChibiSegment: Segment[] = extractScoreSegments(morfChibiScore, 0, "#01889f");
const mergedMorfChibi: Segment[] = [
    ...morfChibiSegment.map(s => ({ ...s, color: "#01889f"})),
];
const morfChibiScoreData = lineColorSegments(morfChibiLines, mergedMorfChibi);

// **Linker Panel**
const linkerSegments: Segment[] = extractSegments(linkerBinary, 1, "#ff9408");
const linkerScoreData = extractLines(linkerScore);

// SECSSBinary Data to Segment
const SECSSBinaryHelix: Segment[] = extractSegments(SECSSBinary, 1, "#cf6275");
const SECSSBinaryStrand: Segment[] = extractSegments(SECSSBinary, 2, "#fffd01");
const SECSSBinaryCoil: Segment[] = extractSegments(SECSSBinary, 3, "#25a36f");
const SECSSBinaryUnavailable: Segment[] = extractSegments(SECSSBinary, 0, "#c0c0c0"); 

const mergedSECSSBinary: Segment[] = [
    ...SECSSBinaryHelix.map(s => ({ ...s, color: "#cf6275"})),
    ...SECSSBinaryStrand.map(s => ({ ...s, color: "#fffd01"})),
    ...SECSSBinaryCoil.map(s => ({ ...s, color: "#25a36f"})),
    ...SECSSBinaryUnavailable.map(s => ({ ...s, color: "#c0c0c0"})),
];

//Psi Binary Data to Segment
const PsiPrepBinaryHelix: Segment[] = extractSegments(PsiPredBinary, 0, "#cf6275");
const PsiPrepBinaryStrand: Segment[] = extractSegments(PsiPredBinary, 1, "#fffd01");
const PsiPrepBinaryCoil: Segment[] = extractSegments(PsiPredBinary, 2, "#25a36f");
//For unknown assignment from DSSP on AF-derived structures
const PsiPrepBinaryUnavailable: Segment[] = extractSegments(PsiPredBinary, 3, "#c0c0c0"); 

//TODO: Is SS_Code value X needed from original?

const mergedPsiPrepBinary: Segment[] = [
    ...PsiPrepBinaryHelix.map(s => ({ ...s, color: "#cf6275"})),
    ...PsiPrepBinaryStrand.map(s => ({ ...s, color: "#fffd01"})),
    ...PsiPrepBinaryCoil.map(s => ({ ...s, color: "#25a36f"})),
    ...PsiPrepBinaryUnavailable.map(s => ({ ...s, color: "#c0c0c0"})),
];

// Rescale SecStruct Scores
//  TODO: Consider round to two digits like Python code
//  Could impact performance to have library round it
const PsiPredScoreRescaled = psipredRescaleScores(PsiPredScore);
const PsiPredScoreData =  extractLines(PsiPredScoreRescaled);

const PsiPredScoreDataColored = lineColorSegments(PsiPredScoreData, mergedPsiPrepBinary);

//--------------------------------------------------------------------------------------------
// Mahmuda Panesl
//--------------------------------------------------------------------------------------------

const rawDisoRDPbindDNA: string = lines[20]?.trim() || "";
const rawDRNApredDNA: string = lines[22]?.trim() || "";
const rawDisoRDPbindDNAScore: string = lines[21]?.trim() || "";
const rawDRNApredDNAScore: string = lines[23]?.trim() || "";

const disoRDPbindDNA: number[] = rawDisoRDPbindDNA ? rawDisoRDPbindDNA.split('').map(Number) : [];
const dRNApredDNA: number[] = rawDRNApredDNA ? rawDRNApredDNA.split('').map(Number) : [];
const disoRDPbindDNAScore: number[] = rawDisoRDPbindDNAScore.split(',').map(val => parseFloat(val));
const dRNApredDNAScore: number[] = rawDRNApredDNAScore.split(',').map(val => parseFloat(val));

 const disoRDPbindDNAColour: Segment[] = extractSegments(disoRDPbindDNA, 1, "#c071fe");
 const dRNApredDNAColour: Segment[] = extractSegments(dRNApredDNA, 1, "#ce5dae");

// line data for disoRDPbindDNA Score
const disoRDPbindDNALines =  extractLines(disoRDPbindDNAScore);
const disoRDPbindDNASegment: Segment[] = extractScoreSegments(disoRDPbindDNAScore, 0, "#c071fe");
const mergedDisoRDPbindDNA: Segment[] = [
    ...disoRDPbindDNASegment.map(s => ({ ...s, color: "#c071fe"})),
];
const disoRDPbindDNAScoreData = lineColorSegments(disoRDPbindDNALines, mergedDisoRDPbindDNA);

// line data for dRNApredDNA Score
const dRNApredDNALines =  extractLines(dRNApredDNAScore);
const dRNApredDNASegment: Segment[] = extractScoreSegments(dRNApredDNAScore, 0, "#ce5dae");
const mergedDRNApredDNA: Segment[] = [
    ...dRNApredDNASegment.map(s => ({ ...s, color: "#ce5dae"})),
];
const dRNApredDNAScoreData = lineColorSegments(dRNApredDNALines, mergedDRNApredDNA);


//---------

const rawDisoRDPbindRNA: string = lines[16]?.trim() || "";
const rawDisoRDPbindRNAScore: string = lines[17]?.trim() || "";
const rawDRNApredRNA: string = lines[18]?.trim() || "";
const rawDRNApredRNAScore: string = lines[19]?.trim() || "";

const disoRDPbindRNA: number[] = rawDisoRDPbindRNA ? rawDisoRDPbindRNA.split('').map(Number) : [];
const disoRDPbindRNAScore: number[] = rawDisoRDPbindRNAScore.split(',').map(val => parseFloat(val));
const dRNApredRNA: number[] = rawDRNApredRNA ? rawDRNApredRNA.split('').map(Number) : [];
const dRNApredRNAScore: number[] = rawDRNApredRNAScore.split(',').map(val => parseFloat(val));


const disoRDPbindRNAColour: Segment[] = extractSegments(disoRDPbindRNA, 1, "orange");
const dRNApredRNAColour: Segment[] = extractSegments(dRNApredRNA, 1, "yellow");

// line data for disoRDPbindRNA Score
const disoRDPbindRNALines =  extractLines(disoRDPbindRNAScore);
const disoRDPbindRNASegment: Segment[] = extractScoreSegments(disoRDPbindRNAScore, 0, "#fcc006");
const mergedDisoRDPbindRNA: Segment[] = [
    ...disoRDPbindRNASegment.map(s => ({ ...s, color: "#fcc006"})),
];
const disoRDPbindRNAScoreData = lineColorSegments(disoRDPbindRNALines, mergedDisoRDPbindRNA);

// line data for dRNApredRNA Score
const dRNApredRNALines =  extractLines(dRNApredRNAScore);
const dRNApredRNASegment: Segment[] = extractScoreSegments(dRNApredRNAScore, 0, "#fdff38");
const mergedDRNApredRNA: Segment[] = [
    ...dRNApredRNASegment.map(s => ({ ...s, color: "#fdff38"})),
];
const dRNApredRNAScoreData = lineColorSegments(dRNApredRNALines, mergedDRNApredRNA);

//---------

const rawSignalPeptideBinary: string = lines[10]?.trim() || "";
const rawSignalPeptideScore: string = lines[11]?.trim() || "";

const signalPeptideBinary: number[] = rawSignalPeptideBinary ? rawSignalPeptideBinary.split('').map(Number) : [];
const signalPeptideScore: number[] = rawSignalPeptideScore.split(',').map(val => parseFloat(val));

 const signalPeptideSegments: Segment[] = extractSegments(signalPeptideBinary, 1, "brown");
 const signalPeptideScoreData = extractLines(signalPeptideScore);

//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
 // **PTM Panel**

interface PTMEntry {
    // For plotting
    x: number;
    // PTM Type name (ex: Phosphorylation)
    type: string;
    color: string;
    stroke?: string;
    opacity?: number;
     // For stacking in fillSvg
    _stackY?: number;
}

const ptmTypes: Record<string, { type: string; color: string }> = {
    '1': { type: 'Phosphorylation', color: '#DC143C' },
    '2': { type: 'Glycosylation', color: '#1E90FF' },
    '3': { type: 'Ubiquitination', color: '#FF4500' },
    '4': { type: 'SUMOylation', color: '#C71585' },
    '5': { type: 'Acetyllysine', color: '#00CED1' },
    '6': { type: 'Methylation', color: '#DAA520' },
    '7': { type: 'Pyrrolidone carboxylic acid', color: '#228B22' },
    '8': { type: 'Palmitoylation', color: '#9932CC' },
    '9': { type: 'Hydroxylation', color: '#6A5ACD' },
};

// Parse PTM data from lines[] and return an array of PTMEntry
function parsePTMPanel(lines: string[]): PTMEntry[] {
    const ptmEntries: PTMEntry[] = [];

    // PTM data starts from line 34
    for (let i = 34; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [ptmID, binaryString] = line.split(',', 2);
        const meta = ptmTypes[ptmID];

        if (!meta || !binaryString) continue;

        // For each position where PTM exists (non-zero), create PTMEntry
        for (let j = 0; j < binaryString.length; j++) {
            if (binaryString[j] !== '0') {
                ptmEntries.push({
                    x: j + 1,
                    type: meta.type,
                    color: meta.color
                });
            }
        }
    }

    return ptmEntries;
}

// Raw PTM data
const ptmEntries = parsePTMPanel(lines);

//----------------------------------------------------------------------------------------------

window.onload = () => {
    let panels = new FeatureViewer(sequence, '#feature-viewer',

        {
            toolbar: true,
            toolbarPosition: 'left',
            brushActive: true,
            zoomMax: 7,
            flagColor: 'white',
            flagTrack: 155,
            flagTrackMobile: 155,
            sideBar: 231
        },
        [
            // ** DISORDER PANEL **
            {
                type: 'rect',
                id: 'Native_Disorder',
                label: 'Native Disorder',
                data: mergedNativeDisorder,
                color: "black",
                className : 'Native_Disorder',
                // First sidebar element
                // So load header and sequence information at top
                sidebar: [
                    {
                        id: 'Header',
                        label: 'Header',
                        content: '<span style="font-size: .8125rem; font-family: sans-serif;">Click on Legend Item to Show/Hide</span>'
                    },
                    {
                        id: 'Sequence_Button',
                        label: 'Sequence Button',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 12px; cursor: pointer; outline: none; display: flex; align-items: center;">
                            <span style="display: inline-block; width: 5px; height: 5px; background-color: black; border-radius: 50%; margin-right: 12px;"></span>
                            Sequence
                        </button>`
                    },
                   
                    {
                        id: 'Native_Disorder_Button',
                        label: 'Native Disorder Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #2ca02c; margin-right: 5px;"></span>
                            Native Disordered Regions
                        </button>`
                    }
                ]
            },
            {
                type: 'rect',
                id: 'Putative_Disorder',
                label: 'Putative Disorder',
                data: putativeDisorder,
                color: 'black',
                sidebar: [
                     {
                        id: 'Putative_Disorder_Button',
                        label: 'Putative Disorder Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #75fd63; margin-right: 5px;"></span>
                            Putative Disordered Regions
                        </button>`
                    }
                ]
            },
            {
                type: 'curve',
                id: 'PREDICTIVE_DISORDER_SCORES',
                label: ' ',
                color: '#76fd63',
                flag: 6,
                data: vslScoreData,
                sidebar: [
                    {
                        id: 'PREDICTIVE_DISORDER_SCORES 0',
                        label: 'Predictive Disorder Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 2px; background-color: #75fd63; margin-right: 5px; vertical-align: middle;"></span>
                            Predictive Disordered Regions
                        </button>`
                    }
                ]
            },
            // ** ASA PANEL **
            {
                type: 'rect',
                id: 'Native_RSA_Binary',
                label: 'Native Buried Residues',
                data: mergedRSABinary,
                color: "black",
                sidebar: [
                    {
                        id: 'Native_RSA_Binary_Button',
                        label: 'Native RSA Binary Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #fc0080; margin-right: 5px;"></span>
                            Native Buried Residue
                        </button>`
                    }
                ]
            },
            {
                type: 'rect',
                id: 'Putative_Buried_Residue',
                label: 'Putative Buried Residue',
                data: buriedResiduesResults,
                color: 'black',
                sidebar: [
                    {
                        id: 'Putative_Buried_Residue_Button',
                        label: 'Putative Buried Residue Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #ffd2df; margin-right: 5px;"></span>
                            Native Buried Residue
                        </button>`
                     }
                ]
            },
            {
                type: 'curve',
                id: 'ASA_SCORES',
                label: ' ',
                color: ['#ffd2df', '#fc0080'],
                stroke: "black",
                flag: 2,
                data: [asaScoreData,  rsaScoreData],
                sidebar: [
                     {
                        id: 'ASA_SCORES 1',
                        label: 'ASA SCORES Native Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 2px; background-color: #fc0080; margin-right: 5px; vertical-align: middle;"></span>
                            Native Solvent Accesibility
                        </button>`
                    },
                    {
                        id: 'ASA_SCORES 0',
                        label: 'ASA SCORES Predicted Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 2px; background-color: #ffd2df; margin-right: 5px; vertical-align: middle;"></span>
                            Predicted Solvent Accesibility
                        </button>`
                    },
                ]
            },
            // ** Secondary Structure PANEL **
            {
                type: 'rect',
                id: 'Native_Sec_Struc',
                label: 'Native Sec.Struc',
                color: 'black',
                flag: 2,
                data: mergedSECSSBinary, 
                sidebar:[
                    {
                        id: 'Native_Sec_Struc_Unavailable_Button',
                        label: 'Native Sec Struc Unavailable Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #c0c0c0; margin-right: 5px;"></span>
                            Unavaliable_native
                        </button>`
                    },
                    {
                        id: 'Native_Sec_Struc_Coil_Button',
                        label: 'Native Sec Struc Coil Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #25a36f; margin-right: 5px;"></span>
                            Coil
                        </button>`
                    },
                    {
                        id: 'Native_Sec_Struc_Helix_Button',
                        label: 'Native Sec Struc Helix Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #cf6275; margin-right: 5px;"></span>
                            Helix
                        </button>`
                    },
                    {
                        id: 'Native_Sec_Struc_Strand_Button',
                        label: 'Native Sec Struc Stand Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #fffd01; margin-right: 5px;"></span>
                            Strand
                        </button>`
                    }
                ]
            },
            {
                type: 'rect',
                id: 'Putative_Sec_Struc',
                label: 'Putative Sec.Struc',
                color: 'black',
                flag: 2,
                data: mergedPsiPrepBinary, 
            },
            {
                type: 'curve',
                id: 'SECONDARY_STRUC_SCORES',
                label: ' ',
                flag: 1,
                data: PsiPredScoreDataColored,
                sidebar: [
                    {
                        id: 'SECONDARY_STRUC_SCORES 0',
                        label: 'Secondary Struc Score Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 2px; background-color: #25a36f; margin-right: 5px; vertical-align: middle;"></span>
                            Secondary struc.score
                        </button>`
                    }
                ] 
            },
            // ** PROTEIN PANEL **
            {
                type: 'rect',
                id: 'DisoRDPbind_Binding',
                label: 'DisoRDPbind-Protein',
                data: disoRDPbindSegments,
                color: '#3d7afd',
                sidebar: [
                    {
                        id: 'DisoRDPbind_Binding_Button',
                        label: 'DisoRDPbind Binding Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #3d7afd; margin-right: 5px;"></span>
                            DisoRDPbind Protein Binding
                        </button>`
                    }
                ]
            },
            
            {
                type: 'rect',
                id: 'Scriber_Binding',
                label: 'SCRIBER',
                data: scriberSegments,
                color: '#3b5b92',
                sidebar: [
                    {
                        id: 'Scriber_Binding_Button',
                        label: 'Scriber Binding Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #3b5b92; margin-right: 5px;"></span>
                            SCRIBER Protein Binding
                        </button>`
                    }
                ]
            },
            {
                type: 'rect',
                id: 'MoRFchibi_Binding',
                label: 'MoRFchibi',
                data: morfChibiSegments,
                color: '#01889f',
                sidebar: [
                    {
                        id: 'MoRFchibi_Binding_Button',
                        label: 'MoRFchibi Binding Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #01889f; margin-right: 5px;"></span>
                            MoRFchibi Protein Binding
                        </button>`
                    }
                ]
                
            },
            {
                type: 'curve',
                id: 'PROTEIN_SCORES',
                label: ' ',
                color: ['#3d7afd', '#3b5b92', '#01889f'],
                flag: 3,
                data:[disoRDPbindScoreData, scriberScoreData, morfChibiScoreData],
                sidebar: [
                    {
                        id: 'PROTEIN_SCORES 0',
                        label: 'DisoRDPbind Score Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 2px; background-color: #3d7afd; margin-right: 5px; vertical-align: middle;"></span>
                            DisoRDPbind Score
                        </button>`
                    },
                    {
                        id: 'PROTEIN_SCORES 1',
                        label: 'Scriber Score Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 2px; background-color: #3b5b92; margin-right: 5px; vertical-align: middle;"></span>
                            Scriber Score
                        </button>`
                    },
                    {
                        id: 'PROTEIN_SCORES 2',
                        label: 'MoRFchibi Score Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 2px; background-color: #01889f; margin-right: 5px; vertical-align: middle;"></span>
                            MoRFchibi Score
                        </button>`
                    }
                ]
            },            
            // ** DNA PANEL **
            { 
                type: 'rect', 
                id: 'DisoRDPbindDNA', 
                label: 'DisoRDPbind-DNA', 
                data: disoRDPbindDNAColour, 
                color: "#c071fe",
                sidebar: [
                    {
                        id: 'DisoRDPbindDNA_Button',
                        label: 'DisoRDPbind DNA binding Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #c071fe; margin-right: 5px;"></span>
                            DisoRDPbind DNA Binding
                        </button>`
                    }
                ]
            },
            { 
                type: 'rect', 
                id: 'DRNApredDNA', 
                label: 'DRNApred-DNA', 
                data: dRNApredDNAColour, 
                color: "#ce5dae",
                sidebar: [
                    {
                        id: 'DRNApredDNA_Button',
                        label: 'DRNApred DNA binding Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #ce5dae; margin-right: 5px;"></span>
                            DRNApred DNA Binding
                        </button>`
                    }
                ]
            },
            { 
                type: 'curve', 
                id: 'DNA_SCORES', 
                label: ' ', 
                color: ['#c071fe', '#ce5dae'],
                flag: 4,
                data: [disoRDPbindDNAScoreData, dRNApredDNAScoreData],
                sidebar: [
                    {
                        id: 'DNA_SCORES 0',
                        label: 'DisoRDPbind DNA Score Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 2px; background-color: #c071fe; margin-right: 5px; vertical-align: middle;"></span>
                            DisoRDPbind DNA Score
                        </button>`
                    },
                    {
                        id: 'DNA_SCORES 1',
                        label: 'DRNApred DNA Score Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 2px; background-color: #ce5dae; margin-right: 5px; vertical-align: middle;"></span>
                            DRNApred DNA Score 
                        </button>`
                    }
                ]
            },
            // ** RNA PANEL ** 
            { 
                type: 'rect', 
                id: 'DisoRDPbindRNA', 
                label: 'DisoRDPbind-RNA', 
                data: disoRDPbindRNAColour, 
                color: "#fcc006",
                sidebar: [
                    {
                        id: 'DisoRDPbindRNA_Button',
                        label: 'DisoRDPbind RNA binding Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #fcc006; margin-right: 5px;"></span>
                            DisoRDPbind RNA Binding
                        </button>`
                    }
                ]
            },
            { 
                type: 'rect', 
                id: 'DRNApredRNA', 
                label: 'DRNApred-RNA', 
                data: dRNApredRNAColour, 
                color: "#fdff38",
                sidebar: [
                    {
                        id: 'DRNApredRNA_Button',
                        label: 'DRNApred RNA binding Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #fdff38; margin-right: 5px;"></span>
                            DRNApred RNA Binding
                        </button>`
                    }
                ]
            },
            { 
                type: 'curve', 
                id: 'RNA_SCORES', 
                label: ' ', 
                color: ['#fcc006', '#fdff38'], 
                flag: 5,
                data: [disoRDPbindRNAScoreData, dRNApredRNAScoreData],
                sidebar: [
                     {
                        id: 'RNA_SCORES 0',
                        label: 'DisoRDPbind RNA Score Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 2px; background-color: #fcc006; margin-right: 5px; vertical-align: middle;"></span>
                            DisoRDPbind RNA Score
                        </button>`
                    },
                    {
                        id: 'RNA_SCORES 1',
                        label: 'DRNApred RNA Score Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 2px; background-color: #fdff38; margin-right: 5px; vertical-align: middle;"></span>
                            DRNApred RNA Score 
                        </button>`
                    }
                ]
            },
            // ** SIGNAL PEPTIDE **
              { 
                type: 'rect', 
                id: 'Signal_Peptide', 
                label: 'Signal Peptides', 
                data: signalPeptideSegments, 
                color: "#964e02",
                sidebar: [
                    {
                        id: 'Signal_Peptide_Button',
                        label: 'Signal Peptide Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #964e02; margin-right: 5px;"></span>
                            Signal Peptides
                        </button>`
                    }
                ]
            },
            { 
                type: 'curve', 
                id: 'SIGNAL_PEPTIDE_SCORES', 
                label: ' ', 
                color: '#964e02',
                flag: 7,
                data: signalPeptideScoreData,
                sidebar: [
                    {
                        id: 'SIGNAL_PEPTIDE_SCORES 0',
                        label: 'Signal Peptides Score Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 2px; background-color: #964e02; margin-right: 5px; vertical-align: middle;"></span>
                            Signal Peptides Score
                        </button>`
                    }
                ]
            },
             // ** CONSERVATION PANEL **
            {
                type: 'rect',
                id: 'Conservation_Levels',
                label: 'Conservation',
                color: 'black',
                flag: 4,
                data: mergedConservationLevels,
                sidebar: [
                    {
                        id: 'Conservation_Level_1_Button',
                        label: 'Conservation Level 1 Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #f0f3f5; margin-right: 5px;"></span>
                            Conservation Level 1
                        </button>`
                    },
                    {
                        id: 'Conservation_Level_2_Button',
                        label: 'Conservation Level 2 Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #f0f3f5; margin-right: 5px;"></span>
                            Conservation Level 2
                        </button>`
                    },
                    {
                        id: 'Conservation_Level_3_Button',
                        label: 'Conservation Level 3 Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #d1dae0; margin-right: 5px;"></span>
                            Conservation Level 3
                        </button>`
                    },
                    {
                        id: 'Conservation_Level_4_Button',
                        label: 'Conservation Level 4 Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #b3c2cb; margin-right: 5px;"></span>
                            Conservation Level 4
                        </button>`
                    },
                    {
                        id: 'Conservation_Level_5_Button',
                        label: 'Conservation Level 5 Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #95aab7; margin-right: 5px;"></span>
                            Conservation Level 5
                        </button>`
                    },
                    {
                        id: 'Conservation_Level_6_Button',
                        label: 'Conservation Level 6 Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #7691a2; margin-right: 5px;"></span>
                            Conservation Level 6
                        </button>`
                    },
                    {
                        id: 'Conservation_Level_7_Button',
                        label: 'Conservation Level 7 Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #5d7889; margin-right: 5px;"></span>
                            Conservation Level 7
                        </button>`
                    },
                    {
                        id: 'Conservation_Level_8_Button',
                        label: 'Conservation Level 8 Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #485d6a; margin-right: 5px;"></span>
                            Conservation Level 8
                        </button>`
                    },
                    {
                        id: 'Conservation_Level_9_Button',
                        label: 'Conservation Level 9 Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #34434c; margin-right: 5px;"></span>
                            Conservation Level 9
                        </button>`
                    },
                    {
                        id: 'Conservation_Level_10_Button',
                        label: 'Conservation Level 10 Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #1f282e; margin-right: 5px;"></span>
                            Conservation Level 10
                        </button>`
                    }
                ]
            },
            {
                type: 'curve',
                id: 'CONSERVATION_SCORES',
                label: ' ',
                color: '#607c8e',
                flag: 8,
                data: mmseqScoreData,
                sidebar: [
                     {
                        id: 'CONSERVATION_SCORES 0',
                        label: 'Conservation Score Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 2px; background-color: #607c8e; margin-right: 5px; vertical-align: middle;"></span>
                            Conservation Score
                        </button>`
                    }
                ]
            },
            // ** LINKER PANEL **
            {
                type: 'rect',
                id: 'Linker_Residues',
                label: 'Linker',
                data: linkerSegments,
                color: '#ff9408',
                sidebar: [
                    {
                        id: 'Linker_Residues_Button',
                        label: 'Linker Residues Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #ff9408; margin-right: 5px;"></span>
                            Linker Residues
                        </button>`
                    }
                ]
            },
            {
                type: 'curve',
                id: 'LINKER_SCORES',
                label: ' ',
                color: '#ff9408',
                flag: 9,
                data: linkerScoreData,
                sidebar: [
                    {
                        id: 'LINKER_SCORES 0',
                        label: 'Linker Score Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 2px; background-color: #ff9408; margin-right: 5px; vertical-align: middle;"></span>
                            Linker Score
                        </button>`
                    }
                ]
            },
            // ** PTM PANEL **
            {
                type: 'ptmTriangle',
                id: 'PTM_Sites',
                label: 'PTM Sites',
                data: ptmEntries,
                color: 'black',
                sidebar: [
                    {
                        id: 'PTM_Sites 0',
                        label: 'PTM Phophorylation Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
                            <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #DC143C; margin-right: 5px;"></span>
                            Phophorylation
                        </button>`
                    },
                    {
                        id: 'PTM_Sites 1',
                        label: 'PTM Glycosylation Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
                            <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #1E90FF; margin-right: 5px;"></span>
                            Glycosylation
                        </button>`
                    },
                    {
                        id: 'PTM_Sites 2',
                        label: 'PTM Ubiquitination Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
                            <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #FF4500; margin-right: 5px;"></span>
                            Ubiquitination
                        </button>`
                    },
                    {
                        id: 'PTM_Sites 3',
                        label: 'PTM SUMOylation Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
                            <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #C71585; margin-right: 5px;"></span>
                            SUMOylation
                        </button>`
                    },
                    {
                        id: 'PTM_Sites 4',
                        label: 'PTM Acetyllysine Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
                            <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #00CED1; margin-right: 5px;"></span>
                            Acetyllysine
                        </button>`
                    },
                    {
                        id: 'PTM_Sites 5',
                        label: 'PTM Methylation Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
                            <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #DAA520; margin-right: 5px;"></span>
                            Methylation
                        </button>`
                    },
                    {
                        id: 'PTM_Sites 6',
                        label: 'PTM Pyrrolidone carboxylic acid Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
                            <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #228B22; margin-right: 5px;"></span>
                            Pyrrolidone carboxylic acid
                        </button>`
                    },
                    {
                        id: 'PTM_Sites 7',
                        label: 'PTM Palmitoylation Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
                            <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #9932CC; margin-right: 5px;"></span>
                            Palmitoylation
                        </button>`
                    },
                    {
                        id: 'PTM_Sites 8',
                        label: 'PTM Hydroxylation Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
                            <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #6A5ACD; margin-right: 5px;"></span>
                            Hydroxylation
                        </button>`
                    }
                ]
              }
        ]);

    panels.onButtonSelected((event) => {
    const buttonId = event.detail.id;

        const resetButtons = [
            'Native_Disorder_Button',
            'Putative_Disorder_Button',
            'PREDICTIVE_DISORDER_SCORES 0',
            'Native_RSA_Binary_Button',
            'Putative_Buried_Residue_Button',
            'ASA_SCORES 0',
            'ASA_SCORES 1',
            'Native_Sec_Struc_Unavailable_Button',
            'Native_Sec_Struc_Coil_Button',
            'Native_Sec_Struc_Helix_Button',
            'Native_Sec_Struc_Strand_Button',
            'SECONDARY_STRUC_SCORES 0',
            'DisoRDPbind_Binding_Button',
            'Scriber_Binding_Button',
            'MoRFchibi_Binding_Button',
            'PROTEIN_SCORES 0',
            'PROTEIN_SCORES 1',
            'PROTEIN_SCORES 2',
            'DisoRDPbindDNA_Button',
            'DRNApredDNA_Button',
            'DNA_SCORES 0',
            'DNA_SCORES 1',
            'DisoRDPbindRNA_Button',
            'DRNApredRNA_Button',
            'RNA_SCORES 0',
            'RNA_SCORES 1',
            'Signal_Peptide_Button',
            'SIGNAL_PEPTIDE_SCORES 0',
            'Conservation_Level_1_Button',
            'Conservation_Level_2_Button',
            'Conservation_Level_3_Button',
            'Conservation_Level_4_Button',
            'Conservation_Level_5_Button',
            'Conservation_Level_6_Button',
            'Conservation_Level_7_Button',
            'Conservation_Level_8_Button',
            'Conservation_Level_9_Button',
            'Conservation_Level_10_Button',
            'CONSERVATION_SCORES 0',
            'Linker_Residues_Button',
            'LINKER_SCORES 0',
            'PTM_Sites 0',
            'PTM_Sites 1',
            'PTM_Sites 2',
            'PTM_Sites 3',
            'PTM_Sites 4',
            'PTM_Sites 5',
            'PTM_Sites 6',
            'PTM_Sites 7',
            'PTM_Sites 8'
        ];

        if (resetButtons.includes(buttonId)) {
            //panels.resetAll();
            panels.featureToggle(buttonId);
            
        }

    });

};

