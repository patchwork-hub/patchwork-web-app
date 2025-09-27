"use client";

import ImagePicker from "@/components/molecules/ImagePicker";
import { useVerifyAuthToken } from "@/hooks/queries/useVerifyAuthToken.query";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState } from "react";
import GoBack from "@/components/molecules/common/GoBack";
import ProfileEditForm from "@/components/templates/profile/ProfileEditForm";

const ProfileEditPage = () => {
  const { data: userInfo } = useVerifyAuthToken({ enabled: true });
  const [headerCrop, setHeaderCrop] = useState<File>();
  const [avatarCrop, setAvatarCrop] = useState<File>();
  const { theme } = useTheme();
  const headerPreview = headerCrop ? URL.createObjectURL(headerCrop) : null;
  const avatarPreview = avatarCrop ? URL.createObjectURL(avatarCrop) : null;

  return (
    <div>
      <div className="w-full h-[200px] bg-gray-400 relative">
        <ImagePicker onCrop={setHeaderCrop} defaultRatio="3.35:1">
          {userInfo?.header && (
            <Image
              className="h-[200px] aspect-[3.35/1] object-cover"
              src={headerPreview || userInfo?.header}
              width={700}
              height={200}
              alt="Preview"
            />
          )}
        </ImagePicker>
        <div className="absolute top-4 left-4">
          <GoBack className="bg-gray-500 opacity-80 text-[#fff]" />
        </div>
      </div>
      <div className="px-4 -translate-y-6">
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-gray-500 bg-gray-400",
              {
                "border-gray-50": theme === "light",
              }
            )}
          >
            <ImagePicker onCrop={setAvatarCrop} defaultRatio="1:1">
              {userInfo?.avatar && (
                <Image
                  className="aspect-square object-cover"
                  src={avatarPreview || userInfo?.avatar}
                  width={100}
                  height={100}
                  alt="Preview"
                />
              )}
            </ImagePicker>
          </div>
          <p>{userInfo?.display_name || userInfo?.username}</p>
          <ProfileEditForm
            userId={userInfo && userInfo?.id}
            headerImage={headerCrop || ""}
            avatarImage={avatarCrop || ""}
            display_name={userInfo?.display_name || userInfo?.username}
            note={userInfo?.note || ""}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;
