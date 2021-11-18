import { Groups } from '@/models/group';
/**
 * menu Highlight key
 * @param pathname string
 */
export const queryKeysByPath = (pathname: string): { openKey: string; selectKey: string } => {
  const reg = /(^\/*)|(\/*$)/g; // 匹配字符串首尾斜杠
  const path = pathname.replace(reg, '');
  const routes = path.split('/');
  return { openKey: routes[0], selectKey: routes[1] || routes[0] };
};

export const createGroupTreeList = (groupList: Groups) => {
  try {
    let parent, self, child;
    if (groupList.parents_self.length === 1) {
      parent = groupList.parents_self[1];
    } else {
      parent = null;
    }
    self = groupList.parents_self[0];
    child = groupList.children;

    let root = {
      key: self.parent_id + '-' + self.sub_id,
      value: self.parent_id + '-' + self.sub_id,
      parent_id: self.parent_id,
      sub_id: self.sub_id,
      parent_name: self.parent_name,
      sub_name: self.sub_name,
      title: self.sub_name,
      // label: self.sub_name + '(' + self.dev_cnt + ')',
      label: self.sub_name,
      children: [],
      dev_cnt: self.dev_cnt,
    };

    const add = (root: any, list: any) => {
      for (let i = 0; i < list.length; i++) {
        const n = list[i];
        if (n.parent_id == root.sub_id) {
          n.title = n.sub_name;
          n.label = n.sub_name + '(' + n.dev_cnt + ')';
          n.value = n.parent_id + '-' + n.sub_id;
          n.key = n.parent_id + '-' + n.sub_id;
          n.children = [];
          let newNode = add(n, list);
          root.children && root.children.push(newNode);
        }
      }
      return root;
    };

    let data = add(root, child);
    return [data];
  } catch (error) {
    return [];
  }
};

export const getTreeLeaf = (node: any, key: any) => {
  if (!node || !key) return [];
  const nodes: any[] = [];
  const search = (node: any, key: any) => {
    const len = node?.children?.length;
    if (node.key === key) {
      // 遍历到叶节点
      if (len > 0) {
        node.children.forEach((n: any) => {
          search(n, n.key);
        });
      } else {
        nodes.push(node);
      }
    } else if (len > 0) {
      // 未遍历到叶节点
      node.children.forEach((n: any) => {
        if (n.key === key) {
          search(n, n.key);
        } else {
          search(n, key);
        }
      });
    }
  };
  search(node, key);
  return nodes;
};

// 大端位
export const intToBytesBig = (value: any, bit: number = 2) => {
  let value1 = value;
  const bytes = [];
  for (let i = 0; i < bit; i++) {
    bytes[i] = (value1 >> (8 * i)) & 0xff;
  }
  return bytes;
};

// 小端位
export const intToBytes = (value: any) => {
  let value1 = value;
  const bytes = [];
  bytes[0] = (value1 >> 8) & 0xff;
  bytes[1] = value1 & 0xff;
  return bytes;
};

//计算CRC值
export const caluCRC = (bytes: any, len: any) => {
  let crc = 0xffff;
  for (let j = 0; j < len; j++) {
    crc = ((crc >>> 8) | (crc << 8)) & 0xffff;
    crc ^= bytes[j] & 0xff;
    crc ^= (crc & 0xff) >> 4;
    crc ^= (crc << 12) & 0xffff;
    crc ^= ((crc & 0xff) << 5) & 0xffff;
  }
  crc &= 0xffff;
  return crc;
};
