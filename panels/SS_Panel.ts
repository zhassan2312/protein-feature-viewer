import { FeatureViewer } from "../FeatureViewerTypeScript/src/feature-viewer";
import { extractSegments, extractLines, Segment, extractScoreSegments, psipredRescaleScores, mmseqRescaleScores, lineColorSegments} from "../utils/utils";
import '../feature-constructor.scss';

declare var inputValues: string;

// Split lines into array
const lines: string[] = inputValues.split('\n');
const sequence: string = lines[1]?.trim() || "";

//--------------------------------------------------------------------------------------------------------

// **Sec.Struc Panel Data**

const rawSECSSBinary: string = lines[31]?.trim() || "";
const SECSSBinary: number[] = rawSECSSBinary ? Array.from(rawSECSSBinary, Number) : [];

const rawPsiPredBinary: string = lines[4]?.trim() || "";
const PsiPredBinary: number[] = rawPsiPredBinary ? Array.from(rawPsiPredBinary, Number) : [];


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
            sideBar: 230
        },
        [
            // ** Secondary Structure PANEL **
            {
                type: 'rect',
                id: 'Native_Sec_Struc',
                label: 'Native Sec.Struc',
                color: 'black',
                flag: 2,
                data: mergedSECSSBinary, 
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
            }                 
        ]);

    panels.onButtonSelected((event) => {
    const buttonId = event.detail.id;

        const resetButtons = [
            'Native_Sec_Struc_Unavailable_Button',
            'Native_Sec_Struc_Coil_Button',
            'Native_Sec_Struc_Helix_Button',
            'Native_Sec_Struc_Strand_Button',
            'SECONDARY_STRUC_SCORES 0'
        ];

        if (resetButtons.includes(buttonId)) {
            //panels.resetAll();
            panels.featureToggle(buttonId);
            
        }

    });

};

