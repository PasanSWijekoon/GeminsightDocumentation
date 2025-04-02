---
sidebar: auto
---

# Gem Orders Form

## Description

The `GemOrdersForm` class is a GUI component designed to manage gemstone orders within an application. It extends the `SimpleForm` class and provides functionalities for creating, updating, and saving gemstone orders, including details such as gemstone type, color, clarity, cut, treatment, weight, and price. The form integrates with a database to store order information and supports invoice generation and printing.

## Activity

In this Activity:

- Actors: Customer and Cashier.
- The process begins with the Customer selecting a gemstone and providing order details.
- The Cashier verifies the details and adds the gemstone to the order.
- The Cashier calculates the total, processes payment, and saves the order.
- If payment is successful, an invoice is generated; otherwise, the Customer is notified.
- The process ends with the order saved and an invoice printed.

## Class Variables

- `gemStoneTypeMap`: Maps gemstone type names to their IDs.
  - Type: `HashMap<String, String>`
- `gemStoneColorMap`: Maps gemstone color names to their IDs.
  - Type: `HashMap<String, String>`
- `gemStoneConditionMap`: Maps gemstone clarity names to their IDs.
  - Type: `HashMap<String, String>`
- `gemStoneCutMap`: Maps gemstone cut names to their IDs.
  - Type: `HashMap<String, String>`
- `gemStoneTreatmentMap`: Maps gemstone treatment names to their IDs.
  - Type: `HashMap<String, String>`
- `paymentMethodMap`: Maps payment method names to their IDs (currently commented out).
  - Type: `HashMap<String, String>`
- `gemOrderItemMap`: Maps gem IDs to `GemOrderItem` objects for the current order.
  - Type: `HashMap<String, GemOrderItem>`
- `customer_ID`: Stores the ID of the customer placing the order.
  - Type: `String`
- `total`: Tracks the total price of the order.
  - Type: `double`

## Constructor

### `GemOrdersForm(String customer_ID)`

- **Description**: Initializes the form with the specified customer ID, sets up UI components, and loads initial data.
- **Parameters**:
  - `customer_ID`: The ID of the customer placing the order.

```java
public GemOrdersForm(String customer_ID) {
    this.customer_ID = customer_ID;
    initComponents();
    jTextField1.setText(customer_ID);
    jTextField1.setEditable(false);
    onLoad();
}
```

## Methods

### `clear()`

- **Description**: Resets input fields related to adding a gemstone to their initial state.
- **Access Modifier**: Public
- **Return Type**: Void

```java
public void clear() {
    jTextField3.setText("");
    jTextField4.setText("Weight");
    jTextField6.setText("");
    jComboBox1.setSelectedIndex(0);
    jComboBox2.setSelectedIndex(0);
    jComboBox3.setSelectedIndex(0);
    jComboBox4.setSelectedIndex(0);
    jComboBox5.setSelectedIndex(0);
}
```

### `reset()`

- **Description**: Resets all input fields and selections to their initial state, excluding the customer ID.
- **Access Modifier**: Public
- **Return Type**: Void

```java
public void reset() {
    jTextField2.setText("");
    jTextField3.setText("");
    jTextField4.setText("");
    jTextField5.setText("");
    jTextField6.setText("");
    jComboBox1.setSelectedIndex(0);
    jComboBox2.setSelectedIndex(0);
    jComboBox5.setSelectedIndex(0);
    jComboBox4.setSelectedIndex(0);
    jLabel14.setText("");
    jTable1.clearSelection();
}
```

### `Totalcleanup()`

- **Description**: Clears all form data, including the order table and `gemOrderItemMap`, and disables relevant buttons.
- **Access Modifier**: Public
- **Return Type**: Void

```java
public void Totalcleanup() {
    jTextField7.setText("");
    jTextField1.setText("");
    jButton6.setEnabled(false);
    jTextField2.setText("");
    jButton7.setEnabled(false);
    jTextField3.setText("");
    jComboBox1.setSelectedIndex(0);
    jComboBox2.setSelectedIndex(0);
    jComboBox5.setSelectedIndex(0);
    jComboBox4.setSelectedIndex(0);
    jComboBox3.setSelectedIndex(0);
    jTextField4.setText("Weight");
    jTextField6.setText("");
    jTextField5.setText("");
    jTable1.clearSelection();
    gemOrderItemMap.clear();
    DefaultTableModel model = (DefaultTableModel) jTable1.getModel();
    model.setRowCount(0);
}
```

### `onLoad()`

- **Description**: Loads initial data such as cashier details, current date/time, and gemstone attributes into the form.
- **Access Modifier**: Private
- **Return Type**: Void

```java
private void onLoad() {
    String userID = loggedInUser.getUserType();
    userName = loggedInUser.getFirstName() + " " + loggedInUser.getLastName();
    jLabel2.setText(userName);
    currentDateTime();
    loadGemStoneType();
    loadGemStoneColor();
    loadGemStoneCondition();
    loadGemStoneCut();
    loadGemStoneTreatment();
}
```

### `loadGemStoneType()`

- **Description**: Loads gemstone types from the database into `jComboBox1` and populates `gemStoneTypeMap`.
- **Access Modifier**: Private
- **Return Type**: Void

