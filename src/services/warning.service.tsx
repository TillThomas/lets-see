import { ITravelWarning } from "@/models/travelWarning.model";


export type CountryValue = {
    id: string,
    value: number,
    type?: 'red' | 'green' 
  };

const WarningService = {
    getCountryValues: function getCountryValues(travelWarnings: ITravelWarning[]): CountryValue[] {
        return travelWarnings.map((warning: ITravelWarning) => this.getCountryValue(warning))
      },
    
    getCountryValue:  function getCountryValue(warning: ITravelWarning): CountryValue {
        const id = warning.iso3CountryCode;
        const type =(warning.situationWarning || warning.situationPartWarning) ? 'green' : 'red';
        let value = (warning.warning || warning.situationWarning) ? 1 : 0;
        value = (warning.partialWarning || warning.situationPartWarning) ? 0.5 : value;
      
        return {
          id,
          value,
          type
        }
      }
}

export default WarningService;


