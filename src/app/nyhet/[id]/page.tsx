"use client"; // Husk å bruke denne for å sikre riktig bruk av hooks
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchSingleNews } from "@/lib/api";
import Image from "next/image";

interface Nyhet {
  id: string;
  content: Array<{
    type: string;
    files?: Array<{ url?: string; caption?: string }>;
    data?: string;
  }>;
  title?: string;
}

export default function NyhetDetaljer() {
  const params = useParams();
  const id = params?.id as string; // Sikrer at ID-en er en string
  const [nyhet, setNyhet] = useState<Nyhet | null>(null);
  const [feil, setFeil] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setFeil("Ugyldig ID");
      return;
    }

    const isValidId = /^[a-fA-F0-9]{24}$/.test(id);
    if (!isValidId) {
      setFeil("Ugyldig ID-format. Må være en 24-tegns hex-streng.");
      return;
    }

    async function hentNyhet() {
      try {
        const data = await fetchSingleNews(id);
        setNyhet(data);
      } catch (error) {
        console.error("Feil ved henting av nyheten:", error);
        setFeil("Kunne ikke laste inn nyhet.");
      }
    }

    hentNyhet();
  }, [id]);

  if (feil) return <p className="text-red-500">{feil}</p>;
  if (!nyhet) return <p>Laster nyhet...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{nyhet.title}</h1>

      {nyhet.content?.map((item, index) => (
        <div key={index}>
          {item.type === "PICTURES" &&
            item.files?.map((file, fileIndex) => (
              <Image key={fileIndex} src={file.url} alt={file.caption || "Bilde"} width={800} height={500} />
            ))}

          {item.type === "MARKUP" && (
            <div dangerouslySetInnerHTML={{ __html: item.data ?? "" }} className="prose max-w-none" />
          )}
        </div>
      ))}
    </div>
  );
}
