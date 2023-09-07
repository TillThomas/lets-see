import React from 'react';
import { scaleQuantize } from '@visx/scale';
import { Mercator, Graticule } from '@visx/geo';
import * as topojson from 'topojson-client';
import topology from './world-topo.json';

export const background = '#f9f7e8';

export type GeoMercatorProps = {
  width: number;
  height: number;
  events?: boolean;
  countryValues?: CountryValue[]
};

export type CountryValue = {
  id: string,
  value: number
};

interface FeatureShape {
  type: 'Feature';
  id: string;
  geometry: { coordinates: [number, number][][]; type: 'Polygon' };
  properties: { name: string };
}

// @ts-expect-error
const world = topojson.feature(topology, topology.objects.units) as {
  type: 'FeatureCollection';
  features: FeatureShape[];
};

const color = scaleQuantize({
  domain: [
    0,
    1,
  ],
  range: ['#ffb01d', '#ffa020', '#ff9221', '#ff8424', '#ff7425', '#fc5e2f', '#f94b3a', '#f63a48'],
});

export default function ({ width, height, events = false , countryValues: countryValue}: GeoMercatorProps) {
  const centerX = width / 2;
  const centerY = height / 2;
  const scale = (width / 630) * 100;

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect x={0} y={0} width={width} height={height} fill={background} rx={14} />
      <Mercator<FeatureShape>
        data={world.features}
        scale={scale}
        translate={[centerX, centerY + 50]}
      >
        {(mercator) => (
          <g>
            <Graticule graticule={(g) => mercator.path(g) || ''} stroke="rgba(33,33,33,0.05)" />
            {mercator.features.map(({ feature, path }, i) => (
              <path
                key={`map-feature-${i}`}
                d={path || ''}
                fill={color(matchValueToFeature(countryValue, feature))}
                stroke={background}
                strokeWidth={0.5}
                onClick={() => {
                  if (events) alert(`Clicked: ${feature.properties.name} (${feature.id})`);
                }}
              />
            ))}
          </g>
        )}
      </Mercator>
    </svg>
  );
}

function matchValueToFeature(countryValue: CountryValue[] | undefined, feature: FeatureShape): number {
  return countryValue?.find((countryValue) => { return countryValue.id === feature.id; })?.value ?? 0;
}
