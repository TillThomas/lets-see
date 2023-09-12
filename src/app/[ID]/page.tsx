"use client"

import { useWarningStore } from "@/stores/warning.store"
import { useEffect } from "react";
import './details.module.css';
import { sanitize } from "isomorphic-dompurify";
import Country from "@/components/country";
import { FeatureShape } from "@/components/map";
import * as topojson from 'topojson-client';
import topology from '../../components/world-topo.json';
import { ParentSize } from "@visx/responsive";
import WarningService from "@/services/warning.service";


export default function Page({ params }: { params: { ID: string } }) {
    let fetch = useWarningStore((state) => state.fetchWarnings);
    let fetchDetails = useWarningStore((state) => state.fetchWarningDetails);

    // @ts-expect-error
    const world = topojson.feature(topology, topology.objects.units) as {
      type: 'FeatureCollection';
      features: FeatureShape[];
    };
    const warningDetail = useWarningStore((state) => state.warningDetail);
    const countryFeature = world.features.find((value) => value.id === params.ID);
  
    useEffect(() => {
      fetch()
      .then((warnings) => { return warnings.find((warning) => warning.iso3CountryCode === params.ID)?.contentID ?? ''})
      .then((contentId) => {
        if(contentId) fetchDetails(contentId);
      })
    }, []);


    return <div className="h-screen m-auto lg:w-9/12 w-11/12">
      <h1 className="m-24 font-bold">{warningDetail?.title}</h1>
      { countryFeature ? 
            <div className='w-5/6 m-auto '>
            <ParentSize>{({ width, height }) => 
              <Country width={width} height={300} 
                countryFeature={countryFeature}
                countryValue={{id: params.ID, value: warningDetail ? WarningService.getCountryValue(warningDetail).value : 0}}></Country>}       
            </ParentSize>
          </div> : <span></span>}
      <div className="details" dangerouslySetInnerHTML={{__html: sanitize(warningDetail?.content ?? '')}}></div>
      </div>
  }
