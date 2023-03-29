module.exports = {
    dashboard : {
        totalSell: "select ROUND(SUM(Total_Payable),2) AS sells_count from bill_information WHERE Tenant_ID = ?",
        todaySell:"select ROUND(SUM(Total_Payable),2) AS sells_count_today from bill_information where Date = CURDATE() AND Tenant_ID = ?",
        totalUser : "SELECT COUNT(*) AS users_count FROM user_information WHERE Tenant_ID = ?",
        totalBatch:"SELECT COUNT(*) AS batch_count FROM batch WHERE Tenant_ID = ?",
        totalMedicine:"SELECT COUNT(*) AS med_count FROM medicine_information WHERE Tenant_ID = ?",
        totalSupplier:"SELECT COUNT(*) AS sup_count FROM supplier",
        totalCategory:"SELECT COUNT(*) AS cat_count FROM category",
        totalGeneric:"SELECT COUNT(*) AS generic_count FROM drug_generic_name",
        totalManufac:"SELECT COUNT(*) AS manufac_count FROM manufacturer",
    },
    connectionObj:{
        host: 'localhost',
        user: 'root',
        password: 'rootroot',
        database: 'pharmacy'
    },
    user_access:{
        login: "SELECT * FROM user_access WHERE username = ? AND password = ?",

    },
    batch:{
        getAgregatedQuantityValueByMedicineID:"select Medicine_ID,  sum(Quantity) as Total_Quantity from batch group by Medicine_ID;",
        insertToBatch:"INSERT INTO batch SET ?"
    },
    medicine_information:{
        getMedicineByName:"SELECT * FROM medicine_information WHERE Medicine_Name = ? AND INNER JOIN batch ON medicine_information.id=batch.Medicine_ID",
        getMedicineAvailability:"SELECT * FROM medicine_information INNER JOIN inventory_master ON medicine_information.id=inventory_master.Medicine_ID WHERE Medicine_Name = ? AND inventory_master.Tenant_ID = ? AND inventory_master.Batch_ID = ? AND inventory_master.Total_count > 0"
    },
    joins:{
        inventory_medicine_information:"SELECT b.*, m.Medicine_Name FROM inventory_master b INNER JOIN medicine_information m on b.Medicine_ID = m.ID WHERE b.Tenant_ID = ? AND b.Total_count > 0",
        medicine_information_inventory:"SELECT medicine_information.Medicine_Name, inventory_master.Total_count as Total_Quantity, inventory_master.Batch_ID FROM medicine_information INNER JOIN inventory_master ON medicine_information.id=inventory_master.Medicine_ID WHERE inventory_master.Tenant_ID = ? AND inventory_master.Total_count > 0",
        batch_medicine_suplier:"SELECT b.*, m.Medicine_Name, s.Supplier_Name FROM batch b INNER JOIN medicine_information m on b.Medicine_ID = m.ID INNER JOIN supplier s on b.Supplier_ID = s.ID WHERE b.Tenant_ID = ?"
    },
    bill_information:{
        addBills: "INSERT INTO bill_information SET ?",
        getBills: "SELECT * FROM bill_information WHERE Tenant_ID=?",

    },
    inventory_master:{
        addInventory:"INSERT INTO inventory_master SET ?",
        fetchInventory:"SELECT * FROM inventory_master WHERE Medicine_ID = ? AND Tenant_ID = ? AND Batch_ID = ?",
        fetchInventoryByTenant:"SELECT * FROM inventory_master WHERE Medicine_ID = ? AND Tenant_ID = ?",
        updateInventory:"UPDATE inventory_master SET ? WHERE id = ?",
        updateQuantityByItem:"UPDATE inventory_master SET Total_count = Total_count - ? WHERE Medicine_ID = ? AND Batch_ID = ? AND Tenant_ID = ?"
    },
    cart:{
        addToCart:"INSERT INTO cart SET ?",
        getCardByInvoiceId:"SELECT c.*, b.* FROM cart c INNER JOIN bill_information b ON c.Invoice_No = b.Invoice_No Where c.Invoice_No = ?"
    },
    drug_generic_name:{
        getGenericName:"SELECT * FROM drug_generic_name",
        addGenericDrug:"INSERT INTO drug_generic_name SET ?",
        getGenericNameById:"SELECT * FROM drug_generic_name WHERE ID = ? ",
        updateGenericNameById:"UPDATE drug_generic_name SET ? WHERE ID = ?"
    }
}