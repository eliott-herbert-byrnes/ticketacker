import { Separator } from "@/components/ui/separator";
import { OrganizationStatus } from "@/features/organization/components/organization-status";

type headingTypes = {
  tabs?: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
};

const Heading = ({
  tabs,
  title,
  description,
  actions,
  badge,
}: headingTypes) => {
  return (
    <>
      <div className="flex justify-between md:px-8 flex-col md:flex-row gap-y-0 md:gap-y-3 md:gap-y-0 md:items-center mr-4 md:mr-0">
        <div className="md:ml-6 flex flex-col gap-y-2">
          {tabs}
          {badge}
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
          <OrganizationStatus />
        </div>
        <div className="flex gap-x-2 mt-4 md:mr-0 md:ml-6 md:mt-0">{actions}</div>
      </div>

      <div className="md:px-16">
        <Separator />
      </div>
    </>
  );
};

export { Heading };
