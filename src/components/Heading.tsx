import { Separator } from "@/components/ui/separator"

type headingTypes = {
  tabs?: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

const Heading = ({tabs, title, description, actions}: headingTypes) => {
  return (
    <>
    {tabs}
    <div className="flex items-center justify-between px-8">
      <div className="md:ml-6">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="flex gap-x-2">
        {actions}
      </div>
    </div>

      <Separator />
    </>
  );
};

export { Heading };
