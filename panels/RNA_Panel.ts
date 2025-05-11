import { FeatureViewer } from "../FeatureViewerTypeScript/src/feature-viewer";
import { extractSegments, extractLines, Segment, extractScoreSegments, psipredRescaleScores, mmseqRescaleScores, lineColorSegments} from "../utils/utils";
import '../feature-constructor.scss';

declare var inputValues: string;

// Split lines into array
const lines: string[] = inputValues.split('\n');
const sequence: string = lines[1]?.trim() || "";


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
            // ** RNA PANEL ** 
            { 
                type: 'rect', 
                id: 'DisoRDPbindRNA', 
                label: 'DisoRDPbind-RNA', 
                data: disoRDPbindRNAColour, 
                color: "#fcc006",
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
        ]);

    panels.onButtonSelected((event) => {
    const buttonId = event.detail.id;

        const resetButtons = [
            'DisoRDPbindRNA_Button',
            'DRNApredRNA_Button',
            'RNA_SCORES 0',
            'RNA_SCORES 1'
        ];

        if (resetButtons.includes(buttonId)) {
            //panels.resetAll();
            panels.featureToggle(buttonId);
            
        }

    });

};

