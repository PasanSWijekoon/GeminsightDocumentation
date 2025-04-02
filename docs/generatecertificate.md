---
sidebar: auto
---

# Create Certificates Form

## Description

The `CreateCertificatesForm` class is a GUI component designed to generate certificates for gemstones within an application. It extends the `SimpleForm` class and allows users to view gemstone data associated with an order, populate certificate fields, and print certificates with QR codes linking to a verification URL. The form integrates with a database to retrieve gemstone details and lab report data, and it uses JasperReports to generate and export certificates as PDF files.

## Activity

In this Activity :

- actors involved: Supervisor and System.
- The process begins with the Supervisor selecting a gemstone from an order with a completed lab report.
- The System populates the certificate fields with gemstone and lab data.
- The User initiates certificate printing, triggering QR code generation and report creation.
- If successful, the certificate is saved and printed, and the gemstone status is updated; otherwise, an error is displayed.
- The process ends with the certificate generated and stored.


## Class Variables

- `Order_no`: Stores the order number associated with the certificates.
  - Type: `String`

## Constructor

### `CreateCertificatesForm(String Order_no)`

- **Description**: Initializes the form with the specified order number, sets up UI components, and loads initial gemstone data.
- **Parameters**:
  - `Order_no`: The order number for which certificates are being generated.

```java
public CreateCertificatesForm(String Order_no) {
    initComponents();
    this.Order_no = Order_no;
    gemdata();
    jLabel1.setText(Order_no);
    gemdata();
}
```

## Methods

### `gemdata()`

- **Description**: Loads gemstone data for the specified order number into `jTable1` where the report status is completed (status ID '2').
- **Access Modifier**: Private
- **Return Type**: Void

