import React from 'react';
import { scaleQuantize } from '@visx/scale';
import { Graticule, EqualEarth } from '@visx/geo';
import * as topojson from 'topojson-client';
import topology from './world-topo.json';
import { CountryValue } from '@/services/warning.service';
import { Zoom } from '@visx/zoom';
import style from './map.module.scss';

export const background = '#f9f7e8';

export type GeoMercatorProps = {
  width: number;
  height: number;
  countryValues?: CountryValue[];
  eventCallback?: (countryValue: CountryValue) => any
};


export interface FeatureShape {
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

const ranges = new Map<string, string[]>(
  [
    ['red', ['#ffb01d', '#ffa020', '#ff9221', '#ff8424', '#ff7425', '#fc5e2f', '#f94b3a', '#f63a48']],
    ['green', ['#ffb01d', '#ccff33', '#99ff33', '#66ff33', '#33cc33', '#00cc00', '#339933', '#339933']]
  ])

function getColor(countryValue: CountryValue)  {
  return scaleQuantize({
    domain: [
      0,
      1,
    ],
    range: ranges.get(countryValue.type ?? 'red'),
  })(countryValue.value);
}

export default function MapComponent({ width, height, eventCallback , countryValues}: GeoMercatorProps) {
  const centerX = width / 2;
  const centerY = height / 2;

  const minScale = (height / 300) * 100;
  const maxScale = 2000;
  const initialScale = Math.max((height / 630) * 100, minScale);

  console.log(initialScale)

  return width < 10 ? null : (

    <Zoom<SVGSVGElement>
    width={width}
    height={height}
    scaleXMin={minScale}
    scaleXMax={maxScale}
    scaleYMin={minScale}
    scaleYMax={maxScale}
    initialTransformMatrix={{
      scaleX: initialScale,
      scaleY: initialScale,
      translateX: centerX,
      translateY: centerY,
      skewX: 0,
      skewY: 0,
    }}
  >
    {(zoom) => (
      <div className={style.container}>
        <svg width={width} 
          height={height}               
          className={zoom.isDragging ? 'dragging' : undefined}
          ref={zoom.containerRef}
          style={{ touchAction: 'none' }}>
          <rect x={0} y={0} width={width} height={height} fill={background} rx={14} />

          {/** intercept all mouse events */}
          <rect
              x={0}
              y={0}
              width={width}
              height={height}
              rx={14}
              fill="transparent"
              onClick={() => {console.log('click'); }}
              onTouchStart={zoom.dragStart}
              onTouchMove={zoom.dragMove}
              onTouchEnd={zoom.dragEnd}
              onMouseDown={() => {console.log('start'),zoom.dragStart}}
              onMouseMove={() => {console.log('move'),zoom.dragMove}}
              onMouseUp={zoom.dragEnd}
              onMouseLeave={() => {
                if (zoom.isDragging) zoom.dragEnd();
              }}
            />

          <EqualEarth<FeatureShape>
            data={world.features}
            scale={zoom.transformMatrix.scaleX}
            translate={[zoom.transformMatrix.translateX, zoom.transformMatrix.translateY]}>
            {(mercator) => (
              <g>
                <Graticule graticule={(g) => mercator.path(g) || ''} stroke="rgba(33,33,33,0.05)" />
                {mercator.features.map(({ feature, path }, i) => (
                  <path
                    key={`map-feature-${i}`}
                    d={path || ''}
                    fill={getColor(matchValueToFeature(countryValues, feature))}
                    stroke={background}
                    strokeWidth={0.5}
                    onClick={() => {
                      if (eventCallback) eventCallback(matchValueToFeature(countryValues, feature));
                    }}
                  />
                ))}
              </g>
            )}
          </EqualEarth>
        </svg>
          <div className={style.controls}>
            <button
              className={style.btn}
              onClick={() => zoom.scale({ scaleX: 1.2, scaleY: 1.2 })}>
              <svg>
                <use href='/zoom_in.svg#zoom_in'></use>
              </svg>
            </button>
            <button
              className={style.btn}
              onClick={() => zoom.scale({ scaleX: 0.8, scaleY: 0.8 })}>
              <svg>
                <use href='/zoom_out.svg#zoom_out'></use>
              </svg>
            </button>
            <button className={style.btn}
              onClick={zoom.reset}>
              <svg>
                <use href='/crop_free.svg#crop_free'></use>
              </svg>
            </button>
          </div>
        </div>
      )}
    </Zoom>
  );
}

function matchValueToFeature(countryValues: CountryValue[] | undefined, feature: FeatureShape): CountryValue {
  return countryValues?.find((countryValue) => { return countryValue.id === feature.id; }) ?? {id: '', value: 0};
}

