export class ItemGroup {
    itemGroupCode: number;
    itemGroupName: string;
    parentGroupCode: number;
}

export class TreeNode<T> {
    item: T;
    children?: TreeNode<T>[];
    first: boolean;
}

export class FlatNode<T> {
    item: T;
    level: number;
    expandable: boolean;
    first: boolean;
  }
