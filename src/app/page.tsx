"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { generateHKID } from "~/lib/hkid";
import { generateNRIC } from "~/lib/nric";

const regions = ["uk", "sg", "tw", "hk", "id", "my", "th", "vn", "in"];

export default function HomePage() {
  const [selectedRegion, setSelectedRegion] = useState<string>("sg");
  const [number, setNumber] = useState<string>("T0477406F");
  const [tin, setTin] = useState<string>("S8240678F");

  function selectRegion(region: string) {
    setSelectedRegion(region)
  }

  function regenerate() {
    switch (selectedRegion) {
      case "sg":
        setTin(generateNRIC());
        setNumber(generateSGPhoneNumber());
        break;
      case "hk":
        setTin(() => generateHKID(null))
    }
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-row gap-2 p-4">
        {regions.map((region) =>
          selectedRegion === region ? (
            <Button className="w-16" variant={"outline"} key={region}>{region}</Button>
          ) : (
            <Button className="w-16" onClick={() => selectRegion(region)} key={region}>{region}</Button>
          ),
        )}
      </div>
      <Button onClick={regenerate}>regenerate</Button>
      <div className="flex flex-row gap-4">
        <div className="text-center">
          <h1 className="border-b-1 text-lg">phone number</h1>
          <p className="font-mono">{number}</p>
        </div>
        <div className="text-center">
          <h1 className="border-b-1 text-lg">{selectedRegion === "sg" ? "nric" : "tin"}</h1>
          <p className="font-mono">{tin}</p>
        </div>
      </div>
    </div>
  );
}

function generateSGPhoneNumber() {
  let number = "6";
  for (let i = 0; i < 7; i++) {
    number += String(Math.floor(Math.random() * 10));
  }
  return number;
}
