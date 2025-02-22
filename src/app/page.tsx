import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Nyhetskort } from "@/components/Nyhetskort";

export default function Home() {
  return (
    <MaxWidthWrapper>
      <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
        <Nyhetskort portalId="6305e5da637f90fb8ebb14eb" /> {/* Sørg for at "6305e5da637f90fb8ebb14eb" er en gyldig 24-tegns hex-streng */}
      </div>
    </MaxWidthWrapper>
  );
}