import { CardCompact } from "@/components/card-compact";
import { Heading } from "@/components/Heading";
import { PasswordChangeForm } from "@/features/password/components/password-change-form";
import { AccountTabs } from "../_navigation/tabs";

const Password = () => {
  return (
    <>
      <div className="flex-1 flex flex-col gap-y-8">
        <Heading
          title="Password"
          description="Your password information"
          tabs={<AccountTabs />}
        />
        <div className="flex-1 flex flex-col items-center">
          <CardCompact
            title="Change Password"
            description="Enter your current password"
            className="w-full max-w-[420px] animate-fade-from-top"
            content={<PasswordChangeForm />}
          />
        </div>
      </div>
    </>
  );
};

export default Password;
