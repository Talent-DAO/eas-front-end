import { NextPage } from "next";

const AttestForm: NextPage = () => {
  const submitReview = () => {
    console.log("Submitting Review");
  };

  return (
    <div className="grid grid-cols-3">
      <div className="col-span-1" />
      <div className="flex flex-auto items-center justify-center h-screen" data-theme="attestation-form">
        <div className="border border-stone-900 p-4 px-12 rounded-lg bg-slate-400 text-slate-900">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Submit Review</h1>
            <p className="text-md">Submit a publication review</p>
          </div>
          <div className="mt-4">
            <form
              onSubmit={e => {
                e.preventDefault();
                submitReview();
              }}
            >
              <div className="flex flex-col">
                <label className="text-md">Name</label>
                <input
                  type="text"
                  className="input border rounded-md text-slate-400 mt-2"
                  placeholder="Enter your name"
                  autoComplete="off"
                />
                <label className="text-md mt-2">Score</label>
                <input
                  type="number"
                  max={5}
                  min={0}
                  className="input border rounded-md text-slate-400 mt-2"
                  placeholder="Enter your score"
                  autoComplete="off"
                />
                <label className="text-md mt-2">Review</label>
                <textarea
                  className="textarea h-24 border rounded-md text-slate-400 mt-2"
                  placeholder="Enter your review"
                  autoComplete="off"
                />
                <button type="submit" className="btn btn-primary rounded-md mt-4">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="col-span-1" />
    </div>
  );
};

export default AttestForm;
