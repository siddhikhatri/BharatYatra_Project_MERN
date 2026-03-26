import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardHeader from "/src/components/dashboard/DashboardHeader";

export default function BookingDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const booking = state?.booking;
  const invoiceRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  if (!booking) {
    return (
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-lg">No booking data found.</p>
          </div>
        </div>
      </div>
    );
  }

  const pricePerPerson = booking.price || 0;
  const travelerCount = booking.travelers?.length || 0;
  const subtotal = pricePerPerson * travelerCount;
  const tax = Math.round(subtotal * 0.05);
  const total = booking.totalPrice || subtotal + tax;

  const statusStyle =
    booking.status === "Confirmed"
      ? { bg: "#dcfce7", color: "#15803d", border: "#86efac" }
      : booking.status === "Pending"
        ? { bg: "#fef9c3", color: "#a16207", border: "#fde047" }
        : { bg: "#fee2e2", color: "#b91c1c", border: "#fca5a5" };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
      const imgX = (pdfWidth - canvas.width * ratio) / 2;

      pdf.addImage(imgData, "PNG", imgX, 0, canvas.width * ratio, canvas.height * ratio);
      pdf.save(`BharatYatra_Invoice_${booking.bookingId}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .inv-doc {
          background: #fff;
          padding: 40px 44px 32px;
          font-family: 'Inter', sans-serif;
          color: #111827;
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
        }
        .inv-top {
          display: flex; justify-content: space-between;
          align-items: flex-start; margin-bottom: 28px;
        }
        .inv-brand-row { display: flex; align-items: center; gap: 12px; }
        .inv-icon {
          width: 46px; height: 46px; border-radius: 12px;
          background: #1d4ed8;
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 22px;
        }
        .inv-brand-name { font-size: 24px; font-weight: 800; color: #111827; line-height: 1.1; }
        .inv-brand-name span { color: #1d4ed8; }
        .inv-brand-sub { font-size: 13px; color: #6b7280; margin-top: 2px; }
        .inv-meta { text-align: right; }
        .inv-badge {
          display: inline-block;
          background: #1d4ed8; color: #fff;
          font-size: 12px; font-weight: 700; letter-spacing: 2px;
          padding: 5px 16px; border-radius: 6px; margin-bottom: 10px;
          text-transform: uppercase;
        }
        .inv-meta-row { font-size: 14px; color: #374151; margin-bottom: 4px; }
        .inv-meta-row b { color: #111827; font-weight: 600; }
        .inv-divider {
          height: 3px;
          background: linear-gradient(90deg, #1d4ed8, #60a5fa 60%, #dbeafe);
          border-radius: 3px; margin-bottom: 30px;
        }
        .inv-pkg {
          background: #eff6ff; border: 1px solid #bfdbfe;
          border-radius: 14px; padding: 22px 26px;
          display: flex; justify-content: space-between;
          align-items: center; margin-bottom: 26px;
        }
        .inv-pkg-tag {
          font-size: 11px; font-weight: 700; color: #1d4ed8;
          text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;
        }
        .inv-pkg-name { font-size: 21px; font-weight: 700; color: #111827; margin-bottom: 5px; }
        .inv-pkg-loc { font-size: 14px; color: #374151; }
        .inv-grid {
          display: grid; grid-template-columns: 1fr 1fr 1fr;
          gap: 14px; margin-bottom: 28px;
        }
        .inv-grid-cell {
          background: #f9fafb; border: 1px solid #e5e7eb;
          border-radius: 12px; padding: 16px 18px;
        }
        .inv-cell-label {
          font-size: 11px; font-weight: 600; color: #6b7280;
          text-transform: uppercase; letter-spacing: 1px; margin-bottom: 7px;
        }
        .inv-cell-value { font-size: 16px; font-weight: 700; color: #111827; }
        .inv-sec-head {
          font-size: 13px; font-weight: 700; color: #111827;
          text-transform: uppercase; letter-spacing: 1px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 7px; margin-bottom: 14px;
        }
        .inv-tbl { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
        .inv-tbl thead tr { background: #1d4ed8; }
        .inv-tbl th {
          padding: 12px 16px; text-align: left;
          color: #fff; font-size: 13px; font-weight: 600;
        }
        .inv-tbl td {
          padding: 12px 16px; color: #111827; font-size: 14px;
          border-bottom: 1px solid #f3f4f6;
        }
        .inv-tbl tbody tr:nth-child(even) td { background: #f9fafb; }
        .inv-price-wrap {
          background: #f9fafb; border: 1px solid #e5e7eb;
          border-radius: 14px; padding: 24px 26px; margin-bottom: 28px;
        }
        .inv-price-line {
          display: flex; justify-content: space-between;
          font-size: 15px; color: #374151; margin-bottom: 13px;
        }
        .inv-price-line span:last-child { color: #111827; font-weight: 500; }
        .inv-price-sep { height: 1px; background: #d1d5db; margin: 16px 0; }
        .inv-total-line { display: flex; justify-content: space-between; align-items: center; }
        .inv-total-label { font-size: 18px; font-weight: 700; color: #111827; }
        .inv-total-value { font-size: 30px; font-weight: 800; color: #1d4ed8; }
        .inv-foot {
          border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;
        }
        .inv-foot p { font-size: 14px; color: #374151; margin-bottom: 5px; }
        .inv-foot small { font-size: 12px; color: #9ca3af; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.9s linear infinite; display: inline-block; }
      `}</style>

      <div className="flex min-h-screen">
        <DashboardSidebar />

        <div className="flex-1 flex flex-col">
          <DashboardHeader />

          <div className="p-8 bg-gray-50 flex-1">
            {/* Back button */}
            <button
              onClick={() => navigate("/my-bookings")}
              className="mb-6 flex items-center gap-2 text-gray-600 hover:text-black font-medium transition-colors"
            >
              ← Back to My Bookings
            </button>

            <h1 className="text-3xl font-bold mb-6">Booking Details</h1>

            {/* Invoice rendered inline (not in modal) */}
            <div className="max-w-3xl">
              <div className="inv-doc" ref={invoiceRef}>

                {/* Top row */}
                <div className="inv-top">
                  <div>
                    <div className="inv-brand-row">
                      <div className="inv-icon">✈</div>
                      <div>
                        <div className="inv-brand-name">Bharat<span>Yatra</span></div>
                        <div className="inv-brand-sub">Travel Booking Receipt</div>
                      </div>
                    </div>
                  </div>
                  <div className="inv-meta">
                    <div className="inv-badge">Invoice</div>
                    <div className="inv-meta-row">Invoice #: <b>{booking.bookingId}</b></div>
                    <div className="inv-meta-row">
                      Date: <b>{new Date(booking.bookingDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</b>
                    </div>
                  </div>
                </div>

                <div className="inv-divider" />

                {/* Package */}
                <div className="inv-pkg">
                  <div>
                    <div className="inv-pkg-tag">Travel Package</div>
                    <div className="inv-pkg-name">{booking.packageName}</div>
                    <div className="inv-pkg-loc">📍 {booking.location}</div>
                  </div>
                  <span style={{
                    background: statusStyle.bg,
                    color: statusStyle.color,
                    border: `1px solid ${statusStyle.border}`,
                    padding: "7px 18px",
                    borderRadius: 20, fontSize: 13, fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}>● {booking.status}</span>
                </div>

                {/* Info grid */}
                <div className="inv-grid">
                  {[
                    ["Booking Date", new Date(booking.bookingDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })],
                    ["Departure Date", new Date(booking.departureDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })],
                    ["Total Travelers", `${travelerCount} Person${travelerCount !== 1 ? "s" : ""}`],
                  ].map(([label, val]) => (
                    <div className="inv-grid-cell" key={label}>
                      <div className="inv-cell-label">{label}</div>
                      <div className="inv-cell-value">{val}</div>
                    </div>
                  ))}
                </div>

                {/* Travelers */}
                {booking.travelers?.length > 0 && (
                  <>
                    <div className="inv-sec-head">Traveler Details</div>
                    <table className="inv-tbl">
                      <thead>
                        <tr>
                          {["#", "Name", "Age", "Phone", "Email"].map((h) => <th key={h}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {booking.travelers.map((t, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td style={{ fontWeight: 600 }}>{t.name}</td>
                            <td>{t.age}</td>
                            <td>{t.phone}</td>
                            <td>{t.email || "N/A"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}

                {/* Price breakdown */}
                <div className="inv-sec-head">Price Breakdown</div>
                <div className="inv-price-wrap">
                  <div className="inv-price-line">
                    <span>Price per person</span>
                    <span>₹{pricePerPerson.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="inv-price-line">
                    <span>Travelers × {travelerCount}</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="inv-price-line">
                    <span>GST (5%)</span>
                    <span>₹{tax.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="inv-price-sep" />
                  <div className="inv-total-line">
                    <span className="inv-total-label">Total Amount</span>
                    <span className="inv-total-value">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="inv-foot">
                  <p>Thank you for booking with BharatYatra! Wishing you a wonderful journey. ✈</p>
                  <small>Computer-generated receipt — no physical signature required.</small>
                </div>

              </div>

              {/* Download button below the invoice card */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-10 py-3 rounded-full text-base font-semibold transition-colors flex items-center gap-2"
                >
                  {downloading ? (
                    <><span className="spin">⟳</span> Generating PDF…</>
                  ) : (
                    <>
                      <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Download Invoice PDF
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}