const Income = require('../models/income');
const Expense = require('../models/expense');
const Goal = require('../models/goal');
const XLSX = require('xlsx')

const exportController = {
    exportIncome: (req, res) => {
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
                        const wb = XLSX.utils.book_new(); 
                        let data = JSON.stringify(result);
                        data = JSON.parse(data);
                    //    data = data.map(row => {
                    //     const { userId, __v, ...rest } = row
                    //     return rest;
                    //     });
                        const ws = XLSX.utils.json_to_sheet(data);
                    //    const customHeaders = ["Header 1", "Header 2", "Header 3"]; // Replace with your desired headers
                    //     XLSX.utils.sheet_add_aoa(ws, [customHeaders], { origin: "A1" }); // Adds headers to the first row
                        const columnWidths = [
                            { wch: 25 },
                            { wch: 25 },
                            { wch: 15 },
                            { wch: 26 },
                            { wch: 10 },
                            { wch: 26 },
                            { wch: 26 },
                        ];
                        ws['!cols'] = columnWidths;
                        XLSX.utils.book_append_sheet(wb, ws, 'income');
                        const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
                    //    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    //    res.setHeader('Content-Disposition', 'attachment; filename="export.xlsx"');
                        res.send(buffer);

                   })
                   .catch(err => res.status(500).json("Internal Server Error: " + err));
    },
    exportExpense: (req, res) => {
        const page = parseInt(req.query.page) || 1; 
                const limit = req.query.limit ? parseInt(req.query.limit) : null;
                const order = req.query.order === 'desc' ? -1 : 1;
                const skip = limit ? (page - 1) * limit : 0;
                let filters = {
                    userId: req.userId
                };
        
                let query = Expense.find(filters).sort({ createdAt: order }).skip(skip);
            
                if (limit) {
                    query = query.limit(limit);
                }
        
                query
                    .then(result => {
                        const wb = XLSX.utils.book_new(); 
                        let data = JSON.stringify(result);
                        data = JSON.parse(data);
                    //    data = data.map(row => {
                    //     const { userId, __v, ...rest } = row
                    //     return rest;
                    //     });
                        const ws = XLSX.utils.json_to_sheet(data);
                    //    const customHeaders = ["Header 1", "Header 2", "Header 3"]; // Replace with your desired headers
                    //     XLSX.utils.sheet_add_aoa(ws, [customHeaders], { origin: "A1" }); // Adds headers to the first row
                        const columnWidths = [
                            { wch: 25 },
                            { wch: 25 },
                            { wch: 15 },
                            { wch: 26 },
                            { wch: 26 },
                            { wch: 10 },
                        ];
                        ws['!cols'] = columnWidths;
                        XLSX.utils.book_append_sheet(wb, ws, 'expense');
                        const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
                    //    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    //    res.setHeader('Content-Disposition', 'attachment; filename="export.xlsx"');
                        res.send(buffer);
                    })
                    .catch(err => res.status(500).json("Internal Server Error: " + err));
    },
    exportGoal: (req, res) => {
        const page = parseInt(req.query.page) || 1; 
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const order = req.query.order === 'desc' ? -1 : 1;
        const skip = limit ? (page - 1) * limit : 0;
        let filters = {
            userId: req.userId
        };

        //search by name
        const { name } = req.query
        if(name) {
            filters.name = { $regex: name }
        }

        let query = Goal.find(filters).sort({ createdAt: order }).skip(skip);
    
        if (limit) {
            query = query.limit(limit);
        }

        query
            .then(result => {
                const wb = XLSX.utils.book_new(); 
                let data = JSON.stringify(result);
                data = JSON.parse(data);
            //    data = data.map(row => {
            //     const { userId, __v, ...rest } = row
            //     return rest;
            //     });
                const ws = XLSX.utils.json_to_sheet(data);
            //    const customHeaders = ["Header 1", "Header 2", "Header 3"]; // Replace with your desired headers
            //     XLSX.utils.sheet_add_aoa(ws, [customHeaders], { origin: "A1" }); // Adds headers to the first row
                const columnWidths = [
                    { wch: 25 },
                    { wch: 25 },
                    { wch: 15 },
                    { wch: 15 },
                    { wch: 15 },
                    { wch: 10 },
                ];
                ws['!cols'] = columnWidths;
                XLSX.utils.book_append_sheet(wb, ws, 'goal');
                const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
            //    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            //    res.setHeader('Content-Disposition', 'attachment; filename="export.xlsx"');
                res.send(buffer);
            })
            .catch(err => res.status(500).json({message: 'Internal Server Error'}));
    },
}

module.exports = exportController;