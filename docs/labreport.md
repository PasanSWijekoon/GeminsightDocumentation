---
sidebar: auto
---

# Lab Reports Form

## Description

The `LabReportsForm` class is a GUI component designed to manage lab reports for gemstones within an application. It extends the `SimpleForm` class and allows users to input detailed gemstone characteristics (e.g., color, shape, cut, transparency, weight, etc.), associate them with an order, and save the data to a database. The form displays gemstone orders awaiting reports and updates them once lab data is submitted.

## Activity

In this :

- actors involved: Gemologist and System.
- The process begins with the Gemologist selecting a gemstone from an order.
- The Gemologist enters detailed lab data for the gemstone.
- The System validates the input and saves the data to the database.
- If successful, the report status is updated, and the Gemologist is notified; otherwise, an error is displayed.
- The process ends with the lab report saved and the form redirected to a pending reports view.

## Class Variables

- `colorMap`: Maps gemstone color names to their IDs.
  - Type: `HashMap<String, Integer>`
- `shapeMap`: Maps gemstone shape names to their IDs.
  - Type: `HashMap<String, Integer>`
- `cutMap`: Maps gemstone cut names to their IDs.
  - Type: `HashMap<String, Integer>`
- `transMap`: Maps gemstone transparency names to their IDs.
  - Type: `HashMap<String, Integer>`
- `GemIdMap`: Maps gem IDs to `gemData` objects for the current session.
  - Type: `HashMap<String, gemData>`
- `OrderNo`: Stores the order number associated with the lab reports.
  - Type: `String`
- `color`, `trans`, `shape`, `cut`: Integer variables to store selected attribute IDs (not fully utilized in the code).
  - Type: `int`

## Constructor

### `LabReportsForm(String OrderNo)`

- **Description**: Initializes the form with the specified order number, sets up UI components, loads initial data, and configures table column widths.
- **Parameters**:
  - `OrderNo`: The order number for which lab reports are being generated.

```java
public LabReportsForm(String OrderNo) {
    initComponents();
    this.OrderNo = OrderNo;
    loadColor();
    loadShape();
    loadCut();
    transload();
    jLabel29.setText(OrderNo);
    jButton1.setEnabled(false);
    jButton3.setEnabled(false);
    gemdata();
    // Table column width configurations...
}
```

## Methods

### `clean()`

- **Description**: Resets all input fields and combo boxes to their initial state.
- **Access Modifier**: Public
- **Return Type**: Void

```java
public void clean() {
    jComboBox1.setSelectedIndex(0);
    jComboBox2.setSelectedIndex(0);
    jComboBox3.setSelectedIndex(0);
    jComboBox4.setSelectedIndex(0);
    jTextField1.setText("");
    jTextField2.setText("");
    jTextField3.setText("");
    jTextField4.setText("");
    jTextField5.setText("");
    jTextField6.setText("");
    jTextField7.setText("");
    jTextField8.setText("");
    jTextField9.setText("");
    jTextField10.setText("");
    jTextField11.setText("");
    jTextField18.setText("");
    jTextField12.setText("");
    jTextField13.setText("");
    jTextField14.setText("");
    jTextField15.setText("");
    jTextField16.setText("");
    jTextField17.setText("");
}
```

### `clearGemData()`

- **Description**: Clears the `GemIdMap` to reset stored gemstone data.
- **Access Modifier**: Private
- **Return Type**: Void

```java
private void clearGemData() {
    gemData gd = new gemData();
    GemIdMap.clear();
}
```

### `loadColor()`

- **Description**: Loads gemstone colors from the database into `jComboBox1` and populates `colorMap`.
- **Access Modifier**: Private
- **Return Type**: Void

