"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Profile from "@/src/components/molecules/profile";
import { PublicProfileSection } from "../components/profile/public-profile-form"
import { PersonalInfoSection } from "../components/profile/personal-info-form"
import { UserPen, Shield, BellDot } from "lucide-react"
import CreatorSidebar from "@/src/components/organisms/creator-sidebar"
import { useAuth } from "@/src/features/auth/hooks/useAuth"
import { PasswordAndSecurity } from "../components/security/password-and-security"
import { TwoFactorAuth } from "../components/security/two-factor-auth"
import { NotificationsTab } from "../components/notifications/notifications-tab"

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

export function SettingsContainer() {
    const { user, loading } = useAuth();
    const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications">("profile");

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
        location: "manila",
    })

    const handleFieldChange = (field: keyof ProfileSettings, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleRemovePicture = () => {
        setFormData((prev) => ({ ...prev, profilePic: null }))
    }

    const handleUploadPicture = (file: File) => {
        const imageUrl = URL.createObjectURL(file)
        setFormData((prev) => ({ ...prev, profilePic: imageUrl }))
    }

    if (loading) return null;
    if (!user) return null;

    return (
        <main className="flex flex-row w-full min-h-screen overflow-hidden">
            <CreatorSidebar />
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

                    <h1 className="text-[40px] font-normal mb-2 mt-5">
                        {activeTab === "profile" && "Profile Settings"}
                        {activeTab === "security" && "Security Settings"}
                        {activeTab === "notifications" && "Notification Settings"}
                    </h1>

                    {activeTab === "profile" && (
                        <div className="flex flex-col gap-6">
                            <PublicProfileSection 
                                data={formData} 
                                onChange={handleFieldChange} 
                                onRemovePicture={handleRemovePicture}
                                onUploadPicture={handleUploadPicture}
                            />
                            <PersonalInfoSection 
                                data={formData} 
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
                            <NotificationsTab />
                        </div>
                    )}

                    <div className="flex justify-end mt-8">
                        <Button className="bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white px-8 py-6 text-base">
                            Save Changes
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    )
}