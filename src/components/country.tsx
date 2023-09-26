import { Graticule, Mercator } from "@visx/geo";
import { FeatureShape, background } from "./map";
import { CountryValue } from "@/services/warning.service";
import { scaleQuantize } from "@visx/scale";

export type CountryProps = {
    width: number,
    height: number,
    countryFeature: FeatureShape,
    countryValue: CountryValue
}

export default function Country({ width, height, countryFeature, countryValue}: CountryProps) {
    const centerX = width / 2;
  const centerY = height / 2;
  const scale = (width / 630) * 100;

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

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect x={0} y={0} width={width} height={height} fill={background} rx={14} />
      <Mercator<FeatureShape>
        data={[countryFeature]}
        scale={scale}
        fitSize={[[width, height], countryFeature]}>
        {(mercator) => (
          <g>
            <Graticule graticule={(g) => mercator.path(g) || ''} stroke="rgba(33,33,33,0.05)" />
            {mercator.features.map(({ feature, path }, i) => (
              <path
                key={`map-feature-${i}`}
                d={path || ''}
                fill={getColor(countryValue)}
                stroke={background}
                strokeWidth={0.5}
                
              />
            ))}
          </g>
        )}
      </Mercator>
    </svg>
  );
}


function matchValueToFeature(countryValues: CountryValue[] | undefined, feature: FeatureShape): CountryValue {
    return countryValues?.find((countryValue) => { return countryValue.id === feature.id; }) ?? {id: '', value: 0};
  }