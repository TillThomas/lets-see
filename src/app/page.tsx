'use client'

import Map, { FeatureShape } from '@/components/map';
import { ITravelWarning } from '@/models/travelWarning.model';
import warningService, { CountryValue } from '@/services/warning.service';
import { useWarningStore } from '@/stores/warning.store';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const fetch = useWarningStore((state) => state.fetchWarnings);
  const warnings = useWarningStore((state) => state.warnings);
  fetch();

  function onCountryClick(countryValue: CountryValue): void {
    const warning = getWarning(countryValue.id) 
    if(warning) {
      router.push(`/${countryValue.id}`);
    };
  }

  return (
      <div className='lg:w-5/6 lg:h-5/6 w-screen h-screen'>
        <ParentSize>{({ width, height }) => 
          <Map width={width} height={height} 
            countryValues={warningService.getCountryValues(warnings)}
            eventCallback={onCountryClick}/>}
        </ParentSize>
      </div>
  )
}

function getWarning(id: string): ITravelWarning | undefined {
  return useWarningStore.getState().warnings.find((warning) => warning.iso3CountryCode === id);
}
