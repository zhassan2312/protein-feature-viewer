import { FeatureViewer } from "../FeatureViewerTypeScript/src/feature-viewer";
import { extractSegments, extractLines, Segment, extractScoreSegments, psipredRescaleScores, mmseqRescaleScores, lineColorSegments} from "../utils/utils";
import '../feature-constructor.scss';

declare var inputValues: string;

// Split lines into array
const lines: string[] = inputValues.split('\n');
const sequence: string = lines[1]?.trim() || "";


// **Linker Data**
const rawLinkerBinary: string = lines[12]?.trim() || "";
const rawLinkerScore: string = lines[13]?.trim() || "";

const linkerBinary: number[] = rawLinkerBinary ? Array.from(rawLinkerBinary, Number) : [];
const linkerScore: number[] = rawLinkerScore.split(',').map(val => parseFloat(val) || 0);

// **Linker Panel**
const linkerSegments: Segment[] = extractSegments(linkerBinary, 1, "#ff9408");
const linkerScoreData = extractLines(linkerScore);


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
            // ** LINKER PANEL **
            {
                type: 'rect',
                id: 'Linker_Residues',
                label: 'Linker',
                data: linkerSegments,
                color: '#ff9408',
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
        ]);

    panels.onButtonSelected((event) => {
    const buttonId = event.detail.id;

        const resetButtons = [
            'Linker_Residues_Button',
            'LINKER_SCORES 0'
        ];

        if (resetButtons.includes(buttonId)) {
            //panels.resetAll();
            panels.featureToggle(buttonId);
            
        }

    });

};

