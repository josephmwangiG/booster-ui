import $ from "jquery";
import DataTable from "datatables.net-vue3";
import "datatables.net-buttons";
import "datatables.net-buttons/js/buttons.html5";
import jszip from "jszip";
import DataTablesLib from "datatables.net";
import pdfMake from "pdfmake";
import moment from "moment";

// Make jQuery globally available
(window as any).$ = $;
(window as any).jQuery = $;

DataTable.use(DataTablesLib);
(DataTablesLib.Buttons as any).jszip(jszip);
(DataTablesLib.Buttons as any).pdfMake(pdfMake);

(pdfMake as any).fonts = {
  // download default Roboto font from cdnjs.com
  Roboto: {
    normal:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
    bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
    italics:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
    bolditalics:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
  },
};

export const initDataTable = (dataTableRef: any) => {
  try {
    // Check if DataTable is already initialized
    if ($.fn.DataTable.isDataTable(dataTableRef)) {
      $(dataTableRef).DataTable().destroy();
    }
    
    // Verify table structure before initializing
    const thead = $(dataTableRef).find('thead');
    const tbody = $(dataTableRef).find('tbody');
    
    if (thead.length === 0 || tbody.length === 0) {
      console.warn('Table structure incomplete - missing thead or tbody');
      return;
    }
    
    const headerCells = thead.find('th').length;
    
    // Check if there are actual data rows (not loading or empty state rows)
    const dataRows = tbody.find('tr').not('.text-center').filter(function() {
      return $(this).find('td').length > 0;
    });
    
    if (dataRows.length === 0) {
      console.warn('No data rows found, skipping DataTable initialization');
      return;
    }
    
    const firstDataRow = dataRows.first();
    const dataCells = firstDataRow.find('td').length;
    
    // Only initialize if we have matching column counts
    if (headerCells > 0 && headerCells === dataCells) {
      ($(dataTableRef) as any).DataTable({
        // DataTable options
        ordering: false,
        dom: "Bftip",
        buttons: [
          {
            text: "PDF",
            extend: "pdf",
            className: "custom-pdf-button",
          },
          {
            text: "CSV",
            extend: "csv",
            className: "custom-csv-button",
          },
          {
            text: "Excel",
            extend: "excel",
            className: "custom-excel-button",
          },
        ],
        // Add error handling
        drawCallback: function() {
          // Handle any post-draw operations if needed
        }
      });
    } else {
      console.warn(`Column count mismatch: headers=${headerCells}, data=${dataCells}`);
    }
  } catch (error) {
    console.error('Error initializing DataTable:', error);
  }
};

/**
 * Generates a PDF from a given data table.
 *
 * @param {string} dataTableRef - The reference to the data table.
 * @return {void} This function does not return a value.
 */

export const exportToPDF = (dataTableRef: any) => {
  const dt = $(dataTableRef).DataTable();
  (dt as any).button(".custom-pdf-button").trigger();
};

export const exportToCSV = (dataTableRef: any) => {
  const dt = $(dataTableRef).DataTable();
  (dt as any).button(".custom-csv-button").trigger();
};

export const exportToExcel = (dataTableRef: any) => {
  const dt = $(dataTableRef).DataTable();
  (dt as any).button(".custom-excel-button").trigger();
};

export const handleSearch = (dataTableRef: any, value: string) => {
  const dt = $(dataTableRef).DataTable();
  dt.search(value).draw();
};

export const handleColumnSearch = (dataTableRef: any, columnIndex: number, value: string) => {
  const dt = $(dataTableRef).DataTable();
  dt.column(columnIndex).search(value).draw();
};

