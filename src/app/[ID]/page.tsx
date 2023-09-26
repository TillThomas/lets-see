"use client"

import { useWarningStore } from "@/stores/warning.store"
import { MouseEventHandler, useEffect } from "react";
import { sanitize } from "isomorphic-dompurify";
import Country from "@/components/country";
import { FeatureShape } from "@/components/map";
import * as topojson from 'topojson-client';
import topology from '../../components/world-topo.json';
import { ParentSize } from "@visx/responsive";
import WarningService from "@/services/warning.service";
import { useRouter } from "next/navigation";
import Image from "next/image";
import style from './details.module.css';


export default function Page({ params }: { params: { ID: string } }) {
    let fetch = useWarningStore((state) => state.fetchWarnings);
    let fetchDetails = useWarningStore((state) => state.fetchWarningDetails);
    const router = useRouter();

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


    function back(): MouseEventHandler<HTMLButtonElement> | undefined {
      return () => {router.push('/')}
    }

    return <div className="h-screen m-auto ">
      <div className={style.header}>
        <button className="pointer" onClick={back()}>
          <Image className="" src='/arrow_back_ios.svg' alt="back to world map" width={48} height={48}/>
        </button>
        <h1 className="font-bold">{warningDetail?.title}</h1>
      </div>
      <div className="m-auto  w-11/12 lg:w-6/12 xxl:w-4/12">
        { countryFeature ? 
              <div className='mt-24 w-5/6 m-auto '>
              <ParentSize>{({ width }) => 
                <Country width={width} height={300} 
                  countryFeature={countryFeature}
                  countryValue={{id: params.ID, value: warningDetail ? WarningService.getCountryValue(warningDetail).value : 0}}></Country>}       
              </ParentSize>
            </div> : <></>}
        <div className="details" dangerouslySetInnerHTML={{__html: sanitize(warningDetail?.content ?? '')}}></div>
      </div>
      </div>
  }
