import $ from "jquery";
import DataTable from "datatables.net-vue3";
import "datatables.net-buttons";
import "datatables.net-buttons/js/buttons.html5";
import jszip from "jszip";
import DataTablesLib from "datatables.net";
import pdfMake from "pdfmake";
import moment from "moment";

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
  });
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
