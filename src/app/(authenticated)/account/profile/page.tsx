import { CardCompact } from "@/components/card-compact";
import { Heading } from "@/components/Heading";
import { EmailChangeForm } from "@/features/password/components/email-change-form";
import { AccountTabs } from "../_navigation/tabs";

const Profile = () => {
  return (
    <>
      <div className="flex-1 flex flex-col gap-y-8">
        <Heading
          title="Profile"
          description="All your profile information"
          tabs={<AccountTabs />}
        />

        <div className="flex-1 flex flex-col items-center">
          <CardCompact
            title="Change Your Email"
            description="Enter your new email address"
            className="w-full max-w-[420px] animate-fade-from-top"
            content={<EmailChangeForm />}
          />
        </div>
      </div>
    </>
  );
};

export default Profile;
