
export function transitionToEntry(currentState, entry) {
  let { entries, position } = currentState;

  let already = entries.findIndex((state) => state.uuid === entry.uuid);

  if (already >= 0) {
    return {
      entries,
      position: already
    };
  } else {
    entries = entries.slice(0, position + 1).concat(entry);
    return {
      entries,
      position: entries.length - 1
    };
  }
}

export function replaceEntry(currentState, entry) {
  let { entries, position } = currentState;
  entries = entries.slice(0, position).concat(entry);
  return {
    entries,
    position
  };
}

export function restoreState(loadedState, entry) {
  let position = loadedState.entries.findIndex((state) => state.uuid === entry.uuid);

  if (position >= 0) {
    return {
      entries: loadedState.entries,
      position
    };
  } else {
    return {
      entries: [entry],
      position: 0
    };
  }
}
