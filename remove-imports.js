const main = () => {
  const fileHolders = getFileHolders();
  let blocksRemoved = 0;
  fileHolders.forEach((holder) => {
    if (!isCollapsed(holder) &&
        !hasModifiedNonImport(holder)) {
      holder.remove()
      blocksRemoved++;
    }    
  });
  injectBlocksRemoved(blocksRemoved);
}

const isCollapsed = (elem) => {
//  console.log("isCollapsed")
  return elem.getElementsByClassName('loading').length > 0
}

const getFileHolders = () => {
//  console.log("getFileHolders")
  return Array.from(document.getElementsByClassName('file-holder'));
}

const getCommitSummary = () => {
//  console.log("getCommitSummary")
  return document.getElementsByClassName('commit-stat-summary')[0];
}

const hasModifiedNonImport = (elem) => {
//  console.log("hasModifiedNonImport")
  if (!isLineHolder(elem)) {
    if (elem.children === undefined) {
      return false;
    }
    const children = Array.from(elem.children);
    for (const child in children) {
      if (hasModifiedNonImport(children[child])) {
        return true;
      }
    }
    return false;
  }

  if (isModifiedLineHolder(elem)) {
    return !isImportOrPackage(elem);
  }
}

const isLineHolder = (elem) => {
//  console.log("isLineHolder")
  return elem.classList != undefined &&
    elem.classList.contains('line_holder');
}

const isModifiedLineHolder = (elem) => {
//  console.log("isModifiedLineHolder")
  return isLineHolder(elem) &&
  (elem.classList.contains('old') ||
  elem.classList.contains('new'))
}

const isImportOrPackage = (lineHolder) => {
//  console.log("isImportOrPackage")
  const imp = Array.from(lineHolder.getElementsByClassName('kn'))
  if (imp.length == 0) return false;
  const text = imp[0].innerHTML;
  return text === 'import' || text === 'package';
}

const injectBlocksRemoved = (blocksRemoved) => {
//  console.log("injectBlocksRemoved")
  let changed = document.getElementById('injected')
  if (changed === null) {
    const lineBreaker = document.createElement('p')
    changed = document.createElement('strong')
    changed.className = 'cgreen'
    changed.id = 'injected'
    lineBreaker.appendChild(changed)
    getCommitSummary().appendChild(lineBreaker);
  }
  changed.innerHTML = "\n" + blocksRemoved + " Import Only Blocks Removed"
}

main();
