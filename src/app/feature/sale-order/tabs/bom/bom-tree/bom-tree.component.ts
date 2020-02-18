import { Component, OnInit, Injectable, Input, OnChanges, AfterViewChecked,
  ViewEncapsulation, Output, EventEmitter, SimpleChanges  } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material';

import { BOMNode, BOM, BOMFlatNode, BOM1Node } from '../BOM';
import { LineUnitCode } from '../../line-unit-code/LineUnitCode';
import { FormArray, FormGroup } from '@angular/forms';
import { element } from 'protractor';
import { ERPCompany } from 'app/erp-logistic-site/ErpLogisticSite';

@Injectable()
export class BOMTreeDataBase {

  dataChange = new BehaviorSubject<BOM1Node[]>([]);

  get data(): BOM1Node[] { 
    return this.dataChange.value;
  }

  constructor() {
  }

  initialize(fatherNodeKey: [number, string], bom: BOM[]): void {
    const bomArr = bom.filter(item => item.display);
    const data = this.buildTree(fatherNodeKey, bomArr);

    data.sort(this.sortNode);
    if (data.length > 0) {
      data[0].first = true;
    }
    this.dataChange.next(data);
  }

  buildTree(fatherNodeKey: [number, string], bomArr: BOM[]): BOM1Node[] {
    const BOMTree: BOM1Node[] = [];
    
    bomArr.forEach(bomItem => {
      if (bomItem.parentItemUnitID === fatherNodeKey[0] &&
        bomItem.parentUnitCode === fatherNodeKey[1]) {
          
          bomItem.useSalePrice = bomItem.useSalePrice ? 
            bomItem.useSalePrice : 'N';
            
          const node: BOM1Node = {
            item: bomItem,
            children: this.buildTree(
              [bomItem.childItemUnitID, bomItem.childUnitCode], bomArr),
            first: false
          };
          node.children.sort(this.sortNode);
          if (node.children.length > 0) {
            node.children[0].first = true;
          }
          BOMTree.push(node);
        }
    });

    return BOMTree;
  }

  sortNode = (node: BOM1Node, otherNode: BOM1Node) => 
    (node.item.lineSeq > otherNode.item.lineSeq) ? 1 : 
      ((node.item.lineSeq < otherNode.item.lineSeq) ? -1 : 0 )

  insertItem(parent: BOM1Node, bom: BOM): void {
    const node: BOM1Node = {
      item: bom,
      children: [],
      first: false
    };
    if (parent.children.length === 0) {
      node.first = true;
    }
    parent.children.push(node);
    this.dataChange.next(this.data);
  }

  deleteNode(node: BOM1Node, level: number): void {
    if (level > 0) {
      const parent = this.getParentNode(node, this.data);
      const index = parent.children.indexOf(node);
      parent.children.splice(index, 1);
    } else {
      const index = this.data.indexOf(node);
      this.data.splice(index, 1);
    }
    this.dataChange.next(this.data);
  }

  getParentNode(node: BOM1Node, nodeArray: BOM1Node[]): BOM1Node {
    let parentNode = null;
    nodeArray.forEach(possibuleParentNode => {
      if (possibuleParentNode.children.length > 0) {
        const possibuleIndex = possibuleParentNode.children
          .indexOf(node);
        if (possibuleIndex > -1) {
          parentNode = possibuleParentNode;
        } else {
          const recPossibuleParentNode = 
            this.getParentNode(node, 
              possibuleParentNode.children);
          if (recPossibuleParentNode) {
            parentNode = recPossibuleParentNode;
          }
        }
      }
    });
    return parentNode;
  }
}

@Component({
  selector: 'app-bom-tree',
  templateUrl: './bom-tree.component.html',
  styleUrls: ['./bom-tree.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [BOMTreeDataBase]
})
export class BomTreeComponent 
  implements OnInit, OnChanges, AfterViewChecked {

  @Input()
  lineUnitCode: LineUnitCode;
  @Input()
  unitForm: FormGroup;
  @Input()
  formEnableDisable: boolean;
  @Input()
  selectedErp: ERPCompany;
  @Input()
  selectedCurCode: string;
  @Input()
  logisticSite: string;
  @Output()
  lineToUpdate = new EventEmitter<BOM>();
  @Output()
  finishInit = new EventEmitter<any>();
  
  flatNodeMap = new Map<BOMFlatNode, BOM1Node>();

  nestedNodeMap = new Map<BOM1Node, BOMFlatNode>();

  treeControl: FlatTreeControl<BOMFlatNode>;

  treeFlattener: MatTreeFlattener<BOM1Node, BOMFlatNode>;

  dataSource: MatTreeFlatDataSource<BOM1Node, BOMFlatNode>;
  
  constructor(private treeDataBase: BOMTreeDataBase) {
    this.treeFlattener = new MatTreeFlattener(this.transformer,
      this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<BOMFlatNode>(
      this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  ngOnInit(): void {
    this.treeDataBase.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
    this.treeDataBase.initialize(
      [this.lineUnitCode.itemUnitID, this.lineUnitCode.unitCode] ,
      this.lineUnitCode.boms);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lineUnitCode'] &&
      !changes['lineUnitCode'].firstChange) {
      this.treeDataBase.initialize(
        [this.lineUnitCode.itemUnitID, this.lineUnitCode.unitCode] ,
        this.lineUnitCode.boms);
    }
  }
  
  ngAfterViewChecked(): void {
    setTimeout(() => {
      this.finishInit.next();
    }, 1);
  }

  getLevel = (node: BOMFlatNode) => node.level;

  isExpandable = (node: BOMFlatNode) => node.expandable;

  getChildren = (node: BOM1Node): BOM1Node[] => node.children;

  transformer = (node: BOM1Node, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
        ? existingNode
        : new BOMFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = (node.children &&
      node.children.length > 0);
    flatNode.first = node.first;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  hideExpand(node: BOMFlatNode): boolean {
    const bomNode = this.flatNodeMap.get(node);
    return bomNode.children.length < 1;
  }

  addNewChild(newChild: BOM, node: BOMFlatNode): void {
    node.expandable = true;
    this.lineUnitCode.boms.push(newChild);
    const parentNode = this.flatNodeMap.get(node);
    this.treeDataBase.insertItem(parentNode, newChild);
    this.treeControl.expand(node);
  }

  delete(node: BOMFlatNode): void {
    const bomNode = this.flatNodeMap.get(node);
    this.removeFromLine(bomNode);
    this.treeDataBase.deleteNode(bomNode, node.level);
  }

  removeFromLine(node: BOM1Node): void {
    node.children.forEach(childNode => {
      this.removeFromLine(childNode);
    });

    const index = this.lineUnitCode.boms.indexOf(node.item);
    this.lineUnitCode.boms.splice(index, 1);
  }

}
