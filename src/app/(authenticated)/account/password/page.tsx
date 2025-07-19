import { Heading } from "@/components/Heading";
import { AccountTabs } from "../_navigation/tabs";

const Password = () => {
  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Password"
        description="Your password information"
        tabs={<AccountTabs />}
      />
    </div>
  );
};

export default Password;
