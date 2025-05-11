import { FeatureViewer } from "../FeatureViewerTypeScript/src/feature-viewer";
import { extractSegments, extractLines, Segment, extractScoreSegments, psipredRescaleScores, mmseqRescaleScores, lineColorSegments} from "../utils/utils";
import '../feature-constructor.scss';

declare var inputValues: string;

// Split lines into array
const lines: string[] = inputValues.split('\n');
const sequence: string = lines[1]?.trim() || "";

// **Conservation Panel Data**
const rawmmseqBinary: string = lines[8]?.trim() || "";
const rawmmseqScore: string = lines[9]?.trim() || "";

const mmseqBinary: number[] = rawmmseqBinary ? Array.from(rawmmseqBinary, Number) : [];
const mmseqScore: number[] = rawmmseqScore.trim().split(',').map(val => parseFloat(val));


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
            }
        ]);

    panels.onButtonSelected((event) => {
    const buttonId = event.detail.id;

        const resetButtons = [
            'Signal_Peptide_Score_Button',
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
        ];

        if (resetButtons.includes(buttonId)) {
            //panels.resetAll();
            panels.featureToggle(buttonId);
            
        }

    });

};

