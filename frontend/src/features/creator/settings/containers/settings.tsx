"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Profile from "@/src/components/molecules/profile";
import { PublicProfileSection } from "../components/profile/public-profile-form";
import { PersonalInfoSection } from "../components/profile/personal-info-form";
import { UserPen, Shield, BellDot, Pencil } from "lucide-react";
import CreatorSidebar from "@/src/components/organisms/creator-sidebar";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { PasswordAndSecurity } from "../components/security/password-and-security";
import { TwoFactorAuth } from "../components/security/two-factor-auth";
import { NotificationsTab } from "../components/notifications/notifications-tab";
import ClientSidebar from "@/src/features/client/dashboard/components/client-sidebar";
import {
  logoutUser,
  removeProfilePicture,
  updateCurrentUser,
  uploadProfilePicture,
} from "@/src/features/auth/services/auth-session";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// Define the interface right here in the container
export interface ProfileSettings {
  profilePic: string | null;
  displayName: string;
  primaryHandle: string;
  bio: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  accountEmail: string;
  phoneNumber?: string;
  location?: string;
}

function capitalizeMessage(message: string) {
  return message.charAt(0).toUpperCase() + message.slice(1);
}

function normalizeName(value: string) {
  return value
    .replace(/[^\p{L}\p{M}'’\-\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function SettingsContainer() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "notifications"
  >("profile");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileErrors, setProfileErrors] = useState<Partial<Record<keyof ProfileSettings, string>>>({});

  const [formData, setFormData] = useState<ProfileSettings>({
    profilePic: null,
    displayName: "",
    primaryHandle: "",
    bio: "",
    firstName: "",
    lastName: "",
    middleName: "",
    accountEmail: "",
    phoneNumber: "",
    location: "Asia/Manila",
  });

  useEffect(() => {
    if (!user) return;
    // Auth data arrives asynchronously; seed the editable form once it does.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((prev) => ({
      ...prev,
      displayName:
        user.display_name || `${user.first_name} ${user.last_name}`.trim(),
      primaryHandle: user.primary_handle ?? "",
      bio: user.bio ?? "",
      firstName: user.first_name,
      lastName: user.last_name,
      middleName: user.middle_name ?? "",
      accountEmail: user.email,
      phoneNumber: user.phone_number ?? "",
      location: user.timezone || "Asia/Manila",
      profilePic: user.profile_picture_url,
    }));
  }, [user]);

  const saveProfile = useMutation({
    mutationFn: (profile: ProfileSettings) =>
      updateCurrentUser({
        firstName: profile.firstName,
        lastName: profile.lastName,
        middleName: profile.middleName ?? "",
        displayName: profile.displayName,
        primaryHandle: profile.primaryHandle,
        bio: profile.bio,
        email: profile.accountEmail,
        phoneNumber: profile.phoneNumber ?? "",
        timezone: profile.location ?? "Asia/Manila",
      }),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["auth-user"], updatedUser);
      setProfileErrors({});
      setIsEditing(false);
    },
    onError: (error) => {
      if (!(error instanceof Error)) return;

      const message = capitalizeMessage(error.message);
      if (/email/i.test(message)) {
        setProfileErrors((previous) => ({
          ...previous,
          accountEmail: message,
        }));
      }
    },
  });

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await logoutUser();
      queryClient.setQueryData(["auth-user"], null);
      queryClient.removeQueries({ queryKey: ["auth-user"] });
      router.replace("/login");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleFieldChange = <K extends keyof ProfileSettings>(
    field: K,
    value: ProfileSettings[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setProfileErrors((prev) => ({ ...prev, [field]: undefined }));
    if (saveProfile.isError) saveProfile.reset();
  };

  const validateProfile = (profile: ProfileSettings) => {
    const errors: Partial<Record<keyof ProfileSettings, string>> = {};
    if (!profile.displayName.trim()) errors.displayName = "Display name is required.";
    if (profile.primaryHandle && !/^[a-zA-Z0-9._]{3,30}$/.test(profile.primaryHandle)) {
      errors.primaryHandle = "Primary handle must be 3–30 letters, numbers, dots, or underscores.";
    }
    if (!profile.firstName) errors.firstName = "First name is required.";
    if (!profile.lastName) errors.lastName = "Last name is required.";
    if (!/^\S+@\S+\.\S+$/.test(profile.accountEmail)) {
      errors.accountEmail = "Account email must be a valid email address.";
    }
    if (profile.phoneNumber && !/^\d{7,15}$/.test(profile.phoneNumber)) {
      errors.phoneNumber = "Phone number must contain 7–15 digits.";
    }
    if (!profile.location) errors.location = "Location / timezone is required.";
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = () => {
    const normalizedProfile = {
      ...formData,
      firstName: normalizeName(formData.firstName),
      lastName: normalizeName(formData.lastName),
      middleName: normalizeName(formData.middleName ?? ""),
    };

    setFormData(normalizedProfile);
    if (validateProfile(normalizedProfile)) saveProfile.mutate(normalizedProfile);
  };

  const handleCancelEdit = () => {
    if (!user) return;

    setFormData((prev) => ({
      ...prev,
      displayName:
        user.display_name || `${user.first_name} ${user.last_name}`.trim(),
      primaryHandle: user.primary_handle,
      bio: user.bio,
      firstName: user.first_name,
      lastName: user.last_name,
      middleName: user.middle_name,
      accountEmail: user.email,
      phoneNumber: user.phone_number,
      location: user.timezone,
    }));
    saveProfile.reset();
    setProfileErrors({});
    setIsEditing(false);
  };

  const handleRemovePicture = () => {
    pictureMutation.mutate({ type: "remove" });
  };

  const handleUploadPicture = (file: File) => {
    pictureMutation.mutate({ type: "upload", file });
  };

  const pictureMutation = useMutation({
    mutationFn: (
      action: { type: "remove" } | { type: "upload"; file: File },
    ) =>
      action.type === "remove"
        ? removeProfilePicture()
        : uploadProfilePicture(action.file),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["auth-user"], updatedUser);
      setFormData((prev) => ({
        ...prev,
        profilePic: updatedUser.profile_picture_url,
      }));
    },
  });

  if (loading) return null;
  if (!user) return null;

  return (
    <main className="flex flex-row w-full min-h-screen overflow-hidden">
      {user.role === "CLIENT" ? (
        <ClientSidebar isSigningOut={isSigningOut} onSignOut={handleSignOut} />
      ) : (
        <CreatorSidebar />
      )}
      <section className="flex-1 overflow-y-auto h-screen scrollbar-gutter-stable px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-gray-200">
            {/* nav tabs */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-2 font-bold text-sm pb-6 -mb-[2px] border-b-2 transition-colors ${activeTab === "profile" ? "text-[#6b1fa8] border-[#6b1fa8]" : "text-gray-400 hover:text-gray-600 border-transparent"}`}
              >
                <UserPen size={18} className="-mt-1" />
                PROFILE
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={`flex items-center gap-2 font-bold text-sm pb-6 -mb-[2px] border-b-2 transition-colors ${activeTab === "security" ? "text-[#6b1fa8] border-[#6b1fa8]" : "text-gray-400 hover:text-gray-600 border-transparent"}`}
              >
                <Shield size={18} className="-mt-1" />
                SECURITY
              </button>

              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center gap-2 font-bold text-sm pb-6 -mb-[2px] border-b-2 transition-colors ${activeTab === "notifications" ? "text-[#6b1fa8] border-[#6b1fa8]" : "text-gray-400 hover:text-gray-600 border-transparent"}`}
              >
                <BellDot size={18} className="-mt-1" />
                NOTIFICATIONS
              </button>
            </div>

            {/* profile and notifs */}
            <div className="shrink-0 pb-3">
              <Profile
                firstName={user?.first_name}
                lastName={user?.last_name}
                email={user?.email}
              />
            </div>
          </div>

          <div className="mb-2 mt-5 flex items-center justify-between gap-4">
            <h1 className="text-[40px] font-normal">
              {activeTab === "profile" && "Profile Settings"}
              {activeTab === "security" && "Security Settings"}
              {activeTab === "notifications" && "Notification Settings"}
            </h1>
            {activeTab === "profile" && !isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  saveProfile.reset();
                  setIsEditing(true);
                }}
                className="border-[#6b1fa8] text-[#6b1fa8] hover:bg-[#f7f0fc] hover:text-[#5a1a8f]"
              >
                <Pencil className="size-4" />
                Edit
              </Button>
            )}
          </div>

          {activeTab === "profile" && (
            <div className="flex flex-col gap-6">
              <PublicProfileSection
                data={formData}
                errors={profileErrors}
                isEditing={isEditing}
                onChange={handleFieldChange}
                onRemovePicture={handleRemovePicture}
                onUploadPicture={handleUploadPicture}
                isUploading={pictureMutation.isPending}
              />
              <PersonalInfoSection
                data={formData}
                errors={profileErrors}
                isEditing={isEditing}
                onChange={handleFieldChange}
              />
            </div>
          )}

          {activeTab === "security" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <PasswordAndSecurity />
              <TwoFactorAuth />
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="flex flex-col gap-6">
              <NotificationsTab isClient={user.role === "CLIENT"} />
            </div>
          )}

          {activeTab === "profile" && (isEditing || saveProfile.isSuccess) && (
            <div className="mt-8 flex flex-col items-end gap-2">
              {saveProfile.error instanceof Error &&
                !/email/i.test(saveProfile.error.message) && (
                <p role="alert" className="text-sm text-red-600">
                  {capitalizeMessage(saveProfile.error.message)}
                </p>
              )}
              {saveProfile.isSuccess && (
                <p role="status" className="text-sm text-green-600">
                  Profile updated.
                </p>
              )}
              {isEditing && (
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={saveProfile.isPending}
                    className="px-8 py-6 text-base"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={saveProfile.isPending}
                    className="bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white px-8 py-6 text-base"
                  >
                    {saveProfile.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
