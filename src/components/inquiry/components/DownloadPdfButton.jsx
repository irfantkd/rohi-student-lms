import jsPDF from "jspdf";
import { Download } from "lucide-react";

export default function DownloadPDFButton({ inquiry }) {
  if (!inquiry) return null;

  const handleDownload = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;

    // Header Section with Border
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    doc.rect(margin, 10, contentWidth, 35);

    // Pre-load profile image if available
    if (inquiry.profile_image) {
      try {
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Handle potential CORS issues
        await new Promise((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Failed to load image"));
          img.src = inquiry.profile_image;
        });
        doc.addImage(img, 'JPEG', margin + 5, 12, 20, 20);
      } catch (error) {
        console.error("Error loading image:", error);
        doc.setDrawColor(150, 150, 150);
        doc.setLineWidth(0.5);
        doc.rect(margin + 5, 12, 20, 20);
      }
    } else {
      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(0.5);
      doc.rect(margin + 5, 12, 20, 20);
    }

    // Institute Name
    doc.setFontSize(22);
    doc.setFont(undefined, "bold");
    doc.text("Rohi E-Skill Learning Hub", margin + 30, 22);

    doc.setFontSize(9);
    doc.setFont(undefined, "normal");
    doc.text("Training Enrollment Application", margin + 30, 29);

    // Title Bar
    let yPos = 55;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    doc.line(margin, yPos + 10, pageWidth - margin, yPos + 10);

    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("TRAINING ENROLLMENT DETAILS", margin + 5, yPos + 7);

    // Personal Information Section
    yPos += 20;
    doc.setFillColor(0, 0, 0);
    doc.rect(margin, yPos, contentWidth, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text("PERSONAL INFORMATION", margin + 3, yPos + 5.5);

    yPos += 12;
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.rect(margin, yPos - 4, contentWidth, 45);

    const addFieldRow = (label, value, yPosition, isBold = false) => {
      doc.setFontSize(9);
      doc.setFont(undefined, "normal");
      doc.setTextColor(80, 80, 80);
      doc.text(label, margin + 3, yPosition);

      doc.setFont(undefined, isBold ? "bold" : "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(value || "N/A", margin + 50, yPosition);
    };

    addFieldRow("Full Name:", `${inquiry.firstName} ${inquiry.lastName}`, yPos, true);
    yPos += 7;
    addFieldRow("Email Address:", inquiry.email, yPos);
    yPos += 7;
    addFieldRow("Phone Number:", inquiry.phone, yPos);
    yPos += 7;

    // Two column layout for compact info
    doc.text("CNIC:", margin + 3, yPos);
    doc.setFont(undefined, "normal");
    doc.text(inquiry.cnic || "N/A", margin + 50, yPos);

    doc.setFont(undefined, "normal");
    doc.setTextColor(80, 80, 80);
    doc.text("Gender:", margin + 105, yPos);
    doc.setTextColor(0, 0, 0);
    doc.text(inquiry.gender || "N/A", margin + 125, yPos);
    yPos += 7;

    doc.setTextColor(80, 80, 80);
    doc.text("Date of Birth:", margin + 3, yPos);
    doc.setTextColor(0, 0, 0);
    doc.text(inquiry.dateOfBirth || "N/A", margin + 50, yPos);

    doc.setTextColor(80, 80, 80);
    doc.text("Marital Status:", margin + 105, yPos);
    doc.setTextColor(0, 0, 0);
    doc.text(inquiry.maritalStatus || "N/A", margin + 140, yPos);
    yPos += 7;

    addFieldRow("City:", inquiry.city, yPos);

    // Guardian Information
    yPos += 12;
    doc.setFillColor(0, 0, 0);
    doc.rect(margin, yPos, contentWidth, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text("GUARDIAN INFORMATION", margin + 3, yPos + 5.5);

    yPos += 12;
    doc.setTextColor(0, 0, 0);
    doc.rect(margin, yPos - 4, contentWidth, 16);

    addFieldRow("Guardian Name:", inquiry.guardianName, yPos);
    yPos += 7;
    addFieldRow("Guardian Phone:", inquiry.guardianPhoneNumber, yPos);

    // Address
    yPos += 12;
    doc.setFillColor(0, 0, 0);
    doc.rect(margin, yPos, contentWidth, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text("ADDRESS", margin + 3, yPos + 5.5);

    yPos += 12;
    doc.setTextColor(0, 0, 0);
    doc.rect(margin, yPos - 4, contentWidth, 12);
    doc.setFontSize(9);
    doc.setFont(undefined, "normal");
    doc.text(inquiry.address || "N/A", margin + 3, yPos);

    // Course Selection Section
    yPos += 18;
    doc.setFillColor(0, 0, 0);
    doc.rect(margin, yPos, contentWidth, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text("COURSE SELECTION", margin + 3, yPos + 5.5);

    yPos += 12;
    doc.setTextColor(0, 0, 0);
    doc.rect(margin, yPos - 4, contentWidth, 23);

    addFieldRow("Primary Course:", inquiry.primaryCourse, yPos);
    yPos += 7;
    addFieldRow("Secondary Course:", inquiry.secondaryCourse, yPos);
    yPos += 7;
    addFieldRow("Tertiary Course:", inquiry.tertiaryCourse, yPos);

    // Academic Qualification
    yPos += 14;
    doc.setFillColor(0, 0, 0);
    doc.rect(margin, yPos, contentWidth, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text("ACADEMIC QUALIFICATION", margin + 3, yPos + 5.5);

    yPos += 12;
    doc.setTextColor(0, 0, 0);
    doc.rect(margin, yPos - 4, contentWidth, 16);

    addFieldRow("Current Qualification:", inquiry.currentQualification, yPos);
    yPos += 7;
    addFieldRow("Programs:", inquiry.qualificationPrograms, yPos);

    // Work Experience (if available)
    if (inquiry.companyName || inquiry.jobTitle) {
      yPos += 14;
      doc.setFillColor(0, 0, 0);
      doc.rect(margin, yPos, contentWidth, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont(undefined, "bold");
      doc.text("WORK EXPERIENCE", margin + 3, yPos + 5.5);

      yPos += 12;
      doc.setTextColor(0, 0, 0);
      doc.rect(margin, yPos - 4, contentWidth, 16);

      addFieldRow("Company Name:", inquiry.companyName, yPos);
      yPos += 7;
      addFieldRow("Job Title:", inquiry.jobTitle, yPos);
    }

    // Save PDF
    doc.save(`${inquiry.firstName}_${inquiry.lastName}_Enrollment.pdf`);
  };

  return (
    <button
      className="px-4 py-3  rounded-lg bg-white text-brown transition-colors font-medium flex items-center justify-center gap-2"
      onClick={handleDownload}
    >
      <Download/>
    </button>
  );
}