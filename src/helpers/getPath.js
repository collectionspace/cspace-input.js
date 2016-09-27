export default function getPath(props, context) {
  let defaultSubpath;
  let parentPath;

  if (context) {
    defaultSubpath = context.defaultSubpath;
    parentPath = context.parentPath;
  }

  let subpath = props.subpath;

  if (typeof subpath === 'undefined') {
    subpath = defaultSubpath;
  }

  const path = [];

  if (parentPath) {
    Array.prototype.push.apply(path, parentPath);
  }

  if (subpath) {
    if (Array.isArray(subpath)) {
      Array.prototype.push.apply(path, subpath);
    } else {
      path.push(subpath);
    }
  }

  if (props.name) {
    path.push(props.name);
  }

  return path;
}