```java
private void loadColor() {
    try {
        ResultSet rs = MySQL.execute("SELECT * FROM `gemstone_color`");
        Vector v = new Vector();
        v.add("Select");
        while (rs.next()) {
            v.add(rs.getString("color"));
            colorMap.put(rs.getString("color"), rs.getInt("color_id"));
        }
        DefaultComboBoxModel m = new DefaultComboBoxModel(v);
        jComboBox1.setModel(m);
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

### `loadShape()`

- **Description**: Loads gemstone shapes from the database into `jComboBox2` and populates `shapeMap`.
- **Access Modifier**: Private
- **Return Type**: Void

```java
private void loadShape() {
    try {
        ResultSet rs = MySQL.execute("SELECT * FROM `gemstone_shape`");
        Vector v = new Vector();
        v.add("Select");
        while (rs.next()) {
            v.add(rs.getString("shape"));
            shapeMap.put(rs.getString("shape"), rs.getInt("id_gemstone_shape"));
        }
        DefaultComboBoxModel m = new DefaultComboBoxModel(v);
        jComboBox2.setModel(m);
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

### `loadCut()`

- **Description**: Loads gemstone cuts from the database into `jComboBox3` and populates `cutMap`.
- **Access Modifier**: Private
- **Return Type**: Void

```java
private void loadCut() {
    try {
        ResultSet rs = MySQL.execute("SELECT * FROM `gemstone_cut`");
        Vector v = new Vector();
        v.add("Select");
        while (rs.next()) {
            v.add(rs.getString("cut"));
            cutMap.put(rs.getString("cut"), rs.getInt("id_gemstone_cut"));
        }
        DefaultComboBoxModel m = new DefaultComboBoxModel(v);
        jComboBox3.setModel(m);
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

### `transload()`

- **Description**: Loads gemstone transparency options from the database into `jComboBox4` and populates `transMap`.
- **Access Modifier**: Private
- **Return Type**: Void

```java
private void transload() {
    try {
        ResultSet rs = MySQL.execute("SELECT * FROM `gemstone_transparency`");
        Vector v = new Vector();
        v.add("Select");
        while (rs.next()) {
            v.add(rs.getString("transparency"));
            transMap.put(rs.getString("transparency"), rs.getInt("id_gemstone_transparency"));
        }
        DefaultComboBoxModel m = new DefaultComboBoxModel(v);
        jComboBox4.setModel(m);
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

### `gemdata()`

- **Description**: Loads gemstone data for the specified order number into `jTable1` where the report status is pending.
- **Access Modifier**: Private
- **Return Type**: Void

```java
private void gemdata() {
    try {
        String orderId = jLabel29.getText();
        ResultSet rs = MySQL.execute("SELECT * FROM `gem_orders` " +
            "INNER JOIN `gemstone_type` ON `gemstone_type`.`gemstone_type_id`=`gem_orders`.`gemstone_type_id` " +
            "INNER JOIN `gemstone_color` ON `gemstone_color`.`color_id`=`gem_orders`.`gemstone_color_id` " +
            "INNER JOIN `gemstone_clarity` ON `gemstone_clarity`.`id_gemstone_clarity`=`gem_orders`.`gemstone_clarity_id` " +
            "INNER JOIN `gemstone_cut` ON `gemstone_cut`.`id_gemstone_cut`=`gem_orders`.`gemstone_cut_id` " +
            "INNER JOIN `gemstone_treatment` ON `gemstone_treatment`.`id_gemstone_treatment`=`gem_orders`.`gemstone_treatment_id` " +
            "INNER JOIN `report_status` ON `report_status`.`idreport_status`=`gem_orders`.`report_status_idreport_status` " +
            "WHERE `order_no`='" + orderId + "' AND `report_status_idreport_status`='1' ORDER BY `gem_id` ASC");
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

### `loadGemUpdates()`

- **Description**: Populates `jTable3` with gemstone data from `GemIdMap`.
- **Access Modifier**: Private
- **Return Type**: Void

```java
private void loadGemUpdates() {
    DefaultTableModel dtm = (DefaultTableModel) jTable3.getModel();
    dtm.setRowCount(0);
    for (gemData gemdata : GemIdMap.values()) {
        Vector<String> vector = new Vector<>();
        vector.add(gemdata.getGemId());
        vector.add(gemdata.getColor());
        vector.add(gemdata.getShape());
        vector.add(gemdata.getCut());
        vector.add(gemdata.getTrans());
        vector.add(gemdata.getWeight());
        vector.add(gemdata.getMeasurements());
        vector.add(gemdata.getRefractiveIndex());
        vector.add(gemdata.getSpecificGravity());
        vector.add(gemdata.getPleochroism());
        vector.add(gemdata.getOpticalCharacter());
        vector.add(gemdata.getInclusionsExternal());
        vector.add(gemdata.getMagnification());
        vector.add(gemdata.getInclusionsInternal());
        vector.add(gemdata.getAdsorptionSpectrum());
        vector.add(gemdata.getHardness());
        vector.add(gemdata.getOrigin());
        vector.add(gemdata.getSpecies());
        vector.add(gemdata.getGemologist());
        vector.add(gemdata.getRemarks());
        vector.add(gemdata.getTreatment());
        vector.add(gemdata.getVariety());
        vector.add(gemdata.getFluorescence());
        dtm.addRow(vector);
    }
}
```

### Event Handlers

1. `jTable1MouseClicked(java.awt.event.MouseEvent evt)`: Populates input fields with selected gemstone data on double-click and enables the "Add" button.
2. `jButton1ActionPerformed(java.awt.event.ActionEvent evt)`: Validates and adds/updates gemstone data to `GemIdMap`.
3. `jButton3ActionPerformed(java.awt.event.ActionEvent evt)`: Saves all gemstone data from `GemIdMap` to the database and updates report status.
4. `jTable3MouseClicked(java.awt.event.MouseEvent evt)`: Populates input fields with selected gemstone data from `jTable3` on double-click.

Additional event handlers manage focus transitions between input fields (e.g., `jTextField1ActionPerformed`).

### Helper Methods

- `getOrderId(String gemId)`: Retrieves the order ID for a given gem ID from the database (currently unused in the main flow).

```java
private int getOrderId(String gemId) throws Exception {
    String query = "SELECT order_id FROM gem_orders WHERE gem_id='" + gemId + "'";
    ResultSet rs = MySQL.execute(query);
    if (rs.next()) {
        return rs.getInt("order_id");
    } else {
        throw new Exception("Order ID not found for gem ID: " + gemId);
    }
}
```

## GUI

### Create Report Form
![lab-reports-light](https://i.imgur.com/L7GTVMw.jpeg)


## Summary

The `LabReportsForm` class is a critical component for generating and managing gemstone lab reports within a GUI application. It extends `SimpleForm` and facilitates entering, updating, and saving detailed gemstone data linked to an order.

### Class Variables

- Multiple `HashMap`s for mapping gemstone attributes and storing gem data.
- `OrderNo` for tracking the associated order.

### Constructor

- `LabReportsForm(String OrderNo)`: Initializes the form with an order number and loads initial data.

### Methods

- `clean()`: Resets input fields and combo boxes.
- `clearGemData()`: Clears stored gemstone data.
- `loadColor()`: Populates color combo box and map.
- `loadShape()`: Populates shape combo box and map.
- `loadCut()`: Populates cut combo box and map.
- `transload()`: Populates transparency combo box and map.
- `gemdata()`: Loads pending gemstone data into the table.
- `loadGemUpdates()`: Updates the gemstone data table.

### Event Handlers

- Handlers for selecting gemstones, adding/updating data, and saving to the database.

### Helper Methods

- `getOrderId()`: Fetches order ID (unused in the current implementation).
