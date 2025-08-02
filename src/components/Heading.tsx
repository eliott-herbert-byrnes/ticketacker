import { Separator } from "@/components/ui/separator"

type headingTypes = {
  tabs?: React.ReactNode;
  title: string;
  description?: string;
}

const Heading = ({tabs, title, description}: headingTypes) => {
  return (
    <>
    {tabs}
      <div className="md:ml-16">
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
