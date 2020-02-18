import { Component, OnInit, AfterViewInit, Injectable, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { MatDialog, MatSnackBar, MatPaginator, MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';

import { ItemGroupService } from '../item-group.service';
import { ItemGroup, TreeNode, FlatNode } from '../ItemGroup';
import { BehaviorSubject, Observable } from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';

@Injectable()
export class ItemGroupTreeDataBase {

  dataChange = new BehaviorSubject<TreeNode<ItemGroup>[]>([]);

  get data(): TreeNode<ItemGroup>[] { 
    return this.dataChange.value;
  }

  constructor() {
  }

  initialize(fatherNodeKey: number, entityArray: ItemGroup[]): void {
    const data = this.buildTree(fatherNodeKey, entityArray);

    data.sort(this.sortNode);
    if (data.length > 0) {
      data[0].first = true;
    }
    this.dataChange.next(data);
  }

  buildTree(fatherNodeKey: number, entityArray: ItemGroup[]): TreeNode<ItemGroup>[] {
    const tree: TreeNode<ItemGroup>[] = [];
    
    entityArray.forEach(entity => {
      if (entity.parentGroupCode === fatherNodeKey) {
        const node: TreeNode<ItemGroup> = {
          item: entity,
          children: this.buildTree(
            entity.itemGroupCode, entityArray),
          first: false
        };
        node.children.sort(this.sortNode);
        if (node.children.length > 0) {
          node.children[0].first = true;
        }
        tree.push(node);

      }
    });
    return tree;
  }

  sortNode = (node: TreeNode<ItemGroup>, otherNode: TreeNode<ItemGroup>) => 
    (node.item.itemGroupCode > otherNode.item.itemGroupCode) ? 1 : 
      ((node.item.itemGroupCode < otherNode.item.itemGroupCode) ? -1 : 0 )

  insertItem(parent: TreeNode<ItemGroup>, entity: ItemGroup): void {
    const node: TreeNode<ItemGroup> = {
      item: entity,
      children: [],
      first: false
    };
    if (parent) {
      if (parent.children.length === 0) {
        node.first = true;
      }
      parent.children.push(node);
    } else {
      this.data.push(node);
    }
    this.dataChange.next(this.data);
  }

  deleteNode(node: TreeNode<ItemGroup>, level: number): void {
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

  getParentNode(node: TreeNode<ItemGroup>, nodeArray: TreeNode<ItemGroup>[])
    : TreeNode<ItemGroup> {
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
  selector: 'app-item-group-tree',
  templateUrl: './item-group-tree.component.html',
  styleUrls: ['./item-group-tree.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ItemGroupTreeDataBase]
})
export class ItemGroupTreeComponent 
  implements OnInit, AfterViewInit {

  itemGroups: ItemGroup[];
  deletedGroups: ItemGroup[] = [];
  isLoadingResults = true;
  resultsLength = 0;
  formArray: FormGroup[] = [];
  showCheck = false;
  returnUrl: string;
  item: any;

  flatNodeMap = new Map<FlatNode<ItemGroup>, TreeNode<ItemGroup>>();

  nestedNodeMap = new Map<TreeNode<ItemGroup>, FlatNode<ItemGroup>>();

  treeControl: FlatTreeControl<FlatNode<ItemGroup>>;

  treeFlattener: MatTreeFlattener<TreeNode<ItemGroup>, FlatNode<ItemGroup>>;

  dataSource: MatTreeFlatDataSource<TreeNode<ItemGroup>, FlatNode<ItemGroup>>;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private itemGroupService: ItemGroupService,
              private dialog: MatDialog,
              private snacBar: MatSnackBar,
              private translateService: TranslateService,
              private treeDataBase: ItemGroupTreeDataBase) {
      this.treeFlattener = new MatTreeFlattener(this.transformer,
        this.getLevel, this.isExpandable, this.getChildren);
      this.treeControl = new FlatTreeControl<FlatNode<ItemGroup>>(
        this.getLevel, this.isExpandable);
      this.dataSource = new MatTreeFlatDataSource(
        this.treeControl, this.treeFlattener);
      
      this.route.queryParams.subscribe(params => {
        if (params['showCheck']) {
          this.showCheck = params['showCheck'];
          this.returnUrl = params['returnUrl'];
        }
      });
      if (this.router.getCurrentNavigation().extras.state) {
        this.item = this.router.getCurrentNavigation().extras.state.item;
      }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.isLoadingResults = true;
    this.itemGroupService.loadListResults(0, '', '', '')
      .subscribe(itemsGroup => {
        this.resultsLength = itemsGroup.totalCount;
        this.itemGroups = itemsGroup.items;
        this.treeDataBase.dataChange.subscribe(data => {
          this.dataSource.data = data;
        });
        this.treeDataBase.initialize(
          null, this.itemGroups);
        this.isLoadingResults = false;
      });
  }  

  getLevel = (node: FlatNode<ItemGroup>) => node.level;

  isExpandable = (node: FlatNode<ItemGroup>) => node.expandable;

  getChildren = (node: TreeNode<ItemGroup>): TreeNode<ItemGroup>[] => node.children;

  transformer = (node: TreeNode<ItemGroup>, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
        ? existingNode
        : new FlatNode<ItemGroup>();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = (node.children &&
      node.children.length > 0);
    flatNode.first = node.first;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  hideExpand(node: FlatNode<ItemGroup>): boolean {
    const treeNode = this.flatNodeMap.get(node);
    return treeNode.children.length < 1;
  }

  addNewChild(newChild: ItemGroup, node: FlatNode<ItemGroup>): void {
    node.expandable = true;
    const parentNode = this.flatNodeMap.get(node);
    this.treeDataBase.insertItem(parentNode, newChild);
    this.treeControl.expand(node);
  }

  delete(node: FlatNode<ItemGroup>): void {
    const treeNode = this.flatNodeMap.get(node);
    this.addToDeleteNode(treeNode);
    this.treeDataBase.deleteNode(treeNode, node.level);
  }

  addToDeleteNode(treeNode: TreeNode<ItemGroup>): void {
    if (this.itemGroups.filter(g => g.itemGroupCode === 
        treeNode.item.itemGroupCode)
          .length > 0) {
        this.deletedGroups.push(treeNode.item);
      }
    treeNode.children.forEach(child => 
      this.addToDeleteNode(child));
  }

  addNewParent(): void {
    const newItemGroup = Object.assign(new ItemGroup(), {
      parentGroupCode: null
    });
    this.treeDataBase.insertItem(null, newItemGroup);
  }

  activateSave(): boolean {
    let valid = true;
    let dirty = false;
    if (this.deletedGroups.length > 0) {
      dirty = true;
    }
    this.formArray.forEach(form => {
      if (form.dirty) {
        dirty = true;
        if (!form.valid) {
          valid = false;
        }
      }
    });

    return valid && dirty;
  }

  selectGroup(node: FlatNode<ItemGroup>): void {
    const navigationExtras: NavigationExtras = {
      queryParams: { selectedGroup: node.item.itemGroupCode },
      state: { item: this.item }
    };
    this.router.navigate([this.returnUrl], navigationExtras);
  }

  save(): void {
    this.isLoadingResults = true;
    const actionObservablueList: Observable<ItemGroup>[] = [];
    const actionObservablueDeleteList: Observable<any>[] = [];
    this.formArray.forEach(form => {
      if (form.dirty) {
        const entity = this.extractEntityFromForm(form);
        if (this.deletedGroups.filter(g => g.itemGroupCode === entity.itemGroupCode)
          .length === 0) {
          if (this.itemGroups.filter(g => g.itemGroupCode === entity.itemGroupCode)
              .length > 0) {
            const actionObservablue = this.itemGroupService
              .updateItem(entity);
            actionObservablueList.push(actionObservablue);
          } else {
            const actionObservablue = this.itemGroupService
              .createItem(entity);
            actionObservablueList.push(actionObservablue);
          }
        }
      }
    });
    this.deletedGroups.forEach(g => {
      const actionObservablue = this.itemGroupService
        .deleteItem(g);
      actionObservablueDeleteList.push(actionObservablue);
    });

    this.handleServiceCallBack(actionObservablueList,
      actionObservablueDeleteList);
  }

  extractEntityFromForm(form: FormGroup): ItemGroup {
    const itemGroup = Object.assign(new ItemGroup(), {
      itemGroupCode: form.get('itemGroupCode').value,
      itemGroupName: form.get('itemGroupName').value,
      parentGroupCode: form.get('parentGroupCode').value
    });
    return itemGroup;
  }

  handleServiceCallBack(actionObservablueList: Observable<ItemGroup>[],
                        deleteList: Observable<any>[]): void {
    actionObservablueList.forEach((observ, index) => {
      observ.subscribe(data => {
        if (data && data.itemGroupCode) {
          this.snacBar.open(`${this.translateService.instant(
            'ITEM_GROUP_EDITED', { value: data.itemGroupCode })}`, null, {
              duration: 2000,
              verticalPosition: 'top'
            });
        } else {
          this.snacBar.open(`There was an issue, please check the log`, null, {
            duration: 2000,
            verticalPosition: 'top'
          });
        }
        if (index + 1 >= actionObservablueList.length) {
          this.isLoadingResults = false;
        }
      }, error => {
          this.snacBar.open(`There was an issue, please check the log`, null, {
            duration: 2000,
            verticalPosition: 'top'
          });
          if (index + 1 >= actionObservablueList.length) {
            this.isLoadingResults = false;
          }
        });
      });
    deleteList.forEach((observ, index) => {
      observ.subscribe(() => {
        this.snacBar.open(`${this.translateService.instant(
          'ITEM_GROUP_DELETED', { value: this.deletedGroups[index].itemGroupCode })}`, null, {
            duration: 2000,
            verticalPosition: 'top'
          });
        this.deletedGroups.splice(index, 1);
        this.isLoadingResults = false;
      }, error => {
        this.snacBar.open(`There was an issue, please check the log`, null, {
          duration: 2000,
          verticalPosition: 'top'
          });
        this.isLoadingResults = false;
      });
    });
  }
}
