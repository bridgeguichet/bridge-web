"use client";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="p-2">
        <Button
         onClick={()=> {
          window.location.href = "/simulateur-parcours"}}
        >
          Simuler mon parcours
        </Button>
      </div>
      <div className="p-2">
        <Button
         onClick={()=> {
          window.location.href = "/parcours"}}
        >
          Je commence mon parcours
        </Button>
      </div>
      <div className="p-2">
        <Button
          onClick={() => {
            window.location.href = "/dashboard";
          }}
        >
          Connexion Dashboard
        </Button>
      </div>
    </div>
  );
}
