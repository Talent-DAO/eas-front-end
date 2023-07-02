import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import AttestForm from "~~/components/attestation/ReviewForm";

const Attestation: NextPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  return (
    <>
      <MetaHeader
        title="Attestation | Scaffold-ETH 2"
        description="Attestation created with 🏗 Scaffold-ETH 2, showcasing some of its features."
      >
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </MetaHeader>
      <div className="grid lg:grid-cols-1 flex-grow" data-theme="attestation">
        <div className="grid grid-cols-3">
          <div className="col-span-1" />
          <div className="flex flex-auto mt-8 p-4 items-center justify-center border rounded-md">Balance {0}</div>
        </div>
        <AttestForm />
      </div>
    </>
  );
};

export default Attestation;
