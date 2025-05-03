const PDFDocument = require('pdfkit');

exports.generateBillPDF = (orderData) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    doc
      .fontSize(22)
      .text('React-Quick-Restro - Order Bill', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`Order ID: ${orderData._id}`);
    doc.text(`Status: ${orderData.status}`);
    doc.text(`Payment Status: ${orderData.paymentStatus}`);
    doc.text(`Payment Method: ${orderData.paymentMethod}`);
    doc.text(`Delivery Mode: ${orderData.delivery}`);
    doc.moveDown();

    doc.text(`Customer Name: ${orderData.recipientName}`);
    doc.text(`Customer Email: ${orderData.recipientEmail}`);
    doc.text(`Phone Number: ${orderData.recipientPhoneNumber}`);
    doc.moveDown();

    doc.text('Items:');
    orderData.items.forEach((item, index) => {
      const name = item?.name || 'Unknown Item';
      doc.text(
        `${index + 1}. ${name} x ${item.quantity} = ₹${item.price * item.quantity}`,
      );
    });

    doc.moveDown();
    doc
      .fontSize(16)
      .text(`Total Amount: ₹${orderData.totalAmount}`, { bold: true });

    doc.moveDown();
    doc
      .fontSize(12)
      .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });

    doc.end();
  });
};
