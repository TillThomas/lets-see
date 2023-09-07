'use client'

import Map, { CountryValue, FeatureShape } from '@/components/map';
import { ITravelWarning } from '@/models/travelWarning.model';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { feature } from 'topojson-client';

export default function Home() {
  const [travelWarnings, setTravelWarnings] = useState<ITravelWarning[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('https://www.auswaertiges-amt.de/opendata/travelwarning')
    .then((res) => res.json())
    .then((data) => formatData(data))
    .then((formatedData) => setTravelWarnings(formatedData))
  }, []);

  async function formatData(data: {response: ITravelWarning[]}): Promise<ITravelWarning[]> {
    return Object.values(data.response) 
  }

  function onCountryClick(feature: FeatureShape, countryValue: CountryValue): void {
    router.push(`/${countryValue.id}`);
  }

  return (
      <div className='w-5/6 h-5/6 '>
        <ParentSize>{({ width, height }) => 
          <Map width={width} height={height} 
            countryValues={getCountryValues(travelWarnings)}
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
  const type = warning.situationWarning || warning.situationPartWarning ? 'green' : 'red';
  let value = warning.warning || warning.situationWarning ? 1 : 0;
  value = warning.partialWarning || warning.situationPartWarning ? 0.5 : 0;
  return {
    id,
    value,
    type
  }
}

