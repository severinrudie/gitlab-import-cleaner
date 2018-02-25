const main = () => {
  console.log("Running main")
  const fileHolders = getFileHolders();
  console.log(fileHolders)
  let blocksRemoved = 0;
  fileHolders.forEach((holder) => {
    if (!hasModifiedNonImport(holder)) {
      holder.remove()
      blocksRemoved++;
    }    
  });
  injectBlocksRemoved(blocksRemoved);
}

const getFileHolders = () => {
  return Array.from(document.getElementsByClassName('file-holder'));
}

const getCommitSummary = () => {
  return document.getElementsByClassName('commit-stat-summary')[0];
}

const hasModifiedNonImport = (elem) => {
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
    return !isImportStatement(elem);
  }
}

const isLineHolder = (elem) => {
  return elem.classList != undefined &&
    elem.classList.contains('line_holder');
}

const isModifiedLineHolder = (elem) => {
  return isLineHolder(elem) &&
  (elem.classList.contains('old') ||
  elem.classList.contains('new'))
}

const isImportStatement = (lineHolder) => {
  const imp = Array.from(lineHolder.getElementsByClassName('kn'))
  return imp.length > 0 &&
        imp[0].innerHTML === "import"
}

const injectBlocksRemoved = (blocksRemoved) => {
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

console.log('executing script (maybe)')
main();
