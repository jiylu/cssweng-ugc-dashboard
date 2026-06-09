"use client"
// Local
import logo from './../public/Logo-black.svg'
// import defaultprofile from './../public/default-profile.png'
import styles from './../ui/createCampaignStyles/createCampaign.module.css';

// React
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react';

// Shadecn
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
/*
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
*/


// Lucide
import { 
    LayoutPanelTop, 
    Megaphone, 
    NotebookPen, 
    Calendar, 
    Settings, 
    LogOut,
    StickyNote, // for drafts
    FilePen, // for create proposal
    Files, // for submitted proposals
    SendHorizontal, // for send proposal button
    CirclePlus, // for add deliverable button
    ChevronDown, ChevronUp
} from "lucide-react"
import { TrendingUp, 
         CheckCircle, 
         Filter 
       } from "lucide-react"


export default function CreateCampaignPage() {
    const router = useRouter();
    const startDateRef = useRef<HTMLInputElement>(null);
    const endDateRef = useRef<HTMLInputElement>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [deliverables, setDeliverables] = useState([
        { 
            id: 1, // temp id only
            deliverable_title: "", 
            description: "", 
            deliverable_type: "", 
            deadline: "", 
            pricing: "" 
        }
    ]);

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const [year, month, day] = dateString.split('-');
        return `${month}/${day}/${year}`;
    };

    const updateDeliverable = (id: number, field: string, value: string) => {
        setDeliverables(deliverables.map(item => 
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const addDeliverable = () => {
        const newId = deliverables.length > 0 ? Math.max(...deliverables.map(d => d.id)) + 1 : 1;
        setDeliverables([
            ...deliverables, 
            { id: newId, deliverable_title: "", description: "", deliverable_type: "", deadline: "", pricing: "" }
        ]);
    };

    const adjustPrice = (id: number, amount: number) => {
        setDeliverables(deliverables.map(item => {
            if (item.id === id) {
                const currentVal = parseFloat(item.pricing.replace(/,/g, '') || "0");
                const newVal = Math.max(0, currentVal + amount); 
                const formatted = newVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return { ...item, pricing: formatted };
            }
            return item;
        }));
    };

    const handleSignout = () => {
        // SIGN OUT LOGIC (e.g. CLEAR COOKIES, etc.)
        router.push('/login');
    };

    return (
        <main className="flex flex-row w-full h-screen overflow-hidden">
        {/* LEFT PANEL */}
        <section className={styles.leftpanel}>
          <Image src={logo} alt="Logo" className="w-[150px] mt-10 mb-10"/>
          <Separator />

          {/* NAVIGATION */}
          <div className={styles.navbtn}>
            <Button type="button" onClick={() => router.push('/createCampaign')} className="cursor-pointer w-57 h-[50px] mt-10 mb-6 text-lg">
              + New Campaign
            </Button>
            <div className="flex flex-col justify-start items-start">
              <Button variant="ghost" onClick={() => router.push('/creatorDashboard')} className="justify-start items-center cursor-pointer w-57 h-[50px] text-lg">
                <LayoutPanelTop />Dashboard
              </Button>
              <Button variant="ghost" className="justify-start items-center cursor-pointer w-57 h-[50px] text-lg">
                <Megaphone />Campaigns
              </Button>
              <Button variant="ghostactive" onClick={() => router.push('/createCampaign')} className="justify-start items-center cursor-pointer w-57 h-[50px] text-lg">
                <NotebookPen />Proposals
              </Button>
              <Button variant="ghost" className="justify-start items-center cursor-pointer w-57 h-[50px] text-lg">
                <Calendar />Calendar
              </Button>
              <Button variant="ghost" className="justify-start items-center cursor-pointer w-57 h-[50px] text-lg">
                <Settings />Settings
              </Button>
            </div>
          </div>

          {/* SIGN OUT */}
          <div className="mt-auto mb-5 flex flex-col">
            <Separator />
            <Button variant="ghost" onClick={handleSignout} className="justify-start items-center cursor-pointer w-57 h-[50px] text-lg">
              <LogOut />Sign Out
            </Button>
          </div>
        </section>

            {/* RIGHT PANEL */}
            <section className={styles.rightpanel}>
                <div className={styles.mainContainer}>
                    
                    {/* TOP PART: Navigation Tabs & Profile */}
                    <div className={styles.topBar}>
                        <div className={styles.tabGroup}>
                            <button className={styles.activeTab}>
                                <FilePen size={18} className="mb-[4px]" /> CREATE A PROPOSAL
                            </button>
                            <button className={styles.inactiveTab}>
                                <StickyNote size={18} className="mb-[4px]" /> DRAFTS
                            </button>
                            <button className={styles.inactiveTab}>
                                <Files size={18} className="mb-[4px]" /> SUBMITTED PROPOSALS
                            </button>
                        </div>
                        
                        {/* <Image src={defaultprofile} alt="default" className="w-[40px] mr-5 rounded-full"/> */}
                    </div>
                    <Separator />

                    {/* Header */}
                    <div className={styles.headerSection}>
                        <h1 className={styles.pageTitle}>Create New Proposal</h1>
                        <p className={styles.pageDescription}>
                            Draft a proposal for your next client collaboration. Ensure all deliverables are clearly defined.
                        </p>
                    </div>
                    
                    {/* CARDS */}
                    <div className={styles.cardsGrid}>
                        {/* Campaign Details */}
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Campaign Details</h2>
                            <p className={styles.cardDescription}>
                                Provide the core information, timeline, and an overview of this collaboration.
                            </p>
                            
                            {/* Campaign Name */}
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>CAMPAIGN NAME</label>
                                <input type="text" className={styles.underlineInput} placeholder="Enter campaign name" />
                            </div>

                            {/* Start & End Dates */}
                            <div className={styles.dateRow}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>CAMPAIGN START DATE</label>
                                    
                                    <div className={`${styles.dateInputWrapper} relative flex items-center`}>
                                        <Calendar size={16} 
                                            className="text-[#78746e] shrink-0 cursor-pointer relative z-20 mb-[4px]" 
                                            onClick={() => {
                                                if (startDateRef.current) {
                                                    startDateRef.current.focus();
                                                    try { startDateRef.current.showPicker(); } catch(e) {}
                                                }
                                            }}/>
                                        
                                        <input 
                                            ref={startDateRef}
                                            type="date" 
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            data-empty={!startDate} 
                                            className={`${styles.underlineInput} ${styles.brandedDateInput} w-full bg-transparent relative z-10 cursor-text`} />
                                        
                                        <span className={styles.customDatePlaceholder}>
                                            Set campaign start date
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>CAMPAIGN END DATE</label>
                                    
                                    <div className={`${styles.dateInputWrapper} relative flex items-center`}>
                                        <Calendar size={16} 
                                            className="text-[#78746e] shrink-0 cursor-pointer relative z-20 mb-[4px]" 
                                            onClick={() => {
                                                if (endDateRef.current) {
                                                    endDateRef.current.focus();
                                                    try { endDateRef.current.showPicker(); } catch(e) {}
                                                }
                                            }}/>
                                        
                                        <input 
                                            ref={endDateRef}
                                            type="date" 
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            data-empty={!endDate}
                                            className={`${styles.underlineInput} ${styles.brandedDateInput} w-full bg-transparent relative z-10 cursor-text`} />
                                        
                                        <span className={styles.customDatePlaceholder}>
                                            Set campaign end date
                                        </span>
                                    </div>
                                </div>
                                
                            </div>

                            {/* Campaign Description */}
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>CAMPAIGN DESCRIPTION</label>
                                <textarea className={styles.textareaBox} placeholder="Enter Description"></textarea>
                            </div>
                        </div>

                        {/* Client Info */}
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Client Information</h2>
                            <p className={styles.cardDescription}>
                                Enter the client's name and contact email to send them access to view this campaign proposal.
                            </p>
                            
                            {/* Contact Person */}
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>CONTACT PERSON</label>
                                <input type="text" className={styles.underlineInput} placeholder="Enter name of contact person" />
                            </div>

                            {/* Contact Email */}
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>CONTACT PERSON EMAIL</label>
                                <input type="email" className={styles.underlineInput} placeholder="Enter email of contact person" />
                            </div>
                        </div>

                        {/* Deliverables Table */}
                        <div className={`${styles.card} ${styles.deliverablesCard}`}>
                            <h2 className={styles.cardTitle}>Deliverables & Pricing</h2>

                            <div className={styles.tableContainer}>
                                <div className={`${styles.tableGrid} ${styles.tableHeader}`}>
                                    <div>Deliverable</div>
                                    <div>Description</div>
                                    <div>Type</div>
                                    <div>Deadline</div>
                                    <div>Price</div>
                                </div>

                                {deliverables.map((item) => (
                                    <div key={item.id} className={`${styles.tableGrid} ${styles.tableRow}`}>
                                        
                                        {/* name */}
                                        <input 
                                            type="text"
                                            className={styles.underlineInput} 
                                            placeholder="Enter deliverable name"
                                            value={item.deliverable_title}
                                            onChange={(e) => updateDeliverable(item.id, 'deliverable_title', e.target.value)}/>

                                        {/* description */}
                                        <input 
                                            type="text"
                                            className={styles.underlineInput} 
                                            placeholder="Enter description"
                                            value={item.description}
                                            onChange={(e) => updateDeliverable(item.id, 'description', e.target.value)}/>

                                        {/* type */}
                                        <div className="relative w-full">
                                            <select 
                                                className={`${styles.pillSelect} w-full pr-8`}
                                                value={item.deliverable_type}
                                                onChange={(e) => updateDeliverable(item.id, 'deliverable_type', e.target.value)}
                                                data-empty={!item.deliverable_type}>
                                                <option value="" disabled>Select Type</option>
                                                <option value="COLLABORATION">Collaboration</option>
                                                <option value="UGC">UGC</option>
                                            </select>
                                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78746e] pointer-events-none" />
                                        </div>

                                        {/* deadline */}
                                        <div className="relative flex items-center w-full">
                                            <input 
                                                type="date" 
                                                value={item.deadline}
                                                onChange={(e) => updateDeliverable(item.id, 'deadline', e.target.value)}
                                                data-empty={!item.deadline}
                                                className={`${styles.underlineInput} ${styles.brandedDateInput} w-full bg-transparent relative z-10 cursor-text`} />
                                            <span className={styles.customDatePlaceholder} style={{ left: '0' }}>
                                                Set a deadline
                                            </span>
                                        </div>

                                        {/* pricing */}
                                        <div className={styles.priceInputWrapper}>
                                            <span>PHP</span>
                                            <input 
                                                type="text" 
                                                placeholder="0.00"
                                                className="w-full bg-transparent outline-none"
                                                value={item.pricing}
                                                onChange={(e) => {
                                                    let val = e.target.value.replace(/[^0-9.]/g, '');
                                                    const parts = val.split('.');
                                                    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                                    updateDeliverable(item.id, 'pricing', parts.slice(0, 2).join('.'));
                                                }}
                                            />
                                            <div className="flex flex-col ml-1 shrink-0">
                                                <ChevronUp 
                                                    size={14} 
                                                    className="cursor-pointer text-[#9ca3af] hover:text-[#6b1fa8] transition-colors" 
                                                    onClick={() => adjustPrice(item.id, 1000)} />
                                                <ChevronDown 
                                                    size={14} 
                                                    className="cursor-pointer text-[#9ca3af] hover:text-[#6b1fa8] transition-colors" 
                                                    onClick={() => adjustPrice(item.id, -1000)} />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button className={styles.addDeliverableBtn} onClick={addDeliverable}>
                                    <CirclePlus size={16} className="mb-[4px]"/> Add another deliverable
                                </button>

                            </div>
                        </div>

                        <div className={styles.actionBtns}>
                            <button className={styles.draftBtn}>Save Draft</button>
                            <button className={styles.sendBtn}>
                                <SendHorizontal size={16} className="mb-[4px]"/> Send Proposal
                            </button>
                        </div>
                    </div>                    
                </div>
            </section>    
        </main>
    );
}