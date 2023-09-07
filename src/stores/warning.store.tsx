import { CountryValue, FeatureShape } from "@/components/map";
import { ITravelWarning } from "@/models/travelWarning.model";
import { create } from "zustand";

export interface WarningState {
    warnings: ITravelWarning[],
    warningDetail: ITravelWarning | undefined,
    selected?: {
        warning: ITravelWarning,
        country: FeatureShape
    };
    fetchWarnings: () => void;
    selectCountry: (country: FeatureShape, warning: ITravelWarning) => void;
    fetchWarning: (contentId: string) =>  void;
};

export const useWarningStore = create<WarningState>()((set) => ({
    warnings: [],
    warningDetail: undefined,
    fetchWarnings: async () => {
        set({ warnings: await _fetchWarnings()})
    },
    selectCountry: (country: FeatureShape, warning: ITravelWarning) => set((state) => ({selected: {country, warning}})),
    fetchWarning: async (id: string) => set({warningDetail: await _getWarning(id)})
}));

async function _fetchWarnings(): Promise<ITravelWarning[]> {    
    return await fetch('https://www.auswaertiges-amt.de/opendata/travelwarning')
    .then((res) => res.json())
    .then((data) => formatData(data))
}

async function formatData(data: {response: ITravelWarning[]}): Promise<ITravelWarning[]> {
    return Object.values(data.response) 
  }

async function _getWarning(id: string): Promise<ITravelWarning> {
return fetch('https://www.auswaertiges-amt.de/opendata/travelwarning/' + id)
.then((res) => res.json())
.then((data) => data.response);
}