"use client"
import { Suspense } from "react";
import CreateCampaign from '@/src/features/creator/proposals/containers/create-campaign';

export default function CreateCampaignPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreateCampaign />
        </Suspense>
    );
}