```java
private void loadGemStoneType() {
    try {
        ResultSet resultSet = MySQL.execute("SELECT * FROM `gemstone_type`");
        Vector<String> v = new Vector<>();
        v.add("Gemstone Type");
        while (resultSet.next()) {
            String type = resultSet.getString("type");
            String id = resultSet.getString("gemstone_type_id");
            v.add(type);
            this.gemStoneTypeMap.put(type, id);
        }
        jComboBox1.setModel(new DefaultComboBoxModel<String>(v));
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

### `LoadOrderTable()`

- **Description**: Populates the order table with items from `gemOrderItemMap` and updates the total price.
- **Access Modifier**: Private
- **Return Type**: Void

```java
private void LoadOrderTable() {
    DefaultTableModel defaultTableModel = (DefaultTableModel) jTable1.getModel();
    defaultTableModel.setRowCount(0);
    total = 0.0;
    for (GemOrderItem gemOrderItem : gemOrderItemMap.values()) {
        Object[] rowData = {
            gemOrderItem.getGem_id(),
            gemOrderItem.getGem_img(),
            gemOrderItem.getGemstone_type(),
            gemOrderItem.getGemstone_color(),
            gemOrderItem.getGemstone_clarity(),
            gemOrderItem.getGemstone_cut(),
            gemOrderItem.getGemstone_treatment(),
            gemOrderItem.getWeight_carats(),
            gemOrderItem.getGem_price()
        };
        defaultTableModel.addRow(rowData);
        total += Double.parseDouble(gemOrderItem.getGem_price());
    }
    jLabel14.setText(String.format("%.2f", total));
}
```

### `printdata()`

- **Description**: Generates and displays an invoice report using JasperReports based on the order data.
- **Access Modifier**: Public
- **Return Type**: Void

```java
public void printdata() {
    try {
        HashMap<String, Object> parameters = new HashMap<>();
        parameters.put("Parameter1", jTextField2.getText());
        parameters.put("Parameter2", jTextField7.getText());
        parameters.put("Parameter3", jTextField1.getText());
        parameters.put("Parameter5", jLabel2.getText());
        parameters.put("Parameter6", jLabel14.getText());
        parameters.put("Parameter7", jTextField5.getText());
        parameters.put("Parameter9", jLabel4.getText());
        String path = "src//com//reports//geminsight.jasper";
        JRTableModelDataSource datasource = new JRTableModelDataSource(jTable1.getModel());
        JasperPrint jasperPrint = JasperFillManager.fillReport(path, parameters, datasource);
        JasperViewer.viewReport(jasperPrint, false);
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

### Event Handlers

1. `jButton2ActionPerformed(java.awt.event.ActionEvent evt)`: Adds a gemstone to the order.
2. `jButton6ActionPerformed(java.awt.event.ActionEvent evt)`: Generates an order number.
3. `jButton7ActionPerformed(java.awt.event.ActionEvent evt)`: Generates a unique gem ID.
4. `jButton8ActionPerformed(java.awt.event.ActionEvent evt)`: Saves the order and generates an invoice.
5. `jButton11ActionPerformed(java.awt.event.ActionEvent evt)`: Clears gemstone input fields.
6. `jTextField1CaretUpdate(javax.swing.event.CaretEvent evt)`: Updates customer details based on ID input.

Additional event handlers exist for combo box selections and other interactions.

### Helper Methods

- `SelectCustomer()`: Retrieves and displays customer name based on the entered customer ID.

```java
private void SelectCustomer() {
    String customer_Id = jTextField1.getText();
    try {
        ResultSet resultSet = MySQL.execute("SELECT * FROM `customer` WHERE `customer_id` = '" + customer_Id + "' OR `mobile` = '" + customer_Id + "'");
        if (resultSet.next()) {
            customer_ID = resultSet.getString("customer_id");
            jTextField7.setText(resultSet.getString("fname") + " " + resultSet.getString("lname"));
            jTextField7.setEditable(false);
        }
    } catch (Exception e) {
        System.out.println(e);
    }
}
```

## GUI

### Order Interface
![gem-orders-light](https://github.com/PasanSWijekoon/GeminsightDocumentation/blob/main/docs/img/gemorders-light.png?raw=true)

### Invoice
![gem-orders-light](https://i.imgur.com/npuTATz.jpeg)



## Summary

The `GemOrdersForm` class is a key component for managing gemstone orders in a GUI application. It extends `SimpleForm` and facilitates adding gemstone items, calculating totals, processing payments, and generating invoices.

### Class Variables

- Multiple `HashMap`s for mapping gemstone attributes and order items.
- `customer_ID` and `total` for tracking order-specific data.

### Constructor

- `GemOrdersForm(String customer_ID)`: Sets up the form with a customer ID and loads initial data.

### Methods

- `clear()`: Resets gemstone input fields.
- `reset()`: Resets all fields except customer ID.
- `Totalcleanup()`: Clears all data and resets the form.
- `onLoad()`: Initializes cashier info and gemstone data.
- `loadGemStoneType()`: Populates gemstone type combo box and map.
- `LoadOrderTable()`: Updates the order table with current items.
- `printdata()`: Generates an invoice report.

### Event Handlers

- Handlers for adding items, generating IDs, saving orders, and clearing fields.

### Helper Methods

- `SelectCustomer()`: Fetches customer details based on ID.

