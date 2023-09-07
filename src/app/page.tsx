'use client'

import Map, { CountryValue, FeatureShape } from '@/components/map';
import { ITravelWarning } from '@/models/travelWarning.model';
import { useWarningStore } from '@/stores/warning.store';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const fetch = useWarningStore((state) => state.fetchWarnings);
  fetch();


  async function formatData(data: {response: ITravelWarning[]}): Promise<ITravelWarning[]> {
    return Object.values(data.response) 
  }

  function onCountryClick(feature: FeatureShape, countryValue: CountryValue): void {
    const warning = getWarning(countryValue.id) 
    if(warning) {
      useWarningStore.getState().selectCountry(feature, warning);
      router.push(`/${countryValue.id}`);
    };
  }

  return (
      <div className='w-5/6 h-5/6 '>
        <ParentSize>{({ width, height }) => 
          <Map width={width} height={height} 
            countryValues={getCountryValues(useWarningStore((state) => state.warnings))}
            eventCallback={onCountryClick}/>}
        </ParentSize>
      </div>
  )
}

function getCountryValues(travelWarnings: ITravelWarning[]): CountryValue[] {
  return travelWarnings.map((warning: ITravelWarning) => getCountryValue(warning))
}

function getCountryValue(warning: ITravelWarning): CountryValue {
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

function getWarning(id: string): ITravelWarning | undefined {
  return useWarningStore.getState().warnings.find((warning) => warning.iso3CountryCode === id);
}
