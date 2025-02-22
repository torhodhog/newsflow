"use client";
import { useEffect, useState } from "react";
import { fetchNews, fetchPortals } from "@/lib/api";
import Image from "next/image";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";

interface Nyhet {
  id: string;
  content: Array<{
    type: string;
    files?: Array<{ url?: string; caption?: string }>;
  }>;
  title?: string;
  category?: string;
}

interface Portal {
  _id: string;
  name: string;
}

interface NyhetskortProps {
  portalId: string;
}

export const Nyhetskort: React.FC<NyhetskortProps> = ({ portalId }) => {
  const [portaler, setPortaler] = useState<Portal[]>([]);
  const [valgtPortalId, setValgtPortalId] = useState<string | null>(portalId);
  const [nyheter, setNyheter] = useState<Nyhet[]>([]);

  // Henter portaler ved oppstart
  useEffect(() => {
    async function hentPortaler() {
      try {
        const data = await fetchPortals();
        setPortaler(data);
      } catch (error) {
        console.error("Feil ved henting av portaler:", error);
      }
    }
    hentPortaler();
  }, []);

  // Henter nyheter basert på valgt portal
  useEffect(() => {
    async function hentNyheter() {
      if (valgtPortalId) {
        try {
          const data = await fetchNews(valgtPortalId);
          setNyheter(data);
        } catch (error) {
          console.error("Feil ved henting av nyheter:", error);
        }
      }
    }
    hentNyheter();
  }, [valgtPortalId]);

  return (
    <div>
      <MaxWidthWrapper> 
      {/* 🔹 Portalvalg */}
      <div className="w-full overflow-x-auto border-b border-gray-300 bg-white sticky top-0 z-10 p-4">
        <h2 className="text-xl font-semibold mb-2">Velg en nyhetsportal</h2>
        <div className="flex gap-4 whitespace-nowrap">
          {portaler.map((portal) => (
            <button
              key={portal._id}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                valgtPortalId === portal._id
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setValgtPortalId(portal._id)}
            >
              {portal.name}
            </button>
          ))}
        </div>
      </div>

      {/* 🔹 Nyhetsgrid */}
      <div className="grid grid-cols-3 gap-6 p-6 auto-rows-auto grid-flow-dense">
        {nyheter.length === 0 ? (
          <p>Ingen nyheter tilgjengelig.</p>
        ) : (
          nyheter.map((nyhet, index) => {
            const bildeObj = nyhet.content.find((item) => item.type === "PICTURES");
            const bilde = bildeObj?.files?.[0];

            let gridClass = "col-span-1 row-span-1 h-auto"; // Standard størrelse
            if (index % 6 === 0) gridClass = "col-span-3 row-span-2 h-auto";
            else if (index % 5 === 0) gridClass = "col-span-2 row-span-2 h-auto";

            return (
              <Link key={nyhet.id} href={`/nyhet/${nyhet.id}`} className={`bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-all flex flex-col ${gridClass}`}>
                {bilde?.url && (
                  <Image
                    src={bilde.url}
                    alt={bilde.caption ?? "Nyhetsbilde"}
                    className="w-full object-cover rounded-md mb-4"
                    width={500}
                    height={300}
                  />
                )}
                <h2 className="text-xl font-bold line-clamp-3">{nyhet.title || "Ingen tittel"}</h2>
              </Link>
            );
          })
        )}
      </div>
      </MaxWidthWrapper>
    </div>
  );
};