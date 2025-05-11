import { FeatureViewer } from "../FeatureViewerTypeScript/src/feature-viewer";
import { extractSegments, extractLines, Segment, extractScoreSegments, psipredRescaleScores, mmseqRescaleScores, lineColorSegments} from "../utils/utils";
import '../feature-constructor.scss';

declare var inputValues: string;

// Split lines into array
const lines: string[] = inputValues.split('\n');
const sequence: string = lines[1]?.trim() || "";


const rawSignalPeptideBinary: string = lines[10]?.trim() || "";
const rawSignalPeptideScore: string = lines[11]?.trim() || "";

const signalPeptideBinary: number[] = rawSignalPeptideBinary ? rawSignalPeptideBinary.split('').map(Number) : [];
const signalPeptideScore: number[] = rawSignalPeptideScore.split(',').map(val => parseFloat(val));

const signalPeptideSegments: Segment[] = extractSegments(signalPeptideBinary, 1, "brown");
const signalPeptideScoreData = extractLines(signalPeptideScore);


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
            // ** SIGNAL PEPTIDE **
              { 
                type: 'rect', 
                id: 'Signal_Peptide', 
                label: 'Signal Peptides', 
                data: signalPeptideSegments, 
                color: "#964e02",
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
        ]);

    panels.onButtonSelected((event) => {
    const buttonId = event.detail.id;

        const resetButtons = [
            'Signal_Peptide_Button',
            'SIGNAL_PEPTIDE_SCORES 0'
        ];

        if (resetButtons.includes(buttonId)) {
            //panels.resetAll();
            panels.featureToggle(buttonId);
            
        }

    });

};

