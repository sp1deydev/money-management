const Income = require('../models/income');
const XLSX = require('xlsx')
const exceljs = require("exceljs");
 const exportData = (data) => {
  let workbook = new exceljs.Workbook();
  let worksheet = workbook.addWorksheet("Worksheet");
	let columns = data.reduce((acc, obj) => acc = Object.getOwnPropertyNames(obj), [])
  
  worksheet.columns = columns.map((el) => { 
    return { header: el, key: el, width: 20 }
  });
  
  worksheet.addRows(data);
  return worksheet;
};


const exportController = {
    exportIncome: (req, res) => {
        const wb = XLSX.utils.book_new(); 
        const page = parseInt(req.query.page) || 1; 
               const limit = req.query.limit ? parseInt(req.query.limit) : null;
               const order = req.query.order === 'desc' ? -1 : 1;
               const skip = limit ? (page - 1) * limit : 0;
               let filters = {
                   userId: req.userId
               };

               let query = Income.find(filters).sort({ createdAt: order }).skip(skip);

               if (limit) {
                   query = query.limit(limit);
               }

               query
                   .then(result => {
                       let data = JSON.stringify(result);
                       data = JSON.parse(data);
                       const ws = XLSX.utils.json_to_sheet(data);
                       XLSX.utils.book_append_sheet(wb, ws, 'income');
                       const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
                    //    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    //    res.setHeader('Content-Disposition', 'attachment; filename="export.xlsx"');
                       res.send(buffer);

                   })
                   .catch(err => console.log(err));
    },
}

module.exports = exportController;