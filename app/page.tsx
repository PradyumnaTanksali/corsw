import { Masthead } from "@/components/sections/Masthead";
import { Foundation } from "@/components/sections/Foundation";
import { Divisions } from "@/components/sections/Divisions";
import { IndexSection } from "@/components/sections/Index";
import { Coordinates } from "@/components/sections/Coordinates";
import { Manifesto } from "@/components/sections/Manifesto";
import { Provenance } from "@/components/sections/Provenance";
import { Ledger } from "@/components/sections/Ledger";
import { Colophon } from "@/components/sections/Colophon";

export default function Home() {
  return (
    <main>
      <Masthead />
      <Foundation />
      <Divisions />
      <IndexSection />
      <Coordinates />
      <Manifesto />
      <Provenance />
      <Ledger />
      <Colophon />
    </main>
  );
}
