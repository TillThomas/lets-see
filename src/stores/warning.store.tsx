import { ITravelWarning } from "@/models/travelWarning.model";
import { create } from "zustand";

export interface WarningState {
    warnings: ITravelWarning[],
    warningDetail: ITravelWarning | undefined,
    fetchWarnings: () => Promise<ITravelWarning[]>,
    fetchWarningDetails: (contentId: string) =>  void,

};

export const useWarningStore = create<WarningState>()((set) => ({
    warnings: [],
    warningDetail: undefined,
    fetchWarnings: async () => {
        const warnings = await fetchWarnings()
        set({ warnings})
        return warnings
    },
    fetchWarningDetails: async (countryIsoID: string) => set({warningDetail: await getWarning(countryIsoID)})
}));

async function fetchWarnings(): Promise<ITravelWarning[]> {    
    return await fetch('https://www.auswaertiges-amt.de/opendata/travelwarning')
    .then((res) => res.json())
    .then((data) => formatData(data))
}

function formatData(data: {response: ITravelWarning[]}): ITravelWarning[] {
    const warnings = Object.entries(data.response).map(([contentID, warning]) => {return {...warning, ...{contentID}}});
    return warnings;
  }

async function getWarning(countryIsoID: string): Promise<ITravelWarning> {
    return fetch('https://www.auswaertiges-amt.de/opendata/travelwarning/' + countryIsoID)
    .then((res) => res.json())
    .then((data) => formatData(data)[0])
}