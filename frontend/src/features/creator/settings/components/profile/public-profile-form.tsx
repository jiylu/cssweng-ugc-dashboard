import { useRef } from "react"
import { User, Upload, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ProfileSettings } from "../../containers/settings"

interface PublicProfileProps {
  data: ProfileSettings;
  onRemovePicture: () => void;
  onUploadPicture: (file: File) => void;
}

export function PublicProfileSection({ data, onRemovePicture, onUploadPicture }: PublicProfileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onUploadPicture(file)
    }
  }

  return (
    <div className="bg-white border rounded-lg p-8 shadow-sm">
      <h2 className="text-2xl text-[#141518] font-normal border-b border-gray-200 pb-4 mb-8">
        Public Creator Profile
      </h2>
      <p className="mb-6 text-sm text-gray-500">
        Public profile publishing is not available yet. These fields are read-only.
      </p>

      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        disabled
      />

      <div className="flex flex-col md:flex-row gap-10 mb-8 items-start">
        
        <div className="flex flex-col items-center gap-4 shrink-0 md:w-56">
          <div className="w-30 h-30 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border border-gray-800">
            {data.profilePic ? (
              <img src={data.profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-gray-500" />
            )}
          </div>

          {/* profile picture */}
          <DropdownMenu>
            <DropdownMenuTrigger disabled className="text-gray-400 text-[15px] font-normal focus:outline-none">
              Edit profile picture
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
              <DropdownMenuItem 
                className="cursor-pointer flex items-center gap-2" 
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={16} className="-mt-1" />
                <span>Upload new picture</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer text-red-600 focus:text-red-600 flex items-center gap-2"
                onClick={onRemovePicture}
              >
                <Trash2 size={16} className="-mt-1" />
                <span>Remove</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* name and handle */}
        <div className="flex-1 flex flex-col gap-6 w-full">
          <div className="space-y-2">
            <label className="text-[15px] font-normal uppercase text-[#141518]">Display Name</label>
            <Input 
              placeholder="Enter display name" 
              value={data.displayName} 
              disabled
              className="placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[15px] font-normal uppercase text-[#141518]">Primary Handle</label>
            <Input 
              placeholder="Enter primary name" 
              value={data.primaryHandle} 
              disabled
              className="placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* bio */}
      <div className="space-y-2">
        <label className="text-[15px] font-normal uppercase text-[#141518]">Bio</label>
        <div className="relative">
          <Textarea 
            placeholder="Enter your bio" 
            className="min-h-[160px] resize-none pb-8 italic placeholder:text-gray-400"
            value={data.bio}
            disabled
            maxLength={100}
          />
          <span className="absolute bottom-3 right-3 text-[15px] text-gray-500 font-light">
            {data.bio.length}/100
          </span>
        </div>
      </div>
    </div>
  )
}
