/* eslint-disable @typescript-eslint/no-unused-vars */
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { useForm } from "react-hook-form";
import { useSigner } from "wagmi";
import * as yup from "yup";
import { getEASContract, registerEASSchema } from "~~/services/eas/EAS";

type Comment = {
  author: string;
  body: string;
};

type Attestation = {
  attestationId: string;
  paperId: string;
  description: string;
  timestamp: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ReviewProps = {
  reviewerId: string;
  paperId: string;
  score: number;
  comments: Comment[];
  attestations: Attestation[];
  timestamp: string;
};

// Todo:
// 1. Add form props to match ReviewProps
// 2. Add form validation
const schema = yup.object({
  reviewerId: yup.string().required(),
  score: yup.number().required(),
  comment: yup.string().required(),
});

const ReviewForm: NextPage = () => {
  const { data: signer } = useSigner();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const submitReview = async () => {
    console.log("Submitting Review");
    const easContract = getEASContract(11155111);

    const tx = await registerEASSchema(signer);

    console.log("EAS", { easContract, tx });
  };

  const onSubmit = (data: any) => {
    console.log("data", data);
  };

  return (
    <div className="grid grid-cols-3">
      <div className="col-span-1" />
      <div className="flex flex-auto items-center justify-center h-screen" data-theme="attestation-form">
        <div className="border border-stone-900 w-[400px] p-4 px-12 rounded-lg bg-slate-400 text-slate-900">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Submit Review</h1>
            <p className="text-md">Submit a publication review</p>
          </div>
          <div className="mt-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col">
                <label className="text-md">Name</label>
                <input
                  {...register("reviewerId")}
                  type="text"
                  className="input border rounded-md text-slate-400 mt-2"
                  placeholder="Enter your address or ENS name"
                  autoComplete="off"
                />
                <ErrorFeedback error={errors.reviewerId?.message} />
                <label className="text-md mt-2">Score</label>
                <input
                  {...register("score")}
                  type="number"
                  max={100}
                  min={0}
                  className="input border rounded-md text-slate-400 mt-2"
                  placeholder="Enter your score"
                  autoComplete="off"
                />
                <ErrorFeedback error={errors.score?.message} />
                <label className="text-md mt-2">Review</label>
                <textarea
                  {...register("comment")}
                  className="textarea h-24 border rounded-md text-slate-400 mt-2"
                  placeholder="Enter your review"
                  autoComplete="off"
                />
                <ErrorFeedback error={errors.comment?.message} />
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

const ErrorFeedback = ({ error }: { error: string | undefined }) => {
  return <div className="text-red-500">{error}</div>;
};

export default ReviewForm;
