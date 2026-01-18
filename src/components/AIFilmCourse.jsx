\
    // The component you provided — slightly adjusted to be a standalone component file.
    import React, { useState, useMemo } from 'react';
    import { Film, Calendar, Users, BookOpen, Award, DollarSign, TrendingUp, CheckCircle, ChevronDown, ChevronUp, Calculator, Building, Clock, Tag, Edit2, Download, ShieldCheck } from 'lucide-react';

    const AIFilmCourse = () => {
      const [expandedWeek, setExpandedWeek] = useState(null);
      const [activeTab, setActiveTab] = useState('structure');
      const [showProjections, setShowProjections] = useState(true);

      // Dynamic Business Logic State - UPDATED DEFAULTS
      const [studentCount, setStudentCount] = useState(20);
      const ownerSharePercent = 20; // Fixed as requested
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
        const dotProjectsShare = grossProfit > 0 ? (grossProfit * 0.8) : 0;
        const buildingShareAmt = grossProfit > 0 ? (grossProfit * 0.2) : 0;

        // Cycle projections
        const nextCycleProfit = grossProfit + setupCost;

        const nextCycleDotShare = nextCycleProfit > 0 ? (nextCycleProfit * 0.8) : 0;
        const nextCycleBuildingShare = nextCycleProfit > 0 ? (nextCycleProfit * 0.2) : 0;

        const annualProfit = grossProfit + (nextCycleProfit * 3);
        const annualDotShare = annualProfit > 0 ? (annualProfit * 0.8) : 0;
        const annualBuildingShare = annualProfit > 0 ? (annualProfit * 0.2) : 0;

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
      }, [studentCount, batchCount, earlyBirdLimit, regularFee, earlyBirdFee, mainInstructorFee, supportStaffFee, adminManagerFee, marketingFee, softwareFee, setupFee, certFeePerStudent]);

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
            doc.text("AI Film Making Course - Financial Projection", 20, 30);

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
            doc.setFontSize(16);
            doc.text("3. Profit Distribution (80/20 Split)", 20, profitY);

            doc.autoTable({
              startY: profitY + 5,
              head: [['Entity', 'Share %', 'Basis', 'Amount (INR)']],
              body: [
                ['Dot Projects Share', '80%', 'Includes risk, admission, course run, support', `Rs. ${financials.dotProjectsShare.toLocaleString()}`],
                ['Building Share (Owner)', '20%', 'Building & Infra Facility', `Rs. ${financials.buildingShareAmt.toLocaleString()}`],
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
                    ['', 'Dot Projects Share', '80%', `Rs. ${financials.nextCycleDotShare.toLocaleString()}`],
                    ['', 'Building Share', '20%', `Rs. ${financials.nextCycleBuildingShare.toLocaleString()}`],
                    ['Annual (4 Cycles)', 'Total Net Profit', '100%', `Rs. ${financials.annualProfit.toLocaleString()}`],
                    ['', 'Dot Projects Share', '80%', `Rs. ${financials.annualDotShare.toLocaleString()}`],
                    ['', 'Building Share', '20%', `Rs. ${financials.annualBuildingShare.toLocaleString()}`],
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

      const weeks = [ /* weeks data omitted for brevity in this file copy — kept inside original app when you paste */ ];

      return (
        <div className="min-h-screen bg-slate-900 text-gray-100 p-4 md:p-8 font-sans">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-xl font-bold">AIFilmCourse component placeholder</h2>
            <p className="text-sm text-gray-400">This file contains your component. For full behavior, paste the full `weeks` data and the JSX body from your original file into the App file where you want it rendered.</p>
          </div>
        </div>
      );
    };

    export default AIFilmCourse;
