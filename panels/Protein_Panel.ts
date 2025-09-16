import { FeatureViewer } from "../FeatureViewerTypeScript/src/feature-viewer";
import { extractSegments, extractLines, Segment, extractScoreSegments, psipredRescaleScores, mmseqRescaleScores, lineColorSegments} from "../utils/utils";
import '../feature-constructor.scss';

declare var inputValues: string;

// Split lines into array
const lines: string[] = inputValues.split('\n');
const sequence: string = lines[1]?.trim() || "";

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
            // ** PROTEIN PANEL **
            {
                type: 'rect',
                id: 'DisoRDPbind_Binding',
                label: 'DisoRDPbind-Protein',
                data: disoRDPbindSegments,
                color: '#3d7afd',
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
        ]);

    panels.onButtonSelected((event) => {
    const buttonId = event.detail.id;

        const resetButtons = [
            'DisoRDPbind_Binding_Button',
            'Scriber_Binding_Button',
            'MoRFchibi_Binding_Button',
            'PROTEIN_SCORES 0',
            'PROTEIN_SCORES 1',
            'PROTEIN_SCORES 2'
        ];

        if (resetButtons.includes(buttonId)) {
            //panels.resetAll();
            panels.featureToggle(buttonId);
            
        }

    });

};

