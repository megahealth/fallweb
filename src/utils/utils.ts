import { Groups } from '@/models/group';
/**
 * menu Highlight key
 * @param pathname string
 */
export const queryKeysByPath = (
  pathname: string,
): { openKey: string; selectKey: string } => {
  const reg = /(^\/*)|(\/*$)/g; // 匹配字符串首尾斜杠
  const path = pathname.replace(reg, '');
  const routes = path.split('/');
  return { openKey: routes[0], selectKey: routes[1] || routes[0] };
};

export const createGroupTreeList = (groupList: Groups) => {
  try {
    if (groupList.children.length === 0) {
      return [];
    }
    const self = groupList.parents_self[0];
    const child = groupList.children;

    let root = {
      title: self.sub_name,
      label: self.sub_name,
      key: self.parent_id + '-' + self.sub_id,
      parent_id: self.parent_id,
      sub_id: self.sub_id,
      value: self.parent_id + '-' + self.sub_id,
      parent_name: self.parent_name,
      sub_name: self.sub_name,
      children: [],
    };
    for (let i = 0; i < child.length; i++) {
      const n = child[i];
      if (root.parent_id > n.parent_id) {
        root = n;
      }
    }

    const add = (c: any) => {
      for (let i = 0; i < child.length; i++) {
        const n = child[i];
        if (n.parent_id == c.sub_id) {
          n.title = n.sub_name;
          n.label = n.sub_name + '(' + n.dev_cnt + ')';
          n.value = n.parent_id + '-' + n.sub_id;
          n.key = n.parent_id + '-' + n.sub_id;
          c.children && c.children.push(n);
          add(n);
        }
      }
      return c;
    };
    // console.log(add(root))
    const data = add(root);
    const arr = [];
    arr.push(data);
    return arr;
  } catch (error) {
    return [];
  }
};
