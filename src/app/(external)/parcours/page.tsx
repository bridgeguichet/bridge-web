"use client";

import { Button } from "@/components/ui/button";

export default function Parcours(){
    return(
        <div>
            <div className="p-2">
                <Button
                onClick={()=> {
                    window.location.href = "/parcours/diaspora"
                }}
                >
                Diaspora
                </Button>
            </div>
            <div className="p-2">
                <Button
                onClick={()=> {
                    window.location.href = "/parcours/expat"
                }}
                >
                Expat
                </Button>
            </div>
            <div className="p-2">
                <Button
                onClick={()=> {
                    window.location.href = "/parcours/investisseur"
                }}
                >
                Investisseur
                </Button>
            </div>
            <div className="p-2">
                <Button
                onClick={()=> {
                    window.location.href = "/parcours/nextgen"
                }}
                >
                NextGen (18-26ans)
                </Button>
            </div>
            <div className="p-2">
                <Button
                onClick={()=> {
                    window.location.href = "/parcours/retraite"
                }}
                >
                Retraite
                </Button>
            </div>
        </div>
    )
}