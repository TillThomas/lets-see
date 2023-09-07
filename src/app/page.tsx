'use client'

import Map, { CountryValue } from '@/components/map';
import { ITravelWarning } from '@/models/travelWarning.model';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { useEffect, useState } from 'react';

export default function Home() {
  const [travelWarnings, setTravelWarnings] = useState<ITravelWarning[]>([]);

  useEffect(() => {
    fetch('https://www.auswaertiges-amt.de/opendata/travelwarning')
    .then((res) => res.json())
    .then((data) => formatData(data))
    .then((formatedData) => setTravelWarnings(formatedData))
  }, []);

  async function formatData(data: {response: ITravelWarning[]}): Promise<ITravelWarning[]> {
    return Object.values(data.response) 
  }

  return (
    <main className="flex w-screen h-screen flex-col items-center justify-center">
      <div className='w-5/6 h-5/6 '><ParentSize>{({ width, height }) => <Map width={width} height={height} events={true} countryValues={getCountryValues(travelWarnings)} />}</ParentSize></div>
    </main>
  )
}

function getCountryValues(travelWarnings: ITravelWarning[]): CountryValue[] {
  return travelWarnings.map((warning: ITravelWarning) => {return {
    id: warning.iso3CountryCode,
    value: getValue(warning)
  }})
}

function getValue(warning: ITravelWarning): number {
  if(warning.warning) return 1
  if(warning.partialWarning) return 0.5
  return 0
}

