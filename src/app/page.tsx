import Link from "next/link";
import { Heading } from "@/components/Heading";
import { ticketsPath } from "./paths";

const Homepage = () => {
  return (
    <div className="flex-1 flex flex-col gap-y-8">

      <Heading 
      title='Homepage'
      description='Your home place to start'
      />

      <div className="flex-1 flex flex-col items-center">
        <Link href={ticketsPath()} className="text-sm underline">
          Go to tickets
        </Link>
      </div>
    </div>
  );
};

export default Homepage;