```java
private void gemdata() {
    try {
        ResultSet rs = MySQL.execute("SELECT * FROM `gem_orders` " +
            "INNER JOIN `gemstone_type` ON `gemstone_type`.`gemstone_type_id`=`gem_orders`.`gemstone_type_id` " +
            "INNER JOIN `gemstone_color` ON `gemstone_color`.`color_id`=`gem_orders`.`gemstone_color_id` " +
            "INNER JOIN `gemstone_clarity` ON `gemstone_clarity`.`id_gemstone_clarity`=`gem_orders`.`gemstone_clarity_id` " +
            "INNER JOIN `gemstone_cut` ON `gemstone_cut`.`id_gemstone_cut`=`gem_orders`.`gemstone_cut_id` " +
            "INNER JOIN `gemstone_treatment` ON `gemstone_treatment`.`id_gemstone_treatment`=`gem_orders`.`gemstone_treatment_id` " +
            "INNER JOIN `report_status` ON `report_status`.`idreport_status`=`gem_orders`.`report_status_idreport_status` " +
            "WHERE `order_no`='" + Order_no + "' AND `report_status_idreport_status`='2' ORDER BY `gem_id` ASC");
        DefaultTableModel model = (DefaultTableModel) jTable1.getModel();
        model.setRowCount(0);
        while (rs.next()) {
            Vector<String> v = new Vector();
            v.add(rs.getString("gem_id"));
            v.add(rs.getString("weight_carats"));
            v.add(rs.getString("type"));
            v.add(rs.getString("color"));
            v.add(rs.getString("clarity"));
            v.add(rs.getString("cut"));
            v.add(rs.getString("treatment"));
            v.add(rs.getString("report_status_type"));
            model.addRow(v);
        }
        jTable1.setModel(model);
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

### Event Handlers

1. `jTable1MouseClicked(java.awt.event.MouseEvent evt)`: Populates certificate fields with selected gemstone data and lab report details on double-click, enabling the "Print Certificate" button.
   
```java
private void jTable1MouseClicked(java.awt.event.MouseEvent evt) {
    if (evt.getClickCount() == 2) {
        jButton1.setEnabled(true);
        int selectRow = jTable1.getSelectedRow();
        String gemID = String.valueOf(jTable1.getValueAt(selectRow, 0));
        String weights = String.valueOf(jTable1.getValueAt(selectRow, 1));
        String colors = String.valueOf(jTable1.getValueAt(selectRow, 3));
        String cuts = String.valueOf(jTable1.getValueAt(selectRow, 5));
        jLabel2.setText(gemID);
        jTextField1.setText(colors);
        jTextField21.setText(weights);
        jTextField20.setText(cuts);
        try {
            ResultSet resultSet = MySQL.execute("SELECT * FROM `report_table` " +
                "INNER JOIN `gemstone_shape` ON `gemstone_shape`.`id_gemstone_shape`=`report_table`.`gemstone_shape_id_gemstone_shape` " +
                "INNER JOIN `gemstone_transparency` ON `gemstone_transparency`.`id_gemstone_transparency`=`report_table`.`gemstone_transparency_id_gemstone_transparency` " +
                "WHERE `gem_id` = '" + gemID + "'");
            if (resultSet.next()) {
                jTextField2.setText(resultSet.getString("gemstone_transparency.transparency"));
                jTextField19.setText(resultSet.getString("gemstone_shape.shape"));
                jTextField22.setText(resultSet.getString("Measurements"));
                jTextField3.setText(resultSet.getString("refractive_index"));
                jTextField4.setText(resultSet.getString("specific_gravity"));
                jTextField11.setText(resultSet.getString("hardness"));
                jTextField6.setText(resultSet.getString("optical_character"));
                jTextField5.setText(resultSet.getString("pleochroism"));
                jTextField10.setText(resultSet.getString("adsorption_spectrum"));
                jTextField17.setText(resultSet.getString("fluorescence"));
                jTextField8.setText(resultSet.getString("magnification"));
                jTextField7.setText(resultSet.getString("inclusions_internal"));
                jTextField9.setText(resultSet.getString("inclusions_external"));
                jTextField13.setText(resultSet.getString("treatment"));
                jTextField12.setText(resultSet.getString("origin"));
                jTextField18.setText(resultSet.getString("remarks"));
                jTextField14.setText(resultSet.getString("species"));
                jTextField15.setText(resultSet.getString("variety"));
                jTextField16.setText(resultSet.getString("gemologist"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

2. `jButton1ActionPerformed(java.awt.event.ActionEvent evt)`: Generates a certificate with a QR code, saves it to the database, exports it as a PDF, and updates the gemstone's certificate status.

```java
private void jButton1ActionPerformed(java.awt.event.ActionEvent evt) {
    try {
        String InvoiceNO = GenerateOrderNo.generateOrderNumber();
        String baseUrl = "https://pasanswijekoon.github.io/Verify/check-id";
        String testId = InvoiceNO;
        String url = baseUrl + "?id=" + testId;
        int width = 300;
        int height = 300;
        byte[] qrCodeBytes = QRCodeGenerator.generateQRCodeImage(url, width, height);
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(qrCodeBytes);
        BufferedImage qrCodeImage = ImageIO.read(byteArrayInputStream);
        String datetime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        HashMap<String, Object> map = new HashMap<>();
        map.put("ReportNo", InvoiceNO);
        map.put("Date", datetime);
        map.put("color", jTextField1.getText());
        map.put("TRANSPAREN", jTextField2.getText());
        map.put("SHAPE", jTextField19.getText());
        map.put("Weight", jTextField21.getText());
        map.put("Measurements", jTextField22.getText());
        map.put("cut", jTextField20.getText());
        map.put("RI", jTextField3.getText());
        map.put("SG", jTextField4.getText());
        map.put("hardness", jTextField11.getText());
        map.put("oc", jTextField6.getText());
        map.put("pleochro", jTextField5.getText());
        map.put("adsorption", jTextField10.getText());
        map.put("fluorescen", jTextField17.getText());
        map.put("Magnification", jTextField8.getText());
        map.put("INTERNAL", jTextField7.getText());
        map.put("EXTERNAL", jTextField9.getText());
        map.put("TREATMENT", jTextField13.getText());
        map.put("Origin", jTextField12.getText());
        map.put("Species", jTextField14.getText());
        map.put("Remarks", jTextField18.getText());
        map.put("VARIETY", jTextField15.getText());
        map.put("GEMOLOGISt", jTextField16.getText());
        map.put("qrcode", qrCodeImage);
        String reportPath = "src//com//reports//GemCertificate.jasper";
        JRDataSource dataSource = new JREmptyDataSource();
        JasperPrint jasperPrint = JasperFillManager.fillReport(reportPath, map, dataSource);
        JasperViewer.viewReport(jasperPrint, false);
        String pdfFilePath = "GemCertificate_" + InvoiceNO + ".pdf";
        JasperExportManager.exportReportToPdfFile(jasperPrint, pdfFilePath);
        MySQL.execute("INSERT INTO `gem_certificates`(`certificate_id`, `certificate_generation_date`, `Gem_id`,`order_no`) " +
            "VALUES('" + InvoiceNO + "','" + datetime + "','" + jLabel2.getText() + "','" + jLabel1.getText() + "')");
        MySQL.execute("UPDATE `gem_orders` SET `Certificate_Print_Status`='2' WHERE `gem_id` = '" + jLabel2.getText() + "'");
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

Additional event handlers manage focus transitions between input fields (e.g., `jTextField2ActionPerformed`).

### Helper Methods

None explicitly defined beyond the event handlers and `gemdata()`.

## GUI

### Interface
![create-certificates-light](https://i.imgur.com/ReJO6gF.jpeg)

### Certificate Output
![create-certificates-dark](https://i.imgur.com/6Gynf7c.jpeg)

### Testing Qr Scan
![create-certificates-dark](https://i.imgur.com/My1Qch7.jpeg)



## Summary

The `CreateCertificatesForm` class is a key component for generating gemstone certificates within a GUI application. It extends `SimpleForm` and facilitates loading gemstone data, populating certificate fields, and printing certificates with QR codes.

### Class Variables

- `Order_no`: Tracks the order number for certificate generation.

### Constructor

- `CreateCertificatesForm(String Order_no)`: Initializes the form with an order number and loads gemstone data.

### Methods

- `gemdata()`: Loads completed gemstone data into the table.

### Event Handlers

- `jTable1MouseClicked`: Populates certificate fields with gemstone and lab data.
- `jButton1ActionPerformed`: Generates and prints certificates, including QR codes, and updates the database.