export const handleDateRangeFilter = (dataTableRef: any, columnIndex: number, dateFrom: string, dateTo: string) => {
  const dt = $(dataTableRef).DataTable();
  
  // Custom search function for date range
  $.fn.dataTable.ext.search.push(function(settings: any, data: any) {
    if (settings.nTable !== dataTableRef) {
      return true;
    }
    
    const dateStr = data[columnIndex];
    if (!dateStr || (!dateFrom && !dateTo)) {
      return true;
    }
    
    const cellDate = moment(dateStr, ['MMM DD YYYY', 'MMM DD YYYY HH:mm', 'YYYY-MM-DD']);
    const fromDate = dateFrom ? moment(dateFrom) : null;
    const toDate = dateTo ? moment(dateTo) : null;
    
    if (!cellDate.isValid()) {
      return true;
    }
    
    if (fromDate && cellDate.isBefore(fromDate, 'day')) {
      return false;
    }
    
    if (toDate && cellDate.isAfter(toDate, 'day')) {
      return false;
    }
    
    return true;
  });
  
  dt.draw();
};

export const clearDateRangeFilter = (dataTableRef: any) => {
  // Remove all custom search functions
  $.fn.dataTable.ext.search = [];
  const dt = $(dataTableRef).DataTable();
  dt.draw();
};

export const handleMultiColumnFilter = (dataTableRef: any, filters: Array<{ columnIndex: number; value: string }>) => {
  const dt = $(dataTableRef).DataTable();
  
  filters.forEach(filter => {
    if (filter.value) {
      dt.column(filter.columnIndex).search(filter.value);
    } else {
      dt.column(filter.columnIndex).search('');
    }
  });
  
  dt.draw();
};

export const clearAllFilters = (dataTableRef: any) => {
  const dt = $(dataTableRef).DataTable();
  dt.search('').columns().search('').draw();
  $.fn.dataTable.ext.search = [];
};

export const initDataTableWithSearch = (dataTableRef: any, options: any = {}) => {
  try {
    // Check if DataTable is already initialized
    if ($.fn.DataTable.isDataTable(dataTableRef)) {
      $(dataTableRef).DataTable().destroy();
    }
    
    // Verify table structure before initializing
    const thead = $(dataTableRef).find('thead');
    const tbody = $(dataTableRef).find('tbody');
    
    if (thead.length === 0 || tbody.length === 0) {
      console.warn('Table structure incomplete - missing thead or tbody');
      return;
    }
    
    const headerCells = thead.find('th').length;
    
    // Check if there are actual data rows (not loading or empty state rows)
    const dataRows = tbody.find('tr').not('.text-center').filter(function() {
      return $(this).find('td').length > 0;
    });
    
    console.log('DataTable Debug Info:');
    console.log('- Header cells:', headerCells);
    console.log('- Total tbody rows:', tbody.find('tr').length);
    console.log('- Data rows (non-loading/empty):', dataRows.length);
    
    if (dataRows.length === 0) {
      console.warn('No data rows found, skipping DataTable initialization');
      return;
    }
    
    const firstDataRow = dataRows.first();
    const dataCells = firstDataRow.find('td').length;
    
    console.log('- First data row cells:', dataCells);
    console.log('- First data row HTML:', firstDataRow[0]?.outerHTML);
    
    // Only initialize if we have matching column counts
    if (headerCells > 0 && headerCells === dataCells) {
      const defaultOptions = {
        ordering: false,
        dom: "Bftip",
        buttons: [
          {
            text: "PDF",
            extend: "pdf",
            className: "custom-pdf-button",
          },
          {
            text: "CSV",
            extend: "csv",
            className: "custom-csv-button",
          },
          {
            text: "Excel",
            extend: "excel",
            className: "custom-excel-button",
          },
        ],
        searching: true,
        searchDelay: 300,
        ...options
      };
      
      return ($(dataTableRef) as any).DataTable(defaultOptions);
    } else {
      console.warn(`Column count mismatch: headers=${headerCells}, data=${dataCells}`);
    }
  } catch (error) {
    console.error('Error initializing DataTable with search:', error);
  }
};

export const formatDate = (date: string, has_time_stamp = false) => {
  if (date != null && date != "") {
    if (has_time_stamp) {
      return moment(date).format("MMM DD YYYY HH:mm");
    } else {
      return moment(date).format("MMM DD YYYY");
    }
  }
  return "";
};
