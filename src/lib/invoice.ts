import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Shipment } from '@/types/shipment';

export const generateInvoice = (shipment: Shipment) => {
    const doc = new jsPDF();

    // BRANDING HEADER
    doc.setFillColor(30, 64, 175); // Professional Blue
    doc.rect(0, 0, 210, 40, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text('GLO-SHIP', 20, 25);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('EXPRESS LOGISTICS & WORLDWIDE TRACKING', 20, 33);

    // INVOICE INFO
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 140, 20);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`TRACKING ID: ${shipment.id}`, 140, 28);
    doc.text(`DATE: ${new Date(shipment.date).toLocaleDateString()}`, 140, 33);

    // SECTION: PARTIES
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('SENDER (SHIPPER)', 20, 55);
    doc.text('RECEIVER', 110, 55);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    // Shipper Data
    doc.text(shipment.shipperName, 20, 62);
    doc.text(shipment.shipperAddress, 20, 67, { maxWidth: 80 });
    doc.text(`P: ${shipment.shipperPhone}`, 20, 77);
    doc.text(`E: ${shipment.shipperEmail}`, 20, 82);

    // Receiver Data
    doc.text(shipment.receiverName, 110, 62);
    doc.text(shipment.receiverAddress, 110, 67, { maxWidth: 80 });
    doc.text(`P: ${shipment.receiverPhone}`, 110, 77);
    doc.text(`E: ${shipment.receiverEmail}`, 110, 82);

    // TABLE: ITEMS
    const tableData = shipment.items.map(item => [
        item.name,
        item.weight + ' kg',
        item.quantity.toString(),
    ]);

    autoTable(doc, {
        startY: 95,
        head: [['ITEM DESCRIPTION', 'WEIGHT', 'QTY']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [30, 64, 175], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 3 },
    });

    // SECTION: FINANCIALS & LOGISTICS
    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;

    // Payment Box
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(20, finalY, 80, 40, 'F');
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.rect(20, finalY, 80, 40, 'S');

    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT OVERVIEW', 25, finalY + 8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Cost:`, 25, finalY + 18);
    doc.text(`$${shipment.shippingCost.toFixed(2)}`, 65, finalY + 18, { align: 'right' });
    doc.text(`Paid:`, 25, finalY + 25);
    doc.text(`$${shipment.amountPaid.toFixed(2)}`, 65, finalY + 25, { align: 'right' });

    const balance = shipment.shippingCost - shipment.amountPaid;
    doc.setFont('helvetica', 'bold');
    if (balance > 0) {
        doc.setTextColor(185, 28, 28);
    } else {
        doc.setTextColor(21, 128, 61);
    }
    doc.text(`Balance:`, 25, finalY + 32);
    doc.text(`$${balance.toFixed(2)}`, 65, finalY + 32, { align: 'right' });

    // Logistics Box
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('SHIPPING LOGISTICS', 110, finalY + 8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Status: ${shipment.status}`, 110, finalY + 18);
    doc.text(`Method: ${shipment.paymentMethod}`, 110, finalY + 23);
    doc.text(`Pick-up: ${shipment.pickupTime}`, 110, finalY + 28);
    doc.text(`Duration: ${shipment.estimatedDuration}`, 110, finalY + 33);

    // NOTES
    if (shipment.notes) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.text('NOTES:', 20, finalY + 50);
        doc.text(shipment.notes, 20, finalY + 55, { maxWidth: 170 });
    }

    // FOOTER
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('THIS IS A COMPUTER GENERATED INVOICE. NO SIGNATURE REQUIRED.', 105, 285, { align: 'center' });
    doc.text('GLOBALLOGISTICSSHIPPER081@GMAIL.COM | WWW.GLOSHIP.ONLINE', 105, 290, { align: 'center' });

    doc.save(`INVOICE_${shipment.id}.pdf`);
};
