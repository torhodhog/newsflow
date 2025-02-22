"use client";
import { useEffect, useState } from "react";
import { fetchNews, fetchPortals } from "@/lib/api";
import Image from "next/image";

interface Nyhet {
  id: string;
  content: Array<{
    type: string;
    files?: Array<{ url?: string; caption?: string }>;
  }>;
  title?: string;
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

  useEffect(() => {
    if (valgtPortalId) {
      async function hentNyheter() {
        try {
          const data = await fetchNews(valgtPortalId as string);
          setNyheter(data);
        } catch (error) {
          console.error("Feil ved henting av nyheter:", error);
        }
      }
      hentNyheter();
    }
  }, [valgtPortalId]);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Velg en portal</h2>
        <select
          onChange={(e) => setValgtPortalId(e.target.value)}
          className="mt-2 p-2 border rounded"
        >
          <option value="">Velg en portal</option>
          {portaler.map((portal) => (
            <option key={portal._id} value={portal._id}>
              {portal.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-6 p-6 auto-rows-auto grid-flow-dense">
        {nyheter.length === 0 ? (
          <p>Ingen nyheter tilgjengelig.</p>
        ) : (
          nyheter.map((nyhet, index) => {
            const bildeObj = nyhet.content.find((item) => item.type === "PICTURES");
            const bilde = bildeObj?.files?.[0];

            // Dynamiske grid-klasser basert på posisjon
            let gridClass = "col-span-1 row-span-1 h-auto"; // Standard størrelse

            if (index % 6 === 0) {
              gridClass = "col-span-3 row-span-2 h-auto"; // Store nyheter
            } else if (index % 5 === 0) {
              gridClass = "col-span-2 row-span-2 h-auto"; // Medium store nyheter
            }

            return (
              <div
                key={nyhet.id || nyhet.title}
                className={`bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-all flex flex-col ${gridClass}`}
              >
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
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
