import PDFDocument from "pdfkit";

export const generateTicketPDF = (ticketData) => {
  const doc = new PDFDocument();
  let buffers = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {});

  doc.fontSize(20).text("BUS TICKET", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Passenger: ${ticketData.passengerName}`);
  doc.text(`Bus: ${ticketData.busName}`);
  doc.text(`Seat: ${ticketData.seatNumber}`);
  doc.text(`Date: ${ticketData.date}`);
  doc.text(`From: ${ticketData.from}`);
  doc.text(`To: ${ticketData.to}`);
  doc.text(`Booking ID: ${ticketData.bookingId}`);

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });
  });
};
