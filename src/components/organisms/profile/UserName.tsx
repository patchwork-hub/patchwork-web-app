import { ChevronsRight } from "lucide-react";

type UserNameProps = {
  username: string;
  joinedDate?: string;
};

const UserName = ({ username, joinedDate = "" }: UserNameProps) => {
  return (
    <div className="flex flex-wrap justify-start items-center gap-x-1 text-gray-400 text-sm">
      {username && <span className="text-orange-500">@{username}</span>}
      {joinedDate !== "Invalid Date" && (
        <p className="flex justify-start items-center">
          <ChevronsRight size={15} />
          {joinedDate}
        </p>
      )}
    </div>
  );
};

export default UserName;
