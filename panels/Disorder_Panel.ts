import { FeatureViewer } from "../FeatureViewerTypeScript/src/feature-viewer";
import { extractSegments, extractLines, Segment } from "../utils/utils";
import '../feature-constructor.scss';

declare var inputValues: string;

// Split lines into array
const lines: string[] = inputValues.split('\n');

// **Disorder Panel Data**
const sequence: string = lines[1]?.trim() || "";
const rawDisorderBinary: string = lines[30]?.trim() || "";
const rawVSLBinary: string = lines[2]?.trim() || "";
const rawVSLScore: string = lines[3]?.trim() || "";

const disorderBinary: number[] = rawDisorderBinary ? Array.from(rawDisorderBinary, Number) : [];
const vslBinary: number[] = rawVSLBinary ? Array.from(rawVSLBinary, Number) : [];
const vslScore: number[] = rawVSLScore.trim().split(',').map(val => parseFloat(val));

// ** CALCULATING DATA **
const nativeDisorderColor: Segment[] = extractSegments(disorderBinary, 1, "#2da02c"); // assigned color for data exists
const nativeDisorderGrey: Segment[] = extractSegments(disorderBinary, 2, "grey"); // Grey overlay for not available data

// This is to plot the available and unavailable data at the same line
const mergedNativeDisorder: Segment[] = [
    ...nativeDisorderColor.map(s => ({ ...s, color: "#2da02c"})),
    ...nativeDisorderGrey.map(s => ({ ...s, color: "grey"}))
];

const putativeDisorder: Segment[] = extractSegments(vslBinary, 1, "#76fd63");

// Extract line data
const vslScoreData = extractLines(vslScore);


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
            // ** DISORDER PANEL **
            {
                type: 'rect',
                id: 'Native_Disorder',
                label: 'Native Disorder',
                data: mergedNativeDisorder,
                color: "black",
                className : 'Native_Disorder',
                // All buttons are loaded into first feature's sidebar element
                // Allows for consistent spacing and behavior between button elements 
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
            }
        ]);



    panels.onButtonSelected((event) => {
    const buttonId = event.detail.id;

        const resetButtons = [
            'Native_Disorder_Button',
            'Putative_Disorder_Button',
            'PREDICTIVE_DISORDER_SCORES 0'
        ];

        if (resetButtons.includes(buttonId)) {
            //panels.resetAll();
            panels.featureToggle(buttonId);
            
        }

    });

};

