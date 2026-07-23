import Image from "next/image";
import NotificationsPanel from "./notifications-panel";

type ProfileProps = {
  firstName: string
  lastName: string
  email: string
};

export default function Profile({ firstName, lastName, email }: ProfileProps) {
  return (
    <div className="flex items-center gap-8 pt-2">
        <NotificationsPanel />
        <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="inline-flex items-center justify-center text-xs font-medium text-[#6b1fa8] bg-[#6b1fa8]/10 px-2.5 py-1 rounded-full translate-y-[-2px]">
                  <span className="-mb-[3px]">Creator</span>
                </span>
                <p className="text-base leading-tight text-[#141518]">
                  {firstName} {lastName}
                </p>
              </div>
              <p className="text-sm text-[#7b7771]">{email}</p>
            </div>
            <Image
              src="/default-profile.png"
              alt=""
              className="size-[46px] rounded-full"
              width={46}
              height={46}
            />
        </div>
    </div>
  );
}
