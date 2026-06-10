import { Deliverable } from './../types/campaign';

interface FormData {
    projectName: string;
    startDate: string;
    endDate: string;
    campaignDescription: string;
    contactEmail: string;
    deliverables: Deliverable[];
}

export const validateCampaignForm = (formData: FormData): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!formData.projectName.trim()) newErrors.projectName = "Campaign name is required.";
    if (formData.projectName.length > 50) newErrors.projectName = "Campaign name must be less than 50 characters.";
    if (!formData.startDate) newErrors.startDate = "Start date is required.";
    if (!formData.endDate) newErrors.endDate = "End date is required.";
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate))
        newErrors.endDate = "End date must be after start date.";
    if (!formData.campaignDescription.trim()) newErrors.campaignDescription = "Description is required.";
    if (formData.campaignDescription.length > 300) newErrors.campaignDescription = "Description must be less than 300 characters.";
    if (!formData.contactEmail.trim()) newErrors.contactEmail = "Contact email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail))
        newErrors.contactEmail = "Enter a valid email address.";

    formData.deliverables.forEach((item, index) => {
        if (!item.deliverable_title.trim() || !item.description.trim() || !item.deliverable_type || !item.deadline )
            newErrors[`deliverable_title_${index}`] = "Please fill out all the requirements.";
        else if (item.deliverable_title.length > 50) 
            newErrors[`deliverable_title_${index}`] = "Deliverable name must be less than 50 characters.";
        else if (item.description.length > 100) 
            newErrors[`description_${index}`] = "Description must be less than 100 characters."
    });

    return newErrors;
};