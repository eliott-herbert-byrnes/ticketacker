import { ReDirectToast } from "@/components/redirect-toast";

type RootTemplateProps = {
  children: React.ReactNode;
};

export default function Template({ children }: RootTemplateProps) {
  return (
    <>
      <>{children}</>
      <ReDirectToast />
    </>
  );
}
