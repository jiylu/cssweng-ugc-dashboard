import Image from "next/image";
import NotificationsPanel from "./notifications-panel";

type ProfileProps = {
  firstName: string
  lastName: string
  email: string
};

export default function Profile({ firstName, lastName, email }: ProfileProps) {
  return (
    <div className="flex items-center gap-6 pt-2">
        <NotificationsPanel />
        <div className="flex items-center gap-3">
            <div className="text-right">
            <span className="inline-flex items-center text-xs font-medium text-[#6b1fa8] bg-[#6b1fa8]/10 px-3 py-1 rounded-full">
                Creator
            </span>
            <p className="text-base leading-tight text-[#141518]">
                {firstName} {lastName}
            </p>
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
