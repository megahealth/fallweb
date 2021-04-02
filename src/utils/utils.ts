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

export const searchNode = (node, key) => {
  const len = node && node.children && node.children.length;
  let ts = [];
  if (node.key === key) {
    if (len > 0) {
      node.children.forEach(n => {
        searchNode(n, n.key);
      });
    } else {
      const ids = node.key.split('-');
      const id = ids[ids.length - 1];
      const topic = `web/${id}/#`;
      ts.push(topic);
    }
  } else {
    if (len > 0) {
      node.children.forEach(n => {
        if (n.key === key) {
          searchNode(n, n.key);
        } else {
          searchNode(n, key);
        }
      });
    }
  }
  return ts;
};
