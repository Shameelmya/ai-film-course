import React, { useState, useMemo } from 'react';
import { Film, Calendar, Users, BookOpen, Award, DollarSign, TrendingUp, CheckCircle, ChevronDown, ChevronUp, Calculator, Building, Clock, Tag, Edit2, Download, ShieldCheck } from 'lucide-react';

const AIFilmCourse = () => {
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [activeTab, setActiveTab] = useState('structure');
  const [showProjections, setShowProjections] = useState(true);
  
  // Dynamic Business Logic State - UPDATED DEFAULTS
  const [studentCount, setStudentCount] = useState(20);
  const [buildingSharePercent, setBuildingSharePercent] = useState(20); // Made editable
  const [batchCount, setBatchCount] = useState(2);
  const [earlyBirdLimit, setEarlyBirdLimit] = useState(5);
  const [regularFee, setRegularFee] = useState(36999);
  const [earlyBirdFee, setEarlyBirdFee] = useState(31999);

  // Editable Expense State
  const [mainInstructorFee, setMainInstructorFee] = useState(35000);
  const [supportStaffFee, setSupportStaffFee] = useState(15000);
  const [adminManagerFee, setAdminManagerFee] = useState(12000);
  const [marketingFee, setMarketingFee] = useState(30000);
  const [softwareFee, setSoftwareFee] = useState(75000);
  const [setupFee, setSetupFee] = useState(20000);
  const [certFeePerStudent, setCertFeePerStudent] = useState(2000);

  // Constants
  const DURATION_MONTHS = 2.5;

  // Financial Calculations
  const financials = useMemo(() => {
    const totalStudents = studentCount * batchCount;
    const earlyBirdCount = Math.min(totalStudents, earlyBirdLimit * batchCount); 
    const regularCount = totalStudents - earlyBirdCount;
    
    const revenue = (earlyBirdCount * earlyBirdFee) + (regularCount * regularFee);

    // FIX: All monthly fees (Staff + Marketing) are now multiplied by 2.5 months
    const staffTotal = (mainInstructorFee + supportStaffFee + adminManagerFee) * DURATION_MONTHS;
    const marketingTotal = marketingFee * DURATION_MONTHS;
    
    const softwareTotal = softwareFee; 
    const setupCost = setupFee;
    const certCost = totalStudents * certFeePerStudent;

    const totalOperationalExpenses = staffTotal + marketingTotal + softwareTotal + setupCost + certCost;

    const grossProfit = revenue - totalOperationalExpenses;
    
    const shareDecimal = buildingSharePercent / 100;
    const dotDecimal = 1 - shareDecimal;

    const dotProjectsShare = grossProfit > 0 ? (grossProfit * dotDecimal) : 0;
    const buildingShareAmt = grossProfit > 0 ? (grossProfit * shareDecimal) : 0;

    // Cycle projections
    // Next cycle profit = Gross Profit + Setup Cost (saved)
    // Note: User mentioned marketing cost might reduce, but for calculation we keep standard, just adding text note.
    const nextCycleProfit = grossProfit + setupCost;
    
    const nextCycleDotShare = nextCycleProfit > 0 ? (nextCycleProfit * dotDecimal) : 0;
    const nextCycleBuildingShare = nextCycleProfit > 0 ? (nextCycleProfit * shareDecimal) : 0;

    const annualProfit = grossProfit + (nextCycleProfit * 3);
    const annualDotShare = annualProfit > 0 ? (annualProfit * dotDecimal) : 0;
    const annualBuildingShare = annualProfit > 0 ? (annualProfit * shareDecimal) : 0;

    return {
      revenue: {
        total: revenue,
        earlyBirdCount,
        regularCount
      },
      expenses: {
        staff: staffTotal,
        marketing: marketingTotal,
        software: softwareTotal,
        setup: setupCost,
        certification: certCost,
        total: totalOperationalExpenses
      },
      profit: grossProfit,
      nextCycleProfit,
      nextCycleDotShare,
      nextCycleBuildingShare,
      annualProfit,
      annualDotShare,
      annualBuildingShare,
      dotProjectsShare,
      buildingShareAmt,
      margin: revenue > 0 ? (grossProfit / revenue) * 100 : 0
    };
  }, [studentCount, batchCount, earlyBirdLimit, regularFee, earlyBirdFee, mainInstructorFee, supportStaffFee, adminManagerFee, marketingFee, softwareFee, setupFee, certFeePerStudent, buildingSharePercent]);

  // Editable Amount Component
  const EditableAmount = ({ value, onChange, prefix = "₹", suffix = "", allowEdit = true }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    const handleBlur = () => {
      setIsEditing(false);
      onChange(Number(tempValue) || 0);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') handleBlur();
    };

    if (!allowEdit) {
      return (
        <div className="flex items-center gap-2">
          <span>{prefix}{value.toLocaleString('en-IN')}{suffix}</span>
        </div>
      );
    }

    return (
      <div className="group flex items-center gap-2">
        {isEditing ? (
          <input
            autoFocus
            type="number"
            value={tempValue}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onChange={(e) => setTempValue(e.target.value)}
            className="bg-slate-700 text-white px-2 py-0.5 rounded border border-purple-500 w-24 outline-none appearance-none"
          />
        ) : (
          <span onClick={() => { setTempValue(value); setIsEditing(true); }} className="cursor-pointer hover:text-white transition-colors">
            {prefix}{value.toLocaleString('en-IN')}{suffix}
          </span>
        )}
        {!isEditing && (
          <Edit2 
            size={12} 
            className="text-gray-600 group-hover:text-gray-400 cursor-pointer opacity-40 group-hover:opacity-100 transition-all" 
            onClick={() => { setTempValue(value); setIsEditing(true); }}
          />
        )}
      </div>
    );
  };

  const handleDownloadPDF = () => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    const autoTableScript = document.createElement('script');
    autoTableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js';
    
    script.onload = () => {
      document.body.appendChild(autoTableScript);
      autoTableScript.onload = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFillColor(31, 41, 55); 
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("Dot Projects", 20, 20);
        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.text("Advanced AI Video Making - Financial Projection", 20, 30);
        
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 150, 50);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.text("1. Revenue Analysis", 20, 60);
        
        doc.autoTable({
          startY: 65,
          head: [['Description', 'Unit Value', 'Count', 'Total (INR)']],
          body: [
            ['Early Bird Enrollment', `Rs. ${earlyBirdFee.toLocaleString()}`, financials.revenue.earlyBirdCount, `Rs. ${(financials.revenue.earlyBirdCount * earlyBirdFee).toLocaleString()}`],
            ['Regular Enrollment', `Rs. ${regularFee.toLocaleString()}`, financials.revenue.regularCount, `Rs. ${(financials.revenue.regularCount * regularFee).toLocaleString()}`],
          ],
          foot: [['TOTAL GROSS REVENUE', '', '', `Rs. ${financials.revenue.total.toLocaleString()}`]],
          theme: 'striped',
          headStyles: { fillStyle: 'F', fillColor: [124, 58, 237] }, 
          footStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255] }, 
        });

        const currentY = doc.lastAutoTable.finalY + 15;
        doc.text("2. Operational Expenditure", 20, currentY);

        doc.autoTable({
          startY: currentY + 5,
          head: [['Expense Category', 'Monthly / Per Unit', 'Period / Count', 'Total (INR)']],
          body: [
            ['Main Instructor Fee', `Rs. ${mainInstructorFee.toLocaleString()}`, `${DURATION_MONTHS} Months`, `Rs. ${(mainInstructorFee * DURATION_MONTHS).toLocaleString()}`],
            ['Support Staff Fee', `Rs. ${supportStaffFee.toLocaleString()}`, `${DURATION_MONTHS} Months`, `Rs. ${(supportStaffFee * DURATION_MONTHS).toLocaleString()}`],
            ['Admin Manager Fee', `Rs. ${adminManagerFee.toLocaleString()}`, `${DURATION_MONTHS} Months`, `Rs. ${(adminManagerFee * DURATION_MONTHS).toLocaleString()}`],
            ['Marketing Budget', `Rs. ${marketingFee.toLocaleString()}`, `${DURATION_MONTHS} Months`, `Rs. ${(marketingFee * DURATION_MONTHS).toLocaleString()}`],
            ['Software Subscriptions', '-', 'Full Cycle', `Rs. ${softwareFee.toLocaleString()}`],
            ['Certification Costs', `Rs. ${certFeePerStudent.toLocaleString()}`, `${studentCount * batchCount} Students`, `Rs. ${financials.expenses.certification.toLocaleString()}`],
            ['Setup & Admin Costs', '-', 'One-time', `Rs. ${setupFee.toLocaleString()}`],
          ],
          foot: [['TOTAL OPERATIONAL EXPENSES', '', '', `Rs. ${financials.expenses.total.toLocaleString()}`]],
          theme: 'grid',
          headStyles: { fillColor: [220, 38, 38] }, 
          footStyles: { fillColor: [31, 41, 55], textColor: [255, 255, 255] },
        });

        const profitY = doc.lastAutoTable.finalY + 15;
        const dotSharePercent = 100 - buildingSharePercent;
        doc.setFontSize(16);
        doc.text(`3. Profit Distribution (${dotSharePercent}/${buildingSharePercent} Split)`, 20, profitY);

        doc.autoTable({
          startY: profitY + 5,
          head: [['Entity', 'Share %', 'Basis', 'Amount (INR)']],
          body: [
            ['Dot Projects Share', `${dotSharePercent}%`, 'Includes risk, admission, course run, support', `Rs. ${financials.dotProjectsShare.toLocaleString()}`],
            ['Building Share (Owner)', `${buildingSharePercent}%`, 'Building & Infra Facility', `Rs. ${financials.buildingShareAmt.toLocaleString()}`],
          ],
          foot: [['NET SURPLUS PROFIT', '', '', `Rs. ${financials.profit.toLocaleString()}`]],
          theme: 'striped',
          headStyles: { fillColor: [5, 150, 105] },
          footStyles: { fillColor: [243, 244, 246], textColor: [5, 150, 105], fontStyle: 'bold' }
        });

        const projectionY = doc.lastAutoTable.finalY + 15;
        doc.text("4. Future Projections (Detailed Breakdown)", 20, projectionY);

        // Calculate Y position for the note
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(100, 100, 100);
        doc.text("Note: Marketing costs may reduce further with word-of-mouth publicity in future cycles.", 20, projectionY + 7);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);

        doc.autoTable({
            startY: projectionY + 12,
            head: [['Period', 'Category', 'Share %', 'Projected Amount (INR)']],
            body: [
                ['Next Cycle (Single)', 'Total Net Profit', '100%', `Rs. ${financials.nextCycleProfit.toLocaleString()}`],
                ['', 'Dot Projects Share', `${dotSharePercent}%`, `Rs. ${financials.nextCycleDotShare.toLocaleString()}`],
                ['', 'Building Share', `${buildingSharePercent}%`, `Rs. ${financials.nextCycleBuildingShare.toLocaleString()}`],
                ['Annual (4 Cycles)', 'Total Net Profit', '100%', `Rs. ${financials.annualProfit.toLocaleString()}`],
                ['', 'Dot Projects Share', `${dotSharePercent}%`, `Rs. ${financials.annualDotShare.toLocaleString()}`],
                ['', 'Building Share', `${buildingSharePercent}%`, `Rs. ${financials.annualBuildingShare.toLocaleString()}`],
            ],
            theme: 'grid',
            headStyles: { fillColor: [75, 85, 99], textColor: 255 }, // Gray header
            columnStyles: {
                0: { fontStyle: 'bold' },
                3: { fontStyle: 'bold', halign: 'right' }
            },
            styles: { fontSize: 10 }
        });

        const finalY = doc.lastAutoTable.finalY + 25;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Muhammad Shameel KK", 20, finalY + 15);
        doc.setFont("helvetica", "normal");
        doc.text("Director", 20, finalY + 22);
        
        doc.setDrawColor(0, 0, 0);
        doc.line(20, finalY + 10, 80, finalY + 10); 
        doc.text("(Signature)", 20, finalY + 29);

        doc.save(`DotProjects_Financial_Projection.pdf`);
      };
    };
    document.body.appendChild(script);
  };

  const weeks = [
    {
      week: 1,
      title: "Foundation & AI Storytelling",
      hours: 13.5,
      sessions: [
        { day: "Day 1", topic: "AI Film Making Revolution + Story Development with ChatGPT", duration: "2.5h" },
        { day: "Day 2", topic: "Cinematography Fundamentals + Visual Storytelling", duration: "2.5h" },
        { day: "Day 3", topic: "Script to Screen: Complete Screenplay Development", duration: "2.5h" },
        { day: "Sun", topic: "INTENSIVE: Complete Script + Storyboard Creation Workshop", duration: "6h" }
      ],
      deliverables: ["Complete 5-10 min script", "Full storyboard (25+ frames)", "Shot list with camera angles"]
    },
    {
      week: 2,
      title: "AI Image Generation Mastery",
      hours: 13.5,
      sessions: [
        { day: "Day 1", topic: "Midjourney Pro: Character Design & Consistency", duration: "2.5h" },
        { day: "Day 2", topic: "Leonardo AI + Stable Diffusion: Backgrounds & Environments", duration: "2.5h" },
        { day: "Day 3", topic: "Advanced Prompting + Image Upscaling to 4K", duration: "2.5h" },
        { day: "Sun", topic: "INTENSIVE: Complete Visual Asset Library Creation", duration: "6h" }
      ],
      deliverables: ["3-5 character designs (multiple angles)", "15+ location/background images", "Props and detail shots"]
    },
    {
      week: 3,
      title: "Bringing Images to Life",
      hours: 13.5,
      sessions: [
        { day: "Day 1", topic: "Runway Gen-3: Image to Video Magic", duration: "2.5h" },
        { day: "Day 2", topic: "Pika Labs + Sora: Advanced Video Generation", duration: "2.5h" },
        { day: "Day 3", topic: "Motion Control + Camera Movement Techniques", duration: "2.5h" },
        { day: "Sun", topic: "INTENSIVE: Convert All Storyboard Images to Video Clips", duration: "6h" }
      ],
      deliverables: ["20+ video clips (3-10 sec each)", "B-roll footage library", "Establishing shots"]
    },
    {
      week: 4,
      title: "Character Animation & Lip Sync",
      hours: 13.5,
      sessions: [
        { day: "Day 1", topic: "Google Colab: Sadtalker Setup & Basic Animation", duration: "2.5h" },
        { day: "Day 2", topic: "Wav2Lip: Perfect Lip Sync Techniques", duration: "2.5h" },
        { day: "Day 3", topic: "D-ID & HeyGen: Professional Talking Heads", duration: "2.5h" },
        { day: "Sun", topic: "INTENSIVE: Animate All Character Dialogue Scenes", duration: "6h" }
      ],
      deliverables: ["All dialogue scenes animated", "Facial expressions library", "Character performance shots"]
    },
    {
      week: 5,
      title: "Voice & Sound Design",
      hours: 13.5,
      sessions: [
        { day: "Day 1", topic: "ElevenLabs: Voice Cloning & Character Voices", duration: "2.5h" },
        { day: "Day 2", topic: "Voice Direction + Audacity Audio Editing", duration: "2.5h" },
        { day: "Day 3", topic: "Suno AI Music + Sound Effects Creation", duration: "2.5h" },
        { day: "Sun", topic: "INTENSIVE: Complete Audio Track Production", duration: "6h" }
      ],
      deliverables: ["All dialogue audio recorded/generated", "Custom background music", "Complete sound effects library"]
    },
    {
      week: 6,
      title: "Video Editing Foundation",
      hours: 13.5,
      sessions: [
        { day: "Day 1", topic: "DaVinci Resolve: Interface & Basic Editing", duration: "2.5h" },
        { day: "Day 2", topic: "Advanced Cuts, Transitions & Pacing", duration: "2.5h" },
        { day: "Day 3", topic: "Descript: Text-Based Editing Workflow", duration: "2.5h" },
        { day: "Sun", topic: "INTENSIVE: Rough Cut Assembly of Entire Film", duration: "6h" }
      ],
      deliverables: ["Complete rough cut (no color/sound mix)", "Pacing finalized", "All scenes sequenced"]
    },
    {
      week: 7,
      title: "Color Grading & Visual Effects",
      hours: 13.5,
      sessions: [
        { day: "Day 1", topic: "Color Theory + DaVinci Color Wheels", duration: "2.5h" },
        { day: "Day 2", topic: "LUTs, Mood Creation & Shot Matching", duration: "2.5h" },
        { day: "Day 3", topic: "Topaz Video AI: Upscaling & Enhancement", duration: "2.5h" },
        { day: "Sun", topic: "INTENSIVE: Color Grade Entire Film + VFX Polish", duration: "6h" }
      ],
      deliverables: ["Film color graded with consistent look", "All shots upscaled to 4K", "VFX shots completed"]
    },
    {
      week: 8,
      title: "Motion Graphics & Final Polish",
      hours: 13.5,
      sessions: [
        { day: "Day 1", topic: "Title Sequences & Animated Graphics", duration: "2.5h" },
        { day: "Day 2", topic: "Lower Thirds, Credits & Text Animation", duration: "2.5h" },
        { day: "Day 3", topic: "Sound Mixing & Audio Mastering", duration: "2.5h" },
        { day: "Sun", topic: "INTENSIVE: Final Mix, Master & Export", duration: "6h" }
      ],
      deliverables: ["Opening title sequence", "End credits animated", "Final film master copy (4K)"]
    },
    {
      week: 9,
      title: "Distribution & Marketing",
      hours: 13.5,
      sessions: [
        { day: "Day 1", topic: "YouTube Optimization: Thumbnails, SEO, Shorts", duration: "2.5h" },
        { day: "Day 2", topic: "Instagram/TikTok Strategy + Promotional Content", duration: "2.5h" },
        { day: "Day 3", topic: "Film Festivals + Portfolio Building", duration: "2.5h" },
        { day: "Sun", topic: "INTENSIVE: Create Complete Marketing Package", duration: "6h" }
      ],
      deliverables: ["5 custom thumbnails", "10 promotional reels", "Festival submission package", "Portfolio website"]
    },
    {
      week: 10,
      title: "Business & Career Launch",
      hours: 13.5,
      sessions: [
        { day: "Day 1", topic: "Freelancing Setup: Services, Pricing, Platforms", duration: "2.5h" },
        { day: "Day 2", topic: "Building Content Business + Monetization", duration: "2.5h" },
        { day: "Day 3", topic: "Future of AI Filmmaking + Continuous Learning", duration: "2.5h" },
        { day: "Sun", topic: "FILM PREMIERE + CERTIFICATION CEREMONY", duration: "6h" }
      ],
      deliverables: ["Freelancer profiles live", "6-month business plan", "Final film premiere", "Certificate received"]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-900 to-slate-800 rounded-2xl p-8 shadow-2xl border border-violet-700/30">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Film className="w-6 h-6 text-violet-400" />
                <span className="text-violet-300 font-semibold tracking-wide uppercase text-sm">Course Blueprint</span>
              </div>
              <h1 className="text-4xl font-bold mb-2 text-white">Advanced AI Video Making</h1>
              <div className="flex flex-wrap gap-4 text-gray-300 text-sm">
                <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> 10 Weeks (2.5 Months)</div>
                <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> 135 Hours</div>
                <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Industry-Optimized</div>
              </div>
            </div>
            <div className="text-right bg-black/20 p-4 rounded-xl backdrop-blur-sm">
              <div className="text-3xl font-bold text-white flex justify-end">
                <EditableAmount value={regularFee} onChange={setRegularFee} allowEdit={false} />
              </div>
              <div className="text-gray-400 text-sm">Regular Fee</div>
              <div className="mt-2 text-xl font-semibold text-emerald-400 flex justify-end">
                <EditableAmount value={earlyBirdFee} onChange={setEarlyBirdFee} allowEdit={false} />
              </div>
              <div className="text-emerald-200/70 text-xs">Early Bird (First {earlyBirdLimit})</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 p-1 bg-slate-800/50 rounded-xl">
          {['structure', 'financials', 'community'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex-1 ${
                activeTab === tab 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' 
                  : 'text-gray-400 hover:bg-slate-700/50 hover:text-gray-200'
              }`}
            >
              {tab === 'structure' && 'Course Structure'}
              {tab === 'financials' && 'Business Plan'}
              {tab === 'community' && 'Community Support'}
            </button>
          ))}
        </div>

        {/* Financials / Business Plan */}
        {activeTab === 'financials' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Planner Configuration */}
            <div className="bg-slate-800 p-6 rounded-xl border border-purple-500/30 shadow-lg shadow-purple-900/10">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-purple-400"/> Planner Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Students / Batch</label>
                        <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-lg border border-slate-700">
                            <Users className="w-4 h-4 text-gray-500"/>
                            <input 
                                type="number" 
                                value={studentCount}
                                onChange={(e) => setStudentCount(Number(e.target.value))}
                                className="bg-transparent text-white font-mono w-full focus:outline-none text-sm"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Early Bird Limit</label>
                        <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-lg border border-slate-700">
                            <Award className="w-4 h-4 text-yellow-500"/>
                            <input 
                                type="number" 
                                value={earlyBirdLimit}
                                onChange={(e) => setEarlyBirdLimit(Number(e.target.value))}
                                className="bg-transparent text-white font-mono w-full focus:outline-none text-sm"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Parallel Batches</label>
                        <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-lg border border-slate-700">
                            <Clock className="w-4 h-4 text-gray-500"/>
                            <input 
                                type="number" 
                                min="1"
                                max="3"
                                value={batchCount}
                                onChange={(e) => setBatchCount(Number(e.target.value))}
                                className="bg-transparent text-white font-mono w-full focus:outline-none text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Regular Fee (₹)</label>
                        <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-lg border border-slate-700">
                            <Tag className="w-4 h-4 text-purple-400"/>
                            <input 
                                type="number" 
                                value={regularFee}
                                onChange={(e) => setRegularFee(Number(e.target.value))}
                                className="bg-transparent text-white font-mono w-full focus:outline-none text-sm"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Early Bird Fee (₹)</label>
                        <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-lg border border-slate-700">
                            <Tag className="w-4 h-4 text-emerald-400"/>
                            <input 
                                type="number" 
                                value={earlyBirdFee}
                                onChange={(e) => setEarlyBirdFee(Number(e.target.value))}
                                className="bg-transparent text-white font-mono w-full focus:outline-none text-sm"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Building Share (%)</label>
                        <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-lg border border-slate-700">
                            <Building className="w-4 h-4 text-gray-500"/>
                            <input 
                                type="number" 
                                value={buildingSharePercent}
                                onChange={(e) => setBuildingSharePercent(Number(e.target.value))}
                                className="bg-transparent text-white font-mono w-full focus:outline-none text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Revenue */}
              <div className="bg-slate-800 p-6 rounded-xl border border-emerald-500/20">
                <h3 className="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" /> Revenue Projection
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                    <div>
                      <div className="text-gray-300">Early Bird (First {earlyBirdLimit * batchCount})</div>
                      <div className="text-xs text-gray-500">{financials.revenue.earlyBirdCount} Students × ₹{earlyBirdFee.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="font-mono font-bold text-emerald-300">₹{(financials.revenue.earlyBirdCount * earlyBirdFee).toLocaleString('en-IN')}</div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                    <div>
                      <div className="text-gray-300">Regular Fee</div>
                      <div className="text-xs text-gray-500">{financials.revenue.regularCount} Students × ₹{regularFee.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="font-mono font-bold text-emerald-300">₹{(financials.revenue.regularCount * regularFee).toLocaleString('en-IN')}</div>
                  </div>
                  <div className="border-t border-emerald-500/30 pt-4 flex justify-between items-center">
                    <div className="font-bold text-gray-100">Total Revenue</div>
                    <div className="text-2xl font-bold text-emerald-400 font-mono">₹{financials.revenue.total.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>

              {/* Expenses */}
              <div className="bg-slate-800 p-6 rounded-xl border border-red-500/20">
                <h3 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" /> Operational Expenses
                </h3>
                <div className="space-y-3">
                   <div className="flex justify-between text-sm items-center">
                    <span className="text-gray-400">Main Instructor (Monthly)</span>
                    <EditableAmount value={mainInstructorFee} onChange={setMainInstructorFee} />
                   </div>
                   <div className="flex justify-between text-sm items-center">
                    <span className="text-gray-400">Support Staff (Monthly)</span>
                    <EditableAmount value={supportStaffFee} onChange={setSupportStaffFee} />
                   </div>
                   <div className="flex justify-between text-sm items-center">
                    <span className="text-gray-400">Admin Manager (Monthly)</span>
                    <EditableAmount value={adminManagerFee} onChange={setAdminManagerFee} />
                   </div>
                   <div className="flex justify-between text-sm items-center">
                    <span className="text-gray-400">Marketing (Monthly)</span>
                    <EditableAmount value={marketingFee} onChange={setMarketingFee} />
                   </div>
                   <div className="flex justify-between text-sm items-center">
                    <span className="text-gray-400">Software (Total Cycle)</span>
                    <EditableAmount value={softwareFee} onChange={setSoftwareFee} />
                   </div>
                   <div className="flex justify-between text-sm items-center">
                    <span className="text-gray-400">Company Setup (Total Cycle)</span>
                    <EditableAmount value={setupFee} onChange={setSetupFee} />
                   </div>
                   <div className="flex justify-between text-sm items-center pb-2 border-b border-slate-700">
                    <span className="text-gray-400">Cert Cost / Student</span>
                    <EditableAmount value={certFeePerStudent} onChange={setCertFeePerStudent} />
                   </div>

                   <div className="flex justify-between font-bold text-red-300 pt-2">
                    <span>Total Outflow (2.5m)</span>
                    <span className="font-mono">₹{financials.expenses.total.toLocaleString('en-IN')}</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Post-Profit Split Analysis */}
            <div className="bg-slate-800 p-8 rounded-xl border border-emerald-500/30">
              <div className="text-center mb-8">
                <h3 className="text-gray-400 font-semibold mb-2 uppercase text-xs tracking-widest">Net Projected Profit (First Cycle / 2.5 Months)</h3>
                <div className="text-5xl font-bold text-white font-mono">
                  ₹{financials.profit.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                </div>
                <div className="text-emerald-400 text-sm mt-2 font-medium">{financials.margin.toFixed(1)}% Profit Margin</div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {/* Dot Projects Share */}
                <div className="bg-slate-900/80 p-5 rounded-xl border-l-4 border-purple-500 shadow-xl">
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-purple-400 font-bold uppercase tracking-wider text-xs flex items-center gap-1">
                            <ShieldCheck size={14}/> Dot Projects Share ({100 - buildingSharePercent}%)
                        </div>
                        <div className="text-xl font-bold text-white font-mono">
                             ₹{financials.dotProjectsShare.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                        </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 italic leading-relaxed">
                        Includes business risk, admissions management, full course operations, technical & student support.
                      </p>
                    </div>
                </div>

                {/* Building Share */}
                <div className="bg-slate-900/80 p-5 rounded-xl border-l-4 border-amber-500 shadow-xl">
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-amber-500 font-bold uppercase tracking-wider text-xs flex items-center gap-1">
                            <Building size={14}/> Building Share ({buildingSharePercent}%)
                        </div>
                        <div className="text-xl font-bold text-white font-mono">
                             ₹{financials.buildingShareAmt.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 italic leading-relaxed">
                        Compensation for building usage, infrastructure access, and facility maintenance.
                    </p>
                </div>
              </div>

              {/* New Annual Expectation Dropdown */}
              <div className="bg-slate-900/50 rounded-xl border border-slate-700 overflow-hidden mt-6 max-w-4xl mx-auto">
                <button
                  onClick={() => setShowProjections(!showProjections)}
                  className="w-full p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                >
                  <div className="font-bold text-white flex items-center gap-2">
                     <TrendingUp className="w-4 h-4 text-purple-400"/>
                     <span>Annual Expectation & Future Cycles (Detailed)</span>
                  </div>
                  {showProjections ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {showProjections && (
                  <div className="p-6 border-t border-slate-700 bg-slate-800/30">
                     <p className="text-xs text-gray-400 italic mb-6 text-center">
                        *Note: With word-of-mouth publicity in future cycles, marketing costs are expected to reduce, potentially increasing net profit.
                     </p>
                     
                     <div className="space-y-8">
                         {/* Row 1: Next Cycle */}
                         <div>
                             <h4 className="text-sm font-bold text-gray-300 border-b border-gray-600 pb-2 mb-3">Next Cycle Projection (Single)</h4>
                             <div className="grid grid-cols-3 gap-4">
                                <div className="p-3 bg-slate-900 rounded-lg border border-slate-700/50">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Total Net Profit</p>
                                    <p className="text-lg font-mono font-bold text-emerald-400">₹{financials.nextCycleProfit.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="p-3 bg-slate-900 rounded-lg border border-slate-700/50">
                                    <p className="text-[10px] text-purple-400 uppercase font-bold tracking-wider mb-1">Dot Share ({100 - buildingSharePercent}%)</p>
                                    <p className="text-lg font-mono text-gray-200">₹{financials.nextCycleDotShare.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="p-3 bg-slate-900 rounded-lg border border-slate-700/50">
                                    <p className="text-[10px] text-amber-500 uppercase font-bold tracking-wider mb-1">Bldg Share ({buildingSharePercent}%)</p>
                                    <p className="text-lg font-mono text-gray-200">₹{financials.nextCycleBuildingShare.toLocaleString('en-IN')}</p>
                                </div>
                             </div>
                         </div>

                         {/* Row 2: Annual */}
                         <div>
                             <h4 className="text-sm font-bold text-gray-300 border-b border-gray-600 pb-2 mb-3">Annual Projection (4 Cycles)</h4>
                             <div className="grid grid-cols-3 gap-4">
                                <div className="p-3 bg-slate-900 rounded-lg border border-slate-700/50">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Total Net Profit</p>
                                    <p className="text-lg font-mono font-bold text-emerald-400">₹{financials.annualProfit.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="p-3 bg-slate-900 rounded-lg border border-slate-700/50">
                                    <p className="text-[10px] text-purple-400 uppercase font-bold tracking-wider mb-1">Dot Share ({100 - buildingSharePercent}%)</p>
                                    <p className="text-lg font-mono text-gray-200">₹{financials.annualDotShare.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="p-3 bg-slate-900 rounded-lg border border-slate-700/50">
                                    <p className="text-[10px] text-amber-500 uppercase font-bold tracking-wider mb-1">Bldg Share ({buildingSharePercent}%)</p>
                                    <p className="text-lg font-mono text-gray-200">₹{financials.annualBuildingShare.toLocaleString('en-IN')}</p>
                                </div>
                             </div>
                         </div>
                     </div>
                  </div>
                )}
              </div>
              
              <div className="mt-10 text-center">
                <button 
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg active:scale-95"
                >
                  <Download size={18} />
                  Download Financial Report (PDF)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Course Structure */}
        {activeTab === 'structure' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                Weekly Schedule
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-300 mb-2">Weeknight Classes</h4>
                  {batchCount > 1 ? (
                    <div className="space-y-2 text-sm">
                       <p className="flex justify-between"><span><strong>Batch A:</strong> Mon, Wed, Fri</span><span className="text-gray-500">7-9:30 PM</span></p>
                       <p className="flex justify-between"><span><strong>Batch B:</strong> Tue, Thu, Sat</span><span className="text-gray-500">7-9:30 PM</span></p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-300"><strong>Batch A:</strong> Mon, Wed, Fri: 7:00-9:30 PM</p>
                  )}
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-300 mb-2">Sunday Intensive</h4>
                  <p className="text-sm text-gray-300">Every Sunday: 10:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {weeks.map((week, idx) => (
                <div key={idx} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700/50">
                  <button onClick={() => setExpandedWeek(expandedWeek === idx ? null : idx)} className="w-full p-6 flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                    <div className="flex items-center gap-4 text-left">
                      <div className="bg-slate-900 text-purple-400 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg border border-slate-700">{week.week}</div>
                      <div><h3 className="font-bold text-lg text-gray-100">{week.title}</h3><p className="text-sm text-gray-400">{week.hours} hours total</p></div>
                    </div>
                    {expandedWeek === idx ? <ChevronUp /> : <ChevronDown />}
                  </button>
                  {expandedWeek === idx && (
                    <div className="px-6 pb-6 pt-0 bg-slate-800/50 border-t border-slate-700/50">
                      <div className="mt-4 grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          {week.sessions.map((s, si) => (
                            <div key={si} className="flex justify-between text-sm p-2 rounded hover:bg-slate-700/30">
                              <span className="text-purple-300 font-medium w-16">{s.day}</span>
                              <span className="text-gray-300 flex-1 px-2">{s.topic}</span>
                            </div>
                          ))}
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                          <h4 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2"><Award className="w-4 h-4" /> Deliverables</h4>
                          <ul className="space-y-2 text-sm text-gray-400">
                            {week.deliverables.map((d, di) => <li key={di}>• {d}</li>)}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Community Support */}
        {activeTab === 'community' && (
          <div className="grid md:grid-cols-2 gap-6 animate-in fade-in duration-500">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-purple-400" /> WhatsApp Groups</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Direct access to mentors and peers for real-time collaboration and troubleshooting.</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-400" /> Google Classroom</h3>
              <p className="text-sm text-gray-400 leading-relaxed">A central repository for session recordings, handouts, and AI prompt libraries.</p>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-gradient-to-t from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Launch?</h2>
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="text-center p-4 bg-slate-900 rounded-xl"><div className="text-2xl font-bold text-white">10</div><div className="text-xs text-gray-500 uppercase">Weeks</div></div>
            <div className="text-center p-4 bg-slate-900 rounded-xl"><div className="text-2xl font-bold text-white">135</div><div className="text-xs text-gray-500 uppercase">Hours</div></div>
            <div className="text-center p-4 bg-slate-900 rounded-xl"><div className="text-2xl font-bold text-white">{studentCount}</div><div className="text-xs text-gray-500 uppercase">Batch Size</div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIFilmCourse;
