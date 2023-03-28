module.exports = {
    dashboard : {
        totalSell: "select ROUND(SUM(Total_Payable),2) AS sells_count from bill_information",
        todaySell:"select ROUND(SUM(Total_Payable),2) AS sells_count_today from bill_information where Date = CURDATE()",
        totalUser : "SELECT COUNT(*) AS users_count FROM user_information",
        totalBatch:"SELECT COUNT(*) AS batch_count FROM batch",
        totalMedicine:"SELECT COUNT(*) AS med_count FROM medicine_information",
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
        getAgregatedQuantityValueByMedicineID:"select Medicine_ID,  sum(Quantity) as Total_Quantity from batch group by Medicine_ID;"
    },
    medicine_information:{
        getMedicineByName:"SELECT * FROM medicine_information WHERE Medicine_Name = ? AND INNER JOIN batch ON medicine_information.id=batch.Medicine_ID",
        getMedicineAvailability:"SELECT * FROM medicine_information INNER JOIN batch ON medicine_information.id=batch.Medicine_ID WHERE Medicine_Name = ?"
    },
    joins:{
        medicine_information_suppliers:"SELECT b.*, m.Medicine_Name, s.Supplier_Name FROM batch b INNER JOIN medicine_information m on b.Medicine_ID = m.ID INNER JOIN supplier s on b.Supplier_ID = s.ID",
        medicine_information_batch:"SELECT medicine_information.Medicine_Name, sum(batch.Quantity) as Total_Quantity FROM medicine_information INNER JOIN batch ON medicine_information.id=batch.Medicine_ID group by medicine_information.id"
    },
    bill_information:{
        addBills: "INSERT INTO bill_information SET ?",
        getBills: "SELECT * FROM bill_information WHERE Tenant_ID=?",

    },
    cart:{
        addToCart:"INSERT INTO cart SET ?",
    },
    drug_generic_name:{
        getGenericName:"SELECT * FROM drug_generic_name",
        addGenericDrug:"INSERT INTO drug_generic_name SET ?",
        getGenericNameById:"SELECT * FROM drug_generic_name WHERE ID = ? ",
        updateGenericNameById:"UPDATE drug_generic_name SET ? WHERE ID = ?"
    }
}