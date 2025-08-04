"use client";

import Image from "next/image";

export const PrescriptionViewer = ({
  prescriptionUrl,
}: {
  prescriptionUrl: string;
}) => {
  return (
    <div className="relative w-full aspect-video">
      <Image
        src={prescriptionUrl}
        alt="Prescription"
        fill
        className="object-contain rounded-lg"
      />
    </div>
  );
};
