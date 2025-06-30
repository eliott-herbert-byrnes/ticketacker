import { Separator } from "@/components/ui/separator"

type headingTypes = {
  title: string;
  description?: string;
}

const Heading = ({title, description}: headingTypes) => {
  return (
    <>
      <div className="">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      <Separator />
    </>
  );
};

export { Heading };
