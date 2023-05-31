import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import { IOlympicData } from './interfaces';

@Component({
  selector: 'my-app',
  template: `<button (click)="addItems(undefined)">Add Items</button><button (click)="edit(undefined)">Edit Items</button>
  <ag-grid-angular
    style="width: 100%; height: 100%;"
    class="ag-theme-alpine"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [autoGroupColumnDef]="autoGroupColumnDef"
    [animateRows]="true"
    (gridReady)="onGridReady($event)"
    [treeData]="true"
    [getDataPath]="getDataPath"
    [enableGroupEdit]="true"
    (cellEditingStopped)="onCellEditingStopped($event)"
    [getRowId]="getRowId"
    (rowDragEnd)="onRowDragEnd($event)"
    [suppressMoveWhenRowDragging]="true"
    [rowDragManaged]="true"
  ></ag-grid-angular>`,
})
export class AppComponent {
  public columnDefs: ColDef[] = [
    { field: 'year' },
    { field: 'athlete' },
    { field: 'sport' },
    { field: 'gold' },
    { field: 'silver' },
    { field: 'bronze' },
  ];
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    resizable: true,
  };
  public autoGroupColumnDef: ColDef = {
    minWidth: 200,
    headerName: "Country",
    editable:this.isCellEditable.bind(this),
    rowDrag: true,
    cellRendererParams: {
    checkbox: true,
      suppressCount: true
    }
  };
  public rowData: any[] = [{"id": 1, "athlete":"Michael Phelps","age":27,"country":["United States 001"],"year":2012,"date":"12/08/2012","sport":"Swimming","gold":4,"silver":2,"bronze":0,"total":6},{"id": 2, "athlete":"Natalie Coughlin","age":25,"country":["United States 002"],"year":2008,"date":"24/08/2008","sport":"Swimming","gold":1,"silver":2,"bronze":3,"total":6},{"id": 3, "athlete":"Aleksey Nemov","age":24,"country":["Russia"],"year":2000,"date":"01/10/2000","sport":"Gymnastics","gold":2,"silver":1,"bronze":3,"total":6},{"id": 4, "athlete":"Alicia Coutts","age":24,"country":["Australia"],"year":2012,"date":"12/08/2012","sport":"Swimming","gold":1,"silver":3,"bronze":1,"total":5}];
  public gridApi: any;

  constructor(private http: HttpClient) {}

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.setRowData(this.rowData);
  }

  getDataPath(data) {
    return data.country;
  }

  addItems(addIndex: number | undefined) {
    const newRow = this.createNewRowData();
    const newItems = [
      newRow
    ];
    this.rowData.push(newRow);
    const res = this.gridApi.applyTransaction({
      add: newItems,
      addIndex: addIndex,
    });
  }

  createNewRowData() {
    const newData = {
      id: this.rowData.length + 1,
      country: ['Group 1'],
      customGroup: true
    };
    return newData;
  }

  edit() {
    this.gridApi.setFocusedCell(3, 'year', undefined);
    this.gridApi.startEditingCell({
        rowIndex: 3,
        colKey: 'country'
    });
  }

  isCellEditable(params) {
    return params.data.customGroup;
  }

  onCellEditingStopped(params) {
    var rowsToBeUpdated = [];
    if (params.oldValue !== params.newValue) {
      params.data.country = [params.newValue];
      rowsToBeUpdated.push(params.data);

      this.rowData.forEach(a=> {
        if(a.id !== params.data.id) {
          if(a.country[0] === params.oldValue) {
            a.country[0] = params.newValue;
            rowsToBeUpdated.push(a);
          }
        }
      });
      const res = this.gridApi.applyTransaction({ update: rowsToBeUpdated });
    }
  }

  getRowId(params) {
    return params.data.id;
  }

  
  onRowDragEnd(event) {
    var movingNode = event.node;
    var overNode = event.overNode;
    var hasChanged = false;

    var rowNeedsToMove = movingNode !== overNode;

    if (rowNeedsToMove && overNode) {
      // the list of rows we have is data, not row nodes, so extract the data
      var movingData = movingNode.data;
      var overData = overNode.data;

      if(movingData.customGroup)
      {
        
      }
      else if(!overData.customGroup)
      {

      }
      else {
        console.log(overData.country, movingData.country);
        movingData.country = [overData.country[0], movingData.country[0]];
        hasChanged = true;
      }
      
      if(hasChanged) {
        const res = this.gridApi.applyTransaction({ update: [movingData] });
      }
      
    }
}

moveInArray(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }
}
