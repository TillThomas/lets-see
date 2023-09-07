"use client"

import { useWarningStore } from "@/stores/warning.store"
import { useEffect } from "react";

export default function Page({ params }: { params: { ID: string } }) {
    let warning = useWarningStore((state) => state.warningDetail);
    if(!warning) {
      let fetch = useWarningStore((state) => state.fetchWarnings);
      useEffect(() => fetch(), []);

      warning = useWarningStore((state) => state.warnings).find((warning) => warning.iso3CountryCode === params.ID);
    }
    
    return <div className="">My Post: {params.ID} Warning: {warning?.title}</div>
  }