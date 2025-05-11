import { FeatureViewer } from "../FeatureViewerTypeScript/src/feature-viewer";
import { extractSegments, extractLines, Segment, extractScoreSegments, psipredRescaleScores, mmseqRescaleScores, lineColorSegments} from "../utils/utils";
import '../feature-constructor.scss';

declare var inputValues: string;

// Split lines into array
const lines: string[] = inputValues.split('\n');
const sequence: string = lines[1]?.trim() || "";


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
            // ** DNA PANEL **
            { 
                type: 'rect', 
                id: 'DisoRDPbindDNA', 
                label: 'DisoRDPbind-DNA', 
                data: disoRDPbindDNAColour, 
                color: "#c071fe",
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
            }
        ]);

    panels.onButtonSelected((event) => {
    const buttonId = event.detail.id;

        const resetButtons = [
            'DisoRDPbindDNA_Button',
            'DRNApredDNA_Button',
            'DNA_SCORES 0',
            'DNA_SCORES 1',
        ];

        if (resetButtons.includes(buttonId)) {
            //panels.resetAll();
            panels.featureToggle(buttonId);
            
        }

    });

};

