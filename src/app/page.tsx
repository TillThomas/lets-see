'use client'

import Map from '@/components/map';
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
    debugger
    return Object.values(data.response) 
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className='w-screen h-screen bg-white'><ParentSize>{({ width, height }) => <Map width={width} height={height}  />}</ParentSize></div>
    </main>
  )
}


